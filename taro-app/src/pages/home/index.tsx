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
  const { menuItems, users, loadFromStorage, removeMenuItem } = useStore()
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
      <View className="banner">
        <Text className="date">10月26日 · 周四</Text>
        <Text className="title">明日菜单</Text>
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
