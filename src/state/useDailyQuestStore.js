import { create } from 'zustand'
import { writeRow, readTable } from '../services/dataService.js'

export const useDailyQuestStore = create((set, get) => ({
  quests: [],
  loaded: false,

  async loadQuests() {
    const quests = await readTable('daily_quests')
    set({ quests, loaded: true })
  },

  async createQuest(title) {
    const quest = { id: crypto.randomUUID(), title, last_completed_date: null, is_active: true }
    set((s) => ({ quests: [...s.quests, quest] }))
    await writeRow('daily_quests', quest)
  },

  async toggleToday(id, today) {
    const quest = get().quests.find((q) => q.id === id)
    const nextDate = quest.last_completed_date === today ? null : today
    const updated = { ...quest, last_completed_date: nextDate }
    set((s) => ({ quests: s.quests.map((q) => (q.id === id ? updated : q)) }))
    await writeRow('daily_quests', updated)
  },

  async deactivateQuest(id) {
    const quest = get().quests.find((q) => q.id === id)
    const updated = { ...quest, is_active: false }
    set((s) => ({ quests: s.quests.map((q) => (q.id === id ? updated : q)) }))
    await writeRow('daily_quests', updated)
  },

  hasCompletionOnDate(dateStr) {
    return get().quests.some((q) => q.last_completed_date === dateStr)
  },
}))
