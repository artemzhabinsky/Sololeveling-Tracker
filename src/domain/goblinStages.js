export const STAGES = [
  { stage: 1, minLevel: 1, maxLevel: 4, title: 'Нищий Гоблин-Оборванец' },
  { stage: 2, minLevel: 5, maxLevel: 9, title: 'Гоблин-Мусорщик / Картонный Рыцарь' },
  { stage: 3, minLevel: 10, maxLevel: 14, title: 'Охотник E-Ранга / Гоблин-Боец' },
  { stage: 4, minLevel: 15, maxLevel: 19, title: 'Охотник D-Ранга / Гоблин-Воин' },
  { stage: 5, minLevel: 20, maxLevel: 24, title: 'Охотник C-Ранга / Теневой Кадет' },
  { stage: 6, minLevel: 25, maxLevel: 29, title: 'Охотник A-Ранга / Теневой Рыцарь' },
  { stage: 7, minLevel: 30, maxLevel: null, title: 'Гигачат Гоблин-Трахатель 30-го Уровня (S-Ранг)' },
]

export function getStageForLevel(level) {
  const match = STAGES.find((s) => level >= s.minLevel && (s.maxLevel === null || level <= s.maxLevel))
  return match ? match.stage : STAGES[STAGES.length - 1].stage
}
