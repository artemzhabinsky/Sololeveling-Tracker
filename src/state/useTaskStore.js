import { create } from 'zustand'
import { format } from 'date-fns'
import { writeRow, readTable } from '../services/dataService.js'
import { getReward } from '../domain/rewards.js'
import { getAttrForCategory } from '../domain/categories.js'
import { mergeAnalyticsLog } from '../domain/analyticsLog.js'
import { useProfileStore } from './useProfileStore.js'
import { playTaskComplete } from '../audio/sfx.js'

function todayISO() {
  return format(new Date(), 'yyyy-MM-dd')
}

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loaded: false,

  async loadTasks() {
    const tasks = await readTable('tasks')
    set({ tasks: tasks.filter((t) => !t.deleted_at), loaded: true })
  },

  async createTask({ title, category, rank, dueDate }) {
    const reward = getReward(rank)
    const task = {
      id: crypto.randomUUID(),
      title, category, rank,
      xp_reward: reward.xp, coin_reward: reward.coins,
      status: 'todo', due_date: dueDate, completed_at: null,
    }
    set((s) => ({ tasks: [...s.tasks, task] }))
    await writeRow('tasks', task)
  },

  async updateStatus(id, status) {
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }))
    const task = get().tasks.find((t) => t.id === id)
    await writeRow('tasks', task)
  },

  async completeTask(id) {
    const task = get().tasks.find((t) => t.id === id)
    // Completing an already-done task would award its XP/coins/attributes a
    // second time. The Kanban board can drop a card onto the column it already
    // sits in, so this is reachable, not just defensive.
    if (!task || task.status === 'done') {
      return { leveledUp: false, level: useProfileStore.getState().level }
    }

    const completedAt = new Date().toISOString()
    const updated = { ...task, status: 'done', completed_at: completedAt }
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }))
    playTaskComplete()
    await writeRow('tasks', updated)

    const profile = useProfileStore.getState()
    const levelResult = await profile.awardXp(task.xp_reward)
    await profile.awardCoins(task.coin_reward)
    await profile.incrementAttribute(getAttrForCategory(task.category), task.xp_reward)

    const logDate = todayISO()
    const existingLogs = await readTable('analytics_logs')
    const existingRow = existingLogs.find((r) => r.log_date === logDate) ?? null
    const mergedLog = mergeAnalyticsLog(existingRow, { logDate, xpGained: task.xp_reward, category: task.category })
    // mergeAnalyticsLog produces no id, so Supabase needs the natural key to
    // recognise today's row — otherwise the day's second completion collides
    // with the unique log_date index.
    await writeRow('analytics_logs', mergedLog, { onConflict: 'log_date' })

    return levelResult
  },

  async deleteTask(id) {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
    // The whole row goes up, not just { id, deleted_at }: PostgREST's upsert is
    // INSERT ... ON CONFLICT, and Postgres checks NOT NULL against the proposed
    // tuple before it ever detects the conflict — a partial payload would be
    // rejected for the missing title/category/rank/reward columns.
    await writeRow('tasks', { ...task, deleted_at: new Date().toISOString() })
  },
}))
