# 🚀 MsgNexus 快速启动指南

## 📋 概述

本指南将帮助你在 30 分钟内完成 MsgNexus 数据库环境的搭建和启动。

## 🎯 前置要求

- Node.js 18+ 
- npm 8+
- Git
- 网络连接

## ⚡ 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd mssccore
```

### 2. 设置环境

```bash
# 复制环境变量文件
cp env.example .env

# 安装依赖
npm install
```

### 3. 配置数据库

#### 3.1 设置 Supabase

1. 访问 [Supabase](https://supabase.com)
2. 点击 "New Project"
3. 填写项目信息：
   - **Name**: msgnexus
   - **Database Password**: 设置强密码
   - **Region**: 选择最近的区域
4. 等待项目创建完成
5. 在 Settings > Database 中获取连接信息

#### 3.2 设置 Upstash Redis

1. 访问 [Upstash](https://upstash.com)
2. 点击 "Create Database"
3. 填写信息：
   - **Database Name**: msgnexus-redis
   - **Region**: 选择最近的区域
   - **TLS**: 启用
4. 获取连接信息

#### 3.3 更新环境变量

编辑 `.env` 文件：

```bash
# Supabase 配置
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Upstash Redis 配置
REDIS_URL=redis://default:[PASSWORD]@[REGION].upstash.io:[PORT]
```

### 4. 运行数据库迁移

```bash
# 进入 prisma 目录
cd backend/prisma

# 生成 Prisma 客户端
npx prisma generate

# 运行迁移
npx prisma migrate dev --name init

# 插入示例数据
npx ts-node ../../scripts/migrate-data.ts

# 返回根目录
cd ../..
```

### 5. 启动应用

```bash
# 启动所有服务
npm run dev
```

应用将在以下端口启动：
- **前端管理界面**: http://localhost:3000
- **API 服务**: http://localhost:3030
- **实时服务**: http://localhost:3031

## 🧪 验证安装

### 1. 检查数据库连接

```bash
# 测试 PostgreSQL 连接
curl http://localhost:3030/health

# 预期响应
{
  "status": "ok",
  "database": {
    "prisma": true,
    "redis": true
  },
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

### 2. 检查 API 端点

```bash
# 获取租户列表
curl http://localhost:3030/api/v1/tenants

# 获取系统状态
curl http://localhost:3030/api/v1/system

# 获取消息列表
curl http://localhost:3030/api/v1/messages
```

### 3. 访问管理界面

1. 打开浏览器访问 http://localhost:3000
2. 查看仪表板
3. 测试各个功能模块

## 🔧 故障排除

### 常见问题

#### 1. 数据库连接失败

```bash
# 检查环境变量
echo $DATABASE_URL
echo $REDIS_URL

# 测试连接
cd backend/prisma
npx prisma db pull
```

#### 2. 端口被占用

```bash
# 查看端口占用
lsof -i :3000
lsof -i :3030

# 终止进程
pkill -f "react-scripts"
pkill -f "node.*dist"
```

#### 3. 依赖安装失败

```bash
# 清理缓存
rm -rf node_modules
rm -rf apps/*/node_modules
npm cache clean --force

# 重新安装
npm install
```

#### 4. 迁移失败

```bash
# 检查数据库权限
# 确认 DATABASE_URL 正确
# 查看错误日志
npx prisma migrate dev --create-only
```

## 📊 性能优化

### 1. 数据库优化

```sql
-- 创建索引
CREATE INDEX CONCURRENTLY idx_messages_tenant_created ON messages(tenant_id, created_at);
CREATE INDEX CONCURRENTLY idx_users_tenant_email ON users(tenant_id, email);
```

### 2. Redis 优化

```bash
# 检查 Redis 连接
redis-cli -u $REDIS_URL ping

# 查看 Redis 信息
redis-cli -u $REDIS_URL info
```

## 🔒 安全配置

### 1. 环境变量安全

```bash
# 生产环境变量
export NODE_ENV=production
export JWT_SECRET="your-super-secret-jwt-key"
export DATABASE_URL="postgresql://..."
export REDIS_URL="redis://..."
```

### 2. 防火墙配置

```bash
# 只允许必要端口
sudo ufw allow 3000
sudo ufw allow 3030
sudo ufw allow 3031
```

## 📈 监控设置

### 1. 健康检查

```bash
# 创建健康检查脚本
cat > health-check.sh << 'EOF'
#!/bin/bash
curl -f http://localhost:3030/health || exit 1
EOF

chmod +x health-check.sh
```

### 2. 日志监控

```bash
# 查看应用日志
tail -f logs/app.log

# 查看错误日志
grep ERROR logs/app.log
```

## 🚀 生产部署

### 1. 环境准备

```bash
# 设置生产环境变量
export NODE_ENV=production
export PORT=3030
export DATABASE_URL="postgresql://..."
export REDIS_URL="redis://..."
```

### 2. 构建应用

```bash
# 构建前端
cd apps/admin
npm run build
cd ../..

# 构建后端
cd apps/api
npm run build
cd ../..
```

### 3. 启动服务

```bash
# 使用 PM2 启动
npm install -g pm2
pm2 start ecosystem.config.js
```

## 📞 支持

### 文档资源

- [完整实施方案](./DATABASE_IMPLEMENTATION_PLAN.md)
- [API 文档](./API_REFERENCE.md)
- [技术概述](./TECHNICAL_OVERVIEW.md)

### 社区支持

- GitHub Issues: [项目问题反馈](https://github.com/your-org/msgnexus/issues)
- 文档: [项目文档](https://docs.msgnexus.com)

### 紧急联系

- 邮箱: support@msgnexus.com
- 电话: +1-xxx-xxx-xxxx

---

**版本**: 1.0.0  
**最后更新**: 2024-01-20  
**维护者**: MsgNexus 开发团队 