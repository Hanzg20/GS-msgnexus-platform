# 🏗️ MsgNexus 技术架构概览

## 系统架构

MsgNexus 采用现代化的微服务架构，确保高可用性、可扩展性和可维护性。

### 整体架构图

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
│  PostgreSQL     │    │   Redis         │    │   Prometheus    │
│  (主数据库)      │    │   (缓存/会话)    │    │   Grafana       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 核心技术栈

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | 用户界面框架 |
| TypeScript | 5.x | 类型安全 |
| Socket.IO Client | 4.x | 实时通信 |
| Zustand | 4.x | 状态管理 |
| Framer Motion | 10.x | 动画效果 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 18.x | 运行时环境 |
| Express | 4.x | Web框架 |
| Socket.IO | 4.x | 实时通信 |
| Prisma | 5.x | ORM工具 |
| PostgreSQL | 13+ | 主数据库 |
| Redis | 6.x | 缓存/会话 |

### 基础设施

| 技术 | 版本 | 用途 |
|------|------|------|
| Docker | 20+ | 容器化 |
| Kubernetes | 1.25+ | 容器编排 |
| Nginx | 1.20+ | 反向代理 |
| Prometheus | 2.x | 监控 |
| Grafana | 9.x | 可视化 |

## 服务架构

### 1. 管理后台服务 (Admin Service)

**技术栈**: React + TypeScript + Zustand

**主要功能**:
- 用户界面管理
- 实时数据展示
- 系统配置管理
- 权限控制界面

**端口**: 3000

### 2. API服务 (API Service)

**技术栈**: Express + Socket.IO + Prisma

**主要功能**:
- RESTful API接口
- WebSocket实时通信
- 数据验证和转换
- 错误处理

**端口**: 3030

### 3. 实时通信服务 (Realtime Service)

**技术栈**: Socket.IO + Redis

**主要功能**:
- 实时消息推送
- 在线状态管理
- 房间管理
- 消息队列处理

**端口**: 3031

## 数据架构

### 数据库设计

#### 核心表结构

```sql
-- 租户表
CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 消息表
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'text',
    status VARCHAR(50) DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 缓存策略

#### Redis 使用场景

1. **会话存储**
   - 用户登录状态
   - JWT Token 缓存
   - 临时数据存储

2. **实时数据缓存**
   - 在线用户列表
   - 消息队列
   - 系统配置

3. **性能优化**
   - 热点数据缓存
   - 查询结果缓存
   - 限流计数器

## 安全架构

### 认证授权

1. **JWT Token 认证**
   - Access Token (短期)
   - Refresh Token (长期)
   - Token 轮换机制

2. **RBAC 权限控制**
   - 角色定义
   - 权限分配
   - 动态权限检查

3. **多租户隔离**
   - 数据隔离
   - 资源隔离
   - 权限隔离

### 数据安全

1. **数据加密**
   - 传输加密 (HTTPS/WSS)
   - 存储加密 (AES-256)
   - 敏感字段加密

2. **访问控制**
   - API 限流
   - IP 白名单
   - 操作审计

## 性能优化

### 前端优化

1. **代码分割**
   - 路由级别分割
   - 组件懒加载
   - 第三方库按需加载

2. **缓存策略**
   - 静态资源缓存
   - API 响应缓存
   - 状态管理优化

### 后端优化

1. **数据库优化**
   - 索引优化
   - 查询优化
   - 连接池管理

2. **缓存优化**
   - 多级缓存
   - 缓存预热
   - 缓存更新策略

## 监控告警

### 监控指标

1. **系统指标**
   - CPU 使用率
   - 内存使用率
   - 磁盘使用率
   - 网络流量

2. **应用指标**
   - 响应时间
   - 错误率
   - 并发数
   - 吞吐量

3. **业务指标**
   - 消息发送量
   - 用户活跃度
   - 租户使用情况

### 告警规则

1. **系统告警**
   - 资源使用率 > 80%
   - 服务不可用
   - 错误率 > 5%

2. **业务告警**
   - 消息发送失败
   - 用户登录异常
   - 数据同步异常

## 部署架构

### 开发环境

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  admin:
    build: ./apps/admin
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
  
  api:
    build: ./apps/api
    ports:
      - "3030:3030"
    environment:
      - NODE_ENV=development
  
  realtime:
    build: ./apps/realtime
    ports:
      - "3031:3031"
    environment:
      - NODE_ENV=development
  
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: msgnexus
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
  
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
```

### 生产环境

```yaml
# k8s/production.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: msgnexus-admin
spec:
  replicas: 3
  selector:
    matchLabels:
      app: msgnexus-admin
  template:
    metadata:
      labels:
        app: msgnexus-admin
    spec:
      containers:
      - name: admin
        image: msgnexus/admin:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## 扩展性设计

### 水平扩展

1. **无状态服务**
   - API 服务可水平扩展
   - 实时服务支持集群
   - 负载均衡分发

2. **数据分片**
   - 租户数据分片
   - 消息数据分片
   - 读写分离

### 垂直扩展

1. **资源优化**
   - 内存优化
   - CPU 优化
   - 存储优化

2. **架构优化**
   - 微服务拆分
   - 缓存优化
   - 数据库优化

---

*本文档描述了 MsgNexus 平台的技术架构设计，为开发团队提供技术参考。* 