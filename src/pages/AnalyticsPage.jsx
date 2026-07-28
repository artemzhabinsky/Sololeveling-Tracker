import { useEffect, useState } from 'react'
import RadarChart from '../components/analytics/RadarChart.jsx'
import XpLineChart from '../components/analytics/XpLineChart.jsx'
import CategoryDonutChart from '../components/analytics/CategoryDonutChart.jsx'
import { readTable } from '../services/dataService.js'
import { useProfileStore } from '../state/useProfileStore.js'

export default function AnalyticsPage() {
  // Selected field-by-field: returning a fresh object from the selector would
  // hand useSyncExternalStore a new snapshot on every render.
  const attrStr = useProfileStore((s) => s.attr_str)
  const attrInt = useProfileStore((s) => s.attr_int)
  const attrVit = useProfileStore((s) => s.attr_vit)
  const attrGold = useProfileStore((s) => s.attr_gold)
  const attrDisc = useProfileStore((s) => s.attr_disc)
  const profile = {
    attr_str: attrStr,
    attr_int: attrInt,
    attr_vit: attrVit,
    attr_gold: attrGold,
    attr_disc: attrDisc,
  }

  const [logs, setLogs] = useState([])
  const [penaltyEvents, setPenaltyEvents] = useState([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [logRows, eventRows] = await Promise.all([
        readTable('analytics_logs'),
        readTable('system_events'),
      ])
      if (cancelled) return
      setLogs(logRows)
      setPenaltyEvents(eventRows.filter((e) => e.event_type === 'penalty_reset'))
    }

    load().catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="sys-stagger space-y-5">
      <header>
        <p className="sys-eyebrow">Отчёт системы</p>
        <h1 className="mt-2">Аналитика</h1>
        <p className="mt-2 max-w-prose text-moss">
          Куда уходит опыт и какие атрибуты отстают.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="sys-window lg:row-span-2">
          <h2>Атрибуты</h2>
          <p className="mt-1 font-mono text-hud uppercase tracking-[0.16em] text-ash">
            Пять осей роста
          </p>
          <div className="mt-4 h-72 lg:h-[26rem]">
            <RadarChart profile={profile} />
          </div>
        </article>

        <article className="sys-window">
          <h2>Опыт за 7 дней</h2>
          <p className="mt-1 font-mono text-hud uppercase tracking-[0.16em] text-ash">
            Красные точки — штрафы
          </p>
          <div className="mt-4 h-56">
            <XpLineChart logs={logs} penaltyEvents={penaltyEvents} days={7} />
          </div>
        </article>

        <article className="sys-window sys-window--gold">
          <h2>Категории за 7 дней</h2>
          <p className="mt-1 font-mono text-hud uppercase tracking-[0.16em] text-ash">
            Доля закрытых задач
          </p>
          <div className="mt-4 h-56">
            <CategoryDonutChart logs={logs} days={7} />
          </div>
        </article>
      </div>
    </section>
  )
}
