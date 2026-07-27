import { Routes, Route, NavLink } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import SystemWatcher from './components/profile/SystemWatcher.jsx'

/* Nav glyphs: four 16px marks built from the same chamfered geometry as the
 * panels, so the rail reads as part of the System rather than a stock icon set. */
function StatusGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
      <path d="M4 1h11v11l-3 3H1V4z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 8.5l2 2 4-4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function QuestGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
      <path d="M1 3h5M1 8h9M1 13h6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 11l2 2 1.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function CoinGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
      <path d="M5 1h9v9l-4 4H1V5z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.5 5.5h-1a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-1" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  )
}

function ChartGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0">
      <path d="M1 15V1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1 15h14" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 12V8M8 12V4M12 12V6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

const NAV_ITEMS = [
  { to: '/', label: 'Дашборд', Glyph: StatusGlyph },
  { to: '/tasks', label: 'Задачи', Glyph: QuestGlyph },
  { to: '/shop', label: 'Магазин', Glyph: CoinGlyph },
  { to: '/analytics', label: 'Аналитика', Glyph: ChartGlyph },
]

export default function App() {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100
                   focus:bg-jade focus:px-4 focus:py-2 focus:font-mono focus:text-hud
                   focus:uppercase focus:tracking-[0.14em] focus:text-abyss"
      >
        К содержимому
      </a>

      {/* Bottom bar on phones, left rail from lg up — one nav, two layouts. */}
      <nav
        aria-label="Разделы"
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-edge bg-hollow/95 pb-[env(safe-area-inset-bottom)]
                   backdrop-blur-sm lg:sticky lg:top-0 lg:inset-x-auto lg:h-dvh lg:flex-col lg:items-stretch
                   lg:gap-1 lg:border-t-0 lg:border-r lg:bg-hollow lg:py-6 lg:pb-6"
      >
        <div className="hidden lg:block px-4 pb-6">
          <p className="sys-eyebrow">Система</p>
          <p className="mt-2 font-display text-lg font-extrabold uppercase leading-none tracking-tight text-bone">
            Sololeveling
          </p>
          <p className="mt-1 font-mono text-hud uppercase tracking-[0.22em] text-jade">Tracker v1</p>
        </div>

        {NAV_ITEMS.map(({ to, label, Glyph }) => (
          <NavLink key={to} to={to} end={to === '/'} className="sys-nav-link">
            <Glyph />
            <span>{label}</span>
          </NavLink>
        ))}

        <p className="mt-auto hidden px-4 pt-6 font-mono text-hud uppercase tracking-[0.18em] text-ash lg:block">
          Подключение <span className="text-jade">активно</span>
        </p>
      </nav>

      <main
        id="main"
        className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:py-8"
      >
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>

      {/* Outside <Routes> so a level gained on any page is still announced, and
          so its "already seen this level" baseline survives navigation. */}
      <SystemWatcher />
    </div>
  )
}
