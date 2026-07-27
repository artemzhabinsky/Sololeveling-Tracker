export default function LevelUpModal({ open, level, title, onClose }) {
  if (!open) return null
  return (
    <div role="dialog" aria-modal="true">
      <p>Новый уровень: {level}</p>
      <p>{title}</p>
      <button type="button" onClick={onClose}>Продолжить</button>
    </div>
  )
}
