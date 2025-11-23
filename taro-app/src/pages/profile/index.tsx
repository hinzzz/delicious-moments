import { View, Text } from '@tarojs/components'
import { useStore } from '../../store'
import './index.scss'

export default function ProfilePage() {
  const { users } = useStore()
  
  return (
    <View className="profile-page">
      <View className="header">
        <Text className="title">我的</Text>
      </View>
      
      <View className="user-section">
        <Text className="section-title">家庭成员</Text>
        {users.map(user => (
          <View key={user.id} className="user-card">
            <Text className="user-name">{user.name}</Text>
          </View>
        ))}
      </View>
      
      <View className="menu-section">
        <View className="menu-item">
          <Text>设置</Text>
        </View>
        <View className="menu-item">
          <Text>关于</Text>
        </View>
      </View>
    </View>
  )
}
