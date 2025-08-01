# GoldSky MessageCore API 测试指南

## 🚀 快速开始

### 前置要求
- Node.js (推荐 v18+)
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动服务器

#### 方式 1: 简化版本 (推荐用于测试)
```bash
npm run dev:simple
```

#### 方式 2: 完整版本 (需要数据库和 Redis)
```bash
npm run dev
```

### 测试 API

#### 使用测试脚本
```bash
./test-api.sh
```

#### 手动测试
```bash
# 健康检查
curl http://localhost:3030/health

# 测试路由
curl http://localhost:3030/api/test

# 租户列表
curl http://localhost:3030/api/tenants

# 用户列表
curl http://localhost:3030/api/users

# 消息列表
curl http://localhost:3030/api/messages

# 系统概览
curl http://localhost:3030/api/system/overview

# AI 配置
curl http://localhost:3030/api/ai/config
```

## 📋 API 端点列表

### 基础端点
- `GET /health` - 健康检查
- `GET /api/test` - 测试端点

### 租户管理
- `GET /api/tenants` - 获取租户列表
- `GET /api/tenants/:id` - 获取租户详情
- `POST /api/tenants` - 创建租户
- `PUT /api/tenants/:id` - 更新租户
- `DELETE /api/tenants/:id` - 删除租户

### 用户管理
- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `POST /api/users` - 创建用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

### 消息管理
- `GET /api/messages` - 获取消息列表
- `GET /api/messages/:id` - 获取消息详情
- `POST /api/messages` - 发送消息
- `PUT /api/messages/:id` - 更新消息
- `DELETE /api/messages/:id` - 删除消息

### 系统监控
- `GET /api/system/overview` - 系统概览
- `GET /api/system/performance` - 性能指标
- `GET /api/system/logs` - 系统日志
- `GET /api/system/errors` - 错误报告

### AI 服务
- `GET /api/ai/config` - AI 配置
- `POST /api/ai/chat` - AI 聊天
- `POST /api/ai/analyze` - 消息分析
- `POST /api/ai/suggestions` - 回复建议

## 🔧 环境配置

### 创建环境文件
```bash
cp env.example .env
```

### 配置环境变量
```env
# 服务器配置
PORT=3030
NODE_ENV=development

# 前端配置
FRONTEND_URL=http://localhost:3000
```

## 🧪 测试用例

### 1. 健康检查测试
```bash
curl -X GET http://localhost:3030/health
```

**预期响应:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-22T10:00:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

### 2. 租户列表测试
```bash
curl -X GET http://localhost:3030/api/tenants
```

**预期响应:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "GoldSky Corp",
      "subdomain": "goldsky",
      "planType": "enterprise",
      "status": "active",
      "userCount": 150,
      "messageCount": 50000,
      "createdAt": "2024-01-22T10:00:00.000Z",
      "updatedAt": "2024-01-22T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### 3. 用户列表测试
```bash
curl -X GET http://localhost:3030/api/users
```

**预期响应:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "email": "admin@goldsky.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin",
      "status": "active",
      "tenantId": "1",
      "lastLogin": "2024-01-22T10:00:00.000Z",
      "createdAt": "2024-01-22T10:00:00.000Z",
      "updatedAt": "2024-01-22T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

## 🐛 故障排除

### 常见问题

#### 1. 端口被占用
```bash
# 查看端口占用
lsof -i :3030

# 杀死进程
kill -9 <PID>
```

#### 2. 依赖安装失败
```bash
# 清除缓存
npm cache clean --force

# 重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 3. TypeScript 编译错误
```bash
# 检查 TypeScript 配置
npx tsc --noEmit

# 修复类型错误
npm run lint:fix
```

### 日志查看
```bash
# 查看实时日志
tail -f logs/all.log

# 查看错误日志
tail -f logs/error.log
```

## 📊 性能测试

### 使用 Apache Bench
```bash
# 安装 ab
brew install httpd

# 测试健康检查端点
ab -n 1000 -c 10 http://localhost:3030/health

# 测试 API 端点
ab -n 1000 -c 10 http://localhost:3030/api/tenants
```

### 使用 wrk
```bash
# 安装 wrk
brew install wrk

# 测试性能
wrk -t12 -c400 -d30s http://localhost:3030/health
```

## 🔒 安全测试

### 1. 输入验证测试
```bash
# 测试 SQL 注入
curl "http://localhost:3030/api/tenants?search='; DROP TABLE users; --"

# 测试 XSS
curl -X POST http://localhost:3030/api/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "<script>alert(\"xss\")</script>"}'
```

### 2. 认证测试
```bash
# 测试未认证访问
curl http://localhost:3030/api/tenants

# 测试无效 token
curl -H "Authorization: Bearer invalid-token" \
  http://localhost:3030/api/tenants
```

## 📈 监控指标

### 关键指标
- **响应时间**: < 100ms
- **吞吐量**: > 1000 req/s
- **错误率**: < 1%
- **可用性**: > 99.9%

### 监控端点
- `GET /health` - 健康状态
- `GET /api/system/overview` - 系统概览
- `GET /api/system/performance` - 性能指标

## 📞 支持

如果遇到问题，请：
1. 查看日志文件
2. 检查环境配置
3. 运行测试脚本
4. 提交 Issue 到项目仓库

---

*最后更新: 2024年1月22日* 