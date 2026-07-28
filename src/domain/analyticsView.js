import { subDays, format, parseISO } from 'date-fns'

export function radarDataFromProfile(profile) {
  return {
    labels: ['STR', 'INT', 'VIT', 'GOLD', 'DISC'],
    values: [profile.attr_str, profile.attr_int, profile.attr_vit, profile.attr_gold, profile.attr_disc],
  }
}

export function lineDataFromLogs(logs, days, penaltyDates = [], today = format(new Date(), 'yyyy-MM-dd')) {
  const byDate = Object.fromEntries(logs.map((l) => [l.log_date, l.xp_gained]))
  const penaltySet = new Set(penaltyDates)
  const labels = []
  for (let i = days - 1; i >= 0; i--) {
    labels.push(format(subDays(parseISO(today), i), 'yyyy-MM-dd'))
  }
  return {
    labels,
    values: labels.map((d) => byDate[d] ?? 0),
    penaltyFlags: labels.map((d) => penaltySet.has(d)),
  }
}

/**
 * Category shares for the selected period — the last `days` days inclusive of
 * `today`, matching the window lineDataFromLogs plots. Summing all history
 * instead would make the donut drift towards whatever the player did most of,
 * ever, rather than the week being reviewed.
 *
 * log_date is a plain 'yyyy-MM-dd' string and analytics_logs holds exactly one
 * row per day, so lexicographic comparison is the same as chronological.
 */
export function donutDataFromLogs(logs, days = 7, today = format(new Date(), 'yyyy-MM-dd')) {
  const from = format(subDays(parseISO(today), days - 1), 'yyyy-MM-dd')
  const windowed = logs.filter((l) => l.log_date >= from && l.log_date <= today)

  const totals = {}
  for (const log of windowed) {
    for (const [category, count] of Object.entries(log.category_breakdown ?? {})) {
      totals[category] = (totals[category] ?? 0) + count
    }
  }
  return { labels: Object.keys(totals), values: Object.values(totals) }
}
