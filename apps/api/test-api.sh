#!/bin/bash

# API 测试脚本
echo "🧪 开始测试 GoldSky MessageCore API..."

# 设置基础 URL
BASE_URL="http://localhost:3030"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 测试函数
test_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    local data=${3:-""}
    
    echo -e "${BLUE}测试 ${method} ${endpoint}${NC}"
    
    if [ "$method" = "POST" ] || [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${BASE_URL}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            "${BASE_URL}${endpoint}")
    fi
    
    # 分离响应体和状态码
    body=$(echo "$response" | head -n -1)
    status=$(echo "$response" | tail -n 1)
    
    if [ "$status" -ge 200 ] && [ "$status" -lt 300 ]; then
        echo -e "${GREEN}✅ 成功 (${status})${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "${RED}❌ 失败 (${status})${NC}"
        echo "$body"
    fi
    echo ""
}

# 检查服务器是否运行
echo -e "${YELLOW}检查服务器状态...${NC}"
if curl -s "${BASE_URL}/health" > /dev/null; then
    echo -e "${GREEN}✅ 服务器正在运行${NC}"
else
    echo -e "${RED}❌ 服务器未运行，请先启动服务器${NC}"
    echo "运行命令: npm run dev:simple"
    exit 1
fi

echo ""
echo "=========================================="
echo "开始 API 测试"
echo "=========================================="
echo ""

# 1. 健康检查
test_endpoint "/health"

# 2. 测试路由
test_endpoint "/api/test"

# 3. 租户管理
test_endpoint "/api/tenants"

# 4. 用户管理
test_endpoint "/api/users"

# 5. 消息管理
test_endpoint "/api/messages"

# 6. 系统监控
test_endpoint "/api/system/overview"

# 7. AI 服务
test_endpoint "/api/ai/config"

# 8. 404 测试
test_endpoint "/api/nonexistent"

echo "=========================================="
echo "API 测试完成"
echo "=========================================="
echo ""

# 性能测试
echo -e "${YELLOW}性能测试...${NC}"
echo "测试健康检查端点的响应时间:"
time curl -s "${BASE_URL}/health" > /dev/null

echo ""
echo -e "${GREEN}🎉 所有测试完成！${NC}" 