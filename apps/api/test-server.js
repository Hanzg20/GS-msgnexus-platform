const http = require('http');
const url = require('url');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${new Date().toISOString()} - ${method} ${path}`);

  // 路由处理
  switch (path) {
    case '/health':
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: 'development'
      }));
      break;

    case '/api/test':
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
      }));
      break;

    case '/api/tenants':
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: [
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
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1
        }
      }));
      break;

    case '/api/users':
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: [
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
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1
        }
      }));
      break;

    case '/api/messages':
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: [
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
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1
        }
      }));
      break;

    case '/api/system/overview':
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: {
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
        }
      }));
      break;

    case '/api/ai/config':
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: {
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
        }
      }));
      break;

    default:
      res.writeHead(404);
      res.end(JSON.stringify({
        error: 'Not Found',
        message: `Route ${path} not found`,
        timestamp: new Date().toISOString()
      }));
  }
});

const PORT = process.env.PORT || 3030;

server.listen(PORT, () => {
  console.log(`🚀 Simple Test Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📝 Environment: development`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
}); 