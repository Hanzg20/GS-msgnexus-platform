import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  permissions: string[];
  tenantId?: string;
  avatar?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
  createdAt: Date;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
}

const UserPermissionManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');

  // 模拟权限数据
  useEffect(() => {
    const mockPermissions: Permission[] = [
      // 用户管理权限
      { id: 'user:read', name: '查看用户', description: '查看用户列表和详情', category: '用户管理', resource: 'user', action: 'read' },
      { id: 'user:create', name: '创建用户', description: '创建新用户', category: '用户管理', resource: 'user', action: 'create' },
      { id: 'user:update', name: '编辑用户', description: '编辑用户信息', category: '用户管理', resource: 'user', action: 'update' },
      { id: 'user:delete', name: '删除用户', description: '删除用户', category: '用户管理', resource: 'user', action: 'delete' },
      
      // 租户管理权限
      { id: 'tenant:read', name: '查看租户', description: '查看租户列表和详情', category: '租户管理', resource: 'tenant', action: 'read' },
      { id: 'tenant:create', name: '创建租户', description: '创建新租户', category: '租户管理', resource: 'tenant', action: 'create' },
      { id: 'tenant:update', name: '编辑租户', description: '编辑租户信息', category: '租户管理', resource: 'tenant', action: 'update' },
      { id: 'tenant:delete', name: '删除租户', description: '删除租户', category: '租户管理', resource: 'tenant', action: 'delete' },
      
      // 系统管理权限
      { id: 'system:read', name: '查看系统', description: '查看系统状态和配置', category: '系统管理', resource: 'system', action: 'read' },
      { id: 'system:update', name: '更新系统', description: '更新系统配置', category: '系统管理', resource: 'system', action: 'update' },
      { id: 'system:admin', name: '系统管理', description: '完全系统管理权限', category: '系统管理', resource: 'system', action: 'admin' },
      
      // 日志管理权限
      { id: 'log:read', name: '查看日志', description: '查看系统日志', category: '日志管理', resource: 'log', action: 'read' },
      { id: 'log:export', name: '导出日志', description: '导出日志文件', category: '日志管理', resource: 'log', action: 'export' },
      { id: 'log:delete', name: '删除日志', description: '删除日志记录', category: '日志管理', resource: 'log', action: 'delete' },
      
      // 备份管理权限
      { id: 'backup:read', name: '查看备份', description: '查看备份列表', category: '备份管理', resource: 'backup', action: 'read' },
      { id: 'backup:create', name: '创建备份', description: '创建系统备份', category: '备份管理', resource: 'backup', action: 'create' },
      { id: 'backup:restore', name: '恢复备份', description: '恢复系统备份', category: '备份管理', resource: 'backup', action: 'restore' },
      { id: 'backup:delete', name: '删除备份', description: '删除备份文件', category: '备份管理', resource: 'backup', action: 'delete' },
    ];

    const mockRoles: Role[] = [
      {
        id: 'super-admin',
        name: '超级管理员',
        description: '拥有所有权限的系统管理员',
        permissions: mockPermissions.map(p => p.id),
        isSystem: true,
        userCount: 2,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'tenant-admin',
        name: '租户管理员',
        description: '管理指定租户的管理员',
        permissions: ['user:read', 'user:create', 'user:update', 'tenant:read', 'system:read', 'log:read'],
        isSystem: true,
        userCount: 8,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'user-manager',
        name: '用户管理员',
        description: '管理用户的管理员',
        permissions: ['user:read', 'user:create', 'user:update', 'user:delete'],
        isSystem: false,
        userCount: 15,
        createdAt: new Date('2024-02-01')
      },
      {
        id: 'viewer',
        name: '查看者',
        description: '只能查看数据的用户',
        permissions: ['user:read', 'tenant:read', 'system:read', 'log:read'],
        isSystem: false,
        userCount: 45,
        createdAt: new Date('2024-02-15')
      }
    ];

    const mockUsers: User[] = [
      {
        id: 'user-1',
        username: 'admin',
        email: 'admin@goldsky.com',
        role: 'super-admin',
        status: 'active',
        lastLogin: new Date(Date.now() - 3600000),
        createdAt: new Date('2024-01-01'),
        permissions: mockPermissions.map(p => p.id),
        avatar: '👨‍💼'
      },
      {
        id: 'user-2',
        username: 'tenant1_admin',
        email: 'tenant1@goldsky.com',
        role: 'tenant-admin',
        status: 'active',
        lastLogin: new Date(Date.now() - 7200000),
        createdAt: new Date('2024-01-15'),
        permissions: ['user:read', 'user:create', 'user:update', 'tenant:read', 'system:read', 'log:read'],
        tenantId: 'tenant-1',
        avatar: '👩‍💼'
      },
      {
        id: 'user-3',
        username: 'user_manager',
        email: 'manager@goldsky.com',
        role: 'user-manager',
        status: 'active',
        lastLogin: new Date(Date.now() - 86400000),
        createdAt: new Date('2024-02-01'),
        permissions: ['user:read', 'user:create', 'user:update', 'user:delete'],
        avatar: '👨‍💻'
      },
      {
        id: 'user-4',
        username: 'viewer1',
        email: 'viewer1@goldsky.com',
        role: 'viewer',
        status: 'inactive',
        lastLogin: new Date(Date.now() - 172800000),
        createdAt: new Date('2024-02-15'),
        permissions: ['user:read', 'tenant:read', 'system:read', 'log:read'],
        avatar: '👩‍💻'
      }
    ];

    setPermissions(mockPermissions);
    setRoles(mockRoles);
    setUsers(mockUsers);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'suspended': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'inactive': return '非活跃';
      case 'suspended': return '已暂停';
      default: return '未知';
    }
  };

  const getPermissionCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '用户管理': '#3b82f6',
      '租户管理': '#10b981',
      '系统管理': '#f59e0b',
      '日志管理': '#8b5cf6',
      '备份管理': '#ef4444'
    };
    return colors[category] || '#6b7280';
  };

  const renderUsersTab = () => (
    <div>
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
            用户列表 ({users.length})
          </h3>
          <button
            onClick={() => setShowUserModal(true)}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ➕ 添加用户
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {users.map(user => (
            <div
              key={user.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: selectedUser?.id === user.id ? '#f8fafc' : 'white'
              }}
              onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '32px' }}>{user.avatar}</div>
                  <div>
                    <h4 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: '#0f172a', 
                      margin: 0, 
                      marginBottom: '4px' 
                    }}>
                      {user.username}
                    </h4>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#64748b', 
                      margin: 0 
                    }}>
                      {user.email}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: `${getStatusColor(user.status)}10`,
                    color: getStatusColor(user.status),
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {getStatusText(user.status)}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    background: '#3b82f6',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {roles.find(r => r.id === user.role)?.name || user.role}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>角色</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {roles.find(r => r.id === user.role)?.name || user.role}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>权限数量</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {user.permissions.length} 个
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>最后登录</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {user.lastLogin ? user.lastLogin.toLocaleString() : '从未登录'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>创建时间</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {user.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {selectedUser?.id === user.id && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 12px 0' }}>
                    用户权限
                  </h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {user.permissions.map(permissionId => {
                      const permission = permissions.find(p => p.id === permissionId);
                      if (!permission) return null;
                      
                      return (
                        <span
                          key={permissionId}
                          style={{
                            padding: '4px 8px',
                            background: `${getPermissionCategoryColor(permission.category)}10`,
                            color: getPermissionCategoryColor(permission.category),
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 500
                          }}
                        >
                          {permission.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRolesTab = () => (
    <div>
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
            角色列表 ({roles.length})
          </h3>
          <button
            onClick={() => setShowRoleModal(true)}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ➕ 添加角色
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {roles.map(role => (
            <div
              key={role.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: selectedRole?.id === role.id ? '#f8fafc' : 'white'
              }}
              onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    margin: 0, 
                    marginBottom: '4px' 
                  }}>
                    {role.name}
                    {role.isSystem && (
                      <span style={{
                        marginLeft: '8px',
                        padding: '2px 6px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500
                      }}>
                        系统
                      </span>
                    )}
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#64748b', 
                    margin: 0 
                  }}>
                    {role.description}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                    {role.userCount}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    用户数量
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>权限数量</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {role.permissions.length} 个
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>创建时间</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {role.createdAt.toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>类型</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {role.isSystem ? '系统角色' : '自定义角色'}
                  </div>
                </div>
              </div>
              
              {selectedRole?.id === role.id && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 12px 0' }}>
                    角色权限
                  </h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {role.permissions.map(permissionId => {
                      const permission = permissions.find(p => p.id === permissionId);
                      if (!permission) return null;
                      
                      return (
                        <span
                          key={permissionId}
                          style={{
                            padding: '4px 8px',
                            background: `${getPermissionCategoryColor(permission.category)}10`,
                            color: getPermissionCategoryColor(permission.category),
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 500
                          }}
                        >
                          {permission.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPermissionsTab = () => (
    <div>
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', margin: '0 0 24px 0' }}>
          权限列表 ({permissions.length})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {Array.from(new Set(permissions.map(p => p.category))).map(category => (
            <div key={category}>
              <h4 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#0f172a', 
                margin: '0 0 16px 0',
                paddingBottom: '8px',
                borderBottom: `2px solid ${getPermissionCategoryColor(category)}`
              }}>
                {category}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                {permissions
                  .filter(p => p.category === category)
                  .map(permission => (
                    <div
                      key={permission.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px',
                        background: 'white'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h5 style={{ 
                          fontSize: '16px', 
                          fontWeight: 600, 
                          color: '#0f172a', 
                          margin: 0 
                        }}>
                          {permission.name}
                        </h5>
                        <span style={{
                          padding: '2px 6px',
                          background: `${getPermissionCategoryColor(permission.category)}10`,
                          color: getPermissionCategoryColor(permission.category),
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 500
                        }}>
                          {permission.resource}:{permission.action}
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#64748b', 
                        margin: 0 
                      }}>
                        {permission.description}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 800, 
          color: '#0f172a', 
          margin: 0, 
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🔐 用户权限管理
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          margin: 0,
          fontWeight: 500
        }}>
          管理用户、角色和权限，实现细粒度的访问控制
        </p>
      </div>

      {/* 统计卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              👥
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {users.length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>总用户数</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#10b981',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              🎭
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {roles.length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>角色数量</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#f59e0b',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              🔑
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {permissions.length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>权限数量</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#8b5cf6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              ✅
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {users.filter(u => u.status === 'active').length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>活跃用户</div>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { key: 'users', label: '用户管理', icon: '👥' },
            { key: 'roles', label: '角色管理', icon: '🎭' },
            { key: 'permissions', label: '权限管理', icon: '🔑' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab.key ? '#3b82f6' : '#f1f5f9',
                color: activeTab === tab.key ? 'white' : '#475569',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'roles' && renderRolesTab()}
        {activeTab === 'permissions' && renderPermissionsTab()}
      </div>
    </div>
  );
};

export default UserPermissionManager; 