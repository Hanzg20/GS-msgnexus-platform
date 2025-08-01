# Prisma Schema 协作开发文档

## 🤝 开发者协作状态

**第一个开发者**: 已设置基础 Prisma 配置
**第二个开发者**: 已完成完整数据模型设计

## 📋 设计概述

基于现有的 Feathers.js 架构，我设计了一个完整的多租户消息系统 Schema，包含以下核心模块：

### 1. 多租户系统 (Tenant)
- **功能**: 支持 SaaS 多租户架构
- **关键字段**: 
  - `subdomain`: 子域名支持
  - `apiKey`: API 密钥管理
  - `planType`: 订阅计划类型
  - `settings`: 租户配置 (JSON)

### 2. 用户系统 (User)
- **功能**: 多租户用户管理
- **关键特性**:
  - 租户隔离 (`tenantId`)
  - 外部用户 ID 支持 (`externalUserId`)
  - 唯一约束: `[tenantId, externalUserId]`

### 3. 对话系统 (Conversation + ConversationParticipant)
- **功能**: 支持多种对话类型
- **对话类型**: direct (私聊), group (群聊), channel (频道)
- **参与者管理**: 角色系统 (owner, admin, member)

### 4. 消息系统 (Message)
- **功能**: 完整的消息管理
- **消息类型**: text, image, file, system
- **状态跟踪**: sent, delivered, read, failed
- **回复功能**: 支持消息回复链
- **元数据**: 扩展字段支持

### 5. Webhook 系统 (Webhook)
- **功能**: 事件通知系统
- **事件类型**: message.created, user.joined 等
- **安全**: 密钥验证

### 6. 系统配置 (SystemConfig)
- **功能**: 全局配置管理
- **用途**: 系统级设置存储

## 🔗 关系设计

### 核心关系
```
Tenant (1) ←→ (N) User
Tenant (1) ←→ (N) Conversation  
Tenant (1) ←→ (N) Message
Tenant (1) ←→ (N) Webhook

User (1) ←→ (N) Message
User (N) ←→ (N) Conversation (通过 ConversationParticipant)

Conversation (1) ←→ (N) Message
Message (1) ←→ (N) Message (回复关系)
```

### 级联删除策略
- 租户删除时，级联删除所有相关数据
- 用户删除时，级联删除用户的消息和参与关系
- 对话删除时，级联删除所有消息和参与者

## 📊 索引优化

### 性能索引
- `[tenantId, conversationId, createdAt]` - 消息查询优化
- `[tenantId, email]` - 用户查询优化  
- `[tenantId, type, createdAt]` - 对话查询优化
- `[senderId, createdAt]` - 用户消息历史

## 🚀 下一步协作建议

### 1. 数据库迁移
```bash
# 生成 Prisma 客户端
npx prisma generate

# 创建迁移文件
npx prisma migrate dev --name init-messagecore-schema

# 推送到数据库
npx prisma db push
```

### 2. 需要第一个开发者确认的功能
- [ ] 租户模型设计是否满足需求
- [ ] 对话类型是否完整 (direct/group/channel)
- [ ] 消息状态流转是否合理
- [ ] Webhook 事件类型定义

### 3. 待完善功能
- [ ] 消息附件系统 (File 模型)
- [ ] 用户权限系统 (Permission 模型)
- [ ] 消息搜索索引
- [ ] 审计日志系统 (AuditLog 模型)

### 4. 与 Feathers.js 集成
- [ ] 更新 TypeBox schemas 以匹配 Prisma 模型
- [ ] 创建 Prisma 服务适配器
- [ ] 迁移现有 Knex 数据到 Prisma

## 💡 设计亮点

1. **多租户隔离**: 所有模型都包含 `tenantId`，确保数据隔离
2. **扩展性**: 使用 JSON 字段存储配置和元数据
3. **性能优化**: 合理的索引设计
4. **类型安全**: 完整的 TypeScript 支持
5. **向后兼容**: 保持与现有 Feathers.js 模型的兼容性

## 🔧 开发工具

### Prisma Studio
```bash
npx prisma studio
```

### 数据库重置
```bash
npx prisma migrate reset
```

### 生成类型
```bash
npx prisma generate
```

---

**协作状态**: 等待第一个开发者审查和确认
**最后更新**: 2024-01-XX
**版本**: v1.0.0 