import { View, Text, Image, Input, Textarea } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { useStore } from '../../store'
import { Ingredient } from '../../types'
import './index.scss'

export default function DishDetailPage() {
  const router = useRouter()
  const { dishes, categories, updateDish } = useStore()
  const dish = dishes.find(d => d.id === router.params.id)
  
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(dish?.name || '')
  const [description, setDescription] = useState(dish?.description || '')
  const [time, setTime] = useState(String(dish?.time || 15))
  const [cover, setCover] = useState(dish?.cover || '')
  const [categoryId, setCategoryId] = useState(dish?.categoryId || '')
  const [tags, setTags] = useState<string[]>(dish?.tags || [])
  const [customTag, setCustomTag] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [customTags, setCustomTags] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<Partial<Ingredient>[]>(dish?.ingredients || [])
  
  const SUGGESTED_TAGS = ['家常', '快手', '减脂', '下饭', '汤羹', '甜点', '宴客', '早餐', '夜宵', '素食']
  
  if (!dish) {
    return (
      <View className="dish-detail-page">
        <Text>菜品不存在</Text>
      </View>
    )
  }
  
  const category = categories.find(c => c.id === dish.categoryId)
  
  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }
  
  const addCustomTag = () => {
    const trimmed = customTag.trim()
    if (!trimmed) {
      setShowTagInput(false)
      setCustomTag('')
      return
    }
    if (tags.includes(trimmed) || SUGGESTED_TAGS.includes(trimmed)) {
      Taro.showToast({
        title: '标签已存在',
        icon: 'none'
      })
      setCustomTag('')
      return
    }
    setTags([...tags, trimmed])
    setCustomTags([...customTags, trimmed])
    setCustomTag('')
    setShowTagInput(false)
  }
  
  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setCover(res.tempFilePaths[0])
      }
    })
  }
  
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 1, unit: '个', category: 'vegetable' }])
  }
  
  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const newList = [...ingredients]
    newList[index] = { ...newList[index], [field]: value }
    setIngredients(newList)
  }
  
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }
  
  const handleEdit = () => {
    setIsEditing(true)
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setName(dish.name)
    setDescription(dish.description || '')
    setTime(String(dish.time))
    setCover(dish.cover)
    setCategoryId(dish.categoryId)
    setTags(dish.tags)
    setIngredients(dish.ingredients)
  }
  
  const handleSave = () => {
    if (!name.trim()) {
      Taro.showToast({
        title: '请输入菜品名称',
        icon: 'none'
      })
      return
    }
    
    const validIngredients = ingredients.filter(i => i.name) as Ingredient[]
    
    updateDish(dish.id, {
      name: name.trim(),
      description: description.trim(),
      cover,
      time: Number(time) || 15,
      tags,
      ingredients: validIngredients,
      categoryId
    })
    
    setIsEditing(false)
    
    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    })
  }
  
  if (!isEditing) {
    return (
      <View className="dish-detail-page">
        <View className="detail-section">
          <View className="cover-section">
            <Image className="cover-image" src={dish.cover} mode="aspectFill" />
            <View className="info-overlay">
              <Text className="dish-name">{dish.name}</Text>
              <Text className="dish-meta">{dish.time}分钟 · {category?.icon} {category?.name}</Text>
            </View>
          </View>
          
          {dish.description && (
            <View className="info-card">
              <Text className="card-label">菜品描述</Text>
              <Text className="description-text">{dish.description}</Text>
            </View>
          )}
          
          {dish.tags.length > 0 && (
            <View className="info-card">
              <Text className="card-label">标签</Text>
              <View className="tags-display">
                {dish.tags.map(tag => (
                  <View key={tag} className="tag-badge">
                    <Text>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View className="info-card">
            <Text className="card-label">食材清单</Text>
            {dish.ingredients.map((ing, idx) => (
              <View key={idx} className="ingredient-row">
                <Text className="ing-name">{ing.name}</Text>
                <Text className="ing-amount">{ing.quantity} {ing.unit}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View className="bottom-action">
          <View className="edit-btn" onClick={handleEdit}>
            <Text>编辑菜谱</Text>
          </View>
        </View>
      </View>
    )
  }
  
  return (
    <View className="dish-detail-page editing">
      <View className="form-section">
        <View className="form-item cover-section">
          <View className="cover-upload" onClick={handleChooseImage}>
            <Image className="cover-image" src={cover} mode="aspectFill" />
            <View className="upload-overlay">
              <Text className="upload-text">点击更换</Text>
            </View>
          </View>
          
          <View className="basic-info">
            <Input
              className="name-input"
              placeholder="菜品名称"
              value={name}
              onInput={(e) => setName(e.detail.value)}
            />
            <View className="time-input-wrapper">
              <Input
                className="time-input"
                type="number"
                placeholder="烹饪时间"
                value={time}
                onInput={(e) => setTime(e.detail.value)}
              />
              <Text className="time-unit">分钟</Text>
            </View>
          </View>
        </View>
        
        <View className="form-item">
          <Text className="label">菜品描述</Text>
          <Textarea
            className="textarea"
            placeholder="简单描述一下这道菜的特色..."
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
            maxlength={200}
          />
        </View>
        
        <View className="form-item">
          <Text className="label">所属分类</Text>
          <View className="category-list">
            {categories.map(cat => (
              <View
                key={cat.id}
                className={`category-tag ${categoryId === cat.id ? 'active' : ''}`}
                onClick={() => setCategoryId(cat.id)}
              >
                <Text>{cat.icon} {cat.name}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View className="form-item">
          <View className="label-row">
            <Text className="label">标签</Text>
            <Text className="label-hint">已选 {tags.length} 个</Text>
          </View>
          
          <View className="tag-list">
            {SUGGESTED_TAGS.map(tag => (
              <View
                key={tag}
                className={`tag-item ${tags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                <Text>{tag}</Text>
              </View>
            ))}
            {customTags.map(tag => (
              <View
                key={tag}
                className={`tag-item custom ${tags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                <Text>{tag}</Text>
              </View>
            ))}
            {!showTagInput ? (
              <View
                className="tag-item add-custom"
                onClick={() => setShowTagInput(true)}
              >
                <Text>+ 自定义</Text>
              </View>
            ) : (
              <View className="custom-tag-inline">
                <Input
                  className="tag-input-inline"
                  placeholder="输入标签"
                  value={customTag}
                  focus={showTagInput}
                  onInput={(e) => setCustomTag(e.detail.value)}
                  onConfirm={addCustomTag}
                  onBlur={addCustomTag}
                />
              </View>
            )}
          </View>
        </View>
        
        <View className="form-item">
          <View className="label-row">
            <Text className="label">食材清单</Text>
            <View className="add-ingredient-btn" onClick={addIngredient}>
              <Text>+ 添加</Text>
            </View>
          </View>
          <View className="ingredient-list">
            {ingredients.map((ing, idx) => (
              <View key={idx} className="ingredient-item">
                <Input
                  className="ing-name"
                  placeholder="食材名"
                  value={ing.name}
                  onInput={(e) => updateIngredient(idx, 'name', e.detail.value)}
                />
                <Input
                  className="ing-quantity"
                  type="number"
                  value={String(ing.quantity)}
                  onInput={(e) => updateIngredient(idx, 'quantity', Number(e.detail.value))}
                />
                <Input
                  className="ing-unit"
                  placeholder="单位"
                  value={ing.unit}
                  onInput={(e) => updateIngredient(idx, 'unit', e.detail.value)}
                />
                {ingredients.length > 1 && (
                  <View className="remove-btn" onClick={() => removeIngredient(idx)}>
                    <Text>×</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
      
      <View className="bottom-action">
        <View className="cancel-btn" onClick={handleCancel}>
          <Text>取消</Text>
        </View>
        <View className="save-btn" onClick={handleSave}>
          <Text>保存</Text>
        </View>
      </View>
    </View>
  )
}
