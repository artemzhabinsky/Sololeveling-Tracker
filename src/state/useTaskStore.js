import { create } from 'zustand'
import { format } from 'date-fns'
import { writeRow, readTable } from '../services/dataService.js'
import { getReward } from '../domain/rewards.js'
import { getAttrForCategory } from '../domain/categories.js'
import { mergeAnalyticsLog } from '../domain/analyticsLog.js'
import { useProfileStore } from './useProfileStore.js'

function todayISO() {
  return format(new Date(), 'yyyy-MM-dd')
}

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loaded: false,

  async loadTasks() {
    const tasks = await readTable('tasks')
    set({ tasks: tasks.filter((t) => !t._deleted), loaded: true })
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
    const completedAt = new Date().toISOString()
    const updated = { ...task, status: 'done', completed_at: completedAt }
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }))
    await writeRow('tasks', updated)

    const profile = useProfileStore.getState()
    const levelResult = await profile.awardXp(task.xp_reward)
    await profile.awardCoins(task.coin_reward)
    await profile.incrementAttribute(getAttrForCategory(task.category), task.xp_reward)

    const logDate = todayISO()
    const existingLogs = await readTable('analytics_logs')
    const existingRow = existingLogs.find((r) => r.log_date === logDate) ?? null
    const mergedLog = mergeAnalyticsLog(existingRow, { logDate, xpGained: task.xp_reward, category: task.category })
    await writeRow('analytics_logs', mergedLog)

    return levelResult
  },

  async deleteTask(id) {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
    await writeRow('tasks', { id, _deleted: true })
  },
}))
