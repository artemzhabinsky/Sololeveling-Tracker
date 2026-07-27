import { describe, it, expect } from 'vitest'
import { columnsFromTasks, moveTask } from './kanban.js'

describe('columnsFromTasks', () => {
  it('groups tasks by status into 3 columns', () => {
    const tasks = [
      { id: '1', status: 'todo' }, { id: '2', status: 'in_progress' },
      { id: '3', status: 'done' }, { id: '4', status: 'todo' },
    ]
    expect(columnsFromTasks(tasks)).toEqual({
      todo: [{ id: '1', status: 'todo' }, { id: '4', status: 'todo' }],
      in_progress: [{ id: '2', status: 'in_progress' }],
      done: [{ id: '3', status: 'done' }],
    })
  })

  it('does not mutate the input array', () => {
    const tasks = [{ id: '1', status: 'todo' }, { id: '2', status: 'in_progress' }]
    const snapshot = JSON.parse(JSON.stringify(tasks))
    columnsFromTasks(tasks)
    expect(tasks).toEqual(snapshot)
  })
})

describe('moveTask', () => {
  it('returns a new array with the task moved to the new status', () => {
    const tasks = [{ id: '1', status: 'todo' }, { id: '2', status: 'todo' }]
    const result = moveTask(tasks, '1', 'in_progress')
    expect(result).toEqual([{ id: '1', status: 'in_progress' }, { id: '2', status: 'todo' }])
  })

  it('does not mutate the input array', () => {
    const tasks = [{ id: '1', status: 'todo' }, { id: '2', status: 'todo' }]
    const snapshot = JSON.parse(JSON.stringify(tasks))
    moveTask(tasks, '1', 'in_progress')
    expect(tasks).toEqual(snapshot)
  })
})
