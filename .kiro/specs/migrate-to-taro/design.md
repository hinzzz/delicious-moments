# 迁移到 Taro 小程序 - 设计文档

## 架构设计

### 整体架构

```
taro-delicious-moments/
├── src/
│   ├── app.config.ts          # 全局配置
│   ├── app.ts                 # 应用入口
│   ├── pages/                 # 页面目录
│   │   ├── home/              # 明日菜单
│   │   ├── recipes/           # 菜谱库
│   │   ├── summary/           # 回忆录
│   │   ├── profile/           # 我的
│   │   ├── menu-select/       # 选菜页面
│   │   ├── dish-detail/       # 菜品详情
│   │   ├── shopping-list/     # 购物清单
│   │   ├── create-recipe/     # 创建菜谱
│   │   └── category-manager/  # 分类管理
│   ├── components/            # 公共组件
│   │   ├── Navbar/
│   │   ├── DishCard/
│   │   ├── IngredientList/
│   │   └── MealTabs/
│   ├── utils/                 # 工具函数
│   │   ├── storage.ts         # 本地存储封装
│   │   └── aggregator.ts      # 食材聚合逻辑
│   ├── types/                 # 类型定义
│   │   └── index.ts
│   ├── constants/             # 常量
│   │   └── index.ts
│   └── assets/                # 静态资源
│       └── icons/
└── project.config.json        # 小程序配置
```

### 技术选型

| 需求 | 方案 | 理由 |
|------|------|------|
| 框架 | Taro 3.6+ | 支持 React，多端发布 |
| 样式 | Taro + SCSS | 小程序兼容性好，支持变量 |
| 图标 | Taro Icons / SVG 组件 | 小程序兼容 |
| 状态管理 | Zustand | 轻量，API 简单 |
| UI 组件 | 自定义 + NutUI-React-Taro | 保持设计风格 |

## 详细设计

### P-1: 项目结构迁移

**对应需求**: AC-1

**设计方案**:
1. 使用 Taro CLI 创建新项目：`taro init taro-delicious-moments`
2. 选择 React + TypeScript 模板
3. 复制 `types.ts` 和 `constants.ts` 到 `src/types/` 和 `src/constants/`
4. 配置 `tsconfig.json` 路径别名

**关键代码**:
```typescript
// src/app.config.ts
export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/recipes/index',
    'pages/summary/index',
    'pages/profile/index',
    'pages/menu-select/index',
    'pages/dish-detail/index',
    'pages/shopping-list/index',
    'pages/create-recipe/index',
    'pages/category-manager/index',
  ],
  tabBar: {
    color: '#C1C1C1',
    selectedColor: '#FFAB73',
    backgroundColor: '#FFFFFF',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '明日菜单',
        iconPath: 'assets/icons/calendar.png',
        selectedIconPath: 'assets/icons/calendar-active.png'
      },
      // ... 其他 tabs
    ]
  }
})
```

### P-2: 页面拆分和路由

**对应需求**: AC-2, AC-3

**设计方案**:
1. 将 `App.tsx` 中的 4 个 Tab 页面拆分为独立页面
2. 子页面使用 `Taro.navigateTo` 跳转
3. 页面间通过 URL 参数或全局状态传递数据

**页面映射**:
- `HomePage` → `pages/home/index.tsx`
- `RecipesPage` → `pages/recipes/index.tsx`
- `SummaryPage` → `pages/summary/index.tsx`
- `ProfilePage` → `pages/profile/index.tsx`

**路由示例**:
```typescript
// 跳转到菜品详情
Taro.navigateTo({
  url: `/pages/dish-detail/index?id=${dish.id}`
})

// 接收参数
const router = Taro.useRouter()
const dishId = router.params.id
```

### P-3: 状态管理

**对应需求**: AC-8

**设计方案**: 使用 Zustand + 本地存储

```typescript
// src/store/index.ts
import create from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'

interface AppState {
  menuItems: MenuItem[]
  dishes: Dish[]
  categories: Category[]
  addMenuItem: (item: MenuItem) => void
  removeMenuItem: (id: string) => void
  // ... 其他方法
}

export const useStore = create<AppState>(
  persist(
    (set) => ({
      menuItems: [],
      dishes: INITIAL_DISHES,
      categories: INITIAL_CATEGORIES,
      addMenuItem: (item) => set((state) => ({
        menuItems: [...state.menuItems, item]
      })),
      // ...
    }),
    {
      name: 'delicious-moments-storage',
      getStorage: () => ({
        getItem: (key) => Taro.getStorageSync(key),
        setItem: (key, value) => Taro.setStorageSync(key, value),
        removeItem: (key) => Taro.removeStorageSync(key),
      })
    }
  )
)
```

### P-4: 样式迁移

**对应需求**: AC-4

**设计方案**:
1. 创建 SCSS 变量文件定义颜色主题
2. 将 Tailwind 类转换为 SCSS 类
3. 使用 rpx 单位替代 px

```scss
// src/styles/variables.scss
$primary: #FFAB73;
$secondary: #A8D8B9;
$bg: #F9F9F9;
$text-main: #333333;
$text-sub: #666666;
$text-light: #C1C1C1;

// src/styles/mixins.scss
@mixin card {
  background: white;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.02);
}

@mixin button-primary {
  background: $primary;
  color: white;
  border-radius: 48rpx;
  font-weight: bold;
}
```

