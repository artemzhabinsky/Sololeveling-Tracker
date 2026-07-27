import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function PenaltyScreen({ open, onAcknowledge }) {
  const acknowledgeRef = useRef(null)

  // No Escape handler on purpose: acknowledging wipes the profile, so it has to
  // be dismissed deliberately rather than by a reflex keypress.
  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement
    acknowledgeRef.current?.focus()

    return () => previouslyFocused?.focus?.()
  }, [open])

  if (!open) return null

  // Portalled to <body> for the same reason as LevelUpModal — see the note there.
  return createPortal(
    <div className="fixed inset-0 z-90 flex items-center justify-center overscroll-contain bg-abyss/95 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        className="sys-window sys-window--alert animate-materialize w-full max-w-md text-center"
      >
        <h1 className="text-blood">SYSTEM PENALTY</h1>
        <p className="mt-4 font-mono text-sm uppercase tracking-[0.35em] text-bone">YOU DIED</p>
        <p className="mt-4 text-moss">
          HP на нуле. Уровень, опыт, монеты и атрибуты обнулены.
        </p>
        <button
          ref={acknowledgeRef}
          type="button"
          onClick={onAcknowledge}
          className="sys-btn-danger mt-6 w-full"
        >
          Начать заново
        </button>
      </div>
    </div>,
    document.body,
  )
}
