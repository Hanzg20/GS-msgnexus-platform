import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Alert, Space, Button, Tag, Table, Tooltip } from 'antd';
import { 
  MonitorOutlined, 
  DatabaseOutlined, 
  CloudOutlined, 
  ThunderboltOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Gauge } from '@ant-design/charts';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
}

const SystemMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: '1',
      name: 'CPU 使用率',
      value: 45,
      unit: '%',
      status: 'normal',
      timestamp: '2024-01-20 15:00:00',
    },
    {
      id: '2',
      name: '内存使用率',
      value: 78,
      unit: '%',
      status: 'warning',
      timestamp: '2024-01-20 15:00:00',
    },
    {
      id: '3',
      name: '磁盘使用率',
      value: 23,
      unit: '%',
      status: 'normal',
      timestamp: '2024-01-20 15:00:00',
    },
    {
      id: '4',
      name: '网络延迟',
      value: 12,
      unit: 'ms',
      status: 'normal',
      timestamp: '2024-01-20 15:00:00',
    },
  ]);

  const [systemStatus, setSystemStatus] = useState({
    overall: 'healthy',
    uptime: '15天 8小时 32分钟',
    lastRestart: '2024-01-05 06:30:00',
    activeConnections: 1234,
    totalRequests: 56789,
  });

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => 
        prev.map(metric => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 10,
          timestamp: new Date().toLocaleString(),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    normal: 'green',
    warning: 'orange',
    critical: 'red',
  };

  const statusIcons = {
    normal: <CheckCircleOutlined />,
    warning: <ClockCircleOutlined />,
    critical: <ExclamationCircleOutlined />,
  };

  const columns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '当前值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, record: SystemMetric) => (
        <span style={{ fontWeight: 'bold' }}>
          {value.toFixed(1)}{record.unit}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]} icon={statusIcons[status as keyof typeof statusIcons]}>
          {status === 'normal' ? '正常' : status === 'warning' ? '警告' : '严重'}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SystemMetric) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button type="text">
              <MonitorOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="AI 分析">
            <Button 
              type="text" 
              icon={<ThunderboltOutlined />} 
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 图表数据
  const performanceData = [
    { time: '00:00', cpu: 45, memory: 78, disk: 23 },
    { time: '04:00', cpu: 52, memory: 82, disk: 31 },
    { time: '08:00', cpu: 38, memory: 65, disk: 18 },
    { time: '12:00', cpu: 67, memory: 89, disk: 45 },
    { time: '16:00', cpu: 58, memory: 76, disk: 28 },
    { time: '20:00', cpu: 42, memory: 71, disk: 22 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          系统监控
        </h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          实时性能监控 · 系统状态跟踪 · AI 预测分析
        </p>
      </div>

      {/* 系统状态概览 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card>
              <Statistic
                title="系统状态"
                value={systemStatus.overall === 'healthy' ? '健康' : '异常'}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: systemStatus.overall === 'healthy' ? '#52c41a' : '#f5222d' }}
              />
              <Progress 
                percent={systemStatus.overall === 'healthy' ? 100 : 60} 
                showInfo={false} 
                strokeColor={systemStatus.overall === 'healthy' ? '#52c41a' : '#f5222d'} 
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card>
              <Statistic
                title="运行时间"
                value={systemStatus.uptime}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ fontSize: '14px' }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card>
              <Statistic
                title="活跃连接"
                value={systemStatus.activeConnections}
                prefix={<CloudOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card>
              <Statistic
                title="总请求数"
                value={systemStatus.totalRequests}
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 性能监控图表 */}
      <motion.div variants={itemVariants}>
        <Card title="系统性能趋势" style={{ marginTop: 16 }}>
          <Line
            data={performanceData}
            xField="time"
            yField="value"
            seriesField="metric"
            smooth
            animation={{
              appear: {
                animation: 'path-in',
                duration: 1000,
              },
            }}
            color={['#1890ff', '#52c41a', '#faad14']}
            point={{
              size: 4,
              shape: 'circle',
            }}
            tooltip={{
              showCrosshairs: true,
              shared: true,
            }}
          />
        </Card>
      </motion.div>

      {/* 实时指标监控 */}
      <motion.div variants={itemVariants}>
        <Card 
          title="实时指标监控"
          extra={
            <Space>
              <Button>
                <ReloadOutlined />
                刷新
              </Button>
              <Button type="primary">
                <ThunderboltOutlined />
                AI 预测
              </Button>
            </Space>
          }
          style={{ marginTop: 16 }}
        >
          <Table
            columns={columns}
            dataSource={metrics}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </motion.div>

      {/* 仪表盘 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants}>
            <Card title="CPU 使用率">
              <Gauge
                percent={0.45}
                range={{
                  color: ['l(0) 0:#B8E1FF 1:#3D76DD'],
                }}
                startAngle={Math.PI}
                endAngle={2 * Math.PI}
                indicator={null}
                statistic={{
                  title: {
                    offsetY: -36,
                    style: {
                      fontSize: '36px',
                      color: '#4B535E',
                    },
                    formatter: () => '45%',
                  },
                  content: {
                    style: {
                      fontSize: '24px',
                      lineHeight: '44px',
                      color: '#4B535E',
                    },
                    formatter: () => '正常',
                  },
                }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants}>
            <Card title="内存使用率">
              <Gauge
                percent={0.78}
                range={{
                  color: ['l(0) 0:#FFD666 1:#FAAD14'],
                }}
                startAngle={Math.PI}
                endAngle={2 * Math.PI}
                indicator={null}
                statistic={{
                  title: {
                    offsetY: -36,
                    style: {
                      fontSize: '36px',
                      color: '#4B535E',
                    },
                    formatter: () => '78%',
                  },
                  content: {
                    style: {
                      fontSize: '24px',
                      lineHeight: '44px',
                      color: '#4B535E',
                    },
                    formatter: () => '警告',
                  },
                }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants}>
            <Card title="磁盘使用率">
              <Gauge
                percent={0.23}
                range={{
                  color: ['l(0) 0:#87D068 1:#52C41A'],
                }}
                startAngle={Math.PI}
                endAngle={2 * Math.PI}
                indicator={null}
                statistic={{
                  title: {
                    offsetY: -36,
                    style: {
                      fontSize: '36px',
                      color: '#4B535E',
                    },
                    formatter: () => '23%',
                  },
                  content: {
                    style: {
                      fontSize: '24px',
                      lineHeight: '44px',
                      color: '#4B535E',
                    },
                    formatter: () => '正常',
                  },
                }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* AI 智能建议 */}
      <motion.div variants={itemVariants}>
        <Card 
          title={
            <Space>
              <ThunderboltOutlined style={{ color: '#1890ff' }} />
              AI 智能建议
              <Tag color="green">实时分析</Tag>
            </Space>
          }
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Alert
                message="内存优化"
                description="内存使用率 78%，建议检查内存泄漏"
                type="warning"
                showIcon
              />
            </Col>
            <Col span={8}>
              <Alert
                message="性能预测"
                description="预计 2 小时后 CPU 使用率将达到峰值"
                type="info"
                showIcon
              />
            </Col>
            <Col span={8}>
              <Alert
                message="系统健康"
                description="整体系统运行良好，无需立即干预"
                type="success"
                showIcon
              />
            </Col>
          </Row>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SystemMonitor; 