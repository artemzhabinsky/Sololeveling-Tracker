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

/* Hydrate the stores before the first render. Waiting matters: ProfileHeader
 * treats any level increase between renders as a level-up, so loading the saved
 * profile after mount would fire the celebration modal on every cold start.
 * A slow backend must not hold the UI hostage, so the wait is capped — readTable
 * falls back to the localStorage mirror anyway. */
const hydrated = Promise.allSettled([
  flushPendingSync(),
  useProfileStore.getState().loadProfile(),
  useTaskStore.getState().loadTasks(),
  useDailyQuestStore.getState().loadQuests(),
  useShopStore.getState().loadShop(),
])

const timeout = new Promise((resolve) => setTimeout(resolve, HYDRATION_TIMEOUT_MS))

Promise.race([hydrated, timeout]).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
