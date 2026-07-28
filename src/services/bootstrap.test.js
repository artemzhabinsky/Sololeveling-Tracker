import { describe, it, expect, vi, beforeEach } from 'vitest'

const loadProfile = vi.fn()
const loadTasks = vi.fn()
const loadQuests = vi.fn()
const loadShop = vi.fn()
const setHpAndCheckDate = vi.fn()
const hasCompletionOnDate = vi.fn().mockReturnValue(true)
// getState is itself a mock (not a static arrow function) so individual tests
// can override it with mockReturnValueOnce -- needed to simulate the
// un-hydrated (loaded: false) state the timeout-race test needs below.
const getProfileState = vi.fn(() => ({
  loadProfile, setHpAndCheckDate,
  hp: 3, lastHpCheckDate: '2026-07-26', loaded: true,
}))

vi.mock('../state/useProfileStore.js', () => ({
  useProfileStore: { getState: () => getProfileState() },
}))
vi.mock('../state/useTaskStore.js', () => ({ useTaskStore: { getState: () => ({ loadTasks }) } }))
vi.mock('../state/useDailyQuestStore.js', () => ({
  useDailyQuestStore: { getState: () => ({ loadQuests, hasCompletionOnDate }) },
}))
vi.mock('../state/useShopStore.js', () => ({ useShopStore: { getState: () => ({ loadShop }) } }))
vi.mock('./dataService.js', () => ({ flushPendingSync: vi.fn().mockResolvedValue(undefined) }))

import { flushPendingSync } from './dataService.js'
import { bootstrap } from './bootstrap.js'

describe('bootstrap', () => {
  beforeEach(() => vi.clearAllMocks())

  it('loads all 4 stores and flushes any pending offline writes', async () => {
    await bootstrap('2026-07-27')
    expect(loadProfile).toHaveBeenCalled()
    expect(loadTasks).toHaveBeenCalled()
    expect(loadQuests).toHaveBeenCalled()
    expect(loadShop).toHaveBeenCalled()
    expect(flushPendingSync).toHaveBeenCalled()
  })

  it('runs the HP penalty check and persists the result once hydrated', async () => {
    await bootstrap('2026-07-27')
    expect(setHpAndCheckDate).toHaveBeenCalledWith({ hp: 3, lastHpCheckDate: '2026-07-27' })
  })

  it('registers an online listener that flushes the pending sync queue', async () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    await bootstrap('2026-07-27')
    const [event, handler] = addEventListenerSpy.mock.calls.find(([e]) => e === 'online')
    expect(event).toBe('online')
    handler()
    expect(flushPendingSync).toHaveBeenCalledTimes(2) // once during bootstrap, once from the listener
  })

  it('resolves without crashing if hydration times out, and skips the penalty check', async () => {
    vi.useFakeTimers()
    loadProfile.mockReturnValue(new Promise(() => {})) // never resolves
    getProfileState.mockReturnValue({
      loadProfile, setHpAndCheckDate,
      hp: 3, lastHpCheckDate: null, loaded: false, // matches the real store's un-hydrated initialState
    })
    const done = vi.fn()
    bootstrap('2026-07-27').then(done)
    await vi.advanceTimersByTimeAsync(2500)
    expect(done).toHaveBeenCalled()
    expect(setHpAndCheckDate).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
