# 🗄️ MsgNexus 数据库实施方案

## 📋 目录

1. [项目概述](#项目概述)
2. [技术栈选择](#技术栈选择)
3. [数据库设计](#数据库设计)
4. [环境配置](#环境配置)
5. [建表脚本](#建表脚本)
6. [数据迁移](#数据迁移)
7. [API集成](#api集成)
8. [测试验证](#测试验证)
9. [部署指南](#部署指南)
10. [监控维护](#监控维护)

## 🎯 项目概述

### 项目背景
MsgNexus是一个企业级多租户通信解决方案，提供完整的消息管理、监控和分析功能。

### 核心需求
- **多租户架构**：支持多企业独立管理
- **实时通信**：WebSocket实时消息处理
- **数据持久化**：完整的数据库存储方案
- **高可用性**：生产级数据库服务
- **成本效益**：合理的成本控制

## 🏗️ 技术栈选择

### 数据库方案
| 组件 | 技术选择 | 理由 | 成本 |
|------|----------|------|------|
| **主数据库** | Supabase PostgreSQL | 托管服务、实时功能、免费额度 | $0-25/月 |
| **缓存数据库** | Upstash Redis | Serverless、按使用付费、全球分布 | $0-50/月 |
| **ORM工具** | Prisma | 类型安全、自动迁移、优秀DX | 免费 |

### 架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端应用层     │    │    API网关层     │    │   微服务层      │
│                 │    │                 │    │                 │
│  React Admin    │◄──►│   Express API   │◄──►│  Message Service│
│  Dashboard      │    │   Socket.IO     │    │  User Service   │
│  Mobile App     │    │   Rate Limiter  │    │  Tenant Service │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   数据存储层     │    │   缓存层        │    │   监控层        │
│                 │    │                 │    │                 │
│  Supabase       │    │   Upstash       │    │   Prometheus    │
│  PostgreSQL     │    │   Redis         │    │   Grafana       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗄️ 数据库设计

### 核心实体关系图

```mermaid
erDiagram
    Tenant ||--o{ User : "has"
    Tenant ||--o{ Message : "contains"
    Tenant ||--o{ Conversation : "owns"
    Tenant ||--o{ Webhook : "configures"
    
    User ||--o{ Message : "sends"
    User ||--o{ ConversationParticipant : "participates"
    
    Conversation ||--o{ Message : "contains"
    Conversation ||--o{ ConversationParticipant : "has"
    
    Message ||--o{ Message : "replies_to"
    
    Tenant {
        uuid id PK
        string name
        string subdomain UK
        string apiKey UK
        string planType
        json settings
        string status
        datetime createdAt
        datetime updatedAt
    }
    
    User {
        uuid id PK
        uuid tenantId FK
        string externalUserId
        string email
        string displayName
        string avatarUrl
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    Conversation {
        uuid id PK
        uuid tenantId FK
        string name
        string type
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    ConversationParticipant {
        uuid id PK
        uuid conversationId FK
        uuid userId FK
        string role
        datetime joinedAt
    }
    
    Message {
        uuid id PK
        uuid tenantId FK
        uuid conversationId FK
        uuid senderId FK
        string messageType
        json content
        uuid replyToId FK
        string status
        json metadata
        datetime createdAt
        datetime updatedAt
    }
    
    Webhook {
        uuid id PK
        uuid tenantId FK
        string name
        string url
        string[] events
        string secret
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    SystemConfig {
        uuid id PK
        string key UK
        json value
        datetime createdAt
        datetime updatedAt
    }
```

## ⚙️ 环境配置

### 1. 环境变量配置

创建 `.env` 文件：

```bash
# ==================== 服务器配置 ====================
NODE_ENV=development
PORT=3030
FRONTEND_URL=http://localhost:3000

# ==================== 数据库配置 - Supabase ====================
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# ==================== Redis配置 - Upstash ====================
REDIS_URL=redis://default:[YOUR-PASSWORD]@[YOUR-REGION].upstash.io:[PORT]
UPSTASH_REDIS_REST_URL=https://[YOUR-REGION].upstash.io
UPSTASH_REDIS_REST_TOKEN=[YOUR-REST-TOKEN]

# ==================== JWT配置 ====================
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=7d

# ==================== 安全配置 ====================
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000

# ==================== 限流配置 ====================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ==================== 日志配置 ====================
LOG_LEVEL=info
LOG_FILE=logs/app.log

# ==================== 邮件配置 ====================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# ==================== 文件上传配置 ====================
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads

# ==================== 监控配置 ====================
ENABLE_METRICS=true
METRICS_PORT=9090

# ==================== AI服务配置 ====================
OPENAI_API_KEY=your-openai-api-key
AI_SERVICE_URL=http://localhost:5000

# ==================== 第三方服务配置 ====================
SENTRY_DSN=your-sentry-dsn
```

### 2. 开发环境配置

创建 `.env.development` 文件：

```bash
# 开发环境配置
NODE_ENV=development
PORT=3030
FRONTEND_URL=http://localhost:3000

# 本地数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/msgnexus
REDIS_URL=redis://localhost:6379

# 其他配置...
```

### 3. 生产环境配置

创建 `.env.production` 文件：

```bash
# 生产环境配置
NODE_ENV=production
PORT=3030
FRONTEND_URL=https://your-domain.com

# Supabase配置
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Upstash Redis配置
REDIS_URL=redis://default:[PASSWORD]@[REGION].upstash.io:[PORT]

# 其他配置...
```

## 📝 建表脚本

### 1. Prisma Schema 完整定义

```prisma
// GoldSky MessageCore Database Schema
// 基于 Feathers.js 扩展的多租户消息系统
// 开发者协作版本

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== 多租户系统 ====================

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

  // 关联关系
  users     User[]
  messages  Message[]
  conversations Conversation[]
  webhooks  Webhook[]

  @@map("tenants")
}

// ==================== 用户系统 ====================

model User {
  id             String  @id @default(uuid())
  tenantId       String  @map("tenant_id")
  externalUserId String  @map("external_user_id")
  email          String?
  displayName    String  @map("display_name")
  avatarUrl      String? @map("avatar_url")
  isActive       Boolean @default(true) @map("is_active")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  // 关联关系
  tenant         Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  messages       Message[]
  conversations  ConversationParticipant[]

  @@unique([tenantId, externalUserId])
  @@index([tenantId, email])
  @@map("users")
}

// ==================== 对话系统 ====================

model Conversation {
  id          String   @id @default(uuid())
  tenantId    String   @map("tenant_id")
  name        String?
  type        String   @default("direct") // direct, group, channel
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // 关联关系
  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  messages    Message[]
  participants ConversationParticipant[]

  @@index([tenantId, type, createdAt])
  @@map("conversations")
}

model ConversationParticipant {
  id             String @id @default(uuid())
  conversationId String @map("conversation_id")
  userId         String @map("user_id")
  role           String @default("member") // owner, admin, member
  joinedAt       DateTime @default(now()) @map("joined_at")

  // 关联关系
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([conversationId, userId])
  @@map("conversation_participants")
}

// ==================== 消息系统 ====================

model Message {
  id             String   @id @default(uuid())
  tenantId       String   @map("tenant_id")
  conversationId String   @map("conversation_id")
  senderId       String   @map("sender_id")
  messageType    String   @map("message_type") // text, image, file, system
  content        Json
  replyToId      String?  @map("reply_to_id")
  status         String   @default("sent") // sent, delivered, read, failed
  metadata       Json     @default("{}")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  // 关联关系
  tenant         Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User      @relation(fields: [senderId], references: [id], onDelete: Cascade)
  replyTo        Message?  @relation("MessageReplies", fields: [replyToId], references: [id])
  replies        Message[] @relation("MessageReplies")

  @@index([tenantId, conversationId, createdAt])
  @@index([senderId, createdAt])
  @@map("messages")
}

// ==================== Webhook 系统 ====================

model Webhook {
  id          String   @id @default(uuid())
  tenantId    String   @map("tenant_id")
  name        String
  url         String
  events      String[] // message.created, user.joined, etc.
  secret      String
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // 关联关系
  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId, isActive])
  @@map("webhooks")
}

// ==================== 系统配置 ====================

model SystemConfig {
  id    String @id @default(uuid())
  key   String @unique
  value Json
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("system_configs")
}
```

### 2. SQL 建表脚本

```sql
-- ==================== 多租户系统 ====================

-- 租户表
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    plan_type VARCHAR(50) DEFAULT 'basic',
    settings JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    external_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    display_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, external_user_id)
);

-- 对话表
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255),
    type VARCHAR(50) DEFAULT 'direct',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 对话参与者表
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

-- 消息表
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    reply_to_id UUID REFERENCES messages(id),
    status VARCHAR(50) DEFAULT 'sent',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook表
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL,
    secret VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 系统配置表
CREATE TABLE system_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== 索引创建 ====================

-- 用户表索引
CREATE INDEX idx_users_tenant_email ON users(tenant_id, email);

-- 对话表索引
CREATE INDEX idx_conversations_tenant_type_created ON conversations(tenant_id, type, created_at);

-- 消息表索引
CREATE INDEX idx_messages_tenant_conversation_created ON messages(tenant_id, conversation_id, created_at);
CREATE INDEX idx_messages_sender_created ON messages(sender_id, created_at);

-- Webhook表索引
CREATE INDEX idx_webhooks_tenant_active ON webhooks(tenant_id, is_active);

-- ==================== 触发器创建 ====================

-- 更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_configs_updated_at BEFORE UPDATE ON system_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. 初始数据插入脚本

```sql
-- ==================== 初始数据 ====================

-- 插入示例租户
INSERT INTO tenants (name, subdomain, api_key, plan_type, status) VALUES
('Acme Corporation', 'acme', 'acme-api-key-123', 'enterprise', 'active'),
('TechStart Inc', 'techstart', 'techstart-api-key-456', 'professional', 'active'),
('InnovateLab', 'innovatelab', 'innovatelab-api-key-789', 'basic', 'suspended');

-- 插入示例用户
INSERT INTO users (tenant_id, external_user_id, email, display_name, is_active) VALUES
((SELECT id FROM tenants WHERE subdomain = 'acme'), 'user1', 'user1@acme.com', 'John Doe', true),
((SELECT id FROM tenants WHERE subdomain = 'acme'), 'user2', 'user2@acme.com', 'Jane Smith', true),
((SELECT id FROM tenants WHERE subdomain = 'techstart'), 'user1', 'user1@techstart.com', 'Bob Johnson', true);

-- 插入示例对话
INSERT INTO conversations (tenant_id, name, type, is_active) VALUES
((SELECT id FROM tenants WHERE subdomain = 'acme'), 'General Chat', 'channel', true),
((SELECT id FROM tenants WHERE subdomain = 'acme'), 'Support', 'channel', true),
((SELECT id FROM tenants WHERE subdomain = 'techstart'), 'Team Chat', 'group', true);

-- 插入示例消息
INSERT INTO messages (tenant_id, conversation_id, sender_id, message_type, content, status) VALUES
((SELECT id FROM tenants WHERE subdomain = 'acme'), 
 (SELECT id FROM conversations WHERE name = 'General Chat' AND tenant_id = (SELECT id FROM tenants WHERE subdomain = 'acme')),
 (SELECT id FROM users WHERE external_user_id = 'user1' AND tenant_id = (SELECT id FROM tenants WHERE subdomain = 'acme')),
 'text', '{"text": "Hello everyone!"}', 'sent');

-- 插入系统配置
INSERT INTO system_configs (key, value) VALUES
('system.version', '"1.0.0"'),
('system.maintenance', 'false'),
('system.features', '["real_time_messaging", "file_sharing", "analytics"]');
```

## 🔄 数据迁移

### 1. Prisma 迁移命令

```bash
# 进入prisma目录
cd backend/prisma

# 生成Prisma客户端
npx prisma generate

# 创建初始迁移
npx prisma migrate dev --name init

# 应用迁移到生产环境
npx prisma migrate deploy

# 查看迁移状态
npx prisma migrate status

# 重置数据库（开发环境）
npx prisma migrate reset
```

### 2. 数据迁移脚本

```typescript
// scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateData() {
  try {
    console.log('开始数据迁移...');

    // 1. 创建默认租户
    const defaultTenant = await prisma.tenant.create({
      data: {
        name: 'Default Tenant',
        subdomain: 'default',
        apiKey: 'default-api-key-' + Date.now(),
        planType: 'basic',
        status: 'active',
        settings: {}
      }
    });

    console.log('✅ 默认租户创建成功:', defaultTenant.id);

    // 2. 创建系统配置
    const systemConfigs = [
      { key: 'system.version', value: '1.0.0' },
      { key: 'system.maintenance', value: false },
      { key: 'system.features', value: ['real_time_messaging', 'file_sharing', 'analytics'] }
    ];

    for (const config of systemConfigs) {
      await prisma.systemConfig.create({
        data: {
          key: config.key,
          value: config.value
        }
      });
    }

    console.log('✅ 系统配置创建成功');

    // 3. 创建示例数据
    const sampleUsers = [
      { externalUserId: 'user1', email: 'user1@example.com', displayName: 'John Doe' },
      { externalUserId: 'user2', email: 'user2@example.com', displayName: 'Jane Smith' }
    ];

    for (const userData of sampleUsers) {
      await prisma.user.create({
        data: {
          ...userData,
          tenantId: defaultTenant.id,
          isActive: true
        }
      });
    }

    console.log('✅ 示例用户创建成功');

    console.log('🎉 数据迁移完成！');
  } catch (error) {
    console.error('❌ 数据迁移失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
```

## 🔌 API集成

### 1. 数据库连接工具

```typescript
// apps/api/src/utils/database.ts
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

// Prisma客户端实例
let prisma: PrismaClient;

// Redis客户端实例
let redis: Redis;

// 初始化Prisma客户端
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return prisma;
}

// 初始化Redis客户端
export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }

    redis = new Redis(redisUrl, {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    // 错误处理
    redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });
  }
  return redis;
}

// 关闭数据库连接
export async function closeDatabaseConnections(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (redis) {
    await redis.quit();
  }
}

// 健康检查
export async function checkDatabaseHealth(): Promise<{
  prisma: boolean;
  redis: boolean;
  timestamp: string;
}> {
  const health = {
    prisma: false,
    redis: false,
    timestamp: new Date().toISOString(),
  };

  try {
    // 检查Prisma连接
    const prismaClient = getPrismaClient();
    await prismaClient.$queryRaw`SELECT 1`;
    health.prisma = true;
  } catch (error) {
    console.error('Prisma health check failed:', error);
  }

  try {
    // 检查Redis连接
    const redisClient = getRedisClient();
    await redisClient.ping();
    health.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  return health;
}
```

### 2. API路由更新

```typescript
// apps/api/src/routes/tenants.ts
import { Router } from 'express';
import { getPrismaClient } from '../utils/database';

const router = Router();
const prisma = getPrismaClient();

// 获取所有租户
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, planType } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    
    if (status) where.status = status;
    if (planType) where.planType = planType;
    
    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              users: true,
              messages: true,
              conversations: true
            }
          }
        }
      }),
      prisma.tenant.count({ where })
    ]);
    
    res.json({
      success: true,
      data: tenants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('获取租户列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取租户列表失败'
    });
  }
});

