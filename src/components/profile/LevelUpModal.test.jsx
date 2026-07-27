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
})
