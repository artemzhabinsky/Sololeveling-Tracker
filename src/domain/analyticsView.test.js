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
  it('sums category_breakdown across logs in the window', () => {
    const logs = [
      { log_date: '2026-07-26', category_breakdown: { physical: 2, mental: 1 } },
      { log_date: '2026-07-27', category_breakdown: { physical: 1, finance: 3 } },
    ]
    expect(donutDataFromLogs(logs, 7, '2026-07-27')).toEqual({
      labels: ['physical', 'mental', 'finance'],
      values: [3, 1, 3],
    })
  })

  // The spec scopes the donut to a period (default: the current week). Summing
  // all history instead made every slice drift towards whatever the player did
  // most of, ever, and never reflected the week actually being reviewed.
  it('defaults to the last 7 days and drops anything older', () => {
    const logs = [
      { log_date: '2026-07-27', category_breakdown: { physical: 1 } },
      { log_date: '2026-07-21', category_breakdown: { physical: 5 } }, // 7th day back — inside
      { log_date: '2026-07-20', category_breakdown: { mental: 9 } }, // 8th day back — outside
      { log_date: '2026-01-02', category_breakdown: { finance: 40 } },
    ]

    expect(donutDataFromLogs(logs, 7, '2026-07-27')).toEqual({
      labels: ['physical'],
      values: [6],
    })
  })

  it('ignores logs dated after the window (clock skew across devices)', () => {
    const logs = [
      { log_date: '2026-07-27', category_breakdown: { physical: 1 } },
      { log_date: '2026-07-30', category_breakdown: { mental: 3 } },
    ]

    expect(donutDataFromLogs(logs, 7, '2026-07-27')).toEqual({
      labels: ['physical'],
      values: [1],
    })
  })

  it('honours a wider window when one is asked for', () => {
    const logs = [
      { log_date: '2026-07-27', category_breakdown: { physical: 1 } },
      { log_date: '2026-07-20', category_breakdown: { mental: 9 } },
    ]

    expect(donutDataFromLogs(logs, 30, '2026-07-27')).toEqual({
      labels: ['physical', 'mental'],
      values: [1, 9],
    })
  })
})
