import { describe, it, expect, beforeEach, vi } from 'vitest'
import { enqueue, getQueue, clearQueue, replayQueue } from './syncQueue.js'

describe('syncQueue', () => {
  beforeEach(() => clearQueue())

  it('enqueues operations in order', () => {
    enqueue({ table: 'tasks', operation: 'insert', payload: { id: 1 } })
    enqueue({ table: 'tasks', operation: 'insert', payload: { id: 2 } })
    expect(getQueue()).toHaveLength(2)
    expect(getQueue()[0].payload).toEqual({ id: 1 })
  })

  it('replayQueue removes entries that apply successfully, in order', async () => {
    enqueue({ table: 'tasks', operation: 'insert', payload: { id: 1 } })
    enqueue({ table: 'tasks', operation: 'insert', payload: { id: 2 } })
    const applyFn = vi.fn().mockResolvedValue(true)

    const result = await replayQueue(applyFn)

    expect(result).toEqual({ succeeded: 2, remaining: 0 })
    expect(getQueue()).toHaveLength(0)
    expect(applyFn.mock.calls[0][0].payload).toEqual({ id: 1 })
  })

  it('replayQueue stops at the first failure and leaves the remainder queued', async () => {
    enqueue({ table: 'tasks', operation: 'insert', payload: { id: 1 } })
    enqueue({ table: 'tasks', operation: 'insert', payload: { id: 2 } })
    const applyFn = vi.fn().mockResolvedValueOnce(false)

    const result = await replayQueue(applyFn)

    expect(result).toEqual({ succeeded: 0, remaining: 2 })
    expect(getQueue()).toHaveLength(2)
    expect(applyFn).toHaveBeenCalledTimes(1)
  })
})
