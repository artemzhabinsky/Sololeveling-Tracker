import { describe, it, expect } from 'vitest'
import { format } from 'date-fns'
import { buildMonthGrid, tasksByDate } from './calendar.js'

// NOTE: dates are compared via date-fns `format(date, 'yyyy-MM-dd')` (local time),
// not `.toISOString().slice(0, 10)` (UTC). `buildMonthGrid` builds Date objects at
// local midnight via `new Date(year, month, day)`; converting those to UTC before
// slicing shifts the date by a day in any timezone ahead of UTC (e.g. UTC+2), which
// would make this assertion fail even though the underlying grid is correct.
describe('buildMonthGrid', () => {
  it('builds a full-week grid for February 2026 (Sun-start weeks)', () => {
    const grid = buildMonthGrid(2026, 1) // month is 0-indexed: 1 = February
    // Feb 2026 starts on a Sunday and has 28 days -> exactly 4 weeks, no padding needed
    expect(grid).toHaveLength(4)
    expect(format(grid[0][0], 'yyyy-MM-dd')).toBe('2026-02-01')
    expect(format(grid[3][6], 'yyyy-MM-dd')).toBe('2026-02-28')
  })

  it('returns full weeks of 7 Date objects each', () => {
    const grid = buildMonthGrid(2026, 1)
    for (const week of grid) {
      expect(week).toHaveLength(7)
      for (const day of week) {
        expect(day).toBeInstanceOf(Date)
      }
    }
  })

  it('includes leading and trailing days from adjacent months when needed', () => {
    // July 2026: July 1 2026 is a Wednesday, July 31 is a Friday -> needs padding on both ends
    const grid = buildMonthGrid(2026, 6)
    expect(format(grid[0][0], 'yyyy-MM-dd')).toBe('2026-06-28') // leading day from June
    const lastWeek = grid[grid.length - 1]
    expect(format(lastWeek[lastWeek.length - 1], 'yyyy-MM-dd')).toBe('2026-08-01') // trailing day from August
  })
})

describe('tasksByDate', () => {
  it('groups tasks by their due_date', () => {
    const tasks = [
      { id: '1', due_date: '2026-07-27' },
      { id: '2', due_date: '2026-07-27' },
      { id: '3', due_date: '2026-07-28' },
      { id: '4', due_date: null },
    ]
    const result = tasksByDate(tasks)
    expect(result['2026-07-27']).toHaveLength(2)
    expect(result['2026-07-28']).toHaveLength(1)
    expect(result.null).toBeUndefined()
  })

  it('does not create an "undefined" key for missing due_date', () => {
    const tasks = [{ id: '5' }]
    const result = tasksByDate(tasks)
    expect(result.undefined).toBeUndefined()
    expect(Object.keys(result)).toHaveLength(0)
  })
})
