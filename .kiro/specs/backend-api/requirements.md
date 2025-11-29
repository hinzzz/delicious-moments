# 食光集后端 API 需求文档

## 项目概述

为食光集小程序开发后端服务，使用 Spring Boot + MySQL 实现数据持久化和业务逻辑。

## 技术栈

- **后端框架**: Spring Boot 3.x
- **数据库**: MySQL 8.0
- **ORM**: MyBatis-Plus
- **认证**: JWT
- **文档**: Swagger/OpenAPI
- **部署**: Docker

## 核心功能需求

### AC-1: 用户与家庭管理

**描述**: 支持用户注册、登录、家庭创建和成员管理

**验收标准**:
- 用户可以注册账号（手机号/微信登录）
- 用户可以创建家庭或加入已有家庭
- 家庭创建者可以邀请成员（生成邀请码）
- 支持家庭成员列表查询
- 用户可以设置头像和昵称

### AC-2: 菜谱管理

**描述**: 菜谱的增删改查，支持分类和标签

**验收标准**:
- 支持创建菜谱（名称、封面、时长、食材、分类、标签）
- 支持编辑和删除菜谱
- 支持按分类筛选菜谱
- 支持按标签筛选菜谱
- 支持搜索菜谱（按名称）
- 支持菜谱图片上传（OSS/本地存储）

### AC-3: 分类管理

**描述**: 菜谱分类的增删改查

**验收标准**:
- 支持创建分类（名称、图标）
- 支持编辑分类名称
- 支持删除分类（需检查是否有菜谱使用）
- 支持查询所有分类

### AC-4: 标签管理

**描述**: 标签的增删改查和统计

**验收标准**:
- 支持创建标签
- 支持编辑标签名称（自动更新所有关联菜谱）
- 支持删除标签（自动从所有菜谱中移除）
- 支持查询标签使用统计

### AC-5: 菜单计划

**描述**: 今日/明日菜单的管理

**验收标准**:
- 支持添加菜品到菜单（指定日期、餐次、点菜人）
- 支持删除菜单项
- 支持查询指定日期和餐次的菜单
- 支持批量查询今日和明日的所有菜单

### AC-6: 购物清单

**描述**: 根据菜单自动生成购物清单

**验收标准**:
- 根据选中的菜单项聚合食材
- 合并同名同单位的食材数量
- 按食材类别分组（蔬菜、肉类、调料等）
- 支持勾选已购买的食材
- 支持清空购物清单

### AC-7: 饮食记录

**描述**: 历史菜单记录和统计

**验收标准**:
- 支持查询历史菜单（按周、按日期范围）
- 支持菜品点赞
- 统计最常做的菜品
- 统计家庭成员做菜次数
- 统计口味偏好（蔬菜、肉类、海鲜占比）

### AC-8: 数据同步

**描述**: 小程序与后端的数据同步

**验收标准**:
- 支持增量同步（只同步变更数据）
- 支持离线操作（本地存储 + 后续同步）
- 冲突解决策略（服务端优先）

## 非功能需求

### NFR-1: 性能要求
- API 响应时间 < 500ms
- 支持并发 100+ 用户
- 图片上传 < 5MB

### NFR-2: 安全要求
- 所有 API 需要 JWT 认证
- 敏感操作需要二次验证
- SQL 注入防护
- XSS 防护

### NFR-3: 可维护性
- RESTful API 设计
- 统一的响应格式
- 完整的 API 文档
- 日志记录和监控

## API 端点规划

### 用户相关
- POST /api/auth/register - 注册
- POST /api/auth/login - 登录
- GET /api/users/profile - 获取用户信息
- PUT /api/users/profile - 更新用户信息

### 家庭相关
- POST /api/families - 创建家庭
- POST /api/families/join - 加入家庭
- GET /api/families/{id}/members - 获取家庭成员
- POST /api/families/invite - 生成邀请码

### 菜谱相关
- GET /api/dishes - 查询菜谱列表
- GET /api/dishes/{id} - 获取菜谱详情
- POST /api/dishes - 创建菜谱
- PUT /api/dishes/{id} - 更新菜谱
- DELETE /api/dishes/{id} - 删除菜谱
- POST /api/dishes/upload - 上传图片

### 分类相关
- GET /api/categories - 查询所有分类
- POST /api/categories - 创建分类
- PUT /api/categories/{id} - 更新分类
- DELETE /api/categories/{id} - 删除分类

### 标签相关
- GET /api/tags - 查询所有标签
- GET /api/tags/stats - 查询标签统计
- POST /api/tags - 创建标签
- PUT /api/tags/{id} - 更新标签
- DELETE /api/tags/{id} - 删除标签

### 菜单相关
- GET /api/menus - 查询菜单（支持日期、餐次筛选）
- POST /api/menus - 添加菜单项
- DELETE /api/menus/{id} - 删除菜单项

### 购物清单相关
- GET /api/shopping-list - 获取购物清单
- PUT /api/shopping-list/check - 勾选食材
- DELETE /api/shopping-list - 清空清单

### 统计相关
- GET /api/stats/dishes - 菜品统计
- GET /api/stats/members - 成员统计
- GET /api/stats/preferences - 口味偏好统计
- POST /api/stats/like - 点赞菜品

## 数据库设计要点

### 核心表
- users - 用户表
- families - 家庭表
- family_members - 家庭成员关联表
- dishes - 菜谱表
- categories - 分类表
- tags - 标签表
- dish_tags - 菜谱标签关联表
- ingredients - 食材表
- menus - 菜单表
- shopping_items - 购物清单表
- dish_likes - 菜品点赞表

### 索引策略
- 用户 ID、家庭 ID 建立索引
- 菜单日期、餐次建立联合索引
- 菜谱名称建立全文索引

## 部署方案

- 使用 Docker Compose 部署
- MySQL 数据持久化
- Nginx 反向代理
- 支持 HTTPS
