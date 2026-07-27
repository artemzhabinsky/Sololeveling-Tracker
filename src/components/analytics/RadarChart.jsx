import { Radar } from 'react-chartjs-2'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js'
import { radarDataFromProfile } from '../../domain/analyticsView.js'
import { baseOptions, GRID, INK, JADE, MONO } from './chartTheme.js'

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

const options = {
  ...baseOptions,
  plugins: { ...baseOptions.plugins, legend: { display: false } },
  scales: {
    r: {
      angleLines: { color: GRID },
      grid: { color: GRID },
      pointLabels: { color: INK, font: { family: MONO, size: 11 } },
      ticks: { display: false },
      beginAtZero: true,
    },
  },
}

export default function RadarChart({ profile }) {
  const { labels, values } = radarDataFromProfile(profile)
  return (
    <Radar
      options={options}
      data={{
        labels,
        datasets: [
          {
            label: 'Атрибуты',
            data: values,
            borderColor: JADE,
            backgroundColor: 'rgba(61, 220, 151, 0.18)',
            pointBackgroundColor: JADE,
            pointBorderColor: '#060b09',
            borderWidth: 2,
          },
        ],
      }}
    />
  )
}
