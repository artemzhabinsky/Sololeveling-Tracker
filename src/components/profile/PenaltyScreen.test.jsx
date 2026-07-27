import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import PenaltyScreen from './PenaltyScreen.jsx'

describe('PenaltyScreen', () => {
  it('renders nothing when closed', () => {
    render(<PenaltyScreen open={false} onAcknowledge={() => {}} />)
    expect(screen.queryByText(/SYSTEM PENALTY/i)).not.toBeInTheDocument()
  })

  it('shows the penalty message and triggers onAcknowledge', async () => {
    const onAcknowledge = vi.fn()
    render(<PenaltyScreen open={true} onAcknowledge={onAcknowledge} />)
    expect(screen.getByText(/SYSTEM PENALTY/i)).toBeInTheDocument()
    expect(screen.getByText(/YOU DIED/i)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button'))
    expect(onAcknowledge).toHaveBeenCalled()
  })

  it('portals out of its parent subtree so an ancestor cannot clip it', () => {
    const { container } = render(<PenaltyScreen open={true} onAcknowledge={() => {}} />)
    expect(container).toBeEmptyDOMElement()
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('moves focus to the acknowledge button on open', () => {
    render(<PenaltyScreen open={true} onAcknowledge={() => {}} />)
    expect(screen.getByRole('button')).toHaveFocus()
  })

  it('ignores Escape — the reset must be acknowledged deliberately', async () => {
    const onAcknowledge = vi.fn()
    render(<PenaltyScreen open={true} onAcknowledge={onAcknowledge} />)
    await userEvent.keyboard('{Escape}')
    expect(onAcknowledge).not.toHaveBeenCalled()
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })
})
