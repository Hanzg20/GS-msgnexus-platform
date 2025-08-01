import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space } from 'antd';
import { UserOutlined, MessageOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons';
import { api } from '../../services/api';

interface DashboardStats {
  totalTenants: number;
  activeUsers: number;
  totalMessages: number;
  systemStatus: string;
}

interface RecentActivity {
  id: string;
  time: string;
  event: string;
  user: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTenants: 0,
    activeUsers: 0,
    totalMessages: 0,
    systemStatus: 'loading'
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 获取系统概览数据
      const systemResponse = await api.get('/api/system/overview');
      if (systemResponse.success) {
        const metrics = systemResponse.data.metrics;
        setStats({
          totalTenants: metrics.totalTenants || 0,
          activeUsers: metrics.totalUsers || 0,
          totalMessages: metrics.totalMessages || 0,
          systemStatus: systemResponse.data.status || 'unknown'
        });
      }

      // 模拟最近活动数据
      setActivities([
        {
          id: '1',
          time: '2024-01-15 14:30',
          event: '新租户注册',
          user: 'TechCorp',
          status: 'success'
        },
        {
          id: '2',
          time: '2024-01-15 14:25',
          event: '系统备份',
          user: '系统',
          status: 'success'
        },
        {
          id: '3',
          time: '2024-01-15 14:20',
          event: '用户登录',
          user: 'admin@goldsky.com',
          status: 'success'
        }
      ]);
    } catch (error) {
      console.error('获取仪表板数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const activityColumns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '事件',
      dataIndex: 'event',
      key: 'event',
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>仪表板</h1>
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总租户数"
              value={stats.totalTenants}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={stats.activeUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日消息"
              value={stats.totalMessages}
              prefix={<MessageOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="系统状态"
              value={stats.systemStatus === 'healthy' ? '正常' : '异常'}
              prefix={<SettingOutlined />}
              loading={loading}
              valueStyle={{ color: stats.systemStatus === 'healthy' ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近活动 */}
      <Card title="最近活动" style={{ marginBottom: '24px' }}>
        <Table
          columns={activityColumns}
          dataSource={activities}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
      </Card>

      {/* 系统信息 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="系统信息">
            <p><strong>版本:</strong> 1.0.0</p>
            <p><strong>环境:</strong> 开发环境</p>
            <p><strong>启动时间:</strong> 2024-01-15 09:00:00</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="快速操作">
            <Space direction="vertical" style={{ width: '100%' }}>
              <a href="/tenants">管理租户</a>
              <a href="/users">管理用户</a>
              <a href="/messages">查看消息</a>
              <a href="/system">系统监控</a>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 