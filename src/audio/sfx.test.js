import { describe, it, expect } from 'vitest'
import { playTaskComplete, playLevelUp } from './sfx.js'

describe('sfx', () => {
  it('playTaskComplete does not throw without AudioContext', () => {
    expect(() => playTaskComplete()).not.toThrow()
  })

  it('playLevelUp does not throw without AudioContext', () => {
    expect(() => playLevelUp()).not.toThrow()
  })
})
