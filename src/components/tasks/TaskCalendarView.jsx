import { format } from 'date-fns'
import { useTaskStore } from '../../state/useTaskStore.js'
import { buildMonthGrid, tasksByDate } from '../../domain/calendar.js'

export default function TaskCalendarView({ year, month }) {
  const tasks = useTaskStore((s) => s.tasks)
  const grid = buildMonthGrid(year, month)
  const byDate = tasksByDate(tasks)

  return (
    <table>
      <tbody>
        {grid.map((week, i) => (
          <tr key={i}>
            {week.map((day) => {
              const key = format(day, 'yyyy-MM-dd')
              return (
                <td key={key} data-testid={`calendar-day-${key}`}>
                  <div>{format(day, 'd')}</div>
                  {(byDate[key] ?? []).map((t) => <div key={t.id}>{t.title}</div>)}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
