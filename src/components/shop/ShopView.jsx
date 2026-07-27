import { useShopStore } from '../../state/useShopStore.js'
import InventoryItem from './InventoryItem.jsx'

export default function ShopView() {
  const rewards = useShopStore((s) => s.rewards)
  const inventory = useShopStore((s) => s.inventory)
  const purchase = useShopStore((s) => s.purchase)
  const useItem = useShopStore((s) => s.useItem)

  const activeInventory = inventory.filter((i) => i.status === 'active')
  const titleFor = (rewardId) => rewards.find((r) => r.id === rewardId)?.title

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section>
        <h2>Каталог наград</h2>
        {rewards.length === 0 ? (
          <p className="mt-4 border border-dashed border-edge px-4 py-6 text-center text-moss">
            Наград пока нет.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-edge border-y border-edge">
            {rewards.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center gap-3 py-3 transition-colors hover:bg-raised"
              >
                <span className="min-w-0 flex-1 break-words text-bone">
                  {r.title} — <span className="sys-value text-gold">{r.cost_coins}</span>
                </span>
                <button type="button" className="sys-btn-gold" onClick={() => purchase(r.id)}>
                  Купить
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Инвентарь</h2>
        {activeInventory.length === 0 ? (
          <p className="mt-4 border border-dashed border-edge px-4 py-6 text-center text-moss">
            Ничего не куплено. Награда сгорает через 24&nbsp;часа после покупки.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-edge border-y border-edge">
            {activeInventory.map((item) => (
              <InventoryItem
                key={item.id}
                item={item}
                title={titleFor(item.shop_reward_id)}
                onUse={useItem}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
