# 🏠 Jinbean 便民应用快速启动指南

## 📋 概述

本指南将帮助你在 30 分钟内完成 Jinbean 便民应用的搭建和启动，实现 Customer 和 Provider 端的聊天功能。

## 🎯 核心功能

- **多角色聊天**：Customer 和 Provider 之间的实时沟通
- **服务匹配**：基于地理位置和需求的服务推荐
- **订单管理**：聊天中的订单创建和状态更新
- **评价系统**：服务完成后的评价和反馈

## ⚡ 快速开始

### 1. 环境准备

```bash
# 确保已安装 Node.js 18+ 和 npm
node --version
npm --version

# 克隆项目（如果还没有）
git clone <repository-url>
cd mssccore
```

### 2. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装 API 依赖
cd apps/api
npm install
cd ../..

# 安装 Admin 依赖
cd apps/admin
npm install
cd ../..
```

### 3. 配置数据库

#### 3.1 设置 Supabase

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目：`jinbean-dev`
3. 获取连接信息：
   - Database URL
   - Project URL
   - Anon Key
   - Service Role Key

#### 3.2 设置 Upstash Redis

1. 访问 [Upstash](https://upstash.com)
2. 创建 Redis 数据库：`jinbean-redis`
3. 获取连接信息

#### 3.3 更新环境变量

编辑 `.env` 文件：

```bash
# Jinbean 专用配置
JINBEAN_APP_NAME=Jinbean便民服务
JINBEAN_DEFAULT_RADIUS=10
JINBEAN_MAX_MESSAGE_LENGTH=1000
JINBEAN_FILE_UPLOAD_SIZE=10485760

# 数据库配置
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Redis 配置
REDIS_URL=redis://default:[PASSWORD]@[REGION].upstash.io:[PORT]
```

### 4. 运行数据库迁移

```bash
# 进入 prisma 目录
cd backend/prisma

# 生成 Prisma 客户端
npx prisma generate

# 运行迁移
npx prisma migrate dev --name jinbean-init

# 插入 Jinbean 示例数据
npx ts-node ../../scripts/migrate-jinbean-data.ts

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

## 🧪 功能测试

### 1. 用户登录测试

```bash
# 测试用户登录
curl -X POST http://localhost:3030/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@jinbean.com",
    "password": "password123"
  }'
```

### 2. 聊天功能测试

```bash
# 获取聊天列表
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3030/api/v1/chat/conversations

# 创建聊天
curl -X POST http://localhost:3030/api/v1/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "provider001",
    "serviceId": "service001"
  }'
```

### 3. 服务匹配测试

```bash
# 获取附近服务
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3030/api/v1/services/nearby?lat=39.9042&lng=116.4074&radius=10"
```

## 🎮 使用演示

### Customer 端操作

1. **浏览服务**
   - 访问 http://localhost:3000
   - 登录 Customer 账户
   - 查看附近的服务提供者

2. **发起聊天**
   - 点击"联系服务商"按钮
   - 选择服务类别
   - 发送服务需求描述

3. **沟通协商**
   - 实时聊天沟通服务细节
   - 发送图片和语音消息
   - 协商价格和服务时间

4. **确认订单**
   - 在聊天中创建订单
   - 确认服务时间和地点
   - 支付服务费用

### Provider 端操作

1. **服务管理**
   - 登录 Provider 账户
   - 创建和编辑服务信息
   - 设置服务价格和范围

2. **接收咨询**
   - 接收 Customer 的聊天请求
   - 查看服务需求详情
   - 及时回复客户咨询

3. **服务协商**
   - 与 Customer 沟通服务细节
   - 提供专业建议
   - 协商服务价格

4. **订单处理**
   - 确认订单信息
   - 安排服务时间
   - 提供服务

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

#### 2. 聊天功能不工作

```bash
# 检查 WebSocket 连接
curl http://localhost:3031/health

# 查看实时服务日志
tail -f logs/realtime.log
```

#### 3. 用户认证失败

```bash
# 检查 JWT 配置
echo $JWT_SECRET

# 重新生成 JWT 密钥
openssl rand -base64 32
```

#### 4. 服务匹配不准确

```bash
# 检查地理位置数据
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3030/api/v1/services/nearby?lat=39.9042&lng=116.4074&radius=10"
```

## 📊 监控指标

### 业务指标

- **日活跃用户数**：Customer 和 Provider 的活跃用户
- **聊天消息数量**：每日发送的消息数量
- **订单转化率**：聊天到订单的转化率
- **服务完成率**：订单完成的比例
- **用户满意度**：服务评价的平均分数

### 技术指标

- **消息发送成功率**：消息发送的成功率
- **实时连接数**：WebSocket 连接数量
- **响应时间**：API 响应时间
- **错误率**：系统错误率
- **系统可用性**：系统运行时间

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

## 📞 技术支持

### 文档资源

- [完整实施方案](./JINBEAN_CHAT_IMPLEMENTATION.md)
- [数据库设计](./DATABASE_IMPLEMENTATION_PLAN.md)
- [API 文档](./API_REFERENCE.md)

### 社区支持

- GitHub Issues: [项目问题反馈](https://github.com/your-org/jinbean/issues)
- 文档: [项目文档](https://docs.jinbean.com)

### 紧急联系

- 邮箱: support@jinbean.com
- 电话: +1-xxx-xxx-xxxx

## 🎯 下一步计划

### 短期目标 (1周内)

- [ ] 完善聊天功能
- [ ] 优化服务匹配算法
- [ ] 添加支付功能
- [ ] 实现消息推送

### 中期目标 (1个月内)

- [ ] 添加语音消息
- [ ] 实现视频通话
- [ ] 优化用户体验
- [ ] 增加数据分析

### 长期目标 (3个月内)

- [ ] 移动端应用
- [ ] 多语言支持
- [ ] 智能推荐
- [ ] 企业版功能

---

**版本**: 1.0.0  
**最后更新**: 2024-01-20  
**维护者**: Jinbean开发团队 