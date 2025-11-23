import { View, Text } from '@tarojs/components'
import './index.scss'

export default function SummaryPage() {
  return (
    <View className="summary-page">
      <View className="header">
        <Text className="title">饮食回忆</Text>
        <Text className="subtitle">记录每一顿温馨</Text>
      </View>
      
      <View className="stats">
        <View className="stat-card">
          <Text className="stat-label">本周共烹饪</Text>
          <Text className="stat-value">12 顿</Text>
        </View>
        
        <View className="stat-card">
          <Text className="stat-label">最爱吃</Text>
          <Text className="stat-value">番茄炒蛋</Text>
        </View>
      </View>
      
      <View className="content">
        <Text className="section-title">更多统计功能开发中...</Text>
      </View>
    </View>
  )
}
