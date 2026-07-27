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

export function donutDataFromLogs(logs) {
  const totals = {}
  for (const log of logs) {
    for (const [category, count] of Object.entries(log.category_breakdown ?? {})) {
      totals[category] = (totals[category] ?? 0) + count
    }
  }
  return { labels: Object.keys(totals), values: Object.values(totals) }
}
