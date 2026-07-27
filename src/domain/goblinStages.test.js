import { describe, it, expect } from 'vitest'
import { STAGES, getStageForLevel } from './goblinStages.js'

describe('STAGES', () => {
  it('has 7 stages covering 1 through 30+', () => {
    expect(STAGES).toHaveLength(7)
    expect(STAGES[0]).toMatchObject({ stage: 1, minLevel: 1, maxLevel: 4 })
    expect(STAGES[6]).toMatchObject({ stage: 7, minLevel: 30, maxLevel: null })
  })
})

describe('getStageForLevel', () => {
  it.each([
    [1, 1], [4, 1],
    [5, 2], [9, 2],
    [10, 3], [14, 3],
    [15, 4], [19, 4],
    [20, 5], [24, 5],
    [25, 6], [29, 6],
    [30, 7], [100, 7],
  ])('level %i maps to stage %i', (level, expected) => {
    expect(getStageForLevel(level)).toBe(expected)
  })
})
