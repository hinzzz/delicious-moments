import { View, Text, Input, Textarea, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { useStore } from '../../store'
import { Dish, Ingredient } from '../../types'
import './index.scss'

export default function CreateRecipePage() {
  const { categories, addDish } = useStore()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [time, setTime] = useState('15')
  const [cover, setCover] = useState('https://picsum.photos/400/400')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [customCategory, setCustomCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [showTagInput, setShowTagInput] = useState(false)
  const [customTag, setCustomTag] = useState('')
  const [customTags, setCustomTags] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<Partial<Ingredient>[]>([
    { name: '', quantity: 1, unit: '个', category: 'vegetable' }
  ])
  
  const SUGGESTED_TAGS = ['家常', '快手', '减脂', '下饭', '汤羹', '甜点', '宴客', '早餐', '夜宵', '素食']
  
  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }
  
  const addCustomCategory = () => {
    const trimmed = customCategory.trim()
    if (!trimmed) {
      setShowCategoryInput(false)
      setCustomCategory('')
      return
    }
    
    // 这里可以调用 store 的 addCategory 方法添加新分类
    // 暂时只是添加到自定义标签列表
    Taro.showToast({
      title: '分类功能开发中',
      icon: 'none'
    })
    setShowCategoryInput(false)
    setCustomCategory('')
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
  
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
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
  
  const handleSave = () => {
    if (!name.trim()) {
      Taro.showToast({
        title: '请输入菜品名称',
        icon: 'none'
      })
      return
    }
    
    const validIngredients = ingredients.filter(i => i.name) as Ingredient[]
    
    const newDish: Dish = {
      id: `dish-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      cover,
      calories: 0,
      time: Number(time) || 15,
      tags,
      ingredients: validIngredients,
      categoryId,
      cookedCount: 0,
      lastRating: 0
    }
    
    addDish(newDish)
    
    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }
  
  return (
    <View className="create-recipe-page">
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
              placeholder="菜品名称，如：番茄炒蛋"
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
            {!showCategoryInput ? (
              <View
                className="category-tag add-custom"
                onClick={() => setShowCategoryInput(true)}
              >
                <Text>+ 自定义</Text>
              </View>
            ) : (
              <View className="custom-category-input">
                <Input
                  className="category-input"
                  placeholder="输入分类名"
                  value={customCategory}
                  focus={showCategoryInput}
                  onInput={(e) => setCustomCategory(e.detail.value)}
                  onConfirm={addCustomCategory}
                  onBlur={addCustomCategory}
                />
              </View>
            )}
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
        <View className="save-btn" onClick={handleSave}>
          <Text>保存菜谱</Text>
        </View>
      </View>
    </View>
  )
}
