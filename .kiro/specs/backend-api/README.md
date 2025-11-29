# 食光集后端 API 开发指南

## 📋 项目概述

食光集是一个高颜值的家庭膳食管理小程序，本项目为其提供后端 API 服务。采用 Spring Boot + MySQL 架构，支持用户认证、家庭管理、菜谱管理、菜单计划、购物清单等核心功能。

**前端项目**: Taro 4.0.7 + React + TypeScript  
**后端项目**: Spring Boot 3.2.x + MySQL 8.0 + MyBatis-Plus

---

## 🚀 快速开始

### 环境要求

- JDK 17+
- Maven 3.8+
- MySQL 8.0+
- Docker (可选)

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd delicious-moments-api
```

2. **配置数据库**
```sql
CREATE DATABASE delicious_moments CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'delicious'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON delicious_moments.* TO 'delicious'@'localhost';
FLUSH PRIVILEGES;
```

3. **初始化数据库**
```bash
mysql -u delicious -p delicious_moments < sql/schema.sql
mysql -u delicious -p delicious_moments < sql/data.sql
```

4. **修改配置**
```yaml
# src/main/resources/application-dev.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/delicious_moments?useUnicode=true&characterEncoding=utf8mb4
    username: delicious
    password: password123
```

5. **运行项目**
```bash
mvn clean install
mvn spring-boot:run
```

6. **访问 API 文档**
```
http://localhost:8080/doc.html
```

### Docker 部署

```bash
# 构建并启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down
```

---

## 📚 文档结构

```
.kiro/specs/backend-api/
├── README.md           # 本文档 - 项目概览和快速开始
├── requirements.md     # 需求文档 - 功能需求和验收标准
├── design.md          # 技术设计文档 - 架构设计和数据库设计
└── tasks.md           # 任务分解文档 - 详细开发任务和时间估算
```

**阅读顺序**:
1. README.md - 了解项目概况
2. requirements.md - 理解业务需求
3. design.md - 学习技术架构
4. tasks.md - 开始开发工作

---

## 🎯 核心功能

### 已规划功能

- ✅ **用户认证**: 微信小程序登录、JWT Token 管理
- ✅ **家庭管理**: 创建家庭、邀请成员、成员管理
- ✅ **菜谱管理**: CRUD 操作、分类标签、图片上传、搜索
- ✅ **菜单计划**: 今日/明日菜单、三餐管理、点菜人记录
- ✅ **购物清单**: 智能聚合食材、分类展示、勾选管理
- ✅ **饮食记录**: 历史统计、点赞功能、数据分析
- ✅ **搜索功能**: 菜谱搜索、分类标签筛选、复合查询
- ✅ **成就系统**: 用户成就、解锁记录

### API 端点概览

| 模块 | 端点 | 说明 |
|------|------|------|
| 认证 | POST /api/auth/wx-login | 微信登录 |
| 用户 | GET /api/users/profile | 获取用户信息 |
| 家庭 | POST /api/families | 创建家庭 |
| 菜谱 | GET /api/dishes | 查询菜谱列表 |
| 分类 | GET /api/categories | 查询分类列表 |
| 标签 | GET /api/tags/stats | 标签使用统计 |
| 菜单 | POST /api/menus | 添加菜单项 |
| 购物 | GET /api/shopping-list | 获取购物清单 |
| 统计 | GET /api/stats/dishes | 菜品统计 |
| 上传 | POST /api/upload/image | 上传图片 |

完整 API 文档请访问: http://localhost:8080/doc.html

---

## 🏗️ 技术架构

### 技术栈

| 组件 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Spring Boot | 3.2.x | 主框架 |
| 数据库 | MySQL | 8.0+ | 主数据库 |
| ORM | MyBatis-Plus | 3.5.x | 数据访问层 |
| 认证 | JWT | - | 无状态认证 |
| 文档 | Knife4j | 4.x | API 文档 |
| 构建 | Maven | 3.8+ | 项目构建 |
| 部署 | Docker | - | 容器化部署 |

### 项目结构

```
src/main/java/com/delicious/
├── config/          # 配置类 (Swagger, JWT, CORS)
├── controller/      # 控制器层 (接收请求)
├── service/         # 服务层 (业务逻辑)
├── mapper/          # 数据访问层 (数据库操作)
├── entity/          # 实体类 (数据模型)
├── dto/             # 数据传输对象 (请求/响应)
├── common/          # 通用组件 (统一响应、异常处理)
└── util/            # 工具类 (JWT、文件、日期)
```

### 数据库设计

**核心表关系**:
```
Users → FamilyMembers → Families
  ↓
Dishes → DishTags → Tags
  ↓         ↓
Menus   Ingredients
  ↓
