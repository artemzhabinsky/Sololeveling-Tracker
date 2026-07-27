import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/dataService.js', () => ({
  writeRow: vi.fn().mockResolvedValue({ ok: true, offline: false }),
  readTable: vi.fn().mockResolvedValue([]),
}))

import { writeRow } from '../services/dataService.js'
import { useDailyQuestStore } from './useDailyQuestStore.js'

describe('useDailyQuestStore', () => {
  beforeEach(() => {
    useDailyQuestStore.setState(useDailyQuestStore.getInitialState())
    vi.clearAllMocks()
  })

  it('createQuest adds an active quest with no completion date', async () => {
    await useDailyQuestStore.getState().createQuest('20 отжиманий')
    expect(useDailyQuestStore.getState().quests[0]).toMatchObject({ title: '20 отжиманий', is_active: true, last_completed_date: null })
  })

  it('toggleToday marks the quest done today, then reverts on a second toggle', async () => {
    await useDailyQuestStore.getState().createQuest('20 отжиманий')
    const id = useDailyQuestStore.getState().quests[0].id

    await useDailyQuestStore.getState().toggleToday(id, '2026-07-27')
    expect(useDailyQuestStore.getState().quests[0].last_completed_date).toBe('2026-07-27')

    await useDailyQuestStore.getState().toggleToday(id, '2026-07-27')
    expect(useDailyQuestStore.getState().quests[0].last_completed_date).toBeNull()
  })

  it('hasCompletionOnDate reflects any quest completed on that date', async () => {
    await useDailyQuestStore.getState().createQuest('20 отжиманий')
    const id = useDailyQuestStore.getState().quests[0].id
    await useDailyQuestStore.getState().toggleToday(id, '2026-07-27')

    expect(useDailyQuestStore.getState().hasCompletionOnDate('2026-07-27')).toBe(true)
    expect(useDailyQuestStore.getState().hasCompletionOnDate('2026-07-26')).toBe(false)
  })

  it('deactivateQuest flips is_active to false without deleting it', async () => {
    await useDailyQuestStore.getState().createQuest('20 отжиманий')
    const id = useDailyQuestStore.getState().quests[0].id
    await useDailyQuestStore.getState().deactivateQuest(id)
    expect(useDailyQuestStore.getState().quests[0].is_active).toBe(false)
    expect(writeRow).toHaveBeenCalledWith('daily_quests', expect.objectContaining({ is_active: false }))
  })
})
