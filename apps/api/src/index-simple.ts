const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3030;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'MsgNexus API is running!',
    timestamp: new Date().toISOString()
  });
});

// Mock data
const mockTenants = [
  {
    id: '1',
    name: '示例租户 1',
    domain: 'tenant1.msgnexus.com',
    status: 'active',
    userCount: 25,
    messageCount: 1000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '示例租户 2',
    domain: 'tenant2.msgnexus.com',
    status: 'active',
    userCount: 15,
    messageCount: 500,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
];

const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@msgnexus.com',
    role: 'admin',
    status: 'active',
    lastLoginAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'user1',
    email: 'user1@msgnexus.com',
    role: 'user',
    status: 'active',
    lastLoginAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockMessages = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    content: 'Hello, World!',
    type: 'text',
    status: 'read',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    content: 'Hi there!',
    type: 'text',
    status: 'sent',
    createdAt: '2024-01-01T01:00:00Z'
  }
];

// API Routes
app.get('/api/tenants', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  let filteredTenants = mockTenants;
  if (search) {
    filteredTenants = mockTenants.filter(tenant => 
      tenant.name.toLowerCase().includes(search.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(search.toLowerCase())
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTenants = filteredTenants.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      tenants: paginatedTenants,
      pagination: {
        page,
        limit,
        total: filteredTenants.length,
        pages: Math.ceil(filteredTenants.length / limit)
      }
    }
  });
});

app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const tenantId = req.query.tenantId;

  let filteredUsers = mockUsers;
  if (tenantId) {
    // In real implementation, filter by tenantId
    filteredUsers = mockUsers;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        pages: Math.ceil(filteredUsers.length / limit)
      }
    }
  });
});

app.get('/api/messages', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const userId = req.query.userId;

  let filteredMessages = mockMessages;
  if (userId) {
    filteredMessages = mockMessages.filter(msg => 
      msg.senderId === userId || msg.receiverId === userId
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      messages: paginatedMessages,
      pagination: {
        page,
        limit,
        total: filteredMessages.length,
        pages: Math.ceil(filteredMessages.length / limit)
      }
    }
  });
});

// System endpoints
app.get('/api/system/overview', (req, res) => {
  res.json({
    success: true,
    data: {
      system: {
        cpu: 45.2,
        memory: 68.5,
        disk: 32.1,
        network: {
          in: 1024,
          out: 2048
        }
      },
      services: {
        api: 'running',
        realtime: 'running',
        database: 'running',
        redis: 'running'
      },
      uptime: 86400
    }
  });
});

app.get('/api/system/metrics', (req, res) => {
  const period = req.query.period || '1h';
  
  res.json({
    success: true,
    data: {
      metrics: {
        responseTime: [120, 115, 118, 125],
        errorRate: [0.1, 0.2, 0.1, 0.3],
        throughput: [1000, 1200, 1100, 1300],
        concurrentUsers: [50, 60, 55, 65]
      },
      timestamps: [
        '2024-01-01T00:00:00Z',
        '2024-01-01T01:00:00Z',
        '2024-01-01T02:00:00Z',
        '2024-01-01T03:00:00Z'
      ]
    }
  });
});

// AI endpoints
app.get('/api/ai/config', (req, res) => {
  res.json({
    success: true,
    data: {
      enabled: true,
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7
    }
  });
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join-tenant', (tenantId) => {
    socket.join(`tenant-${tenantId}`);
    console.log(`Client ${socket.id} joined tenant ${tenantId}`);
  });

  socket.on('send-message', (data) => {
    // Broadcast message to tenant room
    socket.to(`tenant-${data.tenantId}`).emit('new-message', data);
    console.log(`Message sent in tenant ${data.tenantId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'API endpoint not found'
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 MsgNexus API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.IO ready for real-time communication`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io }; 