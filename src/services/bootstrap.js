import { format } from 'date-fns'
import { useProfileStore } from '../state/useProfileStore.js'
import { useTaskStore } from '../state/useTaskStore.js'
import { useDailyQuestStore } from '../state/useDailyQuestStore.js'
import { useShopStore } from '../state/useShopStore.js'
import { computeHpPenalty } from '../domain/hpPenalty.js'
import { flushPendingSync } from './dataService.js'

const HYDRATION_TIMEOUT_MS = 2500

function todayISO() {
  return format(new Date(), 'yyyy-MM-dd')
}

export async function bootstrap(today = todayISO()) {
  // A slow/unreachable backend must not hold the UI hostage -- readTable
  // already falls back to the LocalStorage mirror, so racing against a
  // timeout just caps how long the first paint waits for it.
  const hydrated = Promise.allSettled([
    flushPendingSync(),
    useProfileStore.getState().loadProfile(),
    useTaskStore.getState().loadTasks(),
    useDailyQuestStore.getState().loadQuests(),
    useShopStore.getState().loadShop(),
  ])

  let timeoutId
  const timeout = new Promise((resolve) => {
    timeoutId = setTimeout(resolve, HYDRATION_TIMEOUT_MS)
  })
  hydrated.finally(() => clearTimeout(timeoutId))

  await Promise.race([hydrated, timeout])

  const profile = useProfileStore.getState()
  const dailyQuests = useDailyQuestStore.getState()
  const penaltyResult = computeHpPenalty({
    currentHp: profile.hp,
    lastCheckDate: profile.lastHpCheckDate,
    today,
    hasCompletionOnDate: dailyQuests.hasCompletionOnDate,
  })
  await profile.setHpAndCheckDate({ hp: penaltyResult.hp, lastHpCheckDate: penaltyResult.lastCheckDate })

  window.addEventListener('online', () => flushPendingSync())
}
