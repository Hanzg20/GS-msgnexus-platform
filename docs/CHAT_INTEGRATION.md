# MsgNexus 实时聊天接入说明

本说明用于将第三方即时聊天工具接入 MsgNexus 平台，涵盖开发/生产环境的 IP 与端口、REST API、Socket.IO 事件、示例与常见问题。

## 一、环境与地址

- 开发环境（默认）
  - API 基础地址: `http://127.0.0.1:3030`
    - 健康检查: `GET /health`
    - API 前缀: `/api/v1`
  - 实时服务（Socket.IO）: `ws://127.0.0.1:3031`（HTTP: `http://127.0.0.1:3031`）
    - 健康检查: `GET /health`
    - 统计: `GET /stats`

- 生产环境（示例占位）
  - API 基础地址: `https://<YOUR_PUBLIC_IP_OR_DOMAIN>:<PORT>`
  - 实时服务: `wss://<YOUR_PUBLIC_IP_OR_DOMAIN>:<REALTIME_PORT>`

- 关键环境变量（可选）
  - `PORT`: API 服务端口，默认 `3030`
  - `REALTIME_PORT`: 实时服务端口，默认 `3031`
  - `FRONTEND_URL`: 允许跨域的前端地址（用于 Socket.IO CORS），例如 `http://localhost:3000` 或你的域名

> 注意：当前实时服务默认 CORS 允许 `FRONTEND_URL`（未设置时默认为 `http://localhost:4000`）。若你的前端运行在 `http://localhost:3000`，请将环境变量 `FRONTEND_URL` 设置为 `http://localhost:3000`。

---

## 二、REST API（消息相关）

基础前缀: `http://<API_HOST>:<PORT>/api/v1`

- 列表查询
  - `GET /messages`
    - 查询参数: `page`, `limit`, `status`, `type`, `tenantId`, `priority`, `startDate`, `endDate`, `search`
- 详情
  - `GET /messages/:id`
- 创建消息（模拟）
  - `POST /messages`
    - 请求体: `{ tenantId, type: 'sms'|'email'|'push'|'webhook', priority?, sender, recipient, subject?, content, metadata?, maxRetries? }`
- 更新状态
  - `PATCH /messages/:id/status`
    - 请求体: `{ status: 'pending'|'sent'|'delivered'|'failed'|'retrying', errorMessage? }`
- 重试失败消息
  - `POST /messages/:id/retry`
- 删除
  - `DELETE /messages/:id`
- 统计概览
  - `GET /messages/stats/overview`
    - 查询参数: `tenantId`, `startDate`, `endDate`
- 趋势数据
  - `GET /messages/stats/trends`
    - 查询参数: `tenantId`, `days`（默认 7）

示例（创建消息）

```bash
curl -X POST "http://127.0.0.1:3030/api/v1/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "tenant-001",
    "type": "sms",
    "sender": "MsgNexus",
    "recipient": "+1234567890",
    "content": "Hello from MsgNexus!"
  }'
```

---

## 三、Socket.IO 实时聊天

- 连接地址（开发）: `ws://127.0.0.1:3031`
- 路径: 默认 `/socket.io`
- CORS: 需匹配 `FRONTEND_URL`

### 事件规范

- 客户端 -> 服务器
  - `join-room`: 加入房间
    - 负载: `{ roomId: string }`
  - `send-message`: 向房间发送消息
    - 负载: `{ roomId: string; message: string; userId: string; userName?: string }`
  - `leave-room`: 离开房间
    - 负载: `{ roomId: string }`

- 服务器 -> 客户端
  - `user-joined`: 有用户加入房间
    - 负载: `{ userId, roomId, timestamp }`
  - `new-message`: 新消息广播
    - 负载: `{ id, roomId, message, userId, userName, timestamp }`
  - `user-left`: 有用户离开房间
    - 负载: `{ userId, roomId, timestamp }`

### 前端示例（JavaScript）

```js
import { io } from 'socket.io-client'

const socket = io('http://127.0.0.1:3031', {
  withCredentials: true,
})

socket.on('connect', () => {
  console.log('connected:', socket.id)
  socket.emit('join-room', 'room-001')
})

socket.on('user-joined', (payload) => {
  console.log('user-joined', payload)
})

socket.on('new-message', (msg) => {
  console.log('new-message', msg)
})

function sendMessage(text) {
  socket.emit('send-message', {
    roomId: 'room-001',
    message: text,
    userId: 'customer-123',
    userName: 'Customer A',
  })
}
```

---

## 四、健康检查与监控

