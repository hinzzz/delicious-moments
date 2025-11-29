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


### 3.2 家庭上下文表

#### 家庭聚合根表 (family_aggregate)
```sql
CREATE TABLE family_aggregate (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '家庭ID（聚合根ID）',
    name VARCHAR(100) NOT NULL COMMENT '家庭名称',
    invite_code VARCHAR(20) UNIQUE NOT NULL COMMENT '邀请码（值对象）',
    creator_id BIGINT NOT NULL COMMENT '创建者用户ID',
    status TINYINT DEFAULT 1 COMMENT '状态：1正常 0已解散',
    version INT DEFAULT 0 COMMENT '乐观锁版本号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '软删除时间',
    FOREIGN KEY (creator_id) REFERENCES user_aggregate(id),
    INDEX idx_invite_code (invite_code),
    INDEX idx_creator_id (creator_id),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家庭聚合根表';
```

#### 家庭成员表 (family_member)
```sql
CREATE TABLE family_member (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '成员ID',
    family_id BIGINT NOT NULL COMMENT '家庭ID（聚合根ID）',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role VARCHAR(20) NOT NULL COMMENT '角色：creator创建者 member成员',
    nickname VARCHAR(50) COMMENT '家庭内昵称',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
    FOREIGN KEY (family_id) REFERENCES family_aggregate(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user_aggregate(id) ON DELETE CASCADE,
    UNIQUE KEY uk_family_user (family_id, user_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家庭成员表（实体）';
```

---

### 3.3 菜谱上下文表

#### 菜谱聚合根表 (dish_aggregate)
```sql
CREATE TABLE dish_aggregate (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '菜谱ID（聚合根ID）',
    family_id BIGINT NOT NULL COMMENT '所属家庭ID',
    creator_id BIGINT NOT NULL COMMENT '创建者用户ID',
    name VARCHAR(100) NOT NULL COMMENT '菜名',
    cover_url VARCHAR(255) COMMENT '封面图URL',
    description TEXT COMMENT '描述',
    
    -- 营养信息（值对象）
    calories INT DEFAULT 0 COMMENT '卡路里',
    protein DECIMAL(10,2) COMMENT '蛋白质(g)',
    fat DECIMAL(10,2) COMMENT '脂肪(g)',
    carbohydrate DECIMAL(10,2) COMMENT '碳水化合物(g)',
    
    -- 烹饪信息（值对象）
    cooking_time INT DEFAULT 0 COMMENT '烹饪时间(分钟)',
    difficulty TINYINT DEFAULT 1 COMMENT '难度：1简单 2中等 3困难',
    serving_size INT DEFAULT 2 COMMENT '份量（人数）',
    
    -- 统计信息（值对象）
    cooked_count INT DEFAULT 0 COMMENT '制作次数',
    like_count INT DEFAULT 0 COMMENT '点赞次数',
    avg_rating DECIMAL(3,2) DEFAULT 0 COMMENT '平均评分',
    
    category_id BIGINT COMMENT '分类ID',
    status TINYINT DEFAULT 1 COMMENT '状态：1正常 0已删除',
    version INT DEFAULT 0 COMMENT '乐观锁版本号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '软删除时间',
    
    FOREIGN KEY (family_id) REFERENCES family_aggregate(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES user_aggregate(id) ON DELETE SET NULL,
    INDEX idx_family_id (family_id),
    INDEX idx_category_id (category_id),
    INDEX idx_cooked_count (cooked_count),
    INDEX idx_deleted_at (deleted_at),
    FULLTEXT INDEX ft_name (name) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜谱聚合根表';
```

#### 食材表 (dish_ingredient)
```sql
CREATE TABLE dish_ingredient (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '食材ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID（聚合根ID）',
    name VARCHAR(100) NOT NULL COMMENT '食材名称',
    quantity DECIMAL(10,2) NOT NULL COMMENT '数量',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    category VARCHAR(20) NOT NULL COMMENT '类别：vegetable蔬菜 meat肉类 seafood海鲜 seasoning调料 other其他',
    sort_order INT DEFAULT 0 COMMENT '排序',
    FOREIGN KEY (dish_id) REFERENCES dish_aggregate(id) ON DELETE CASCADE,
    INDEX idx_dish_id (dish_id),
    INDEX idx_name_unit (name, unit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食材表（实体）';
```

#### 分类表 (dish_category)
```sql
CREATE TABLE dish_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    family_id BIGINT NOT NULL COMMENT '所属家庭ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    icon VARCHAR(10) COMMENT '图标(emoji)',
    sort_order INT DEFAULT 0 COMMENT '排序',
    dish_count INT DEFAULT 0 COMMENT '菜谱数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (family_id) REFERENCES family_aggregate(id) ON DELETE CASCADE,
    INDEX idx_family_id (family_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表（实体）';
```

#### 标签表 (dish_tag)
```sql
CREATE TABLE dish_tag (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '标签ID',
    family_id BIGINT NOT NULL COMMENT '所属家庭ID',
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    color VARCHAR(20) COMMENT '标签颜色',
    use_count INT DEFAULT 0 COMMENT '使用次数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (family_id) REFERENCES family_aggregate(id) ON DELETE CASCADE,
    INDEX idx_family_id (family_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表（实体）';
```

#### 菜谱标签关联表 (dish_tag_relation)
```sql
CREATE TABLE dish_tag_relation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID',
    tag_id BIGINT NOT NULL COMMENT '标签ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (dish_id) REFERENCES dish_aggregate(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES dish_tag(id) ON DELETE CASCADE,
    UNIQUE KEY uk_dish_tag (dish_id, tag_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜谱标签关联表';
```

---

### 3.4 菜单上下文表

#### 菜单计划聚合根表 (menu_plan_aggregate)
```sql
CREATE TABLE menu_plan_aggregate (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '菜单计划ID（聚合根ID）',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    menu_date DATE NOT NULL COMMENT '菜单日期',
    status TINYINT DEFAULT 1 COMMENT '状态：1计划中 2已完成 3已取消',
    total_calories INT DEFAULT 0 COMMENT '总卡路里',
    total_items INT DEFAULT 0 COMMENT '菜品总数',
    version INT DEFAULT 0 COMMENT '乐观锁版本号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (family_id) REFERENCES family_aggregate(id) ON DELETE CASCADE,
    UNIQUE KEY uk_family_date (family_id, menu_date),
    INDEX idx_menu_date (menu_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单计划聚合根表';
```

