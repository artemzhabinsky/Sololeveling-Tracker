import { useEffect, useRef, useState } from 'react'
import { useProfileStore } from '../../state/useProfileStore.js'
import { xpRequiredForLevel } from '../../domain/xp.js'
import { getRankTitle } from '../../domain/ranks.js'
import GoblinAvatar from '../avatar/GoblinAvatar.jsx'
import LevelUpModal from './LevelUpModal.jsx'
import PenaltyScreen from './PenaltyScreen.jsx'
import { playLevelUp } from '../../audio/sfx.js'

export default function ProfileHeader() {
  const level = useProfileStore((s) => s.level)
  const xp = useProfileStore((s) => s.xp)
  const coins = useProfileStore((s) => s.coins)
  const hp = useProfileStore((s) => s.hp)
  const loaded = useProfileStore((s) => s.loaded)
  const applyPenaltyReset = useProfileStore((s) => s.applyPenaltyReset)

  const [showLevelUp, setShowLevelUp] = useState(false)
  const previousLevel = useRef(level)
  const wasLoaded = useRef(loaded)

  useEffect(() => {
    const justLoaded = loaded && !wasLoaded.current
    wasLoaded.current = loaded

    // Only a level gained while the app is running is a level-up. Before the
    // store has hydrated — and on the hydrating render itself — the level jumps
    // from the default 1 to whatever was saved, which is not something to
    // celebrate. Sync the baseline and stay quiet.
    if (!loaded || justLoaded) {
      previousLevel.current = level
      return
    }

    if (level > previousLevel.current) {
      setShowLevelUp(true)
      playLevelUp()
    }
    previousLevel.current = level
  }, [level, loaded])

  const rank = getRankTitle(level)
  const required = xpRequiredForLevel(level)
  const filledHearts = '♥'.repeat(hp)
  const emptyHearts = '♡'.repeat(3 - hp)
  const xpRatio = required > 0 ? Math.min(1, xp / required) : 0

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[11rem_1fr]">
      <div className="mx-auto w-40 text-jade [&_svg]:h-auto [&_svg]:w-full">
        <GoblinAvatar level={level} />
      </div>

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="sys-eyebrow">Профиль охотника</p>
          <div
            data-testid="hp-hearts"
            role="img"
            aria-label={`Здоровье: ${hp} из 3`}
            className="text-lg leading-none tracking-[0.15em]"
          >
            <span className="text-blood">{filledHearts}</span>
            <span className="text-edge-lit">{emptyHearts}</span>
          </div>
        </div>

        <p className="font-display text-xl font-bold leading-tight text-bone">
          Уровень {level}: {rank.title}
        </p>
        <p className="text-sm text-moss">{rank.description}</p>

        <p className="flex items-baseline gap-2">
          <span className="sys-value text-xl text-gold">{coins}</span>
          <span className="font-mono text-hud uppercase tracking-[0.18em] text-ash">монет</span>
        </p>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between font-mono text-hud uppercase tracking-[0.18em] text-ash">
            <span>Опыт</span>
            <span className="sys-value text-jade">
              {xp} / {required}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Прогресс до следующего уровня"
            aria-valuenow={xp}
            aria-valuemin={0}
            aria-valuemax={required}
            className="sys-meter"
          >
            <div className="sys-meter__fill" style={{ '--sys-fill': xpRatio }} />
          </div>
        </div>
      </div>

      <LevelUpModal open={showLevelUp} level={level} title={rank.title} onClose={() => setShowLevelUp(false)} />
      <PenaltyScreen open={hp === 0} onAcknowledge={applyPenaltyReset} />
    </div>
  )
}
