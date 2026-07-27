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

  const active = quests.filter((q) => q.is_active)

  return (
    <div className="space-y-5">
      {active.length === 0 ? (
        <p className="border border-dashed border-edge px-4 py-6 text-center text-moss">
          Ни одного ежедневного квеста. Пропущенный день стоит одного HP.
        </p>
      ) : (
        <ul className="divide-y divide-edge border-y border-edge">
          {active.map((q) => (
            <li key={q.id} className="transition-colors hover:bg-raised">
              <label className="px-1">
                <input
                  type="checkbox"
                  checked={q.last_completed_date === today}
                  onChange={() => toggleToday(q.id, today)}
                />
                <span className={q.last_completed_date === today ? 'text-ash line-through' : ''}>
                  {q.title}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <label htmlFor="new-quest">Новый квест</label>
          <input
            id="new-quest"
            name="new-quest"
            autoComplete="off"
            className="mt-1.5"
            placeholder="Например: 20 отжиманий…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button type="submit" className="sys-btn-gold">
          Добавить
        </button>
      </form>
    </div>
  )
}
