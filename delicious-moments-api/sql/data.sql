-- 食光集初始化数据
USE delicious_moments;

-- ============================================
-- 用户数据
-- ============================================

-- 插入测试用户
INSERT INTO user_aggregate (id, openid, union_id, version, created_at, updated_at) VALUES
(1, 'test_openid_001', 'test_unionid_001', 0, NOW(), NOW()),
(2, 'test_openid_002', 'test_unionid_002', 0, NOW(), NOW()),
(3, 'test_openid_003', 'test_unionid_003', 0, NOW(), NOW()),
(4, 'test_openid_004', 'test_unionid_004', 0, NOW(), NOW());

-- 插入用户资料
INSERT INTO user_profile (user_id, nickname, avatar_url, phone, gender, created_at, updated_at) VALUES
(1, '爸爸', 'https://picsum.photos/id/1005/200/200', '13800138001', 1, NOW(), NOW()),
(2, '妈妈', 'https://picsum.photos/id/1011/200/200', '13800138002', 2, NOW(), NOW()),
(3, '宝贝', 'https://picsum.photos/id/1027/200/200', '13800138003', 0, NOW(), NOW()),
(4, '奶奶', 'https://picsum.photos/id/1025/200/200', '13800138004', 2, NOW(), NOW());

-- 插入用户成就
INSERT INTO user_achievement (user_id, achievement_code, achievement_name, achievement_desc, achievement_icon, unlocked_at) VALUES
(1, 'MASTER_CHEF', '中华小当家', '累计烹饪超过 50 次', '👨‍🍳', NOW()),
(1, 'CLEAN_PLATE', '光盘行动', '连续 3 天没有剩菜', '🍽️', NOW()),
(1, 'MONEY_SAVER', '省钱能手', '按清单买菜节省 100 元', '💰', NOW()),
(2, 'NUTRITION_BALANCE', '营养均衡', '一周内蔬菜占比超过 60%', '🥦', NOW());

-- ============================================
-- 家庭数据
-- ============================================

-- 插入家庭
INSERT INTO family_aggregate (id, name, invite_code, creator_id, status, version, created_at, updated_at) VALUES
(1, '幸福之家', 'ABC123', 1, 1, 0, NOW(), NOW()),
(2, '温馨小屋', 'XYZ789', 3, 1, 0, NOW(), NOW());

-- 插入家庭成员
INSERT INTO family_member (family_id, user_id, role, nickname, joined_at) VALUES
(1, 1, 'creator', '爸爸', NOW()),
(1, 2, 'member', '妈妈', NOW()),
(1, 3, 'member', '宝贝', NOW()),
(1, 4, 'member', '奶奶', NOW()),
(2, 3, 'creator', '宝贝', NOW());

-- ============================================
-- 菜谱数据
-- ============================================

-- 插入分类
INSERT INTO dish_category (id, family_id, name, icon, sort_order, dish_count, created_at, updated_at) VALUES
(1, 1, '热菜', '🥘', 1, 0, NOW(), NOW()),
(2, 1, '凉菜', '🥗', 2, 0, NOW(), NOW()),
(3, 1, '汤羹', '🥣', 3, 0, NOW(), NOW()),
(4, 1, '甜点', '🍮', 4, 0, NOW(), NOW()),
(5, 1, '主食', '🍚', 5, 0, NOW(), NOW());

-- 插入标签
INSERT INTO dish_tag (id, family_id, name, color, use_count, created_at, updated_at) VALUES
(1, 1, '家常', '#FF9800', 0, NOW(), NOW()),
(2, 1, '快手', '#4CAF50', 0, NOW(), NOW()),
(3, 1, '硬菜', '#F44336', 0, NOW(), NOW()),
(4, 1, '解馋', '#E91E63', 0, NOW(), NOW()),
(5, 1, '清爽', '#00BCD4', 0, NOW(), NOW()),
(6, 1, '下酒', '#9C27B0', 0, NOW(), NOW()),
(7, 1, '暖胃', '#FF5722', 0, NOW(), NOW()),
(8, 1, '甜美', '#E91E63', 0, NOW(), NOW()),
(9, 1, '减脂', '#8BC34A', 0, NOW(), NOW()),
(10, 1, '健康', '#4CAF50', 0, NOW(), NOW()),
(11, 1, '素食', '#8BC34A', 0, NOW(), NOW()),
(12, 1, '鲜美', '#03A9F4', 0, NOW(), NOW()),
(13, 1, '早餐', '#FFC107', 0, NOW(), NOW());

