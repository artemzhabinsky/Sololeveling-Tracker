import { describe, it, expect } from 'vitest'
import { RANKS, getRankTitle } from './ranks.js'

describe('RANKS', () => {
  it('has exactly 30 entries ordered by level', () => {
    expect(RANKS).toHaveLength(30)
    RANKS.forEach((r, i) => expect(r.level).toBe(i + 1))
  })
})

describe('getRankTitle', () => {
  it('returns the level-1 title', () => {
    expect(getRankTitle(1).title).toBe('Нищий Гоблин-Оборванец')
  })

  it('returns the level-30 title verbatim', () => {
    expect(getRankTitle(30).title).toBe('Гигачат Гоблин-Трахатель 30-го Уровня')
  })

  it('clamps levels above 30 to the level-30 title', () => {
    expect(getRankTitle(45).title).toBe('Гигачат Гоблин-Трахатель 30-го Уровня')
  })
})
