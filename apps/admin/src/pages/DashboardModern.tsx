import React, { useState, useEffect } from 'react';
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
import { safeRender, safeRenderArray } from '../utils/safeRender';

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

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280', fontSize: '18px' }}>正在加载系统数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* 头部 */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>仪表板</h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              欢迎回来！这里是您的系统概览和关键指标
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {safeRender(currentTime.toLocaleString())}
            </div>
            <Button variant="ghost">
              <Bell style={{ width: '16px', height: '16px' }} />
              通知
            </Button>
            <Button variant="ghost">
              <Settings style={{ width: '16px', height: '16px' }} />
              设置
            </Button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* 统计卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <StatCard
            title="总租户数"
            value={stats.tenants}
            icon={<Building2 style={{ width: '24px', height: '24px' }} />}
            color="primary"
            trend={{ value: 12, isPositive: true, label: '本月' }}
          />
          <StatCard
            title="活跃用户"
            value={stats.users}
            icon={<Users style={{ width: '24px', height: '24px' }} />}
            color="success"
            trend={{ value: 8, isPositive: true, label: '本周' }}
          />
          <StatCard
            title="消息总数"
            value={stats.messages}
            icon={<MessageSquare style={{ width: '24px', height: '24px' }} />}
            color="purple"
            trend={{ value: 15, isPositive: true, label: '今日' }}
          />
          <StatCard
            title="系统状态"
            value={stats.systemStatus}
            icon={<Shield style={{ width: '24px', height: '24px' }} />}
            color="success"
          />
        </div>

        {/* 图表区域 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <Card>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>消息趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>用户活跃度</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Area type="monotone" dataKey="active" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 系统状态和饼图 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          <Card>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>系统状态分布</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
              {pieData.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: item.color 
                  }} />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>系统资源使用</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>CPU 使用率</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{stats.cpuUsage}%</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${stats.cpuUsage}%`, 
                    height: '100%', 
                    backgroundColor: '#3b82f6',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>内存使用率</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{stats.memoryUsage}%</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${stats.memoryUsage}%`, 
                    height: '100%', 
                    backgroundColor: '#22c55e',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>磁盘使用率</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{stats.diskUsage}%</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${stats.diskUsage}%`, 
                    height: '100%', 
                    backgroundColor: '#f59e0b',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardModern; 