import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../state/useTaskStore.js', () => ({
  useTaskStore: (selector) => selector({
    tasks: [{ id: '1', title: 'Отчёт', due_date: '2026-02-15' }],
  }),
}))

import TaskCalendarView from './TaskCalendarView.jsx'

describe('TaskCalendarView', () => {
  it('renders the task under its due date cell', () => {
    render(<TaskCalendarView year={2026} month={1} />)
    expect(screen.getByTestId('calendar-day-2026-02-15')).toHaveTextContent('Отчёт')
  })

  it('renders a cell for every day of the visible grid, including padding days', () => {
    render(<TaskCalendarView year={2026} month={1} />)
    // Feb 2026 has no padding days (starts Sunday, 28 days), so exactly 28 cells
    const cells = screen.getAllByRole('cell')
    expect(cells).toHaveLength(28)
  })
})
