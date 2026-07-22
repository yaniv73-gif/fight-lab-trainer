export const CATEGORIES = [
  { id: 'bjj_gi', label: 'BJJ Gi', color: '#1d4ed8' },
  { id: 'bjj_nogi', label: 'BJJ No-Gi', color: '#0891b2' },
  { id: 'muay_thai', label: 'Muay Thai / Kickboxing', color: '#d97706' },
  { id: 'mma', label: 'MMA', color: '#7c3aed' },
  { id: 'bags', label: 'Bags', color: '#059669' },
  { id: 'fitness', label: 'Fitness', color: '#c7171a' },
  { id: 'self_defense', label: 'Self-Defense', color: '#6b21a8' },
]

export const SECTIONS_BY_CATEGORY = {
  bjj_gi:       ['Warmup', 'Technique / Drill', 'Sparring'],
  bjj_nogi:     ['Warmup', 'Technique / Drill', 'Sparring'],
  muay_thai:    ['Warmup', 'Technique / Drill', 'Sparring'],
  mma:          ['Warmup', 'Technique / Drill', 'Sparring'],
  bags:         ['Warmup', 'Bags', 'Cardio / Flexibility / Strength'],
  fitness:      ['Warmup', 'Cardio / Flexibility / Strength'],
  self_defense: ['Warmup', 'Technique / Drill'],
}

export function defaultSections(categoryId) {
  const titles = SECTIONS_BY_CATEGORY[categoryId] ?? ['Warmup', 'Technique / Drill', 'Sparring']
  return titles.map(t => ({ title: t, items: [] }))
}
