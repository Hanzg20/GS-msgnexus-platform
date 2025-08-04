import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Key, 
  UserPlus, 
  UserMinus, 
  UserCheck, 
  UserX, 
  Settings,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Crown,
  UserCog
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import Card from './ui/Card';
import Button from './ui/Button';
import apiClient from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  tenantId?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  metadata: {
    department?: string;
    position?: string;
    phone?: string;
    avatar?: string;
    timezone?: string;
    language?: string;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  category: string;
  isSystem: boolean;
  createdAt: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  totalPermissions: number;
  systemPermissions: number;
  customPermissions: number;
  byRole: Record<string, number>;
  byStatus: {
    active: number;
    inactive: number;
    suspended: number;
  };
  byTenant: Record<string, number>;
}

const UserPermissionManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showRoleDetails, setShowRoleDetails] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions' | 'stats'>('users');
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    search: ''
  });

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/api/v1/users');
      if (response.success) {
        setUsers(response.data.users);
      }
    } catch (error: any) {
      console.error('获取用户列表失败:', error);
    }
  };

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const response = await apiClient.get('/api/v1/users/roles');
      if (response.success) {
        setRoles(response.data);
      }
    } catch (error: any) {
      console.error('获取角色列表失败:', error);
    }
  };

  // 获取权限列表
  const fetchPermissions = async () => {
    try {
      const response = await apiClient.get('/api/v1/users/permissions');
      if (response.success) {
        setPermissions(response.data);
      }
    } catch (error: any) {
      console.error('获取权限列表失败:', error);
    }
  };

  // 获取用户统计信息
  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/v1/users/stats');
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('获取用户统计信息失败:', error);
    }
  };

  // 创建用户
  const createUser = async (userData: any) => {
    try {
      const response = await apiClient.post('/api/v1/users', userData);
      if (response.success) {
        fetchUsers();
        fetchStats();
        setShowCreateUser(false);
      }
    } catch (error: any) {
      console.error('创建用户失败:', error);
    }
  };

  // 更新用户
  const updateUser = async (userId: string, updateData: any) => {
    try {
      const response = await apiClient.put(`/api/v1/users/${userId}`, updateData);
      if (response.success) {
        fetchUsers();
        fetchStats();
      }
    } catch (error: any) {
      console.error('更新用户失败:', error);
    }
  };

  // 删除用户
  const deleteUser = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？')) return;
    
    try {
      const response = await apiClient.delete(`/api/v1/users/${userId}`);
      if (response.success) {
        fetchUsers();
        fetchStats();
      }
    } catch (error: any) {
      console.error('删除用户失败:', error);
    }
  };

  // 更新用户状态
  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const response = await apiClient.patch(`/api/v1/users/${userId}/status`, { status });
      if (response.success) {
        fetchUsers();
        fetchStats();
      }
    } catch (error: any) {
      console.error('更新用户状态失败:', error);
    }
  };

  // 更新用户权限
  const updateUserPermissions = async (userId: string, permissions: string[]) => {
    try {
      const response = await apiClient.patch(`/api/v1/users/${userId}/permissions`, { permissions });
      if (response.success) {
        fetchUsers();
      }
    } catch (error: any) {
      console.error('更新用户权限失败:', error);
    }
  };

  // 创建角色
  const createRole = async (roleData: any) => {
    try {
      const response = await apiClient.post('/api/v1/users/roles', roleData);
      if (response.success) {
        fetchRoles();
        fetchStats();
        setShowCreateRole(false);
      }
    } catch (error: any) {
      console.error('创建角色失败:', error);
    }
  };

  // 更新角色
  const updateRole = async (roleId: string, updateData: any) => {
    try {
      const response = await apiClient.put(`/api/v1/users/roles/${roleId}`, updateData);
      if (response.success) {
        fetchRoles();
        fetchStats();
      }
    } catch (error: any) {
      console.error('更新角色失败:', error);
    }
  };

  // 删除角色
  const deleteRole = async (roleId: string) => {
    if (!confirm('确定要删除这个角色吗？')) return;
    
    try {
      const response = await apiClient.delete(`/api/v1/users/roles/${roleId}`);
      if (response.success) {
        fetchRoles();
        fetchStats();
      }
    } catch (error: any) {
      console.error('删除角色失败:', error);
    }
  };

  // 批量分配角色
  const batchAssignRole = async (userIds: string[], role: string) => {
    try {
      const response = await apiClient.post('/api/v1/users/batch-assign-role', { userIds, role });
      if (response.success) {
        fetchUsers();
        fetchStats();
      }
    } catch (error: any) {
      console.error('批量分配角色失败:', error);
    }
  };

  // 刷新数据
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchUsers(),
      fetchRoles(),
      fetchPermissions(),
      fetchStats()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'suspended':
        return <UserX className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-purple-500" />;
      case 'tenant_admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'operator':
        return <UserCog className="w-4 h-4 text-green-500" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return '超级管理员';
      case 'tenant_admin':
        return '租户管理员';
      case 'operator':
        return '操作员';
      case 'viewer':
        return '查看员';
      default:
        return role;
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

  if (loading && !stats) {
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
          <p style={{ color: '#6b7280', fontSize: '18px' }}>正在加载用户权限管理数据...</p>
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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>用户权限管理</h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              管理系统用户、角色和权限分配
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="ghost" onClick={refreshData}>
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              刷新
            </Button>
            <Button variant="primary" onClick={() => setShowCreateUser(true)}>
              <UserPlus style={{ width: '16px', height: '16px' }} />
              创建用户
            </Button>
            <Button variant="secondary" onClick={() => setShowCreateRole(true)}>
              <Shield style={{ width: '16px', height: '16px' }} />
              创建角色
            </Button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* 统计卡片 */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>总用户数</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.totalUsers}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#22c55e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>活跃用户</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.activeUsers}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>角色数量</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.totalRoles}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#8b5cf6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Key style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>权限数量</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.totalPermissions}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 标签页导航 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            {[
              { key: 'users', label: '用户管理', icon: <Users className="w-4 h-4" /> },
              { key: 'roles', label: '角色管理', icon: <Shield className="w-4 h-4" /> },
              { key: 'permissions', label: '权限管理', icon: <Key className="w-4 h-4" /> },
              { key: 'stats', label: '统计分析', icon: <BarChart3 className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
                  borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.key ? '600' : '400'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 用户管理标签页 */}
        {activeTab === 'users' && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>用户列表</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">所有状态</option>
                  <option value="active">活跃</option>
                  <option value="inactive">非活跃</option>
                  <option value="suspended">已暂停</option>
                </select>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">所有角色</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {getRoleName(role.name)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>用户信息</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>角色</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>状态</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>最后登录</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(user => 
                      (!filters.status || user.status === filters.status) &&
                      (!filters.role || user.role === filters.role)
                    )
                    .map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <p style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                            {user.fullName}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280' }}>
                            {user.username} • {user.email}
                          </p>
                          {user.metadata.department && (
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>
                              {user.metadata.department} • {user.metadata.position}
                            </p>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getRoleIcon(user.role)}
                          <span style={{ fontSize: '14px', color: '#374151' }}>
                            {getRoleName(user.role)}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusIcon(user.status)}
                          <span style={{ fontSize: '14px', color: '#374151' }}>
                            {getStatusName(user.status)}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '从未登录'}
                        </p>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { setSelectedUser(user); setShowUserDetails(true); }}
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                          >
                            {user.status === 'active' ? <Lock style={{ width: '16px', height: '16px' }} /> : <Unlock style={{ width: '16px', height: '16px' }} />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
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
        )}

        {/* 角色管理标签页 */}
        {activeTab === 'roles' && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>角色列表</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {roles.map((role) => (
                <div key={role.id} style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  backgroundColor: role.isSystem ? '#f0f9ff' : '#f9fafb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                        {getRoleName(role.name)}
                      </h4>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                        {role.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getRoleIcon(role.name)}
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {role.isSystem ? '系统角色' : '自定义角色'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {role.userCount} 个用户
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelectedRole(role); setShowRoleDetails(true); }}
                      >
                        <Eye style={{ width: '16px', height: '16px' }} />
                      </Button>
                      {!role.isSystem && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateRole(role.id, { description: role.description + ' (已更新)' })}
                          >
                            <Edit style={{ width: '16px', height: '16px' }} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRole(role.id)}
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>权限:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {role.permissions.slice(0, 3).map((perm, index) => (
                        <span
                          key={index}
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            backgroundColor: '#e5e7eb',
                            color: '#374151',
                            borderRadius: '4px'
                          }}
                        >
                          {perm}
                        </span>
                      ))}
                      {role.permissions.length > 3 && (
                        <span style={{ fontSize: '10px', color: '#6b7280' }}>
                          +{role.permissions.length - 3} 更多
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 权限管理标签页 */}
        {activeTab === 'permissions' && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>权限列表</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>权限名称</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>资源</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>操作</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>分类</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>类型</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <p style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                            {permission.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6b7280' }}>
                            {permission.description}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {permission.resource}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {permission.action}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          fontSize: '12px', 
                          padding: '2px 6px', 
                          backgroundColor: '#e5e7eb', 
                          color: '#374151', 
                          borderRadius: '4px' 
                        }}>
                          {permission.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          fontSize: '12px', 
                          padding: '2px 6px', 
                          backgroundColor: permission.isSystem ? '#dcfce7' : '#fef3c7', 
                          color: permission.isSystem ? '#166534' : '#92400e', 
                          borderRadius: '4px' 
                        }}>
                          {permission.isSystem ? '系统' : '自定义'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* 统计分析标签页 */}
        {activeTab === 'stats' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            <Card>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>用户状态分布</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: '活跃', value: stats.byStatus.active, color: '#22c55e' },
                      { name: '非活跃', value: stats.byStatus.inactive, color: '#f59e0b' },
                      { name: '已暂停', value: stats.byStatus.suspended, color: '#ef4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: '活跃', value: stats.byStatus.active, color: '#22c55e' },
                      { name: '非活跃', value: stats.byStatus.inactive, color: '#f59e0b' },
                      { name: '已暂停', value: stats.byStatus.suspended, color: '#ef4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>角色分布</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={Object.entries(stats.byRole).map(([role, count]) => ({ role: getRoleName(role), count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="role" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}
      </div>

      {/* 用户详情弹窗 */}
      {showUserDetails && selectedUser && (
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
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>用户详情</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowUserDetails(false)}>
                ✕
              </Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>用户名</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedUser.username}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>邮箱</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedUser.email}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>角色</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{getRoleName(selectedUser.role)}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>状态</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{getStatusName(selectedUser.status)}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>权限</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedUser.permissions.map((perm, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        borderRadius: '4px'
                      }}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>创建时间</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>最后更新</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{new Date(selectedUser.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPermissionManager; 