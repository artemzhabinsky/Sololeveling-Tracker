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
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Название</label>
      <input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label htmlFor="task-category">Категория</label>
      <select id="task-category" value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
      </select>

      <label htmlFor="task-rank">Ранг</label>
      <select id="task-rank" value={rank} onChange={(e) => setRank(e.target.value)}>
        {RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>

      <label htmlFor="task-due">Срок</label>
      <input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

      <button type="submit">Добавить</button>
    </form>
  )
}
