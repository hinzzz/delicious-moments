import { View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { useStore } from '../../store'
import { aggregateIngredients } from '../../utils/aggregator'
import './index.scss'

export default function ShoppingListPage() {
  const { menuItems } = useStore()
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  
  const aggregated = aggregateIngredients(menuItems)
  
  const toggleCheck = (key: string) => {
    const newSet = new Set(checkedItems)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setCheckedItems(newSet)
  }
  
  const categoryNames = {
    vegetable: '🥬 蔬菜',
    meat: '🥩 肉类',
    seasoning: '🧂 调料',
    other: '🛒 其他'
  }
  
  return (
    <View className="shopping-list-page">
      <View className="header">
        <Text className="title">买菜清单</Text>
        <Text className="subtitle">共 {aggregated.totalItems} 项</Text>
      </View>
      
      {Object.entries(aggregated.groupedList).map(([category, items]) => (
        items.length > 0 && (
          <View key={category} className="category-section">
            <Text className="category-title">{categoryNames[category]}</Text>
            {items.map(ing => {
              const key = `${ing.name}-${ing.unit}`
              const isChecked = checkedItems.has(key)
              return (
                <View
                  key={key}
                  className={`ingredient-item ${isChecked ? 'checked' : ''}`}
                  onClick={() => toggleCheck(key)}
                >
                  <Text className="ingredient-name">{ing.name}</Text>
                  <Text className="ingredient-quantity">
                    {ing.quantity} {ing.unit}
                  </Text>
                </View>
              )
            })}
          </View>
        )
      ))}
      
      {aggregated.totalItems === 0 && (
        <View className="empty">
          <Text>还没有添加菜品哦</Text>
        </View>
      )}
    </View>
  )
}
