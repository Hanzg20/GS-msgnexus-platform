# 🔌 MsgNexus API 参考文档

## 概述

MsgNexus API 提供完整的消息管理平台接口，支持租户管理、用户管理、消息处理等功能。

**基础URL**: `http://localhost:3030/api/v1`

## 认证

### JWT Token 认证

所有 API 请求都需要在 Header 中包含 JWT Token：

```http
Authorization: Bearer <your-jwt-token>
```

### 获取 Token

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@msgnexus.com",
      "role": "admin"
    }
  }
}
```

## 租户管理 API

### 获取租户列表

```http
GET /tenants?page=1&limit=10&search=keyword
```

**参数**:
- `page` (number): 页码，默认 1
- `limit` (number): 每页数量，默认 10
- `search` (string): 搜索关键词

**响应**:
```json
{
  "success": true,
  "data": {
    "tenants": [
      {
        "id": "uuid",
        "name": "示例租户",
        "domain": "example.msgnexus.com",
        "status": "active",
        "userCount": 25,
        "messageCount": 1000,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

### 创建租户

```http
POST /tenants
Content-Type: application/json

{
  "name": "新租户",
  "domain": "new.msgnexus.com",
  "adminEmail": "admin@new.com",
  "plan": "basic"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "新租户",
    "domain": "new.msgnexus.com",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 更新租户

```http
PUT /tenants/{id}
Content-Type: application/json

{
  "name": "更新后的租户名称",
  "status": "active"
}
```

### 删除租户

```http
DELETE /tenants/{id}
```

## 用户管理 API

### 获取用户列表

```http
GET /users?tenantId={tenantId}&page=1&limit=10
```

**响应**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "username": "user1",
        "email": "user1@example.com",
        "role": "user",
        "status": "active",
        "lastLoginAt": "2024-01-01T00:00:00Z",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### 创建用户

```http
POST /users
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user",
  "tenantId": "tenant-uuid"
}
```

### 更新用户

```http
PUT /users/{id}
Content-Type: application/json

{
  "username": "updateduser",
  "email": "updated@example.com",
  "role": "admin"
}
```

### 删除用户

```http
DELETE /users/{id}
```

## 消息管理 API

### 发送消息

```http
POST /messages
Content-Type: application/json

{
  "senderId": "sender-uuid",
  "receiverId": "receiver-uuid",
  "content": "Hello, World!",
  "type": "text",
  "tenantId": "tenant-uuid"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "message-uuid",
    "senderId": "sender-uuid",
    "receiverId": "receiver-uuid",
    "content": "Hello, World!",
    "type": "text",
    "status": "sent",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 获取消息列表

```http
GET /messages?userId={userId}&page=1&limit=20
```

**响应**:
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "message-uuid",
        "senderId": "sender-uuid",
        "receiverId": "receiver-uuid",
        "content": "Hello, World!",
        "type": "text",
        "status": "read",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### 标记消息已读

```http
PUT /messages/{id}/read
```

### 删除消息

```http
DELETE /messages/{id}
```

## 系统监控 API

### 获取系统状态

```http
GET /system/status
```

**响应**:
```json
{
  "success": true,
  "data": {
    "system": {
      "cpu": 45.2,
      "memory": 68.5,
      "disk": 32.1,
      "network": {
        "in": 1024,
        "out": 2048
      }
    },
    "services": {
      "api": "running",
      "realtime": "running",
      "database": "running",
      "redis": "running"
    },
    "uptime": 86400
  }
}
```

### 获取性能指标

```http
GET /system/metrics?period=1h
```

**参数**:
- `period` (string): 时间周期 (1h, 24h, 7d, 30d)

**响应**:
```json
{
  "success": true,
  "data": {
    "metrics": {
      "responseTime": [120, 115, 118, 125],
      "errorRate": [0.1, 0.2, 0.1, 0.3],
      "throughput": [1000, 1200, 1100, 1300],
      "concurrentUsers": [50, 60, 55, 65]
    },
    "timestamps": [
      "2024-01-01T00:00:00Z",
      "2024-01-01T01:00:00Z",
      "2024-01-01T02:00:00Z",
      "2024-01-01T03:00:00Z"
    ]
  }
}
```

## 日志管理 API

### 获取系统日志

```http
GET /logs/system?level=error&page=1&limit=50
```

**参数**:
- `level` (string): 日志级别 (debug, info, warn, error)
- `page` (number): 页码
- `limit` (number): 每页数量

**响应**:
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-uuid",
        "level": "error",
        "message": "Database connection failed",
        "timestamp": "2024-01-01T00:00:00Z",
        "service": "api",
        "details": {
          "error": "Connection timeout",
          "stack": "..."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 200,
      "pages": 4
    }
  }
}
```

### 获取访问日志

```http
GET /logs/access?method=GET&status=200&page=1&limit=50
```

## 权限管理 API

### 获取角色列表

```http
GET /roles
```

**响应**:
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "id": "role-uuid",
        "name": "admin",
        "description": "系统管理员",
        "permissions": ["user:read", "user:write", "tenant:read"],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 创建角色

```http
POST /roles
Content-Type: application/json

{
  "name": "moderator",
  "description": "内容审核员",
  "permissions": ["message:read", "message:moderate"]
}
```

### 分配用户角色

```http
POST /users/{userId}/roles
Content-Type: application/json

{
  "roleId": "role-uuid"
}
```

## WebSocket API

### 连接

```javascript
const socket = io('http://localhost:3031', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### 事件监听

#### 接收消息

```javascript
socket.on('message:received', (data) => {
  console.log('收到新消息:', data);
  // data: { id, senderId, content, type, timestamp }
});
```

#### 用户状态变化

```javascript
socket.on('user:status', (data) => {
  console.log('用户状态变化:', data);
  // data: { userId, status, timestamp }
});
```

#### 系统通知

```javascript
socket.on('system:notification', (data) => {
  console.log('系统通知:', data);
  // data: { type, title, message, timestamp }
});
```

### 发送事件

#### 发送消息

```javascript
socket.emit('message:send', {
  receiverId: 'receiver-uuid',
  content: 'Hello!',
  type: 'text'
});
```

#### 更新状态

```javascript
socket.emit('user:status', {
  status: 'online'
});
```

## 错误处理

### 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  }
}
```

### 常见错误码

| 错误码 | 描述 | HTTP状态码 |
|--------|------|------------|
| `UNAUTHORIZED` | 未授权访问 | 401 |
| `FORBIDDEN` | 权限不足 | 403 |
| `NOT_FOUND` | 资源不存在 | 404 |
| `VALIDATION_ERROR` | 参数验证失败 | 400 |
| `RATE_LIMIT_EXCEEDED` | 请求频率超限 | 429 |
| `INTERNAL_ERROR` | 服务器内部错误 | 500 |

## 限流规则

### API 限流

- **认证接口**: 5次/分钟
- **普通接口**: 100次/分钟
- **文件上传**: 10次/分钟
- **WebSocket**: 1000次/分钟

### 限流响应

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "请求频率超限，请稍后重试",
    "retryAfter": 60
  }
}
```

## SDK 支持

### JavaScript SDK

```javascript
import { MsgNexusClient } from '@msgnexus/sdk-js';

const client = new MsgNexusClient({
  baseURL: 'http://localhost:3030/api/v1',
  token: 'your-jwt-token'
});

// 获取租户列表
const tenants = await client.tenants.list();

// 发送消息
const message = await client.messages.send({
  receiverId: 'receiver-uuid',
  content: 'Hello!',
  type: 'text'
});
```

### Flutter SDK

```dart
import 'package:msgnexus_sdk_flutter/msgnexus_sdk_flutter.dart';

final client = MsgNexusClient(
  baseURL: 'http://localhost:3030/api/v1',
  token: 'your-jwt-token',
);

// 获取用户列表
final users = await client.users.list();

// 发送消息
final message = await client.messages.send(
  receiverId: 'receiver-uuid',
  content: 'Hello!',
  type: 'text',
);
```

---

*本文档提供了 MsgNexus API 的完整参考，包括认证、接口定义、错误处理等内容。* 