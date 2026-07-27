import { describe, it, expect, beforeEach } from 'vitest'
import { getItem, setItem } from './localStore.js'

describe('localStore', () => {
  beforeEach(() => localStorage.clear())

  it('returns the fallback when the key is missing', () => {
    expect(getItem('missing', 'fallback')).toBe('fallback')
  })

  it('round-trips JSON values', () => {
    setItem('profile', { level: 5 })
    expect(getItem('profile', null)).toEqual({ level: 5 })
  })
})
