-- 食光集数据库初始化脚本 (DDD版本 - 无外键约束)
-- 创建数据库
CREATE DATABASE IF NOT EXISTS delicious_moments 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE delicious_moments;

-- ============================================
-- 用户上下文
-- ============================================

-- 用户聚合根表
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

-- 用户资料表
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
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户资料表';

-- 用户成就表
CREATE TABLE user_achievement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '成就ID',
    user_id BIGINT NOT NULL COMMENT '用户ID（聚合根ID）',
    achievement_code VARCHAR(50) NOT NULL COMMENT '成就代码',
    achievement_name VARCHAR(50) NOT NULL COMMENT '成就名称',
    achievement_desc VARCHAR(200) COMMENT '成就描述',
    achievement_icon VARCHAR(10) COMMENT '成就图标',
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '解锁时间',
    UNIQUE KEY uk_user_achievement (user_id, achievement_code),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户成就表';

-- ============================================
-- 家庭上下文
-- ============================================

-- 家庭聚合根表
CREATE TABLE family_aggregate (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '家庭ID（聚合根ID）',
    name VARCHAR(100) NOT NULL COMMENT '家庭名称',
    invite_code VARCHAR(20) UNIQUE NOT NULL COMMENT '邀请码',
    creator_id BIGINT NOT NULL COMMENT '创建者用户ID',
    status TINYINT DEFAULT 1 COMMENT '状态：1正常 0已解散',
    version INT DEFAULT 0 COMMENT '乐观锁版本号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '软删除时间',
    INDEX idx_invite_code (invite_code),
    INDEX idx_creator_id (creator_id),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家庭聚合根表';

-- 家庭成员表
CREATE TABLE family_member (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '成员ID',
    family_id BIGINT NOT NULL COMMENT '家庭ID（聚合根ID）',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role VARCHAR(20) NOT NULL COMMENT '角色：creator创建者 member成员',
    nickname VARCHAR(50) COMMENT '家庭内昵称',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
    UNIQUE KEY uk_family_user (family_id, user_id),
    INDEX idx_family_id (family_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家庭成员表';

-- ============================================
-- 菜谱上下文
-- ============================================

-- 菜谱聚合根表
CREATE TABLE dish_aggregate (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '菜谱ID（聚合根ID）',
    family_id BIGINT NOT NULL COMMENT '所属家庭ID',
    creator_id BIGINT NOT NULL COMMENT '创建者用户ID',
    name VARCHAR(100) NOT NULL COMMENT '菜名',
    cover_url VARCHAR(255) COMMENT '封面图URL',
    description TEXT COMMENT '描述',
    calories INT DEFAULT 0 COMMENT '卡路里',
    protein DECIMAL(10,2) COMMENT '蛋白质(g)',
    fat DECIMAL(10,2) COMMENT '脂肪(g)',
    carbohydrate DECIMAL(10,2) COMMENT '碳水化合物(g)',
    cooking_time INT DEFAULT 0 COMMENT '烹饪时间(分钟)',
    difficulty TINYINT DEFAULT 1 COMMENT '难度：1简单 2中等 3困难',
    serving_size INT DEFAULT 2 COMMENT '份量（人数）',
    cooked_count INT DEFAULT 0 COMMENT '制作次数',
    like_count INT DEFAULT 0 COMMENT '点赞次数',
    avg_rating DECIMAL(3,2) DEFAULT 0 COMMENT '平均评分',
    category_id BIGINT COMMENT '分类ID',
    status TINYINT DEFAULT 1 COMMENT '状态：1正常 0已删除',
    version INT DEFAULT 0 COMMENT '乐观锁版本号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '软删除时间',
    INDEX idx_family_id (family_id),
    INDEX idx_creator_id (creator_id),
    INDEX idx_category_id (category_id),
    INDEX idx_cooked_count (cooked_count),
    INDEX idx_deleted_at (deleted_at),
    FULLTEXT INDEX ft_name (name) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜谱聚合根表';

-- 食材表
CREATE TABLE dish_ingredient (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '食材ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID（聚合根ID）',
    name VARCHAR(100) NOT NULL COMMENT '食材名称',
    quantity DECIMAL(10,2) NOT NULL COMMENT '数量',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    category VARCHAR(20) NOT NULL COMMENT '类别：vegetable蔬菜 meat肉类 seafood海鲜 seasoning调料 other其他',
    sort_order INT DEFAULT 0 COMMENT '排序',
    INDEX idx_dish_id (dish_id),
    INDEX idx_name_unit (name, unit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食材表';

-- 分类表
CREATE TABLE dish_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    family_id BIGINT NOT NULL COMMENT '所属家庭ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    icon VARCHAR(10) COMMENT '图标(emoji)',
    sort_order INT DEFAULT 0 COMMENT '排序',
    dish_count INT DEFAULT 0 COMMENT '菜谱数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_family_id (family_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';

-- 标签表
CREATE TABLE dish_tag (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '标签ID',
    family_id BIGINT NOT NULL COMMENT '所属家庭ID',
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    color VARCHAR(20) COMMENT '标签颜色',
    use_count INT DEFAULT 0 COMMENT '使用次数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_family_id (family_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- 菜谱标签关联表
CREATE TABLE dish_tag_relation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID',
    tag_id BIGINT NOT NULL COMMENT '标签ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_dish_tag (dish_id, tag_id),
    INDEX idx_dish_id (dish_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜谱标签关联表';

-- ============================================
-- 菜单上下文
-- ============================================

-- 菜单计划聚合根表
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
    UNIQUE KEY uk_family_date (family_id, menu_date),
    INDEX idx_family_id (family_id),
    INDEX idx_menu_date (menu_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单计划聚合根表';

-- 菜单项表
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
    INDEX idx_menu_plan_id (menu_plan_id),
    INDEX idx_dish_id (dish_id),
    INDEX idx_selector_id (selector_id),
    INDEX idx_meal_time (meal_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单项表';

-- ============================================
-- 购物上下文
-- ============================================

-- 购物清单聚合根表
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
    INDEX idx_family_id (family_id),
    INDEX idx_date_range (start_date, end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物清单聚合根表';

-- 购物项表
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
    INDEX idx_shopping_list_id (shopping_list_id),
    INDEX idx_category (category),
    INDEX idx_is_checked (is_checked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物项表';

-- ============================================
-- 统计上下文
-- ============================================

-- 烹饪记录表
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
    INDEX idx_family_id (family_id),
    INDEX idx_dish_id (dish_id),
    INDEX idx_menu_item_id (menu_item_id),
    INDEX idx_cook_id (cook_id),
    INDEX idx_cooking_date (cooking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='烹饪记录表';

-- 菜品点赞表
CREATE TABLE dish_like (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '点赞ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    menu_item_id BIGINT COMMENT '菜单项ID',
    cooking_record_id BIGINT COMMENT '烹饪记录ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_dish_user_menu (dish_id, user_id, menu_item_id),
    INDEX idx_dish_id (dish_id),
    INDEX idx_user_id (user_id),
    INDEX idx_menu_item_id (menu_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品点赞表';

-- 家庭统计快照表
CREATE TABLE family_stats_snapshot (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '统计快照ID',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    snapshot_date DATE NOT NULL COMMENT '快照日期',
    period_type VARCHAR(20) NOT NULL COMMENT '周期类型：daily日 weekly周 monthly月',
    total_dishes_cooked INT DEFAULT 0 COMMENT '总制作菜品数',
    unique_dishes_cooked INT DEFAULT 0 COMMENT '不重复菜品数',
    most_cooked_dish_id BIGINT COMMENT '最常做的菜',
    most_cooked_count INT DEFAULT 0 COMMENT '最常做的菜次数',
    top_cook_user_id BIGINT COMMENT '厨神用户ID',
    top_cook_count INT DEFAULT 0 COMMENT '厨神做菜次数',
    top_tag_id BIGINT COMMENT '最受欢迎标签ID',
    top_tag_count INT DEFAULT 0 COMMENT '最受欢迎标签次数',
    avg_calories DECIMAL(10,2) COMMENT '平均卡路里',
    total_cost DECIMAL(10,2) COMMENT '总花费',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_family_date_period (family_id, snapshot_date, period_type),
    INDEX idx_family_id (family_id),
    INDEX idx_snapshot_date (snapshot_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家庭统计快照表';

-- ============================================
-- 领域事件表
-- ============================================

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

-- ============================================
-- 说明
-- ============================================
-- 1. 本设计不使用外键约束，数据一致性由应用层保证
-- 2. 使用索引优化查询性能
-- 3. 使用乐观锁（version字段）处理并发
-- 4. 使用软删除（deleted_at字段）保证数据安全
-- 5. 所有关联关系通过ID引用，由应用层维护
