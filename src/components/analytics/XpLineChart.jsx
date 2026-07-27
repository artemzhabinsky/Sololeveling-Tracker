import { Line } from 'react-chartjs-2'
import { format, parseISO } from 'date-fns'
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from 'chart.js'
import { lineDataFromLogs } from '../../domain/analyticsView.js'
import { baseOptions, BLOOD, GRID, INK, JADE, MONO } from './chartTheme.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const options = {
  ...baseOptions,
  plugins: { ...baseOptions.plugins, legend: { display: false } },
  scales: {
    x: {
      grid: { color: GRID },
      border: { color: GRID },
      ticks: {
        color: INK,
        font: { family: MONO, size: 10 },
        // Labels are ISO dates; only MM-DD reads at this width.
        callback(value) {
          const label = this.getLabelForValue(value)
          return typeof label === 'string' ? label.slice(5) : label
        },
      },
    },
    y: {
      grid: { color: GRID },
      border: { color: GRID },
      ticks: { color: INK, font: { family: MONO, size: 10 }, precision: 0 },
      beginAtZero: true,
    },
  },
}

export default function XpLineChart({ logs, penaltyEvents = [], days = 7 }) {
  // format() reads local date fields; occurred_at.slice(0,10) would read the
  // UTC date instead, which can be off-by-one against analytics_logs.log_date
  // (a local-date string) near midnight in non-UTC timezones.
  const penaltyDates = penaltyEvents.map((e) => format(parseISO(e.occurred_at), 'yyyy-MM-dd'))
  const { labels, values, penaltyFlags } = lineDataFromLogs(logs, days, penaltyDates)

  return (
    <Line
      options={options}
      data={{
        labels,
        datasets: [
          {
            label: 'XP',
            data: values,
            borderColor: JADE,
            backgroundColor: 'rgba(61, 220, 151, 0.12)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            // Penalty days are flagged by colour *and* by a larger rotated
            // square, so the mark survives greyscale and colour-blind viewing.
            pointBackgroundColor: penaltyFlags.map((p) => (p ? BLOOD : JADE)),
            pointBorderColor: '#060b09',
            pointRadius: penaltyFlags.map((p) => (p ? 6 : 3)),
            pointStyle: penaltyFlags.map((p) => (p ? 'rectRot' : 'circle')),
          },
        ],
      }}
    />
  )
}
