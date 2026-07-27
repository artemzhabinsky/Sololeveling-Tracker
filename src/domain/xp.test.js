import { describe, it, expect } from 'vitest'
import { xpRequiredForLevel, applyXp } from './xp.js'

describe('xpRequiredForLevel', () => {
  it('computes floor(100 * level^1.5)', () => {
    expect(xpRequiredForLevel(1)).toBe(100)
    expect(xpRequiredForLevel(2)).toBe(282)
    expect(xpRequiredForLevel(10)).toBe(3162)
  })
})

describe('applyXp', () => {
  it('adds xp without leveling up when below threshold', () => {
    const result = applyXp({ level: 1, xp: 0 }, 50)
    expect(result).toEqual({ level: 1, xp: 50, previousLevel: 1, leveledUp: false })
  })

  it('levels up once when xp crosses the threshold', () => {
    const result = applyXp({ level: 1, xp: 90 }, 20)
    // level 1 requires 100 xp; 90+20=110 -> level 2 with 10 remainder
    expect(result).toEqual({ level: 2, xp: 10, previousLevel: 1, leveledUp: true })
  })

  it('crosses multiple levels from a single large award', () => {
    const result = applyXp({ level: 1, xp: 0 }, 500)
    // level1 needs 100 (remainder 400), level2 needs 282 (remainder 118), level3 needs 519 (118 < 519, stop)
    expect(result).toEqual({ level: 3, xp: 118, previousLevel: 1, leveledUp: true })
  })
})
