export function xpRequiredForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5))
}

export function applyXp(profile, xpGained) {
  let level = profile.level
  let xp = profile.xp + xpGained
  const previousLevel = level

  while (xp >= xpRequiredForLevel(level)) {
    xp -= xpRequiredForLevel(level)
    level += 1
  }

  return { level, xp, previousLevel, leveledUp: level > previousLevel }
}
