# 数据库初始化说明

## 📋 文件说明

- `schema.sql` - 数据库表结构（无外键约束）
- `data.sql` - 初始化测试数据
- `init-all.sh` - 一键初始化脚本
- `schema-with-fk.sql.bak` - 带外键约束的表结构（备份）

## 🚀 快速初始化

### 方法一：使用一键脚本（推荐）

```bash
cd sql
./init-all.sh
```

### 方法二：手动执行

```bash
# 1. 创建表结构
mysql -u root -p < schema.sql

# 2. 插入测试数据
mysql -u root -p < data.sql
```

## 📊 初始化数据概览

### 用户数据（4个用户）

| ID | 昵称 | OpenID | 角色 |
|----|------|--------|------|
| 1 | 爸爸 | test_openid_001 | 家庭创建者 |
| 2 | 妈妈 | test_openid_002 | 家庭成员 |
| 3 | 宝贝 | test_openid_003 | 家庭成员 |
| 4 | 奶奶 | test_openid_004 | 家庭成员 |

### 家庭数据（1个家庭）

| ID | 名称 | 邀请码 | 创建者 | 成员数 |
|----|------|--------|--------|--------|
| 1 | 幸福之家 | ABC123 | 爸爸 | 4人 |

### 菜谱数据（10道菜）

| ID | 菜名 | 分类 | 标签 | 烹饪时间 | 制作次数 |
|----|------|------|------|----------|----------|
| 1 | 番茄炒蛋 | 热菜 | 家常、快手 | 10分钟 | 12次 |
| 2 | 红烧肉 | 热菜 | 硬菜、解馋 | 60分钟 | 5次 |
| 3 | 拍黄瓜 | 凉菜 | 清爽、下酒 | 5分钟 | 8次 |
| 4 | 奶油蘑菇汤 | 汤羹 | 暖胃 | 20分钟 | 2次 |
| 5 | 草莓布丁 | 甜点 | 甜美 | 15分钟 | 6次 |
| 6 | 全麦三明治 | 主食 | 减脂、快手、早餐 | 10分钟 | 15次 |
| 7 | 清炒时蔬 | 热菜 | 健康、素食 | 8分钟 | 9次 |
| 8 | 鲜虾云吞 | 主食 | 鲜美、早餐 | 15分钟 | 4次 |
| 9 | 宫保鸡丁 | 热菜 | 家常、解馋 | 15分钟 | 7次 |
| 10 | 紫菜蛋花汤 | 汤羹 | 快手、健康 | 5分钟 | 11次 |

### 分类数据（5个分类）

- 🥘 热菜
- 🥗 凉菜
- 🥣 汤羹
- 🍮 甜点
- 🍚 主食

### 标签数据（13个标签）

家常、快手、硬菜、解馋、清爽、下酒、暖胃、甜美、减脂、健康、素食、鲜美、早餐

### 菜单计划

**今日菜单**：
- 早餐：全麦三明治、紫菜蛋花汤
- 午餐：番茄炒蛋、清炒时蔬
- 晚餐：红烧肉、拍黄瓜

**明日菜单**：
- 早餐：鲜虾云吞
- 午餐：宫保鸡丁、清炒时蔬
- 晚餐：番茄炒蛋、奶油蘑菇汤

### 购物清单（15项食材）

已勾选：
- ✅ 番茄 4个
- ✅ 鸡蛋 5个
- ✅ 黄瓜 2根

待购买：
- ⬜ 五花肉 500克
- ⬜ 油菜 300克
- ⬜ 鸡胸肉 200克
- ⬜ 虾仁 100克
- ⬜ 云吞皮 10张
- ⬜ 口蘑 200克
- ⬜ 生姜 30克
- ⬜ 蒜瓣 5个
- ⬜ 生抽 3勺
- ⬜ 盐 20克
- ⬜ 花生米 50克
- ⬜ 紫菜 10克

## 🔧 数据库设计特点

### 1. 无外键约束
- 数据一致性由应用层保证
- 更好的性能和扩展性
- 便于分库分表

