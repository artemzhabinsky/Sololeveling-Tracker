import { format } from 'date-fns'
import ProfileHeader from '../components/profile/ProfileHeader.jsx'
import DailyQuestsPanel from '../components/tasks/DailyQuestsPanel.jsx'

const dateLabel = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })

export default function DashboardPage() {
  const now = new Date()
  // ISO string for the store (quest completion keys); localised string for the eye.
  const today = format(now, 'yyyy-MM-dd')

  return (
    <section className="sys-stagger space-y-5">
      <header>
        <p className="sys-eyebrow">Окно статуса</p>
        <h1 className="mt-2">Дашборд</h1>
        <p className="mt-2 max-w-prose text-moss">
          Система следит за тобой. Закрывай квесты каждый день — иначе HP уходит.
        </p>
      </header>

      <div className="sys-window">
        <ProfileHeader />
      </div>

      <div className="sys-window sys-window--gold">
        <h2>Ежедневные квесты</h2>
        <p className="mt-1 font-mono text-hud uppercase tracking-[0.16em] text-ash">
          Сброс в полночь · {dateLabel.format(now)}
        </p>
        <div className="mt-4">
          <DailyQuestsPanel today={today} />
        </div>
      </div>
    </section>
  )
}
