import { formatRemaining } from '../../domain/countdown.js'

export default function InventoryItem({ item, onUse, now = new Date() }) {
  const remaining = new Date(item.expires_at).getTime() - now.getTime()
  return (
    <li>
      <span>{formatRemaining(remaining)}</span>
      {item.status === 'active' && (
        <button type="button" onClick={() => onUse(item.id)}>Использовать</button>
      )}
    </li>
  )
}
