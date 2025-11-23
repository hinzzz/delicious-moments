import { View, Text, Image } from '@tarojs/components'
import { useState, useMemo } from 'react'
import { useStore } from '../../store'
import './index.scss'

type TimeRange = 'week' | 'month' | 'year'

export default function SummaryPage() {
  const { dishes, users } = useStore()
  const [range, setRange] = useState<TimeRange>('week')
  
  // 统计数据
  const stats = useMemo(() => {
    const base = range === 'week' ? 12 : range === 'month' ? 45 : 520
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
    const count = range === 'week' ? 5 : range === 'month' ? 12 : 20
    const meals = ['早餐', '午餐', '晚餐']
    const weekDays = ['一', '二', '三', '四', '五', '六', '日']
    
    for (let i = 0; i < Math.min(count, dishes.length); i++) {
      const dish = dishes[i % dishes.length]
      items.push({
        id: i,
        dish,
        date: `${range === 'week' ? '周' : ''}${weekDays[i % 7]}`,
        meal: meals[i % 3],
        chef: users[i % users.length]
      })
    }
    return items
  }, [range, dishes, users])
  
  const ranges: { id: TimeRange; label: string }[] = [
    { id: 'week', label: '本周' },
    { id: 'month', label: '本月' },
    { id: 'year', label: '本年' },
  ]
  
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
        
        {/* 历史记录 */}
        <View className="history-card">
          <View className="history-header">
            <Text className="history-icon">📜</Text>
            <Text className="history-title">点了什么菜</Text>
          </View>
          <View className="history-list">
            {historyDishes.map((item) => (
              <View key={item.id} className="history-item">
                <Image className="dish-cover" src={item.dish.cover} mode="aspectFill" />
                <View className="dish-info">
                  <Text className="dish-name">{item.dish.name}</Text>
                  <View className="dish-meta">
                    <View className="meal-tag">
                      <Text>{item.meal}</Text>
                    </View>
                    <Text className="dish-date">{item.date}</Text>
                  </View>
                </View>
                <Image className="chef-avatar" src={item.chef.avatar} mode="aspectFill" />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}