-- 插入菜谱
INSERT INTO dish_aggregate (id, family_id, creator_id, name, cover_url, description, calories, cooking_time, difficulty, serving_size, cooked_count, like_count, category_id, status, version, created_at, updated_at) VALUES
(1, 1, 1, '番茄炒蛋', 'https://picsum.photos/id/102/400/400', '经典家常菜，酸甜可口', 150, 10, 1, 2, 12, 15, 1, 1, 0, NOW(), NOW()),
(2, 1, 1, '红烧肉', 'https://picsum.photos/id/106/400/400', '色泽红亮，肥而不腻', 450, 60, 2, 4, 5, 8, 1, 1, 0, NOW(), NOW()),
(3, 1, 2, '拍黄瓜', 'https://picsum.photos/id/139/400/400', '清爽开胃，简单快手', 50, 5, 1, 2, 8, 10, 2, 1, 0, NOW(), NOW()),
(4, 1, 2, '奶油蘑菇汤', 'https://picsum.photos/id/292/400/400', '浓郁香滑，暖心暖胃', 100, 20, 1, 3, 2, 3, 3, 1, 0, NOW(), NOW()),
(5, 1, 2, '草莓布丁', 'https://picsum.photos/id/429/400/400', '甜美可口，孩子最爱', 200, 15, 1, 4, 6, 9, 4, 1, 0, NOW(), NOW()),
(6, 1, 1, '全麦三明治', 'https://picsum.photos/id/488/400/400', '营养均衡，快手早餐', 320, 10, 1, 2, 15, 12, 5, 1, 0, NOW(), NOW()),
(7, 1, 4, '清炒时蔬', 'https://picsum.photos/id/493/400/400', '清淡健康，保留营养', 120, 8, 1, 3, 9, 7, 1, 1, 0, NOW(), NOW()),
(8, 1, 2, '鲜虾云吞', 'https://picsum.photos/id/450/400/400', '皮薄馅大，鲜美多汁', 350, 15, 2, 3, 4, 6, 5, 1, 0, NOW(), NOW()),
(9, 1, 1, '宫保鸡丁', 'https://picsum.photos/id/225/400/400', '麻辣鲜香，下饭神器', 280, 15, 2, 3, 7, 9, 1, 1, 0, NOW(), NOW()),
(10, 1, 4, '紫菜蛋花汤', 'https://picsum.photos/id/326/400/400', '清淡鲜美，简单快手', 60, 5, 1, 4, 11, 8, 3, 1, 0, NOW(), NOW());

-- 插入食材
INSERT INTO dish_ingredient (dish_id, name, quantity, unit, category, sort_order) VALUES
-- 番茄炒蛋
(1, '番茄', 2, '个', 'vegetable', 1),
(1, '鸡蛋', 3, '个', 'meat', 2),
(1, '葱花', 1, '根', 'vegetable', 3),
(1, '盐', 5, '克', 'seasoning', 4),
(1, '白糖', 3, '克', 'seasoning', 5),
-- 红烧肉
(2, '五花肉', 500, '克', 'meat', 1),
(2, '生姜', 20, '克', 'vegetable', 2),
(2, '生抽', 2, '勺', 'seasoning', 3),
(2, '老抽', 1, '勺', 'seasoning', 4),
(2, '冰糖', 10, '克', 'seasoning', 5),
(2, '料酒', 1, '勺', 'seasoning', 6),
-- 拍黄瓜
(3, '黄瓜', 2, '根', 'vegetable', 1),
(3, '蒜末', 3, '瓣', 'vegetable', 2),
(3, '陈醋', 1, '勺', 'seasoning', 3),
(3, '香油', 1, '勺', 'seasoning', 4),
(3, '盐', 3, '克', 'seasoning', 5),
-- 奶油蘑菇汤
(4, '口蘑', 200, '克', 'vegetable', 1),
(4, '淡奶油', 50, '毫升', 'other', 2),
(4, '黄油', 20, '克', 'other', 3),
(4, '盐', 3, '克', 'seasoning', 4),
(4, '黑胡椒', 2, '克', 'seasoning', 5),
-- 草莓布丁
(5, '牛奶', 200, '毫升', 'other', 1),
(5, '白糖', 20, '克', 'seasoning', 2),
(5, '草莓', 5, '个', 'vegetable', 3),
(5, '吉利丁片', 2, '片', 'other', 4),
-- 全麦三明治
(6, '全麦吐司', 2, '片', 'other', 1),
(6, '生菜', 2, '片', 'vegetable', 2),
(6, '火腿', 1, '片', 'meat', 3),
(6, '芝士', 1, '片', 'other', 4),
(6, '番茄', 1, '个', 'vegetable', 5),
-- 清炒时蔬
(7, '油菜', 300, '克', 'vegetable', 1),
(7, '蒜瓣', 2, '个', 'vegetable', 2),
(7, '蚝油', 1, '勺', 'seasoning', 3),
(7, '盐', 3, '克', 'seasoning', 4),
-- 鲜虾云吞
(8, '云吞皮', 10, '张', 'other', 1),
(8, '虾仁', 100, '克', 'seafood', 2),
(8, '猪肉碎', 50, '克', 'meat', 3),
(8, '葱姜', 10, '克', 'vegetable', 4),
-- 宫保鸡丁
(9, '鸡胸肉', 200, '克', 'meat', 1),
(9, '花生米', 50, '克', 'other', 2),
(9, '干辣椒', 10, '个', 'seasoning', 3),
(9, '花椒', 5, '克', 'seasoning', 4),
(9, '葱姜蒜', 20, '克', 'vegetable', 5),
-- 紫菜蛋花汤
(10, '紫菜', 10, '克', 'vegetable', 1),
(10, '鸡蛋', 1, '个', 'meat', 2),
(10, '盐', 3, '克', 'seasoning', 3),
(10, '香油', 1, '勺', 'seasoning', 4);

