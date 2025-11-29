📋 Kiro / AI 助手专用提示词 (System Prompt)

项目名称：食光集 (Delicious Moments)
项目定位：高颜值家庭膳食管理与买菜清单小程序
技术栈：Taro 4.0.7, React, TypeScript, Sass

## 1. 核心设计理念："奶油麻薯风" (Creamy Mochi Style)

### 色彩体系
- 菜单页：橙色渐变 #FFCC99 → #FFB380
- 菜谱页：黄色渐变 #FFE680 → #FFD54F  
- 翻寻味：绿色渐变 #B2EBD4 → #80CBC4
- 家庭页：紫色渐变 #D4B5E8 → #BA68C8
- 背景色：#F9F9F9
- 文本色：标题 #333333，次级 #999999

### 形态与圆角
- 卡片：24rpx 圆角
- 按钮：16rpx 圆角
- 标签：8rpx 圆角
- 拒绝尖角，界面元素圆润Q弹

### 光影与质感
- 卡片投影：0 2px 12px rgba(0, 0, 0, 0.02)
- 悬浮投影：0 8px 20px rgba(255, 171, 115, 0.15)

## 2. 核心数据模型

```typescript
interface Dish {
  id: string;
  name: string;
  cover: string;
  time: number; // 分钟
  tags: string[];
  ingredients: Ingredient[];
  categoryId: string;
  description?: string;
  cookedCount?: number;
  lastRating?: number;
}

interface MenuItem {
  id: string;
  dish: Dish;
  mealTime: 'breakfast' | 'lunch' | 'dinner';
  day: 'today' | 'tomorrow';
  selectorId: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  icon: string; // Emoji
}
```

## 3. 功能模块规范

### A. 底部导航 (TabBar)
- 四大模块：菜单、私房菜谱、翻寻味、家庭
- 使用小程序原生 TabBar

### B. 菜单页 (Home)
- 双 Banner 设计：今日菜单 + 明日菜单，中间圆形箭头分隔
- 点击 Banner 切换今日/明日，激活状态显示渐变背景
- 三餐切换：早中晚，图标72rpx，激活状态淡橙色渐变
- 菜品列表：菜名+分类（同行）、时间+标签（第二行）、点菜人头像
- 底部"生成买菜清单"按钮（淡橙色渐变）

### C. 私房菜谱 (Recipes)
- 黄色渐变 Banner + 搜索框
- 分类导航：4列网格
- 标签筛选：5列网格，最多显示10个
- 菜品卡片：菜名+分类（同行）、时间+标签（第二行）
- 右下角+号按钮（淡黄色渐变）

### D. 翻寻味 (Summary)
- 绿色渐变 Banner
- 时间范围：本周/上周/历史
- 周几切换：周一到周日（仅本周/上周显示）
- 点了什么菜：卡片列表，显示菜名+分类、餐次+标签、点赞按钮、厨师头像
- 统计卡片：最爱吃、本周厨神、口味偏好

### E. 家庭 (Profile)
- 紫色渐变 Header，显示用户信息
- 家庭成员网格展示
- 菜单项：分类管理、标签管理、关于食光集、退出登录

### F. 分类管理
- 搜索框：实时过滤分类
- 添加新分类：顶部虚线框按钮
- 分类列表：图标+名称，支持行内编辑和删除

### G. 标签管理
- 搜索框：实时过滤标签
- 添加新标签：顶部虚线框按钮
- 标签列表：标签名+使用次数，支持行内编辑和删除
- 编辑标签会更新所有使用该标签的菜品

### H. 智能买菜清单
- 算法：合并同名同单位食材 → 按类别分组
- 清单样式：checklist 风格，支持勾选

## 4. 设计规范

### 布局规范
- 菜名+分类同行，分类紧挨菜名（18rpx）
- 时间+标签第二行，标签最多2个（20rpx）
- 间距：$spacing-lg (32rpx), $spacing-md (24rpx), $spacing-sm (16rpx)

### 交互规范
- 删除操作使用 Taro.showModal 确认
- 成功操作使用 Taro.showToast 提示
- 所有列表项统一显示格式

## 5. 开发规范

### 技术栈
- 框架：Taro 4.0.7 + React + TypeScript
- 样式：Sass + 自定义变量系统
- 状态管理：Zustand
- 构建命令：npm run build:weapp

### 代码规范
- 页面结构：pages/[page-name]/index.tsx + index.scss + index.config.ts
- 使用 Taro 组件：View, Text, Image, Input, ScrollView
- 导航：Taro.navigateTo, Taro.navigateBack
- 图片：picsum.photos 或本地 assets
- 数据持久化：localStorage (Zustand persist)
