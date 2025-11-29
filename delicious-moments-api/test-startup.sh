#!/bin/bash

echo "========================================="
echo "🧪 测试应用启动"
echo "========================================="
echo ""

# 启动应用（后台运行）
echo "📌 启动应用..."
mvn spring-boot:run > startup.log 2>&1 &
PID=$!

echo "✅ 应用已启动 (PID: $PID)"
echo "📋 等待应用完全启动..."

# 等待应用启动（最多等待60秒）
for i in {1..60}; do
    sleep 1
    if grep -q "Started DeliciousMomentsApplication" startup.log 2>/dev/null; then
        echo ""
        echo "========================================="
        echo "✅ 应用启动成功！"
        echo "========================================="
        echo ""
        
        # 测试健康检查接口
        echo "📌 测试健康检查接口..."
        HEALTH_RESPONSE=$(curl -s http://localhost:8080/api/health)
        
        if echo "$HEALTH_RESPONSE" | grep -q "UP"; then
            echo "✅ 健康检查通过"
            echo ""
            echo "📖 API 文档: http://localhost:8080/api/doc.html"
            echo "🔍 健康检查: http://localhost:8080/api/health"
            echo ""
            echo "按 Ctrl+C 停止应用"
            
            # 保持运行
            wait $PID
        else
            echo "❌ 健康检查失败"
            echo "响应: $HEALTH_RESPONSE"
        fi
        
        exit 0
    fi
    
    # 检查是否启动失败
    if grep -q "APPLICATION FAILED TO START" startup.log 2>/dev/null; then
        echo ""
        echo "❌ 应用启动失败"
        echo ""
        echo "错误日志："
        tail -50 startup.log
        kill $PID 2>/dev/null
        exit 1
    fi
    
    printf "."
done

echo ""
echo "❌ 应用启动超时（60秒）"
echo ""
echo "最后的日志："
tail -50 startup.log
kill $PID 2>/dev/null
exit 1
