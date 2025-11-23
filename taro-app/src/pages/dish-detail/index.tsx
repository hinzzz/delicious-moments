import { View, Text } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { useStore } from '../../store'
import './index.scss'

export default function DishDetailPage() {
  const router = useRouter()
  const { dishes } = useStore()
  const dish = dishes.find(d => d.id === router.params.id)
  
  if (!dish) {
    return (
      <View className="dish-detail-page">
        <Text>菜品不存在</Text>
      </View>
    )
  }
  
  return (
    <View className="dish-detail-page">
      <View className="header">
        <Text className="title">{dish.name}</Text>
        <Text className="time">{dish.time}分钟 · {dish.calories}卡</Text>
      </View>
      
      <View className="section">
        <Text className="section-title">食材</Text>
        {dish.ingredients.map((ing, idx) => (
          <View key={idx} className="ingredient-item">
            <Text>{ing.name}</Text>
            <Text>{ing.quantity} {ing.unit}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
