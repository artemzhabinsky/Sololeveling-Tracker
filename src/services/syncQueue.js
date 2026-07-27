import { getItem, setItem } from './localStore.js'

const QUEUE_KEY = 'sololeveling:pending_sync'

export function enqueue(op) {
  const queue = getQueue()
  queue.push(op)
  setItem(QUEUE_KEY, queue)
}

export function getQueue() {
  return getItem(QUEUE_KEY, [])
}

export function clearQueue() {
  setItem(QUEUE_KEY, [])
}

export async function replayQueue(applyFn) {
  const queue = getQueue()
  let succeeded = 0

  while (queue.length > 0) {
    const ok = await applyFn(queue[0])
    if (!ok) break
    queue.shift()
    succeeded += 1
  }

  setItem(QUEUE_KEY, queue)
  return { succeeded, remaining: queue.length }
}
