import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { bootstrap } from './services/bootstrap.js'

function render() {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

// Hydrate stores, run the HP penalty check, and register offline-sync
// listeners before the first render so the shell paints with real data
// instead of flashing empty state. See bootstrap.js for the "why" behind
// the hydration timeout and the SystemWatcher-gated level-up celebration.
//
// The catch is load-bearing, not decoration: bootstrap touches the network,
// LocalStorage and Date parsing, and an unhandled rejection anywhere in there
// used to leave the user staring at an empty <div id="root"> forever. A
// half-hydrated app on top of cached/default state is strictly better than no
// app, so rendering happens either way.
bootstrap()
  .catch((err) => {
    console.error('[sololeveling] Boot sequence failed, rendering with whatever state loaded:', err)
  })
  .then(render)
