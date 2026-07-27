import { create } from 'zustand'
import { writeRow, readTable } from '../services/dataService.js'
import { useProfileStore } from './useProfileStore.js'

export const useShopStore = create((set, get) => ({
  rewards: [],
  inventory: [],
  loaded: false,

  async loadShop() {
    const [rewards, inventory] = await Promise.all([readTable('shop_rewards'), readTable('user_inventory')])
    set({ rewards, inventory, loaded: true })
  },

  async createReward({ title, cost }) {
    const reward = { id: crypto.randomUUID(), title, cost_coins: cost }
    set((s) => ({ rewards: [...s.rewards, reward] }))
    await writeRow('shop_rewards', reward)
  },

  async purchase(rewardId, now = new Date()) {
    const reward = get().rewards.find((r) => r.id === rewardId)
    const ok = await useProfileStore.getState().spendCoins(reward.cost_coins)
    if (!ok) return false

    const item = {
      id: crypto.randomUUID(),
      shop_reward_id: rewardId,
      purchased_at: now.toISOString(),
      expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      used_at: null,
      status: 'active',
    }
    set((s) => ({ inventory: [...s.inventory, item] }))
    await writeRow('user_inventory', item)
    return true
  },

  async useItem(inventoryId) {
    const item = get().inventory.find((i) => i.id === inventoryId)
    const updated = { ...item, used_at: new Date().toISOString(), status: 'used' }
    set((s) => ({ inventory: s.inventory.map((i) => (i.id === inventoryId ? updated : i)) }))
    await writeRow('user_inventory', updated)
  },

  refreshExpiry(now = new Date()) {
    set((s) => ({
      inventory: s.inventory.map((item) => {
        if (item.status !== 'active') return item
        if (new Date(item.expires_at) <= now) return { ...item, status: 'expired' }
        return item
      }),
    }))
  },
}))
