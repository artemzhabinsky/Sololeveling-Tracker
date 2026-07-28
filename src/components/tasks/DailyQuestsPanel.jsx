import { useState } from 'react'
import { useDailyQuestStore } from '../../state/useDailyQuestStore.js'

export default function DailyQuestsPanel({ today }) {
  const quests = useDailyQuestStore((s) => s.quests)
  const createQuest = useDailyQuestStore((s) => s.createQuest)
  const toggleToday = useDailyQuestStore((s) => s.toggleToday)
  const deactivateQuest = useDailyQuestStore((s) => s.deactivateQuest)
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
            <li
              key={q.id}
              className="flex flex-wrap items-center gap-3 transition-colors hover:bg-raised"
            >
              <label className="min-w-0 flex-1 px-1">
                <input
                  type="checkbox"
                  checked={q.last_completed_date === today}
                  onChange={() => toggleToday(q.id, today)}
                />
                <span className={q.last_completed_date === today ? 'text-ash line-through' : ''}>
                  {q.title}
                </span>
              </label>
              {/* Retiring a quest rather than deleting it: the HP penalty check
                  reads historic last_completed_date values, so the row has to
                  survive its removal from the list. */}
              <button
                type="button"
                className="sys-btn-quiet sys-btn-danger"
                aria-label={`Отключить квест: ${q.title}`}
                onClick={() => deactivateQuest(q.id)}
              >
                Отключить
              </button>
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
