import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { donutDataFromLogs } from '../../domain/analyticsView.js'

Chart.register(ArcElement, Tooltip, Legend)

export default function CategoryDonutChart({ logs }) {
  const { labels, values } = donutDataFromLogs(logs)
  return <Doughnut data={{ labels, datasets: [{ data: values }] }} />
}
