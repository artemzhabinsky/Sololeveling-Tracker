import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/dataService.js', () => ({
  writeRow: vi.fn().mockResolvedValue({ ok: true, offline: false }),
  readTable: vi.fn().mockResolvedValue([]),
}))

const spendCoins = vi.fn()
vi.mock('./useProfileStore.js', () => ({
  useProfileStore: { getState: () => ({ spendCoins }) },
}))

import { writeRow } from '../services/dataService.js'
import { useShopStore } from './useShopStore.js'

describe('useShopStore', () => {
  beforeEach(() => {
    useShopStore.setState(useShopStore.getInitialState())
    vi.clearAllMocks()
  })

  it('createReward adds a catalog entry', async () => {
    await useShopStore.getState().createReward({ title: 'Кино', cost: 200 })
    expect(useShopStore.getState().rewards[0]).toMatchObject({ title: 'Кино', cost_coins: 200 })
  })

  it('purchase fails when spendCoins refuses (insufficient balance)', async () => {
    spendCoins.mockResolvedValue(false)
    await useShopStore.getState().createReward({ title: 'Кино', cost: 200 })
    const rewardId = useShopStore.getState().rewards[0].id

    const ok = await useShopStore.getState().purchase(rewardId)

    expect(ok).toBe(false)
    expect(useShopStore.getState().inventory).toHaveLength(0)
  })

  it('purchase succeeds and adds an inventory entry expiring in 24h', async () => {
    spendCoins.mockResolvedValue(true)
    await useShopStore.getState().createReward({ title: 'Кино', cost: 200 })
    const rewardId = useShopStore.getState().rewards[0].id
    const now = new Date('2026-07-27T12:00:00Z')

    const ok = await useShopStore.getState().purchase(rewardId, now)

    expect(ok).toBe(true)
    const item = useShopStore.getState().inventory[0]
    expect(item.shop_reward_id).toBe(rewardId)
    expect(item.status).toBe('active')
    expect(item.expires_at).toBe('2026-07-28T12:00:00.000Z')
    expect(writeRow).toHaveBeenCalledWith('user_inventory', expect.objectContaining({ status: 'active' }))
  })

  it('refreshExpiry marks unused past-due items expired, leaves used ones alone', async () => {
    spendCoins.mockResolvedValue(true)
    await useShopStore.getState().createReward({ title: 'Кино', cost: 200 })
    const rewardId = useShopStore.getState().rewards[0].id
    await useShopStore.getState().purchase(rewardId, new Date('2026-07-25T12:00:00Z'))
    const [expiredItem] = useShopStore.getState().inventory
    useShopStore.setState({
      inventory: [
        { ...expiredItem, id: 'a', used_at: null },
        { ...expiredItem, id: 'b', used_at: '2026-07-25T13:00:00Z', status: 'used' },
      ],
    })

    useShopStore.getState().refreshExpiry(new Date('2026-07-27T00:00:00Z'))

    const [a, b] = useShopStore.getState().inventory
    expect(a.status).toBe('expired')
    expect(b.status).toBe('used')
  })

  it('useItem sets used_at and status', async () => {
    spendCoins.mockResolvedValue(true)
    await useShopStore.getState().createReward({ title: 'Кино', cost: 200 })
    const rewardId = useShopStore.getState().rewards[0].id
    await useShopStore.getState().purchase(rewardId, new Date('2026-07-27T12:00:00Z'))
    const itemId = useShopStore.getState().inventory[0].id

    await useShopStore.getState().useItem(itemId)

    const item = useShopStore.getState().inventory[0]
    expect(item.status).toBe('used')
    expect(item.used_at).not.toBeNull()
  })
})
