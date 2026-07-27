import { describe, it, expect } from 'vitest'
import { radarDataFromProfile, lineDataFromLogs, donutDataFromLogs } from './analyticsView.js'

describe('radarDataFromProfile', () => {
  it('maps the 5 attributes to labeled values', () => {
    const profile = { attr_str: 10, attr_int: 20, attr_vit: 30, attr_gold: 40, attr_disc: 50 }
    expect(radarDataFromProfile(profile)).toEqual({
      labels: ['STR', 'INT', 'VIT', 'GOLD', 'DISC'],
      values: [10, 20, 30, 40, 50],
    })
  })
})

describe('lineDataFromLogs', () => {
  it('fills missing days with 0 and flags penalty dates', () => {
    const logs = [{ log_date: '2026-07-26', xp_gained: 150 }]
    const result = lineDataFromLogs(logs, 3, ['2026-07-25'], '2026-07-27')
    expect(result.labels).toEqual(['2026-07-25', '2026-07-26', '2026-07-27'])
    expect(result.values).toEqual([0, 150, 0])
    expect(result.penaltyFlags).toEqual([true, false, false])
  })
})

describe('donutDataFromLogs', () => {
  it('sums category_breakdown across logs', () => {
    const logs = [
      { category_breakdown: { physical: 2, mental: 1 } },
      { category_breakdown: { physical: 1, finance: 3 } },
    ]
    expect(donutDataFromLogs(logs)).toEqual({
      labels: ['physical', 'mental', 'finance'],
      values: [3, 1, 3],
    })
  })
})
