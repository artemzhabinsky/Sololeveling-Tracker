import { formatRemaining } from '../../domain/countdown.js'

export default function InventoryItem({ item, title, onUse, now = new Date() }) {
  const remaining = new Date(item.expires_at).getTime() - now.getTime()
  const expired = remaining < 0

  return (
    <li className="flex flex-wrap items-center gap-3 py-3 transition-colors hover:bg-raised">
      {title && <span className="min-w-0 flex-1 break-words text-bone">{title}</span>}
      <span className={`sys-value text-sm ${expired ? 'text-blood' : 'text-jade'}`}>
        {formatRemaining(remaining)}
      </span>
      {item.status === 'active' && (
        <button type="button" onClick={() => onUse(item.id)}>
          Использовать
        </button>
      )}
    </li>
  )
}
