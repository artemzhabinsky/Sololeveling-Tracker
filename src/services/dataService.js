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

export async function writeRow(table, payload) {
  const { error } = await supabase.from(table).upsert(payload)
  mirrorRow(table, payload)

  if (error) {
    enqueue({ table, operation: 'upsert', payload })
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
    const { error } = await supabase.from(op.table).upsert(op.payload)
    return !error
  })
}
