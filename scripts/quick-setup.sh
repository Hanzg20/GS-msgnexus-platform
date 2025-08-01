#!/bin/bash

# GoldSky MessageCore 快速启动脚本
# 基于 Feathers.js 的开源项目改造

set -e

echo "🚀 GoldSky MessageCore 快速启动脚本"
echo "基于 Feathers.js 开源项目改造"
echo "=================================="

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js (推荐版本 18+)"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

echo "✅ 环境检查通过"

# 1. 克隆Feathers.js聊天基础项目
echo "📦 克隆 Feathers.js 聊天基础项目..."
if [ ! -d "backend" ]; then
    git clone https://github.com/feathersjs/feathers-chat.git backend
    echo "✅ 基础项目克隆完成"
else
    echo "⚠️  后端项目已存在，跳过克隆"
fi

cd backend

# 2. 安装基础依赖
echo "📚 安装项目依赖..."
npm install

# 3. 安装MessageCore所需的额外依赖
echo "📦 安装MessageCore扩展依赖..."
npm install @prisma/client prisma redis ioredis uuid express-rate-limit helmet cors

# 安装开发依赖
npm install -D @types/uuid nodemon concurrently

echo "✅ 依赖安装完成"

# 4. 初始化Prisma数据库
echo "🗄️  初始化数据库配置..."
if [ ! -f "prisma/schema.prisma" ]; then
    npx prisma init
fi

# 5. 创建MessageCore配置文件
echo "⚙️  创建配置文件..."

# 创建环境变量文件
cat > .env << EOL
# GoldSky MessageCore Environment Configuration

# Database (初期使用Supabase，后续迁移到Azure)
DATABASE_URL="postgresql://messagecore:changeme@localhost:5432/messagecore"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# App Configuration
PORT=3030
NODE_ENV=development

# MessageCore Specific
DEFAULT_PLAN_TYPE=basic
ENABLE_RATE_LIMITING=true

# Migration Configuration
MIGRATION_MODE="supabase"  # supabase | azure | hybrid
EOL

# 创建Prisma Schema
cat > prisma/schema.prisma << EOL
// GoldSky MessageCore Database Schema
// 基于 Feathers.js 扩展的多租户消息系统

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tenant {
  id        String   @id @default(uuid())
  name      String
  subdomain String   @unique
  apiKey    String   @unique @map("api_key")
  planType  String   @default("basic") @map("plan_type")
  settings  Json     @default("{}")
  status    String   @default("active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  users     User[]
  messages  Message[]

  @@map("tenants")
}

model User {
  id             String  @id @default(uuid())
  tenantId       String  @map("tenant_id")
  externalUserId String  @map("external_user_id")
  email          String?
  displayName    String  @map("display_name")
  avatarUrl      String? @map("avatar_url")
  isActive       Boolean @default(true) @map("is_active")
  createdAt      DateTime @default(now()) @map("created_at")

  tenant   Tenant    @relation(fields: [tenantId], references: [id])
  messages Message[]

  @@unique([tenantId, externalUserId])
  @@map("users")
}

model Message {
  id             String   @id @default(uuid())
  tenantId       String   @map("tenant_id")
  conversationId String   @map("conversation_id")
  senderId       String   @map("sender_id")
  messageType    String   @map("message_type")
  content        Json
  replyToId      String?  @map("reply_to_id")
  status         String   @default("sent")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  tenant Tenant @relation(fields: [tenantId], references: [id])
  sender User   @relation(fields: [senderId], references: [id])

  @@index([tenantId, conversationId, createdAt])
  @@map("messages")
}
EOL

echo "✅ 配置文件创建完成"

# 6. 启动Docker数据库服务
echo "🐳 启动数据库服务..."
if command -v docker &> /dev/null; then
    # 启动PostgreSQL
    docker run -d \
        --name messagecore-postgres \
        -e POSTGRES_DB=messagecore \
        -e POSTGRES_USER=messagecore \
        -e POSTGRES_PASSWORD=changeme \
        -p 5432:5432 \
        postgres:15

    # 启动Redis
    docker run -d \
        --name messagecore-redis \
        -p 6379:6379 \
        redis:7-alpine

    echo "✅ 数据库服务启动完成"
else
    echo "⚠️  Docker未安装，请手动启动PostgreSQL和Redis服务"
fi

# 7. 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 8. 运行数据库迁移
echo "🗄️  运行数据库迁移..."
npx prisma generate
npx prisma db push

echo "✅ 数据库迁移完成"

# 9. 启动开发服务器
echo "🎯 启动开发服务器..."
npm run dev

echo "✅ GoldSky MessageCore启动完成!"
echo "📖 API文档: http://localhost:3030"
echo "🔧 管理后台: http://localhost:3000" 