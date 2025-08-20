# MsgNexus 聊天接入（第三方调用地址一览）

本页提供第三方应用在局域网与互联网场景下，调用 MsgNexus 的唯一且完整的地址规范与最小示例。

## 1) 服务器
- 局域网 IP（Wi‑Fi/en1）: `10.0.0.243`
- API 基础地址（开发/直连）
  - Base: `http://10.0.0.243:3030`
  - 健康检查: `GET http://10.0.0.243:3030/health`
  - REST 前缀: `http://10.0.0.243:3030/api/v1`
- 实时服务（Socket.IO，开发/直连）
  - WebSocket: `ws://10.0.0.243:3031`
  - Path: `/socket.io`

最小示例（局域网）
```bash
# 健康检查
curl "http://10.0.0.243:3030/health"
# 创建消息
curl -X POST "http://10.0.0.243:3030/api/v1/messages" -H "Content-Type: application/json" -d '{
  "tenantId":"t-1","type":"sms","sender":"MsgNexus","recipient":"+123","content":"hi"
}'
```
```js
// Socket.IO 连接（局域网）
import { io } from 'socket.io-client'
const socket = io('http://10.0.0.243:3031', { withCredentials: true })
socket.on('connect', () => socket.emit('join-room', 'room-001'))
```

必要条件（跨设备必读）
- 放通端口：在服务器主机和路由器/防火墙上开放 TCP 3030（API）、3031（Realtime）
- CORS（Realtime）：将环境变量 `FRONTEND_URL` 设置为第三方网页的来源（如 `http://10.0.0.50:3000`），并重启实时服务

---

## 2) 互联网（生产推荐：域名 + TLS + 网关）
- 推荐经 Nginx 暴露统一域名（示例域名请替换为你的实际域名）：
  - API 基础地址（生产）: `https://chat.example.com`
    - 健康检查: `GET https://chat.example.com/health`
    - REST 前缀: `https://chat.example.com/api/v1`
  - 实时（生产）: `wss://chat.example.com`
    - Path: `/socket.io`

最小示例（互联网）
```bash
# 健康检查（生产）
curl "https://chat.example.com/health"
# 创建消息（生产）
curl -X POST "https://chat.example.com/api/v1/messages" -H "Content-Type: application/json" -d '{
  "tenantId":"t-1","type":"sms","sender":"MsgNexus","recipient":"+123","content":"hi"
}'
```
```js
// Socket.IO 连接（生产）
import { io } from 'socket.io-client'
const socket = io('wss://chat.example.com', {
  path: '/socket.io',
  transports: ['websocket'],
  withCredentials: true,
})
```

必要条件（生产必读）
- TLS：启用 https/wss，统一走 443，由网关转发到内网 3030/3031
- CORS/来源白名单：Realtime 服务的 `FRONTEND_URL` 必须与第三方页面来源匹配（如 `https://partner.example.com`）
- 鉴权（强烈建议）：
  - REST：`Authorization: Bearer <JWT>`
  - Socket.IO：握手 `auth: { token: '<JWT>' }`

---

## 3) 主要 REST 路由（前缀均基于 Base + `/api/v1`）
- `GET /messages`（查询）
- `GET /messages/:id`（详情）
- `POST /messages`（创建）
- `PATCH /messages/:id/status`（更新状态）
- `POST /messages/:id/retry`（重试）
- `DELETE /messages/:id`（删除）

---

## 4) 主要 Socket.IO 事件
- 客户端 → 服务器：
  - `join-room` `{ roomId }`
  - `send-message` `{ roomId, message, userId, userName? }`
  - `leave-room` `{ roomId }`
- 服务器 → 客户端：
  - `user-joined` `{ userId, roomId, timestamp }`
  - `new-message` `{ id, roomId, message, userId, userName, timestamp }`
  - `user-left` `{ userId, roomId, timestamp }`

---

## 5) 常见问题（极简）
- 跨设备访问不通：请确认使用的是服务器 IP/域名（不是 localhost）；开放 3030/3031（或 80/443）端口
- 跨域错误：将 `FRONTEND_URL` 设置为第三方网页来源后重启 Realtime
- 生产报错：优先检查 TLS、网关 WebSocket 升级、鉴权 Token 是否正确 

