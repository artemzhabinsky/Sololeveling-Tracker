import { useEffect, useState } from 'react'
import { useShopStore } from '../../state/useShopStore.js'
import InventoryItem from './InventoryItem.jsx'

function RewardForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [cost, setCost] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ title, cost: Number(cost) })
    setTitle('')
    setCost('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-wrap items-end gap-3">
      <div className="min-w-48 flex-1">
        <label htmlFor="reward-title">Новая награда</label>
        <input
          id="reward-title"
          name="reward-title"
          autoComplete="off"
          className="mt-1.5"
          placeholder="Например: серия сериала…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="w-32">
        <label htmlFor="reward-cost">Цена</label>
        <input
          id="reward-cost"
          name="reward-cost"
          type="number"
          min="1"
          className="mt-1.5"
          placeholder="200"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="sys-btn-gold">
        Добавить
      </button>
    </form>
  )
}

export default function ShopView() {
  const rewards = useShopStore((s) => s.rewards)
  const inventory = useShopStore((s) => s.inventory)
  const purchase = useShopStore((s) => s.purchase)
  const useItem = useShopStore((s) => s.useItem)
  const createReward = useShopStore((s) => s.createReward)
  const refreshExpiry = useShopStore((s) => s.refreshExpiry)

  // Expiry is stored as a timestamp, not a countdown, so nothing flips items to
  // `expired` on its own — without this sweep a dead item keeps offering
  // "Использовать" for as long as the tab stays open. Per-second ticking is a
  // separate deferred item; catching up on mount is what stops the stale
  // affordance.
  useEffect(() => {
    refreshExpiry()
  }, [refreshExpiry])

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

        <RewardForm onSubmit={createReward} />
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
