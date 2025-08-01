import React, { useState } from 'react';

interface HelpItem {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const helpItems: HelpItem[] = [
    {
      id: 'getting-started',
      title: '快速开始指南',
      category: '入门指南',
      difficulty: 'beginner',
      tags: ['新手', '设置', '配置'],
      content: `
## 🚀 快速开始指南

### 1. 系统登录
- 使用管理员账号登录系统
- 首次登录请修改默认密码
- 建议启用双因素认证

### 2. 基础配置
- 配置租户信息
- 设置用户权限
- 配置消息模板

### 3. 功能使用
- 查看仪表板数据
- 管理用户和租户
- 监控系统状态

### 4. 常见问题
- 如何添加新用户？
- 如何配置消息模板？
- 如何查看系统日志？
      `
    },
    {
      id: 'user-management',
      title: '用户管理详解',
      category: '用户管理',
      difficulty: 'intermediate',
      tags: ['用户', '权限', '管理'],
      content: `
## 👥 用户管理详解

### 用户创建
1. 进入"租户管理"页面
2. 点击"添加用户"按钮
3. 填写用户信息
4. 设置用户权限
5. 发送邀请邮件

### 权限配置
- **超级管理员**: 拥有所有权限
- **租户管理员**: 管理指定租户
- **普通用户**: 基础功能权限
- **只读用户**: 仅查看权限

### 用户状态
- **活跃**: 正常使用中
- **待激活**: 已创建但未激活
- **已禁用**: 暂时停用
- **已删除**: 已删除用户
      `
    },
    {
      id: 'message-monitoring',
      title: '消息监控系统',
      category: '消息管理',
      difficulty: 'intermediate',
      tags: ['消息', '监控', '分析'],
      content: `
## 💬 消息监控系统

### 实时监控
- 消息发送状态
- 消息接收确认
- 消息处理时间
- 错误消息统计

### 数据分析
- 消息流量趋势
- 用户活跃度
- 系统性能指标
- 异常情况预警

### 故障处理
- 消息发送失败排查
- 网络连接问题
- 服务器负载过高
- 数据库连接异常
      `
    },
    {
      id: 'system-troubleshooting',
      title: '系统故障排除',
      category: '故障处理',
      difficulty: 'advanced',
      tags: ['故障', '排除', '维护'],
      content: `
## 🔧 系统故障排除

### 常见故障及解决方案

#### 1. 系统无法启动
**症状**: 服务启动失败，显示端口占用错误
**解决方案**:
- 检查端口占用情况: \`lsof -i :3000\`
- 终止占用进程: \`kill -9 <PID>\`
- 重启服务: \`npm start\`

#### 2. 数据库连接失败
**症状**: 显示数据库连接错误
**解决方案**:
- 检查数据库服务状态
- 验证连接配置
- 检查网络连接
- 重启数据库服务

#### 3. 消息发送失败
**症状**: 消息无法发送，显示发送失败
**解决方案**:
- 检查网络连接
- 验证API密钥
- 检查消息格式
- 查看错误日志

#### 4. 性能问题
**症状**: 系统响应缓慢，页面加载慢
**解决方案**:
- 检查服务器资源使用情况
- 优化数据库查询
- 清理缓存数据
- 升级服务器配置

### 日志查看
- 应用日志: \`/var/log/app.log\`
- 错误日志: \`/var/log/error.log\`
- 访问日志: \`/var/log/access.log\`

### 联系支持
- 技术支持: support@goldsky.com
- 紧急联系: +86-400-123-4567
- 在线文档: https://docs.goldsky.com
      `
    },
    {
      id: 'api-integration',
      title: 'API 集成指南',
      category: '开发指南',
      difficulty: 'advanced',
      tags: ['API', '集成', '开发'],
      content: `
## 🔌 API 集成指南

### 认证方式
\`\`\`javascript
// 获取访问令牌
const token = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
\`\`\`

### 消息发送 API
\`\`\`javascript
// 发送消息
const response = await fetch('/api/messages/send', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: 'user@example.com',
    content: 'Hello World',
    type: 'text'
  })
});
\`\`\`

### WebSocket 连接
\`\`\`javascript
// 建立实时连接
const socket = io('ws://localhost:3031', {
  auth: { token }
});

socket.on('message', (data) => {
  console.log('收到消息:', data);
});
\`\`\`

### 错误处理
\`\`\`javascript
try {
  const response = await apiCall();
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}\`);
  }
} catch (error) {
  console.error('API 调用失败:', error);
  // 处理错误
}
\`\`\`
      `
    }
  ];

  const categories = ['all', ...Array.from(new Set(helpItems.map(item => item.category)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredItems = helpItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初级';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 800, 
          color: '#0f172a', 
          margin: 0, 
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          📚 帮助中心
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          margin: 0,
          fontWeight: 500
        }}>
          查找使用指南、故障排除和最佳实践
        </p>
      </div>

      {/* 搜索和筛选 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="搜索帮助内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              minWidth: '120px'
            }}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? '所有分类' : category}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              minWidth: '120px'
            }}
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? '所有难度' : getDifficultyText(difficulty)}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['新手', '设置', '故障', 'API', '监控'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              style={{
                padding: '6px 12px',
                background: searchTerm === tag ? '#3b82f6' : '#f1f5f9',
                color: searchTerm === tag ? 'white' : '#475569',
                border: 'none',
                borderRadius: '16px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 帮助内容列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            <div
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    margin: 0 
                  }}>
                    {item.title}
                  </h3>
                  <span style={{
                    padding: '4px 8px',
                    background: getDifficultyColor(item.difficulty),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {getDifficultyText(item.difficulty)}
                  </span>
                </div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#64748b', 
                  margin: 0,
                  marginBottom: '8px'
                }}>
                  {item.category}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        padding: '2px 6px',
                        background: '#f1f5f9',
                        color: '#475569',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{
                fontSize: '20px',
                color: '#6b7280',
                transition: 'transform 0.3s ease',
                transform: expandedItem === item.id ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                ▼
              </div>
            </div>
            
            {expandedItem === item.id && (
              <div style={{
                padding: '0 20px 20px',
                borderTop: '1px solid #e2e8f0',
                background: '#f8fafc'
              }}>
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#374151',
                  whiteSpace: 'pre-line'
                }}>
                  {item.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 联系支持 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
        borderRadius: '16px', 
        padding: '32px', 
        marginTop: '32px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '24px', fontWeight: 700, margin: 0, marginBottom: '16px' }}>
          需要更多帮助？
        </h3>
        <p style={{ fontSize: '16px', margin: 0, marginBottom: '24px', opacity: 0.9 }}>
          我们的技术支持团队随时为您提供帮助
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            📧 发送邮件
          </button>
          <button style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            💬 在线客服
          </button>
          <button style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            📞 电话支持
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 