-- 插入菜谱标签关联
INSERT INTO dish_tag_relation (dish_id, tag_id, created_at) VALUES
(1, 1, NOW()), (1, 2, NOW()),  -- 番茄炒蛋: 家常、快手
(2, 3, NOW()), (2, 4, NOW()),  -- 红烧肉: 硬菜、解馋
(3, 5, NOW()), (3, 6, NOW()),  -- 拍黄瓜: 清爽、下酒
(4, 7, NOW()),                  -- 奶油蘑菇汤: 暖胃
(5, 8, NOW()),                  -- 草莓布丁: 甜美
(6, 9, NOW()), (6, 2, NOW()), (6, 13, NOW()),  -- 全麦三明治: 减脂、快手、早餐
(7, 10, NOW()), (7, 11, NOW()), -- 清炒时蔬: 健康、素食
(8, 12, NOW()), (8, 13, NOW()), -- 鲜虾云吞: 鲜美、早餐
(9, 1, NOW()), (9, 4, NOW()),   -- 宫保鸡丁: 家常、解馋
(10, 2, NOW()), (10, 10, NOW()); -- 紫菜蛋花汤: 快手、健康

-- ============================================
-- 菜单数据
-- ============================================

-- 插入今日菜单计划
INSERT INTO menu_plan_aggregate (id, family_id, menu_date, status, total_calories, total_items, version, created_at, updated_at) VALUES
(1, 1, CURDATE(), 1, 1200, 6, 0, NOW(), NOW()),
(2, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 1100, 5, 0, NOW(), NOW());

-- 插入今日菜单项
INSERT INTO menu_item (menu_plan_id, dish_id, selector_id, meal_time, day_type, status, created_at) VALUES
-- 今日早餐
(1, 6, 2, 'breakfast', 'today', 1, NOW()),
(1, 10, 2, 'breakfast', 'today', 1, NOW()),
-- 今日午餐
(1, 1, 1, 'lunch', 'today', 1, NOW()),
(1, 7, 4, 'lunch', 'today', 1, NOW()),
-- 今日晚餐
(1, 2, 1, 'dinner', 'today', 1, NOW()),
(1, 3, 2, 'dinner', 'today', 1, NOW()),
-- 明日早餐
(2, 8, 2, 'breakfast', 'tomorrow', 1, NOW()),
-- 明日午餐
(2, 9, 1, 'lunch', 'tomorrow', 1, NOW()),
(2, 7, 4, 'lunch', 'tomorrow', 1, NOW()),
-- 明日晚餐
(2, 1, 2, 'dinner', 'tomorrow', 1, NOW()),
(2, 4, 2, 'dinner', 'tomorrow', 1, NOW());

-- ============================================
-- 购物清单数据
-- ============================================

-- 插入购物清单
INSERT INTO shopping_list_aggregate (id, family_id, start_date, end_date, status, total_items, checked_items, version, created_at, updated_at) VALUES
(1, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1, 15, 3, 0, NOW(), NOW());