### 2. 乐观锁
- 使用 `version` 字段
- 防止并发更新冲突

### 3. 软删除
- 使用 `deleted_at` 字段
- 数据不会真正删除
- 可以恢复误删数据

### 4. 自动时间戳
- `created_at` - 创建时间
- `updated_at` - 更新时间
- 自动维护，无需手动设置

### 5. 索引优化
- 单列索引：常用查询字段
- 复合索引：多条件查询
- 唯一索引：保证数据唯一性
- 全文索引：支持中文搜索

## 📝 测试账号

### 用户登录测试

```json
{
  "openid": "test_openid_001",
  "nickname": "爸爸",
  "avatar": "https://picsum.photos/id/1005/200/200"
}
```

### 家庭邀请码

```
ABC123
```

## 🔍 常用查询

### 查看所有用户
```sql
SELECT u.id, p.nickname, u.openid, p.phone
FROM user_aggregate u
LEFT JOIN user_profile p ON u.id = p.user_id
WHERE u.deleted_at IS NULL;
```

### 查看家庭成员
```sql
SELECT f.name as family_name, p.nickname, fm.role
FROM family_member fm
JOIN family_aggregate f ON fm.family_id = f.id
JOIN user_profile p ON fm.user_id = p.user_id
WHERE f.id = 1;
```

### 查看今日菜单
```sql
SELECT 
    mi.meal_time,
    d.name as dish_name,
    dc.name as category_name,
    p.nickname as selector_name
FROM menu_item mi
JOIN menu_plan_aggregate mp ON mi.menu_plan_id = mp.id
JOIN dish_aggregate d ON mi.dish_id = d.id
LEFT JOIN dish_category dc ON d.category_id = dc.id
LEFT JOIN user_profile p ON mi.selector_id = p.user_id
WHERE mp.menu_date = CURDATE()
ORDER BY 
    FIELD(mi.meal_time, 'breakfast', 'lunch', 'dinner');
```

### 查看菜谱及其标签
```sql
SELECT 
    d.name as dish_name,
    GROUP_CONCAT(t.name) as tags
FROM dish_aggregate d
LEFT JOIN dish_tag_relation dtr ON d.id = dtr.dish_id
LEFT JOIN dish_tag t ON dtr.tag_id = t.id
WHERE d.status = 1
GROUP BY d.id, d.name;
```

### 查看购物清单
```sql
SELECT 
    category,
    ingredient_name,
    quantity,
    unit,
    is_checked
FROM shopping_item
WHERE shopping_list_id = 1
ORDER BY 
    FIELD(category, 'vegetable', 'meat', 'seafood', 'seasoning', 'other'),
    is_checked,
    ingredient_name;
```

## 🗑️ 清空数据

如果需要重新初始化，可以先清空数据：

```sql
-- 清空所有表数据（保留表结构）
USE delicious_moments;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE domain_event;
TRUNCATE TABLE family_stats_snapshot;
TRUNCATE TABLE dish_like;
TRUNCATE TABLE cooking_record;
TRUNCATE TABLE shopping_item;
TRUNCATE TABLE shopping_list_aggregate;
TRUNCATE TABLE menu_item;
TRUNCATE TABLE menu_plan_aggregate;
TRUNCATE TABLE dish_tag_relation;
TRUNCATE TABLE dish_ingredient;
TRUNCATE TABLE dish_tag;
TRUNCATE TABLE dish_category;
TRUNCATE TABLE dish_aggregate;
TRUNCATE TABLE family_member;
TRUNCATE TABLE family_aggregate;
TRUNCATE TABLE user_achievement;
TRUNCATE TABLE user_profile;
TRUNCATE TABLE user_aggregate;

SET FOREIGN_KEY_CHECKS = 1;
```

然后重新执行 `data.sql` 即可。

## ⚠️ 注意事项

1. **生产环境**：请修改默认密码和敏感信息
2. **数据备份**：定期备份数据库
3. **性能优化**：根据实际使用情况调整索引
4. **数据清理**：定期清理软删除的数据

## 📞 问题反馈

如有问题，请联系开发团队。
