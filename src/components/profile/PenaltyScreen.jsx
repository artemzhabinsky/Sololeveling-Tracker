export default function PenaltyScreen({ open, onAcknowledge }) {
  if (!open) return null
  return (
    <div role="alertdialog" aria-modal="true">
      <h1>SYSTEM PENALTY</h1>
      <p>YOU DIED</p>
      <button type="button" onClick={onAcknowledge}>Начать заново</button>
    </div>
  )
}
