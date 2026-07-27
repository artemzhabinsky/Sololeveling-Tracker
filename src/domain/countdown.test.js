import { describe, it, expect } from 'vitest'
import { formatRemaining } from './countdown.js'

describe('formatRemaining', () => {
  it('formats hours, minutes, and seconds', () => {
    expect(formatRemaining(2 * 3600_000 + 5 * 60_000 + 9_000)).toBe('02:05:09')
  })

  it('formats zero as 00:00:00', () => {
    expect(formatRemaining(0)).toBe('00:00:00')
  })

  it('returns "expired" for negative durations', () => {
    expect(formatRemaining(-1000)).toBe('expired')
  })
})
