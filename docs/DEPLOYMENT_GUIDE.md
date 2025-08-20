# GoldSky MessageCore 部署指南

## 🚀 部署概述

本指南将帮助您部署 GoldSky MessageCore 平台到生产环境。

## 📋 部署前准备

### 系统要求
- **操作系统**: Linux (Ubuntu 20.04+), macOS, Windows
- **Node.js**: >= 18.0.0
- **内存**: 最少 2GB RAM
- **存储**: 最少 10GB 可用空间
- **网络**: 开放端口 3000, 3030, 3031

### 环境变量配置
创建 `.env` 文件：
```bash
# 服务端口配置
ADMIN_PORT=3000
API_PORT=3030
REALTIME_PORT=3031

# 数据库配置
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url

# 安全配置
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://your-domain.com

# 生产环境配置
NODE_ENV=production
LOG_LEVEL=info
```

## 🏗️ 部署方式

### 方式1: 直接部署

#### 1. 克隆项目
```bash
git clone https://github.com/goldsky/messagecore.git
cd messagecore
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 构建项目
```bash
npm run build
```

#### 4. 启动服务
```bash
# 生产环境启动
NODE_ENV=production npm start

# 或分别启动
npm run start:api &
npm run start:realtime &
npm run start:admin &
```

### 方式2: PM2 进程管理

#### 1. 安装 PM2
```bash
npm install -g pm2
```

#### 2. 创建 PM2 配置文件
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'messagecore-api',
      script: 'apps/api/dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3030
      },
      instances: 2,
      exec_mode: 'cluster'
    },
    {
      name: 'messagecore-realtime',
      script: 'apps/realtime/dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3031
      },
      instances: 2,
      exec_mode: 'cluster'
    },
    {
      name: 'messagecore-admin',
      script: 'apps/admin/build/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

#### 3. 启动服务
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 方式3: Docker 部署

#### 1. 创建 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000 3030 3031

CMD ["npm", "start"]
```

#### 2. 构建和运行
```bash
docker build -t goldsky-messagecore .
docker run -d \
  -p 3000:3000 \
  -p 3030:3030 \
  -p 3031:3031 \
  --name messagecore \
  goldsky-messagecore
```

### 方式4: Kubernetes 部署

#### 1. 创建 Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: messagecore
spec:
  replicas: 3
  selector:
    matchLabels:
      app: messagecore
  template:
    metadata:
      labels:
        app: messagecore
    spec:
      containers:
      - name: messagecore
        image: goldsky/messagecore:latest
        ports:
        - containerPort: 3000
        - containerPort: 3030
        - containerPort: 3031
        env:
        - name: NODE_ENV
          value: "production"
```

#### 2. 创建 Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: messagecore-service
spec:
  selector:
    app: messagecore
  ports:
  - port: 3000
    targetPort: 3000
    name: admin
  - port: 3030
    targetPort: 3030
    name: api
  - port: 3031
    targetPort: 3031
    name: realtime
  type: LoadBalancer
```

## 🔧 配置优化

### 生产环境配置
```javascript
// 在 apps/realtime/src/index.ts 中
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://your-domain.com",
    credentials: true
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 120000,    // 2分钟
  pingInterval: 30000,    // 30秒
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6
});
```

### 日志配置
```javascript
// 生产环境日志配置
if (process.env.NODE_ENV === 'production') {
  logger.setLogLevel(LogLevel.INFO);
  logger.enableFileRotation();
}
```

## 📊 监控和运维

### 健康检查
```bash
# 创建健康检查脚本
#!/bin/bash
curl -f http://localhost:3030/health || exit 1
curl -f http://localhost:3031/health || exit 1
```

### 日志管理
```bash
# 日志轮转
logrotate /etc/logrotate.d/messagecore

# 日志清理
find /var/log/messagecore -name "*.log" -mtime +30 -delete
```

### 性能监控
```bash
# 使用 PM2 监控
pm2 monit

# 系统资源监控
htop
iotop
```

## 🔒 安全配置

### 防火墙设置
```bash
# Ubuntu/Debian
ufw allow 3000
ufw allow 3030
ufw allow 3031

# CentOS/RHEL
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=3030/tcp
firewall-cmd --permanent --add-port=3031/tcp
firewall-cmd --reload
```

### SSL/TLS 配置
```javascript
// 使用 Nginx 反向代理
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🚨 故障排除

### 常见问题

#### 1. 端口被占用
```bash
# 检查端口占用
lsof -i :3000
lsof -i :3030
lsof -i :3031

# 终止占用进程
kill -9 <PID>
```

#### 2. 服务启动失败
```bash
# 检查日志
pm2 logs messagecore-api
pm2 logs messagecore-realtime

# 检查环境变量
echo $NODE_ENV
echo $PORT
```

#### 3. 内存不足
```bash
# 增加 Node.js 内存限制
node --max-old-space-size=4096 dist/index.js

# 或在 PM2 中配置
pm2 start app.js --node-args="--max-old-space-size=4096"
```

### 性能调优

#### 1. 数据库连接池
```javascript
const pool = mysql.createPool({
  connectionLimit: 20,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

#### 2. Redis 缓存
```javascript
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});
```

## 📈 扩展部署

### 负载均衡
```nginx
upstream messagecore_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    location / {
        proxy_pass http://messagecore_backend;
    }
}
```

### 集群部署
```bash
# 使用 PM2 集群模式
pm2 start ecosystem.config.js --env production

# 或使用 Node.js 集群
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // 工作进程
  require('./app');
}
```

## 🎯 部署检查清单

- [ ] 环境变量配置完成
- [ ] 依赖安装完成
- [ ] 项目构建成功
- [ ] 服务启动正常
- [ ] 端口监听正常
- [ ] 健康检查通过
- [ ] 日志记录正常
- [ ] 监控配置完成
- [ ] 安全配置完成
- [ ] 备份策略制定

## 📞 技术支持

如果在部署过程中遇到问题，请：

1. 查看服务日志
2. 检查系统资源
3. 验证网络配置
4. 提交 Issue 到 GitHub
5. 联系技术支持团队

---

**祝您部署顺利！** 🚀 