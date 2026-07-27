import { create } from 'zustand'
import { writeRow, readTable } from '../services/dataService.js'
import { applyXp } from '../domain/xp.js'
import { SUPABASE_PROFILE_ID } from '../lib/supabaseClient.js'

const initialState = {
  level: 1, xp: 0, coins: 0, hp: 3,
  attr_str: 0, attr_int: 0, attr_vit: 0, attr_gold: 0, attr_disc: 0,
  lastHpCheckDate: null,
  loaded: false,
}

function persist(state) {
  return writeRow('profiles', {
    id: SUPABASE_PROFILE_ID,
    level: state.level, xp: state.xp, coins: state.coins, hp: state.hp,
    attr_str: state.attr_str, attr_int: state.attr_int, attr_vit: state.attr_vit,
    attr_gold: state.attr_gold, attr_disc: state.attr_disc,
    last_hp_check_date: state.lastHpCheckDate,
  })
}

export const useProfileStore = create((set, get) => ({
  ...initialState,

  async loadProfile() {
    const rows = await readTable('profiles')
    const row = rows.find((r) => r.id === SUPABASE_PROFILE_ID) ?? rows[0]
    if (row) {
      set({
        level: row.level, xp: row.xp, coins: row.coins, hp: row.hp,
        attr_str: row.attr_str, attr_int: row.attr_int, attr_vit: row.attr_vit,
        attr_gold: row.attr_gold, attr_disc: row.attr_disc,
        lastHpCheckDate: row.last_hp_check_date,
        loaded: true,
      })
    }
  },

  async awardXp(amount) {
    const { level, xp } = get()
    const result = applyXp({ level, xp }, amount)
    set({ level: result.level, xp: result.xp })
    await persist(get())
    return { leveledUp: result.leveledUp, level: result.level }
  },

  async awardCoins(amount) {
    set((s) => ({ coins: s.coins + amount }))
    await persist(get())
  },

  async spendCoins(amount) {
    if (get().coins < amount) return false
    set((s) => ({ coins: s.coins - amount }))
    await persist(get())
    return true
  },

  async incrementAttribute(attr, amount) {
    set((s) => ({ [attr]: s[attr] + amount }))
    await persist(get())
  },

  async setHpAndCheckDate({ hp, lastHpCheckDate }) {
    set({ hp, lastHpCheckDate })
    await persist(get())
  },

  async applyPenaltyReset() {
    set({
      level: 1, xp: 0, coins: 0, hp: 3,
      attr_str: 0, attr_int: 0, attr_vit: 0, attr_gold: 0, attr_disc: 0,
    })
    await persist(get())
    await writeRow('system_events', { event_type: 'penalty_reset', occurred_at: new Date().toISOString() })
  },
}))
