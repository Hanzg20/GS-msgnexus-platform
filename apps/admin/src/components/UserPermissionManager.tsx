import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Key, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { safeRender, safeRenderArray } from '../utils/safeRender';

// 定义类型
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  permissions: string[];
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isGranted: boolean;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  byRole: Record<string, number>;
  byStatus: Record<string, number>;
}

const UserPermissionManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    byRole: {},
    byStatus: {}
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const tabs = [
    { key: 'users', label: '用户管理', icon: <Users className="w-4 h-4" /> },
    { key: 'roles', label: '角色管理', icon: <Shield className="w-4 h-4" /> },
    { key: 'permissions', label: '权限管理', icon: <Key className="w-4 h-4" /> },
    { key: 'stats', label: '统计分析', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 模拟 API 调用
      const mockUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          email: 'admin@msgnexus.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-01-15T10:30:00Z',
          permissions: ['read', 'write', 'delete', 'admin'],
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          username: 'manager',
          email: 'manager@msgnexus.com',
          role: 'manager',
          status: 'active',
          lastLogin: '2024-01-14T15:45:00Z',
          permissions: ['read', 'write'],
          createdAt: '2024-01-02T00:00:00Z'
        },
        {
          id: '3',
          username: 'user1',
          email: 'user1@msgnexus.com',
          role: 'user',
          status: 'active',
          lastLogin: '2024-01-13T09:20:00Z',
          permissions: ['read'],
          createdAt: '2024-01-03T00:00:00Z'
        }
      ];

      const mockRoles: Role[] = [
        {
          id: '1',
          name: 'admin',
          description: '系统管理员，拥有所有权限',
          permissions: ['read', 'write', 'delete', 'admin'],
          userCount: 1,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'manager',
          description: '经理，拥有读写权限',
          permissions: ['read', 'write'],
          userCount: 1,
          createdAt: '2024-01-02T00:00:00Z'
        },
        {
          id: '3',
          name: 'user',
          description: '普通用户，只有读取权限',
          permissions: ['read'],
          userCount: 1,
          createdAt: '2024-01-03T00:00:00Z'
        }
      ];

      const mockPermissions: Permission[] = [
        {
          id: '1',
          name: 'read',
          description: '读取权限',
          category: 'basic',
          isGranted: true
        },
        {
          id: '2',
          name: 'write',
          description: '写入权限',
          category: 'basic',
          isGranted: false
        },
        {
          id: '3',
          name: 'delete',
          description: '删除权限',
          category: 'advanced',
          isGranted: false
        },
        {
          id: '4',
          name: 'admin',
          description: '管理员权限',
          category: 'admin',
          isGranted: false
        }
      ];

      const mockStats: UserStats = {
        total: 3,
        active: 3,
        inactive: 0,
        pending: 0,
        byRole: { admin: 1, manager: 1, user: 1 },
        byStatus: { active: 3, inactive: 0, pending: 0 }
      };

      setUsers(mockUsers);
      setRoles(mockRoles);
      setPermissions(mockPermissions);
      setStats(mockStats);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (roleId: string): string => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle style={{ width: '16px', height: '16px', color: '#22c55e' }} />;
      case 'inactive':
        return <XCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />;
      case 'pending':
        return <AlertCircle style={{ width: '16px', height: '16px', color: '#f59e0b' }} />;
      default:
        return <AlertCircle style={{ width: '16px', height: '16px', color: '#6b7280' }} />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield style={{ width: '16px', height: '16px', color: '#ef4444' }} />;
      case 'manager':
        return <Users style={{ width: '16px', height: '16px', color: '#3b82f6' }} />;
      case 'user':
        return <UserCheck style={{ width: '16px', height: '16px', color: '#22c55e' }} />;
      default:
        return <UserCheck style={{ width: '16px', height: '16px', color: '#6b7280' }} />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesStatus = !selectedStatus || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const renderUsersTab = () => (
    <div>
      {/* 搜索和过滤 */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: '#6b7280'
          }} />
          <input
            type="text"
            placeholder="搜索用户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          <option value="">所有角色</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{safeRender(role.name)}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          <option value="">所有状态</option>
          <option value="active">活跃</option>
          <option value="inactive">非活跃</option>
          <option value="pending">待审核</option>
        </select>
        <Button variant="primary">
          <Plus style={{ width: '16px', height: '16px' }} />
          添加用户
        </Button>
      </div>

      {/* 用户列表 */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>用户</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>角色</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>状态</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>最后登录</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {safeRenderArray(filteredUsers, (user, index) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600'
                      }}>
                        {safeRender(user.username.charAt(0).toUpperCase())}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#111827' }}>
                          {safeRender(user.username)}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          {safeRender(user.email)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {safeRender(getRoleIcon(user.role))}
                      <span style={{ fontSize: '14px' }}>
                        {safeRender(getRoleName(user.role))}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {safeRender(getStatusIcon(user.status))}
                      <span style={{ fontSize: '14px' }}>
                        {safeRender(user.status === 'active' ? '活跃' : user.status === 'inactive' ? '非活跃' : '待审核')}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                    {safeRender(new Date(user.lastLogin).toLocaleString())}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="ghost" size="sm">
                        <Eye style={{ width: '14px', height: '14px' }} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit style={{ width: '14px', height: '14px' }} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 style={{ width: '14px', height: '14px' }} />
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
  );

  const renderRolesTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>角色管理</h3>
        <Button variant="primary">
          <Plus style={{ width: '16px', height: '16px' }} />
          添加角色
        </Button>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {safeRenderArray(roles, (role, index) => (
          <Card key={role.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Shield style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {safeRender(role.name)}
                  </h4>
                  <span style={{ 
                    padding: '2px 8px', 
                    backgroundColor: '#eff6ff', 
                    color: '#1d4ed8', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {safeRender(role.userCount)} 用户
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0' }}>
                  {safeRender(role.description)}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {safeRenderArray(role.permissions, (permission, permIndex) => (
                    <span key={permIndex} style={{ 
                      padding: '2px 6px', 
                      backgroundColor: '#f3f4f6', 
                      color: '#374151', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {safeRender(permission)}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="ghost" size="sm">
                  <Edit style={{ width: '14px', height: '14px' }} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPermissionsTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>权限管理</h3>
        <Button variant="primary">
          <Plus style={{ width: '16px', height: '16px' }} />
          添加权限
        </Button>
      </div>

      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>权限名称</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>描述</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>分类</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>状态</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {safeRenderArray(permissions, (permission, index) => (
                <tr key={permission.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Key style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                      <span style={{ fontWeight: '500', color: '#111827' }}>
                        {safeRender(permission.name)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                    {safeRender(permission.description)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      backgroundColor: '#f3f4f6', 
                      color: '#374151', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {safeRender(permission.category)}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {safeRender(permission.isGranted ? 
                        <CheckCircle style={{ width: '16px', height: '16px', color: '#22c55e' }} /> :
                        <XCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                      )}
                      <span style={{ fontSize: '14px' }}>
                        {safeRender(permission.isGranted ? '已授权' : '未授权')}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="ghost" size="sm">
                        <Edit style={{ width: '14px', height: '14px' }} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 style={{ width: '14px', height: '14px' }} />
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
  );

  const renderStatsTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>统计分析</h3>
      
      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>总用户数</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {safeRender(stats.total)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserCheck style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>活跃用户</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {safeRender(stats.active)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              backgroundColor: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserX style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>非活跃用户</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {safeRender(stats.inactive)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 角色分布图表 */}
      <Card>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>角色分布</h4>
        <div style={{ display: 'grid', gap: '12px' }}>
          {safeRenderArray(Object.entries(stats.byRole), ([role, count], index) => (
            <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {safeRender(getRoleIcon(role))}
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {safeRender(getRoleName(role))}
                </span>
              </div>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {safeRender(count)} 用户
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '16px',
        color: '#6b7280'
      }}>
        加载中...
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
              管理系统用户、角色和权限配置
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="ghost">
              <Download style={{ width: '16px', height: '16px' }} />
              导出
            </Button>
            <Button variant="ghost">
              <Upload style={{ width: '16px', height: '16px' }} />
              导入
            </Button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
          {/* 侧边栏导航 */}
          <div>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {safeRenderArray(tabs, (tab, index) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: activeTab === tab.key ? '#3b82f6' : 'transparent',
                      color: activeTab === tab.key ? 'white' : '#374151',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: activeTab === tab.key ? '500' : '400',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    {safeRender(tab.icon)}
                    {safeRender(tab.label)}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* 主内容区 */}
          <div>
            {activeTab === 'users' && renderUsersTab()}
            {activeTab === 'roles' && renderRolesTab()}
            {activeTab === 'permissions' && renderPermissionsTab()}
            {activeTab === 'stats' && renderStatsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionManager; 