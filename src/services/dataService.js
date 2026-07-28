import { supabase } from '../lib/supabaseClient.js'
import { getItem, setItem } from './localStore.js'
import { enqueue, replayQueue } from './syncQueue.js'

function cacheKey(table) {
  return `sololeveling:${table}`
}

function mirrorRow(table, payload) {
  const rows = getItem(cacheKey(table), [])
  const idx = rows.findIndex((r) => r.id === payload.id)
  if (idx >= 0) rows[idx] = { ...rows[idx], ...payload }
  else rows.push(payload)
  setItem(cacheKey(table), rows)
}

// Rows keyed by their primary key upsert fine on `id` alone, but a table with a
// natural unique key (analytics_logs.log_date) has no client-side id to send —
// without an explicit conflict target every write is an INSERT and the second
// one of the day dies on the unique constraint, which then jams the sync queue
// forever (replayQueue stops at the first permanent failure).
function upsertRow(table, payload, onConflict) {
  const query = supabase.from(table)
  return onConflict ? query.upsert(payload, { onConflict }) : query.upsert(payload)
}

export async function writeRow(table, payload, { onConflict } = {}) {
  const { error } = await upsertRow(table, payload, onConflict)
  mirrorRow(table, payload)

  if (error) {
    // The conflict target rides along in the queued op: replaying an
    // analytics_logs write as a plain upsert would fail for exactly the same
    // reason it was queued in the first place.
    enqueue({ table, operation: 'upsert', payload, onConflict })
    return { ok: false, offline: true }
  }

  return { ok: true, offline: false }
}

export async function readTable(table) {
  const { data, error } = await supabase.from(table).select()

  if (error || !data) {
    return getItem(cacheKey(table), [])
  }

  setItem(cacheKey(table), data)
  return data
}

export async function flushPendingSync() {
  return replayQueue(async (op) => {
    const { error } = await upsertRow(op.table, op.payload, op.onConflict)
    return !error
  })
}
