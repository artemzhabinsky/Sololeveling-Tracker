import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const baseProfile = {
  level: 1, xp: 40, coins: 15, hp: 2,
  attr_str: 0, attr_int: 0, attr_vit: 0, attr_gold: 0, attr_disc: 0,
  loaded: true,
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
  beforeEach(() => vi.clearAllMocks())

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

  // The dashboard wraps ProfileHeader in a `.sys-window`, which clips its
  // subtree with clip-path and isolates its stacking context. Both overlays
  // have to escape that subtree or they are cropped to the panel's outline.
  it('renders both overlays outside its own subtree', () => {
    mockState = { ...baseProfile, level: 1 }
    const { container, rerender } = render(<ProfileHeader />)
    mockState = { ...baseProfile, level: 2 }
    rerender(<ProfileHeader />)
    expect(container).not.toContainElement(screen.getByRole('dialog'))

    mockState = { ...baseProfile, hp: 0 }
    rerender(<ProfileHeader />)
    expect(container).not.toContainElement(screen.getByRole('alertdialog'))
  })

  it('stays quiet when the level rises while the store is still unloaded', () => {
    mockState = { ...baseProfile, loaded: false, level: 1 }
    const { rerender } = render(<ProfileHeader />)
    mockState = { ...baseProfile, loaded: false, level: 2 }
    rerender(<ProfileHeader />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(playLevelUp).not.toHaveBeenCalled()
  })

  it('does not celebrate the level the saved profile arrives with on hydration', () => {
    mockState = { ...baseProfile, loaded: false, level: 1 }
    const { rerender } = render(<ProfileHeader />)
    mockState = { ...baseProfile, loaded: true, level: 7 }
    rerender(<ProfileHeader />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(playLevelUp).not.toHaveBeenCalled()
  })

  it('celebrates a level gained after hydration has finished', () => {
    mockState = { ...baseProfile, loaded: false, level: 1 }
    const { rerender } = render(<ProfileHeader />)
    mockState = { ...baseProfile, loaded: true, level: 7 }
    rerender(<ProfileHeader />)
    mockState = { ...baseProfile, loaded: true, level: 8 }
    rerender(<ProfileHeader />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(playLevelUp).toHaveBeenCalledTimes(1)
  })

  it('shows the penalty screen when hp reaches 0', () => {
    mockState = { ...baseProfile, hp: 0 }
    render(<ProfileHeader />)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })
})
