import { useShopStore } from '../../state/useShopStore.js'
import InventoryItem from './InventoryItem.jsx'

export default function ShopView() {
  const rewards = useShopStore((s) => s.rewards)
  const inventory = useShopStore((s) => s.inventory)
  const purchase = useShopStore((s) => s.purchase)
  const useItem = useShopStore((s) => s.useItem)

  return (
    <div>
      <ul>
        {rewards.map((r) => (
          <li key={r.id}>
            {r.title} — {r.cost_coins}
            <button type="button" onClick={() => purchase(r.id)}>Купить</button>
          </li>
        ))}
      </ul>
      <ul>
        {inventory.filter((i) => i.status === 'active').map((item) => (
          <InventoryItem key={item.id} item={item} onUse={useItem} />
        ))}
      </ul>
    </div>
  )
}
