import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2, 
  Bot, 
  Send,
  Mic,
  MicOff,
  Settings,
  HelpCircle
} from 'lucide-react';
import './AIFloatingAssistant.css';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIFloatingAssistantProps {
  position?: { x: number; y: number };
  onClose?: () => void;
}

const AIFloatingAssistant: React.FC<AIFloatingAssistantProps> = ({ 
  position = { x: window.innerWidth - 100, y: window.innerHeight - 100 },
  onClose 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '你好！我是你的AI助手小机器人 🤖 有什么可以帮助你的吗？',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isHovered, setIsHovered] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const dragConstraints = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 处理拖拽
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    setCurrentPosition({
      x: info.point.x,
      y: info.point.y
    });
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsThinking(true);

    // 模拟AI响应
    setTimeout(() => {
      const responses = [
        "我理解你的问题，让我来帮你解决！",
        "这是一个很有趣的问题，我的建议是...",
        "根据我的分析，我认为...",
        "让我为你详细解释一下...",
        "这个问题我可以帮你处理，请稍等...",
        "基于当前的情况，我建议...",
        "我来为你提供一些解决方案...",
        "这个问题需要从几个方面来考虑..."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      setIsThinking(false);
    }, 1500 + Math.random() * 1000);
  };

  // 处理语音输入
  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // 这里可以集成语音识别API
    if (!isListening) {
      // 开始录音
      console.log('开始录音...');
    } else {
      // 停止录音
      console.log('停止录音...');
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 机器人动画状态
  const robotVariants = {
    idle: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    thinking: {
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    speaking: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <motion.div
      ref={dragConstraints}
      className="ai-assistant-container"
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        transform: 'translate(-50%, -50%)'
      }}
      drag
      dragMomentum={false}
      dragConstraints={dragConstraints}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* 聊天窗口 */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ai-chat-window absolute bottom-full right-0 mb-2 w-80 h-96"
              >
                {/* 聊天头部 */}
                <div className="ai-chat-header">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      variants={robotVariants}
                      animate={isThinking ? "thinking" : isTyping ? "speaking" : "idle"}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                    >
                      <Bot className="w-5 h-5 text-blue-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold">AI助手</h3>
                      <p className="text-xs opacity-90">
                        {isTyping ? '正在输入...' : isThinking ? '思考中...' : '在线'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 消息列表 */}
                <div className="ai-chat-messages">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`ai-message ${message.type}`}
                    >
                      <div className="ai-message-bubble">
                        <p className="text-sm">{message.content}</p>
                        <div className="ai-message-time">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ai-message assistant"
                    >
                      <div className="ai-typing-indicator">
                        <div className="ai-typing-dot"></div>
                        <div className="ai-typing-dot"></div>
                        <div className="ai-typing-dot"></div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 输入区域 */}
                <div className="ai-input-area">
                  <div className="ai-input-container">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入消息..."
                      className="ai-input-field"
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleVoiceInput}
                      className={`ai-voice-button ${isListening ? 'listening' : ''}`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="ai-send-button"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 机器人头像 */}
            <motion.div
              variants={robotVariants}
              animate={isThinking ? "thinking" : isTyping ? "speaking" : "idle"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative cursor-pointer ${
                isDragging ? 'z-50' : 'z-10'
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* 机器人主体 */}
              <div className="ai-robot-body w-16 h-16 flex items-center justify-center relative overflow-hidden">
                {/* 机器人眼睛 */}
                <div className="ai-robot-eyes">
                  <div className="ai-robot-eye left"></div>
                  <div className="ai-robot-eye right"></div>
                </div>
                
                {/* 机器人嘴巴 */}
                <div className="ai-robot-mouth"></div>
                
                {/* 机器人天线 */}
                <div className="ai-robot-antenna">
                  <div className="ai-antenna-stick"></div>
                  <div className="ai-antenna-light"></div>
                </div>

                {/* 机器人图标 */}
                <Bot className="w-6 h-6 text-white relative z-10" />
              </div>

              {/* 状态指示器 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isHovered || isTyping || isThinking ? 1 : 0 }}
                className="ai-status-indicator"
              />
            </motion.div>

            {/* 悬浮提示 */}
            <AnimatePresence>
              {isHovered && !isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="ai-tooltip"
                >
                  点击与我聊天
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 最小化状态 */}
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative"
          >
            <motion.div
              variants={robotVariants}
              animate="idle"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ai-robot-body w-12 h-12 flex items-center justify-center cursor-pointer"
              onClick={() => setIsMinimized(false)}
            >
              <Bot className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIFloatingAssistant; 