ShoppingItems
```

**13 张核心表**:
- users (用户表)
- families (家庭表)
- family_members (家庭成员关联表)
- categories (分类表)
- tags (标签表)
- dishes (菜谱表)
- dish_tags (菜谱标签关联表)
- ingredients (食材表)
- menus (菜单表)
- shopping_items (购物清单表)
- dish_likes (菜品点赞表)
- achievements (成就表)
- user_achievements (用户成就关联表)

详细设计请参考 [design.md](./design.md)

---

## 📋 开发计划

### 里程碑

| 阶段 | 时间 | 内容 | 状态 |
|------|------|------|------|
| Phase 1 | Week 1 | 项目初始化、数据库设计、用户认证 | 🔲 待开始 |
| Phase 2 | Week 2 | 家庭管理、菜谱管理核心功能 | 🔲 待开始 |
| Phase 3 | Week 3 | 菜单计划、购物清单、饮食记录 | 🔲 待开始 |
| Phase 4 | Week 4 | 文件上传、测试、部署 | 🔲 待开始 |

### 任务分解

**总工作量**: 约 15 个工作日

**10 个开发阶段**:
1. 项目初始化 (1天)
2. 数据库设计与实现 (2天)
3. 用户认证模块 (2天)
4. 家庭管理模块 (1.5天)
5. 菜谱管理模块 (3天)
6. 菜单计划模块 (2天)
7. 购物清单模块 (1.5天)
8. 饮食记录模块 (2天)
9. 文件上传模块 (1天)
10. 测试与部署 (2天)

详细任务列表请参考 [tasks.md](./tasks.md)

---

## 🔧 开发规范

### 代码规范

- 使用 Google Java Style
- 类名使用 PascalCase
- 方法名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE
- 必须添加注释

### API 规范

- 遵循 RESTful 设计原则
- 统一响应格式 `Result<T>`
- 统一异常处理
- 完整的 Swagger 文档

### 数据库规范

- 表名使用复数形式 (users, dishes)
- 字段名使用 snake_case
- 必须有 created_at, updated_at 字段
- 外键字段以 _id 结尾

### Git 规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

---

## 🚀 部署指南

### 开发环境

```bash
# 启动开发环境
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 生产环境

```bash
# 构建 JAR 包
mvn clean package -DskipTests

# 构建 Docker 镜像
docker build -t delicious-moments-api:latest .

# 使用 docker-compose 部署
docker-compose -f docker-compose.prod.yml up -d
```

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| SPRING_PROFILES_ACTIVE | 运行环境 | dev |
| DB_HOST | 数据库主机 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_NAME | 数据库名 | delicious_moments |
| DB_USER | 数据库用户 | delicious |
| DB_PASS | 数据库密码 | - |
| JWT_SECRET | JWT 密钥 | - |
| FILE_UPLOAD_PATH | 文件上传路径 | ./uploads |
| WX_APPID | 微信小程序 AppID | - |
| WX_SECRET | 微信小程序 Secret | - |

---

## 📊 监控与运维

### 健康检查

```bash
# 应用健康状态
curl http://localhost:8080/actuator/health

# 数据库连接状态
curl http://localhost:8080/actuator/health/db
```

### 日志查看

```bash
# 应用日志
tail -f logs/application.log

# 错误日志
tail -f logs/error.log

# Docker 日志
docker-compose logs -f app
```

### 性能监控

- API 响应时间监控
- 数据库慢查询监控
- JVM 内存使用监控
- 接口调用量统计

---

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
mvn test

# 运行单个测试类
mvn test -Dtest=DishServiceTest

# 生成测试报告
mvn test jacoco:report
```

### 测试覆盖率

- Service 层: > 80%
- Controller 层: > 70%
- 总体覆盖率: > 75%

---

## 🤝 贡献指南

### 开发流程

1. 从 main 分支创建功能分支
2. 完成功能开发和测试
3. 提交 Pull Request
4. 代码审查通过后合并

### 分支命名

```
feature/user-auth     # 功能分支
fix/login-bug        # 修复分支
hotfix/security-fix  # 热修复分支
```

---

## 📞 常见问题

### Q: 如何配置微信小程序登录？

A: 在 `application.yml` 中配置:
```yaml
wx:
  appid: your-appid
  secret: your-secret
```

### Q: 如何切换文件存储方式？

A: 修改 `application.yml`:
```yaml
file:
  storage:
    type: local  # 或 oss
    path: ./uploads
```

### Q: 如何开启 Redis 缓存？

A: 添加 Redis 依赖并配置:
```yaml
spring:
  redis:
    host: localhost
    port: 6379
```

---

## 📄 许可证

本项目采用 MIT 许可证，详情请参考 LICENSE 文件。

---

**最后更新**: 2024-01-20  
**文档版本**: v1.0  
**维护者**: 后端开发团队
