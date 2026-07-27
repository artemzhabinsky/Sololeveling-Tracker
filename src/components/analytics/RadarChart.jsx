import { Radar } from 'react-chartjs-2'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js'
import { radarDataFromProfile } from '../../domain/analyticsView.js'

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

export default function RadarChart({ profile }) {
  const { labels, values } = radarDataFromProfile(profile)
  return <Radar data={{ labels, datasets: [{ label: 'Атрибуты', data: values }] }} />
}