#### 菜单项表 (menu_item)
```sql
CREATE TABLE menu_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '菜单项ID',
    menu_plan_id BIGINT NOT NULL COMMENT '菜单计划ID（聚合根ID）',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID',
    selector_id BIGINT NOT NULL COMMENT '点菜人ID',
    meal_time VARCHAR(20) NOT NULL COMMENT '餐次：breakfast早餐 lunch午餐 dinner晚餐',
    day_type VARCHAR(20) NOT NULL COMMENT '类型：today今日 tomorrow明日',
    status TINYINT DEFAULT 1 COMMENT '状态：1待制作 2制作中 3已完成',
    actual_cooking_time INT COMMENT '实际烹饪时间',
    notes TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (menu_plan_id) REFERENCES menu_plan_aggregate(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dish_aggregate(id) ON DELETE CASCADE,
    FOREIGN KEY (selector_id) REFERENCES user_aggregate(id) ON DELETE SET NULL,
    INDEX idx_menu_plan_id (menu_plan_id),
    INDEX idx_dish_id (dish_id),
    INDEX idx_selector_id (selector_id),
    INDEX idx_meal_time (meal_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单项表（实体）';
```

---

### 3.5 购物上下文表

#### 购物清单聚合根表 (shopping_list_aggregate)
```sql
CREATE TABLE shopping_list_aggregate (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '购物清单ID（聚合根ID）',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    start_date DATE NOT NULL COMMENT '开始日期',
    end_date DATE NOT NULL COMMENT '结束日期',
    status TINYINT DEFAULT 1 COMMENT '状态：1待购买 2购买中 3已完成',
    total_items INT DEFAULT 0 COMMENT '总项数',
    checked_items INT DEFAULT 0 COMMENT '已勾选项数',
    estimated_cost DECIMAL(10,2) COMMENT '预估费用',
    actual_cost DECIMAL(10,2) COMMENT '实际费用',
    version INT DEFAULT 0 COMMENT '乐观锁版本号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    completed_at TIMESTAMP NULL COMMENT '完成时间',
    FOREIGN KEY (family_id) REFERENCES family_aggregate(id) ON DELETE CASCADE,
    INDEX idx_family_id (family_id),
    INDEX idx_date_range (start_date, end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物清单聚合根表';
```

#### 购物项表 (shopping_item)
```sql
CREATE TABLE shopping_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '购物项ID',
    shopping_list_id BIGINT NOT NULL COMMENT '购物清单ID（聚合根ID）',
    ingredient_name VARCHAR(100) NOT NULL COMMENT '食材名称',
    quantity DECIMAL(10,2) NOT NULL COMMENT '数量',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    category VARCHAR(20) NOT NULL COMMENT '类别：vegetable蔬菜 meat肉类 seafood海鲜 seasoning调料 other其他',
    is_checked BOOLEAN DEFAULT FALSE COMMENT '是否已勾选',
    estimated_price DECIMAL(10,2) COMMENT '预估单价',
    actual_price DECIMAL(10,2) COMMENT '实际单价',
    notes VARCHAR(200) COMMENT '备注',
    checked_at TIMESTAMP NULL COMMENT '勾选时间',
    FOREIGN KEY (shopping_list_id) REFERENCES shopping_list_aggregate(id) ON DELETE CASCADE,
    INDEX idx_shopping_list_id (shopping_list_id),
    INDEX idx_category (category),
    INDEX idx_is_checked (is_checked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物项表（实体）';
```


### 3.6 统计上下文表

#### 烹饪记录表 (cooking_record)
```sql
CREATE TABLE cooking_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '烹饪记录ID',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID',
    menu_item_id BIGINT COMMENT '菜单项ID',
    cook_id BIGINT NOT NULL COMMENT '厨师用户ID',
    cooking_date DATE NOT NULL COMMENT '烹饪日期',
    actual_time INT COMMENT '实际耗时(分钟)',
    difficulty_rating TINYINT COMMENT '难度评分：1-5',
    taste_rating TINYINT COMMENT '口味评分：1-5',
    notes TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (family_id) REFERENCES family_aggregate(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dish_aggregate(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_item(id) ON DELETE SET NULL,
    FOREIGN KEY (cook_id) REFERENCES user_aggregate(id) ON DELETE CASCADE,
    INDEX idx_family_id (family_id),
    INDEX idx_dish_id (dish_id),
    INDEX idx_cook_id (cook_id),
    INDEX idx_cooking_date (cooking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='烹饪记录表';
```

#### 菜品点赞表 (dish_like)
```sql
CREATE TABLE dish_like (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '点赞ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    menu_item_id BIGINT COMMENT '菜单项ID',
    cooking_record_id BIGINT COMMENT '烹饪记录ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (dish_id) REFERENCES dish_aggregate(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user_aggregate(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_item(id) ON DELETE SET NULL,
    FOREIGN KEY (cooking_record_id) REFERENCES cooking_record(id) ON DELETE SET NULL,
    UNIQUE KEY uk_dish_user_menu (dish_id, user_id, menu_item_id),
    INDEX idx_dish_id (dish_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品点赞表';
```

#### 家庭统计快照表 (family_stats_snapshot)
```sql
CREATE TABLE family_stats_snapshot (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '统计快照ID',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    snapshot_date DATE NOT NULL COMMENT '快照日期',
    period_type VARCHAR(20) NOT NULL COMMENT '周期类型：daily日 weekly周 monthly月',
    
    -- 菜品统计
    total_dishes_cooked INT DEFAULT 0 COMMENT '总制作菜品数',
    unique_dishes_cooked INT DEFAULT 0 COMMENT '不重复菜品数',
    most_cooked_dish_id BIGINT COMMENT '最常做的菜',
    most_cooked_count INT DEFAULT 0 COMMENT '最常做的菜次数',
    
    -- 成员统计
    top_cook_user_id BIGINT COMMENT '厨神用户ID',
    top_cook_count INT DEFAULT 0 COMMENT '厨神做菜次数',
    
    -- 口味统计
    top_tag_id BIGINT COMMENT '最受欢迎标签ID',
    top_tag_count INT DEFAULT 0 COMMENT '最受欢迎标签次数',
    
    -- 营养统计
    avg_calories DECIMAL(10,2) COMMENT '平均卡路里',
    total_cost DECIMAL(10,2) COMMENT '总花费',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (family_id) REFERENCES family_aggregate(id) ON DELETE CASCADE,
    UNIQUE KEY uk_family_date_period (family_id, snapshot_date, period_type),
    INDEX idx_snapshot_date (snapshot_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家庭统计快照表';
```

