# 食光集后端技术设计文档

## 1. 系统架构

### 1.1 整体架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   小程序前端     │    │   Spring Boot   │    │     MySQL       │
│   (Taro)       │◄──►│   后端服务       │◄──►│     数据库       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   文件存储       │
                       │ (本地/OSS)      │
                       └─────────────────┘
```

### 1.2 技术栈选型

| 组件 | 技术选型 | 版本 | 说明 |
|------|----------|------|------|
| 框架 | Spring Boot | 3.2.x | 主框架 |
| 数据库 | MySQL | 8.0+ | 主数据库 |
| ORM | MyBatis-Plus | 3.5.x | 数据访问层 |
| 认证 | JWT | - | 无状态认证 |
| 文档 | Knife4j | 4.x | API 文档 |
| 构建 | Maven | 3.8+ | 项目构建 |
| 部署 | Docker | - | 容器化部署 |

---

## 2. 项目结构

```
delicious-moments-api/
├── src/main/java/com/delicious/
│   ├── config/              # 配置类
│   │   ├── SwaggerConfig.java
│   │   ├── JwtConfig.java
│   │   ├── CorsConfig.java
│   │   └── MyBatisPlusConfig.java
│   ├── controller/          # 控制器层
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── FamilyController.java
│   │   ├── DishController.java
│   │   ├── CategoryController.java
│   │   ├── TagController.java
│   │   ├── MenuController.java
│   │   ├── ShoppingController.java
│   │   ├── StatsController.java
│   │   └── UploadController.java
│   ├── service/             # 服务层
│   │   ├── impl/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── FamilyService.java
│   │   ├── DishService.java
│   │   ├── CategoryService.java
│   │   ├── TagService.java
│   │   ├── MenuService.java
│   │   ├── ShoppingService.java
│   │   ├── StatsService.java
│   │   └── UploadService.java
│   ├── mapper/              # 数据访问层
│   │   ├── UserMapper.java
│   │   ├── FamilyMapper.java
│   │   ├── DishMapper.java
│   │   ├── CategoryMapper.java
│   │   ├── TagMapper.java
│   │   ├── MenuMapper.java
│   │   └── ...
│   ├── entity/              # 实体类
│   │   ├── User.java
│   │   ├── Family.java
│   │   ├── Dish.java
│   │   ├── Category.java
│   │   ├── Tag.java
│   │   ├── Menu.java
│   │   ├── Ingredient.java
│   │   └── ...
│   ├── dto/                 # 数据传输对象
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── DishCreateRequest.java
│   │   │   └── MenuCreateRequest.java
│   │   └── response/
│   │       ├── DishResponse.java
│   │       ├── MenuResponse.java
│   │       └── StatsResponse.java
│   ├── common/              # 通用组件
│   │   ├── Result.java      # 统一响应格式
│   │   ├── PageResult.java  # 分页响应
│   │   ├── Constants.java   # 常量定义
│   │   └── exception/       # 异常处理
│   │       ├── GlobalExceptionHandler.java
│   │       ├── BusinessException.java
│   │       └── ErrorCode.java
│   └── util/                # 工具类
│       ├── JwtUtil.java
│       ├── FileUtil.java
│       ├── DateUtil.java
│       └── IdGenerator.java
├── src/main/resources/
│   ├── application.yml      # 主配置文件
│   ├── application-dev.yml  # 开发环境配置
│   ├── application-prod.yml # 生产环境配置
│   └── mapper/              # MyBatis XML 文件
├── src/test/                # 测试代码
├── docker/                  # Docker 配置
│   ├── Dockerfile
│   └── docker-compose.yml
└── sql/                     # 数据库脚本
    ├── schema.sql           # 建表脚本
    └── data.sql             # 初始数据
```

---

## 3. 数据库设计

### 3.1 ER 图

```
Users ──┐
        │
        ├── FamilyMembers ── Families
        │
        ├── Dishes ──┐
        │            │
        └── Menus ────┤
                      │
