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
  const applyPenaltyReset = useProfileStore((s) => s.applyPenaltyReset)

  const [showLevelUp, setShowLevelUp] = useState(false)
  const previousLevel = useRef(level)

  useEffect(() => {
    if (level > previousLevel.current) {
      setShowLevelUp(true)
      playLevelUp()
    }
    previousLevel.current = level
  }, [level])

  const rank = getRankTitle(level)
  const required = xpRequiredForLevel(level)
  const hearts = '♥'.repeat(hp) + '♡'.repeat(3 - hp)

  return (
    <div>
      <GoblinAvatar level={level} />
      <div data-testid="hp-hearts">{hearts}</div>
      <p>Уровень {level}: {rank.title}</p>
      <p>{coins}</p>
      <div role="progressbar" aria-valuenow={xp} aria-valuemin={0} aria-valuemax={required} />

      <LevelUpModal open={showLevelUp} level={level} title={rank.title} onClose={() => setShowLevelUp(false)} />
      <PenaltyScreen open={hp === 0} onAcknowledge={applyPenaltyReset} />
    </div>
  )
}