- API 健康检查: `GET http://127.0.0.1:3030/health`
- 实时服务健康检查: `GET http://127.0.0.1:3031/health`
- 实时服务统计: `GET http://127.0.0.1:3031/stats`

---

## 五、鉴权与安全

- 当前示例 API 为演示模式，不强制鉴权（生产请接入 JWT / Session / 网关鉴权）。
- Socket.IO 建议在生产启用：
  - TLS (`wss://`)
  - 鉴权（连接握手携带 Token）
  - 房间/用户权限校验
  - 速率限制（Nginx/网关 + 应用层）

---

## 六、环境部署要点

- 必要变量
  - `PORT=3030`
  - `REALTIME_PORT=3031`
  - `FRONTEND_URL=http://localhost:3000`（或你的前端地址）
- 反向代理（Nginx 示例思路）
  - 将 `/api/` 转发到 API 服务（`127.0.0.1:3030`）
  - 将 `/socket.io/` 协议升级转发到实时服务（`127.0.0.1:3031`）
- 端口暴露
  - API: TCP 3030
  - 实时服务: TCP 3031（允许 WebSocket 升级）

---

## 七、常见问题（FAQ）

- 前端连接 Socket 报 CORS 错误？
  - 请设置 `FRONTEND_URL` 与前端地址一致，并重启实时服务。
- 能否只使用 REST，不用实时？
  - 可以，使用 `POST /messages` 写入、客户端轮询 `GET /messages` 或结合 SSE/长轮询改造。
- 生产 IP/域名如何配置？
  - 将本文档中的 `127.0.0.1` 替换为你的公网 IP 或域名；在反向代理与防火墙上放通对应端口。

---

## 八、联系与变更

- 变更说明
  - 事件名、字段若需变更，请按版本化策略通知对接方
- 技术联系人
  - 请在内部文档中补充负责人与沟通渠道

---

## 九、生产部署与配置补充

### 9.1 Nginx 反向代理（含 TLS 与 WebSocket）

```nginx
# 替换为你的域名
server {
  listen 80;
  server_name chat.example.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name chat.example.com;

  # TLS 证书
  ssl_certificate /etc/letsencrypt/live/chat.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/chat.example.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;

  # API 转发到 3030
  location /api/ {
    proxy_pass http://127.0.0.1:3030;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # WebSocket (Socket.IO) 转发到 3031
  location /socket.io/ {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
    proxy_pass http://127.0.0.1:3031;
  }

  # 前端静态资源（可选）
  # location / {
  #   root /var/www/app;
  #   try_files $uri /index.html;
  # }
}
```

### 9.2 Socket.IO 鉴权握手（推荐）

- 客户端在握手时通过 `auth.token` 或 `Authorization: Bearer <token>` 携带令牌。
- 服务器侧在 `connection` 前进行校验。

客户端示例：
```js
import { io } from 'socket.io-client'

const token = 'YOUR_JWT_TOKEN'
const socket = io('wss://chat.example.com', {
  path: '/socket.io',
  transports: ['websocket'],
  auth: { token },
  withCredentials: true,
})
```

服务器侧（参考实现思路）：
```ts
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || (socket.handshake.headers['authorization'] || '').replace('Bearer ', '')
  if (!token) return next(new Error('unauthorized'))
  // TODO: verify token (e.g., jwt.verify) and attach user/tenant
  // (socket.data.user = decoded)
  next()
})
```

> 当前仓库中的实时服务默认未启用鉴权，以上为生产接入推荐做法。

### 9.3 速率限制与基础安全

- 网关层（Nginx）：
```nginx
# 基于 IP 的简单速率限制（示例）
limit_req_zone $binary_remote_addr zone=api_rate:10m rate=10r/s;

server {
  # ...
  location /api/ {
    limit_req zone=api_rate burst=20 nodelay;
    proxy_pass http://127.0.0.1:3030;
    # 其余头部同上
  }
}
```

- 应用层（Node/Express）：建议开启 `helmet`、`cors` 明确白名单、`express-rate-limit`。

### 9.4 进程与服务管理（systemd 示例）

```ini
# /etc/systemd/system/msgnexus-api.service
[Unit]
Description=MsgNexus API Service
After=network.target

[Service]
Environment=PORT=3030
Environment=NODE_ENV=production
WorkingDirectory=/opt/msgnexus/apps/api
ExecStart=/usr/bin/node dist/index.js
Restart=always
User=msgnexus

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/msgnexus-realtime.service
[Unit]
Description=MsgNexus Realtime (Socket.IO)
After=network.target

[Service]
Environment=REALTIME_PORT=3031
Environment=FRONTEND_URL=https://your-frontend-domain
Environment=NODE_ENV=production
WorkingDirectory=/opt/msgnexus/apps/realtime
ExecStart=/usr/bin/node dist/index.js
Restart=always
User=msgnexus

[Install]
WantedBy=multi-user.target
```

