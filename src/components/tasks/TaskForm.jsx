import { useState } from 'react'
import { CATEGORIES } from '../../domain/categories.js'

const RANKS = ['E', 'D', 'C', 'B', 'A', 'S']

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].key)
  const [rank, setRank] = useState('E')
  const [dueDate, setDueDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ title, category, rank, dueDate: dueDate || null })
    setTitle('')
    setDueDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-4">
        <label htmlFor="task-title">Название</label>
        <input
          id="task-title"
          name="task-title"
          autoComplete="off"
          className="mt-1.5"
          placeholder="Например: пробежка 5 км…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="task-category">Категория</label>
        <select
          id="task-category"
          name="task-category"
          className="mt-1.5"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="task-rank">Ранг</label>
        <select
          id="task-rank"
          name="task-rank"
          className="mt-1.5"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        >
          {RANKS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="task-due">Срок</label>
        <input
          id="task-due"
          name="task-due"
          autoComplete="off"
          className="mt-1.5"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button type="submit" className="sys-btn-primary self-end">
        Добавить
      </button>
    </form>
  )
}
