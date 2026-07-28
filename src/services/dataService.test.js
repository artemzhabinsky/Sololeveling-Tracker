import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clearQueue, getQueue } from './syncQueue.js'
import { setItem, getItem } from './localStore.js'

vi.mock('../lib/supabaseClient.js', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from '../lib/supabaseClient.js'
import { writeRow, readTable, flushPendingSync } from './dataService.js'

describe('dataService', () => {
  beforeEach(() => {
    clearQueue()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('writeRow upserts to Supabase and mirrors to LocalStorage on success', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null })
    supabase.from.mockReturnValue({ upsert })

    const result = await writeRow('tasks', { id: '1', title: 'Test' })

    expect(result).toEqual({ ok: true, offline: false })
    expect(upsert).toHaveBeenCalledWith({ id: '1', title: 'Test' })
    // No second argument at all when no conflict target is given — the plain
    // call shape every other store still relies on.
    expect(upsert.mock.calls[0]).toHaveLength(1)
    expect(getItem('sololeveling:tasks', [])).toEqual([{ id: '1', title: 'Test' }])
    expect(getQueue()).toHaveLength(0)
  })

  it('writeRow forwards an onConflict target to the upsert when one is given', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null })
    supabase.from.mockReturnValue({ upsert })

    await writeRow('analytics_logs', { log_date: '2026-07-27', xp_gained: 100 }, { onConflict: 'log_date' })

    expect(upsert).toHaveBeenCalledWith(
      { log_date: '2026-07-27', xp_gained: 100 },
      { onConflict: 'log_date' },
    )
  })

  it('writeRow replays a queued write against its original conflict target', async () => {
    const failingUpsert = vi.fn().mockResolvedValue({ error: new Error('down') })
    supabase.from.mockReturnValue({ upsert: failingUpsert })
    await writeRow('analytics_logs', { log_date: '2026-07-27' }, { onConflict: 'log_date' })

    const upsert = vi.fn().mockResolvedValue({ error: null })
    supabase.from.mockReturnValue({ upsert })
    const result = await flushPendingSync()

    expect(result).toEqual({ succeeded: 1, remaining: 0 })
    expect(upsert).toHaveBeenCalledWith({ log_date: '2026-07-27' }, { onConflict: 'log_date' })
  })

  it('writeRow falls back to the queue when Supabase errors', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: new Error('network') })
    supabase.from.mockReturnValue({ upsert })

    const result = await writeRow('tasks', { id: '1', title: 'Test' })

    expect(result).toEqual({ ok: false, offline: true })
    expect(getQueue()).toHaveLength(1)
    expect(getQueue()[0]).toMatchObject({ table: 'tasks', operation: 'upsert', payload: { id: '1', title: 'Test' } })
    expect(getItem('sololeveling:tasks', [])).toEqual([{ id: '1', title: 'Test' }])
  })

  it('readTable returns Supabase data on success', async () => {
    const select = vi.fn().mockResolvedValue({ data: [{ id: '1' }], error: null })
    supabase.from.mockReturnValue({ select })

    const result = await readTable('tasks')

    expect(result).toEqual([{ id: '1' }])
    expect(getItem('sololeveling:tasks', [])).toEqual([{ id: '1' }])
  })

  it('readTable falls back to the LocalStorage snapshot on failure', async () => {
    setItem('sololeveling:tasks', [{ id: 'cached' }])
    const select = vi.fn().mockResolvedValue({ data: null, error: new Error('network') })
    supabase.from.mockReturnValue({ select })

    const result = await readTable('tasks')

    expect(result).toEqual([{ id: 'cached' }])
  })

  it('flushPendingSync replays queued writes against Supabase', async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null })
    supabase.from.mockReturnValue({ upsert })
    await writeRow('tasks', { id: '1' }) // succeeds
    const failingUpsert = vi.fn().mockResolvedValue({ error: new Error('down') })
    supabase.from.mockReturnValue({ upsert: failingUpsert })
    await writeRow('tasks', { id: '2' }) // queued
    supabase.from.mockReturnValue({ upsert })

    const result = await flushPendingSync()

    expect(result).toEqual({ succeeded: 1, remaining: 0 })
  })
})
