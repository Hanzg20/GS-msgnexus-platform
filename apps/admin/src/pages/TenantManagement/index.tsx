import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message, Tooltip, Avatar, Popconfirm } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  TeamOutlined,
  UserOutlined,
  MessageOutlined,
  ThunderboltOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Column } from '@ant-design/charts';
import { apiClient } from '../../services/api';

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
  config?: {
    maxUsers: number;
    maxMessages: number;
    features: string[];
  };
}

interface TenantStats {
  userCount: number;
  messageCount: number;
  userUsage: number;
  messageUsage: number;
  lastActive: string;
  uptime: string;
  responseTime: string;
}

const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

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

  // 获取租户列表
  const fetchTenants = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/v1/tenants?page=${page}&limit=${pageSize}`);
      
      if (response.data.success) {
        setTenants(response.data.data);
        setPagination({
          current: response.data.pagination.page,
          pageSize: response.data.pagination.limit,
          total: response.data.pagination.total
        });
      }
    } catch (error) {
      message.error('获取租户列表失败');
      console.error('获取租户列表错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建或更新租户
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingTenant) {
        // 更新租户
        const response = await apiClient.put(`/api/v1/tenants/${editingTenant.id}`, values);
        if (response.data.success) {
          message.success('租户更新成功');
          setIsModalVisible(false);
          form.resetFields();
          fetchTenants(pagination.current, pagination.pageSize);
        }
      } else {
        // 创建租户
        const response = await apiClient.post('/api/v1/tenants', values);
        if (response.data.success) {
          message.success('租户创建成功');
          setIsModalVisible(false);
          form.resetFields();
          fetchTenants(pagination.current, pagination.pageSize);
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('操作失败');
      }
      console.error('保存租户错误:', error);
    }
  };

  // 删除租户
  const handleDelete = async (tenantId: string) => {
    try {
      const response = await apiClient.delete(`/api/v1/tenants/${tenantId}`);
      if (response.data.success) {
        message.success('租户删除成功');
        fetchTenants(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      message.error('删除租户失败');
      console.error('删除租户错误:', error);
    }
  };

  // 更新租户状态
  const handleStatusChange = async (tenantId: string, status: string) => {
    try {
      const response = await apiClient.patch(`/api/v1/tenants/${tenantId}/status`, { status });
      if (response.data.success) {
        message.success('状态更新成功');
        fetchTenants(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      message.error('状态更新失败');
      console.error('状态更新错误:', error);
    }
  };

  // 查看租户详情
  const handleViewDetails = async (tenant: Tenant) => {
    try {
      const response = await apiClient.get(`/api/v1/tenants/${tenant.id}/stats`);
      if (response.data.success) {
        const stats: TenantStats = response.data.data;
        Modal.info({
          title: `${tenant.name} - 详细信息`,
          width: 600,
          content: (
            <div>
              <p><strong>租户名称:</strong> {tenant.name}</p>
              <p><strong>子域名:</strong> {tenant.subdomain}.msgnexus.com</p>
              <p><strong>套餐类型:</strong> {tenant.planType}</p>
              <p><strong>状态:</strong> {tenant.status}</p>
              <p><strong>用户数量:</strong> {stats.userCount} / {tenant.config?.maxUsers}</p>
              <p><strong>消息数量:</strong> {stats.messageCount} / {tenant.config?.maxMessages}</p>
              <p><strong>用户使用率:</strong> {stats.userUsage}%</p>
              <p><strong>消息使用率:</strong> {stats.messageUsage}%</p>
              <p><strong>最后活跃:</strong> {stats.lastActive}</p>
              <p><strong>运行时间:</strong> {stats.uptime}</p>
              <p><strong>响应时间:</strong> {stats.responseTime}</p>
            </div>
          )
        });
      }
    } catch (error) {
      message.error('获取租户详情失败');
      console.error('获取租户详情错误:', error);
    }
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    form.setFieldsValue(tenant);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTenant(null);
    form.resetFields();
  };

  const handleTableChange = (pagination: any) => {
    fetchTenants(pagination.current, pagination.pageSize);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

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
            <div style={{ fontSize: '12px', color: '#666' }}>{record.subdomain}.msgnexus.com</div>
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
          {planType === 'basic' ? '基础版' : 
           planType === 'professional' ? '专业版' : '企业版'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Tenant) => (
        <Select
          value={status}
          style={{ width: 100 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="active">活跃</Option>
          <Option value="suspended">暂停</Option>
          <Option value="inactive">停用</Option>
        </Select>
      ),
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (userCount: number, record: Tenant) => (
        <div>
          <div>{userCount.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            限制: {record.config?.maxUsers?.toLocaleString() || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: '消息数量',
      dataIndex: 'messageCount',
      key: 'messageCount',
      render: (messageCount: number, record: Tenant) => (
        <div>
          <div>{messageCount.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            限制: {record.config?.maxMessages?.toLocaleString() || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: Tenant) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" onClick={() => handleViewDetails(record)}>
              <EyeOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="text" onClick={() => handleEdit(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>
          <Popconfirm
            title="确定要删除这个租户吗？"
            description="此操作不可撤销，将删除所有相关数据。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button type="text" danger>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">租户管理</h1>
              <p className="text-gray-600">管理系统中的所有租户和他们的配置</p>
            </div>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => fetchTenants(pagination.current, pagination.pageSize)}
                loading={loading}
              >
                刷新
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingTenant(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                新建租户
              </Button>
            </Space>
          </div>
        </div>

        <Card>
          <Table
            columns={columns}
            dataSource={tenants}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
            onChange={handleTableChange}
          />
        </Card>

        <Modal
          title={editingTenant ? '编辑租户' : '新建租户'}
          open={isModalVisible}
          onOk={handleSave}
          onCancel={handleCancel}
          width={600}
          okText="保存"
          cancelText="取消"
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
              rules={[
                { required: true, message: '请输入子域名' },
                { pattern: /^[a-z0-9-]+$/, message: '子域名只能包含小写字母、数字和连字符' }
              ]}
            >
              <Input placeholder="请输入子域名" addonAfter=".msgnexus.com" />
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
                <Option value="inactive">停用</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </motion.div>
    </div>
  );
};

export default TenantManagement; 