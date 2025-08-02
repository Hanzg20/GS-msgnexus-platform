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

const PORT = process.env.PORT || 3031;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'MsgNexus Real-time Service'
  });
});

// Mock data for real-time events
const mockEvents = [
  {
    id: '1',
    type: 'message',
    tenantId: '1',
    userId: '1',
    data: {
      messageId: 'msg-001',
      content: 'Hello from real-time service!',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: '2',
    type: 'user_status',
    tenantId: '1',
    userId: '2',
    data: {
      status: 'online',
      timestamp: new Date().toISOString()
    }
  }
];

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Join tenant room
  socket.on('join-tenant', (tenantId) => {
    socket.join(`tenant-${tenantId}`);
    console.log(`👥 Client ${socket.id} joined tenant ${tenantId}`);
    
    // Send welcome message
    socket.emit('welcome', {
      message: `Welcome to tenant ${tenantId}`,
      timestamp: new Date().toISOString()
    });
  });

  // Handle message sending
  socket.on('send-message', (data) => {
    console.log(`💬 Message sent in tenant ${data.tenantId}:`, data.content);
    
    // Broadcast message to tenant room
    socket.to(`tenant-${data.tenantId}`).emit('new-message', {
      id: `msg-${Date.now()}`,
      senderId: data.senderId,
      content: data.content,
      timestamp: new Date().toISOString(),
      tenantId: data.tenantId
    });
    
    // Send confirmation to sender
    socket.emit('message-sent', {
      success: true,
      messageId: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  });

  // Handle user status updates
  socket.on('update-status', (data) => {
    console.log(`👤 Status update for user ${data.userId}: ${data.status}`);
    
    // Broadcast status to tenant room
    socket.to(`tenant-${data.tenantId}`).emit('user-status-changed', {
      userId: data.userId,
      status: data.status,
      timestamp: new Date().toISOString()
    });
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    socket.to(`tenant-${data.tenantId}`).emit('user-typing', {
      userId: data.userId,
      isTyping: true,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('typing-stop', (data) => {
    socket.to(`tenant-${data.tenantId}`).emit('user-typing', {
      userId: data.userId,
      isTyping: false,
      timestamp: new Date().toISOString()
    });
  });

  // Handle message read receipts
  socket.on('mark-read', (data) => {
    console.log(`✅ Message ${data.messageId} marked as read by user ${data.userId}`);
    
    socket.to(`tenant-${data.tenantId}`).emit('message-read', {
      messageId: data.messageId,
      userId: data.userId,
      timestamp: new Date().toISOString()
    });
  });

  // Handle system events
  socket.on('system-event', (data) => {
    console.log(`🔧 System event: ${data.type}`);
    
    // Broadcast system event to all clients in tenant
    io.to(`tenant-${data.tenantId}`).emit('system-notification', {
      type: data.type,
      message: data.message,
      severity: data.severity || 'info',
      timestamp: new Date().toISOString()
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
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
      message: 'Endpoint not found'
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 MsgNexus Real-time Service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.IO ready for real-time communication`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io }; 