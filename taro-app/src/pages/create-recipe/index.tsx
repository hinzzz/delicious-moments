import { View, Text, Input, Textarea } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { useStore } from '../../store'
import { Dish, Ingredient } from '../../types'
import './index.scss'

export default function CreateRecipePage() {
  const { categories, addDish } = useStore()
  const [name, setName] = useState('')
  const [time, setTime] = useState('15')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [tags, setTags] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<Partial<Ingredient>[]>([
    { name: '', quantity: 1, unit: '个', category: 'vegetable' }
  ])
  
  const SUGGESTED_TAGS = ['家常', '快手', '减脂', '下饭', '汤羹', '甜点']
  
  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag))
    } else {
      setTags([...tags, tag])
    }
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
      cover: 'https://picsum.photos/400/400',
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
        <View className="form-item">
          <Text className="label">菜品名称</Text>
          <Input
            className="input"
            placeholder="例如：番茄炒蛋"
            value={name}
            onInput={(e) => setName(e.detail.value)}
          />
        </View>
        
        <View className="form-item">
          <Text className="label">烹饪时间（分钟）</Text>
          <Input
            className="input"
            type="number"
            value={time}
            onInput={(e) => setTime(e.detail.value)}
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
          <Text className="label">标签</Text>
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
