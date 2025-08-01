#!/bin/bash

# GoldSky MessageCore 管理前台快速启动脚本
# 基于 Ant Design Pro 的现代化管理界面

set -e

echo "🚀 GoldSky MessageCore 管理前台快速启动"
echo "=========================================="

# 检查环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js (推荐版本 18+)"
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn 未安装，请先安装 Yarn"
    exit 1
fi

echo "✅ 环境检查通过"

# 创建管理前台目录
ADMIN_DIR="apps/admin"
if [ ! -d "$ADMIN_DIR" ]; then
    mkdir -p "$ADMIN_DIR"
    echo "📁 创建管理前台目录: $ADMIN_DIR"
fi

cd "$ADMIN_DIR"

# 初始化 Ant Design Pro 项目
echo "📦 初始化 Ant Design Pro 项目..."
if [ ! -f "package.json" ]; then
    # 使用 create-umi 创建项目
    yarn create umi . --template ant-design-pro --yes
    
    echo "✅ Ant Design Pro 项目初始化完成"
else
    echo "⚠️  项目已存在，跳过初始化"
fi

# 安装额外依赖
echo "📚 安装额外依赖..."
yarn add @ant-design/charts @ant-design/icons dayjs lodash
yarn add -D @types/lodash

# 创建项目结构
echo "📂 创建项目结构..."
mkdir -p src/components/{Dashboard,TenantManager,MessageMonitor,SystemMonitor}
mkdir -p src/pages/{Dashboard,Tenant,Message,User,Monitor,Settings}
mkdir -p src/services
mkdir -p src/models
mkdir -p src/utils
mkdir -p src/hooks

# 创建基础配置文件
echo "⚙️  创建配置文件..."

# 创建 API 服务文件
cat > src/services/api.ts << 'EOL'
import { request } from '@umijs/max';

// 租户相关 API
export const tenantAPI = {
  list: (params: any) => request('/api/tenants', { params }),
  create: (data: any) => request('/api/tenants', { method: 'POST', data }),
  update: (id: string, data: any) => request(`/api/tenants/${id}`, { method: 'PUT', data }),
  delete: (id: string) => request(`/api/tenants/${id}`, { method: 'DELETE' }),
  detail: (id: string) => request(`/api/tenants/${id}`),
};

// 消息相关 API
export const messageAPI = {
  stats: () => request('/api/messages/stats'),
  list: (params: any) => request('/api/messages', { params }),
  monitor: () => request('/api/messages/monitor'),
};

// 用户相关 API
export const userAPI = {
  list: (params: any) => request('/api/users', { params }),
  create: (data: any) => request('/api/users', { method: 'POST', data }),
  update: (id: string, data: any) => request(`/api/users/${id}`, { method: 'PUT', data }),
  delete: (id: string) => request(`/api/users/${id}`, { method: 'DELETE' }),
};

// 监控相关 API
export const monitorAPI = {
  system: () => request('/api/monitor/system'),
  performance: () => request('/api/monitor/performance'),
  logs: () => request('/api/monitor/logs'),
};
EOL

# 创建 WebSocket Hook
cat > src/hooks/useWebSocket.ts << 'EOL'
import { useState, useEffect } from 'react';

export const useWebSocket = (url: string) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setData(message);
      } catch (err) {
        setError(err);
      }
    };

    ws.onerror = (error) => {
      setError(error);
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { data, error, connected };
};
EOL

# 创建仪表盘组件
cat > src/components/Dashboard/StatsCards.tsx << 'EOL'
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { TeamOutlined, UserOutlined, MessageOutlined, AlertOutlined } from '@ant-design/icons';

interface StatsCardsProps {
  data: {
    activeTenants: number;
    onlineUsers: number;
    messageThroughput: number;
    errorRate: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="活跃租户"
            value={data?.activeTenants || 0}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="在线用户"
            value={data?.onlineUsers || 0}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="消息吞吐量"
            value={data?.messageThroughput || 0}
            suffix="/分钟"
            prefix={<MessageOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="错误率"
            value={data?.errorRate || 0}
            suffix="%"
            prefix={<AlertOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatsCards;
EOL

# 创建租户管理组件
cat > src/components/TenantManager/TenantTable.tsx << 'EOL'
import React from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { tenantAPI } from '@/services/api';

const TenantTable: React.FC = () => {
  const columns = [
    {
      title: '租户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '子域名',
      dataIndex: 'subdomain',
      key: 'subdomain',
    },
    {
      title: '计划类型',
      dataIndex: 'planType',
      key: 'planType',
      render: (planType: string) => (
        <Tag color={planType === 'pro' ? 'blue' : 'green'}>
          {planType.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活跃' : '暂停'}
        </Tag>
      ),
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => console.log('编辑', record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log('删除', record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ProTable
      columns={columns}
      request={async (params) => {
        const response = await tenantAPI.list(params);
        return {
          data: response.data,
          total: response.total,
          success: true,
        };
      }}
      rowKey="id"
      search={{
        labelWidth: 120,
      }}
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => console.log('新增租户')}
        >
          新增租户
        </Button>,
      ]}
    />
  );
};

export default TenantTable;
EOL

# 更新路由配置
cat > config/routes.ts << 'EOL'
export default [
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    routes: [
      {
        path: '/dashboard',
        name: '仪表盘',
        icon: 'DashboardOutlined',
        component: './Dashboard',
      },
      {
        path: '/tenant',
        name: '租户管理',
        icon: 'TeamOutlined',
        routes: [
          {
            path: '/tenant/list',
            name: '租户列表',
            component: './Tenant',
          },
          {
            path: '/tenant/billing',
            name: '计费管理',
            component: './Tenant/Billing',
          },
        ],
      },
      {
        path: '/message',
        name: '消息管理',
        icon: 'MessageOutlined',
        routes: [
          {
            path: '/message/monitor',
            name: '消息监控',
            component: './Message/Monitor',
          },
          {
            path: '/message/analysis',
            name: '消息分析',
            component: './Message/Analysis',
          },
        ],
      },
      {
        path: '/user',
        name: '用户管理',
        icon: 'UserOutlined',
        component: './User',
      },
      {
        path: '/monitor',
        name: '系统监控',
        icon: 'MonitorOutlined',
        component: './Monitor',
      },
      {
        path: '/settings',
        name: '配置管理',
        icon: 'SettingOutlined',
        component: './Settings',
      },
    ],
  },
];
EOL

# 创建环境配置文件
cat > .env.local << 'EOL'
# GoldSky MessageCore Admin Environment
REACT_APP_API_BASE_URL=http://localhost:3030
REACT_APP_WS_URL=ws://localhost:3030
REACT_APP_TITLE=GoldSky MessageCore Admin
EOL

echo "✅ 管理前台项目结构创建完成"

# 启动开发服务器
echo "🎯 启动开发服务器..."
echo "📖 访问地址: http://localhost:8000"
echo "📚 API 文档: http://localhost:3030/docs"

# 询问是否立即启动
read -p "是否立即启动开发服务器? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    yarn dev
else
    echo "💡 手动启动命令: cd $ADMIN_DIR && yarn dev"
fi

echo "🎉 GoldSky MessageCore 管理前台设置完成!"
echo "📁 项目目录: $ADMIN_DIR"
echo "�� 下一步: 根据需求自定义组件和页面" 