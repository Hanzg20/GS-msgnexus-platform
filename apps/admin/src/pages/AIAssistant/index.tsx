import React, { useState, useEffect } from 'react';
import AIFloatingAssistant from '../../components/AIFloatingAssistant';
import { motion } from 'framer-motion';
import { 
  Bot, 
  MessageCircle, 
  Settings, 
  HelpCircle, 
  Zap,
  Users,
  BarChart3,
  Globe
} from 'lucide-react';

const AIAssistantPage: React.FC = () => {
  const [assistants, setAssistants] = useState([
    {
      id: '1',
      name: 'AI助手小机器人',
      description: '智能聊天助手，随时为您服务',
      status: 'online',
      position: { x: window.innerWidth - 100, y: window.innerHeight - 100 }
    }
  ]);

  const [showAssistant, setShowAssistant] = useState(true);
  const [assistantConfig, setAssistantConfig] = useState({
    theme: 'default',
    language: 'zh-CN',
    autoReply: true,
    voiceEnabled: true
  });

  // 处理助手关闭
  const handleAssistantClose = (assistantId: string) => {
    if (assistantId === '1') {
      setShowAssistant(false);
    }
  };

  // 重新显示助手
  const handleShowAssistant = () => {
    setShowAssistant(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI助手管理中心
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            智能AI助手为您提供24/7全天候服务，支持多语言对话、语音交互、智能问答等功能
          </p>
        </motion.div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">智能对话</h3>
            <p className="text-gray-600">
              支持自然语言对话，理解上下文，提供准确、有用的回答
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">实时响应</h3>
            <p className="text-gray-600">
              毫秒级响应速度，支持实时语音识别和语音合成
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">多用户支持</h3>
            <p className="text-gray-600">
              支持多用户同时使用，个性化设置和对话历史记录
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">多语言支持</h3>
            <p className="text-gray-600">
              支持中文、英文等多种语言，智能语言切换
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">数据分析</h3>
            <p className="text-gray-600">
              智能分析用户行为，提供个性化建议和优化方案
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">智能配置</h3>
            <p className="text-gray-600">
              支持自定义配置，根据用户需求调整助手行为
            </p>
          </motion.div>
        </div>

        {/* 助手控制面板 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">助手控制</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShowAssistant}
                disabled={showAssistant}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showAssistant
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {showAssistant ? '已显示' : '显示助手'}
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                <Settings className="w-4 h-4 inline mr-2" />
                设置
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">助手状态</h3>
              <div className="space-y-3">
                {assistants.map((assistant) => (
                  <div key={assistant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        assistant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-800">{assistant.name}</p>
                        <p className="text-sm text-gray-500">{assistant.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assistant.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {assistant.status === 'online' ? '在线' : '离线'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">快速操作</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">开始对话</p>
                      <p className="text-sm text-gray-500">与AI助手进行智能对话</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">帮助中心</p>
                      <p className="text-sm text-gray-500">查看使用指南和常见问题</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">使用统计</p>
                      <p className="text-sm text-gray-500">查看助手使用情况和数据</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 悬浮AI助手 */}
      {showAssistant && (
        <AIFloatingAssistant
          position={assistants[0].position}
          onClose={() => handleAssistantClose('1')}
        />
      )}
    </div>
  );
};

export default AIAssistantPage; 