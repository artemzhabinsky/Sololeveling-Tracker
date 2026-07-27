import { format, isSameMonth, isToday } from 'date-fns'
import { useTaskStore } from '../../state/useTaskStore.js'
import { buildMonthGrid, tasksByDate } from '../../domain/calendar.js'

// buildMonthGrid uses date-fns startOfWeek(), which begins on Sunday.
const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

export default function TaskCalendarView({ year, month }) {
  const tasks = useTaskStore((s) => s.tasks)
  const grid = buildMonthGrid(year, month)
  const byDate = tasksByDate(tasks)
  const currentMonth = new Date(year, month, 1)

  return (
    <table className="min-w-[40rem] table-fixed">
      <thead>
        <tr>
          {WEEKDAYS.map((day) => (
            <th
              key={day}
              scope="col"
              className="pb-2 text-center font-mono text-hud font-medium uppercase tracking-[0.18em] text-ash"
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {grid.map((week, i) => (
          <tr key={i}>
            {week.map((day) => {
              const key = format(day, 'yyyy-MM-dd')
              const outside = !isSameMonth(day, currentMonth)
              return (
                <td
                  key={key}
                  data-testid={`calendar-day-${key}`}
                  className={`h-24 border border-edge p-1.5 align-top ${
                    outside ? 'bg-abyss/60 opacity-50' : 'bg-hollow/50'
                  }`}
                >
                  <div
                    className={`sys-value text-xs ${isToday(day) ? 'text-jade' : 'text-ash'}`}
                  >
                    {format(day, 'd')}
                  </div>
                  {(byDate[key] ?? []).map((t) => (
                    <div
                      key={t.id}
                      className="mt-1 truncate border-l-2 border-jade bg-raised px-1.5 py-0.5 text-xs text-bone"
                      title={t.title}
                    >
                      {t.title}
                    </div>
                  ))}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
