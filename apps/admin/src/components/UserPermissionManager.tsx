import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLoginAt: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
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
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@msgnexus.com',
      role: '超级管理员',
      status: 'active',
      lastLoginAt: '2024-01-01T10:00:00Z',
      permissions: ['user:read', 'user:write', 'user:delete', 'system:admin']
    },
    {
      id: '2',
      username: 'manager',
      email: 'manager@msgnexus.com',
      role: '租户管理员',
      status: 'active',
      lastLoginAt: '2024-01-01T09:30:00Z',
      permissions: ['user:read', 'user:write', 'tenant:admin']
    },
    {
      id: '3',
      username: 'user1',
      email: 'user1@msgnexus.com',
      role: '普通用户',
      status: 'active',
      lastLoginAt: '2024-01-01T08:45:00Z',
      permissions: ['message:read', 'message:write']
    }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: '超级管理员',
      description: '拥有系统所有权限',
      permissions: ['user:read', 'user:write', 'user:delete', 'system:admin', 'tenant:admin'],
      userCount: 1
    },
    {
      id: '2',
      name: '租户管理员',
      description: '管理租户内用户和资源',
      permissions: ['user:read', 'user:write', 'tenant:admin', 'message:admin'],
      userCount: 2
    },
    {
      id: '3',
      name: '普通用户',
      description: '基本消息收发权限',
      permissions: ['message:read', 'message:write'],
      userCount: 5
    }
  ]);

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: '1', name: '查看用户', description: '查看用户列表和详情', category: '用户管理', resource: 'user', action: 'read' },
    { id: '2', name: '创建用户', description: '创建新用户', category: '用户管理', resource: 'user', action: 'write' },
    { id: '3', name: '删除用户', description: '删除用户', category: '用户管理', resource: 'user', action: 'delete' },
    { id: '4', name: '系统管理', description: '系统级管理权限', category: '系统管理', resource: 'system', action: 'admin' },
    { id: '5', name: '租户管理', description: '租户级管理权限', category: '租户管理', resource: 'tenant', action: 'admin' },
    { id: '6', name: '查看消息', description: '查看消息', category: '消息管理', resource: 'message', action: 'read' },
    { id: '7', name: '发送消息', description: '发送消息', category: '消息管理', resource: 'message', action: 'write' },
    { id: '8', name: '消息管理', description: '管理所有消息', category: '消息管理', resource: 'message', action: 'admin' }
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case '超级管理员': return 'text-purple-600 bg-purple-100';
      case '租户管理员': return 'text-blue-600 bg-blue-100';
      case '普通用户': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const updateUserRole = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const updateUserStatus = (userId: string, newStatus: 'active' | 'inactive') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const addPermissionToRole = (roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, permissions: [...role.permissions, permissionId] }
        : role
    ));
  };

  const removePermissionFromRole = (roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, permissions: role.permissions.filter(p => p !== permissionId) }
        : role
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">用户权限管理</h1>
        <p className="text-gray-600">管理用户角色和权限</p>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">总用户数</div>
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">活跃用户</div>
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === 'active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">角色数量</div>
          <div className="text-2xl font-bold text-blue-600">{roles.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">权限数量</div>
          <div className="text-2xl font-bold text-purple-600">{permissions.length}</div>
        </div>
      </div>

      {/* 标签页 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              用户管理
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              角色管理
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'permissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              权限管理
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最后登录</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? '活跃' : '非活跃'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.lastLoginAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                            className={`${
                              user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {user.status === 'active' ? '禁用' : '启用'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-6">
              {roles.map((role) => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-500">{role.description}</p>
                      <p className="text-xs text-gray-400 mt-1">用户数: {role.userCount}</p>
                    </div>
                    <button
                      onClick={() => setSelectedRole(role)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      编辑权限
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permissionId) => {
                      const permission = permissions.find(p => p.id === permissionId);
                      return permission ? (
                        <span
                          key={permissionId}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {permission.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">权限名称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">描述</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">资源</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {permission.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {permission.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {permission.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {permission.resource}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {permission.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 用户编辑模态框 */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">编辑用户</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">用户名</label>
                  <input
                    type="text"
                    value={selectedUser.username}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">邮箱</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">角色</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => updateUserRole(selectedUser.id, e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">状态</label>
                  <select
                    value={selectedUser.status}
                    onChange={(e) => updateUserStatus(selectedUser.id, e.target.value as 'active' | 'inactive')}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="active">活跃</option>
                    <option value="inactive">非活跃</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  取消
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 角色编辑模态框 */}
      {selectedRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">编辑角色权限</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">角色名称</label>
                  <input
                    type="text"
                    value={selectedRole.name}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">权限</label>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {permissions.map(permission => (
                      <label key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRole.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              addPermissionToRole(selectedRole.id, permission.id);
                            } else {
                              removePermissionFromRole(selectedRole.id, permission.id);
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-900">{permission.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedRole(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  取消
                </button>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPermissionManager; 