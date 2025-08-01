import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  MessageSquare, 
  Activity,
  BarChart3,
  TrendingUp,
  Shield,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';

const DashboardModern: React.FC = () => {
  const [stats, setStats] = useState({
    tenants: 25,
    users: 1234,
    messages: 5678,
    systemStatus: '正常',
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 32,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // 模拟图表数据
  const messageData = [
    { name: '00:00', messages: 120 },
    { name: '04:00', messages: 80 },
    { name: '08:00', messages: 200 },
    { name: '12:00', messages: 350 },
    { name: '16:00', messages: 280 },
    { name: '20:00', messages: 180 },
    { name: '24:00', messages: 150 },
  ];

  const userActivityData = [
    { name: '周一', active: 65 },
    { name: '周二', active: 72 },
    { name: '周三', active: 68 },
    { name: '周四', active: 85 },
    { name: '周五', active: 78 },
    { name: '周六', active: 45 },
    { name: '周日', active: 52 },
  ];

  const pieData = [
    { name: '正常', value: 75, color: '#22c55e' },
    { name: '警告', value: 15, color: '#f59e0b' },
    { name: '错误', value: 10, color: '#ef4444' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">正在加载系统数据...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
            <p className="text-gray-600 mt-1">
              欢迎回来！这里是您的系统概览和关键指标
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Button variant="ghost" icon={<Bell className="w-5 h-5" />}></Button>
            <Button variant="ghost" icon={<Settings className="w-5 h-5" />}></Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* 统计卡片 */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="总租户数"
              value={stats.tenants}
              icon={<Building2 className="w-6 h-6" />}
              trend={{ value: 12, isPositive: true, label: '本月' }}
              color="primary"
            />
            <StatCard
              title="活跃用户"
              value={stats.users.toLocaleString()}
              icon={<Users className="w-6 h-6" />}
              trend={{ value: 8, isPositive: true, label: '本周' }}
              color="success"
            />
            <StatCard
              title="今日消息"
              value={stats.messages.toLocaleString()}
              icon={<MessageSquare className="w-6 h-6" />}
              trend={{ value: 15, isPositive: true, label: '今日' }}
              color="warning"
            />
            <StatCard
              title="系统状态"
              value={stats.systemStatus}
              icon={<Shield className="w-6 h-6" />}
              color="purple"
            />
          </motion.div>

          {/* 图表区域 */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">消息流量趋势</h3>
                <Button variant="ghost" size="sm">查看详情</Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={messageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="messages"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">用户活跃度</h3>
                <Button variant="ghost" size="sm">查看详情</Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* 系统监控和状态 */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">系统状态分布</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">系统资源监控</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">CPU 使用率</span>
                    <span className="text-sm font-medium text-gray-900">{stats.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.cpuUsage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-primary-500 h-2 rounded-full"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">内存使用率</span>
                    <span className="text-sm font-medium text-gray-900">{stats.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.memoryUsage}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="bg-warning-500 h-2 rounded-full"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">磁盘使用率</span>
                    <span className="text-sm font-medium text-gray-900">{stats.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.diskUsage}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                      className="bg-success-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  className="w-full justify-start"
                  icon={<Users className="w-4 h-4" />}
                >
                  管理用户
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  icon={<Building2 className="w-4 h-4" />}
                >
                  租户配置
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  icon={<MessageSquare className="w-4 h-4" />}
                >
                  消息监控
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start"
                  icon={<Activity className="w-4 h-4" />}
                >
                  系统监控
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardModern; 