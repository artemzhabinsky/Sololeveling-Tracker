import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../state/useTaskStore.js', () => ({
  useTaskStore: (selector) => selector({
    tasks: [
      { id: '1', title: 'Помыть посуду', status: 'todo' },
      { id: '2', title: 'Сделать отчёт', status: 'in_progress' },
      { id: '3', title: 'Спорт', status: 'done' },
    ],
    updateStatus: vi.fn(),
  }),
}))

import TaskKanbanView from './TaskKanbanView.jsx'

describe('TaskKanbanView', () => {
  it('renders each task under its column', () => {
    render(<TaskKanbanView />)
    expect(screen.getByTestId('kanban-column-todo')).toHaveTextContent('Помыть посуду')
    expect(screen.getByTestId('kanban-column-in_progress')).toHaveTextContent('Сделать отчёт')
    expect(screen.getByTestId('kanban-column-done')).toHaveTextContent('Спорт')
  })
})
