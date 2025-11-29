#!/bin/bash

echo "========================================="
echo "🍽️  食光集后端 API 快速启动脚本"
echo "========================================="
echo ""

# 检查 Java 版本
echo "📌 检查 Java 版本..."
java -version 2>&1 | grep "version" | awk '{print $3}' | sed 's/"//g'
if [ $? -ne 0 ]; then
    echo "❌ 未检测到 Java，请先安装 JDK 17+"
    exit 1
fi

# 检查 Maven
echo "📌 检查 Maven..."
mvn -version | grep "Apache Maven"
if [ $? -ne 0 ]; then
    echo "❌ 未检测到 Maven，请先安装 Maven 3.8+"
    exit 1
fi

# 检查 MySQL
echo "📌 检查 MySQL..."
mysql --version
if [ $? -ne 0 ]; then
    echo "⚠️  未检测到 MySQL，请确保 MySQL 8.0+ 已安装并运行"
fi

echo ""
echo "========================================="
echo "📦 开始构建项目..."
echo "========================================="
mvn clean install -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo ""
echo "========================================="
echo "✅ 构建成功！"
echo "========================================="
echo ""
echo "📋 下一步操作："
echo "1. 初始化数据库: mysql -u root -p < sql/schema.sql"
echo "2. 修改配置文件: src/main/resources/application-dev.yml"
echo "3. 启动项目: mvn spring-boot:run"
echo "4. 访问API文档: http://localhost:8080/api/doc.html"
echo ""
echo "========================================="
