import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { donutDataFromLogs } from '../../domain/analyticsView.js'
import { CATEGORIES } from '../../domain/categories.js'
import { baseOptions, CATEGORY_COLORS } from './chartTheme.js'

Chart.register(ArcElement, Tooltip, Legend)

const options = {
  ...baseOptions,
  cutout: '62%',
  plugins: {
    ...baseOptions.plugins,
    legend: { ...baseOptions.plugins.legend, position: 'bottom' },
  },
}

export default function CategoryDonutChart({ logs, days = 7 }) {
  // Scoped to the same period the line chart plots — see donutDataFromLogs.
  const { labels, values } = donutDataFromLogs(logs, days)
  // Logs store category keys; the legend shows the human labels.
  const legendLabels = labels.map((key) => CATEGORIES.find((c) => c.key === key)?.label ?? key)

  return (
    <Doughnut
      options={options}
      data={{
        labels: legendLabels,
        datasets: [
          {
            data: values,
            backgroundColor: CATEGORY_COLORS,
            borderColor: '#0a110e',
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      }}
    />
  )
}