---

## 4. 领域事件设计

### 4.1 事件表 (domain_event)
```sql
CREATE TABLE domain_event (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '事件ID',
    event_type VARCHAR(100) NOT NULL COMMENT '事件类型',
    aggregate_type VARCHAR(50) NOT NULL COMMENT '聚合类型',
    aggregate_id BIGINT NOT NULL COMMENT '聚合根ID',
    event_data JSON NOT NULL COMMENT '事件数据',
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '发生时间',
    processed BOOLEAN DEFAULT FALSE COMMENT '是否已处理',
    processed_at TIMESTAMP NULL COMMENT '处理时间',
    INDEX idx_event_type (event_type),
    INDEX idx_aggregate (aggregate_type, aggregate_id),
    INDEX idx_processed (processed),
    INDEX idx_occurred_at (occurred_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='领域事件表';
```

### 4.2 核心领域事件

**用户上下文事件**:
- `UserRegistered` - 用户注册
- `UserProfileUpdated` - 用户资料更新
- `AchievementUnlocked` - 成就解锁

**家庭上下文事件**:
- `FamilyCreated` - 家庭创建
- `MemberJoined` - 成员加入
- `MemberLeft` - 成员离开
- `InviteCodeGenerated` - 邀请码生成

**菜谱上下文事件**:
- `DishCreated` - 菜谱创建
- `DishUpdated` - 菜谱更新
- `DishDeleted` - 菜谱删除
- `IngredientAdded` - 食材添加
- `TagAdded` - 标签添加

**菜单上下文事件**:
- `MenuPlanCreated` - 菜单计划创建
- `MenuItemAdded` - 菜单项添加
- `MenuItemRemoved` - 菜单项移除
- `MenuCompleted` - 菜单完成

**购物上下文事件**:
- `ShoppingListGenerated` - 购物清单生成
- `ShoppingItemChecked` - 购物项勾选
- `ShoppingCompleted` - 购物完成

**统计上下文事件**:
- `DishCooked` - 菜品制作
- `DishLiked` - 菜品点赞
- `StatsCalculated` - 统计计算完成

---

## 5. 仓储接口设计

### 5.1 用户仓储 (UserRepository)
```java
public interface UserRepository {
    // 聚合根操作
    User findById(UserId userId);
    User findByOpenId(String openId);
    void save(User user);
    void delete(UserId userId);
    
    // 查询操作
    List<User> findByFamilyId(FamilyId familyId);
    boolean existsByOpenId(String openId);
}
```

### 5.2 家庭仓储 (FamilyRepository)
```java
public interface FamilyRepository {
    // 聚合根操作
    Family findById(FamilyId familyId);
    Family findByInviteCode(InviteCode inviteCode);
    void save(Family family);
    void delete(FamilyId familyId);
    
    // 查询操作
    List<Family> findByUserId(UserId userId);
    boolean existsByInviteCode(InviteCode inviteCode);
}
```

### 5.3 菜谱仓储 (DishRepository)
```java
public interface DishRepository {
    // 聚合根操作
    Dish findById(DishId dishId);
    void save(Dish dish);
    void delete(DishId dishId);
    
    // 查询操作
    Page<Dish> findByFamilyId(FamilyId familyId, Pageable pageable);
    List<Dish> findByCategoryId(CategoryId categoryId);
    List<Dish> findByTagIds(List<TagId> tagIds);
    List<Dish> searchByName(String keyword, FamilyId familyId);
    
    // 统计操作
    int countByFamilyId(FamilyId familyId);
    List<Dish> findTopCookedDishes(FamilyId familyId, int limit);
}
```

### 5.4 菜单仓储 (MenuPlanRepository)
```java
public interface MenuPlanRepository {
    // 聚合根操作
    MenuPlan findById(MenuPlanId menuPlanId);
    MenuPlan findByFamilyAndDate(FamilyId familyId, LocalDate date);
    void save(MenuPlan menuPlan);
    void delete(MenuPlanId menuPlanId);
    
    // 查询操作
    List<MenuPlan> findByFamilyAndDateRange(FamilyId familyId, LocalDate start, LocalDate end);
    List<MenuPlan> findByDate(LocalDate date);
}
```

### 5.5 购物清单仓储 (ShoppingListRepository)
```java
public interface ShoppingListRepository {
    // 聚合根操作
    ShoppingList findById(ShoppingListId shoppingListId);
    void save(ShoppingList shoppingList);
    void delete(ShoppingListId shoppingListId);
    
    // 查询操作
    ShoppingList findActiveByFamily(FamilyId familyId);
    List<ShoppingList> findByFamilyAndDateRange(FamilyId familyId, LocalDate start, LocalDate end);
}
```

---

## 6. 领域服务设计

### 6.1 菜单规划服务 (MenuPlanningService)
```java
public interface MenuPlanningService {
    /**
     * 创建菜单计划
     */
    MenuPlan createMenuPlan(FamilyId familyId, LocalDate date);
    
    /**
     * 添加菜品到菜单
     */
    void addDishToMenu(MenuPlanId menuPlanId, DishId dishId, 
                       UserId selectorId, MealTime mealTime);
    
    /**
     * 移除菜单项
     */
    void removeMenuItem(MenuItemId menuItemId);
    
    /**
     * 完成菜单
     */
    void completeMenu(MenuPlanId menuPlanId);
}
```

