import { addDays, formatISO, isBefore, parseISO } from 'date-fns'

export function computeHpPenalty({ currentHp, lastCheckDate, today, hasCompletionOnDate }) {
  let hp = currentHp
  let penaltyTriggered = false
  let cursor = addDays(parseISO(lastCheckDate), 1)
  const todayDate = parseISO(today)

  while (isBefore(cursor, todayDate) && hp > 0) {
    const dateStr = formatISO(cursor, { representation: 'date' })
    if (!hasCompletionOnDate(dateStr)) {
      hp -= 1
      if (hp === 0) penaltyTriggered = true
    }
    cursor = addDays(cursor, 1)
  }

  return { hp, lastCheckDate: today, penaltyTriggered }
}
