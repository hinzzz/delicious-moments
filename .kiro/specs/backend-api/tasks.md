# 食光集后端开发任务分解

> 基于前端 Taro 小程序的实际功能，提供完整的后端 API 支持

## 前端功能概览

**已实现页面**:
- 菜单页 (Home): 今日/明日菜单、三餐管理
- 私房菜谱 (Recipes): 菜谱列表、分类筛选、标签筛选、搜索
- 翻寻味 (Summary): 历史记录、统计分析
- 家庭页 (Profile): 用户信息、家庭成员、设置
- 菜谱详情、创建菜谱、菜单选择、购物清单、分类管理、标签管理

**核心数据模型**:
```typescript
Dish: id, name, cover, calories, time, tags[], ingredients[], categoryId, cookedCount, lastRating
MenuItem: id, dish, selectorId, mealTime, day, date
Category: id, name, icon
User: id, name, avatar, achievements[]
Ingredient: name, quantity, unit, category
```

---

## 阶段 1: 项目初始化 (预估: 1天)

### T-1.1: 项目脚手架搭建
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 使用 Spring Initializr 创建 Spring Boot 3.2.x 项目
- 配置 Maven 依赖 (Web, MyBatis-Plus, MySQL, Lombok, JWT)
- 设置项目目录结构 (controller, service, mapper, entity, dto, common, util)
- 配置开发环境 (JDK 17+, Maven 3.8+)

**验收标准**:
- ✅ 项目可以正常启动
- ✅ 访问 http://localhost:8080 返回正常
- ✅ 所有依赖正确引入

### T-1.2: 数据库环境搭建
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 安装 MySQL 8.0
- 创建数据库 `delicious_moments`
- 配置字符集 utf8mb4
- 配置连接池参数

**验收标准**:
- ✅ 数据库连接正常
- ✅ 支持 emoji 字符存储
- ✅ 时区设置正确 (Asia/Shanghai)


### T-1.3: 基础配置
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 配置 application.yml (dev/prod 环境)
- 集成 Swagger/Knife4j API 文档
- 配置跨域支持 (CORS)
- 设置统一异常处理

