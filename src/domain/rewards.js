export const RANK_REWARDS = {
  E: { xp: 50, coins: 10 },
  D: { xp: 100, coins: 20 },
  C: { xp: 250, coins: 50 },
  B: { xp: 500, coins: 100 },
  A: { xp: 1000, coins: 200 },
  S: { xp: 2500, coins: 500 },
}

export function getReward(rank) {
  const reward = RANK_REWARDS[rank]
  if (!reward) throw new Error(`Unknown rank: ${rank}`)
  return reward
}
