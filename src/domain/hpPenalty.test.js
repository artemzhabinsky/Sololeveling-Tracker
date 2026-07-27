import { describe, it, expect, vi } from 'vitest'
import { computeHpPenalty } from './hpPenalty.js'

describe('computeHpPenalty', () => {
  it('no-ops when lastCheckDate is today', () => {
    const result = computeHpPenalty({
      currentHp: 3, lastCheckDate: '2026-07-27', today: '2026-07-27',
      hasCompletionOnDate: () => true,
    })
    expect(result).toEqual({ hp: 3, lastCheckDate: '2026-07-27', penaltyTriggered: false })
  })

  it('deducts 1 hp for a single missed day with zero completions', () => {
    const result = computeHpPenalty({
      currentHp: 3, lastCheckDate: '2026-07-25', today: '2026-07-27',
      hasCompletionOnDate: () => false,
    })
    expect(result).toEqual({ hp: 2, lastCheckDate: '2026-07-27', penaltyTriggered: false })
  })

  it('does not deduct when the missed day had a completion', () => {
    const result = computeHpPenalty({
      currentHp: 3, lastCheckDate: '2026-07-25', today: '2026-07-27',
      hasCompletionOnDate: () => true,
    })
    expect(result).toEqual({ hp: 3, lastCheckDate: '2026-07-27', penaltyTriggered: false })
  })

  it('processes each missed day in a multi-day gap', () => {
    const hasCompletion = vi.fn((date) => date === '2026-07-25')
    const result = computeHpPenalty({
      currentHp: 3, lastCheckDate: '2026-07-24', today: '2026-07-27',
      hasCompletionOnDate: hasCompletion,
    })
    // missed days checked: 25 (completion, no penalty), 26 (no completion, -1)
    expect(result).toEqual({ hp: 2, lastCheckDate: '2026-07-27', penaltyTriggered: false })
    expect(hasCompletion).toHaveBeenCalledWith('2026-07-25')
    expect(hasCompletion).toHaveBeenCalledWith('2026-07-26')
  })

  it('stops deducting once hp reaches 0 and flags penaltyTriggered', () => {
    const result = computeHpPenalty({
      currentHp: 2, lastCheckDate: '2026-07-24', today: '2026-07-28',
      hasCompletionOnDate: () => false,
    })
    // 3 missed days (25,26,27), hp starts at 2 -> hits 0 after 2 days, third is skipped
    expect(result).toEqual({ hp: 0, lastCheckDate: '2026-07-28', penaltyTriggered: true })
  })
})
