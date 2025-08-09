# 🗄️ 数据库设置指南

## Supabase 设置

### 1. 创建Supabase项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 "New Project"
3. 选择组织或创建新组织
4. 填写项目信息：
   - **Name**: msgnexus
   - **Database Password**: 设置强密码
   - **Region**: 选择最近的区域

### 2. 获取连接信息

项目创建后，在Settings > Database中找到：
- **Database URL**: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- **Project URL**: `https://[PROJECT-REF].supabase.co`
- **Anon Key**: 公开的API密钥
- **Service Role Key**: 服务端API密钥

### 3. 运行数据库迁移

```bash
# 进入prisma目录
cd backend/prisma

# 设置环境变量
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# 生成Prisma客户端
npx prisma generate

# 运行迁移
npx prisma migrate dev --name init

# 查看数据库
npx prisma studio
```

## Upstash Redis 设置

### 1. 创建Upstash Redis数据库

1. 访问 [Upstash](https://upstash.com)
2. 点击 "Create Database"
3. 填写信息：
   - **Database Name**: msgnexus-redis
   - **Region**: 选择最近的区域
   - **TLS**: 启用（推荐）

### 2. 获取连接信息

创建后获取：
- **UPSTASH_REDIS_REST_URL**: REST API URL
- **UPSTASH_REDIS_REST_TOKEN**: REST API Token
- **UPSTASH_REDIS_REST_READ_TOKEN**: 只读Token

### 3. 配置环境变量

```bash
# 在.env文件中添加
REDIS_URL=redis://default:[PASSWORD]@[REGION].upstash.io:[PORT]
```

## 本地开发配置

### 1. 本地PostgreSQL（可选）

```bash
# 使用Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=msgnexus -p 5432:5432 -d postgres:13

# 或者使用Homebrew
brew install postgresql
brew services start postgresql
```

### 2. 本地Redis（可选）

```bash
# 使用Docker
docker run --name redis -p 6379:6379 -d redis:6

# 或者使用Homebrew
brew install redis
brew services start redis
```

## 环境变量配置

### 生产环境 (.env.production)

```bash
# Supabase
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Upstash Redis
REDIS_URL=redis://default:[PASSWORD]@[REGION].upstash.io:[PORT]
```

### 开发环境 (.env.development)

```bash
# 本地数据库
DATABASE_URL=postgresql://username:password@localhost:5432/msgnexus
REDIS_URL=redis://localhost:6379
```

## 验证配置

### 1. 测试数据库连接

```bash
# 测试PostgreSQL连接
npx prisma db pull

# 测试Redis连接
node -e "
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);
redis.ping().then(() => {
  console.log('Redis连接成功');
  process.exit(0);
}).catch(err => {
  console.error('Redis连接失败:', err);
  process.exit(1);
});
"
```

### 2. 运行应用

```bash
# 启动开发环境
npm run dev

# 检查数据库连接
curl http://localhost:3030/health
```

## 故障排除

### 常见问题

1. **连接超时**
   - 检查网络连接
   - 验证防火墙设置
   - 确认IP白名单

2. **认证失败**
   - 验证用户名和密码
   - 检查API密钥
   - 确认权限设置

3. **迁移失败**
   - 检查数据库权限
   - 验证schema版本
   - 查看错误日志

## 备份策略

### Supabase备份

- 自动每日备份
- 可手动创建备份
- 支持时间点恢复

### Redis备份

- Upstash自动备份
- 可导出数据
- 支持跨区域复制 