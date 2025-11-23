import { MenuItem, Ingredient } from '../types'

export interface AggregatedIngredients {
  groupedList: {
    vegetable: Ingredient[]
    meat: Ingredient[]
    seasoning: Ingredient[]
    other: Ingredient[]
  }
  totalCount: number
  totalItems: number
}

export function aggregateIngredients(menuItems: MenuItem[]): AggregatedIngredients {
  const rawIngredients: Ingredient[] = []
  
  // Flatten ingredients
  menuItems.forEach(item => {
    rawIngredients.push(...item.dish.ingredients)
  })

  // Aggregate by name and unit
  const map = new Map<string, Ingredient>()
  
  rawIngredients.forEach(ing => {
    const key = `${ing.name}-${ing.unit}`
    if (map.has(key)) {
      const existing = map.get(key)!
      existing.quantity += ing.quantity
    } else {
      map.set(key, { ...ing })
    }
  })

  // Group by category
  const groupedList = {
    vegetable: [] as Ingredient[],
    meat: [] as Ingredient[],
    seasoning: [] as Ingredient[],
    other: [] as Ingredient[]
  }

  map.forEach(ing => {
    const cat = ing.category || 'other'
    if (groupedList[cat]) {
      groupedList[cat].push(ing)
    } else {
      groupedList['other'].push(ing)
    }
  })

  return {
    groupedList,
    totalCount: rawIngredients.length,
    totalItems: map.size
  }
}