Categories ───────────┤
                      │
Tags ── DishTags ─────┘
        │
        └── Ingredients
```

### 3.2 核心表设计


#### 用户表 (users)
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    openid VARCHAR(100) UNIQUE COMMENT '微信openid',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    phone VARCHAR(20) COMMENT '手机号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_openid (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

#### 家庭表 (families)
```sql
CREATE TABLE families (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '家庭ID',
    name VARCHAR(100) NOT NULL COMMENT '家庭名称',
    invite_code VARCHAR(20) UNIQUE COMMENT '邀请码',
    creator_id BIGINT COMMENT '创建者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (creator_id) REFERENCES users(id),
    INDEX idx_invite_code (invite_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家庭表';
```

#### 家庭成员关联表 (family_members)
```sql
CREATE TABLE family_members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role ENUM('creator', 'member') DEFAULT 'member' COMMENT '角色',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_family_user (family_id, user_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='家庭成员关联表';
```

#### 分类表 (categories)
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    icon VARCHAR(10) COMMENT '图标(emoji)',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    INDEX idx_family_id (family_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';
```

#### 标签表 (tags)
```sql
CREATE TABLE tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '标签ID',
    name VARCHAR(50) NOT NULL COMMENT '标签名称',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    INDEX idx_family_id (family_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';
```

#### 菜谱表 (dishes)
```sql
CREATE TABLE dishes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '菜谱ID',
    name VARCHAR(100) NOT NULL COMMENT '菜名',
    cover VARCHAR(255) COMMENT '封面图URL',
    description TEXT COMMENT '描述',
    calories INT DEFAULT 0 COMMENT '卡路里',
    cooking_time INT DEFAULT 0 COMMENT '烹饪时间(分钟)',
    category_id BIGINT COMMENT '分类ID',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    creator_id BIGINT COMMENT '创建者ID',
    cooked_count INT DEFAULT 0 COMMENT '制作次数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_family_id (family_id),
    INDEX idx_category_id (category_id),
    INDEX idx_cooked_count (cooked_count),
    FULLTEXT INDEX ft_name (name) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜谱表';
```

#### 菜谱标签关联表 (dish_tags)
```sql
CREATE TABLE dish_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID',
    tag_id BIGINT NOT NULL COMMENT '标签ID',
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY uk_dish_tag (dish_id, tag_id),
    INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜谱标签关联表';
```

#### 食材表 (ingredients)
```sql
CREATE TABLE ingredients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '食材ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID',
    name VARCHAR(100) NOT NULL COMMENT '食材名称',
    quantity DECIMAL(10,2) COMMENT '数量',
    unit VARCHAR(20) COMMENT '单位',
    category ENUM('vegetable', 'meat', 'seafood', 'seasoning', 'other') DEFAULT 'other' COMMENT '食材类别',
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    INDEX idx_dish_id (dish_id),
    INDEX idx_name_unit (name, unit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食材表';
```

#### 菜单表 (menus)
```sql
CREATE TABLE menus (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '菜单ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    selector_id BIGINT COMMENT '点菜人ID',
    meal_time ENUM('breakfast', 'lunch', 'dinner') NOT NULL COMMENT '餐次',
    menu_date DATE NOT NULL COMMENT '菜单日期',
    day_type ENUM('today', 'tomorrow') NOT NULL COMMENT '今日/明日',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    FOREIGN KEY (selector_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_family_date_meal (family_id, menu_date, meal_time),
    INDEX idx_selector_id (selector_id),
    INDEX idx_menu_date (menu_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';
```

#### 购物清单表 (shopping_items)
```sql
CREATE TABLE shopping_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '清单项ID',
    family_id BIGINT NOT NULL COMMENT '家庭ID',
    ingredient_name VARCHAR(100) NOT NULL COMMENT '食材名称',
    quantity DECIMAL(10,2) COMMENT '数量',
    unit VARCHAR(20) COMMENT '单位',
    category ENUM('vegetable', 'meat', 'seafood', 'seasoning', 'other') DEFAULT 'other' COMMENT '食材类别',
    is_checked BOOLEAN DEFAULT FALSE COMMENT '是否已勾选',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    INDEX idx_family_id (family_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物清单表';
```

#### 菜品点赞表 (dish_likes)
```sql
CREATE TABLE dish_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '点赞ID',
    dish_id BIGINT NOT NULL COMMENT '菜谱ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    menu_id BIGINT NOT NULL COMMENT '菜单ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
    UNIQUE KEY uk_dish_user_menu (dish_id, user_id, menu_id),
    INDEX idx_dish_id (dish_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品点赞表';
```

#### 成就表 (achievements)
```sql
CREATE TABLE achievements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '成就ID',
    title VARCHAR(50) NOT NULL COMMENT '成就标题',
    description VARCHAR(200) COMMENT '成就描述',
    icon VARCHAR(10) COMMENT '图标(emoji)',
    condition_type VARCHAR(50) COMMENT '条件类型',
    condition_value INT COMMENT '条件值',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成就表';
```

#### 用户成就关联表 (user_achievements)
```sql
CREATE TABLE user_achievements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    achievement_id BIGINT NOT NULL COMMENT '成就ID',
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '解锁时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_achievement (user_id, achievement_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户成就关联表';
```

---

## 4. API 设计规范

### 4.1 RESTful 设计原则

| HTTP 方法 | 用途 | 示例 |
|-----------|------|------|
| GET | 查询资源 | GET /api/dishes |
| POST | 创建资源 | POST /api/dishes |
| PUT | 更新资源 | PUT /api/dishes/1 |
| DELETE | 删除资源 | DELETE /api/dishes/1 |

### 4.2 统一响应格式

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1640995200000
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "参数错误",
  "data": null,
  "timestamp": 1640995200000
}
```

**状态码规范**:
- 200: 成功
- 400: 请求参数错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误

### 4.3 分页查询格式

**请求参数**:
```
GET /api/dishes?page=1&size=10&sort=created_at,desc
```

**响应格式**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [],
    "total": 100,
    "page": 1,
    "size": 10,
    "pages": 10
  }
}
```

### 4.4 完整 API 列表

#### 认证模块
- `POST /api/auth/wx-login` - 微信登录
- `POST /api/auth/refresh-token` - 刷新Token

#### 用户模块
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `POST /api/users/avatar` - 上传头像
- `GET /api/users/achievements` - 获取用户成就

#### 家庭模块
- `POST /api/families` - 创建家庭
- `GET /api/families/{id}` - 获取家庭信息
- `POST /api/families/invite` - 生成邀请码
- `POST /api/families/join` - 加入家庭
- `GET /api/families/{id}/members` - 获取成员列表
- `DELETE /api/families/{id}/members/{userId}` - 移除成员
- `PUT /api/families/{id}/transfer` - 转让管理权

#### 分类模块
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类
- `PUT /api/categories/{id}` - 更新分类
- `DELETE /api/categories/{id}` - 删除分类

#### 标签模块
- `GET /api/tags` - 获取标签列表
- `GET /api/tags/stats` - 标签使用统计
- `POST /api/tags` - 创建标签
- `PUT /api/tags/{id}` - 更新标签
- `DELETE /api/tags/{id}` - 删除标签

#### 菜谱模块
- `GET /api/dishes` - 获取菜谱列表（分页、筛选、搜索）
- `GET /api/dishes/{id}` - 获取菜谱详情
- `POST /api/dishes` - 创建菜谱
- `PUT /api/dishes/{id}` - 更新菜谱
- `DELETE /api/dishes/{id}` - 删除菜谱

#### 菜单模块
- `GET /api/menus` - 获取菜单列表
- `POST /api/menus` - 添加菜单项
- `DELETE /api/menus/{id}` - 删除菜单项

#### 购物清单模块
- `GET /api/shopping-list` - 获取购物清单
- `POST /api/shopping-list/generate` - 生成购物清单
- `PUT /api/shopping-list/{id}/check` - 勾选食材
- `DELETE /api/shopping-list` - 清空购物清单

#### 统计模块
- `GET /api/stats/members` - 成员统计
- `GET /api/stats/dishes` - 菜品统计
- `GET /api/stats/preferences` - 口味偏好
- `GET /api/stats/favorite-dishes` - 最爱吃的菜
- `GET /api/stats/top-cooks` - 厨神排行

#### 点赞模块
- `POST /api/likes` - 点赞菜品
- `DELETE /api/likes/{id}` - 取消点赞
- `GET /api/likes/status` - 查询点赞状态

#### 历史记录模块
- `GET /api/history/menus` - 历史菜单查询

#### 文件上传模块
- `POST /api/upload/image` - 上传图片

---

## 5. 安全设计

### 5.1 JWT 认证流程

```
1. 小程序调用 wx.login() 获取 code
2. 前端发送 code 到后端 /api/auth/wx-login
3. 后端调用微信接口 code2Session 获取 openid
4. 查询或创建用户记录
5. 生成 JWT Token (包含 userId, familyId)
6. 返回 Token 给前端
7. 前端存储 Token
8. 后续请求在 Header 中携带: Authorization: Bearer <token>
9. 后端验证 Token 有效性
```

**JWT Payload**:
```json
{
  "userId": 1,
  "familyId": 1,
  "exp": 1640995200
}
```

### 5.2 权限控制

**家庭级权限**:
- 用户只能访问自己家庭的数据
- 通过 JWT 中的 familyId 进行过滤
- 所有查询自动添加 family_id 条件

**操作级权限**:
- 只有创建者可以删除菜谱
- 只有家庭创建者可以管理成员
- 使用 AOP 实现权限检查

### 5.3 数据安全

- **SQL 注入防护**: 使用 MyBatis 参数化查询
- **XSS 防护**: 输入参数校验和转义
- **文件上传安全**: 文件类型和大小限制
- **敏感信息加密**: openid 加密存储
- **接口限流**: 防止恶意请求

---

## 6. 性能优化

### 6.1 数据库优化

**索引策略**:
- 主键索引: 所有表的 id 字段
- 唯一索引: openid, invite_code
- 复合索引: (family_id, menu_date, meal_time)
- 全文索引: dish.name 支持中文搜索

**查询优化**:
- 避免 N+1 查询: 使用 MyBatis 的关联查询
- 分页查询: 使用 LIMIT 和 OFFSET
- 慢查询监控: 记录执行时间 > 1s 的查询
- 使用 EXPLAIN 分析查询计划

### 6.2 缓存策略

**Redis 缓存** (可选):
- 用户信息缓存 (TTL: 30分钟)
- 热门菜谱缓存 (TTL: 1小时)
- 分类标签缓存 (TTL: 1天)
- 菜单数据缓存 (TTL: 5分钟)

**应用级缓存**:
- Spring Cache 注解
- 本地缓存热点数据
- 缓存穿透防护

### 6.3 文件上传优化

- **图片压缩**: 自动压缩大于 1MB 的图片
- **缩略图生成**: 生成 200x200 的缩略图
- **异步处理**: 使用线程池异步处理图片
- **CDN 加速**: 静态资源使用 CDN

### 6.4 接口性能目标

- API 响应时间: < 200ms (P95)
- 数据库查询: < 100ms
- 并发支持: 100+ QPS
- 图片上传: < 3s

---

## 7. 监控与日志

### 7.1 日志规范

**日志级别**:
- ERROR: 系统错误、异常
- WARN: 业务警告
- INFO: 关键业务操作
- DEBUG: 调试信息

**日志格式**:
```
[2024-01-20 10:30:00] [INFO] [DishService] [userId:1] [familyId:1] - 创建菜谱: 番茄炒蛋
```

**日志内容**:
- 用户操作日志
- 接口调用日志
- 异常错误日志
- 慢查询日志

### 7.2 监控指标

- API 响应时间
- 数据库连接池状态
- JVM 内存使用情况
- 错误率统计
- 接口调用量

### 7.3 告警机制

- 错误率超过 5% 告警
- 响应时间超过 1s 告警
- 数据库连接池耗尽告警
- 磁盘空间不足告警

---

## 8. 部署方案

### 8.1 Docker 部署

**Dockerfile**:
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=mysql
      - DB_PORT=3306
    depends_on:
      - mysql
  
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: delicious_moments
    volumes:
      - mysql_data:/var/lib/mysql
      - ./sql:/docker-entrypoint-initdb.d
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

### 8.2 环境配置

**开发环境**:
- 数据库: 本地 MySQL
- 文件存储: 本地磁盘
- 日志级别: DEBUG
- 端口: 8080

**生产环境**:
- 数据库: 云数据库 RDS
- 文件存储: 阿里云 OSS
- 日志级别: INFO
- 反向代理: Nginx
- HTTPS: SSL 证书

### 8.3 部署流程

1. 构建 Docker 镜像
2. 推送到镜像仓库
3. 服务器拉取镜像
4. 启动容器
5. 健康检查
6. 切换流量

---

## 9. 测试策略

### 9.1 单元测试

- Service 层业务逻辑测试
- Util 工具类测试
- 测试覆盖率目标: 80%+
- 使用 JUnit 5 + Mockito

### 9.2 集成测试

- Controller 层 API 测试
- 数据库操作测试
- 文件上传测试
- 使用 @SpringBootTest

### 9.3 性能测试

- 并发用户数: 100+
- API 响应时间: < 500ms
- 数据库连接池: 最大 20 个连接
- 使用 JMeter 进行压测

---

## 10. 扩展性设计

### 10.1 微服务拆分 (未来)

- 用户服务: 用户认证、家庭管理
- 菜谱服务: 菜谱、分类、标签管理
- 菜单服务: 菜单计划、购物清单
- 统计服务: 数据统计、分析

### 10.2 数据库分库分表 (未来)

- 按家庭 ID 分表
- 历史数据归档
- 读写分离

### 10.3 消息队列 (未来)

- 异步处理图片压缩
- 统计数据计算
- 消息推送

---

## 11. 技术难点与解决方案

### 11.1 购物清单生成算法

**难点**: 合并同名同单位食材，不同单位分开显示

**解决方案**:
```java
// 1. 查询菜单中的所有食材
// 2. 按 name + unit 分组
// 3. 聚合数量
// 4. 按 category 分类
Map<String, List<Ingredient>> grouped = ingredients.stream()
    .collect(Collectors.groupingBy(i -> i.getName() + "_" + i.getUnit()));
```

### 11.2 菜谱搜索性能

**难点**: 中文全文搜索性能

**解决方案**:
- 使用 MySQL 全文索引 (ngram parser)
- 或集成 Elasticsearch
- 热门搜索词缓存

### 11.3 图片上传性能

**难点**: 大图片上传慢，影响用户体验

**解决方案**:
- 前端压缩后上传
- 后端异步处理
- 使用 OSS 直传
- 生成缩略图

### 11.4 统计查询性能

**难点**: 复杂统计查询慢

**解决方案**:
- 使用聚合查询
- 添加合适的索引
- 定时任务预计算
- Redis 缓存结果

---

## 12. 开发规范

### 12.1 代码规范

- 使用 Google Java Style
- 类名 PascalCase，方法名 camelCase
- 常量 UPPER_SNAKE_CASE
- 必须添加注释

### 12.2 Git 规范

- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- refactor: 代码重构
- test: 测试相关

### 12.3 接口文档规范

- 所有接口必须有 Swagger 注解
- 请求/响应示例完整
- 错误码说明清晰
