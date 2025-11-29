# 食光集后端 API (DDD 版本)

基于领域驱动设计（DDD）的食光集家庭膳食管理系统后端服务。

## 🏗️ 技术架构

### 技术栈
- **框架**: Spring Boot 3.2.1
- **JDK**: 17
- **数据库**: MySQL 8.0
- **ORM**: MyBatis-Plus 3.5.5
- **API文档**: Knife4j 4.4.0
- **认证**: JWT
- **工具**: Lombok, Hutool

### DDD 分层架构

```
├── interfaces/          # 表现层 - 对外接口
│   ├── controller/     # REST控制器
│   ├── dto/           # 数据传输对象
│   └── assembler/     # DTO组装器
├── application/        # 应用层 - 业务流程编排
│   ├── service/       # 应用服务
│   ├── event/         # 事件处理器
│   └── command/       # 命令对象
├── domain/            # 领域层 - 核心业务逻辑
│   ├── user/         # 用户聚合
│   ├── family/       # 家庭聚合
│   ├── dish/         # 菜谱聚合
│   ├── menu/         # 菜单聚合
│   ├── shopping/     # 购物聚合
│   └── stats/        # 统计聚合
├── infrastructure/    # 基础设施层 - 技术实现
│   ├── persistence/  # 持久化
│   ├── external/     # 外部服务
│   └── config/       # 配置
└── shared/           # 共享内核
    ├── exception/    # 异常定义
    ├── util/         # 工具类
    └── constant/     # 常量
```

## 🚀 快速开始

### 1. 环境要求
- JDK 17+
- Maven 3.8+
- MySQL 8.0+

### 2. 数据库初始化

**方法一：一键初始化（推荐）**
```bash
cd sql
./init-all.sh
```

**方法二：手动初始化**
```bash
# 创建表结构
mysql -u root -p < sql/schema.sql

# 插入测试数据
mysql -u root -p < sql/data.sql
```

初始化后会自动创建：
- 4个测试用户（爸爸、妈妈、宝贝、奶奶）
- 1个家庭（幸福之家，邀请码: ABC123）
- 10道菜谱（涵盖5个分类）
- 今日和明日的菜单计划
- 1个购物清单（15项食材）

### 3. 配置修改
编辑 `src/main/resources/application-dev.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/delicious_moments
    username: root
    password: your_password
```

### 4. 运行项目
```bash
mvn clean install
mvn spring-boot:run
```

### 5. 访问 API 文档
```
http://localhost:8080/api/doc.html
```

## 📋 核心功能模块

### 用户上下文 (User Context)
- 微信小程序登录
- 用户资料管理
- 成就系统

### 家庭上下文 (Family Context)
- 创建家庭
- 邀请成员
- 成员管理

### 菜谱上下文 (Dish Context)
- 菜谱 CRUD
- 分类管理
- 标签管理
- 食材管理

### 菜单上下文 (Menu Context)
- 菜单计划
- 今日/明日菜单
- 三餐管理

### 购物上下文 (Shopping Context)
- 智能生成购物清单
- 食材聚合
- 勾选管理

### 统计上下文 (Stats Context)
- 烹饪记录
- 菜品点赞
- 数据统计

## 🎯 DDD 核心概念

### 聚合 (Aggregate)
每个聚合都有一个聚合根，负责维护聚合内的一致性：
- **User Aggregate**: 用户聚合根
- **Family Aggregate**: 家庭聚合根
- **Dish Aggregate**: 菜谱聚合根
- **MenuPlan Aggregate**: 菜单计划聚合根
- **ShoppingList Aggregate**: 购物清单聚合根

### 值对象 (Value Object)
不可变的业务概念：
- `UserId`: 用户ID
- `FamilyId`: 家庭ID
- `InviteCode`: 邀请码
- `NutritionInfo`: 营养信息
- `CookingTime`: 烹饪时间

### 领域事件 (Domain Event)
记录重要的业务事件：
- `UserRegistered`: 用户注册
- `FamilyCreated`: 家庭创建
- `DishCreated`: 菜谱创建
- `MenuItemAdded`: 菜单项添加
- `ShoppingListGenerated`: 购物清单生成

### 仓储 (Repository)
面向聚合根的数据访问接口：
- `UserRepository`: 用户仓储
- `FamilyRepository`: 家庭仓储
- `DishRepository`: 菜谱仓储
- `MenuPlanRepository`: 菜单仓储
- `ShoppingListRepository`: 购物清单仓储

## 📊 数据库设计

### 核心表
- `user_aggregate`: 用户聚合根表
- `family_aggregate`: 家庭聚合根表
- `dish_aggregate`: 菜谱聚合根表
- `menu_plan_aggregate`: 菜单计划聚合根表
- `shopping_list_aggregate`: 购物清单聚合根表

### 特性
- ✅ 乐观锁 (version字段)
- ✅ 软删除 (deleted_at字段)
- ✅ 自动时间戳 (created_at, updated_at)
- ✅ 全文索引 (菜谱名称搜索)
- ✅ 复合索引 (性能优化)

## 🔧 开发规范

### 代码规范
- 使用 Lombok 简化代码
- 遵循 DDD 分层架构
- 聚合内保持强一致性
- 聚合间通过事件实现最终一致性

### 命名规范
- 聚合根: `XxxAggregate`
- 实体: 普通类名
- 值对象: `XxxVO` 或直接命名
- 仓储接口: `XxxRepository`
- 仓储实现: `XxxRepositoryImpl`
- 应用服务: `XxxApplicationService`
- 领域服务: `XxxDomainService`

### Git 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

## 📖 API 文档

启动项目后访问: http://localhost:8080/api/doc.html

### 主要接口
- `GET /users/profile` - 获取用户信息
- `PUT /users/profile` - 更新用户资料
- `POST /families` - 创建家庭
- `GET /dishes` - 查询菜谱列表
- `POST /menus` - 添加菜单项
- `GET /shopping-list` - 获取购物清单

## 🧪 测试

```bash
# 运行所有测试
mvn test

# 运行单个测试
mvn test -Dtest=UserApplicationServiceTest
```

## 📦 打包部署

```bash
# 打包
mvn clean package -DskipTests

# 运行
java -jar target/delicious-moments-api-1.0.0-SNAPSHOT.jar

# Docker部署
docker build -t delicious-moments-api .
docker run -p 8080:8080 delicious-moments-api
```

## 📝 项目文档

- [DDD设计文档](../.kiro/specs/backend-api/ddd-design.md)
- [需求文档](../.kiro/specs/backend-api/requirements.md)
- [任务分解](../.kiro/specs/backend-api/tasks.md)

## 👥 团队

- 后端开发团队
- 联系方式: team@delicious.com

## 📄 许可证

MIT License
