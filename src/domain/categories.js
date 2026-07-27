export const CATEGORIES = [
  { key: 'physical', attr: 'attr_str', label: 'Физика' },
  { key: 'mental', attr: 'attr_int', label: 'Учёба/Работа' },
  { key: 'spirit', attr: 'attr_vit', label: 'Здоровье/Быт' },
  { key: 'finance', attr: 'attr_gold', label: 'Финансы' },
  { key: 'discipline', attr: 'attr_disc', label: 'Привычки/Рутина' },
]

export function getAttrForCategory(category) {
  const entry = CATEGORIES.find((c) => c.key === category)
  if (!entry) throw new Error(`Unknown category: ${category}`)
  return entry.attr
}
