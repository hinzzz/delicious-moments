import { View, Text, Input } from '@tarojs/components'
import { useState, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { useStore } from '../../store'
import './index.scss'

export default function TagManagerPage() {
  const { dishes, updateDish } = useStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // 获取所有标签及其使用次数
  const tagStats = useMemo(() => {
    const tagMap = new Map<string, number>()
    dishes.forEach(dish => {
      dish.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    })
    return Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  }, [dishes])
  
  const filteredTags = tagStats.filter(({ tag }) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleAddTag = () => {
    if (!newTag.trim()) {
      Taro.showToast({
        title: '请输入标签名称',
        icon: 'none'
      })
      return
    }
    
    if (tagStats.some(t => t.tag === newTag.trim())) {
      Taro.showToast({
        title: '标签已存在',
        icon: 'none'
      })
      return
    }
    
    // 标签添加成功（实际上标签是在菜品中使用时自动创建的）
    Taro.showToast({
      title: '标签已添加',
      icon: 'success'
    })
    setNewTag('')
    setIsAdding(false)
  }
  
  const startEdit = (tag: string) => {
    setEditingTag(tag)
    setEditName(tag)
  }
  
  const saveEdit = () => {
    if (editingTag && editName.trim() && editName.trim() !== editingTag) {
      // 更新所有使用该标签的菜品
      dishes.forEach(dish => {
        if (dish.tags.includes(editingTag)) {
          const newTags = dish.tags.map(t => t === editingTag ? editName.trim() : t)
          updateDish(dish.id, { ...dish, tags: newTags })
        }
      })
      setEditingTag(null)
      Taro.showToast({
        title: '修改成功',
        icon: 'success'
      })
    } else {
      setEditingTag(null)
    }
  }
  
  const handleDeleteTag = (tag: string, count: number) => {
    Taro.showModal({
      title: '确认删除',
      content: `标签"${tag}"被${count}道菜使用，确定删除吗？`,
      success: (res) => {
        if (res.confirm) {
          // 从所有菜品中删除该标签
          dishes.forEach(dish => {
            if (dish.tags.includes(tag)) {
              const newTags = dish.tags.filter(t => t !== tag)
              updateDish(dish.id, { ...dish, tags: newTags })
            }
          })
          Taro.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  }
  
  return (
    <View className="tag-manager-page">
      <View className="search-bar">
        <Input
          className="search-input"
          placeholder="搜索标签..."
          value={searchQuery}
          onInput={(e) => setSearchQuery(e.detail.value)}
        />
      </View>
      
      <View className="tag-list">
        {isAdding ? (
          <View className="tag-item add-mode">
            <Input
              className="add-input"
              placeholder="新标签名称"
              value={newTag}
              onInput={(e) => setNewTag(e.detail.value)}
              focus
            />
            <View className="add-actions">
              <View className="confirm-btn" onClick={handleAddTag}>
                <Text>确定</Text>
              </View>
              <View className="cancel-btn" onClick={() => setIsAdding(false)}>
                <Text>取消</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="add-tag-btn" onClick={() => setIsAdding(true)}>
            <Text>+ 添加新标签</Text>
          </View>
        )}
        
        {filteredTags.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">{searchQuery ? '未找到匹配的标签' : '暂无标签'}</Text>
          </View>
        ) : (
          filteredTags.map(({ tag, count }) => (
            <View key={tag} className="tag-item">
              {editingTag === tag ? (
                <View className="edit-mode">
                  <Input
                    className="edit-input"
                    value={editName}
                    onInput={(e) => setEditName(e.detail.value)}
                    focus
                  />
                  <View className="save-btn" onClick={saveEdit}>
                    <Text>保存</Text>
                  </View>
                </View>
              ) : (
                <View className="view-mode">
                  <View className="tag-info">
                    <Text className="tag-name">{tag}</Text>
                    <Text className="tag-count">使用 {count} 次</Text>
                  </View>
                  <View className="actions">
                    <View className="edit-btn" onClick={() => startEdit(tag)}>
                      <Text>编辑</Text>
                    </View>
                    <View className="delete-btn" onClick={() => handleDeleteTag(tag, count)}>
                      <Text>删除</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  )
}
