import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useStore } from '../../store'
import { MealType } from '../../types'
import './index.scss'

export default function HomePage() {
  const { menuItems, users, loadFromStorage } = useStore()
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast')
  
  useEffect(() => {
    loadFromStorage()
  }, [])
  
  const currentItems = menuItems.filter(m => m.mealTime === activeMeal)
  
  const handleAddDish = () => {
    console.log('点击去点菜，餐次:', activeMeal)
    Taro.navigateTo({
      url: `/pages/menu-select/index?mealTime=${activeMeal}`,
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
  
  return (
    <View className="home-page">
      <View className="banner">
        <Text className="date">10月26日 · 周四</Text>
        <Text className="title">明日菜单</Text>
      </View>
      
      <View className="meal-tabs">
        {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(meal => (
          <View
            key={meal}
            className={`meal-tab ${activeMeal === meal ? 'active' : ''}`}
            onClick={() => setActiveMeal(meal)}
          >
            <Text className="meal-label">
              {meal === 'breakfast' ? '早餐' : meal === 'lunch' ? '午餐' : '晚餐'}
            </Text>
          </View>
        ))}
      </View>
      
      <View className="dish-list">
        {currentItems.length === 0 ? (
          <View className="empty-state" onClick={handleAddDish}>
            <Text className="empty-text">还没有想好吃啥？</Text>
            <Text className="empty-action">去点菜 +</Text>
          </View>
        ) : (
          <>
            {currentItems.map(item => {
              const user = users.find(u => u.id === item.selectorId)
              return (
                <View key={item.id} className="dish-item">
                  <Image className="dish-image" src={item.dish.cover} mode="aspectFill" />
                  <View className="dish-info">
                    <Text className="dish-name">{item.dish.name}</Text>
                    <Text className="dish-time">{item.dish.time}分钟</Text>
                  </View>
                  {user && (
                    <View className="user-badge">
                      <Image className="user-avatar" src={user.avatar} mode="aspectFill" />
                      <Text className="user-name">{user.name}</Text>
                    </View>
                  )}
                </View>
              )
            })}
            <View className="add-more" onClick={handleAddDish}>
              <Text>+ 加一道菜</Text>
            </View>
          </>
        )}
      </View>
      
      <View className="bottom-action">
        <View className="generate-btn" onClick={handleGenerateList}>
          <Text>生成买菜清单 ({menuItems.length})</Text>
        </View>
      </View>
    </View>
  )
}