### 6.2 购物清单生成服务 (ShoppingListGenerationService)
```java
public interface ShoppingListGenerationService {
    /**
     * 根据菜单生成购物清单
     */
    ShoppingList generateFromMenuPlans(FamilyId familyId, 
                                       LocalDate startDate, 
                                       LocalDate endDate);
    
    /**
     * 合并食材
     */
    List<ShoppingItem> mergeIngredients(List<Ingredient> ingredients);
    
    /**
     * 按类别分组
     */
    Map<IngredientCategory, List<ShoppingItem>> groupByCategory(
        List<ShoppingItem> items);
}
```

### 6.3 统计计算服务 (StatisticsCalculationService)
```java
public interface StatisticsCalculationService {
    /**
     * 计算家庭统计数据
     */
    FamilyStatsSnapshot calculateFamilyStats(FamilyId familyId, 
                                             LocalDate date, 
                                             PeriodType periodType);
    
    /**
     * 计算最受欢迎菜品
     */
    List<Dish> calculateTopDishes(FamilyId familyId, int limit);
    
    /**
     * 计算厨神排行
     */
    List<CookRanking> calculateTopCooks(FamilyId familyId, 
                                        LocalDate startDate, 
                                        LocalDate endDate);
    
    /**
     * 计算口味偏好
     */
    List<TagPreference> calculateTagPreferences(FamilyId familyId);
}
```

### 6.4 成就解锁服务 (AchievementUnlockService)
```java
public interface AchievementUnlockService {
    /**
     * 检查并解锁成就
     */
    List<Achievement> checkAndUnlock(UserId userId);
    
    /**
     * 检查烹饪次数成就
     */
    void checkCookingCountAchievement(UserId userId, int count);
    
    /**
     * 检查营养均衡成就
     */
    void checkNutritionBalanceAchievement(UserId userId);
}
```


---

## 7. 值对象设计

### 7.1 用户上下文值对象

```java
// 用户ID值对象
public class UserId {
    private final Long value;
    
    public UserId(Long value) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException("Invalid user id");
        }
        this.value = value;
    }
    
    public Long getValue() { return value; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserId userId = (UserId) o;
        return Objects.equals(value, userId.value);
    }
    
    @Override
    public int hashCode() { return Objects.hash(value); }
}

// 微信信息值对象
public class WeChatInfo {
    private final String openId;
    private final String unionId;
    private final String sessionKey;
    
    public WeChatInfo(String openId, String unionId, String sessionKey) {
        this.openId = Objects.requireNonNull(openId, "OpenId cannot be null");
        this.unionId = unionId;
        this.sessionKey = sessionKey;
    }
    
    // getters and equals/hashCode
}

// 头像值对象
public class Avatar {
    private final String url;
    
    public Avatar(String url) {
        if (url != null && !isValidUrl(url)) {
            throw new IllegalArgumentException("Invalid avatar url");
        }
        this.url = url;
    }
    
    private boolean isValidUrl(String url) {
        return url.startsWith("http://") || url.startsWith("https://");
    }
    
    public String getUrl() { return url; }
}
```

### 7.2 家庭上下文值对象

```java
// 家庭ID值对象
public class FamilyId {
    private final Long value;
    
    public FamilyId(Long value) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException("Invalid family id");
        }
        this.value = value;
    }
    
    public Long getValue() { return value; }
}

// 邀请码值对象
public class InviteCode {
    private final String code;
    private static final int CODE_LENGTH = 6;
    
    public InviteCode(String code) {
        if (code == null || code.length() != CODE_LENGTH) {
            throw new IllegalArgumentException("Invite code must be 6 characters");
        }
        this.code = code.toUpperCase();
    }
    
    public static InviteCode generate() {
        String code = RandomStringUtils.randomAlphanumeric(CODE_LENGTH).toUpperCase();
        return new InviteCode(code);
    }
    
    public String getCode() { return code; }
}

// 成员角色值对象
public enum MemberRole {
    CREATOR("creator", "创建者"),
    MEMBER("member", "成员");
    
    private final String code;
    private final String name;
    
    MemberRole(String code, String name) {
        this.code = code;
        this.name = name;
    }
    
    public boolean isCreator() {
        return this == CREATOR;
    }
}
```

### 7.3 菜谱上下文值对象

```java
// 菜谱ID值对象
public class DishId {
    private final Long value;
    
    public DishId(Long value) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException("Invalid dish id");
        }
        this.value = value;
    }
    
    public Long getValue() { return value; }
}

// 营养信息值对象
public class NutritionInfo {
    private final int calories;        // 卡路里
    private final BigDecimal protein;  // 蛋白质(g)
    private final BigDecimal fat;      // 脂肪(g)
    private final BigDecimal carbohydrate; // 碳水化合物(g)
    
    public NutritionInfo(int calories, BigDecimal protein, 
                         BigDecimal fat, BigDecimal carbohydrate) {
        if (calories < 0) {
            throw new IllegalArgumentException("Calories cannot be negative");
        }
        this.calories = calories;
        this.protein = protein;
        this.fat = fat;
        this.carbohydrate = carbohydrate;
    }
    
    public int getTotalCalories() {
        return calories;
    }
    
    // getters
}

// 烹饪时间值对象
public class CookingTime {
    private final int minutes;
    
    public CookingTime(int minutes) {
        if (minutes < 0 || minutes > 480) { // 最多8小时
            throw new IllegalArgumentException("Invalid cooking time");
        }
        this.minutes = minutes;
    }
    
    public int getMinutes() { return minutes; }
    
    public String getDisplayTime() {
        if (minutes < 60) {
            return minutes + "分钟";
        }
        int hours = minutes / 60;
        int mins = minutes % 60;
        return hours + "小时" + (mins > 0 ? mins + "分钟" : "");
    }
}

// 食材数量值对象
public class IngredientQuantity {
    private final BigDecimal quantity;
    private final String unit;
    
    public IngredientQuantity(BigDecimal quantity, String unit) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        if (unit == null || unit.trim().isEmpty()) {
            throw new IllegalArgumentException("Unit cannot be empty");
        }
        this.quantity = quantity;
        this.unit = unit.trim();
    }
    
    public IngredientQuantity add(IngredientQuantity other) {
        if (!this.unit.equals(other.unit)) {
            throw new IllegalArgumentException("Cannot add different units");
        }
        return new IngredientQuantity(
            this.quantity.add(other.quantity), 
            this.unit
        );
    }
    
    public String getDisplayText() {
        return quantity.stripTrailingZeros().toPlainString() + unit;
    }
}

// 食材类别值对象
public enum IngredientCategory {
    VEGETABLE("vegetable", "蔬菜", "🥬"),
    MEAT("meat", "肉类", "🥩"),
    SEAFOOD("seafood", "海鲜", "🦐"),
    SEASONING("seasoning", "调料", "��"),
    OTHER("other", "其他", "📦");
    
    private final String code;
    private final String name;
    private final String icon;
    
    IngredientCategory(String code, String name, String icon) {
        this.code = code;
        this.name = name;
        this.icon = icon;
    }
    
    public static IngredientCategory fromCode(String code) {
        for (IngredientCategory category : values()) {
            if (category.code.equals(code)) {
                return category;
            }
        }
        return OTHER;
    }
}
```