**验收标准**:
- ✅ Swagger 文档可访问 (http://localhost:8080/doc.html)
- ✅ 支持小程序跨域请求
- ✅ 异常统一返回 JSON 格式

### T-1.4: 通用组件开发
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 统一响应格式 Result<T> (code, message, data, timestamp)
- 分页查询封装 PageResult<T>
- 常用工具类 (IdGenerator, DateUtil, StringUtil)
- 日志配置 (Logback)

**验收标准**:
- ✅ 统一的 JSON 响应格式
- ✅ 支持分页查询
- ✅ 日志正常输出到文件

---

## 阶段 2: 数据库设计与实现 (预估: 2天)

### T-2.1: 数据库表设计
**负责人**: 后端开发  
**预估时间**: 4小时  
**任务描述**:
- 设计所有数据表结构
- 定义主键、外键关系
- 设计索引策略
- 编写 DDL 脚本

**核心表**:
1. `users` - 用户表
2. `families` - 家庭表
3. `family_members` - 家庭成员关联表
4. `categories` - 分类表
5. `tags` - 标签表
6. `dishes` - 菜谱表
7. `dish_tags` - 菜谱标签关联表
8. `ingredients` - 食材表
9. `menus` - 菜单表
10. `shopping_items` - 购物清单表
11. `dish_likes` - 菜品点赞表
12. `achievements` - 成就表
13. `user_achievements` - 用户成就关联表

**验收标准**:
- ✅ 完整的 SQL 建表脚本
- ✅ 合理的字段类型和长度
- ✅ 必要的索引和约束

### T-2.2: 实体类和 Mapper 开发
**负责人**: 后端开发  
**预估时间**: 4小时  
**任务描述**:
- 创建所有实体类 (Entity)
- 创建 MyBatis-Plus Mapper 接口
- 配置字段映射和类型转换
- 添加必要的注解 (@TableName, @TableId, @TableField)

**验收标准**:
- ✅ 所有实体类字段完整
- ✅ Mapper 接口继承 BaseMapper
- ✅ 支持自动填充时间字段 (created_at, updated_at)

---

## 阶段 3: 用户认证模块 (预估: 2天)

### T-3.1: 微信小程序登录
**负责人**: 后端开发  
**预估时间**: 4小时  
**任务描述**:
- 集成微信小程序登录 (code2Session)
- 实现 JWT Token 生成和验证
- 配置认证拦截器
- 实现登录接口

**API 端点**:
- `POST /api/auth/wx-login` - 微信登录
- `POST /api/auth/refresh-token` - 刷新 Token

**验收标准**:
- ✅ 微信登录流程正常
- ✅ JWT Token 生成和验证正常
- ✅ Token 过期自动刷新

### T-3.2: 用户管理接口
**负责人**: 后端开发  
**预估时间**: 4小时  
**任务描述**:
- 用户信息查询和更新
- 头像上传接口
- 用户成就管理

**API 端点**:
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `POST /api/users/avatar` - 上传头像
- `GET /api/users/achievements` - 获取用户成就

**验收标准**:
- ✅ 用户信息 CRUD 正常
- ✅ 头像上传功能正常
- ✅ 成就系统正常

---

## 阶段 4: 家庭管理模块 (预估: 1.5天)

### T-4.1: 家庭 CRUD 接口
**负责人**: 后端开发  
**预估时间**: 3小时  
**任务描述**:
- 创建家庭接口
- 家庭信息查询
- 生成邀请码 (6位随机码)
- 加入家庭接口

**API 端点**:
- `POST /api/families` - 创建家庭
- `GET /api/families/{id}` - 获取家庭信息
- `POST /api/families/invite` - 生成邀请码
- `POST /api/families/join` - 加入家庭

**验收标准**:
- ✅ 创建家庭自动成为创建者
- ✅ 邀请码唯一且易记
- ✅ 加入家庭验证邀请码

### T-4.2: 家庭成员管理
**负责人**: 后端开发  
**预估时间**: 3小时  
**任务描述**:
- 查询家庭成员列表
- 移除家庭成员 (仅创建者)
- 转让家庭管理权

**API 端点**:
- `GET /api/families/{id}/members` - 获取成员列表
- `DELETE /api/families/{id}/members/{userId}` - 移除成员
- `PUT /api/families/{id}/transfer` - 转让管理权

**验收标准**:
- ✅ 成员列表包含用户信息
- ✅ 权限控制正确
- ✅ 转让后权限变更

---

## 阶段 5: 菜谱管理模块 (预估: 3天)

### T-5.1: 分类管理接口
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 分类 CRUD 接口
- 分类使用统计

**API 端点**:
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类
- `PUT /api/categories/{id}` - 更新分类
- `DELETE /api/categories/{id}` - 删除分类

**验收标准**:
- ✅ 分类按家庭隔离
- ✅ 删除分类时检查是否有菜谱使用
- ✅ 支持 emoji 图标

### T-5.2: 标签管理接口
**负责人**: 后端开发  
**预估时间**: 3小时  
**任务描述**:
- 标签 CRUD 接口
- 标签使用统计
- 批量更新菜谱标签

**API 端点**:
- `GET /api/tags` - 获取标签列表
- `GET /api/tags/stats` - 标签使用统计
- `POST /api/tags` - 创建标签
- `PUT /api/tags/{id}` - 更新标签
- `DELETE /api/tags/{id}` - 删除标签

**验收标准**:
- ✅ 标签按家庭隔离
- ✅ 统计每个标签的使用次数
- ✅ 更新标签名称时同步更新所有菜谱

### T-5.3: 菜谱 CRUD 接口
**负责人**: 后端开发  
**预估时间**: 6小时  
**任务描述**:
- 菜谱创建接口（包含食材）
- 菜谱查询（支持分页、筛选、搜索）
- 菜谱更新和删除
- 图片上传接口

**API 端点**:
- `GET /api/dishes` - 获取菜谱列表（分页）
- `GET /api/dishes/{id}` - 获取菜谱详情
- `POST /api/dishes` - 创建菜谱
- `PUT /api/dishes/{id}` - 更新菜谱
- `DELETE /api/dishes/{id}` - 删除菜谱
- `POST /api/dishes/upload` - 上传菜谱图片

**请求参数**:
```json
{
  "name": "番茄炒蛋",
  "cover": "https://...",
  "calories": 150,
  "time": 10,
  "tags": ["家常", "快手"],
  "categoryId": "c1",
  "description": "经典家常菜",
  "ingredients": [
    {"name": "番茄", "quantity": 2, "unit": "个", "category": "vegetable"},
    {"name": "鸡蛋", "quantity": 3, "unit": "个", "category": "meat"}
  ]
}
```

**验收标准**:
- ✅ 创建菜谱时同时保存食材
- ✅ 菜谱按家庭隔离
- ✅ 支持图片上传和压缩
- ✅ 删除菜谱时级联删除食材

### T-5.4: 高级查询功能
**负责人**: 后端开发  
**预估时间**: 3小时  
**任务描述**:
- 按分类筛选菜谱
- 按标签筛选菜谱（支持多标签）
- 菜谱名称搜索（模糊查询）
- 复合条件查询

**查询参数**:
```
GET /api/dishes?page=1&size=10&categoryId=c1&tags=家常,快手&keyword=番茄&sort=cookedCount,desc
```

**验收标准**:
- ✅ 支持多条件组合查询
- ✅ 查询性能优化（索引）
- ✅ 分页查询正常

---

## 阶段 6: 菜单计划模块 (预估: 2天)

### T-6.1: 菜单 CRUD 接口
**负责人**: 后端开发  
**预估时间**: 4小时  
**任务描述**:
- 添加菜品到菜单
- 删除菜单项
- 查询菜单（按日期、餐次）

**API 端点**:
- `GET /api/menus` - 获取菜单列表
- `POST /api/menus` - 添加菜单项
- `DELETE /api/menus/{id}` - 删除菜单项

**请求参数**:
```json
{
  "dishId": "d1",
  "mealTime": "lunch",
  "day": "today",
  "date": "2024-01-20"
}
```

**查询参数**:
```
GET /api/menus?day=today&date=2024-01-20
GET /api/menus?startDate=2024-01-15&endDate=2024-01-20
```

**验收标准**:
- ✅ 添加菜单时记录点菜人
- ✅ 支持今日/明日查询
- ✅ 支持日期范围查询

### T-6.2: 菜单查询优化
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 批量查询今日明日菜单
- 菜单数据关联查询优化（避免 N+1）
- 缓存热点数据

**验收标准**:
- ✅ 一次查询返回完整菜单数据（包含菜品、分类、点菜人）
- ✅ 查询响应时间 < 200ms
- ✅ 支持 Redis 缓存（可选）

### T-6.3: 菜单统计接口
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 统计家庭成员做菜次数
- 统计最常做的菜品
- 统计口味偏好（标签统计）

**API 端点**:
- `GET /api/stats/members` - 成员统计
- `GET /api/stats/dishes` - 菜品统计
- `GET /api/stats/preferences` - 口味偏好

**响应示例**:
```json
{
  "members": [
    {"userId": "u1", "name": "爸爸", "count": 15},
    {"userId": "u2", "name": "妈妈", "count": 12}
  ],
  "topDishes": [
    {"dishId": "d1", "name": "番茄炒蛋", "count": 12}
  ],
  "preferences": [
    {"tag": "家常", "count": 20},
    {"tag": "快手", "count": 15}
  ]
}
```

**验收标准**:
- ✅ 统计数据准确
- ✅ 支持时间范围筛选
- ✅ 性能优化（使用聚合查询）

---

## 阶段 7: 购物清单模块 (预估: 1.5天)

### T-7.1: 购物清单生成算法
**负责人**: 后端开发  
**预估时间**: 4小时  
**任务描述**:
- 根据菜单聚合食材
- 合并同名同单位食材（数量相加）
- 按类别分组（蔬菜、肉类、海鲜、调料、其他）

**算法逻辑**:
```
1. 查询指定日期范围的菜单
2. 提取所有菜品的食材
3. 按 name + unit 分组聚合
4. 按 category 分类
5. 生成购物清单
```

**验收标准**:
- ✅ 同名同单位食材正确合并
- ✅ 不同单位食材分开显示
- ✅ 按类别分组展示

### T-7.2: 购物清单接口
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 生成购物清单
- 勾选/取消勾选食材
- 清空购物清单

**API 端点**:
- `GET /api/shopping-list` - 获取购物清单
- `POST /api/shopping-list/generate` - 生成购物清单
- `PUT /api/shopping-list/{id}/check` - 勾选食材
- `DELETE /api/shopping-list` - 清空购物清单

**查询参数**:
```
GET /api/shopping-list?startDate=2024-01-20&endDate=2024-01-21
```

**验收标准**:
- ✅ 生成清单按类别分组
- ✅ 勾选状态持久化
- ✅ 支持清空已勾选项

---

## 阶段 8: 饮食记录模块 (预估: 2天)

### T-8.1: 历史记录查询
**负责人**: 后端开发  
**预估时间**: 3小时  
**任务描述**:
- 按时间范围查询历史菜单
- 支持周、月、自定义范围
- 分页查询优化

**API 端点**:
- `GET /api/history/menus` - 历史菜单查询

**查询参数**:
```
GET /api/history/menus?range=week&page=1&size=20
GET /api/history/menus?startDate=2024-01-01&endDate=2024-01-31
```

**验收标准**:
- ✅ 支持本周/上周/本月查询
- ✅ 支持自定义日期范围
- ✅ 分页查询正常

### T-8.2: 点赞功能
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 菜品点赞接口
- 点赞状态查询
- 点赞统计

**API 端点**:
- `POST /api/likes` - 点赞菜品
- `DELETE /api/likes/{id}` - 取消点赞
- `GET /api/likes/status` - 查询点赞状态

**请求参数**:
```json
{
  "dishId": "d1",
  "menuId": "m1"
}
```

**验收标准**:
- ✅ 同一用户对同一菜单项只能点赞一次
- ✅ 点赞数实时更新
- ✅ 支持批量查询点赞状态

### T-8.3: 数据统计接口
**负责人**: 后端开发  
**预估时间**: 3小时  
**任务描述**:
- 最爱吃的菜品统计（按点赞数）
- 本周厨神统计（按做菜次数）
- 口味偏好分析（按标签统计）

**API 端点**:
- `GET /api/stats/favorite-dishes` - 最爱吃的菜
- `GET /api/stats/top-cooks` - 厨神排行
- `GET /api/stats/taste-preferences` - 口味偏好

**验收标准**:
- ✅ 统计数据准确
- ✅ 支持时间范围筛选
- ✅ 返回 Top 10 排行

---

## 阶段 9: 文件上传模块 (预估: 1天)

### T-9.1: 本地文件上传
**负责人**: 后端开发  
**预估时间**: 3小时  
**任务描述**:
- 配置文件上传路径
- 文件类型和大小限制（图片 < 5MB）
- 生成唯一文件名（UUID）
- 静态资源访问配置

**API 端点**:
- `POST /api/upload/image` - 上传图片

**验收标准**:
- ✅ 支持 jpg, png, webp 格式
- ✅ 文件大小限制正常
- ✅ 上传后返回访问 URL

### T-9.2: 图片处理
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 图片压缩（大于 1MB 自动压缩）
- 缩略图生成（200x200）
- 图片格式转换（统一转 webp）

**验收标准**:
- ✅ 压缩后图片质量可接受
- ✅ 缩略图生成正常
- ✅ 性能优化（异步处理）

### T-9.3: OSS 集成（可选）
**负责人**: 后端开发  
**预估时间**: 3小时  
**任务描述**:
- 集成阿里云 OSS / 腾讯云 COS
- 配置 CDN 加速
- 图片防盗链

**验收标准**:
- ✅ 文件上传到云存储
- ✅ CDN 访问正常
- ✅ 支持本地/云存储切换

---

## 阶段 10: 测试与部署 (预估: 2天)

### T-10.1: 单元测试
**负责人**: 后端开发  
**预估时间**: 4小时  
**任务描述**:
- 编写 Service 层单元测试
- 编写 Controller 层集成测试
- 测试覆盖率 > 80%

**测试重点**:
- 用户认证流程
- 菜谱 CRUD 操作
- 购物清单生成算法
- 统计数据准确性

**验收标准**:
- ✅ 所有测试用例通过
- ✅ 测试覆盖率达标
- ✅ 边界条件测试完整

### T-10.2: API 文档完善
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 完善 Swagger 注解
- 添加接口示例
- 生成 API 文档
- 编写接口调用说明

**验收标准**:
- ✅ 所有接口有完整文档
- ✅ 请求/响应示例完整
- ✅ 错误码说明清晰

### T-10.3: Docker 部署
**负责人**: 后端开发  
**预估时间**: 2小时  
**任务描述**:
- 编写 Dockerfile
- 配置 docker-compose.yml
- 数据库初始化脚本
- 环境变量配置

**验收标准**:
- ✅ Docker 镜像构建成功
- ✅ docker-compose 一键启动
- ✅ 数据库自动初始化

---

## 总体时间估算

**总工作量**: 约 15 个工作日

**关键路径**: 
1. 数据库设计 (4h)
2. 用户认证 (8h)
3. 菜谱管理 (11h)
4. 菜单计划 (8h)
5. 购物清单 (6h)

**并行开发建议**:
- 用户认证 与 家庭管理 可并行
- 分类管理 与 标签管理 可并行
- 文件上传 可独立开发

**风险点**:
- 购物清单算法复杂度（需要充分测试）
- 图片上传性能（需要异步处理）
- 统计查询性能（需要索引优化）

---

## 里程碑

| 周次 | 里程碑 | 交付物 |
|------|--------|--------|
| Week 1 | 基础设施完成 | 项目初始化、数据库设计、用户认证 |
| Week 2 | 核心功能完成 | 家庭管理、菜谱管理、分类标签 |
| Week 3 | 业务功能完成 | 菜单计划、购物清单、饮食记录 |
| Week 4 | 上线准备完成 | 文件上传、测试、部署、文档 |

---

## 交付物清单

- ✅ 完整的后端 API 服务
- ✅ MySQL 数据库脚本
- ✅ API 文档（Swagger）
- ✅ Docker 部署配置
- ✅ 单元测试报告
- ✅ 接口调用说明
- ✅ 部署运维文档

---

## 开发规范

### 代码规范
- 使用 Google Java Style
- 类名 PascalCase，方法名 camelCase
- 常量 UPPER_SNAKE_CASE
- 必须添加注释

### API 规范
- RESTful 设计原则
- 统一响应格式 `Result<T>`
- 统一异常处理
- 完整的 Swagger 文档

### 数据库规范
- 表名复数形式 (users, dishes)
- 字段名 snake_case
- 必须有 created_at, updated_at
- 外键字段以 _id 结尾

### 测试规范
- Service 层单元测试覆盖率 > 80%
- Controller 层集成测试
- 使用 @Transactional 保证测试数据隔离
