import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const purchase = vi.fn()
const createReward = vi.fn()
const useItem = vi.fn()
const refreshExpiry = vi.fn()

vi.mock('../../state/useShopStore.js', () => ({
  useShopStore: (selector) => selector({
    rewards: [{ id: 'r1', title: 'Кино', cost_coins: 200 }],
    inventory: [{ id: 'i1', shop_reward_id: 'r1', status: 'active', expires_at: '2026-07-28T12:00:00.000Z', used_at: null }],
    purchase, createReward, useItem, refreshExpiry,
  }),
}))

import ShopView from './ShopView.jsx'

describe('ShopView', () => {
  beforeEach(() => vi.clearAllMocks())

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

  it('submitting the reward form calls createReward with a numeric cost', async () => {
    render(<ShopView />)

    await userEvent.type(screen.getByLabelText(/новая награда/i), 'Пицца')
    await userEvent.type(screen.getByLabelText(/цена/i), '150')
    await userEvent.click(screen.getByRole('button', { name: /добавить/i }))

    expect(createReward).toHaveBeenCalledWith({ title: 'Пицца', cost: 150 })
  })

  it('clears the reward form after submitting', async () => {
    render(<ShopView />)

    await userEvent.type(screen.getByLabelText(/новая награда/i), 'Пицца')
    await userEvent.type(screen.getByLabelText(/цена/i), '150')
    await userEvent.click(screen.getByRole('button', { name: /добавить/i }))

    expect(screen.getByLabelText(/новая награда/i)).toHaveValue('')
    expect(screen.getByLabelText(/цена/i)).toHaveValue(null)
  })

  // Nothing else sweeps the 24h window, so a stale item would keep offering
  // "Использовать" until the store happened to be touched.
  it('sweeps expired inventory on mount', () => {
    render(<ShopView />)
    expect(refreshExpiry).toHaveBeenCalled()
  })
})
