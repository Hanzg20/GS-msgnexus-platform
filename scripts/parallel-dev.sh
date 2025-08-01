#!/bin/bash

# GoldSky MessageCore 并行开发启动脚本
# 同时启动 API 服务、实时通信服务和前端开发服务器

set -e

echo "🚀 GoldSky MessageCore 并行开发环境启动"
echo "=========================================="

# 检查环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js (推荐版本 18+)"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ 环境检查通过"

# 创建日志目录
mkdir -p logs

# 安装根目录依赖
echo "📦 安装根目录依赖..."
npm install

# 安装 API 服务依赖
echo "📦 安装 API 服务依赖..."
cd apps/api
if [ ! -f "package-lock.json" ]; then
    npm install
fi
cd ../..

# 安装实时通信服务依赖
echo "📦 安装实时通信服务依赖..."
cd apps/realtime
if [ ! -f "package-lock.json" ]; then
    npm install
fi
cd ../..

# 安装前端依赖
echo "📦 安装前端依赖..."
cd apps/admin
if [ ! -f "package-lock.json" ]; then
    npm install
fi
cd ../..

# 创建环境配置文件
echo "⚙️  创建环境配置文件..."

# API 服务环境配置
cat > apps/api/.env << EOL
# GoldSky MessageCore API Service Environment

# Server Configuration
PORT=3030
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://messagecore:changeme@localhost:5432/messagecore"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# CORS Configuration
FRONTEND_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="debug"
EOL

# 实时通信服务环境配置
cat > apps/realtime/.env << EOL
# GoldSky MessageCore Realtime Service Environment

# Server Configuration
REALTIME_PORT=3031
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://messagecore:changeme@localhost:5432/messagecore"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# CORS Configuration
FRONTEND_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="debug"
EOL

# 前端环境配置
cat > apps/admin/.env.local << EOL
# GoldSky MessageCore Frontend Environment

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3030
REACT_APP_WS_URL=ws://localhost:3031
REACT_APP_AI_API_URL=http://localhost:3030/api/ai

# App Configuration
REACT_APP_TITLE=GoldSky MessageCore Admin
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_AI=true
REACT_APP_ENABLE_3D_BACKGROUND=true
REACT_APP_ENABLE_REAL_TIME=true
REACT_APP_MOCK_DATA=false
EOL

echo "✅ 环境配置完成"

# 检查数据库连接
echo "🗄️  检查数据库连接..."
if command -v psql &> /dev/null; then
    echo "⚠️  请确保 PostgreSQL 数据库已启动"
    echo "   数据库 URL: postgresql://messagecore:changeme@localhost:5432/messagecore"
else
    echo "⚠️  PostgreSQL 客户端未安装，请手动检查数据库连接"
fi

# 检查 Redis 连接
echo "🔴 检查 Redis 连接..."
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis 连接正常"
    else
        echo "⚠️  Redis 未启动，请启动 Redis 服务"
    fi
else
    echo "⚠️  Redis 客户端未安装，请手动检查 Redis 连接"
fi

echo ""
echo "🎉 环境准备完成！"
echo ""
echo "📋 启动命令："
echo "   npm run dev"
echo ""
echo "🔗 服务地址："
echo "   - 前端管理后台: http://localhost:3000"
echo "   - API 服务: http://localhost:3030"
echo "   - 实时通信服务: http://localhost:3031"
echo "   - API 健康检查: http://localhost:3030/health"
echo "   - 实时服务健康检查: http://localhost:3031/health"
echo ""
echo "📚 文档地址："
echo "   - 开发计划: docs/DEVELOPMENT_PLAN.md"
echo "   - 进度跟踪: docs/DEVELOPMENT_PROGRESS.md"
echo "   - 开源分析: docs/OPEN_SOURCE_ANALYSIS.md"
echo ""
echo "🚀 开始并行开发！" 