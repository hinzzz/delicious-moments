# Taro Delicious Moments

食光集小程序版本 - 基于 Taro 框架开发

## 项目状态

✅ 阶段 1 完成：项目初始化
- Taro 项目结构创建
- 类型定义和常量迁移
- Zustand 状态管理配置
- 工具函数封装（存储、食材聚合）
- 样式系统（SCSS 变量和 mixins）

✅ 阶段 2 完成：页面结构
- 4 个主页面（home, recipes, summary, profile）
- 5 个子页面（menu-select, dish-detail, shopping-list, create-recipe, category-manager）
- TabBar 配置

## 运行项目

### 安装依赖
```bash
npm install
```

### 开发模式

**微信小程序**
```bash
npm run dev:weapp
```

然后使用微信开发者工具打开 `dist` 目录

**H5**
```bash
npm run dev:h5
```

### 构建生产版本
```bash
npm run build:weapp
```

## 项目结构

```
taro-app/
├── src/
│   ├── app.ts                 # 应用入口
│   ├── app.config.ts          # 全局配置（TabBar等）
│   ├── app.scss               # 全局样式
│   ├── pages/                 # 页面目录
│   │   ├── home/              # 明日菜单（首页）
│   │   ├── recipes/           # 菜谱库
│   │   ├── summary/           # 回忆录
│   │   ├── profile/           # 我的
│   │   ├── menu-select/       # 选菜页面
│   │   ├── dish-detail/       # 菜品详情
│   │   ├── shopping-list/     # 购物清单
│   │   ├── create-recipe/     # 创建菜谱
│   │   └── category-manager/  # 分类管理
│   ├── store/                 # Zustand 状态管理
│   ├── utils/                 # 工具函数
│   ├── types/                 # TypeScript 类型
│   ├── constants/             # 常量数据
│   ├── styles/                # 全局样式
│   └── assets/                # 静态资源
├── config/                    # Taro 配置
└── project.config.json        # 小程序配置
```

## 核心功能

### 已实现
- ✅ 明日菜单：查看和添加三餐菜品
- ✅ 选菜功能：从菜谱库选择菜品
- ✅ 购物清单：自动聚合食材并分类
- ✅ 菜谱浏览：按分类查看菜谱
- ✅ 菜品详情：查看食材和信息
- ✅ 数据持久化：使用本地存储

### 待完善
- ⏳ 创建菜谱功能
- ⏳ 分类管理功能
- ⏳ 回忆录统计功能
- ⏳ 用户设置功能
- ⏳ TabBar 图标（需要设计资源）

## 注意事项

1. **TabBar 图标**：当前配置中的图标路径需要实际的图标文件，建议尺寸 81x81px
2. **AppID**：`project.config.json` 中使用的是测试 AppID，发布前需要替换
3. **网络图片**：如果使用网络图片（如 picsum.photos），需要在小程序后台配置合法域名

## 下一步

参考 `.kiro/specs/migrate-to-taro/tasks.md` 继续完成：
- 阶段 6：样式精修
- 阶段 7：图标和资源
- 阶段 8：小程序特性集成
- 阶段 9：性能优化
- 阶段 10：测试
- 阶段 11：发布准备
