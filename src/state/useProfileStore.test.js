import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/dataService.js', () => ({
  writeRow: vi.fn().mockResolvedValue({ ok: true, offline: false }),
  readTable: vi.fn().mockResolvedValue([{
    id: '00000000-0000-0000-0000-000000000001', level: 1, xp: 0, coins: 0, hp: 3,
    attr_str: 0, attr_int: 0, attr_vit: 0, attr_gold: 0, attr_disc: 0,
    last_hp_check_date: '2026-07-27',
  }]),
}))

import { writeRow, readTable } from '../services/dataService.js'
import { useProfileStore } from './useProfileStore.js'

describe('useProfileStore', () => {
  beforeEach(async () => {
    useProfileStore.setState(useProfileStore.getInitialState())
    vi.clearAllMocks()
    await useProfileStore.getState().loadProfile()
  })

  it('loadProfile populates state from readTable', () => {
    expect(useProfileStore.getState().level).toBe(1)
  })

  // A brand-new user has no Supabase row and no LocalStorage cache. `loaded`
  // has to flip anyway: SystemWatcher gates level-up announcements on it, and
  // loadProfile only runs once at boot, so leaving it false would mute every
  // celebration for the whole session.
  it('loadProfile marks itself loaded even when the table comes back empty', async () => {
    useProfileStore.setState(useProfileStore.getInitialState())
    readTable.mockResolvedValueOnce([])

    await useProfileStore.getState().loadProfile()

    const state = useProfileStore.getState()
    expect(state.loaded).toBe(true)
    expect(state).toMatchObject({
      level: 1, xp: 0, coins: 0, hp: 3,
      attr_str: 0, attr_int: 0, attr_vit: 0, attr_gold: 0, attr_disc: 0,
      lastHpCheckDate: null,
    })
  })

  // An award racing ahead of hydration used to upsert the defaults over the
  // real server row, and last_hp_check_date: null would have been rejected by
  // the NOT NULL constraint — a queued write that could never succeed.
  it('does not persist anything while the store is still un-hydrated', async () => {
    useProfileStore.setState(useProfileStore.getInitialState())
    vi.clearAllMocks()

    await useProfileStore.getState().awardXp(150)
    await useProfileStore.getState().awardCoins(10)
    await useProfileStore.getState().incrementAttribute('attr_str', 5)

    expect(writeRow).not.toHaveBeenCalled()
  })

  it('awardXp adds xp, persists, and reports level-up', async () => {
    const result = await useProfileStore.getState().awardXp(150)
    expect(result).toEqual({ leveledUp: true, level: 2 })
    expect(useProfileStore.getState().xp).toBe(50)
    expect(writeRow).toHaveBeenCalledWith('profiles', expect.objectContaining({ level: 2, xp: 50 }))
  })

  it('spendCoins refuses when balance is insufficient', async () => {
    const ok = await useProfileStore.getState().spendCoins(10)
    expect(ok).toBe(false)
    expect(useProfileStore.getState().coins).toBe(0)
  })

  it('spendCoins deducts when balance is sufficient', async () => {
    useProfileStore.setState({ coins: 100 })
    const ok = await useProfileStore.getState().spendCoins(30)
    expect(ok).toBe(true)
    expect(useProfileStore.getState().coins).toBe(70)
  })

  it('incrementAttribute adds to the given attribute and persists', async () => {
    await useProfileStore.getState().incrementAttribute('attr_str', 50)
    expect(useProfileStore.getState().attr_str).toBe(50)
  })

  it('applyPenaltyReset zeroes level/xp/coins/attributes and restores hp to 3', async () => {
    useProfileStore.setState({ level: 12, xp: 400, coins: 300, attr_str: 200, hp: 0 })
    await useProfileStore.getState().applyPenaltyReset()
    const state = useProfileStore.getState()
    expect(state).toMatchObject({ level: 1, xp: 0, coins: 0, hp: 3, attr_str: 0, attr_int: 0, attr_vit: 0, attr_gold: 0, attr_disc: 0 })
    expect(writeRow).toHaveBeenCalledWith('system_events', expect.objectContaining({ event_type: 'penalty_reset' }))
  })
})
