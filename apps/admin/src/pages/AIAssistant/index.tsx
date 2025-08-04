import React, { useState } from 'react';
import { Send, Bot, User, Loader2, Settings, MessageSquare, Brain, Zap } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '你好！我是 MsgNexus AI 助手，有什么可以帮助你的吗？',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 模拟AI响应
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `我理解你的问题："${inputValue}"。让我为你提供一些建议...`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* 头部 */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>AI 助手</h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              智能客服和自动化处理助手
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="ghost">
              <Settings style={{ width: '16px', height: '16px' }} />
              设置
            </Button>
            <Button variant="primary">
              <Brain style={{ width: '16px', height: '16px' }} />
              训练模型
            </Button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', height: 'calc(100vh - 120px)' }}>
        {/* 聊天区域 */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '8px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    maxWidth: '70%'
                  }}>
                    {message.type === 'assistant' && (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Bot style={{ width: '16px', height: '16px', color: 'white' }} />
                      </div>
                    )}
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: message.type === 'user' ? '#3b82f6' : '#f3f4f6',
                      color: message.type === 'user' ? 'white' : '#374151',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      {message.content}
                    </div>
                    {message.type === 'user' && (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <User style={{ width: '16px', height: '16px', color: 'white' }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Bot style={{ width: '16px', height: '16px', color: 'white' }} />
                    </div>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      <span style={{ color: '#6b7280' }}>正在思考...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 输入区域 */}
            <div style={{ 
              borderTop: '1px solid #e5e7eb', 
              padding: '16px',
              display: 'flex',
              gap: '12px'
            }}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你的问题..."
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  resize: 'none',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  minHeight: '44px',
                  maxHeight: '120px'
                }}
              />
              <Button
                variant="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send style={{ width: '16px', height: '16px' }} />
              </Button>
            </div>
          </Card>
        </div>

        {/* 侧边栏 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 快速操作 */}
          <Card>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
              快速操作
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputValue('如何配置消息推送？')}
              >
                <MessageSquare style={{ width: '14px', height: '14px' }} />
                消息推送配置
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputValue('系统性能优化建议')}
              >
                <Zap style={{ width: '14px', height: '14px' }} />
                性能优化
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputValue('用户权限管理说明')}
              >
                <Settings style={{ width: '14px', height: '14px' }} />
                权限管理
              </Button>
            </div>
          </Card>

          {/* 统计信息 */}
          <Card>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
              对话统计
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>今日对话</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>24</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>平均响应时间</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>1.2s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>满意度</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>98%</span>
              </div>
            </div>
          </Card>

          {/* 模型信息 */}
          <Card>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
              模型信息
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>模型版本</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>v2.1.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>训练数据</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>10K+</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>准确率</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>95.8%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 