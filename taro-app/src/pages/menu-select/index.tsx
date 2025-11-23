import { View, Text, Input, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useStore } from '../../store'
import { MealType } from '../../types'
import './index.scss'

export default function MenuSelectPage() {
  const router = useRouter()
  const { dishes, categories, users, addMenuItem } = useStore()
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || '')
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCounts, setSelectedCounts] = useState<Record<string, number>>({})
  const [showCart, setShowCart] = useState(false)
  const mealTime = (router.params.mealTime || 'lunch') as MealType
  
  // 获取所有标签
  const allTags = Array.from(new Set(dishes.flatMap(d => d.tags)))
  
  const filteredDishes = dishes.filter(d => {
    const matchCategory = d.categoryId === activeCategory
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchTags = selectedTags.length === 0 || selectedTags.some(tag => d.tags.includes(tag))
    return matchCategory && matchSearch && matchTags
  })
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }
  
  const updateCount = (dishId: string, delta: number) => {
    const current = selectedCounts[dishId] || 0
    const next = Math.max(0, current + delta)
    const newCounts = { ...selectedCounts }
    if (next === 0) {
      delete newCounts[dishId]
    } else {
      newCounts[dishId] = next
    }
    setSelectedCounts(newCounts)
  }
  
  const totalCount = Object.values(selectedCounts).reduce((a, b) => a + b, 0)
  
  const handleSubmit = () => {
    const timestamp = Date.now()
    let counter = 0
    
    Object.entries(selectedCounts).forEach(([dishId, count]) => {
      const dish = dishes.find(d => d.id === dishId)
      if (dish) {
        for (let i = 0; i < count; i++) {
          addMenuItem({
            id: `menu-${timestamp}-${counter++}`,
            dish,
            selectorId: selectedUserId,
            mealTime,
            date: new Date().toISOString()
          })
        }
      }
    })
    
    Taro.showToast({
      title: `已添加 ${totalCount} 道菜到${mealTime === 'breakfast' ? '早餐' : mealTime === 'lunch' ? '午餐' : '晚餐'}`,
      icon: 'success'
    })
    
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }
  
  return (
    <View className="menu-select-page">
      <View className="user-selector">
        <Text className="label">谁点的菜：</Text>
        {users.map(user => (
          <View
            key={user.id}
            className={`user-option ${selectedUserId === user.id ? 'active' : ''}`}
            onClick={() => setSelectedUserId(user.id)}
          >
            <Text>{user.name}</Text>
          </View>
        ))}
      </View>
      
      <View className="search-bar">
        <Input
          className="search-input"
          placeholder="搜索菜品..."
          value={searchQuery}
          onInput={(e) => setSearchQuery(e.detail.value)}
        />
      </View>
      
      <View className="categories">
        <View className="categories-grid">
          {categories.slice(0, 8).map(cat => (
            <View
              key={cat.id}
              className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <Text>{cat.icon} {cat.name}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {allTags.length > 0 && (
        <View className="tags-section">
          <Text className="tags-title">标签筛选：</Text>
          <View className="tags-grid">
            {allTags.slice(0, 8).map(tag => (
              <View
                key={tag}
                className={`tag-item ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      <View className="dish-list">
        {filteredDishes.map(dish => {
          const count = selectedCounts[dish.id] || 0
          return (
            <View key={dish.id} className="dish-card">
              <Image className="dish-image" src={dish.cover} mode="aspectFill" />
              
              <View className="dish-info">
                <Text className="dish-name">{dish.name}</Text>
                <Text className="dish-time">{dish.time}分钟</Text>
              </View>
              
              <View className="dish-actions">
                {count > 0 ? (
                  <View className="stepper">
                    <View className="stepper-btn" onClick={() => updateCount(dish.id, -1)}>
                      <Text>-</Text>
                    </View>
                    <Text className="stepper-count">{count}</Text>
                    <View className="stepper-btn" onClick={() => updateCount(dish.id, 1)}>
                      <Text>+</Text>
                    </View>
                  </View>
                ) : (
                  <View className="add-btn" onClick={() => updateCount(dish.id, 1)}>
                    <Text>+</Text>
                  </View>
                )}
              </View>
            </View>
          )
        })}
      </View>
      
      {totalCount > 0 && (
        <>
          {/* 购物车弹窗 */}
          {showCart && (
            <View className="cart-overlay" onClick={() => setShowCart(false)}>
              <View className="cart-popup" onClick={(e) => e.stopPropagation()}>
                <View className="cart-header">
                  <Text className="cart-title">已选菜品 ({totalCount}项)</Text>
                  <View className="clear-btn" onClick={() => setSelectedCounts({})}>
                    <Text>清空</Text>
                  </View>
                </View>
                <View className="cart-list">
                  {Object.entries(selectedCounts).map(([dishId, count]) => {
                    const dish = dishes.find(d => d.id === dishId)
                    if (!dish) return null
                    return (
                      <View key={dishId} className="cart-item">
                        <Image className="cart-dish-image" src={dish.cover} mode="aspectFill" />
                        <Text className="cart-dish-name">{dish.name}</Text>
                        <View className="cart-stepper">
                          <View className="stepper-btn" onClick={() => updateCount(dishId, -1)}>
                            <Text>-</Text>
                          </View>
                          <Text className="stepper-count">{count}</Text>
                          <View className="stepper-btn" onClick={() => updateCount(dishId, 1)}>
                            <Text>+</Text>
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </View>
              </View>
            </View>
          )}
          
          <View className="bottom-bar">
            <View className="selected-info" onClick={() => setShowCart(!showCart)}>
              <View className="cart-icon">
                <Text className="cart-count">{totalCount}</Text>
              </View>
              <Text>已选好</Text>
              <Text className="arrow">{showCart ? '▼' : '▲'}</Text>
            </View>
            <View className="submit-btn" onClick={handleSubmit}>
              <Text>确认提交</Text>
            </View>
          </View>
        </>
      )}
    </View>
  )
}
