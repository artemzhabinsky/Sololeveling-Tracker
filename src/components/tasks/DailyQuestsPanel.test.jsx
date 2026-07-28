import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

const toggleToday = vi.fn()
const createQuest = vi.fn()
const deactivateQuest = vi.fn()

vi.mock('../../state/useDailyQuestStore.js', () => ({
  useDailyQuestStore: (selector) => selector({
    quests: [{ id: '1', title: '20 отжиманий', last_completed_date: null, is_active: true }],
    createQuest, toggleToday, deactivateQuest,
  }),
}))

import DailyQuestsPanel from './DailyQuestsPanel.jsx'

describe('DailyQuestsPanel', () => {
  it('renders quests and toggles completion for today', async () => {
    render(<DailyQuestsPanel today="2026-07-27" />)
    await userEvent.click(screen.getByRole('checkbox', { name: /20 отжиманий/i }))
    expect(toggleToday).toHaveBeenCalledWith('1', '2026-07-27')
  })

  it('submitting the add-quest form calls createQuest', async () => {
    render(<DailyQuestsPanel today="2026-07-27" />)
    await userEvent.type(screen.getByLabelText(/новый квест/i), 'Пить воду')
    await userEvent.click(screen.getByRole('button', { name: /добавить/i }))
    expect(createQuest).toHaveBeenCalledWith('Пить воду')
  })

  it('each quest row can be deactivated', async () => {
    render(<DailyQuestsPanel today="2026-07-27" />)
    await userEvent.click(screen.getByRole('button', { name: /отключить квест/i }))
    expect(deactivateQuest).toHaveBeenCalledWith('1')
  })
})
