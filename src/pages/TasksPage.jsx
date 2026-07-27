import { useSearchParams } from 'react-router-dom'
import TaskListView from '../components/tasks/TaskListView.jsx'
import TaskKanbanView from '../components/tasks/TaskKanbanView.jsx'
import TaskCalendarView from '../components/tasks/TaskCalendarView.jsx'

const TABS = [
  { key: 'list', label: 'Список' },
  { key: 'kanban', label: 'Канбан' },
  { key: 'calendar', label: 'Календарь' },
]

export default function TasksPage() {
  // The active view lives in the URL (?view=kanban) so a tab can be linked,
  // bookmarked and restored by the back button.
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('view')
  const tab = TABS.some((t) => t.key === requested) ? requested : 'list'
  const activeLabel = TABS.find((t) => t.key === tab).label
  const now = new Date()

  return (
    <section className="sys-stagger space-y-5">
      <header>
        <p className="sys-eyebrow">Журнал квестов</p>
        <h1 className="mt-2">Задачи</h1>
        <p className="mt-2 max-w-prose text-moss">
          Ранг задачи задаёт награду: E — мелочь, S — рывок уровня.
        </p>
      </header>

      {/* Plain toggle buttons rather than role="tab": the full tab pattern owes
          AT users roving tabIndex plus Arrow/Home/End handling, and announcing
          a role we do not implement is worse than not claiming it. */}
      <div
        role="group"
        aria-label="Режим отображения задач"
        className="flex gap-1 border border-edge bg-hollow p-1"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            id={`tab-${t.key}`}
            aria-pressed={tab === t.key}
            onClick={() => setSearchParams({ view: t.key }, { replace: true })}
            className="sys-tab"
          >
            {t.label}
          </button>
        ))}
      </div>

      <section aria-labelledby="tasks-view-heading" className="sys-window overflow-x-auto">
        <h2 id="tasks-view-heading" className="sr-only">
          {activeLabel}
        </h2>
        {tab === 'list' && <TaskListView />}
        {tab === 'kanban' && <TaskKanbanView />}
        {/* buildMonthGrid feeds `month` straight into new Date(y, m, 1), so it
            expects a zero-indexed month — getMonth() is already that. */}
        {tab === 'calendar' && (
          <TaskCalendarView year={now.getFullYear()} month={now.getMonth()} />
        )}
      </section>
    </section>
  )
}
