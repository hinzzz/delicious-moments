#!/bin/bash

echo "========================================="
echo "🍽️  食光集后端启动检查"
echo "========================================="
echo ""

# 检查 Java 版本
echo "📌 检查 Java 版本..."
JAVA_VERSION=$(java -version 2>&1 | grep "version" | awk '{print $3}' | sed 's/"//g' | cut -d'.' -f1)
if [ -z "$JAVA_VERSION" ]; then
    echo "❌ 未检测到 Java，请先安装 JDK 17+"
    exit 1
fi

if [ "$JAVA_VERSION" -lt 17 ]; then
    echo "❌ Java 版本过低（当前: $JAVA_VERSION），需要 JDK 17+"
    exit 1
fi
echo "✅ Java 版本: $(java -version 2>&1 | grep "version" | awk '{print $3}' | sed 's/"//g')"

# 检查 Maven
echo ""
echo "📌 检查 Maven..."
if ! command -v mvn &> /dev/null; then
    echo "❌ 未检测到 Maven，请先安装 Maven 3.8+"
    exit 1
fi
echo "✅ Maven 版本: $(mvn -version | grep "Apache Maven" | awk '{print $3}')"

# 检查数据库配置
echo ""
echo "📌 检查配置文件..."
if [ ! -f "src/main/resources/application.yml" ]; then
    echo "❌ 配置文件不存在"
    exit 1
fi
echo "✅ 配置文件存在"

# 清理并编译
echo ""
echo "========================================="
echo "📦 清理并编译项目..."
echo "========================================="
mvn clean compile -DskipTests

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 编译失败，请检查错误信息"
    exit 1
fi

echo ""
echo "========================================="
echo "✅ 编译成功！"
echo "========================================="
echo ""
echo "🚀 启动应用..."
echo ""

# 启动应用
mvn spring-boot:run
