import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

const purchase = vi.fn()
const createReward = vi.fn()
const useItem = vi.fn()

vi.mock('../../state/useShopStore.js', () => ({
  useShopStore: (selector) => selector({
    rewards: [{ id: 'r1', title: 'Кино', cost_coins: 200 }],
    inventory: [{ id: 'i1', shop_reward_id: 'r1', status: 'active', expires_at: '2026-07-28T12:00:00.000Z', used_at: null }],
    purchase, createReward, useItem,
  }),
}))

import ShopView from './ShopView.jsx'

describe('ShopView', () => {
  it('renders catalog rewards and purchasing calls purchase(rewardId)', async () => {
    render(<ShopView />)
    await userEvent.click(screen.getByRole('button', { name: /купить/i }))
    expect(purchase).toHaveBeenCalledWith('r1')
  })

  it('renders active inventory items with a use button', async () => {
    render(<ShopView />)
    await userEvent.click(screen.getByRole('button', { name: /использовать/i }))
    expect(useItem).toHaveBeenCalledWith('i1')
  })
})
