import { View, Text, Input } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { useStore } from '../../store'
import './index.scss'

export default function CategoryManagerPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleAdd = () => {
    if (newCatName.trim()) {
      addCategory({
        id: `cat-${Date.now()}`,
        name: newCatName.trim(),
        icon: '🍽️'
      })
      setNewCatName('')
      setIsAdding(false)
      Taro.showToast({
        title: '添加成功',
        icon: 'success'
      })
    }
  }
  
  const startEdit = (id: string, name: string) => {
    setEditingId(id)
    setEditName(name)
  }
  
  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateCategory(editingId, editName.trim())
      setEditingId(null)
      Taro.showToast({
        title: '修改成功',
        icon: 'success'
      })
    }
  }
  
  const handleDelete = (id: string, name: string) => {
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除分类"${name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          deleteCategory(id)
          Taro.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  }
  
  return (
    <View className="category-manager-page">
      <View className="search-bar">
        <Input
          className="search-input"
          placeholder="搜索分类..."
          value={searchQuery}
          onInput={(e) => setSearchQuery(e.detail.value)}
        />
      </View>
      
      <View className="category-list">
        {isAdding ? (
          <View className="category-item add-mode">
            <Input
              className="add-input"
              placeholder="新分类名称"
              value={newCatName}
              onInput={(e) => setNewCatName(e.detail.value)}
              focus
            />
            <View className="add-actions">
              <View className="confirm-btn" onClick={handleAdd}>
                <Text>确定</Text>
              </View>
              <View className="cancel-btn" onClick={() => setIsAdding(false)}>
                <Text>取消</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="add-category-btn" onClick={() => setIsAdding(true)}>
            <Text>+ 添加新分类</Text>
          </View>
        )}
        
        {filteredCategories.map(cat => (
          <View key={cat.id} className="category-item">
            {editingId === cat.id ? (
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
                <View className="cat-info">
                  <Text className="cat-icon">{cat.icon}</Text>
                  <Text className="cat-name">{cat.name}</Text>
                </View>
                <View className="actions">
                  <View className="edit-btn" onClick={() => startEdit(cat.id, cat.name)}>
                    <Text>编辑</Text>
                  </View>
                  <View className="delete-btn" onClick={() => handleDelete(cat.id, cat.name)}>
                    <Text>删除</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}
