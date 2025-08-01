# 🚀 MsgNexus 部署指南

## 部署概述

本指南将帮助您在不同环境中部署 MsgNexus 平台，包括开发环境、测试环境和生产环境。

## 环境要求

### 系统要求

- **操作系统**: Linux (Ubuntu 20.04+ / CentOS 8+) 或 macOS 12+
- **CPU**: 2核心以上
- **内存**: 4GB以上
- **存储**: 20GB以上可用空间
- **网络**: 稳定的网络连接

### 软件要求

- **Node.js**: 18.x 或更高版本
- **npm**: 8.x 或更高版本
- **PostgreSQL**: 13.x 或更高版本
- **Redis**: 6.x 或更高版本
- **Docker**: 20.x 或更高版本 (可选)
- **Docker Compose**: 2.x 或更高版本 (可选)

## 快速部署

### 使用 Docker Compose (推荐)

#### 1. 克隆项目

```bash
git clone https://github.com/msgnexus/platform.git
cd msgnexus
```

#### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库配置
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=msgnexus
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# 服务端口
ADMIN_PORT=3000
API_PORT=3030
REALTIME_PORT=3031

# 环境配置
NODE_ENV=production
```

#### 3. 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

#### 4. 初始化数据库

```bash
# 运行数据库迁移
docker-compose exec api npm run migrate

# 初始化基础数据
docker-compose exec api npm run seed
```

#### 5. 访问系统

- **管理后台**: http://localhost:3000
- **API文档**: http://localhost:3030/api/docs
- **健康检查**: http://localhost:3030/health

## 手动部署

### 1. 安装依赖

#### 安装 Node.js

```bash
# 使用 nvm 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

#### 安装 PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 安装 Redis

```bash
# Ubuntu/Debian
sudo apt install redis-server

# CentOS/RHEL
sudo yum install redis
sudo systemctl start redis
sudo systemctl enable redis
```

### 2. 配置数据库

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE msgnexus;
CREATE USER msgnexus_admin WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE msgnexus TO msgnexus_admin;
\q
```

### 3. 配置 Redis

编辑 Redis 配置文件 `/etc/redis/redis.conf`：

```conf
# 设置密码
requirepass your_redis_password

# 允许远程连接 (生产环境建议关闭)
# bind 127.0.0.1

# 持久化配置
save 900 1
save 300 10
save 60 10000
```

重启 Redis：

```bash
sudo systemctl restart redis
```

### 4. 部署应用

#### 克隆项目

```bash
git clone https://github.com/msgnexus/platform.git
cd msgnexus
```

#### 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装各应用依赖
cd apps/admin && npm install
cd ../api && npm install
cd ../realtime && npm install
cd ../..
```

#### 配置环境变量

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑配置
nano .env
```

#### 构建应用

```bash
# 构建所有应用
npm run build

# 或分别构建
npm run build:admin
npm run build:api
npm run build:realtime
```

#### 启动服务

```bash
# 启动所有服务
npm start

# 或分别启动
npm run start:admin
npm run start:api
npm run start:realtime
```

## 生产环境部署

### 使用 PM2 进程管理

#### 1. 安装 PM2

```bash
npm install -g pm2
```

#### 2. 创建 PM2 配置文件

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'msgnexus-admin',
      script: 'apps/admin/build/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'msgnexus-api',
      script: 'apps/api/dist/index.js',
      instances: 4,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3030
      }
    },
    {
      name: 'msgnexus-realtime',
      script: 'apps/realtime/dist/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3031
      }
    }
  ]
};
```

#### 3. 启动服务

```bash
# 启动所有服务
pm2 start ecosystem.config.js

# 查看服务状态
pm2 status

# 查看日志
pm2 logs

# 重启服务
pm2 restart all

# 停止服务
pm2 stop all
```

### 使用 Nginx 反向代理

#### 1. 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### 2. 配置 Nginx

创建配置文件 `/etc/nginx/sites-available/msgnexus`：

```nginx
upstream admin_backend {
    server 127.0.0.1:3000;
}

upstream api_backend {
    server 127.0.0.1:3030;
}

upstream realtime_backend {
    server 127.0.0.1:3031;
}

server {
    listen 80;
    server_name your-domain.com;

    # 管理后台
    location / {
        proxy_pass http://admin_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API 接口
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket 连接
    location /socket.io/ {
        proxy_pass http://realtime_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/msgnexus /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### SSL 证书配置

#### 使用 Let's Encrypt

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加以下行
0 12 * * * /usr/bin/certbot renew --quiet
```

## 监控和日志

### 系统监控

#### 使用 Prometheus + Grafana

```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
```

#### 配置 Prometheus

创建 `monitoring/prometheus.yml`：

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'msgnexus-api'
    static_configs:
      - targets: ['localhost:3030']

  - job_name: 'msgnexus-realtime'
    static_configs:
      - targets: ['localhost:3031']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
```

### 日志管理

#### 使用 ELK Stack

```yaml
# docker-compose.logging.yml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:7.17.0
    volumes:
      - ./monitoring/logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.0
    ports:
      - "5601:5601"
```

## 备份和恢复

### 数据库备份

#### 自动备份脚本

创建 `scripts/backup.sh`：

```bash
#!/bin/bash

# 备份配置
DB_NAME="msgnexus"
DB_USER="msgnexus_admin"
BACKUP_DIR="/var/backups/msgnexus"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/db_backup_$DATE.sql

# 删除7天前的备份
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "备份完成: db_backup_$DATE.sql.gz"
```

#### 设置定时备份

```bash
# 编辑 crontab
crontab -e

# 添加定时任务 (每天凌晨2点备份)
0 2 * * * /path/to/msgnexus/scripts/backup.sh
```

### 数据恢复

```bash
# 恢复数据库
gunzip -c db_backup_20240101_020000.sql.gz | psql -U msgnexus_admin -h localhost msgnexus
```

## 故障排除

### 常见问题

#### 1. 服务无法启动

**检查端口占用**:
```bash
sudo netstat -tlnp | grep :3000
sudo lsof -i :3000
```

**检查日志**:
```bash
pm2 logs
docker-compose logs
```

#### 2. 数据库连接失败

**检查数据库状态**:
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "\l"
```

**检查连接配置**:
```bash
# 测试数据库连接
psql -h localhost -U msgnexus_admin -d msgnexus
```

#### 3. Redis 连接失败

**检查 Redis 状态**:
```bash
sudo systemctl status redis
redis-cli ping
```

**检查 Redis 配置**:
```bash
redis-cli -a your_redis_password ping
```

### 性能优化

#### 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_messages_tenant_id ON messages(tenant_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);

-- 分析表统计信息
ANALYZE messages;
ANALYZE users;
ANALYZE tenants;
```

#### 应用优化

```javascript
// 启用压缩
app.use(compression());

// 设置缓存头
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

// 连接池配置
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## 安全配置

### 防火墙配置

```bash
# 安装 UFW
sudo apt install ufw

# 配置防火墙规则
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 安全加固

```bash
# 禁用不必要的服务
sudo systemctl disable telnet
sudo systemctl disable ftp

# 更新系统
sudo apt update && sudo apt upgrade

# 安装安全工具
sudo apt install fail2ban
sudo apt install rkhunter
```

---

*本部署指南涵盖了 MsgNexus 平台在不同环境下的部署方法，包括快速部署、生产环境配置、监控和故障排除等内容。* 