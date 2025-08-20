import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { logger } from './utils/logger';
import dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();
// 创建Express应用
const app = express();
const server = createServer(app);

// 中间件
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://10.0.0.243:3000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// 创建Socket.IO服务器
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:4000",
      "http://127.0.0.1:4000", 
      "http://10.0.0.243:4000",
      "http://10.0.0.243:*"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "User-Agent"]
  },
  transports: ['polling', 'websocket'], // 优先polling，然后升级到websocket
  allowEIO3: true, // 允许EIO 3客户端
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6
});

// 存储连接的客户端
const connectedClients = new Map<string, { id: string; connectedAt: Date; rooms: string[]; tenantId?: string; userId?: string }>();

// 简易内存消息存储（按租户，保留最近 200 条）
const tenantMessages = new Map<string, Array<{ id: string; tenantId: string; senderId: string; content: string; timestamp: string }>>();

function getTenantRoom(tenantId: string) {
  return `tenant:${tenantId}`;
}

function saveMessage(msg: { id: string; tenantId: string; senderId: string; content: string; timestamp: string }) {
  const list = tenantMessages.get(msg.tenantId) || [];
  list.push(msg);
  if (list.length > 200) list.shift();
  tenantMessages.set(msg.tenantId, list);
}

// 诊断端点
app.get('/diagnostics', (req, res) => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    server: {
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version
    },
    socket: {
      connections: io.engine.clientsCount,
      rooms: Array.from(io.sockets.adapter.rooms.keys()),
      transportTypes: io.engine.clientsCount > 0 ? 
        Array.from(io.sockets.sockets.values()).map(s => s.conn.transport.name) : []
    },
    cors: {
      origin: [
        "http://localhost:4000",
        "http://127.0.0.1:4000", 
        "http://10.0.0.243:4000",
        "http://10.0.0.243:*"
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
    },
    clients: Array.from(connectedClients.values()).map(client => ({
      id: client.id,
      tenantId: client.tenantId,
      userId: client.userId,
      connectedAt: client.connectedAt,
      rooms: client.rooms
    }))
  };
  
  res.json(diagnostics);
});

// 连接测试端点
app.get('/test-connection', (req, res) => {
  const { tenantId, userId, platform } = req.query;
  
  if (!tenantId || !userId || !platform) {
    res.status(400).json({
      error: 'Missing required parameters',
      required: ['tenantId', 'userId', 'platform'],
      received: req.query
    });
    return;
  }
  
  res.json({
    status: 'ready',
    message: 'Connection test endpoint ready',
    params: { tenantId, userId, platform },
    timestamp: new Date().toISOString(),
    serverInfo: {
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime()
    }
  });
});

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