### 7.4 菜单上下文值对象

```java
// 菜单日期值对象
public class MenuDate {
    private final LocalDate date;
    
    public MenuDate(LocalDate date) {
        if (date == null) {
            throw new IllegalArgumentException("Menu date cannot be null");
        }
        this.date = date;
    }
    
    public static MenuDate today() {
        return new MenuDate(LocalDate.now());
    }
    
    public static MenuDate tomorrow() {
        return new MenuDate(LocalDate.now().plusDays(1));
    }
    
    public boolean isToday() {
        return date.equals(LocalDate.now());
    }
    
    public boolean isTomorrow() {
        return date.equals(LocalDate.now().plusDays(1));
    }
    
    public LocalDate getDate() { return date; }
}

// 餐次值对象
public enum MealTime {
    BREAKFAST("breakfast", "早餐", "🌅"),
    LUNCH("lunch", "午餐", "☀️"),
    DINNER("dinner", "晚餐", "🌙");
    
    private final String code;
    private final String name;
    private final String icon;
    
    MealTime(String code, String name, String icon) {
        this.code = code;
        this.name = name;
        this.icon = icon;
    }
    
    public static MealTime fromCode(String code) {
        for (MealTime mealTime : values()) {
            if (mealTime.code.equals(code)) {
                return mealTime;
            }
        }
        throw new IllegalArgumentException("Invalid meal time code: " + code);
    }
}

// 日期范围值对象
public class DateRange {
    private final LocalDate startDate;
    private final LocalDate endDate;
    
    public DateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Dates cannot be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        this.startDate = startDate;
        this.endDate = endDate;
    }
    
    public static DateRange thisWeek() {
        LocalDate now = LocalDate.now();
        LocalDate start = now.with(DayOfWeek.MONDAY);
        LocalDate end = now.with(DayOfWeek.SUNDAY);
        return new DateRange(start, end);
    }
    
    public static DateRange lastWeek() {
        LocalDate now = LocalDate.now();
        LocalDate start = now.minusWeeks(1).with(DayOfWeek.MONDAY);
        LocalDate end = now.minusWeeks(1).with(DayOfWeek.SUNDAY);
        return new DateRange(start, end);
    }
    
    public long getDays() {
        return ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }
    
    public boolean contains(LocalDate date) {
        return !date.isBefore(startDate) && !date.isAfter(endDate);
    }
}
```

---

## 8. 聚合根设计示例

### 8.1 菜谱聚合根 (Dish Aggregate)

```java
@Entity
@Table(name = "dish_aggregate")
public class Dish {
    @EmbeddedId
    private DishId id;
    
    private FamilyId familyId;
    private UserId creatorId;
    private String name;
    private String coverUrl;
    private String description;
    
    @Embedded
    private NutritionInfo nutritionInfo;
    
    @Embedded
    private CookingTime cookingTime;
    
    private int servingSize;
    private CategoryId categoryId;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "dish_id")
    private List<Ingredient> ingredients = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(name = "dish_tag_relation")
    private Set<Tag> tags = new HashSet<>();
    
    @Embedded
    private DishStatistics statistics;
    
    @Version
    private int version;
    
    // 业务方法
    
    /**
     * 添加食材
     */
    public void addIngredient(String name, IngredientQuantity quantity, 
                             IngredientCategory category) {
        Ingredient ingredient = new Ingredient(name, quantity, category);
        this.ingredients.add(ingredient);
        
        // 发布领域事件
        DomainEventPublisher.publish(new IngredientAddedEvent(this.id, ingredient));
    }
    
    /**
     * 移除食材
     */
    public void removeIngredient(Ingredient ingredient) {
        this.ingredients.remove(ingredient);
    }
    
    /**
     * 添加标签
     */
    public void addTag(Tag tag) {
        this.tags.add(tag);
        tag.incrementUseCount();
        
        DomainEventPublisher.publish(new TagAddedEvent(this.id, tag.getId()));
    }
    
    /**
     * 移除标签
     */
    public void removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.decrementUseCount();
    }
    
    /**
     * 记录制作
     */
    public void recordCooked() {
        this.statistics.incrementCookedCount();
        
        DomainEventPublisher.publish(new DishCookedEvent(this.id, this.familyId));
    }
    
    /**
     * 记录点赞
     */
    public void recordLike() {
        this.statistics.incrementLikeCount();
    }
    
    /**
     * 更新评分
     */
    public void updateRating(int rating) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        this.statistics.updateRating(rating);
    }
    
    /**
     * 验证菜谱完整性
     */
    public boolean isValid() {
        return name != null && !name.trim().isEmpty()
            && !ingredients.isEmpty()
            && categoryId != null;
    }
}

// 食材实体
@Entity
@Table(name = "dish_ingredient")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Embedded
    private IngredientQuantity quantity;
    
    @Enumerated(EnumType.STRING)
    private IngredientCategory category;
    
    private int sortOrder;
    
    protected Ingredient() {}
    
    public Ingredient(String name, IngredientQuantity quantity, 
                     IngredientCategory category) {
        this.name = name;
        this.quantity = quantity;
        this.category = category;
    }
}

// 菜谱统计值对象
@Embeddable
public class DishStatistics {
    private int cookedCount;
    private int likeCount;
    private BigDecimal avgRating;
    private int ratingCount;
    
    public void incrementCookedCount() {
        this.cookedCount++;
    }
    
    public void incrementLikeCount() {
        this.likeCount++;
    }
    
    public void updateRating(int newRating) {
        BigDecimal totalRating = avgRating.multiply(new BigDecimal(ratingCount));
        totalRating = totalRating.add(new BigDecimal(newRating));
        ratingCount++;
        avgRating = totalRating.divide(new BigDecimal(ratingCount), 2, RoundingMode.HALF_UP);
    }
}
```

