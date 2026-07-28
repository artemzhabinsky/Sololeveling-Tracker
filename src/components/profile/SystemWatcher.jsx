import { useEffect, useRef, useState } from 'react'
import { useProfileStore } from '../../state/useProfileStore.js'
import { useShopStore } from '../../state/useShopStore.js'
import { getRankTitle } from '../../domain/ranks.js'
import LevelUpModal from './LevelUpModal.jsx'
import PenaltyScreen from './PenaltyScreen.jsx'
import { playLevelUp } from '../../audio/sfx.js'

/**
 * Watches the profile for the two events the System announces — a level gained
 * and HP hitting zero — and renders the matching overlay.
 *
 * Mounted once in App.jsx, outside <Routes>, so the announcement follows the
 * user rather than the page: tasks are completed on /tasks but the profile lives
 * on /, and while this lived inside ProfileHeader a level gained from the task
 * list was awarded silently. Staying mounted across navigation is also what
 * keeps `previousLevel` honest — a per-route component would reset its baseline
 * on every visit.
 *
 * Renders no layout of its own; both children portal to <body>.
 */
export default function SystemWatcher() {
  const level = useProfileStore((s) => s.level)
  const hp = useProfileStore((s) => s.hp)
  const loaded = useProfileStore((s) => s.loaded)
  const applyPenaltyReset = useProfileStore((s) => s.applyPenaltyReset)
  const clearInventory = useShopStore((s) => s.clearInventory)

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

  // The spec's reset covers the inventory too, but the profile store can't call
  // into the shop store — the shop already imports the profile store for
  // spendCoins, and closing that loop would be a circular import. The caller
  // owns the sequencing instead.
  async function handlePenaltyAcknowledge() {
    await applyPenaltyReset()
    await clearInventory()
  }

  return (
    <>
      <LevelUpModal
        open={showLevelUp}
        level={level}
        title={getRankTitle(level).title}
        onClose={() => setShowLevelUp(false)}
      />
      <PenaltyScreen open={hp === 0} onAcknowledge={handlePenaltyAcknowledge} />
    </>
  )
}
