# 🏠 Jinbean 便民应用聊天功能实现方案

## 📋 目录

1. [项目概述](#项目概述)
2. [实现原理](#实现原理)
3. [交互流程图](#交互流程图)
4. [技术栈选择](#技术栈选择)
5. [数据库设计](#数据库设计)
6. [环境配置](#环境配置)
7. [建表脚本](#建表脚本)
8. [数据迁移](#数据迁移)
9. [API集成](#api集成)
10. [测试验证](#测试验证)
11. [部署指南](#部署指南)
12. [监控维护](#监控维护)

## 🎯 项目概述

### 项目背景
Jinbean是一个便民应用，连接服务提供者（Provider）和服务需求者（Customer），通过实时聊天功能实现服务沟通和订单管理。

### 核心功能
- **多角色聊天**：Customer和Provider之间的实时沟通
- **服务匹配**：基于地理位置和需求的服务推荐
- **订单管理**：聊天中的订单创建和状态更新
- **评价系统**：服务完成后的评价和反馈

## 🔬 实现原理

### 1. 系统架构原理

#### 1.1 整体架构
Jinbean聊天系统采用分层架构设计，主要包含以下层次：

```
┌─────────────────────────────────────────────────────────────┐
│                    前端应用层 (Frontend)                      │
├─────────────────────────────────────────────────────────────┤
│  Customer端 (React)  │  Provider端 (React)  │  Admin端 (React) │
│  - 服务浏览         │  - 服务管理          │  - 系统管理       │
│  - 聊天界面         │  - 聊天界面          │  - 用户管理       │
│  - 订单管理         │  - 订单处理          │  - 监控分析       │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    API网关层 (API Gateway)                   │
├─────────────────────────────────────────────────────────────┤
│  Express.js + TypeScript                                    │
│  - 用户认证 (JWT)                                           │
│  - 请求路由 (Router)                                        │
│  - 数据验证 (Joi)                                           │
│  - 速率限制 (Rate Limiting)                                 │
│  - 错误处理 (Error Handling)                                │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    业务逻辑层 (Business Logic)                │
├─────────────────────────────────────────────────────────────┤
│  - 用户服务 (User Service)                                  │
│  - 聊天服务 (Chat Service)                                  │
│  - 服务匹配 (Service Matching)                              │
│  - 订单管理 (Order Management)                              │
│  - 评价系统 (Review System)                                 │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    数据访问层 (Data Access)                   │
├─────────────────────────────────────────────────────────────┤
│  Prisma ORM                                                 │
│  - 数据库连接池                                             │
│  - 查询优化                                                 │
│  - 事务管理                                                 │
│  - 数据迁移                                                 │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    数据存储层 (Data Storage)                  │
├─────────────────────────────────────────────────────────────┤
│  Supabase PostgreSQL  │  Upstash Redis  │  File Storage     │
│  - 用户数据           │  - 会话缓存     │  - 图片文件       │
│  - 服务数据           │  - 消息缓存     │  - 语音文件       │
│  - 订单数据           │  - 实时数据     │  - 文档文件       │
│  - 评价数据           │  - 在线状态     │                   │
└─────────────────────────────────────────────────────────────┘
```

#### 1.2 实时通信原理

**WebSocket连接管理**：
1. **连接建立**：客户端通过WebSocket连接到服务器
2. **身份验证**：使用JWT token进行用户身份验证
3. **房间管理**：用户加入对应的聊天房间
4. **消息传递**：通过房间广播消息给所有参与者
5. **状态同步**：实时同步在线状态和消息状态

**消息流转过程**：
```
Customer发送消息 → WebSocket服务器 → 消息验证 → 数据库存储 → 广播给Provider → Provider接收消息
     ↑                                                                                    ↓
     └─────────────────── 消息确认和状态更新 ─────────────────────────────────────────────┘
```

**消息类型处理**：
- **文本消息**：直接存储和传输
- **图片消息**：上传到文件存储，存储URL
- **语音消息**：转换为音频格式，存储文件路径
- **文件消息**：上传到文件存储，存储元数据
- **系统消息**：系统自动生成，用于通知和状态更新

#### 1.3 服务匹配原理

**地理位置匹配算法**：
1. **距离计算**：使用Haversine公式计算两点间距离
   ```javascript
   function calculateDistance(lat1, lng1, lat2, lng2) {
     const R = 6371; // 地球半径（公里）
     const dLat = (lat2 - lat1) * Math.PI / 180;
     const dLng = (lng2 - lng1) * Math.PI / 180;
     const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
       Math.sin(dLng/2) * Math.sin(dLng/2);
     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     return R * c;
   }
   ```

2. **范围筛选**：根据用户设定的搜索半径筛选服务
3. **评分排序**：按服务评分和评价数量排序
4. **类别过滤**：根据用户需求过滤服务类别

**匹配流程**：
```
用户位置 → 距离计算 → 范围筛选 → 类别过滤 → 评分排序 → 推荐列表
```

**推荐算法优化**：
- **协同过滤**：基于用户行为推荐相似服务
- **内容过滤**：基于服务特征推荐
- **混合推荐**：结合多种推荐策略

#### 1.4 订单管理原理

**订单状态机**：
```
pending (待确认) → confirmed (已确认) → in_progress (进行中) → completed (已完成) → cancelled (已取消)
     ↑                    ↓                    ↓                    ↓
     └── 取消订单 ────────┘                    ↓                    ↓
                         └── 开始服务 ────────┘                    ↓
                                               └── 完成服务 ────────┘
```

**订单创建流程**：
1. **聊天协商**：Customer和Provider在聊天中协商服务细节
2. **订单创建**：Customer在聊天中创建订单
3. **订单确认**：Provider确认订单信息
4. **服务执行**：Provider按约定提供服务
5. **订单完成**：服务完成后标记订单完成
6. **评价反馈**：Customer对服务进行评价

**订单状态转换规则**：
- **pending → confirmed**：Provider确认订单
- **confirmed → in_progress**：Provider开始服务
- **in_progress → completed**：Provider完成服务
- **任意状态 → cancelled**：订单取消（需要双方同意）

#### 1.5 用户认证和授权原理

**JWT认证流程**：
1. **用户登录**：用户提供邮箱和密码
2. **密码验证**：使用bcrypt验证密码
3. **Token生成**：生成JWT访问令牌和刷新令牌
4. **Token存储**：客户端存储token
5. **请求认证**：每次请求携带token
6. **Token验证**：服务器验证token有效性
7. **Token刷新**：访问令牌过期时使用刷新令牌

**权限控制机制**：
- **基于角色的访问控制(RBAC)**：根据用户角色分配权限
- **资源级权限**：用户只能访问自己的资源
- **操作级权限**：不同角色有不同的操作权限

#### 1.6 数据一致性原理

**事务管理**：
- **ACID特性**：确保数据的一致性、完整性、隔离性和持久性
- **分布式事务**：使用Saga模式处理跨服务事务
- **补偿机制**：事务失败时的回滚和补偿

**缓存策略**：
- **Redis缓存**：缓存热点数据和会话信息
- **缓存更新**：数据更新时同步更新缓存
- **缓存失效**：设置合理的缓存过期时间

#### 1.7 性能优化原理

**数据库优化**：
- **索引优化**：为常用查询字段创建索引
- **查询优化**：使用分页和限制查询结果
- **连接池**：复用数据库连接

**前端优化**：
- **虚拟滚动**：大量消息的虚拟滚动显示
- **懒加载**：图片和文件的懒加载
- **缓存策略**：本地缓存和CDN缓存

**网络优化**：
- **消息压缩**：压缩消息内容
- **连接复用**：复用WebSocket连接
- **负载均衡**：多服务器负载均衡

### 2. 数据模型原理

#### 2.1 用户角色设计
- **Customer**：服务需求者，具有发起聊天、创建订单、评价服务的权限
- **Provider**：服务提供者，具有接收聊天、确认订单、提供服务的权限
- **Admin**：系统管理员，具有管理用户、监控系统、处理纠纷的权限

#### 2.2 聊天会话设计
- **一对一聊天**：Customer和Provider之间的直接沟通
- **群组聊天**：多个用户参与的群组讨论
- **系统通知**：系统发送的通知消息

#### 2.3 消息类型设计
- **文本消息**：纯文本内容
- **图片消息**：图片文件
- **语音消息**：语音文件
- **文件消息**：文档文件
- **系统消息**：系统通知
- **订单消息**：订单状态更新

### 3. 安全机制原理

#### 3.1 身份认证
- **JWT Token**：无状态的用户身份认证
- **Token刷新**：定期刷新访问令牌
- **权限控制**：基于角色的访问控制

#### 3.2 数据安全
- **传输加密**：HTTPS/WSS加密传输
- **存储加密**：敏感数据加密存储
- **输入验证**：防止SQL注入和XSS攻击

#### 3.3 速率限制
- **API限流**：防止API滥用
- **消息限流**：防止消息轰炸
- **连接限流**：防止连接滥用

## 🔄 交互流程图

### 1. 用户注册和登录流程

```mermaid
sequenceDiagram
    participant C as Customer
    participant P as Provider
    participant A as API Server
    participant D as Database

    C->>A: 注册请求 (email, password, userType)
    A->>D: 检查用户是否存在
    D-->>A: 用户不存在
    A->>D: 创建用户记录
    D-->>A: 用户创建成功
    A-->>C: 注册成功响应

    P->>A: 登录请求 (email, password)
    A->>D: 验证用户凭据
    D-->>A: 用户验证成功
    A->>A: 生成JWT Token
    A-->>P: 登录成功响应 (token)
```

### 2. 服务匹配和聊天发起流程

```mermaid
sequenceDiagram
    participant C as Customer
    participant A as API Server
    participant D as Database
    participant P as Provider
    participant W as WebSocket

    C->>A: 获取附近服务 (location, radius, category)
    A->>D: 查询附近服务提供者
    D-->>A: 返回服务列表
    A-->>C: 返回服务推荐

    C->>A: 发起聊天请求 (targetUserId, serviceId)
    A->>D: 检查是否已存在聊天
    alt 聊天不存在
        A->>D: 创建新聊天会话
        A->>D: 添加参与者
    else 聊天已存在
        A->>D: 获取现有聊天
    end
    A-->>C: 返回聊天信息

    C->>W: 加入聊天房间
    P->>W: 加入聊天房间
    C->>W: 发送消息
    W->>D: 保存消息
    W->>P: 广播消息
```

### 3. 订单创建和管理流程

```mermaid
sequenceDiagram
    participant C as Customer
    participant P as Provider
    participant A as API Server
    participant D as Database
    participant W as WebSocket

    C->>A: 创建订单请求 (serviceId, details)
    A->>D: 验证服务信息
    A->>D: 创建订单记录
    A->>W: 发送订单通知
    W->>P: 推送订单通知
    A-->>C: 订单创建成功

    P->>A: 确认订单请求 (orderId)
    A->>D: 更新订单状态为confirmed
    A->>W: 发送状态更新通知
    W->>C: 推送状态更新
    A-->>P: 订单确认成功

    P->>A: 开始服务请求 (orderId)
    A->>D: 更新订单状态为in_progress
    A->>W: 发送状态更新通知
    W->>C: 推送状态更新

    P->>A: 完成服务请求 (orderId)
    A->>D: 更新订单状态为completed
    A->>W: 发送状态更新通知
    W->>C: 推送状态更新
    A-->>P: 服务完成成功

    C->>A: 评价服务请求 (orderId, rating, comment)
    A->>D: 保存评价记录
    A->>D: 更新服务评分
    A-->>C: 评价提交成功
```

### 4. 实时消息通信流程

```mermaid
sequenceDiagram
    participant C as Customer
    participant W as WebSocket Server
    participant D as Database
    participant P as Provider

    C->>W: 连接WebSocket (token)
    W->>W: 验证token
    W->>W: 加入用户房间
    W-->>C: 连接成功

    P->>W: 连接WebSocket (token)
    W->>W: 验证token
    W->>W: 加入用户房间
    W-->>P: 连接成功

    C->>W: 发送消息 (conversationId, content)
    W->>D: 保存消息到数据库
    W->>W: 广播消息到聊天房间
    W->>P: 推送消息给Provider

    P->>W: 发送消息 (conversationId, content)
    W->>D: 保存消息到数据库
    W->>W: 广播消息到聊天房间
    W->>C: 推送消息给Customer

    C->>W: 标记消息已读
    W->>D: 更新消息状态
    W->>P: 推送已读状态
```

### 5. 服务匹配和推荐流程

```mermaid
flowchart TD
    A[用户请求服务] --> B{用户类型}
    B -->|Customer| C[获取用户位置]
    B -->|Provider| D[获取服务列表]
    
    C --> E[计算附近服务]
    E --> F[按距离筛选]
    F --> G[按类别过滤]
    G --> H[按评分排序]
    H --> I[返回推荐列表]
    
    D --> J[获取Provider服务]
    J --> K[按状态筛选]
    K --> L[按类别分组]
    L --> M[返回服务列表]
    
    I --> N[显示服务卡片]
    M --> O[显示服务管理]
    
    N --> P[点击服务]
    O --> Q[编辑服务]
    
    P --> R[发起聊天]
    Q --> S[更新服务信息]
```

### 6. 系统监控和告警流程

```mermaid
sequenceDiagram
    participant S as System Monitor
    participant A as API Server
    participant D as Database
    participant N as Notification Service
    participant U as User

    S->>A: 健康检查
    A-->>S: 健康状态响应
    
    S->>D: 数据库连接检查
    D-->>S: 连接状态响应
    
    alt 系统异常
        S->>N: 发送告警通知
        N->>U: 推送告警消息
    end
    
    S->>S: 记录监控数据
    S->>S: 生成监控报告
```

### 7. 文件上传和处理流程

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Server
    participant S as Storage Service
    participant D as Database

    U->>F: 选择文件
    F->>F: 文件验证 (大小、类型)
    F->>A: 上传文件请求
    A->>S: 存储文件
    S-->>A: 返回文件URL
    A->>D: 保存文件记录
    A-->>F: 返回文件信息
    F->>U: 显示上传成功
```

### 8. 支付和订单完成流程

```mermaid
sequenceDiagram
    participant C as Customer
    participant A as API Server
    participant P as Payment Gateway
    participant D as Database
    participant W as WebSocket

    C->>A: 发起支付请求 (orderId, amount)
    A->>D: 验证订单信息
    A->>P: 创建支付订单
    P-->>A: 返回支付链接
    A-->>C: 返回支付链接

    C->>P: 完成支付
    P->>A: 支付成功回调
    A->>D: 更新订单状态
    A->>W: 发送支付成功通知
    W->>C: 推送支付成功消息
```

### 9. 用户评价和反馈流程

```mermaid
sequenceDiagram
    participant C as Customer
    participant A as API Server
    participant D as Database
    participant P as Provider
    participant W as WebSocket

    C->>A: 提交评价 (orderId, rating, comment)
    A->>D: 验证订单状态
    A->>D: 保存评价记录
    A->>D: 更新服务评分
    A->>W: 发送评价通知
    W->>P: 推送评价消息
    A-->>C: 评价提交成功

    P->>A: 查看评价列表
    A->>D: 查询评价数据
    D-->>A: 返回评价列表
    A-->>P: 返回评价信息
```

### 10. 系统备份和恢复流程

```mermaid
flowchart TD
    A[定时备份任务] --> B[数据库备份]
    B --> C[文件备份]
    C --> D[配置备份]
    D --> E[备份验证]
    E --> F{备份成功?}
    F -->|是| G[备份完成]
    F -->|否| H[备份失败告警]
    H --> I[重试备份]
    I --> B
    
    G --> J[备份文件存储]
    J --> K[备份记录更新]
    K --> L[备份完成通知]
```

### 11. 错误处理和恢复流程

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Server
    participant D as Database
    participant L as Logger

    U->>F: 用户操作
    F->>A: API请求
    A->>D: 数据库操作
    
    alt 操作成功
        D-->>A: 返回数据
        A-->>F: 返回结果
        F->>U: 显示成功
    else 操作失败
        D-->>A: 返回错误
        A->>L: 记录错误日志
        A-->>F: 返回错误信息
        F->>U: 显示错误提示
    end
```

### 12. 性能监控和优化流程

```mermaid
flowchart TD
    A[性能监控] --> B[收集指标]
    B --> C[分析性能]
    C --> D{性能正常?}
    D -->|是| E[继续监控]
    D -->|否| F[性能告警]
    F --> G[分析问题]
    G --> H[制定优化方案]
    H --> I[实施优化]
    I --> J[验证效果]
    J --> K{优化成功?}
    K -->|是| E
    K -->|否| H
```

## 📊 实现原理和交互图总结

### 实现原理的重要性

1. **技术选型依据**：
   - 实现原理为技术选型提供了理论基础
   - 帮助理解系统架构设计的合理性
   - 为后续优化提供方向指导

2. **开发指导**：
   - 为开发团队提供清晰的技术路线
   - 帮助理解各个模块的职责和边界
   - 为代码实现提供设计思路

3. **问题排查**：
   - 当系统出现问题时，实现原理帮助快速定位
   - 为性能优化提供理论依据
   - 为系统扩展提供指导

### 交互图的价值

1. **流程可视化**：
   - 直观展示系统各个组件之间的交互
   - 帮助理解业务流程和数据流转
   - 为测试用例设计提供参考

2. **团队协作**：
   - 为产品、开发、测试团队提供共同语言
   - 帮助新团队成员快速理解系统
   - 为需求变更提供影响分析

3. **系统设计**：
   - 帮助发现系统设计中的潜在问题
   - 为系统优化提供改进方向
   - 为系统扩展提供设计参考

### 关键设计原则

1. **高可用性**：
   - 系统设计考虑容错和恢复机制
   - 关键服务采用冗余设计
   - 监控和告警机制完善

2. **可扩展性**：
   - 模块化设计，支持水平扩展
   - 数据库设计考虑分片和读写分离
   - 缓存策略支持分布式部署

3. **安全性**：
   - 用户认证和授权机制完善
   - 数据传输和存储加密
   - 输入验证和防护措施

4. **性能优化**：
   - 数据库查询优化
   - 缓存策略合理
   - 前端性能优化

### 技术实现要点

1. **实时通信**：
   - WebSocket连接管理
   - 消息队列和广播机制
   - 在线状态同步

2. **数据一致性**：
   - 事务管理
   - 分布式锁机制
   - 数据同步策略

3. **用户体验**：
   - 响应式设计
   - 离线支持
   - 消息推送

4. **运维支持**：
   - 监控和日志
   - 备份和恢复
   - 部署和发布

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

# ==================== Redis配置 - Upstash Redis (推荐) ====================
REDIS_URL=redis://default:[YOUR-PASSWORD]@[YOUR-REGION].upstash.io:[PORT]
# 或者使用 Redis Cloud
# REDIS_URL=redis://default:[YOUR-PASSWORD]@[YOUR-ENDPOINT]:[PORT]

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

## 🚀 实现方案

### 1. 数据库设计

#### 1.1 用户表扩展
```sql
-- 用户表扩展字段
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN user_type VARCHAR(20) NOT NULL DEFAULT 'customer';
ALTER TABLE users ADD COLUMN location JSONB;
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';

-- 创建索引
CREATE INDEX idx_users_tenant_type ON users(tenant_id, user_type);
CREATE INDEX idx_users_location ON users USING GIN(location);
```

#### 1.2 服务表
```sql
-- 服务表
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CNY',
    location JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    images TEXT[],
    tags TEXT[],
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_services_tenant_category_status ON services(tenant_id, category, status);
CREATE INDEX idx_services_provider_status ON services(provider_id, status);
CREATE INDEX idx_services_location ON services USING GIN(location);
```

#### 1.3 订单表
```sql
-- 订单表
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id),
    service_id UUID REFERENCES services(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    service_details JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CNY',
    scheduled_time TIMESTAMP WITH TIME ZONE,
    completed_time TIMESTAMP WITH TIME ZONE,
    customer_address JSONB,
    provider_address JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_orders_tenant_status_created ON orders(tenant_id, status, created_at);
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
CREATE INDEX idx_orders_provider_status ON orders(provider_id, status);
```

### 2. API设计

#### 2.1 聊天相关API

```typescript
// 聊天API路由
// apps/api/src/routes/chat.ts

import { Router } from 'express';
import { getPrismaClient } from '../utils/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = getPrismaClient();

// 获取用户聊天列表
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId
          }
        },
        isActive: true
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                userType: true
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: Number(limit)
    });
    
    res.json({
      success: true,
      data: conversations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: await prisma.conversation.count({
          where: {
            participants: {
              some: {
                userId: userId
              }
            },
            isActive: true
          }
        })
      }
    });
  } catch (error) {
    console.error('获取聊天列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取聊天列表失败'
    });
  }
});

// 创建或获取聊天
router.post('/conversations', authenticateToken, async (req, res) => {
  try {
    const { targetUserId, serviceId, orderId } = req.body;
    const currentUserId = req.user.id;
    
    // 检查是否已存在聊天
    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            userId: {
              in: [currentUserId, targetUserId]
            }
          }
        },
        type: 'service',
        isActive: true
      },
      include: {
        participants: true
      }
    });
    
    if (!conversation) {
      // 创建新聊天
      conversation = await prisma.conversation.create({
        data: {
          tenantId: req.user.tenantId,
          type: 'service',
          name: `服务咨询`,
          metadata: {
            serviceId,
            orderId
          },
          participants: {
            create: [
              {
                userId: currentUserId,
                role: req.user.userType
              },
              {
                userId: targetUserId,
                role: 'provider' // 假设目标用户是provider
              }
            ]
          }
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  displayName: true,
                  avatarUrl: true,
                  userType: true
                }
              }
            }
          }
        }
      });
    }
    
    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('创建聊天失败:', error);
    res.status(500).json({
      success: false,
      message: '创建聊天失败'
    });
  }
});

// 获取聊天消息
router.get('/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;
    
    // 验证用户是否参与此聊天
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId
      }
    });
    
    if (!participant) {
      return res.status(403).json({
        success: false,
        message: '无权访问此聊天'
      });
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            userType: true
          }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                displayName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: Number(limit)
    });
    
    // 更新最后阅读时间
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId
        }
      },
      data: {
        lastReadAt: new Date()
      }
    });
    
    res.json({
      success: true,
      data: messages.reverse(),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: await prisma.message.count({
          where: {
            conversationId
          }
        })
      }
    });
  } catch (error) {
    console.error('获取消息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取消息失败'
    });
  }
});

// 发送消息
router.post('/conversations/:conversationId/messages', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, messageType = 'text', replyToId } = req.body;
    const senderId = req.user.id;
    
    // 验证用户是否参与此聊天
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId: senderId
      }
    });
    
    if (!participant) {
      return res.status(403).json({
        success: false,
        message: '无权发送消息到此聊天'
      });
    }
    
    const message = await prisma.message.create({
      data: {
        tenantId: req.user.tenantId,
        conversationId,
        senderId,
        messageType,
        content,
        replyToId,
        status: 'sent'
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            userType: true
          }
        }
      }
    });
    
    // 更新对话最后更新时间
    await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        updatedAt: new Date()
      }
    });
    
    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({
      success: false,
      message: '发送消息失败'
    });
  }
});

export default router;
```

#### 2.2 服务匹配API

```typescript
// 服务匹配API
// apps/api/src/routes/services.ts

import { Router } from 'express';
import { getPrismaClient } from '../utils/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = getPrismaClient();

// 获取附近的服务提供者
router.get('/nearby', authenticateToken, async (req, res) => {
  try {
    const { lat, lng, radius = 10, category, limit = 20 } = req.query;
    const userId = req.user.id;
    
    // 获取用户位置
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { location: true }
    });
    
    const userLocation = user?.location || { lat: Number(lat), lng: Number(lng) };
    
    // 查询附近的服务
    const services = await prisma.service.findMany({
      where: {
        tenantId: req.user.tenantId,
        status: 'active',
        provider: {
          isActive: true
        },
        ...(category && { category: String(category) })
      },
      include: {
        provider: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            rating: true
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      },
      take: Number(limit)
    });
    
    // 计算距离并过滤
    const nearbyServices = services.filter(service => {
      const serviceLocation = service.location as any;
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        serviceLocation.lat,
        serviceLocation.lng
      );
      return distance <= Number(radius);
    });
    
    res.json({
      success: true,
      data: nearbyServices
    });
  } catch (error) {
    console.error('获取附近服务失败:', error);
    res.status(500).json({
      success: false,
      message: '获取附近服务失败'
    });
  }
});

// 计算距离的辅助函数
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;
```

### 3. 前端实现

#### 3.1 聊天组件

```typescript
// apps/admin/src/components/JinbeanChat.tsx

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../services/api';

interface Message {
  id: string;
  content: any;
  messageType: string;
  sender: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    userType: string;
  };
  createdAt: string;
  replyTo?: {
    id: string;
    content: any;
    sender: {
      displayName: string;
    };
  };
}

interface Conversation {
  id: string;
  name: string;
  type: string;
  participants: Array<{
    user: {
      id: string;
      displayName: string;
      avatarUrl?: string;
      userType: string;
    };
    role: string;
    lastReadAt?: string;
  }>;
  messages: Message[];
  _count: {
    messages: number;
  };
}

const JinbeanChat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取聊天列表
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/v1/chat/conversations');
      if (response.data) {
        setConversations(response.data.data || []);
      }
    } catch (error) {
      console.error('获取聊天列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取消息
  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await apiClient.get(`/api/v1/chat/conversations/${conversationId}/messages`);
      if (response.data) {
        setMessages(response.data.data || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error('获取消息失败:', error);
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversation) return;

    try {
      const response = await apiClient.post(`/api/v1/chat/conversations/${currentConversation.id}/messages`, {
        content: { text: newMessage },
        messageType: 'text'
      });

      if (response.data) {
        setMessages(prev => [...prev, response.data.data]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 选择对话
  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation.id);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 聊天列表 */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">聊天列表</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                currentConversation?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => selectConversation(conversation)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {conversation.participants[0]?.user.displayName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{conversation.name}</h3>
                  <p className="text-sm text-gray-500">
                    {conversation.messages[0]?.content.text || '暂无消息'}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {conversation._count.messages} 条消息
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 聊天窗口 */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* 聊天头部 */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentConversation.participants[0]?.user.displayName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{currentConversation.name}</h3>
                  <p className="text-sm text-gray-500">
                    {currentConversation.participants.map(p => p.user.displayName).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender.userType === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender.userType === 'customer'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {message.sender.displayName}
                    </div>
                    <div>{message.content.text}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 消息输入 */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="输入消息..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  发送
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">选择聊天</h3>
              <p className="text-gray-500">从左侧列表中选择一个聊天开始对话</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JinbeanChat;
```

### 4. 实时通信

#### 4.1 WebSocket集成

```typescript
// apps/api/src/services/socket.ts

import { Server } from 'socket.io';
import { getPrismaClient } from '../utils/database';

const prisma = getPrismaClient();

export function setupSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('用户连接:', socket.id);

    // 用户加入聊天
    socket.on('join-conversation', async (data) => {
      const { conversationId, userId } = data;
      
      // 验证用户是否参与此聊天
      const participant = await prisma.conversationParticipant.findFirst({
        where: {
          conversationId,
          userId
        }
      });

      if (participant) {
        socket.join(`conversation-${conversationId}`);
        socket.join(`user-${userId}`);
        console.log(`用户 ${userId} 加入聊天 ${conversationId}`);
      }
    });

    // 发送消息
    socket.on('send-message', async (data) => {
      const { conversationId, content, messageType, senderId } = data;

      try {
        // 保存消息到数据库
        const message = await prisma.message.create({
          data: {
            tenantId: data.tenantId,
            conversationId,
            senderId,
            messageType,
            content,
            status: 'sent'
          },
          include: {
            sender: {
              select: {
                id: true,
                displayName: true,
                avatarUrl: true,
                userType: true
              }
            }
          }
        });

        // 广播消息给聊天室的所有用户
        io.to(`conversation-${conversationId}`).emit('new-message', message);

        // 更新对话最后更新时间
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });

      } catch (error) {
        console.error('发送消息失败:', error);
        socket.emit('message-error', { error: '发送消息失败' });
      }
    });

    // 用户正在输入
    socket.on('typing', (data) => {
      const { conversationId, userId, isTyping } = data;
      socket.to(`conversation-${conversationId}`).emit('user-typing', {
        userId,
        isTyping
      });
    });

    // 用户断开连接
    socket.on('disconnect', () => {
      console.log('用户断开连接:', socket.id);
    });
  });
}
```

## 🎯 使用场景

### 1. Customer端使用流程

1. **浏览服务**
   - 查看附近的服务提供者
   - 筛选服务类别和价格
   - 查看服务评价和详情

2. **发起聊天**
   - 点击"联系服务商"按钮
   - 自动创建聊天会话
   - 发送服务需求描述

3. **沟通协商**
   - 实时聊天沟通服务细节
   - 发送图片和语音消息
   - 协商价格和服务时间

4. **确认订单**
   - 在聊天中创建订单
   - 确认服务时间和地点
   - 支付服务费用

5. **服务评价**
   - 服务完成后进行评价
   - 上传服务照片
   - 提供详细反馈

### 2. Provider端使用流程

1. **服务管理**
   - 创建和编辑服务信息
   - 设置服务价格和范围
   - 管理服务状态

2. **接收咨询**
   - 接收Customer的聊天请求
   - 查看服务需求详情
   - 及时回复客户咨询

3. **服务协商**
   - 与Customer沟通服务细节
   - 提供专业建议
   - 协商服务价格

4. **订单处理**
   - 确认订单信息
   - 安排服务时间
   - 提供服务

5. **完成服务**
   - 标记订单完成
   - 请求客户评价
   - 维护客户关系

## 🔧 部署配置

### 1. 环境变量

```bash
# Jinbean专用配置
JINBEAN_APP_NAME=Jinbean便民服务
JINBEAN_DEFAULT_RADIUS=10
JINBEAN_MAX_MESSAGE_LENGTH=1000
JINBEAN_FILE_UPLOAD_SIZE=10485760

# 服务类别配置
JINBEAN_SERVICE_CATEGORIES=家政,维修,配送,教育,医疗,美容,其他
```

### 2. 数据库迁移

```bash
# 运行Jinbean专用迁移
cd backend/prisma
npx prisma migrate dev --name jinbean-init
npx ts-node ../../scripts/migrate-jinbean-data.ts
```

## 📊 监控指标

### 1. 业务指标
- 日活跃用户数
- 聊天消息数量
- 订单转化率
- 服务完成率
- 用户满意度

### 2. 技术指标
- 消息发送成功率
- 实时连接数
- 响应时间
- 错误率
- 系统可用性

## 🚀 下一步计划

1. **功能完善**
   - 语音消息支持
   - 视频通话功能
   - 文件传输优化
   - 消息搜索功能

2. **性能优化**
   - 消息分页加载
   - 图片压缩处理
   - 缓存策略优化
   - 数据库索引优化

3. **用户体验**
   - 消息提醒功能
   - 在线状态显示
   - 消息已读状态
   - 表情包支持

4. **安全加固**
   - 消息加密传输
   - 敏感信息过滤
   - 用户身份验证
   - 数据隐私保护

---

**文档版本**: 1.0.0  
**最后更新**: 2024-01-20  
**维护者**: Jinbean开发团队 