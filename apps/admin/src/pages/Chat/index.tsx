import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, List, Avatar, Space, Typography, Divider, message } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { io, Socket } from 'socket.io-client';
import './Chat.css';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface ChatMessage {
  id: string;
  roomId: string;
  message: string;
  userId: string;
  userName: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [userName, setUserName] = useState('User_' + Math.random().toString(36).substr(2, 5));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 连接到WebSocket服务器
  useEffect(() => {
    const newSocket = io('http://localhost:3031', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      message.success('已连接到聊天服务器');
      
      // 加入默认房间
      newSocket.emit('join-room', roomId);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
      message.warning('与聊天服务器断开连接');
    });

    newSocket.on('new-message', (messageData: ChatMessage) => {
      setMessages(prev => [...prev, messageData]);
    });

    newSocket.on('user-joined', (data) => {
      message.info(`${data.userId} 加入了聊天室`);
    });

    newSocket.on('user-left', (data) => {
      message.info(`${data.userId} 离开了聊天室`);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      message.error('连接错误');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [roomId]);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息
  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !isConnected) {
      return;
    }

    const messageData = {
      roomId: roomId,
      message: inputMessage.trim(),
      userId: socket.id,
      userName: userName
    };

    socket.emit('send-message', messageData);
    setInputMessage('');
  };

  // 处理回车键发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 切换房间
  const joinRoom = (newRoomId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-room', roomId);
      socket.emit('join-room', newRoomId);
      setRoomId(newRoomId);
      setMessages([]);
      message.success(`已切换到房间: ${newRoomId}`);
    }
  };

  return (
    <div className="chat-container">
      <Card 
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              💬 即时聊天
            </Title>
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '🟢 已连接' : '🔴 未连接'}
            </div>
          </Space>
        }
        extra={
          <Space>
            <Text>房间: {roomId}</Text>
            <Text>用户: {userName}</Text>
          </Space>
        }
        className="chat-card"
      >
        {/* 房间选择 */}
        <div className="room-selector">
          <Space>
            <Button 
              type={roomId === 'general' ? 'primary' : 'default'}
              onClick={() => joinRoom('general')}
            >
              公共房间
            </Button>
            <Button 
              type={roomId === 'support' ? 'primary' : 'default'}
              onClick={() => joinRoom('support')}
            >
              客服支持
            </Button>
            <Button 
              type={roomId === 'tech' ? 'primary' : 'default'}
              onClick={() => joinRoom('tech')}
            >
              技术讨论
            </Button>
          </Space>
        </div>

        <Divider />

        {/* 消息列表 */}
        <div className="messages-container">
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <List.Item className={`message-item ${msg.userId === socket?.id ? 'own-message' : 'other-message'}`}>
                <div className="message-content">
                  <div className="message-header">
                    <Avatar 
                      icon={msg.userId === socket?.id ? <UserOutlined /> : <RobotOutlined />}
                      className={msg.userId === socket?.id ? 'own-avatar' : 'other-avatar'}
                    />
                    <Text strong className="user-name">
                      {msg.userName}
                    </Text>
                    <Text type="secondary" className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Text>
                  </div>
                  <div className="message-text">
                    {msg.message}
                  </div>
                </div>
              </List.Item>
            )}
            locale={{
              emptyText: (
                <div className="empty-messages">
                  <Text type="secondary">暂无消息，开始聊天吧！</Text>
                </div>
              )
            }}
          />
          <div ref={messagesEndRef} />
        </div>

        <Divider />

        {/* 消息输入 */}
        <div className="message-input">
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息... (按Enter发送，Shift+Enter换行)"
              autoSize={{ minRows: 2, maxRows: 4 }}
              disabled={!isConnected}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              style={{ height: 'auto' }}
            >
              发送
            </Button>
          </Space.Compact>
        </div>
      </Card>
    </div>
  );
};

export default Chat; 