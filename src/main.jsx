import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { bootstrap } from './services/bootstrap.js'

// Hydrate stores, run the HP penalty check, and register offline-sync
// listeners before the first render so the shell paints with real data
// instead of flashing empty state. See bootstrap.js for the "why" behind
// the hydration timeout and the SystemWatcher-gated level-up celebration.
bootstrap().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