-- 插入购物项
INSERT INTO shopping_item (shopping_list_id, ingredient_name, quantity, unit, category, is_checked, checked_at) VALUES
(1, '番茄', 4, '个', 'vegetable', TRUE, NOW()),
(1, '鸡蛋', 5, '个', 'meat', TRUE, NOW()),
(1, '五花肉', 500, '克', 'meat', FALSE, NULL),
(1, '黄瓜', 2, '根', 'vegetable', TRUE, NOW()),
(1, '油菜', 300, '克', 'vegetable', FALSE, NULL),
(1, '鸡胸肉', 200, '克', 'meat', FALSE, NULL),
(1, '虾仁', 100, '克', 'seafood', FALSE, NULL),
(1, '云吞皮', 10, '张', 'other', FALSE, NULL),
(1, '奶油蘑菇汤', 200, '克', 'vegetable', FALSE, NULL),
(1, '生姜', 30, '克', 'vegetable', FALSE, NULL),
(1, '蒜瓣', 5, '个', 'vegetable', FALSE, NULL),
(1, '生抽', 3, '勺', 'seasoning', FALSE, NULL),
(1, '盐', 20, '克', 'seasoning', FALSE, NULL),
(1, '花生米', 50, '克', 'other', FALSE, NULL),
(1, '紫菜', 10, '克', 'vegetable', FALSE, NULL);

-- ============================================
-- 统计数据
-- ============================================

-- 插入烹饪记录
INSERT INTO cooking_record (family_id, dish_id, menu_item_id, cook_id, cooking_date, actual_time, difficulty_rating, taste_rating, notes, created_at) VALUES
(1, 1, 1, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 12, 2, 5, '味道不错，家人都喜欢', NOW()),
(1, 2, 2, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 65, 3, 5, '第一次做，有点费时间', NOW()),
(1, 3, 3, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 5, 1, 4, '简单快手，很清爽', NOW()),
(1, 6, 4, 2, CURDATE(), 10, 1, 5, '早餐必备', NOW()),
(1, 7, 5, 4, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 8, 1, 4, '健康素食', NOW());

-- 插入点赞记录
INSERT INTO dish_like (dish_id, user_id, menu_item_id, created_at) VALUES
(1, 2, 1, NOW()),
(1, 3, 1, NOW()),
(1, 4, 1, NOW()),
(2, 2, 2, NOW()),
(2, 3, 2, NOW()),
(3, 1, 3, NOW()),
(3, 3, 3, NOW()),
(6, 1, 4, NOW()),
(6, 3, 4, NOW()),
(6, 4, 4, NOW()),
(7, 1, 5, NOW()),
(7, 2, 5, NOW());

-- 插入统计快照
INSERT INTO family_stats_snapshot (family_id, snapshot_date, period_type, total_dishes_cooked, unique_dishes_cooked, most_cooked_dish_id, most_cooked_count, top_cook_user_id, top_cook_count, avg_calories, created_at) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'weekly', 25, 8, 1, 5, 1, 12, 220.5, NOW()),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'daily', 3, 3, 1, 1, 1, 2, 180.0, NOW());

-- ============================================
-- 更新统计数据
-- ============================================

-- 更新分类的菜谱数量
UPDATE dish_category SET dish_count = (
    SELECT COUNT(*) FROM dish_aggregate WHERE category_id = dish_category.id AND status = 1
);

-- 更新标签的使用次数
UPDATE dish_tag SET use_count = (
    SELECT COUNT(*) FROM dish_tag_relation WHERE tag_id = dish_tag.id
);

-- ============================================
-- 数据验证查询
-- ============================================

-- 查看数据统计
SELECT 
    '用户数' as item, COUNT(*) as count FROM user_aggregate
UNION ALL
SELECT '家庭数', COUNT(*) FROM family_aggregate
UNION ALL
SELECT '菜谱数', COUNT(*) FROM dish_aggregate
UNION ALL
SELECT '菜单计划数', COUNT(*) FROM menu_plan_aggregate
UNION ALL
SELECT '购物清单数', COUNT(*) FROM shopping_list_aggregate;

-- 显示完成信息
SELECT '✅ 初始化数据插入完成！' as message;
SELECT '📊 数据概览：' as message;
SELECT '   - 4个测试用户（爸爸、妈妈、宝贝、奶奶）' as message;
SELECT '   - 1个家庭（幸福之家）' as message;
SELECT '   - 10道菜谱（涵盖各个分类）' as message;
SELECT '   - 今日和明日的菜单计划' as message;
SELECT '   - 1个购物清单（15项食材）' as message;
SELECT '   - 烹饪记录和点赞数据' as message;
