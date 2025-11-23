import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useStore } from '../../store'
import './index.scss'

export default function ProfilePage() {
  const { users } = useStore()
  const currentUser = users[0]
  
  const menuItems = [
    { label: '消息通知', icon: '🔔', color: 'blue' },
    { label: '饮食偏好设置', icon: '👨‍🍳', color: 'orange' },
    { label: '分类管理', icon: '📂', color: 'green', path: '/pages/category-manager/index' },
    { label: '关于食光集', icon: '📖', color: 'purple' },
    { label: '退出登录', icon: '🚪', color: 'gray' },
  ]
  
  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      Taro.navigateTo({ url: item.path })
    } else {
      Taro.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    }
  }
  
  const handleInvite = () => {
    Taro.showToast({
      title: '邀请功能开发中',
      icon: 'none'
    })
  }
  
  return (
    <View className="profile-page">
      {/* 用户信息卡片 */}
      <View className="user-header">
        <View className="header-top">
          <Text className="page-title">个人中心</Text>
          <View className="settings-btn">
            <Text>⚙️</Text>
          </View>
        </View>
        
        <View className="user-info">
          <View className="avatar-wrapper">
            <Image className="avatar" src={currentUser.avatar} mode="aspectFill" />
            <View className="edit-badge">
              <Text>✏️</Text>
            </View>
          </View>
          <View className="user-details">
            <Text className="user-name">{currentUser.name}</Text>
            <View className="family-id">
              <Text>ID: 882910</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View className="content">
        {/* 家庭成员 */}
        <View className="section-card">
          <View className="section-header">
            <Text className="section-icon">❤️</Text>
            <Text className="section-title">家庭成员</Text>
          </View>
          <View className="members-grid">
            {users.map(user => (
              <View key={user.id} className="member-card">
                <Image className="member-avatar" src={user.avatar} mode="aspectFill" />
                <Text className="member-name">{user.name}</Text>
                {user.id === currentUser.id && (
                  <View className="me-badge">
                    <Text>我</Text>
                  </View>
                )}
              </View>
            ))}
            <View className="invite-card" onClick={handleInvite}>
              <View className="invite-icon-wrapper">
                <Text className="invite-icon">+</Text>
              </View>
              <Text className="invite-text">邀请</Text>
            </View>
          </View>
        </View>
        
        {/* 设置菜单 */}
        <View className="menu-card">
          {menuItems.map((item, idx) => (
            <View 
              key={idx} 
              className="menu-item"
              onClick={() => handleMenuClick(item)}
            >
              <View className="menu-left">
                <Text className={`menu-icon ${item.color}`}>{item.icon}</Text>
                <Text className="menu-label">{item.label}</Text>
              </View>
              <Text className="menu-arrow">→</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
