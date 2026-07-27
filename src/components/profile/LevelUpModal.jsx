export default function LevelUpModal({ open, level, title, onClose }) {
  if (!open) return null
  return (
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
        <button type="button" onClick={onClose} className="sys-btn-primary mt-6 w-full">
          Продолжить
        </button>
      </div>
    </div>
  )
}
