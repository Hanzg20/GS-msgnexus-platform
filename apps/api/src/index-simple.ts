import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

// 基础中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 简单的日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// 租户测试路由
app.get('/api/tenants', (req, res) => {
  const mockTenants = [
    {
      id: '1',
      name: 'GoldSky Corp',
      subdomain: 'goldsky',
      planType: 'enterprise',
      status: 'active',
      userCount: 150,
      messageCount: 50000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Tech Startup',
      subdomain: 'techstartup',
      planType: 'pro',
      status: 'active',
      userCount: 25,
      messageCount: 15000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: mockTenants,
    pagination: {
      page: 1,
      limit: 20,
      total: mockTenants.length,
      pages: 1
    }
  });
});

// 用户测试路由
app.get('/api/users', (req, res) => {
  const mockUsers = [
    {
      id: '1',
      email: 'admin@goldsky.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      status: 'active',
      tenantId: '1',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'user@goldsky.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'user',
      status: 'active',
      tenantId: '1',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: mockUsers,
    pagination: {
      page: 1,
      limit: 20,
      total: mockUsers.length,
      pages: 1
    }
  });
});

// 消息测试路由
app.get('/api/messages', (req, res) => {
  const mockMessages = [
    {
      id: '1',
      content: 'Hello world',
      type: 'text',
      conversationId: 'conv1',
      senderId: 'user1',
      senderName: 'John Doe',
      status: 'delivered',
      timestamp: new Date().toISOString(),
      metadata: {
        mentions: [],
        tags: []
      }
    },
    {
      id: '2',
      content: 'How are you?',
      type: 'text',
      conversationId: 'conv1',
      senderId: 'user2',
      senderName: 'Jane Smith',
      status: 'delivered',
      timestamp: new Date().toISOString(),
      metadata: {
        mentions: [],
        tags: []
      }
    }
  ];

  res.json({
    success: true,
    data: mockMessages,
    pagination: {
      page: 1,
      limit: 20,
      total: mockMessages.length,
      pages: 1
    }
  });
});

// 系统监控测试路由
app.get('/api/system/overview', (req, res) => {
  const mockOverview = {
    status: 'healthy',
    uptime: 86400,
    version: '1.0.0',
    environment: 'development',
    timestamp: new Date().toISOString(),
    services: {
      api: { status: 'healthy', responseTime: 120 },
      realtime: { status: 'healthy', connections: 150 },
      database: { status: 'healthy', connections: 25 },
      redis: { status: 'healthy', memory: '512MB' }
    },
    metrics: {
      totalUsers: 1500,
      totalMessages: 50000,
      totalTenants: 25,
      activeConnections: 150,
      messageRate: 100
    }
  };

  res.json({
    success: true,
    data: mockOverview
  });
});

// AI 服务测试路由
app.get('/api/ai/config', (req, res) => {
  const aiConfig = {
    tenantId: '1',
    enabled: true,
    model: 'gpt-3.5-turbo',
    features: {
      chat: true,
      analysis: true,
      suggestions: true,
      moderation: true,
      translation: true,
      summarization: true
    },
    limits: {
      maxTokens: 1000,
      requestsPerMinute: 60,
      maxConversationLength: 50
    },
    settings: {
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0
    },
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    data: aiConfig
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message || 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Simple API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app }; 