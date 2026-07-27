import { describe, it, expect } from 'vitest'
import { mergeAnalyticsLog } from './analyticsLog.js'

describe('mergeAnalyticsLog', () => {
  it('creates a fresh row when none exists', () => {
    const row = mergeAnalyticsLog(null, { logDate: '2026-07-27', xpGained: 50, category: 'physical' })
    expect(row).toEqual({
      log_date: '2026-07-27', xp_gained: 50, tasks_completed: 1,
      category_breakdown: { physical: 1 },
    })
  })

  it('increments an existing row', () => {
    const existing = { log_date: '2026-07-27', xp_gained: 50, tasks_completed: 1, category_breakdown: { physical: 1 } }
    const row = mergeAnalyticsLog(existing, { logDate: '2026-07-27', xpGained: 100, category: 'physical' })
    expect(row).toEqual({
      log_date: '2026-07-27', xp_gained: 150, tasks_completed: 2,
      category_breakdown: { physical: 2 },
    })
  })

  it('adds a new category key alongside existing ones', () => {
    const existing = { log_date: '2026-07-27', xp_gained: 50, tasks_completed: 1, category_breakdown: { physical: 1 } }
    const row = mergeAnalyticsLog(existing, { logDate: '2026-07-27', xpGained: 250, category: 'mental' })
    expect(row.category_breakdown).toEqual({ physical: 1, mental: 1 })
  })
})
