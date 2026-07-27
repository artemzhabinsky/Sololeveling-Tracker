import { describe, it, expect } from 'vitest'
import { CATEGORIES, getAttrForCategory } from './categories.js'

describe('CATEGORIES', () => {
  it('has 5 categories mapped 1:1 to attributes', () => {
    expect(CATEGORIES).toEqual([
      { key: 'physical', attr: 'attr_str', label: 'Физика' },
      { key: 'mental', attr: 'attr_int', label: 'Учёба/Работа' },
      { key: 'spirit', attr: 'attr_vit', label: 'Здоровье/Быт' },
      { key: 'finance', attr: 'attr_gold', label: 'Финансы' },
      { key: 'discipline', attr: 'attr_disc', label: 'Привычки/Рутина' },
    ])
  })
})

describe('getAttrForCategory', () => {
  it('returns the attribute column for a known category', () => {
    expect(getAttrForCategory('physical')).toBe('attr_str')
  })

  it('throws for an unknown category', () => {
    expect(() => getAttrForCategory('unknown')).toThrow('Unknown category: unknown')
  })
})
