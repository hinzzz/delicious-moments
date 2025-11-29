import { View, Text, Image } from '@tarojs/components'
import { useState, useMemo } from 'react'
import { useStore } from '../../store'
import './index.scss'

type TimeRange = 'thisWeek' | 'lastWeek' | 'history'
type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export default function SummaryPage() {
  const { dishes, users, categories } = useStore()
  const [range, setRange] = useState<TimeRange>('thisWeek')
  const [activeDay, setActiveDay] = useState<WeekDay>('mon')
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set())
  
  // 统计数据
  const stats = useMemo(() => {
    const base = range === 'thisWeek' ? 12 : range === 'lastWeek' ? 15 : 520
    const topDish = dishes.reduce((max, dish) => 
      dish.cookedCount > max.cookedCount ? dish : max
    , dishes[0] || { name: '暂无', cookedCount: 0 })
    
    return {
      count: base,
      topDish: topDish.name,
      topChef: users[0]
    }
  }, [range, dishes, users])
  
  // 历史记录
  const historyDishes = useMemo(() => {
    const items = []
    const count = range === 'history' ? 20 : 3
    const meals = ['早餐', '午餐', '晚餐']
    
    for (let i = 0; i < Math.min(count, dishes.length); i++) {
      const dish = dishes[i % dishes.length]
      items.push({
        id: i,
        dish,
        meal: meals[i % 3],
        chef: users[i % users.length]
      })
    }
    return items
  }, [range, activeDay, dishes, users])
  
  const ranges: { id: TimeRange; label: string }[] = [
    { id: 'thisWeek', label: '本周' },
    { id: 'lastWeek', label: '上周' },
    { id: 'history', label: '历史' },
  ]
  
  const weekDays: { id: WeekDay; label: string }[] = [
    { id: 'mon', label: '周一' },
    { id: 'tue', label: '周二' },
    { id: 'wed', label: '周三' },
    { id: 'thu', label: '周四' },
    { id: 'fri', label: '周五' },
    { id: 'sat', label: '周六' },
    { id: 'sun', label: '周日' },
  ]
  
  const handleLike = (itemId: number) => {
    const newLiked = new Set(likedItems)
    if (newLiked.has(itemId)) {
      newLiked.delete(itemId)
    } else {
      newLiked.add(itemId)
    }
    setLikedItems(newLiked)
  }
  
  return (
    <View className="summary-page">
      <View className="header">
        <View className="header-left">
          <Text className="title">翻寻味</Text>
        </View>
        <View className="header-right">
          <View className="stat-item">
            <Text className="stat-number">{stats.count}</Text>
            <Text className="stat-label">顿饭</Text>
          </View>
          <View className="divider" />
          <View className="stat-item">
            <Text className="stat-number">{dishes.length}</Text>
            <Text className="stat-label">道菜</Text>
          </View>
        </View>
      </View>
      
      {/* 时间范围切换 */}
      <View className="range-switcher">
        {ranges.map(r => (
          <View
            key={r.id}
            className={`range-btn ${range === r.id ? 'active' : ''}`}
            onClick={() => setRange(r.id)}
          >
            <Text>{r.label}</Text>
          </View>
        ))}
      </View>
      
      {/* 周几切换 - 仅在本周/上周显示 */}
      {range !== 'history' && (
        <View className="weekday-switcher">
          {weekDays.map(day => (
            <View
              key={day.id}
              className={`weekday-btn ${activeDay === day.id ? 'active' : ''}`}
              onClick={() => setActiveDay(day.id)}
            >
              <Text>{day.label}</Text>
            </View>
          ))}
        </View>
      )}
      
      {/* 历史记录 */}
      <View className="history-section">
        <View className="history-card">
          <View className="history-header">
            <Text className="history-icon">📜</Text>
            <Text className="history-title">点了什么菜</Text>
          </View>
          <View className="history-list">
            {historyDishes.map((item) => {
              const category = categories.find(c => c.id === item.dish.categoryId)
              return (
              <View key={item.id} className="history-item">
                <Image className="dish-cover" src={item.dish.cover} mode="aspectFill" />
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
                    <View className="meal-tag">
                      <Text>{item.meal}</Text>
                    </View>
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
                <View className="item-actions">
                  <View 
                    className={`like-btn ${likedItems.has(item.id) ? 'liked' : ''}`}
                    onClick={() => handleLike(item.id)}
                  >
                    <Text className="like-icon">{likedItems.has(item.id) ? '❤️' : '🤍'}</Text>
                  </View>
                  <Image className="chef-avatar" src={item.chef.avatar} mode="aspectFill" />
                </View>
              </View>
            )
            })}
          </View>
        </View>
      </View>
      
      <View className="content">
        {/* 统计卡片行 */}
        <View className="stats-row">
          <View className="left-column">
            {/* 最爱吃卡片 */}
            <View className="stat-card main-stat">
              <View className="favorite-section">
                <Text className="favorite-label">最爱吃</Text>
                <View className="favorite-dish">
                  <Text className="dish-icon">👨‍🍳</Text>
                  <Text className="dish-name">{stats.topDish}</Text>
                </View>
              </View>
            </View>
            
            {/* 本周厨神卡片 */}
            <View className="stat-card chef-stat">
              <View className="chef-badge">本周厨神</View>
              <View className="chef-content">
                <Image className="chef-avatar-medium" src={stats.topChef.avatar} mode="aspectFill" />
                <Text className="chef-name">{stats.topChef.name}</Text>
              </View>
              <Text className="medal-icon">🏅</Text>
            </View>
          </View>
          
          {/* 口味偏好卡片 */}
          <View className="stat-card taste-card">
            <View className="card-header">
              <Text className="card-icon">📊</Text>
              <Text className="card-title">口味偏好</Text>
            </View>
            <View className="taste-bars">
              <View className="taste-item">
                <View className="taste-label-row">
                  <Text className="taste-label">🥬 蔬菜</Text>
                  <Text className="taste-percent">45%</Text>
                </View>
                <View className="progress-bar">
                  <View className="progress-fill vegetable" style="width: 45%" />
                </View>
              </View>
              <View className="taste-item">
                <View className="taste-label-row">
                  <Text className="taste-label">🥩 肉类</Text>
                  <Text className="taste-percent">30%</Text>
                </View>
                <View className="progress-bar">
                  <View className="progress-fill meat" style="width: 30%" />
                </View>
              </View>
              <View className="taste-item">
                <View className="taste-label-row">
                  <Text className="taste-label">🦐 海鲜</Text>
                  <Text className="taste-percent">25%</Text>
                </View>
                <View className="progress-bar">
                  <View className="progress-fill seafood" style="width: 25%" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
