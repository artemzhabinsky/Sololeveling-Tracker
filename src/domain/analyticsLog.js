export function mergeAnalyticsLog(existingRow, { logDate, xpGained, category }) {
  const base = existingRow ?? { log_date: logDate, xp_gained: 0, tasks_completed: 0, category_breakdown: {} }
  return {
    log_date: logDate,
    xp_gained: base.xp_gained + xpGained,
    tasks_completed: base.tasks_completed + 1,
    category_breakdown: {
      ...base.category_breakdown,
      [category]: (base.category_breakdown[category] ?? 0) + 1,
    },
  }
}
