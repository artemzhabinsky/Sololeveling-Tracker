import { Line } from 'react-chartjs-2'
import { format, parseISO } from 'date-fns'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from 'chart.js'
import { lineDataFromLogs } from '../../domain/analyticsView.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip)

export default function XpLineChart({ logs, penaltyEvents = [], days = 7 }) {
  // format() reads local date fields; occurred_at.slice(0,10) would read the
  // UTC date instead, which can be off-by-one against analytics_logs.log_date
  // (a local-date string) near midnight in non-UTC timezones.
  const penaltyDates = penaltyEvents.map((e) => format(parseISO(e.occurred_at), 'yyyy-MM-dd'))
  const { labels, values } = lineDataFromLogs(logs, days, penaltyDates)
  return <Line data={{ labels, datasets: [{ label: 'XP', data: values }] }} />
}