**组件样式示例**:
```tsx
// pages/home/index.tsx
import './index.scss'

<View className="home-page">
  <View className="banner">
    <Text className="title">明日菜单</Text>
  </View>
</View>

// pages/home/index.scss
.home-page {
  background: $bg;
  min-height: 100vh;
  
  .banner {
    @include card;
    padding: 32rpx;
    margin: 32rpx;
    background: linear-gradient(135deg, #FFAB73, #FF9A62);
    
    .title {
      font-size: 40rpx;
      font-weight: 900;
      color: white;
    }
  }
}
```

### P-5: 图标替换

**对应需求**: AC-6

**设计方案**: 使用 `@nutui/icons-react-taro`

```bash
npm install @nutui/icons-react-taro
```

**图标映射**:
```typescript
// 原代码
import { Calendar, BookOpen, PieChart, User } from 'lucide-react'

// 新代码
import { Calendar, Book, Chart, User } from '@nutui/icons-react-taro'
```

**自定义 SVG 图标**（如果 NutUI 没有）:
```tsx
// components/Icons/ChefHat.tsx
export const ChefHat = ({ size = 24, color = '#333' }) => (
  <View style={{ width: size, height: size }}>
    <Svg viewBox="0 0 24 24" fill={color}>
      <Path d="M..." />
    </Svg>
  </View>
)
```

### P-6: 数据持久化

**对应需求**: AC-5

**设计方案**: 封装存储工具类

```typescript
// src/utils/storage.ts
import Taro from '@tarojs/taro'

export const storage = {
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const value = Taro.getStorageSync(key)
      return value ? JSON.parse(value) : defaultValue
    } catch (e) {
      return defaultValue
    }
  },
  
  set(key: string, value: any): void {
    try {
      Taro.setStorageSync(key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage set error:', e)
    }
  },
  
  remove(key: string): void {
    Taro.removeStorageSync(key)
  },
  
  clear(): void {
    Taro.clearStorageSync()
  }
}

// 使用示例
storage.set('menuItems', menuItems)
const items = storage.get<MenuItem[]>('menuItems', [])
```

### P-7: 组件适配

**对应需求**: AC-3, AC-4

**Navbar 组件**:
```tsx
// components/Navbar/index.tsx
import { View, Text } from '@tarojs/components'
import { ArrowLeft } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

interface NavbarProps {
  title?: string
  subtitle?: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  subtitle,
  showBack = false,
  rightAction
}) => {
  const handleBack = () => {
    Taro.navigateBack()
  }
  
  return (
    <View className="navbar">
      {showBack && (
        <View className="back-btn" onClick={handleBack}>
          <ArrowLeft size={20} />
        </View>
      )}
      <View className="title-area">
        {title && <Text className="title">{title}</Text>}
        {subtitle && <Text className="subtitle">{subtitle}</Text>}
      </View>
      {rightAction && <View className="right-action">{rightAction}</View>}
    </View>
  )
}
```

### P-8: 小程序特性

**对应需求**: AC-7

**Toast 提示**:
```typescript
Taro.showToast({
  title: '添加成功',
  icon: 'success',
  duration: 2000
})
```

**Loading 状态**:
```typescript
Taro.showLoading({ title: '加载中...' })
// ... 异步操作
Taro.hideLoading()
```

**确认对话框**:
```typescript
const handleDelete = async () => {
  const res = await Taro.showModal({
    title: '确认删除',
    content: '确定要删除这道菜吗？'
  })
  
  if (res.confirm) {
    // 执行删除
  }
}
```

**分享功能**:
```typescript
// pages/dish-detail/index.tsx
useShareAppMessage(() => {
  return {
    title: `推荐一道菜：${dish.name}`,
    path: `/pages/dish-detail/index?id=${dish.id}`,
    imageUrl: dish.cover
  }
})
```

### P-9: 性能优化

**对应需求**: AC-9

**虚拟列表**:
```tsx
import { VirtualList } from '@tarojs/components'

<VirtualList
  height={500}
  itemData={dishes}
  itemCount={dishes.length}
  itemSize={100}
  item={({ data, index }) => (
    <DishCard dish={data[index]} />
  )}
/>
```

**图片懒加载**:
```tsx
<Image
  src={dish.cover}
  mode="aspectFill"
  lazyLoad
  className="dish-image"
/>
```

**减少 setData**:
```typescript
// 批量更新
const [state, setState] = useState({
  dishes: [],
  loading: false,
  error: null
})

// 一次性更新多个字段
setState(prev => ({
  ...prev,
  dishes: newDishes,
  loading: false
}))
```

## 数据流设计

```
用户操作 → 页面事件 → Zustand Store → 本地存储
                              ↓
                         UI 更新
```

## 测试策略

### 单元测试
- 工具函数（食材聚合逻辑）
- 存储封装

### 集成测试
- 页面跳转流程
- 数据持久化

### 手动测试
- 微信开发者工具预览
- 真机测试（iOS/Android）
- 不同屏幕尺寸适配

## 部署流程

1. 构建生产版本：`npm run build:weapp`
2. 微信开发者工具打开 `dist/` 目录
3. 上传代码到微信后台
4. 提交审核
5. 审核通过后发布

## 回滚方案

- 保留原 Web 版本作为备份
- 小程序可快速回退到上一版本
- 数据结构保持兼容
