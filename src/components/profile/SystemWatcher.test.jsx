import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const baseProfile = {
  level: 1, hp: 3, loaded: true,
  applyPenaltyReset: vi.fn(),
}

vi.mock('../../state/useProfileStore.js', () => ({
  useProfileStore: (selector) => selector(mockState),
}))

vi.mock('../../audio/sfx.js', () => ({ playLevelUp: vi.fn() }))

let mockState

import SystemWatcher from './SystemWatcher.jsx'
import { playLevelUp } from '../../audio/sfx.js'

describe('SystemWatcher', () => {
  beforeEach(() => vi.clearAllMocks())

  it('announces nothing while the profile is unremarkable', () => {
    mockState = { ...baseProfile }
    render(<SystemWatcher />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('shows the level-up modal and plays the sfx when level increases between renders', () => {
    mockState = { ...baseProfile, level: 1 }
    const { rerender } = render(<SystemWatcher />)
    mockState = { ...baseProfile, level: 2 }
    rerender(<SystemWatcher />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(playLevelUp).toHaveBeenCalled()
  })

  it('names the new rank in the modal', () => {
    mockState = { ...baseProfile, level: 4 }
    const { rerender } = render(<SystemWatcher />)
    mockState = { ...baseProfile, level: 5 }
    rerender(<SystemWatcher />)
    expect(screen.getByText('Собиратель Мелких Скидок')).toBeInTheDocument()
  })

  it('stays quiet when the level rises while the store is still unloaded', () => {
    mockState = { ...baseProfile, loaded: false, level: 1 }
    const { rerender } = render(<SystemWatcher />)
    mockState = { ...baseProfile, loaded: false, level: 2 }
    rerender(<SystemWatcher />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(playLevelUp).not.toHaveBeenCalled()
  })

  it('does not celebrate the level the saved profile arrives with on hydration', () => {
    mockState = { ...baseProfile, loaded: false, level: 1 }
    const { rerender } = render(<SystemWatcher />)
    mockState = { ...baseProfile, loaded: true, level: 7 }
    rerender(<SystemWatcher />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(playLevelUp).not.toHaveBeenCalled()
  })

  it('celebrates a level gained after hydration has finished', () => {
    mockState = { ...baseProfile, loaded: false, level: 1 }
    const { rerender } = render(<SystemWatcher />)
    mockState = { ...baseProfile, loaded: true, level: 7 }
    rerender(<SystemWatcher />)
    mockState = { ...baseProfile, loaded: true, level: 8 }
    rerender(<SystemWatcher />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(playLevelUp).toHaveBeenCalledTimes(1)
  })

  // The watcher never unmounts, so its baseline has to survive the re-renders a
  // route change causes: the same level must not be celebrated twice.
  it('celebrates a given level only once', async () => {
    mockState = { ...baseProfile, level: 1 }
    const { rerender } = render(<SystemWatcher />)
    mockState = { ...baseProfile, level: 2 }
    rerender(<SystemWatcher />)

    screen.getByRole('button', { name: /продолжить/i }).click()
    rerender(<SystemWatcher />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<SystemWatcher />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(playLevelUp).toHaveBeenCalledTimes(1)
  })

  it('shows the penalty screen when hp reaches 0', () => {
    mockState = { ...baseProfile, hp: 0 }
    render(<SystemWatcher />)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('renders no layout of its own — both overlays portal to the body', () => {
    mockState = { ...baseProfile, hp: 0 }
    const { container } = render(<SystemWatcher />)
    expect(container).toBeEmptyDOMElement()
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })
})