### 8.2 菜单计划聚合根 (MenuPlan Aggregate)

```java
@Entity
@Table(name = "menu_plan_aggregate")
public class MenuPlan {
    @EmbeddedId
    private MenuPlanId id;
    
    private FamilyId familyId;
    
    @Embedded
    private MenuDate menuDate;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "menu_plan_id")
    private List<MenuItem> items = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    private MenuPlanStatus status;
    
    private int totalCalories;
    private int totalItems;
    
    @Version
    private int version;
    
    // 业务方法
    
    /**
     * 添加菜单项
     */
    public MenuItem addMenuItem(Dish dish, UserId selectorId, 
                               MealTime mealTime, String dayType) {
        // 验证是否已存在相同餐次的菜品
        if (hasMenuItem(mealTime, dish.getId())) {
            throw new BusinessException("该餐次已有此菜品");
        }
        
        MenuItem item = new MenuItem(dish.getId(), selectorId, mealTime, dayType);
        this.items.add(item);
        this.totalItems++;
        this.totalCalories += dish.getNutritionInfo().getTotalCalories();
        
        // 记录菜品制作次数
        dish.recordCooked();
        
        // 发布领域事件
        DomainEventPublisher.publish(
            new MenuItemAddedEvent(this.id, item.getId(), dish.getId())
        );
        
        return item;
    }
    
    /**
     * 移除菜单项
     */
    public void removeMenuItem(MenuItemId itemId) {
        MenuItem item = findMenuItem(itemId);
        if (item == null) {
            throw new BusinessException("菜单项不存在");
        }
        
        this.items.remove(item);
        this.totalItems--;
        
        DomainEventPublisher.publish(
            new MenuItemRemovedEvent(this.id, itemId)
        );
    }
    
    /**
     * 完成菜单
     */
    public void complete() {
        if (this.status == MenuPlanStatus.COMPLETED) {
            throw new BusinessException("菜单已完成");
        }
        
        this.status = MenuPlanStatus.COMPLETED;
        
        DomainEventPublisher.publish(
            new MenuCompletedEvent(this.id, this.familyId, this.menuDate)
        );
    }
    
    /**
     * 获取指定餐次的菜单项
     */
    public List<MenuItem> getItemsByMealTime(MealTime mealTime) {
        return items.stream()
            .filter(item -> item.getMealTime() == mealTime)
            .collect(Collectors.toList());
    }
    
    /**
     * 检查是否已有菜品
     */
    private boolean hasMenuItem(MealTime mealTime, DishId dishId) {
        return items.stream()
            .anyMatch(item -> item.getMealTime() == mealTime 
                && item.getDishId().equals(dishId));
    }
    
    private MenuItem findMenuItem(MenuItemId itemId) {
        return items.stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElse(null);
    }
}

// 菜单项实体
@Entity
@Table(name = "menu_item")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private MenuItemId id;
    
    private DishId dishId;
    private UserId selectorId;
    
    @Enumerated(EnumType.STRING)
    private MealTime mealTime;
    
    private String dayType; // today, tomorrow
    
    @Enumerated(EnumType.STRING)
    private MenuItemStatus status;
    
    private Integer actualCookingTime;
    private String notes;
    
    protected MenuItem() {}
    
    public MenuItem(DishId dishId, UserId selectorId, 
                   MealTime mealTime, String dayType) {
        this.id = MenuItemId.generate();
        this.dishId = dishId;
        this.selectorId = selectorId;
        this.mealTime = mealTime;
        this.dayType = dayType;
        this.status = MenuItemStatus.PENDING;
    }
    
    public void markAsCompleted(int actualTime) {
        this.status = MenuItemStatus.COMPLETED;
        this.actualCookingTime = actualTime;
    }
}

// 菜单状态枚举
public enum MenuPlanStatus {
    PLANNING("计划中"),
    COMPLETED("已完成"),
    CANCELLED("已取消");
    
    private final String name;
    
    MenuPlanStatus(String name) {
        this.name = name;
    }
}
```


---

## 7. 应用服务设计

### 7.1 用户应用服务 (UserApplicationService)
```java
@Service
public class UserApplicationService {
    /**
     * 微信登录
     */
    public LoginResponse wxLogin(String code);
    
    /**
     * 获取用户资料
     */
    public UserProfileDTO getUserProfile(UserId userId);
    
    /**
     * 更新用户资料
     */
    public void updateUserProfile(UserId userId, UpdateProfileRequest request);
    
    /**
     * 获取用户成就
     */
    public List<AchievementDTO> getUserAchievements(UserId userId);
}
```

### 7.2 家庭应用服务 (FamilyApplicationService)
```java
@Service
public class FamilyApplicationService {
    /**
     * 创建家庭
     */
    public FamilyDTO createFamily(UserId creatorId, String familyName);
    
    /**
     * 生成邀请码
     */
    public InviteCodeDTO generateInviteCode(FamilyId familyId, UserId userId);
    
    /**
     * 加入家庭
     */
    public void joinFamily(UserId userId, String inviteCode);
    
    /**
     * 获取家庭成员
     */
    public List<FamilyMemberDTO> getFamilyMembers(FamilyId familyId);
    
    /**
     * 移除成员
     */
    public void removeMember(FamilyId familyId, UserId operatorId, UserId memberId);
}
```

