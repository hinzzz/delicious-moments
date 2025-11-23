import { View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useStore } from '../../store'
import './index.scss'

export default function RecipesPage() {
  const { dishes, categories, loadFromStorage } = useStore()
  const [activeCategory, setActiveCategory] = useState('')
  
  useEffect(() => {
    loadFromStorage()
    if (categories.length > 0) {
      setActiveCategory(categories[0].id)
    }
  }, [])
  
  const filteredDishes = dishes.filter(d => d.categoryId === activeCategory)
  
  const handleDishClick = (dishId: string) => {
    Taro.navigateTo({
      url: `/pages/dish-detail/index?id=${dishId}`
    })
  }
  
  const handleCreateRecipe = () => {
    Taro.navigateTo({
      url: '/pages/create-recipe/index'
    })
  }
  
  return (
    <View className="recipes-page">
      <View className="header">
        <Text className="title">私房菜谱</Text>
        <Text className="subtitle">共收录 {dishes.length} 道美味</Text>
      </View>
      
      <View className="categories">
        {categories.map(cat => (
          <View
            key={cat.id}
            className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <Text>{cat.icon} {cat.name}</Text>
          </View>
        ))}
      </View>
      
      <View className="dish-list">
        {filteredDishes.map(dish => (
          <View
            key={dish.id}
            className="dish-card"
            onClick={() => handleDishClick(dish.id)}
          >
            <Text className="dish-name">{dish.name}</Text>
            <Text className="dish-time">{dish.time}分钟</Text>
          </View>
        ))}
      </View>
      
      <View className="fab" onClick={handleCreateRecipe}>
        <Text>+</Text>
      </View>
    </View>
  )
}
