# 🔧 故障排查指南

## 常见启动错误

### 错误 1: IllegalArgumentException - factoryBeanObjectType

**错误信息**:
```
java.lang.IllegalArgumentException: Invalid value type for attribute 'factoryBeanObjectType': java.lang.String
```

**原因**: MyBatis-Plus 与 Spring Boot 3.2.x 版本不兼容

**解决方案**:
已修复，使用 Spring Boot 3.1.5 版本

---

### 错误 2: 数据库连接失败

**错误信息**:
```
Communications link failure
```

**解决方案**:

1. **确认 MySQL 已启动**
```bash
# macOS
brew services list | grep mysql

# 启动 MySQL
brew services start mysql
```

2. **初始化数据库**
```bash
cd sql
./init-all.sh
```

3. **检查配置**
编辑 `src/main/resources/application-dev.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/delicious_moments
    username: root
    password: your_password  # 修改为你的密码
```

---

### 错误 3: 端口被占用

**错误信息**:
```
Port 8080 was already in use
```

**解决方案**:

**方法一**: 修改端口
```yaml
# application.yml
server:
  port: 8081
```

**方法二**: 停止占用端口的进程
```bash
# 查找占用端口的进程
lsof -i :8080

# 停止进程
kill -9 <PID>
```

---

### 错误 4: 编译失败

**错误信息**:
```
Compilation failure
```

**解决方案**:

1. **清理并重新编译**
```bash
mvn clean install -DskipTests
```

2. **检查 JDK 版本**
```bash
java -version
# 需要 JDK 17+
```

3. **更新 Maven 依赖**
```bash
mvn dependency:purge-local-repository
mvn clean install
```

---

## 测试启动（无需数据库）

如果想先测试应用能否启动（不连接数据库）：

```bash
# 使用测试配置启动
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

访问: http://localhost:8080/api/health

---

## 完整启动检查清单

### ✅ 环境检查

- [ ] JDK 17+ 已安装
- [ ] Maven 3.8+ 已安装
- [ ] MySQL 8.0+ 已安装并启动

### ✅ 数据库检查

- [ ] 数据库 `delicious_moments` 已创建
- [ ] 表结构已初始化
- [ ] 测试数据已插入
- [ ] 数据库连接配置正确

### ✅ 应用检查

- [ ] 项目编译成功
- [ ] 配置文件正确
- [ ] 端口未被占用

---

## 调试模式启动

启用详细日志：

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"
```

或修改 `application-dev.yml`:
```yaml
logging:
  level:
    root: DEBUG
    com.delicious.moments: DEBUG
```

---

## 查看日志

### 应用日志
```bash
tail -f logs/application.log
```

### 错误日志
```bash
tail -f logs/error.log
```

### 启动日志
```bash
# 如果使用了 test-startup.sh
tail -f startup.log
```

---

## 重置环境

如果遇到无法解决的问题，可以重置环境：

### 1. 清理 Maven
```bash
mvn clean
rm -rf target/
```

### 2. 重置数据库
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS delicious_moments;"
cd sql
./init-all.sh
```

### 3. 重新编译
```bash
mvn clean install -DskipTests
```

### 4. 启动应用
```bash
mvn spring-boot:run
```

---

## 获取帮助

### 检查系统信息
```bash
# Java 版本
java -version

# Maven 版本
mvn -version

# MySQL 版本
mysql --version

# 操作系统
uname -a
```

### 生成诊断报告
```bash
# 创建诊断脚本
cat > diagnose.sh << 'EOF'
#!/bin/bash
echo "=== 系统诊断报告 ==="
echo ""
echo "Java 版本:"
java -version 2>&1
echo ""
echo "Maven 版本:"
mvn -version 2>&1
echo ""
echo "MySQL 状态:"
mysql --version 2>&1
echo ""
echo "端口占用:"
lsof -i :8080 2>&1
echo ""
echo "数据库连接测试:"
mysql -u root -p -e "SELECT 1" 2>&1
EOF

chmod +x diagnose.sh
./diagnose.sh
```

---

## 常用命令

### 快速启动
```bash
./check-and-run.sh
```

### 仅编译
```bash
mvn clean compile
```

### 打包
```bash
mvn clean package -DskipTests
```

### 运行测试
```bash
mvn test
```

### 清理
```bash
mvn clean
```

---

## 联系支持

如果以上方法都无法解决问题，请提供以下信息：

1. 错误日志（完整的堆栈跟踪）
2. 系统信息（Java、Maven、MySQL 版本）
3. 配置文件内容
4. 重现步骤

---

**最后更新**: 2024-11-29
