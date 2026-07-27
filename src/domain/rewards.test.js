import { describe, it, expect } from 'vitest'
import { RANK_REWARDS, getReward } from './rewards.js'

describe('RANK_REWARDS', () => {
  it('has the 6 ranks with the spec values', () => {
    expect(RANK_REWARDS).toEqual({
      E: { xp: 50, coins: 10 },
      D: { xp: 100, coins: 20 },
      C: { xp: 250, coins: 50 },
      B: { xp: 500, coins: 100 },
      A: { xp: 1000, coins: 200 },
      S: { xp: 2500, coins: 500 },
    })
  })
})

describe('getReward', () => {
  it('returns the reward for a known rank', () => {
    expect(getReward('S')).toEqual({ xp: 2500, coins: 500 })
  })

  it('throws for an unknown rank', () => {
    expect(() => getReward('Z')).toThrow('Unknown rank: Z')
  })
})
