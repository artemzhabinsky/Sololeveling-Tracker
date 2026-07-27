import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/dataService.js', () => ({
  writeRow: vi.fn().mockResolvedValue({ ok: true, offline: false }),
  readTable: vi.fn().mockResolvedValue([]),
}))

const awardXp = vi.fn().mockResolvedValue({ leveledUp: true, level: 2 })
const awardCoins = vi.fn().mockResolvedValue(undefined)
const incrementAttribute = vi.fn().mockResolvedValue(undefined)

vi.mock('./useProfileStore.js', () => ({
  useProfileStore: { getState: () => ({ awardXp, awardCoins, incrementAttribute }) },
}))

import { writeRow } from '../services/dataService.js'
import { useProfileStore } from './useProfileStore.js'
import { useTaskStore } from './useTaskStore.js'

describe('useTaskStore', () => {
  beforeEach(() => {
    useTaskStore.setState(useTaskStore.getInitialState())
    vi.clearAllMocks()
  })

  it('createTask looks up the reward and persists a todo task', async () => {
    await useTaskStore.getState().createTask({ title: 'Отжаться', category: 'physical', rank: 'D', dueDate: null })
    const task = useTaskStore.getState().tasks[0]
    expect(task).toMatchObject({ title: 'Отжаться', category: 'physical', rank: 'D', xp_reward: 100, coin_reward: 20, status: 'todo' })
    expect(writeRow).toHaveBeenCalledWith('tasks', expect.objectContaining({ xp_reward: 100 }))
  })

  it('completeTask awards xp/coins/attribute and logs analytics', async () => {
    await useTaskStore.getState().createTask({ title: 'Отжаться', category: 'physical', rank: 'D', dueDate: null })
    const id = useTaskStore.getState().tasks[0].id
    const profileActions = useProfileStore.getState()

    const result = await useTaskStore.getState().completeTask(id)

    expect(result).toEqual({ leveledUp: true, level: 2 })
    expect(profileActions.awardXp).toHaveBeenCalledWith(100)
    expect(profileActions.awardCoins).toHaveBeenCalledWith(20)
    expect(profileActions.incrementAttribute).toHaveBeenCalledWith('attr_str', 100)
    expect(useTaskStore.getState().tasks[0].status).toBe('done')
    expect(writeRow).toHaveBeenCalledWith('analytics_logs', expect.objectContaining({ tasks_completed: 1 }))
  })

  it('deleteTask removes the task and persists', async () => {
    await useTaskStore.getState().createTask({ title: 'Отжаться', category: 'physical', rank: 'D', dueDate: null })
    const id = useTaskStore.getState().tasks[0].id
    await useTaskStore.getState().deleteTask(id)
    expect(useTaskStore.getState().tasks).toHaveLength(0)
  })
})
