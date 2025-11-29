import { View, Text, Input, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useStore } from '../../store'
import './index.scss'

export default function RecipesPage() {
  const { dishes, categories, loadFromStorage, deleteDish } = useStore()
  const [activeCategory, setActiveCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  useEffect(() => {
    loadFromStorage()
    if (categories.length > 0) {
      setActiveCategory(categories[0].id)
    }
  }, [])
  
  // 获取所有标签
  const allTags = Array.from(new Set(dishes.flatMap(d => d.tags)))
  
  // 筛选菜品
  const filteredDishes = dishes.filter(d => {
    const matchCategory = d.categoryId === activeCategory
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchTags = selectedTags.length === 0 || selectedTags.some(tag => d.tags.includes(tag))
    return matchCategory && matchSearch && matchTags
  })
  
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
  
  const handleDeleteDish = (e: any, dishId: string, dishName: string) => {
    e.stopPropagation()
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除"${dishName}"吗？此操作不可恢复。`,
      success: (res) => {
        if (res.confirm) {
          deleteDish(dishId)
          Taro.showToast({
            title: '已删除',
            icon: 'success'
          })
        }
      }
    })
  }
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }
  
  return (
    <View className="recipes-page">
      <View className="header">
        <View className="header-left">
          <Text className="title">私房菜谱</Text>
        </View>
        <View className="header-right">
          <Text className="count">{dishes.length}</Text>
          <Text className="count-label">道美味</Text>
        </View>
      </View>
      
      <View className="search-bar">
        <Input
          className="search-input"
          placeholder="搜索菜谱..."
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
          <View className="tags-list">
            {allTags.slice(0, 10).map(tag => (
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
        {filteredDishes.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">暂无菜谱</Text>
          </View>
        ) : (
          filteredDishes.map(dish => {
            const category = categories.find(c => c.id === dish.categoryId)
            return (
            <View
              key={dish.id}
              className="dish-card"
              onClick={() => handleDishClick(dish.id)}
            >
              <Image className="dish-cover" src={dish.cover} mode="aspectFill" />
              <View className="dish-info">
                <View className="dish-title-row">
                  <Text className="dish-name">{dish.name}</Text>
                  {category && (
                    <View className="dish-category">
                      <Text>{category.icon} {category.name}</Text>
                    </View>
                  )}
                </View>
                <View className="dish-meta">
                  <Text className="dish-time">⏱ {dish.time}分钟</Text>
                  {dish.tags.length > 0 && (
                    <View className="dish-tags">
                      {dish.tags.slice(0, 2).map(tag => (
                        <Text key={tag} className="dish-tag">{tag}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View 
                className="delete-btn" 
                onClick={(e) => handleDeleteDish(e, dish.id, dish.name)}
              >
                <Text className="delete-icon">×</Text>
              </View>
            </View>
          )
          })
        )}
      </View>
      
      <View className="fab" onClick={handleCreateRecipe}>
        <Text>+</Text>
      </View>
    </View>
  )
}
