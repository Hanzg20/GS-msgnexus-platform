import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  MessageSquare, 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient from '../../services/api';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  planType: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  userCount: number;
  messageCount: number;
  createdAt: string;
  lastActive: string;
  config: {
    maxUsers: number;
    maxMessages: number;
    features: string[];
  };
}

const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    planType: '',
    search: ''
  });

  // 获取租户列表
  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/v1/tenants');
      if (response.success) {
        setTenants(response.data);
      }
    } catch (error: any) {
      console.error('获取租户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建租户
  const createTenant = async (tenantData: any) => {
    try {
      const response = await apiClient.post('/api/v1/tenants', tenantData);
      if (response.success) {
        fetchTenants();
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error('创建租户失败:', error);
    }
  };

  // 更新租户
  const updateTenant = async (tenantId: string, updateData: any) => {
    try {
      const response = await apiClient.put(`/api/v1/tenants/${tenantId}`, updateData);
      if (response.success) {
        fetchTenants();
      }
    } catch (error: any) {
      console.error('更新租户失败:', error);
    }
  };

  // 删除租户
  const deleteTenant = async (tenantId: string) => {
    if (!confirm('确定要删除这个租户吗？')) return;
    
    try {
      const response = await apiClient.delete(`/api/v1/tenants/${tenantId}`);
      if (response.success) {
        fetchTenants();
      }
    } catch (error: any) {
      console.error('删除租户失败:', error);
    }
  };

  // 更新租户状态
  const updateTenantStatus = async (tenantId: string, status: string) => {
    try {
      const response = await apiClient.patch(`/api/v1/tenants/${tenantId}/status`, { status });
      if (response.success) {
        fetchTenants();
      }
    } catch (error: any) {
      console.error('更新租户状态失败:', error);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'suspended':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'enterprise':
        return <Star className="w-4 h-4 text-purple-500" />;
      case 'professional':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'basic':
        return <Zap className="w-4 h-4 text-green-500" />;
      default:
        return <Building className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'inactive':
        return '非活跃';
      case 'suspended':
        return '已暂停';
      default:
        return status;
    }
  };

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'enterprise':
        return '企业版';
      case 'professional':
        return '专业版';
      case 'basic':
        return '基础版';
      default:
        return planType;
    }
  };

  const filteredTenants = tenants.filter(tenant => 
    (!filters.status || tenant.status === filters.status) &&
    (!filters.planType || tenant.planType === filters.planType) &&
    (!filters.search || 
      tenant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(filters.search.toLowerCase()))
  );

  if (loading) {
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
          <p style={{ color: '#6b7280', fontSize: '18px' }}>正在加载租户数据...</p>
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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>租户管理</h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              管理系统租户、配置和状态
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="ghost" onClick={fetchTenants}>
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              刷新
            </Button>
            <Button variant="ghost">
              <Download style={{ width: '16px', height: '16px' }} />
              导出
            </Button>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus style={{ width: '16px', height: '16px' }} />
              创建租户
            </Button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* 统计卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>总租户数</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{tenants.length}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#22c55e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>活跃租户</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                  {tenants.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>总用户数</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                  {tenants.reduce((sum, t) => sum + t.userCount, 0)}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#8b5cf6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>总消息数</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                  {tenants.reduce((sum, t) => sum + t.messageCount, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 过滤器 */}
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '16px', 
                height: '16px', 
                color: '#9ca3af' 
              }} />
              <input
                type="text"
                placeholder="搜索租户名称或子域名..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">所有状态</option>
              <option value="active">活跃</option>
              <option value="inactive">非活跃</option>
              <option value="suspended">已暂停</option>
            </select>
            <select
              value={filters.planType}
              onChange={(e) => setFilters({ ...filters, planType: e.target.value })}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">所有套餐</option>
              <option value="basic">基础版</option>
              <option value="professional">专业版</option>
              <option value="enterprise">企业版</option>
            </select>
          </div>
        </Card>

        {/* 租户列表 */}
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>租户信息</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>套餐</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>状态</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>用户数</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>消息数</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>最后活跃</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <p style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                          {tenant.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          {tenant.subdomain}.msgnexus.com
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          创建于 {new Date(tenant.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getPlanIcon(tenant.planType)}
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {getPlanName(tenant.planType)}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusIcon(tenant.status)}
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {getStatusName(tenant.status)}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <p style={{ fontSize: '14px', color: '#374151' }}>
                        {tenant.userCount} / {tenant.config.maxUsers}
                      </p>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <p style={{ fontSize: '14px', color: '#374151' }}>
                        {tenant.messageCount.toLocaleString()}
                      </p>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>
                        {new Date(tenant.lastActive).toLocaleString()}
                      </p>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedTenant(tenant); setShowDetailsModal(true); }}
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateTenant(tenant.id, { name: tenant.name + ' (已更新)' })}
                        >
                          <Edit style={{ width: '16px', height: '16px' }} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateTenantStatus(tenant.id, tenant.status === 'active' ? 'suspended' : 'active')}
                        >
                          {tenant.status === 'active' ? <AlertTriangle style={{ width: '16px', height: '16px' }} /> : <CheckCircle style={{ width: '16px', height: '16px' }} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTenant(tenant.id)}
                        >
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 租户详情弹窗 */}
      {showDetailsModal && selectedTenant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>租户详情</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowDetailsModal(false)}>
                ✕
              </Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>租户名称</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedTenant.name}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>子域名</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedTenant.subdomain}.msgnexus.com</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>套餐类型</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{getPlanName(selectedTenant.planType)}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>状态</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{getStatusName(selectedTenant.status)}</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>用户数</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedTenant.userCount} / {selectedTenant.config.maxUsers}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>消息数</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedTenant.messageCount.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>功能特性</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedTenant.config.features.map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '12px',
                        padding: '2px 6px',
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        borderRadius: '4px'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>创建时间</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{new Date(selectedTenant.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>最后活跃</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{new Date(selectedTenant.lastActive).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement; 