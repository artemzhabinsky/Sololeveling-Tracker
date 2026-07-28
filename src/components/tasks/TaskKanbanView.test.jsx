import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const updateStatus = vi.fn()
const completeTask = vi.fn()

vi.mock('../../state/useTaskStore.js', () => ({
  useTaskStore: (selector) => selector({
    tasks: [
      { id: '1', title: 'Помыть посуду', status: 'todo' },
      { id: '2', title: 'Сделать отчёт', status: 'in_progress' },
      { id: '3', title: 'Спорт', status: 'done' },
    ],
    updateStatus,
    completeTask,
  }),
}))

// dnd-kit's pointer sensors don't work in jsdom, so the drag itself can't be
// simulated. Stubbing the context lets the test hand the component the exact
// drag-end event dnd-kit would have produced.
let dragEnd
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragEnd }) => {
    dragEnd = onDragEnd
    return children
  },
  useDraggable: () => ({ attributes: {}, listeners: {}, setNodeRef: () => {}, transform: null }),
  useDroppable: () => ({ setNodeRef: () => {} }),
}))

import TaskKanbanView from './TaskKanbanView.jsx'

describe('TaskKanbanView', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders each task under its column', () => {
    render(<TaskKanbanView />)
    expect(screen.getByTestId('kanban-column-todo')).toHaveTextContent('Помыть посуду')
    expect(screen.getByTestId('kanban-column-in_progress')).toHaveTextContent('Сделать отчёт')
    expect(screen.getByTestId('kanban-column-done')).toHaveTextContent('Спорт')
  })

  it('dropping an unfinished card into "Готово" completes it so the reward is paid', () => {
    render(<TaskKanbanView />)

    dragEnd({ active: { id: '1' }, over: { id: 'done' } })

    expect(completeTask).toHaveBeenCalledWith('1')
    expect(updateStatus).not.toHaveBeenCalled()
  })

  it('dropping a card into a non-done column just moves it', () => {
    render(<TaskKanbanView />)

    dragEnd({ active: { id: '1' }, over: { id: 'in_progress' } })

    expect(updateStatus).toHaveBeenCalledWith('1', 'in_progress')
    expect(completeTask).not.toHaveBeenCalled()
  })

  it('re-dropping an already-done card into "Готово" does not pay out twice', () => {
    render(<TaskKanbanView />)

    dragEnd({ active: { id: '3' }, over: { id: 'done' } })

    expect(completeTask).not.toHaveBeenCalled()
  })

  it('ignores a drag that ends outside every column', () => {
    render(<TaskKanbanView />)

    dragEnd({ active: { id: '1' }, over: null })

    expect(updateStatus).not.toHaveBeenCalled()
    expect(completeTask).not.toHaveBeenCalled()
  })
})
