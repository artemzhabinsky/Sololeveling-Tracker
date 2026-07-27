import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

const baseProfile = {
  level: 1, xp: 40, coins: 15, hp: 2,
  attr_str: 0, attr_int: 0, attr_vit: 0, attr_gold: 0, attr_disc: 0,
  loaded: true,
}

vi.mock('../../state/useProfileStore.js', () => ({
  useProfileStore: (selector) => selector(mockState),
}))

let mockState

import ProfileHeader from './ProfileHeader.jsx'

describe('ProfileHeader', () => {
  it('renders hp hearts, level, coins, and an xp progress bar', () => {
    mockState = { ...baseProfile }
    render(<ProfileHeader />)
    expect(screen.getByTestId('hp-hearts')).toHaveTextContent('♥♥♡')
    expect(screen.getByText(/15/)).toBeInTheDocument() // coins
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40')
  })

  it('names the rank for the current level', () => {
    mockState = { ...baseProfile, level: 5 }
    render(<ProfileHeader />)
    expect(screen.getByText(/Собиратель Мелких Скидок/)).toBeInTheDocument()
  })

  // Announcing level-ups and penalties is SystemWatcher's job — it stays mounted
  // on every route, while this component only exists on the dashboard.
  it('renders no overlays of its own', () => {
    mockState = { ...baseProfile, hp: 0 }
    render(<ProfileHeader />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})
