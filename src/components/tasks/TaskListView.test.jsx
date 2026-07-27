import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const createTask = vi.fn()
const completeTask = vi.fn()
const deleteTask = vi.fn()

vi.mock('../../state/useTaskStore.js', () => ({
  useTaskStore: (selector) => selector({
    tasks: [
      { id: '1', title: 'Помыть посуду', category: 'spirit', rank: 'E', status: 'todo' },
      { id: '2', title: 'Сделать отчёт', category: 'mental', rank: 'C', status: 'done' },
    ],
    createTask, completeTask, deleteTask,
  }),
}))

import TaskListView from './TaskListView.jsx'

describe('TaskListView', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders all tasks', () => {
    render(<TaskListView />)
    expect(screen.getByText('Помыть посуду')).toBeInTheDocument()
    expect(screen.getByText('Сделать отчёт')).toBeInTheDocument()
  })

  it('completing a todo task calls completeTask with its id', async () => {
    render(<TaskListView />)
    await userEvent.click(screen.getByRole('button', { name: /выполнить/i }))
    expect(completeTask).toHaveBeenCalledWith('1')
  })

  it('submitting the form calls createTask with the entered values', async () => {
    render(<TaskListView />)
    await userEvent.type(screen.getByLabelText(/название/i), 'Новая задача')
    await userEvent.selectOptions(screen.getByLabelText(/категория/i), 'physical')
    await userEvent.selectOptions(screen.getByLabelText(/ранг/i), 'D')
    await userEvent.click(screen.getByRole('button', { name: /добавить/i }))
    expect(createTask).toHaveBeenCalledWith({ title: 'Новая задача', category: 'physical', rank: 'D', dueDate: null })
  })
})
