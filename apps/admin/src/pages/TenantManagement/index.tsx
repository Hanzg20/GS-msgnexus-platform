import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message, Tooltip, Avatar } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  TeamOutlined,
  UserOutlined,
  MessageOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Column } from '@ant-design/charts';

const { Option } = Select;

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  planType: string;
  status: string;
  userCount: number;
  messageCount: number;
  createdAt: string;
  lastActive: string;
}

const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      subdomain: 'acme',
      planType: 'enterprise',
      status: 'active',
      userCount: 1250,
      messageCount: 45678,
      createdAt: '2024-01-15',
      lastActive: '2024-01-20 14:30',
    },
    {
      id: '2',
      name: 'TechStart Inc',
      subdomain: 'techstart',
      planType: 'professional',
      status: 'active',
      userCount: 456,
      messageCount: 12345,
      createdAt: '2024-01-10',
      lastActive: '2024-01-20 15:45',
    },
    {
      id: '3',
      name: 'InnovateLab',
      subdomain: 'innovatelab',
      planType: 'basic',
      status: 'suspended',
      userCount: 89,
      messageCount: 2345,
      createdAt: '2024-01-05',
      lastActive: '2024-01-18 09:15',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [form] = Form.useForm();

  const planTypeColors = {
    basic: 'blue',
    professional: 'green',
    enterprise: 'purple',
  };

  const statusColors = {
    active: 'green',
    suspended: 'orange',
    inactive: 'red',
  };

  const columns = [
    {
      title: '租户名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Tenant) => (
        <Space>
          <Avatar icon={<TeamOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.subdomain}.messagecore.com</div>
          </div>
        </Space>
      ),
    },
    {
      title: '套餐类型',
      dataIndex: 'planType',
      key: 'planType',
      render: (planType: string) => (
        <Tag color={planTypeColors[planType as keyof typeof planTypeColors]}>
          {planType.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {status === 'active' ? '活跃' : status === 'suspended' ? '暂停' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <Space>
          <UserOutlined />
          {count.toLocaleString()}
        </Space>
      ),
    },
    {
      title: '消息数',
      dataIndex: 'messageCount',
      key: 'messageCount',
      render: (count: number) => (
        <Space>
          <MessageOutlined />
          {count.toLocaleString()}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Tenant) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button type="text">
              <EyeOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="AI 分析">
            <Button 
              type="text" 
              icon={<ThunderboltOutlined />} 
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    form.setFieldsValue(tenant);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingTenant) {
        setTenants(prev => 
          prev.map(tenant => 
            tenant.id === editingTenant.id 
              ? { ...tenant, ...values }
              : tenant
          )
        );
        message.success('租户信息更新成功');
      } else {
        const newTenant: Tenant = {
          id: Date.now().toString(),
          ...values,
          userCount: 0,
          messageCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          lastActive: new Date().toLocaleString(),
        };
        setTenants(prev => [...prev, newTenant]);
        message.success('租户创建成功');
      }
      setIsModalVisible(false);
      setEditingTenant(null);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTenant(null);
    form.resetFields();
  };

  // 租户增长数据
  const growthData = [
    { month: '1月', tenants: 45 },
    { month: '2月', tenants: 52 },
    { month: '3月', tenants: 61 },
    { month: '4月', tenants: 78 },
    { month: '5月', tenants: 89 },
    { month: '6月', tenants: 102 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          租户管理
        </h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          多租户 SaaS 管理 · 生命周期管理 · AI 分析
        </p>
      </div>

      {/* 统计卡片 */}
      <div style={{ marginBottom: 24 }}>
        <Card>
          <Column
            data={growthData}
            xField="month"
            yField="tenants"
            label={{
              position: 'middle',
              style: {
                fill: '#FFFFFF',
                opacity: 0.6,
              },
            }}
            title={{
              text: '租户增长趋势',
              style: {
                fontSize: 16,
                fontWeight: 'bold',
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
      </div>

      {/* 租户列表 */}
      <Card
        title="租户列表"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            新增租户
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={tenants}
          rowKey="id"
          pagination={{
            total: tenants.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑租户模态框 */}
      <Modal
        title={editingTenant ? '编辑租户' : '新增租户'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'active', planType: 'basic' }}
        >
          <Form.Item
            name="name"
            label="租户名称"
            rules={[{ required: true, message: '请输入租户名称' }]}
          >
            <Input placeholder="请输入租户名称" />
          </Form.Item>

          <Form.Item
            name="subdomain"
            label="子域名"
            rules={[{ required: true, message: '请输入子域名' }]}
          >
            <Input placeholder="请输入子域名" addonAfter=".messagecore.com" />
          </Form.Item>

          <Form.Item
            name="planType"
            label="套餐类型"
            rules={[{ required: true, message: '请选择套餐类型' }]}
          >
            <Select placeholder="请选择套餐类型">
              <Option value="basic">基础版</Option>
              <Option value="professional">专业版</Option>
              <Option value="enterprise">企业版</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">活跃</Option>
              <Option value="suspended">暂停</Option>
              <Option value="inactive">非活跃</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default TenantManagement; 