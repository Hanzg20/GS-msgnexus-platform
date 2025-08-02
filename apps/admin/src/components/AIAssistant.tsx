import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type: 'text' | 'error' | 'loading';
}

interface Suggestion {
  id: string;
  text: string;
  category: string;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是 MsgNexus AI 助手，有什么可以帮助你的吗？',
      sender: 'ai',
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions: Suggestion[] = [
    { id: '1', text: '如何创建新用户？', category: '用户管理' },
    { id: '2', text: '系统性能如何优化？', category: '系统管理' },
    { id: '3', text: '如何配置备份策略？', category: '备份管理' },
    { id: '4', text: '查看最近的错误日志', category: '日志管理' },
    { id: '5', text: '如何设置用户权限？', category: '权限管理' },
    { id: '6', text: '系统诊断报告', category: '系统诊断' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 模拟 AI 响应
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('用户') || input.includes('创建') || input.includes('add user')) {
      return `要创建新用户，请按以下步骤操作：

1. 进入"用户权限管理"页面
2. 点击"添加用户"按钮
3. 填写用户信息（用户名、邮箱、角色）
4. 设置初始密码
5. 分配相应权限
6. 点击"保存"完成创建

需要我为您演示具体操作吗？`;
    }
    
    if (input.includes('性能') || input.includes('优化') || input.includes('performance')) {
      return `系统性能优化建议：

1. **数据库优化**：
   - 定期清理日志表
   - 优化查询索引
   - 配置连接池

2. **缓存策略**：
   - 启用 Redis 缓存
   - 缓存热点数据
   - 设置合理的过期时间

3. **监控指标**：
   - CPU 使用率保持在 70% 以下
   - 内存使用率保持在 80% 以下
   - 响应时间控制在 200ms 以内

您想了解哪个方面的具体优化方案？`;
    }
    
    if (input.includes('备份') || input.includes('backup')) {
      return `备份策略配置：

**完整备份**：
- 频率：每日凌晨 2:00
- 保留期：30 天
- 存储位置：本地 + 云存储

**增量备份**：
- 频率：每小时
- 保留期：7 天
- 自动清理过期备份

**恢复测试**：
- 建议每月进行一次恢复测试
- 验证备份数据的完整性

您需要修改当前的备份策略吗？`;
    }
    
    if (input.includes('日志') || input.includes('错误') || input.includes('log')) {
      return `日志管理功能：

**查看日志**：
- 进入"日志管理"页面
- 支持按级别、时间、服务过滤
- 实时日志流显示

**错误分析**：
- 自动识别错误模式
- 提供错误解决建议
- 错误趋势分析

**日志导出**：
- 支持 CSV 格式导出
- 自定义时间范围
- 批量下载功能

需要我帮您查看最近的错误日志吗？`;
    }
    
    if (input.includes('权限') || input.includes('permission')) {
      return `权限管理说明：

**角色类型**：
- 超级管理员：系统所有权限
- 租户管理员：租户内管理权限
- 普通用户：基本操作权限

**权限分配**：
- 基于角色的访问控制 (RBAC)
- 支持细粒度权限设置
- 权限继承机制

**安全建议**：
- 定期审查用户权限
- 遵循最小权限原则
- 启用操作审计日志

您想了解具体的权限配置吗？`;
    }
    
    if (input.includes('诊断') || input.includes('diagnostic')) {
      return `系统诊断功能：

**自动诊断**：
- 系统资源检查
- 服务状态监控
- 网络连接测试
- 数据库健康检查

**诊断报告**：
- 生成详细诊断报告
- 提供优化建议
- 历史诊断记录

**问题修复**：
- 自动修复常见问题
- 手动修复指导
- 联系技术支持

需要我为您运行系统诊断吗？`;
    }
    
    return `我理解您的问题。让我为您提供一些相关信息：

**常用功能**：
- 用户管理：创建、编辑、删除用户
- 系统监控：实时监控系统状态
- 日志管理：查看和分析系统日志
- 备份恢复：数据备份和恢复
- 权限管理：用户权限配置

**快捷操作**：
- 使用左侧菜单快速导航
- 点击右上角通知查看系统消息
- 使用搜索功能快速查找

如果您需要更具体的帮助，请告诉我您想要了解哪个功能，我会为您提供详细的操作指导。`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    sendMessage(suggestion.text);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 聊天头部 */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI 助手</h2>
              <p className="text-sm text-gray-500">智能客服和系统助手</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500">
                {isConnected ? '已连接' : '连接断开'}
              </span>
            </div>
          </div>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {/* 输入指示器 */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI 正在思考...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入您的问题..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              发送
            </button>
          </form>
          <div className="text-xs text-gray-500 mt-1">
            按 Enter 发送，Shift + Enter 换行
          </div>
        </div>
      </div>

      {/* 侧边栏 */}
      <div className="w-80 bg-white border-l border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">快速问题</h3>
          <p className="text-sm text-gray-500">点击以下问题快速获取帮助</p>
        </div>
        
        <div className="p-4 space-y-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isTyping}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900">{suggestion.text}</div>
              <div className="text-xs text-gray-500 mt-1">{suggestion.category}</div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">AI 能力</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              系统操作指导
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              问题诊断分析
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              性能优化建议
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              安全配置指导
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 