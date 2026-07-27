import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const baseProfile = {
  level: 1, xp: 40, coins: 15, hp: 2,
  attr_str: 0, attr_int: 0, attr_vit: 0, attr_gold: 0, attr_disc: 0,
  applyPenaltyReset: vi.fn(),
}

vi.mock('../../state/useProfileStore.js', () => ({
  useProfileStore: (selector) => selector(mockState),
}))

vi.mock('../../audio/sfx.js', () => ({ playLevelUp: vi.fn() }))

let mockState

import ProfileHeader from './ProfileHeader.jsx'
import { playLevelUp } from '../../audio/sfx.js'

describe('ProfileHeader', () => {
  it('renders hp hearts, level, coins, and an xp progress bar', () => {
    mockState = { ...baseProfile }
    render(<ProfileHeader />)
    expect(screen.getByTestId('hp-hearts')).toHaveTextContent('♥♥♡')
    expect(screen.getByText(/15/)).toBeInTheDocument() // coins
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
  })

  it('shows the level-up modal and plays the sfx when level increases between renders', () => {
    mockState = { ...baseProfile, level: 1 }
    const { rerender } = render(<ProfileHeader />)
    mockState = { ...baseProfile, level: 2 }
    rerender(<ProfileHeader />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(playLevelUp).toHaveBeenCalled()
  })

  it('shows the penalty screen when hp reaches 0', () => {
    mockState = { ...baseProfile, hp: 0 }
    render(<ProfileHeader />)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })
})
