import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function LevelUpModal({ open, level, title, onClose }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement
    confirmRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  // Portalled to <body>: ProfileHeader sits inside a `.sys-window`, whose
  // clip-path would otherwise crop this fixed overlay to the panel's chamfered
  // outline, and whose `isolation: isolate` would trap it below sibling panels.
  return createPortal(
    <div className="fixed inset-0 z-80 flex items-center justify-center overscroll-contain bg-abyss/85 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="sys-window animate-materialize w-full max-w-sm text-center"
      >
        <p className="sys-eyebrow justify-center">Уведомление системы</p>
        <p className="mt-4 font-display text-2xl font-extrabold uppercase leading-tight text-jade">
          Новый уровень: {level}
        </p>
        <p className="mt-3 text-moss">{title}</p>
        <button
          ref={confirmRef}
          type="button"
          onClick={onClose}
          className="sys-btn-primary mt-6 w-full"
        >
          Продолжить
        </button>
      </div>
    </div>,
    document.body,
  )
}
