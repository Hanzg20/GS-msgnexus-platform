import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Alert, Space, Button, Tag, Table, Tooltip } from 'antd';
import { 
  MessageOutlined, 
  SendOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Pie, Column } from '@ant-design/charts';

interface Message {
  id: string;
  tenantId: string;
  tenantName: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: string;
  status: string;
  createdAt: string;
  deliveredAt?: string;
}

const MessageMonitor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      tenantId: '1',
      tenantName: 'Acme Corp',
      senderId: 'user1',
      senderName: '张三',
      content: '你好，这是一条测试消息',
      messageType: 'text',
      status: 'delivered',
      createdAt: '2024-01-20 14:30:00',
      deliveredAt: '2024-01-20 14:30:05',
    },
    {
      id: '2',
      tenantId: '2',
      tenantName: 'TechStart',
      senderId: 'user2',
      senderName: '李四',
      content: '系统状态如何？',
      messageType: 'text',
      status: 'pending',
      createdAt: '2024-01-20 14:35:00',
    },
    {
      id: '3',
      tenantId: '1',
      tenantName: 'Acme Corp',
      senderId: 'user3',
      senderName: '王五',
      content: '请查看附件',
      messageType: 'file',
      status: 'failed',
      createdAt: '2024-01-20 14:40:00',
    },
  ]);

  const [stats, setStats] = useState({
    totalMessages: 12500,
    deliveredMessages: 11800,
    pendingMessages: 450,
    failedMessages: 250,
    deliveryRate: 94.4,
    avgDeliveryTime: 2.3,
  });

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 10),
        deliveredMessages: prev.deliveredMessages + Math.floor(Math.random() * 8),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    delivered: 'green',
    pending: 'orange',
    failed: 'red',
  };

  const statusIcons = {
    delivered: <CheckCircleOutlined />,
    pending: <ClockCircleOutlined />,
    failed: <ExclamationCircleOutlined />,
  };

  const messageTypeColors = {
    text: 'blue',
    image: 'green',
    file: 'purple',
    system: 'orange',
  };

  const columns = [
    {
      title: '租户',
      dataIndex: 'tenantName',
      key: 'tenantName',
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: '发送者',
      dataIndex: 'senderName',
      key: 'senderName',
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 200, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '类型',
      dataIndex: 'messageType',
      key: 'messageType',
      render: (type: string) => (
        <Tag color={messageTypeColors[type as keyof typeof messageTypeColors]}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]} icon={statusIcons[status as keyof typeof statusIcons]}>
          {status === 'delivered' ? '已送达' : status === 'pending' ? '待发送' : '发送失败'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '送达时间',
      dataIndex: 'deliveredAt',
      key: 'deliveredAt',
      render: (time: string) => time || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Message) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} />
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
  const messageTrendData = [
    { time: '00:00', messages: 120 },
    { time: '04:00', messages: 85 },
    { time: '08:00', messages: 320 },
    { time: '12:00', messages: 450 },
    { time: '16:00', messages: 380 },
    { time: '20:00', messages: 280 },
  ];

  const messageTypeData = [
    { type: '文本消息', value: 65 },
    { type: '图片消息', value: 20 },
    { type: '文件消息', value: 10 },
    { type: '系统消息', value: 5 },
  ];

  const tenantMessageData = [
    { tenant: 'Acme Corp', messages: 1234 },
    { tenant: 'TechStart', messages: 987 },
    { tenant: 'InnovateLab', messages: 756 },
    { tenant: 'DataFlow', messages: 654 },
    { tenant: 'CloudTech', messages: 543 },
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
          消息监控
        </h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          实时消息监控 · 投递状态跟踪 · AI 智能分析
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card>
              <Statistic
                title="总消息数"
                value={stats.totalMessages}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <Progress percent={100} showInfo={false} strokeColor="#1890ff" />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card>
              <Statistic
                title="已送达"
                value={stats.deliveredMessages}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress percent={stats.deliveryRate} showInfo={false} strokeColor="#52c41a" />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card>
              <Statistic
                title="待发送"
                value={stats.pendingMessages}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
              <Progress percent={(stats.pendingMessages / stats.totalMessages) * 100} showInfo={false} strokeColor="#faad14" />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <Card>
              <Statistic
                title="发送失败"
                value={stats.failedMessages}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
              <Progress percent={(stats.failedMessages / stats.totalMessages) * 100} showInfo={false} strokeColor="#f5222d" />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <Card title="消息趋势">
              <Line
                data={messageTrendData}
                xField="time"
                yField="messages"
                smooth
                animation={{
                  appear: {
                    animation: 'path-in',
                    duration: 1000,
                  },
                }}
                point={{
                  size: 4,
                  shape: 'circle',
                }}
                tooltip={{
                  showCrosshairs: true,
                }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <Card title="消息类型分布">
              <Pie
                data={messageTypeData}
                angleField="value"
                colorField="type"
                radius={0.8}
                label={{
                  type: 'outer',
                  content: '{name} {percentage}',
                }}
                interactions={[
                  {
                    type: 'element-active',
                  },
                ]}
                animation={{
                  appear: {
                    animation: 'fade-in',
                    duration: 1000,
                  },
                }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 租户消息排行 */}
      <motion.div variants={itemVariants}>
        <Card title="租户消息量排行" style={{ marginTop: 16 }}>
          <Column
            data={tenantMessageData}
            xField="tenant"
            yField="messages"
            label={{
              position: 'middle',
              style: {
                fill: '#FFFFFF',
                opacity: 0.6,
              },
            }}
            xAxis={{
              label: {
                autoRotate: true,
                autoHide: true,
                autoEllipsis: true,
              },
            }}
            animation={{
              appear: {
                animation: 'fade-in',
                duration: 1000,
              },
            }}
          />
        </Card>
      </motion.div>

      {/* 实时消息列表 */}
      <motion.div variants={itemVariants}>
        <Card 
          title="实时消息列表"
          extra={
            <Space>
              <Button icon={<ReloadOutlined />}>刷新</Button>
              <Button type="primary" icon={<ThunderboltOutlined />}>
                AI 分析
              </Button>
            </Space>
          }
          style={{ marginTop: 16 }}
        >
          <Table
            columns={columns}
            dataSource={messages}
            rowKey="id"
            pagination={{
              total: messages.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            }}
          />
        </Card>
      </motion.div>

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
                message="投递率优化"
                description="当前投递率 94.4%，建议优化网络配置"
                type="info"
                showIcon
              />
            </Col>
            <Col span={8}>
              <Alert
                message="失败消息分析"
                description="主要失败原因：网络超时，建议增加重试机制"
                type="warning"
                showIcon
              />
            </Col>
            <Col span={8}>
              <Alert
                message="性能建议"
                description="平均投递时间 2.3s，性能良好"
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

export default MessageMonitor; 