// 日志查看端点
app.get('/logs', (req, res) => {
  const { level, event, limit = 100, offset = 0 } = req.query;
  
  try {
    const logStats = logger.getLogStats();
    
    if (fs.existsSync(logger.getLogFilePath())) {
      const content = fs.readFileSync(logger.getLogFilePath(), 'utf8');
      let lines = content.split('\n').filter(line => line.trim());
      
      // 过滤日志
      if (level) {
        lines = lines.filter(line => {
          try {
            const logEntry = JSON.parse(line);
            return logEntry.level === level;
          } catch {
            return false;
          }
        });
      }
      
      if (event) {
        lines = lines.filter(line => {
          try {
            const logEntry = JSON.parse(line);
            return logEntry.event === event;
          } catch {
            return false;
          }
        });
      }
      
      // 分页
      const totalLines = lines.length;
      const paginatedLines = lines.slice(Number(offset), Number(offset) + Number(limit));
      
      // 解析日志条目
      const logs = paginatedLines.map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return { raw: line };
        }
      });
      
      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            total: totalLines,
            limit: Number(limit),
            offset: Number(offset),
            hasMore: Number(offset) + Number(limit) < totalLines
          },
          stats: logStats
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          logs: [],
          pagination: { total: 0, limit: Number(limit), offset: Number(offset), hasMore: false },
          stats: logStats
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// WebSocket监控面板
app.get('/monitor', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WebSocket监控面板</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status { padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid; }
        .connected { background: #d4edda; color: #155724; border-left-color: #28a745; }
        .disconnected { background: #f8d7da; color: #721c24; border-left-color: #dc3545; }
        .info { background: #d1ecf1; color: #0c5460; border-left-color: #17a2b8; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card h3 { margin-top: 0; color: #333; }
        .metric { font-size: 24px; font-weight: bold; color: #007bff; }
        .refresh-btn { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
        .refresh-btn:hover { background: #0056b3; }
        .log { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 15px; max-height: 300px; overflow-y: auto; }
        .log-entry { margin: 5px 0; padding: 5px; border-radius: 3px; }
        .log-info { background: #e7f3ff; }
        .log-error { background: #ffe7e7; color: #d32f2f; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔌 WebSocket连接监控面板</h1>
          <p>实时监控MsgNexus平台的WebSocket连接状态</p>
          <button class="refresh-btn" onclick="refreshData()">🔄 刷新数据</button>
        </div>
        
        <div class="grid">
          <div class="card">
            <h3>📊 连接统计</h3>
            <div class="status connected">
              <div class="metric" id="totalConnections">-</div>
              <div>活跃连接数</div>
            </div>
            <div class="status info">
              <div class="metric" id="activeRooms">-</div>
              <div>活跃房间数</div>
            </div>
            <div class="status info">
              <div class="metric" id="uptime">-</div>
              <div>运行时间(秒)</div>
            </div>
          </div>
          
          <div class="card">
            <h3>🌐 服务器信息</h3>
            <div class="status info">
              <div>版本: <span id="version">-</span></div>
              <div>环境: <span id="environment">-</span></div>
              <div>平台: <span id="platform">-</span></div>
              <div>Node版本: <span id="nodeVersion">-</span></div>
            </div>
          </div>
          
          <div class="card">
            <h3>🔐 认证配置</h3>
            <div class="status info">
              <div>允许的源: <span id="allowedOrigins">-</span></div>
              <div>传输方式: <span id="transports">-</span></div>
              <div>EIO版本: <span id="eioVersions">-</span></div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h3>📝 实时日志</h3>
          <div class="log" id="logContainer">
            <div class="log-entry log-info">监控面板已启动，等待连接事件...</div>
          </div>
        </div>
      </div>
      
      <script>
        function refreshData() {
          fetch('/stats')
            .then(res => res.json())
            .then(data => {
              document.getElementById('totalConnections').textContent = data.totalConnections;
              document.getElementById('activeRooms').textContent = data.activeRooms;
              document.getElementById('uptime').textContent = Math.floor(data.uptime);
            });
          
          fetch('/diagnostics')
            .then(res => res.json())
            .then(data => {
              document.getElementById('version').textContent = data.server.version;
              document.getElementById('platform').textContent = data.server.platform;
              document.getElementById('nodeVersion').textContent = data.server.nodeVersion;
              document.getElementById('allowedOrigins').textContent = data.cors.origin.join(', ');
              document.getElementById('transports').textContent = 'polling, websocket';
              document.getElementById('eioVersions').textContent = 'EIO3, EIO4';
            });
        }
        
        function addLogEntry(message, type = 'info') {
          const logContainer = document.getElementById('logContainer');
          const entry = document.createElement('div');
          entry.className = 'log-entry log-' + type;
          entry.textContent = new Date().toLocaleTimeString() + ' - ' + message;
          logContainer.appendChild(entry);
          logContainer.scrollTop = logContainer.scrollHeight;
        }
        
        // 自动刷新
        setInterval(refreshData, 2000);
        refreshData();
        
        // 模拟实时日志更新
        setInterval(() => {
          addLogEntry('系统运行正常，等待客户端连接...', 'info');
        }, 10000);
      </script>
    </body>
    </html>
  `);
});

// Socket.IO连接处理
io.on('connection', (socket) => {
  // 记录详细的连接信息
  logger.logConnection(socket, 'CONNECTION_ESTABLISHED', {
    query: socket.handshake.query,
    headers: socket.handshake.headers,
    transport: socket.conn.transport.name
  });

  // 连接认证
  const { tenantId, userId, platform } = socket.handshake.query;
  
  // 验证认证参数
  if (tenantId && userId && platform) {
    logger.logAuthentication(socket, true, { tenantId, userId, platform });
  } else {
    logger.logAuthentication(socket, false, { 
      received: { tenantId, userId, platform },
      required: ['tenantId', 'userId', 'platform']
    });
  }

  connectedClients.set(socket.id, {
    id: socket.id,
    connectedAt: new Date(),
    rooms: [],
    tenantId: tenantId as string,
    userId: userId as string
  });

  // 原有 join-room（兼容）
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    const client = connectedClients.get(socket.id);
    if (client) {
      client.rooms.push(roomId);
    }
    logger.logRoomEvent(socket, 'JOIN_ROOM', roomId, { clientId: socket.id });
  });

  // 新：加入租户房间（可携带 userId）
  socket.on('join-tenant', (payload: { tenantId: string; userId?: string }) => {
    const { tenantId, userId } = payload || ({} as any);
    if (!tenantId) return;
    const room = getTenantRoom(tenantId);
    socket.join(room);
    const client = connectedClients.get(socket.id);
    if (client) {
      client.tenantId = tenantId;
      client.userId = userId;
      client.rooms.push(room);
    }
    
    logger.logRoomEvent(socket, 'JOIN_TENANT', room, { 
      tenantId, 
      userId, 
      clientId: socket.id,
      recentMessagesCount: tenantMessages.get(tenantId)?.length || 0
    });

    // 可选：推送最近消息给新加入者
    const recent = tenantMessages.get(tenantId) || [];
    if (recent.length > 0) {
      socket.emit('recent-messages', recent);
    }

    // 广播上线状态
    if (userId) {
      io.to(room).emit('user-status-changed', { userId, status: 'online', timestamp: new Date().toISOString() });
    }
  });

  // 发送消息（按租户广播 + 确认）
  socket.on('send-message', (data: { tenantId: string; senderId: string; content: string }) => {
    if (!data?.tenantId || !data?.senderId || !data?.content) return;
    const messageData = {
      id: Date.now().toString(),
      tenantId: data.tenantId,
      senderId: data.senderId,
      content: data.content,
      timestamp: new Date().toISOString()
    };
    saveMessage(messageData);
    io.to(getTenantRoom(data.tenantId)).emit('new-message', messageData);
    socket.emit('message-sent', { id: messageData.id });
    
    logger.logMessage(socket, 'SEND_MESSAGE', {
      messageId: messageData.id,
      tenantId: data.tenantId,
      senderId: data.senderId,
      content: data.content,
      timestamp: messageData.timestamp
    });
  });

  // 输入指示器
  socket.on('typing-start', (data: { tenantId: string; userId: string }) => {
    if (!data?.tenantId || !data?.userId) return;
    io.to(getTenantRoom(data.tenantId)).emit('user-typing', { userId: data.userId, isTyping: true, timestamp: new Date().toISOString() });
  });
  socket.on('typing-stop', (data: { tenantId: string; userId: string }) => {
    if (!data?.tenantId || !data?.userId) return;
    io.to(getTenantRoom(data.tenantId)).emit('user-typing', { userId: data.userId, isTyping: false, timestamp: new Date().toISOString() });
  });

  // 状态更新
  socket.on('update-status', (data: { tenantId: string; userId: string; status: 'online' | 'offline' | 'away' }) => {
    if (!data?.tenantId || !data?.userId || !data?.status) return;
    io.to(getTenantRoom(data.tenantId)).emit('user-status-changed', { userId: data.userId, status: data.status, timestamp: new Date().toISOString() });
  });

  // 已读回执
  socket.on('mark-read', (data: { tenantId: string; messageId: string; userId: string }) => {
    if (!data?.tenantId || !data?.messageId || !data?.userId) return;
    io.to(getTenantRoom(data.tenantId)).emit('message-read', { messageId: data.messageId, userId: data.userId, timestamp: new Date().toISOString() });
  });

  // 离开房间（兼容）
  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId);
    const client = connectedClients.get(socket.id);
    if (client) {
      client.rooms = client.rooms.filter((room: string) => room !== roomId);
    }
    console.log(`Leave room: socket=${socket.id} room=${roomId}`);
  });

  // 断开连接
  socket.on('disconnect', (reason) => {
    const client = connectedClients.get(socket.id);
    if (client?.tenantId && client?.userId) {
      io.to(getTenantRoom(client.tenantId)).emit('user-status-changed', { userId: client.userId, status: 'offline', timestamp: new Date().toISOString() });
    }
    
    logger.logDisconnection(socket, reason);
    connectedClients.delete(socket.id);
  });

  // 错误处理
  socket.on('error', (error) => {
    logger.logError(socket, error, 'Socket.IO Error');
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
  
  // 记录系统启动事件
  logger.logSystemEvent('SERVER_STARTED', {
    port: PORT,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
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