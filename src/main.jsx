import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { useProfileStore } from './state/useProfileStore.js'
import { useTaskStore } from './state/useTaskStore.js'
import { useDailyQuestStore } from './state/useDailyQuestStore.js'
import { useShopStore } from './state/useShopStore.js'
import { flushPendingSync } from './services/dataService.js'

const HYDRATION_TIMEOUT_MS = 2500

/* Hydrate the stores before the first render so the shell paints with real data
 * instead of flashing empty state. Purely cosmetic: ProfileHeader gates its
 * level-up celebration on the store's `loaded` flag, so a late hydration is
 * correct either way. A slow backend must not hold the UI hostage, hence the
 * cap — readTable falls back to the localStorage mirror anyway. */
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

Promise.race([hydrated, timeout]).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