### 7.3 菜谱应用服务 (DishApplicationService)
```java
@Service
public class DishApplicationService {
    /**
     * 创建菜谱
     */
    public DishDTO createDish(CreateDishRequest request);
    
    /**
     * 更新菜谱
     */
    public void updateDish(DishId dishId, UpdateDishRequest request);
    
    /**
     * 删除菜谱
     */
    public void deleteDish(DishId dishId, UserId userId);
    
    /**
     * 查询菜谱列表
     */
    public Page<DishDTO> queryDishes(DishQueryRequest request);
    
    /**
     * 获取菜谱详情
     */
    public DishDetailDTO getDishDetail(DishId dishId);
    
    /**
     * 搜索菜谱
     */
    public List<DishDTO> searchDishes(String keyword, FamilyId familyId);
}
```

### 7.4 菜单应用服务 (MenuApplicationService)
```java
@Service
public class MenuApplicationService {
    /**
     * 获取菜单
     */
    public MenuPlanDTO getMenuPlan(FamilyId familyId, LocalDate date);
    
    /**
     * 添加菜品到菜单
     */
    public void addDishToMenu(AddMenuItemRequest request);
    
    /**
     * 移除菜单项
     */
    public void removeMenuItem(MenuItemId menuItemId, UserId userId);
    
    /**
     * 获取历史菜单
     */
    public List<MenuPlanDTO> getHistoryMenus(FamilyId familyId, 
                                             LocalDate startDate, 
                                             LocalDate endDate);
}
```

### 7.5 购物清单应用服务 (ShoppingApplicationService)
```java
@Service
public class ShoppingApplicationService {
    /**
     * 生成购物清单
     */
    public ShoppingListDTO generateShoppingList(FamilyId familyId, 
                                                LocalDate startDate, 
                                                LocalDate endDate);
    
    /**
     * 获取购物清单
     */
    public ShoppingListDTO getShoppingList(ShoppingListId shoppingListId);
    
    /**
     * 勾选购物项
     */
    public void checkShoppingItem(ShoppingItemId itemId, boolean checked);
    
    /**
     * 清空购物清单
     */
    public void clearShoppingList(ShoppingListId shoppingListId);
}
```

---

## 8. 值对象设计

### 8.1 用户相关值对象
```java
// 用户ID
public class UserId {
    private final Long value;
}

// 微信信息
public class WeChatInfo {
    private final String openId;
    private final String unionId;
    private final String sessionKey;
}

// 头像
public class Avatar {
    private final String url;
    private final String thumbnailUrl;
}
```

### 8.2 家庭相关值对象
```java
// 家庭ID
public class FamilyId {
    private final Long value;
}

// 邀请码
public class InviteCode {
    private final String code;
    
    public static InviteCode generate() {
        // 生成6位随机码
    }
}

// 成员角色
public enum MemberRole {
    CREATOR, MEMBER
}
```

### 8.3 菜谱相关值对象
```java
// 菜谱ID
public class DishId {
    private final Long value;
}

// 营养信息
public class NutritionInfo {
    private final int calories;
    private final BigDecimal protein;
    private final BigDecimal fat;
    private final BigDecimal carbohydrate;
}

// 烹饪时间
public class CookingTime {
    private final int minutes;
    
    public boolean isQuickDish() {
        return minutes <= 15;
    }
}

// 食材数量
public class IngredientQuantity {
    private final BigDecimal quantity;
    private final String unit;
}

// 食材类别
public enum IngredientCategory {
    VEGETABLE("蔬菜"),
    MEAT("肉类"),
    SEAFOOD("海鲜"),
    SEASONING("调料"),
    OTHER("其他");
}
```

### 8.4 菜单相关值对象
```java
// 菜单计划ID
public class MenuPlanId {
    private final Long value;
}

// 餐次
public enum MealTime {
    BREAKFAST("早餐"),
    LUNCH("午餐"),
    DINNER("晚餐");
}

// 菜单日期
public class MenuDate {
    private final LocalDate date;
    
    public boolean isToday() {
        return date.equals(LocalDate.now());
    }
    
    public boolean isTomorrow() {
        return date.equals(LocalDate.now().plusDays(1));
    }
}
```

---

## 9. DDD 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                      表现层 (Presentation)                    │
│  Controller, DTO, Request/Response, Exception Handler       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      应用层 (Application)                     │
│  Application Service, DTO Assembler, Event Publisher        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      领域层 (Domain)                          │
│  Aggregate, Entity, Value Object, Domain Service,           │
│  Repository Interface, Domain Event                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      基础设施层 (Infrastructure)               │
│  Repository Impl, MyBatis Mapper, External Service,         │
│  Event Store, File Storage                                  │
└─────────────────────────────────────────────────────────────┘
```

### 9.1 项目包结构

```
com.delicious.moments
├── interfaces/                    # 表现层
│   ├── controller/               # 控制器
│   ├── dto/                      # 数据传输对象
│   │   ├── request/
│   │   └── response/
│   ├── assembler/                # DTO组装器
│   └── facade/                   # 外观服务
│
├── application/                   # 应用层
│   ├── service/                  # 应用服务
│   ├── event/                    # 事件处理器
│   └── command/                  # 命令对象
│
├── domain/                        # 领域层
│   ├── user/                     # 用户聚合
│   │   ├── aggregate/
│   │   ├── entity/
│   │   ├── valueobject/
│   │   ├── repository/
│   │   ├── service/
│   │   └── event/
│   ├── family/                   # 家庭聚合
│   ├── dish/                     # 菜谱聚合
│   ├── menu/                     # 菜单聚合
│   ├── shopping/                 # 购物聚合
│   └── stats/                    # 统计聚合
│
├── infrastructure/                # 基础设施层
│   ├── persistence/              # 持久化
│   │   ├── mapper/              # MyBatis Mapper
│   │   ├── po/                  # 持久化对象
│   │   └── repository/          # 仓储实现
│   ├── external/                 # 外部服务
│   │   ├── wechat/              # 微信服务
│   │   └── oss/                 # 文件存储
│   ├── config/                   # 配置
│   └── common/                   # 通用组件
│
└── shared/                        # 共享内核
    ├── exception/                # 异常定义
    ├── util/                     # 工具类
    └── constant/                 # 常量定义