// 创建租户
router.post('/', async (req, res) => {
  try {
    const { name, subdomain, planType = 'basic' } = req.body;
    
    const tenant = await prisma.tenant.create({
      data: {
        name,
        subdomain,
        apiKey: `api-key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        planType,
        status: 'active',
        settings: {}
      }
    });
    
    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    console.error('创建租户失败:', error);
    res.status(500).json({
      success: false,
      message: '创建租户失败'
    });
  }
});

export default router;
```

## 🧪 测试验证

### 1. 数据库连接测试

```typescript
// tests/database.test.ts
import { getPrismaClient, getRedisClient, checkDatabaseHealth } from '../src/utils/database';

describe('Database Connection Tests', () => {
  test('should connect to PostgreSQL', async () => {
    const prisma = getPrismaClient();
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    expect(result).toEqual([{ test: 1 }]);
  });

  test('should connect to Redis', async () => {
    const redis = getRedisClient();
    const result = await redis.ping();
    expect(result).toBe('PONG');
  });

  test('should pass health check', async () => {
    const health = await checkDatabaseHealth();
    expect(health.prisma).toBe(true);
    expect(health.redis).toBe(true);
  });
});
```

### 2. API测试

```typescript
// tests/api.test.ts
import request from 'supertest';
import app from '../src/app';

describe('API Tests', () => {
  test('should get tenants list', async () => {
    const response = await request(app)
      .get('/api/v1/tenants')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('should create tenant', async () => {
    const tenantData = {
      name: 'Test Tenant',
      subdomain: 'test',
      planType: 'basic'
    };

    const response = await request(app)
      .post('/api/v1/tenants')
      .send(tenantData)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(tenantData.name);
  });
});
```

## 🚀 部署指南

### 1. Supabase 部署

1. **创建Supabase项目**
   ```bash
   # 访问 https://supabase.com
   # 点击 "New Project"
   # 填写项目信息
   ```

2. **获取连接信息**
   ```bash
   # 在Settings > Database中找到：
   # - Database URL
   # - Project URL
   # - Anon Key
   # - Service Role Key
   ```

3. **运行迁移**
   ```bash
   cd backend/prisma
   export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   npx prisma migrate deploy
   ```

### 2. Upstash Redis 部署

1. **创建Upstash数据库**
   ```bash
   # 访问 https://upstash.com
   # 点击 "Create Database"
   # 填写数据库信息
   ```

2. **获取连接信息**
   ```bash
   # 获取：
   # - REDIS_URL
   # - UPSTASH_REDIS_REST_URL
   # - UPSTASH_REDIS_REST_TOKEN
   ```

### 3. 环境变量配置

```bash
# 生产环境变量
export NODE_ENV=production
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
export REDIS_URL="redis://default:[PASSWORD]@[REGION].upstash.io:[PORT]"
export JWT_SECRET="your-production-jwt-secret"
```

## 📊 监控维护

### 1. 数据库监控

```typescript
// apps/api/src/utils/monitoring.ts
import { getPrismaClient, getRedisClient } from './database';

export async function getDatabaseMetrics() {
  const prisma = getPrismaClient();
  const redis = getRedisClient();

  const metrics = {
    timestamp: new Date().toISOString(),
    database: {
      connections: await prisma.$queryRaw`SELECT count(*) as connections FROM pg_stat_activity`,
      size: await prisma.$queryRaw`SELECT pg_size_pretty(pg_database_size(current_database())) as size`,
      uptime: await prisma.$queryRaw`SELECT extract(epoch from (now() - pg_postmaster_start_time())) as uptime`
    },
    redis: {
      memory: await redis.info('memory'),
      clients: await redis.info('clients'),
      stats: await redis.info('stats')
    }
  };

  return metrics;
}
```

### 2. 备份策略

```bash
# Supabase自动备份
# - 每日自动备份
# - 可手动创建备份
# - 支持时间点恢复

# Redis备份
# - Upstash自动备份
# - 可导出数据
# - 支持跨区域复制
```

### 3. 性能优化

```sql
-- 数据库性能优化
-- 1. 创建索引
CREATE INDEX CONCURRENTLY idx_messages_tenant_created ON messages(tenant_id, created_at);

-- 2. 分区表（大数据量）
CREATE TABLE messages_partitioned (
    LIKE messages INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- 3. 查询优化
EXPLAIN ANALYZE SELECT * FROM messages WHERE tenant_id = 'xxx' AND created_at > '2024-01-01';
```

## 📋 检查清单

### 部署前检查
- [ ] Supabase项目已创建
- [ ] Upstash Redis数据库已创建
- [ ] 环境变量已配置
- [ ] 数据库迁移已运行
- [ ] 初始数据已插入
- [ ] API测试已通过
- [ ] 监控已配置

### 部署后检查
- [ ] 数据库连接正常
- [ ] Redis连接正常
- [ ] API响应正常
- [ ] 实时功能正常
- [ ] 监控数据正常
- [ ] 备份策略正常

## 🆘 故障排除

### 常见问题

1. **连接超时**
   ```bash
   # 检查网络连接
   ping db.[PROJECT-REF].supabase.co
   
   # 检查防火墙设置
   # 确认IP白名单
   ```

2. **认证失败**
   ```bash
   # 验证环境变量
   echo $DATABASE_URL
   echo $REDIS_URL
   
   # 检查API密钥
   # 确认权限设置
   ```

3. **迁移失败**
   ```bash
   # 检查数据库权限
   # 验证schema版本
   npx prisma migrate status
   
   # 查看错误日志
   npx prisma migrate dev --create-only
   ```

## 📞 支持

如有问题，请参考：
- [Supabase文档](https://supabase.com/docs)
- [Upstash文档](https://upstash.com/docs)
- [Prisma文档](https://www.prisma.io/docs)

---

**文档版本**: 1.0.0  
**最后更新**: 2024-01-20  
**维护者**: MsgNexus开发团队 