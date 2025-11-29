import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useStore } from '../../store'
import { MealType } from '../../types'
import breakfastIcon from '../../assets/icons/早餐.png'
import lunchIcon from '../../assets/icons/午餐.png'
import dinnerIcon from '../../assets/icons/晚餐.png'
import './index.scss'

export default function HomePage() {
  const { menuItems, users, categories, loadFromStorage, removeMenuItem } = useStore()
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast')
  const [activeDay, setActiveDay] = useState<'today' | 'tomorrow'>('tomorrow')
  
  useEffect(() => {
    loadFromStorage()
  }, [])
  
  const currentItems = menuItems.filter(m => m.mealTime === activeMeal && m.day === activeDay)
  
  const handleAddDish = () => {
    console.log('点击去点菜，餐次:', activeMeal, '日期:', activeDay)
    Taro.navigateTo({
      url: `/pages/menu-select/index?mealTime=${activeMeal}&day=${activeDay}`,
      success: () => {
        console.log('导航成功')
      },
      fail: (err) => {
        console.error('导航失败:', err)
        Taro.showToast({
          title: '页面跳转失败',
          icon: 'none'
        })
      }
    })
  }
  
  const handleGenerateList = () => {
    Taro.navigateTo({
      url: '/pages/shopping-list/index'
    })
  }
  
  const handleDeleteDish = (e: any, id: string, dishName: string) => {
    e.stopPropagation()
    console.log('删除菜品:', id, dishName)
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除"${dishName}"吗？`,
      success: (res) => {
        if (res.confirm) {
          console.log('确认删除，调用 removeMenuItem')
          removeMenuItem(id)
          Taro.showToast({
            title: '已删除',
            icon: 'success'
          })
        }
      }
    })
  }
  
  return (
    <View className="home-page">
      <View className="banner-wrapper">
        <View 
          className={`banner-item ${activeDay === 'today' ? 'active' : ''}`}
          onClick={() => setActiveDay('today')}
        >
          <Text className="date">10月26日 · 周四</Text>
          <Text className="title">今日菜单</Text>
        </View>
        <View 
          className={`banner-item ${activeDay === 'tomorrow' ? 'active' : ''}`}
          onClick={() => setActiveDay('tomorrow')}
        >
          <Text className="date">10月27日 · 周五</Text>
          <Text className="title">明日菜单</Text>
        </View>
      </View>
      
      <View className="meal-tabs">
        {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(meal => {
          const mealConfig = {
            breakfast: { label: '早餐', icon: breakfastIcon },
            lunch: { label: '午餐', icon: lunchIcon },
            dinner: { label: '晚餐', icon: dinnerIcon }
          }
          const config = mealConfig[meal]
          
          return (
            <View
              key={meal}
              className={`meal-tab ${activeMeal === meal ? 'active' : ''}`}
              onClick={() => setActiveMeal(meal)}
            >
              <Image className="meal-icon" src={config.icon} mode="aspectFit" />
              <Text className="meal-label">{config.label}</Text>
            </View>
          )
        })}
      </View>
      
      <View className="dish-list">
        {currentItems.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">还没有想好吃啥？</Text>
            <Text className="empty-hint">点击右下角 + 添加菜品</Text>
          </View>
        ) : (
          <>
            {currentItems.map(item => {
              const user = users.find(u => u.id === item.selectorId)
              const category = categories.find(c => c.id === item.dish.categoryId)
              return (
                <View key={item.id} className="dish-item">
                  <Image className="dish-image" src={item.dish.cover} mode="aspectFill" />
                  <View className="dish-info">
                    <View className="dish-title-row">
                      <Text className="dish-name">{item.dish.name}</Text>
                      {category && (
                        <View className="dish-category">
                          <Text>{category.icon} {category.name}</Text>
                        </View>
                      )}
                    </View>
                    <View className="dish-meta">
                      <Text className="dish-time">{item.dish.time}分钟</Text>
                      {item.dish.tags.length > 0 && (
                        <View className="dish-tags">
                          {item.dish.tags.slice(0, 2).map((tag, idx) => (
                            <View key={idx} className="dish-tag">
                              <Text>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                  {user && (
                    <View className="user-badge">
                      <Image className="user-avatar" src={user.avatar} mode="aspectFill" />
                      <Text className="user-name">{user.name}</Text>
                    </View>
                  )}
                  <View 
                    className="delete-btn" 
                    onClick={(e) => handleDeleteDish(e, item.id, item.dish.name)}
                  >
                    <Text className="delete-icon">×</Text>
                  </View>
                </View>
              )
            })}
          </>
        )}
      </View>
      
      <View className="floating-add-btn" onClick={handleAddDish}>
        <Text className="add-icon">+</Text>
      </View>
      
      <View className="bottom-action">
        <View className="generate-btn" onClick={handleGenerateList}>
          <Text>生成买菜清单 ({menuItems.length})</Text>
        </View>
      </View>
    </View>
  )
}