启用与查看：
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now msgnexus-api msgnexus-realtime
sudo systemctl status msgnexus-api msgnexus-realtime
```

### 9.5 健康检查与探针（K8s/容器参考）

- API: `GET /health` 期望 `status: OK`
- Realtime: `GET /health` 期望 `status: healthy`

### 9.6 验证清单（上线前）

- DNS/证书：域名可解析，证书有效
- 防火墙：放通 80/443（对外），3030/3031（对内）
- Nginx：/api 与 /socket.io 正确转发，WebSocket 升级成功
- CORS：`FRONTEND_URL` 与前端源一致
- Socket：`join-room`/`send-message`/`new-message` 全链路打通
- 速率限制：阈值符合预期，异常请求被限制
- 监控：健康检查/日志/告警可用 

### 9.7 网关/REST/JWT 鉴权示例

- REST（建议在生产强制开启）
  - 客户端示例：
    ```bash
    curl -H "Authorization: Bearer <YOUR_JWT>" \
         -H "Content-Type: application/json" \
         "https://chat.example.com/api/v1/messages"
    ```
  - 网关透传（Nginx）：
    ```nginx
    location /api/ {
      proxy_pass http://127.0.0.1:3030;
      proxy_set_header Authorization $http_authorization;
      # 可对接 auth_request 或 OAuth2-Proxy 做前置校验
    }
    ```
  - 应用层（Node/Express）建议：`helmet` + 严格 CORS 白名单 + `express-rate-limit` + JWT 校验中间件。

- Socket.IO（握手鉴权）
  - 客户端：
    ```js
    const socket = io('wss://chat.example.com', { auth: { token: '<YOUR_JWT>' } })
    ```
  - 服务器（思路）：
    ```ts
    io.use((socket, next) => {
      const token = socket.handshake.auth?.token || ''
      // jwt.verify(token, PUBLIC_KEY)
      next()
    })
    ```

---

## 十、Docker Compose（快速启动）

```yaml
version: '3.8'
services:
  api:
    build: ./apps/api
    environment:
      - PORT=3030
      - NODE_ENV=production
    ports:
      - "3030:3030"
    restart: unless-stopped

  realtime:
    build: ./apps/realtime
    environment:
      - REALTIME_PORT=3031
      - FRONTEND_URL=https://chat.example.com
      - NODE_ENV=production
    ports:
      - "3031:3031"
    restart: unless-stopped
```

> 若使用现成构建产物，改为 `image:` 指定镜像并挂载 `dist/`。

---

## 十一、Kubernetes 样例（最小化）

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: msgnexus-api
spec:
  replicas: 1
  selector: { matchLabels: { app: msgnexus-api } }
  template:
    metadata: { labels: { app: msgnexus-api } }
    spec:
      containers:
        - name: api
          image: your-registry/msgnexus-api:latest
          env:
            - { name: PORT, value: "3030" }
            - { name: NODE_ENV, value: production }
          ports:
            - containerPort: 3030
---
apiVersion: v1
kind: Service
metadata:
  name: msgnexus-api
spec:
  selector: { app: msgnexus-api }
  ports:
    - port: 3030
      targetPort: 3030
      protocol: TCP
```

> Realtime 同理，暴露 3031 并在 Ingress 上配置 WebSocket 升级。

---

## 十二、错误码与返回格式

- 统一结构：
  - 成功：`{ success: true, data, message? }`
  - 失败：`{ success: false, error | message, details? }`
- 常见 HTTP 状态：
  - 200/201：成功
  - 400：参数错误/业务校验失败
  - 401：未认证/Token 失效
  - 403：无权限
  - 404：资源不存在
  - 429：限流
  - 500：服务器异常

---

## 十三、Socket 断线重连与健壮性建议

- 开启自动重连并设置指数退避：
  ```js
  const socket = io('wss://chat.example.com', {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
    timeout: 10000,
  })
  ```
- 心跳/保活：保持默认心跳，服务端监控断开事件并清理房间状态。
- 消息可靠性（可选）：在应用层实现简单 ACK 与重发。
- 多租户/房间隔离：房间命名使用 `tenantId:conversationId` 形式避免串房。 