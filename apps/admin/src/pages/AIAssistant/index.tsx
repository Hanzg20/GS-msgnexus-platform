import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Typography, Space, Tag, Spin, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  loading?: boolean;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '你好！我是 GoldSky MessageCore 的 AI 助手。我可以帮助您：\n\n• 📊 分析系统数据和趋势\n• 🔍 诊断问题和异常\n• 💡 提供优化建议\n• 📈 生成报告和预测\n\n请告诉我您需要什么帮助？',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '',
      timestamp: new Date(),
      loading: true,
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 模拟AI响应
      const response = await simulateAIResponse(inputValue);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, content: response, loading: false }
            : msg
        )
      );
    } catch (error) {
      message.error('AI 响应失败，请重试');
      setMessages(prev => prev.filter(msg => msg.id !== aiMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (userInput: string): Promise<string> => {
    // 模拟AI处理时间
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = {
      '系统状态': `## 系统状态分析 📊

**当前系统运行状况：**
- ✅ 服务状态：正常
- 📈 CPU 使用率：45%
- 💾 内存使用率：78%
- 🌐 网络延迟：12ms
- 📨 消息吞吐量：1,234/分钟

**建议：**
- 内存使用率较高，建议检查缓存策略
- 考虑增加服务器资源以应对增长需求`,
      
      '租户分析': `## 租户数据分析 🏢

**租户统计：**
- 总租户数：156
- 活跃租户：142 (91%)
- 新增租户（本月）：23
- 流失租户（本月）：5

**热门功能：**
1. 实时消息推送 (89%)
2. 消息历史查询 (76%)
3. 用户管理 (65%)
4. API 集成 (58%)

**增长趋势：**
- 月增长率：15.3%
- 用户活跃度：78.2%
- 消息量增长：23.1%`,
      
      '性能优化': `## 性能优化建议 ⚡

**当前性能指标：**
- 🚀 API 响应时间：平均 45ms
- 📊 数据库查询：平均 12ms
- 🔄 缓存命中率：87%
- 📨 消息延迟：平均 8ms

**优化建议：**
1. **数据库优化**
   - 添加消息表索引
   - 优化查询语句
   - 考虑读写分离

2. **缓存策略**
   - 增加 Redis 集群
   - 优化缓存策略
   - 预热热点数据

3. **网络优化**
   - 启用 CDN
   - 压缩传输数据
   - 优化 WebSocket 连接`,
      
      '错误诊断': `## 错误诊断报告 🔍

**最近错误统计：**
- 总错误数：23 (过去24小时)
- 错误率：0.02%
- 主要错误类型：
  - 网络超时 (45%)
  - 数据库连接失败 (32%)
  - 认证失败 (23%)

**解决方案：**
1. **网络超时**
   - 增加超时时间
   - 添加重试机制
   - 优化网络配置

2. **数据库连接**
   - 检查连接池配置
   - 监控数据库性能
   - 添加连接重试

3. **认证问题**
   - 检查 JWT 配置
   - 验证用户权限
   - 更新认证策略`,
    };

    // 根据用户输入匹配响应
    for (const [key, response] of Object.entries(responses)) {
      if (userInput.includes(key)) {
        return response;
      }
    }

    // 默认响应
    return `## AI 助手回复 🤖

我理解您的问题："${userInput}"

**我的建议：**
- 请提供更具体的信息，我可以为您提供更精确的分析
- 您可以询问系统状态、租户分析、性能优化或错误诊断
- 我也可以帮您生成报告或预测趋势

**示例问题：**
- "分析系统状态"
- "查看租户数据"
- "性能优化建议"
- "错误诊断报告"`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-assistant" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 头部 */}
      <Card 
        style={{ 
          marginBottom: 16, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none'
        }}
      >
        <Space align="center">
          <Avatar 
            size={40} 
            icon={<RobotOutlined />} 
            style={{ backgroundColor: '#fff', color: '#667eea' }}
          />
          <div>
            <Title level={4} style={{ color: '#fff', margin: 0 }}>
              AI 智能助手
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
              智能分析 · 实时诊断 · 优化建议
            </Text>
          </div>
        </Space>
      </Card>

      {/* 消息列表 */}
      <Card 
        style={{ 
          flex: 1, 
          overflow: 'hidden',
          background: '#f8f9fa'
        }}
        bodyStyle={{ 
          height: '100%', 
          padding: 16,
          overflow: 'auto'
        }}
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: 16 }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                {msg.type === 'ai' && (
                  <Avatar 
                    icon={<RobotOutlined />} 
                    style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                  />
                )}
                
                <Card
                  size="small"
                  style={{
                    maxWidth: '70%',
                    background: msg.type === 'user' ? '#1890ff' : '#fff',
                    border: msg.type === 'user' ? 'none' : '1px solid #e8e8e8',
                  }}
                  bodyStyle={{ padding: 12 }}
                >
                  {msg.loading ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
                      <Text style={{ marginLeft: 8, color: '#666' }}>AI 正在思考...</Text>
                    </div>
                  ) : (
                    <div>
                      {msg.type === 'ai' ? (
                        <ReactMarkdown 
                          components={{
                            h2: ({children}) => <Title level={4} style={{margin: '8px 0'}}>{children}</Title>,
                            p: ({children}) => <Text style={{color: '#333'}}>{children}</Text>,
                            ul: ({children}) => <ul style={{margin: '8px 0', paddingLeft: 20}}>{children}</ul>,
                            li: ({children}) => <li style={{margin: '4px 0'}}>{children}</li>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <Text style={{ color: '#fff' }}>{msg.content}</Text>
                      )}
                    </div>
                  )}
                </Card>

                {msg.type === 'user' && (
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ backgroundColor: '#52c41a', marginLeft: 8 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Card>

      {/* 输入区域 */}
      <Card style={{ marginTop: 16 }}>
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题，按 Enter 发送，Shift+Enter 换行..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ flex: 1 }}
            disabled={isLoading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
            style={{ height: 'auto' }}
          >
            发送
          </Button>
        </Space.Compact>
        
        <div style={{ marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            提示：您可以询问系统状态、租户分析、性能优化或错误诊断等问题
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant; 