/* Chart.js styling for the System Terminal design system.
 * Mirrors the tokens in src/index.css so the charts sit inside a `.sys-window`
 * without looking like a third-party widget. */

export const INK = '#9bafa4'
export const GRID = '#1f2e27'
export const JADE = '#3ddc97'
export const GOLD = '#f5b841'
export const BLOOD = '#ff5468'
export const ICE = '#6fd3e8'
export const LIME = '#b7e36b'

/* Five hues for five task categories — distinguishable on the bog-ink ground
 * without repeating a hue between adjacent arcs. */
export const CATEGORY_COLORS = [JADE, GOLD, ICE, BLOOD, LIME]

export const MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace"

/* Fills the fixed-height wrapper the pages provide instead of forcing a ratio. */
export const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  font: { family: MONO, size: 11 },
  plugins: {
    legend: {
      labels: { color: INK, font: { family: MONO, size: 11 }, boxWidth: 10, boxHeight: 10 },
    },
    tooltip: {
      backgroundColor: '#0a110e',
      borderColor: GRID,
      borderWidth: 1,
      titleColor: '#e7efea',
      bodyColor: INK,
      titleFont: { family: MONO, size: 11 },
      bodyFont: { family: MONO, size: 11 },
      padding: 10,
      displayColors: true,
    },
  },
}
