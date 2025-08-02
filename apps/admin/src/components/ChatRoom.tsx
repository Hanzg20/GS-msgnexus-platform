import React, { useState, useEffect, useRef } from 'react';
import realtimeService from '../services/realtime';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface User {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'away';
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: '管理员', status: 'online' },
    { id: '2', name: '用户1', status: 'online' },
    { id: '3', name: '用户2', status: 'away' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [currentUserId] = useState('1'); // 模拟当前用户ID
  const [currentTenantId] = useState('1'); // 模拟当前租户ID
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 连接实时服务
    realtimeService.connect().then(() => {
      console.log('Connected to realtime service');
      realtimeService.joinTenant(currentTenantId);
    }).catch(error => {
      console.error('Failed to connect to realtime service:', error);
    });

    // 注册事件处理器
    realtimeService.onMessage(handleNewMessage);
    realtimeService.onStatusChange(handleUserStatusChange);
    realtimeService.onTyping(handleTypingIndicator);

    // 清理函数
    return () => {
      realtimeService.disconnect();
    };
  }, []);

  useEffect(() => {
    // 自动滚动到底部
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewMessage = (message: any) => {
    const newMsg: Message = {
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      timestamp: message.timestamp,
      isOwn: message.senderId === currentUserId,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleUserStatusChange = (status: any) => {
    setUsers(prev => prev.map(user => 
      user.id === status.userId 
        ? { ...user, status: status.status }
        : user
    ));
  };

  const handleTypingIndicator = (typing: any) => {
    if (typing.isTyping) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.add(typing.userId);
        return Array.from(newSet);
      });
    } else {
      setTypingUsers(prev => prev.filter(id => id !== typing.userId));
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    realtimeService.sendMessage({
      tenantId: currentTenantId,
      senderId: currentUserId,
      content: newMessage,
    });

    setNewMessage('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      realtimeService.startTyping({
        tenantId: currentTenantId,
        userId: currentUserId,
      });
    }

    // 停止输入指示器
    clearTimeout((window as any).typingTimeout);
    (window as any).typingTimeout = setTimeout(() => {
      setIsTyping(false);
      realtimeService.stopTyping({
        tenantId: currentTenantId,
        userId: currentUserId,
      });
    }, 1000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUserName = (userId: string) => {
    return users.find(user => user.id === userId)?.name || 'Unknown User';
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* 用户列表 */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">在线用户</h3>
          <p className="text-sm text-gray-500">{users.length} 个用户</p>
        </div>
        <div className="p-4">
          {users.map(user => (
            <div key={user.id} className="flex items-center space-x-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${
                user.status === 'online' ? 'bg-green-500' :
                user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 聊天头部 */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">MsgNexus 聊天室</h2>
          <p className="text-sm text-gray-500">租户: {currentTenantId}</p>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isOwn
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                {!message.isOwn && (
                  <div className="text-xs text-gray-500 mb-1">
                    {getUserName(message.senderId)}
                  </div>
                )}
                <div className="text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.isOwn ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {/* 输入指示器 */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="text-xs text-gray-500">
                  {typingUsers.map(id => getUserName(id)).join(', ')} 正在输入...
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="输入消息..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              发送
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            按 Enter 发送，Shift + Enter 换行
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom; 