# GoldSky MessageCore - 企业级即时消息平台

## 🚀 项目概述

GoldSky MessageCore 是一个功能完整的企业级即时消息聊天平台，支持多租户、实时通信、AI助手集成等高级功能。

## ✨ 核心特性

- **💬 实时消息传递** - 基于WebSocket的即时通信
- **🏢 多租户支持** - 企业级租户管理系统
- **🤖 AI助手集成** - 智能回复和内容分析
- **📊 实时监控** - 系统状态和性能监控
- **🔐 安全认证** - 完整的用户认证和权限管理
- **📱 跨平台支持** - Web、移动端、Flutter客户端

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin UI      │    │   API Server    │    │  Realtime       │
│   (React)       │◄──►│   (Express)     │◄──►│  (Socket.IO)    │
│   Port: 3000    │    │   Port: 3030    │    │  Port: 3031     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ 技术栈

### 前端技术
- **React 18** - 现代化用户界面框架
- **TypeScript** - 类型安全的开发体验
- **Ant Design** - 企业级UI组件库
- **Socket.IO Client** - 实时通信客户端
- **Framer Motion** - 流畅的动画效果

### 后端技术
- **Node.js** - 高性能JavaScript运行时
- **Express.js** - 灵活的Web应用框架
- **Socket.IO** - 实时双向通信库
- **TypeScript** - 类型安全的后端开发

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 启动所有服务
```bash
npm start
```

### 分别启动服务
```bash
# 启动API服务
npm run start:api

# 启动实时通信服务
npm run start:realtime

# 启动管理界面
npm run start:admin
```

## 🌐 服务访问

| 服务 | 端口 | 访问地址 | 说明 |
|------|------|----------|------|
| **Admin UI** | 3000 | http://localhost:3000 | 管理界面和聊天功能 |
| **API Server** | 3030 | http://localhost:3030 | RESTful API接口 |
| **Realtime Server** | 3031 | http://localhost:3031 | WebSocket实时通信 |

## 📱 客户端集成

### Flutter客户端
```dart
// 连接配置
final socket = IO.io('http://localhost:3031', {
  'transports': ['polling', 'websocket'],
  'query': {
    'tenantId': 'your-tenant-id',
    'userId': 'your-user-id',
    'platform': 'flutter',
    'EIO': '4'
  }
});
```

### Web客户端
```javascript
const socket = io('http://localhost:3031', {
  query: {
    tenantId: 'your-tenant-id',
    userId: 'your-user-id',
    platform: 'web'
  }
});
```

## 🔧 开发指南

### 项目结构
```
mssccore/
├── apps/                    # 应用服务
│   ├── admin/              # 管理界面 (React)
│   ├── api/                # API服务 (Express)
│   └── realtime/           # 实时通信 (Socket.IO)
├── packages/                # 共享包
├── docs/                    # 项目文档
└── scripts/                 # 工具脚本
```

### 构建项目
```bash
# 构建所有服务
npm run build

# 构建特定服务
npm run build:admin
npm run build:api
npm run build:realtime
```

### 测试
```bash
# 运行所有测试
npm test

# 测试聊天功能
node scripts/test-chat.js
```

## 📊 监控和诊断

### 健康检查
```bash
# API服务健康检查
curl http://localhost:3030/health

# 实时服务健康检查
curl http://localhost:3031/health
```

### 诊断端点
- **系统诊断**: http://localhost:3031/diagnostics
- **连接测试**: http://localhost:3031/test-connection
- **监控面板**: http://localhost:3031/monitor
- **日志查看**: http://localhost:3031/logs

## 🔒 安全特性

- **CORS配置** - 跨域请求控制
- **认证机制** - 用户身份验证
- **权限控制** - 基于租户的访问控制
- **输入验证** - 防止恶意输入
- **速率限制** - 防止滥用攻击

## 📈 性能特性

- **连接池管理** - 高效的连接复用
- **消息队列** - 异步消息处理
- **内存优化** - 智能内存管理
- **负载均衡** - 支持水平扩展

## 🚀 部署指南

### 生产环境部署
```bash
# 构建生产版本
npm run build

# 使用PM2管理进程
pm2 start ecosystem.config.js
```

### Docker部署
```bash
# 构建镜像
docker build -t goldsky-messagecore .

# 运行容器
docker run -p 3000:3000 -p 3030:3030 -p 3031:3031 goldsky-messagecore
```

## 📚 文档

- [聊天功能演示指南](docs/CHAT_DEMO.md)
- [平台构建总结](docs/CHAT_PLATFORM_SUMMARY.md)
- [端口配置说明](docs/PORT_CONFIGURATION.md)
- [后端集成指南](docs/BACKEND_INTEGRATION.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- **项目主页**: [GitHub Repository](https://github.com/goldsky/messagecore)
- **问题反馈**: [Issues](https://github.com/goldsky/messagecore/issues)
- **功能讨论**: [Discussions](https://github.com/goldsky/messagecore/discussions)

---

**GoldSky MessageCore** - 构建下一代企业级即时通信平台 🚀 