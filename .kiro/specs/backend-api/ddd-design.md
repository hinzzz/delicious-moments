# 食光集 DDD 领域驱动设计

## 1. 领域划分

### 1.1 限界上下文（Bounded Context）

```
┌─────────────────────────────────────────────────────────────┐
│                     食光集系统                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  用户上下文   │  │  家庭上下文   │  │  菜谱上下文   │      │
│  │   (User)    │  │  (Family)   │  │  (Recipe)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  菜单上下文   │  │  购物上下文   │  │  统计上下文   │      │
│  │   (Menu)    │  │ (Shopping)  │  │  (Stats)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 核心领域模型

**用户上下文 (User Context)**
- 聚合根: User
- 实体: UserProfile, Achievement
- 值对象: WeChatInfo, Avatar

**家庭上下文 (Family Context)**
- 聚合根: Family
- 实体: FamilyMember
- 值对象: InviteCode, MemberRole

**菜谱上下文 (Recipe Context)**
- 聚合根: Dish
- 实体: Ingredient, Category, Tag
- 值对象: NutritionInfo, CookingTime

**菜单上下文 (Menu Context)**
- 聚合根: MenuPlan
- 实体: MenuItem
- 值对象: MealTime, MenuDate

**购物上下文 (Shopping Context)**
- 聚合根: ShoppingList
- 实体: ShoppingItem
- 值对象: IngredientQuantity

**统计上下文 (Stats Context)**
- 聚合根: FamilyStats
- 实体: DishLike, CookingRecord
- 值对象: StatsPeriod, Ranking

---

## 2. 聚合设计

### 2.1 用户聚合 (User Aggregate)

**聚合根**: User
**边界**: 用户基本信息、认证信息、成就

```
User (聚合根)
├── id: UserId (值对象)
├── wechatInfo: WeChatInfo (值对象)
├── profile: UserProfile (实体)
└── achievements: List<UserAchievement> (实体)
```

### 2.2 家庭聚合 (Family Aggregate)

**聚合根**: Family
**边界**: 家庭信息、成员管理

```
Family (聚合根)
├── id: FamilyId (值对象)
├── name: FamilyName (值对象)
├── inviteCode: InviteCode (值对象)
├── creator: UserId (值对象)
└── members: List<FamilyMember> (实体)
```

### 2.3 菜谱聚合 (Dish Aggregate)

**聚合根**: Dish
**边界**: 菜谱信息、食材、标签

```
Dish (聚合根)
├── id: DishId (值对象)
├── name: DishName (值对象)
├── category: Category (实体引用)
├── nutritionInfo: NutritionInfo (值对象)
├── cookingTime: CookingTime (值对象)
├── ingredients: List<Ingredient> (实体)
├── tags: List<Tag> (实体引用)
└── statistics: DishStatistics (值对象)
```

### 2.4 菜单聚合 (MenuPlan Aggregate)

**聚合根**: MenuPlan
**边界**: 某个家庭某一天的菜单计划

```
MenuPlan (聚合根)
├── id: MenuPlanId (值对象)
├── familyId: FamilyId (值对象)
├── menuDate: MenuDate (值对象)
└── items: List<MenuItem> (实体)
    ├── id: MenuItemId
    ├── dish: DishId (值对象)
    ├── mealTime: MealTime (值对象)
    ├── selector: UserId (值对象)
    └── status: MenuItemStatus (值对象)
```

### 2.5 购物清单聚合 (ShoppingList Aggregate)

**聚合根**: ShoppingList
**边界**: 某个家庭某个时间段的购物清单

```
ShoppingList (聚合根)
├── id: ShoppingListId (值对象)
├── familyId: FamilyId (值对象)
├── period: DateRange (值对象)
├── status: ShoppingListStatus (值对象)
└── items: List<ShoppingItem> (实体)
    ├── id: ShoppingItemId
    ├── ingredientName: String
    ├── quantity: IngredientQuantity (值对象)
    ├── category: IngredientCategory (值对象)
    └── checked: Boolean
```

---

## 3. DDD 表结构设计

### 3.1 用户上下文表

#### 用户聚合根表 (user_aggregate)
```sql
CREATE TABLE user_aggregate (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID（聚合根ID）',
    openid VARCHAR(100) UNIQUE NOT NULL COMMENT '微信openid',
    union_id VARCHAR(100) COMMENT '微信unionid',
    session_key VARCHAR(100) COMMENT '会话密钥',
    version INT DEFAULT 0 COMMENT '乐观锁版本号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '软删除时间',
    INDEX idx_openid (openid),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户聚合根表';
```

#### 用户资料表 (user_profile)
```sql
CREATE TABLE user_profile (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '资料ID',
    user_id BIGINT UNIQUE NOT NULL COMMENT '用户ID（聚合根ID）',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar_url VARCHAR(255) COMMENT '头像URL',
    phone VARCHAR(20) COMMENT '手机号',
    gender TINYINT COMMENT '性别：0未知 1男 2女',
    birthday DATE COMMENT '生日',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES user_aggregate(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户资料表（实体）';
```

#### 用户成就表 (user_achievement)
```sql
CREATE TABLE user_achievement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '成就ID',
    user_id BIGINT NOT NULL COMMENT '用户ID（聚合根ID）',
    achievement_code VARCHAR(50) NOT NULL COMMENT '成就代码',
    achievement_name VARCHAR(50) NOT NULL COMMENT '成就名称',
    achievement_desc VARCHAR(200) COMMENT '成就描述',
    achievement_icon VARCHAR(10) COMMENT '成就图标',
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '解锁时间',
    FOREIGN KEY (user_id) REFERENCES user_aggregate(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_achievement (user_id, achievement_code),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户成就表（实体）';
```

