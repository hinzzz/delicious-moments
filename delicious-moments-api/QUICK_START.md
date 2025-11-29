# 🚀 快速启动指南

## 前置条件

- ✅ JDK 17+
- ✅ Maven 3.8+
- ✅ MySQL 8.0+

## 一键启动（3步）

### 1️⃣ 初始化数据库

```bash
cd sql
./init-all.sh
```

输入 MySQL root 密码后，会自动：
- 创建数据库和表结构
- 插入测试数据

### 2️⃣ 修改配置（可选）

如果数据库不是默认配置，修改 `src/main/resources/application-dev.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/delicious_moments
    username: root
    password: your_password
```

### 3️⃣ 启动应用

```bash
# 方法一：使用检查脚本（推荐）
./check-and-run.sh

# 方法二：直接启动
mvn spring-boot:run
```

## 验证启动

### 访问 API 文档
```
http://localhost:8080/api/doc.html
```

### 健康检查
```bash
curl http://localhost:8080/api/health
```

应该返回：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "status": "UP",
    "application": "delicious-moments-api",
    "version": "1.0.0"
  }
}
```

### 测试用户接口
```bash
curl http://localhost:8080/api/users/profile?userId=1
```

## 常见问题

### Q1: 启动失败 - 数据库连接错误

**解决方案**：
1. 确认 MySQL 已启动
2. 检查用户名密码是否正确
3. 确认数据库 `delicious_moments` 已创建

### Q2: 端口 8080 被占用

**解决方案**：
修改 `application.yml` 中的端口：
```yaml
server:
  port: 8081
```

### Q3: 编译失败

**解决方案**：
```bash
# 清理并重新编译
mvn clean install -DskipTests
```

## 测试数据

### 测试用户
- OpenID: `test_openid_001` (爸爸)
- OpenID: `test_openid_002` (妈妈)
- OpenID: `test_openid_003` (宝贝)
- OpenID: `test_openid_004` (奶奶)

### 家庭邀请码
- `ABC123`

### 已有数据
- 10道菜谱
- 今日和明日菜单
- 1个购物清单

## 下一步

1. 查看 [API 文档](http://localhost:8080/api/doc.html)
2. 阅读 [开发文档](README.md)
3. 查看 [DDD 设计](../.kiro/specs/backend-api/ddd-design.md)

## 停止应用

按 `Ctrl + C` 停止应用

---

**启动成功标志**：
```
========================================
🍽️  食光集 API 启动成功！
📖  API文档: http://localhost:8080/doc.html
========================================
```