```

---

## 10. 技术实现要点

### 10.1 聚合根持久化

**使用乐观锁保证并发安全**:
```java
@Entity
public class DishAggregate {
    @Id
    private Long id;
    
    @Version
    private Integer version;  // 乐观锁版本号
    
    // 其他字段...
}
```

**聚合内实体级联操作**:
```java
@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
private List<Ingredient> ingredients;
```

### 10.2 领域事件发布

**使用 Spring Event 发布领域事件**:
```java
@Service
public class DishApplicationService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public void createDish(CreateDishRequest request) {
        Dish dish = Dish.create(...);
        dishRepository.save(dish);
        
        // 发布领域事件
        eventPublisher.publishEvent(new DishCreatedEvent(dish.getId()));
    }
}
```

### 10.3 仓储实现

**使用 MyBatis-Plus 实现仓储**:
```java
@Repository
public class DishRepositoryImpl implements DishRepository {
    @Autowired
    private DishMapper dishMapper;
    
    @Autowired
    private IngredientMapper ingredientMapper;
    
    @Override
    public Dish findById(DishId dishId) {
        DishPO dishPO = dishMapper.selectById(dishId.getValue());
        List<IngredientPO> ingredientPOs = 
            ingredientMapper.selectByDishId(dishId.getValue());
        
        return DishAssembler.toDomain(dishPO, ingredientPOs);
    }
    
    @Override
    @Transactional
    public void save(Dish dish) {
        DishPO dishPO = DishAssembler.toPO(dish);
        dishMapper.insertOrUpdate(dishPO);
        
        // 保存食材
        List<IngredientPO> ingredientPOs = 
            DishAssembler.ingredientsToPO(dish.getIngredients());
        ingredientMapper.batchInsert(ingredientPOs);
    }
}
```

### 10.4 领域服务实现

**购物清单生成领域服务**:
```java
@Service
public class ShoppingListGenerationService {
    public ShoppingList generateFromMenuPlans(
        FamilyId familyId, 
        LocalDate startDate, 
        LocalDate endDate) {
        
        // 1. 查询菜单计划
        List<MenuPlan> menuPlans = menuPlanRepository
            .findByFamilyAndDateRange(familyId, startDate, endDate);
        
        // 2. 提取所有食材
        List<Ingredient> allIngredients = menuPlans.stream()
            .flatMap(plan -> plan.getItems().stream())
            .flatMap(item -> item.getDish().getIngredients().stream())
            .collect(Collectors.toList());
        
        // 3. 合并同名同单位食材
        List<ShoppingItem> mergedItems = mergeIngredients(allIngredients);
        
        // 4. 创建购物清单聚合
        ShoppingList shoppingList = ShoppingList.create(
            familyId, startDate, endDate, mergedItems);
        
        return shoppingList;
    }
    
    private List<ShoppingItem> mergeIngredients(List<Ingredient> ingredients) {
        Map<String, List<Ingredient>> grouped = ingredients.stream()
            .collect(Collectors.groupingBy(
                i -> i.getName() + "_" + i.getUnit()));
        
        return grouped.entrySet().stream()
            .map(entry -> {
                List<Ingredient> items = entry.getValue();
                BigDecimal totalQuantity = items.stream()
                    .map(Ingredient::getQuantity)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                Ingredient first = items.get(0);
                return ShoppingItem.create(
                    first.getName(),
                    totalQuantity,
                    first.getUnit(),
                    first.getCategory()
                );
            })
            .collect(Collectors.toList());
    }
}
```

---

## 11. DDD 最佳实践

### 11.1 聚合设计原则

1. **小聚合原则**: 聚合应该尽可能小，只包含必须保持一致性的实体
2. **通过ID引用**: 聚合之间通过ID引用，而不是对象引用
3. **最终一致性**: 跨聚合的一致性通过领域事件实现最终一致性
4. **事务边界**: 一个事务只修改一个聚合

### 11.2 仓储设计原则

1. **面向聚合**: 仓储是面向聚合根的，不是面向表的
2. **完整加载**: 加载聚合时应该加载完整的聚合
3. **原子保存**: 保存聚合时应该原子性地保存整个聚合

### 11.3 领域事件使用场景

1. **解耦聚合**: 通过事件解耦不同聚合之间的依赖
2. **异步处理**: 通过事件实现异步处理（如统计计算）
3. **审计日志**: 通过事件记录重要的业务操作
4. **集成其他系统**: 通过事件与外部系统集成

### 11.4 值对象使用原则

1. **不可变性**: 值对象应该是不可变的
2. **自包含验证**: 值对象应该包含自己的验证逻辑
3. **业务语义**: 值对象应该表达业务概念，而不仅仅是数据

---

## 12. 数据库索引策略

### 12.1 主键索引
- 所有表的 `id` 字段（聚合根ID）

### 12.2 唯一索引
- `user_aggregate.openid`
- `family_aggregate.invite_code`
- `family_member(family_id, user_id)`
- `dish_tag_relation(dish_id, tag_id)`

### 12.3 普通索引
- `family_member.user_id`
- `dish_aggregate.family_id`
- `dish_aggregate.category_id`
- `menu_plan_aggregate(family_id, menu_date)`
- `menu_item.menu_plan_id`
- `shopping_list_aggregate.family_id`

### 12.4 复合索引
- `menu_item(menu_plan_id, meal_time)`
- `cooking_record(family_id, cooking_date)`
- `dish_like(dish_id, user_id, menu_item_id)`

### 12.5 全文索引
- `dish_aggregate.name` (使用 ngram parser 支持中文搜索)

---

## 13. 总结

本 DDD 设计方案的核心特点：

1. **清晰的领域划分**: 6个限界上下文，职责明确
2. **合理的聚合设计**: 聚合边界清晰，保证一致性
3. **丰富的值对象**: 封装业务规则，提高代码质量
4. **完善的事件机制**: 解耦聚合，支持异步处理
5. **标准的分层架构**: 表现层、应用层、领域层、基础设施层
6. **优化的数据库设计**: 合理的索引策略，支持高性能查询

这套设计既遵循 DDD 的核心思想，又考虑了实际工程实践，可以直接用于项目开发。