## 设置 FRONTEND_URL（避免 CORS）

实时服务会按 `FRONTEND_URL` 做 CORS 校验（Express 与 Socket.IO）。将其设置为第三方页面的“来源”（Origin），否则跨设备访问会被拦截。

- 你要填入的值（示例）
  - 局域网前端: `http://10.0.0.50:3000`
  - 公网域名前端: `https://partner.example.com`

- 快速方式（一次性本机启动）
  ```bash
  cd apps/realtime
  source ~/.nvm/nvm.sh && nvm use 18
  FRONTEND_URL=http://10.0.0.50:3000 REALTIME_PORT=3031 npm run dev
  # 或构建后运行
  FRONTEND_URL=http://10.0.0.50:3000 REALTIME_PORT=3031 npm run build && FRONTEND_URL=http://10.0.0.50:3000 REALTIME_PORT=3031 npm start
  ```

- 使用 .env（推荐，已内置 dotenv 加载）
  在 `apps/realtime/.env` 写入：
  ```env
  FRONTEND_URL=http://10.0.0.50:3000
  REALTIME_PORT=3031
  ```
  重启：
  ```bash
  cd apps/realtime && npm run build && npm start
  ```

- systemd（生产主机）
  ```ini
  [Service]
  Environment=FRONTEND_URL=http://10.0.0.50:3000
  Environment=REALTIME_PORT=3031
  WorkingDirectory=/opt/msgnexus/apps/realtime
  ExecStart=/usr/bin/node dist/index.js
  Restart=always
  ```

- Docker Compose
  ```yaml
  services:
    realtime:
      image: node:18-alpine
      working_dir: /app
      volumes:
        - ./apps/realtime:/app
      command: sh -c "npm ci && npm run build && node dist/index.js"
      environment:
        - FRONTEND_URL=http://10.0.0.50:3000
        - REALTIME_PORT=3031
      ports:
        - "3031:3031"
  ```

- 验证
  - 访问: `http://<服务器IP或域名>:3031/health`
  - 从第三方页面（其 Origin=FRONTEND_URL）发起 Socket.IO 连接应不再报 CORS 错误。 

- 预设
  - 服务器 IP: 10.0.0.243
  - API: http://10.0.0.243:3030
  - Realtime: ws://10.0.0.243:3031（path /socket.io）

- REST（curl）
  ```bash
  API=http://10.0.0.243:3030

  # 健康检查
  curl "$API/health"

  # 创建消息
  curl -X POST "$API/api/v1/messages" \
    -H "Content-Type: application/json" \
    -d '{"tenantId":"t-1","type":"sms","sender":"MsgNexus","recipient":"+123","content":"hello from LAN"}'

  # 查询消息列表
  curl "$API/api/v1/messages?limit=5"
  ```

- Socket.IO（Node 命令行）
  ```bash
  # 进入临时目录并安装依赖
  mkdir -p ~/mn-test && cd ~/mn-test
  npm init -y >/dev/null 2>&1
  npm i socket.io-client@4.8.1 --silent

  # 连接、进房、发一条消息
  node - <<'NODE'
  const { io } = require('socket.io-client');
  const WS = 'http://10.0.0.243:3031';
  const socket = io(WS, { path: '/socket.io', transports: ['websocket'] });

  socket.on('connect', () => {
    console.log('connected', socket.id);
    socket.emit('join-room', 'room-001');
    socket.emit('send-message', { roomId:'room-001', message:'hello from CLI', userId:'cli' });
    setTimeout(() => { socket.close(); process.exit(0); }, 2000);
  });

  socket.on('new-message', (m) => console.log('new-message', m));
  socket.on('connect_error', (e) => console.error('connect_error', e.message));
  NODE
  ```

- 注意
  - 若命令行提示“npm: command not found”，先安装/启用 Node 18（或在 Mac 上执行 `source ~/.nvm/nvm.sh && nvm use 18`）。
  - 若经浏览器网页跨设备访问实时服务，需在服务端设置 FRONTEND_URL（文档已写）；命令行使用 socket.io-client 直连一般不受 CORS 影响。 