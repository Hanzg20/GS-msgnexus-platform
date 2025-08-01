import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';

// 创建Express应用
const app = express();
const server = createServer(app);

// 中间件
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:4000",
  credentials: true
}));

// 创建Socket.IO服务器
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:4000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 存储连接的客户端
const connectedClients = new Map();

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    connections: connectedClients.size
  });
});

// 统计信息端点
app.get('/stats', (req, res) => {
  res.json({
    totalConnections: connectedClients.size,
    activeRooms: io.sockets.adapter.rooms.size,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Socket.IO连接处理
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  connectedClients.set(socket.id, {
    id: socket.id,
    connectedAt: new Date(),
    rooms: []
  });

  // 加入房间
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    const client = connectedClients.get(socket.id);
    if (client) {
      client.rooms.push(roomId);
    }
    console.log(`Client ${socket.id} joined room: ${roomId}`);
    
    // 通知房间内其他用户
    socket.to(roomId).emit('user-joined', {
      userId: socket.id,
      roomId: roomId,
      timestamp: new Date().toISOString()
    });
  });

  // 发送消息
  socket.on('send-message', (data: {
    roomId: string;
    message: string;
    userId: string;
    userName?: string;
  }) => {
    const messageData = {
      id: Date.now().toString(),
      roomId: data.roomId,
      message: data.message,
      userId: data.userId,
      userName: data.userName || 'Anonymous',
      timestamp: new Date().toISOString()
    };

    // 广播消息到房间
    io.to(data.roomId).emit('new-message', messageData);
    console.log(`Message sent to room ${data.roomId}: ${data.message}`);
  });

  // 离开房间
  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId);
    const client = connectedClients.get(socket.id);
    if (client) {
      client.rooms = client.rooms.filter((room: string) => room !== roomId);
    }
    console.log(`Client ${socket.id} left room: ${roomId}`);
    
    // 通知房间内其他用户
    socket.to(roomId).emit('user-left', {
      userId: socket.id,
      roomId: roomId,
      timestamp: new Date().toISOString()
    });
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    connectedClients.delete(socket.id);
  });

  // 错误处理
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// 启动服务器
const PORT = process.env.REALTIME_PORT || 3031;

server.listen(PORT, () => {
  console.log(`🚀 Real-time server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Stats: http://localhost:${PORT}/stats`);
  console.log(`🔗 WebSocket: ws://localhost:${PORT}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Real-time server terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Real-time server terminated');
    process.exit(0);
  });
}); 