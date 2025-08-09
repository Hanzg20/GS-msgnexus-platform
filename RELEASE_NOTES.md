# MsgNexus v0.0.1 里程碑版发布说明

发布日期：2025-08-09

## 新增
- 悬浮 AI 助手（Admin），支持拖拽、动画、消息模拟
- 即时聊天（Realtime/Socket.IO）：房间加入、消息广播、用户进出通知
- 文档：`docs/CHAT_INTEGRATION.md`（API、Socket、Nginx/TLS、Docker/K8s、鉴权、FAQ）

## 修复/改进
- 前端健壮性：空值与数组类型检查、可选链与默认值
- 类型兼容：framer-motion variants ease 类型修正
- API/Realtime 健康检查与日志完善

## 升级/使用提示
- 端口：API `3030`，Realtime `3031`；若占用请先清理进程
- CORS：请将 `FRONTEND_URL` 设置为实际前端地址
- Nginx：配置 `/api/` 与 `/socket.io/` 反向代理并开启 TLS
- 若遇前端依赖解析问题：在 `apps/admin` 执行依赖安装，或用根 workspace 统一安装

## 未来计划（下个里程碑）
- 鉴权落地（JWT 校验 + Socket.IO 握手中间件）
- 持久化接入（数据库与消息存储）
- 更完善的监控与告警 