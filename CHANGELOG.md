# Changelog

## 0.0.1 - 2025-08-09

- 版本统一：根仓库、`apps/admin`、`apps/api`、`apps/realtime` 版本号统一为 `0.0.1`
- Admin（前端）
  - 新增悬浮 AI 助手（framer-motion 动画、拖拽、消息模拟）与独立页面、样式
  - 修复多处运行时健壮性问题：Array.isArray 校验、可选链、默认值
  - 兼容 TS/variants 类型问题（ease as const）
  - 完善接入页面与 UI 细节
- API（3030）
  - 提供 `/api/v1/messages`、`/system`、`/backup`、`/users`、`/tenants` 等模拟接口
  - 健康检查 `/health` 与错误处理
  - JWT 类型、校验中间件与依赖修正（开发态）
- Realtime（3031）
  - 基于 Socket.IO 的聊天室：`join-room`、`send-message`、房间广播 `new-message` 等
  - 健康检查 `/health`、统计 `/stats`
- 文档
  - 新增 `docs/CHAT_INTEGRATION.md`：API 列表、Socket.IO 事件、Nginx/TLS、Docker/K8s、鉴权与限流、FAQ

已知事项
- `@antv` sourcemap 警告可忽略或后续通过 webpack 配置屏蔽
- 如遇 `react-scripts: command not found` 或 workspace 依赖解析异常，请在 `apps/admin` 执行安装或使用统一的 workspace 安装策略
- 端口占用（3030/3031）时需先清理残留进程 