import { useState } from 'react'
import { useDailyQuestStore } from '../../state/useDailyQuestStore.js'

export default function DailyQuestsPanel({ today }) {
  const quests = useDailyQuestStore((s) => s.quests)
  const createQuest = useDailyQuestStore((s) => s.createQuest)
  const toggleToday = useDailyQuestStore((s) => s.toggleToday)
  const [title, setTitle] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    createQuest(title)
    setTitle('')
  }

  return (
    <div>
      <ul>
        {quests.filter((q) => q.is_active).map((q) => (
          <li key={q.id}>
            <label>
              <input
                type="checkbox"
                checked={q.last_completed_date === today}
                onChange={() => toggleToday(q.id, today)}
              />
              {q.title}
            </label>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd}>
        <label htmlFor="new-quest">Новый квест</label>
        <input id="new-quest" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit">Добавить</button>
      </form>
    </div>
  )
}
