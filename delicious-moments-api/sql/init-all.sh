#!/bin/bash

echo "========================================="
echo "🍽️  食光集数据库初始化脚本"
echo "========================================="
echo ""

# 数据库配置
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_NAME="delicious_moments"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 MySQL 是否安装
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ 未检测到 MySQL，请先安装 MySQL 8.0+${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} MySQL 已安装"
echo ""

# 提示输入密码
echo "请输入 MySQL root 密码："
read -s DB_PASSWORD
echo ""

# 测试数据库连接
echo "📌 测试数据库连接..."
mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -p${DB_PASSWORD} -e "SELECT 1" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 数据库连接失败，请检查用户名和密码${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} 数据库连接成功"
echo ""

# 执行建表脚本
echo "========================================="
echo "📋 步骤 1/2: 创建数据库表结构..."
echo "========================================="
mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -p${DB_PASSWORD} < schema.sql
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 建表失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} 数据库表创建成功"
echo ""

# 执行数据初始化脚本
echo "========================================="
echo "📋 步骤 2/2: 插入初始化数据..."
echo "========================================="
mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -p${DB_PASSWORD} < data.sql
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 数据插入失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} 初始化数据插入成功"
echo ""

# 显示数据统计
echo "========================================="
echo "📊 数据统计"
echo "========================================="
mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -p${DB_PASSWORD} ${DB_NAME} -e "
SELECT '用户数' as '项目', COUNT(*) as '数量' FROM user_aggregate
UNION ALL
SELECT '家庭数', COUNT(*) FROM family_aggregate
UNION ALL
SELECT '菜谱数', COUNT(*) FROM dish_aggregate WHERE status = 1
UNION ALL
SELECT '菜单计划', COUNT(*) FROM menu_plan_aggregate
UNION ALL
SELECT '购物清单', COUNT(*) FROM shopping_list_aggregate;
"

echo ""
echo "========================================="
echo -e "${GREEN}✅ 数据库初始化完成！${NC}"
echo "========================================="
echo ""
echo "📋 初始化内容："
echo "   - 4个测试用户（爸爸、妈妈、宝贝、奶奶）"
echo "   - 1个家庭（幸福之家，邀请码: ABC123）"
echo "   - 10道菜谱（涵盖5个分类）"
echo "   - 13个标签"
echo "   - 今日和明日的菜单计划"
echo "   - 1个购物清单（15项食材）"
echo "   - 烹饪记录和点赞数据"
echo ""
echo "🚀 下一步："
echo "   1. 启动后端服务: mvn spring-boot:run"
echo "   2. 访问API文档: http://localhost:8080/api/doc.html"
echo "   3. 测试用户 openid: test_openid_001"
echo ""
