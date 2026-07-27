import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import LevelUpModal from './LevelUpModal.jsx'

describe('LevelUpModal', () => {
  it('renders nothing when closed', () => {
    render(<LevelUpModal open={false} level={5} title="Собиратель Мелких Скидок" onClose={() => {}} />)
    expect(screen.queryByText(/Собиратель Мелких Скидок/)).not.toBeInTheDocument()
  })

  it('shows the new level and title when open', () => {
    render(<LevelUpModal open={true} level={5} title="Собиратель Мелких Скидок" onClose={() => {}} />)
    expect(screen.getByText(/5/)).toBeInTheDocument()
    expect(screen.getByText('Собиратель Мелких Скидок')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(<LevelUpModal open={true} level={5} title="Собиратель Мелких Скидок" onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /продолжить|закрыть/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('portals out of its parent subtree so an ancestor cannot clip it', () => {
    const { container } = render(
      <LevelUpModal open={true} level={5} title="Собиратель Мелких Скидок" onClose={() => {}} />,
    )
    expect(container).toBeEmptyDOMElement()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('moves focus to the confirm button on open', () => {
    render(<LevelUpModal open={true} level={5} title="Собиратель Мелких Скидок" onClose={() => {}} />)
    expect(screen.getByRole('button', { name: /продолжить/i })).toHaveFocus()
  })

  it('closes on Escape', async () => {
    const onClose = vi.fn()
    render(<LevelUpModal open={true} level={5} title="Собиратель Мелких Скидок" onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('restores focus to the element that was focused before it opened', () => {
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()

    const { unmount } = render(
      <LevelUpModal open={true} level={5} title="Собиратель Мелких Скидок" onClose={() => {}} />,
    )
    expect(trigger).not.toHaveFocus()

    unmount()
    expect(trigger).toHaveFocus()
    trigger.remove()
  })
})
