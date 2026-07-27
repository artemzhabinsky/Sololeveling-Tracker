import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

export function buildMonthGrid(year, month) {
  const firstDay = startOfMonth(new Date(year, month, 1))
  const lastDay = endOfMonth(firstDay)
  const gridStart = startOfWeek(firstDay)
  const gridEnd = endOfWeek(lastDay)
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

export function tasksByDate(tasks) {
  return tasks.reduce((acc, task) => {
    if (!task.due_date) return acc
    if (!acc[task.due_date]) acc[task.due_date] = []
    acc[task.due_date].push(task)
    return acc
  }, {})
}
