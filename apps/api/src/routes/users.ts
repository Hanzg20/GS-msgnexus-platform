import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 用户接口
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

// 角色接口
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

// 权限接口
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

// 模拟数据存储
let users: User[] = [
  {
    id: 'user-001',
    username: 'admin',
    email: 'admin@msgnexus.com',
    fullName: '系统管理员',
    role: 'super_admin',
    status: 'active',
    lastLogin: '2024-01-20T15:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    permissions: ['*'],
    metadata: {
      department: 'IT',
      position: '系统管理员',
      phone: '+86-138-0000-0000',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN'
    }
  },
  {
    id: 'user-002',
    username: 'manager',
    email: 'manager@acme.com',
    fullName: '张经理',
    role: 'tenant_admin',
    status: 'active',
    tenantId: '1',
    lastLogin: '2024-01-20T14:15:00Z',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    permissions: ['tenant:read', 'tenant:write', 'user:read', 'user:write', 'message:read', 'message:write'],
    metadata: {
      department: '运营部',
      position: '运营经理',
      phone: '+86-139-0000-0000',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN'
    }
  },
  {
    id: 'user-003',
    username: 'operator',
    email: 'operator@acme.com',
    fullName: '李操作员',
    role: 'operator',
    status: 'active',
    tenantId: '1',
    lastLogin: '2024-01-20T13:45:00Z',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T13:45:00Z',
    permissions: ['message:read', 'message:write', 'system:read'],
    metadata: {
      department: '技术部',
      position: '技术操作员',
      phone: '+86-137-0000-0000',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN'
    }
  },
  {
    id: 'user-004',
    username: 'viewer',
    email: 'viewer@techstart.com',
    fullName: '王查看员',
    role: 'viewer',
    status: 'active',
    tenantId: '2',
    lastLogin: '2024-01-20T12:30:00Z',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-20T12:30:00Z',
    permissions: ['message:read', 'system:read'],
    metadata: {
      department: '市场部',
      position: '市场专员',
      phone: '+86-136-0000-0000',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN'
    }
  }
];

let roles: Role[] = [
  {
    id: 'role-001',
    name: 'super_admin',
    description: '超级管理员 - 拥有所有权限',
    permissions: ['*'],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userCount: 1
  },
  {
    id: 'role-002',
    name: 'tenant_admin',
    description: '租户管理员 - 管理租户内所有资源',
    permissions: ['tenant:read', 'tenant:write', 'user:read', 'user:write', 'message:read', 'message:write', 'system:read'],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userCount: 1
  },
  {
    id: 'role-003',
    name: 'operator',
    description: '操作员 - 执行日常操作任务',
    permissions: ['message:read', 'message:write', 'system:read'],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userCount: 1
  },
  {
    id: 'role-004',
    name: 'viewer',
    description: '查看员 - 只读权限',
    permissions: ['message:read', 'system:read'],
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userCount: 1
  },
  {
    id: 'role-005',
    name: 'custom_role',
    description: '自定义角色 - 消息管理专用',
    permissions: ['message:read', 'message:write', 'message:delete'],
    isSystem: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    userCount: 0
  }
];

let permissions: Permission[] = [
  // 系统权限
  {
    id: 'perm-001',
    name: '系统管理',
    description: '完全系统访问权限',
    resource: '*',
    action: '*',
    category: 'system',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm-002',
    name: '系统查看',
    description: '查看系统信息',
    resource: 'system',
    action: 'read',
    category: 'system',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm-003',
    name: '系统配置',
    description: '修改系统配置',
    resource: 'system',
    action: 'write',
    category: 'system',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  
  // 租户权限
  {
    id: 'perm-004',
    name: '租户查看',
    description: '查看租户信息',
    resource: 'tenant',
    action: 'read',
    category: 'tenant',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm-005',
    name: '租户管理',
    description: '管理租户信息',
    resource: 'tenant',
    action: 'write',
    category: 'tenant',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  
  // 用户权限
  {
    id: 'perm-006',
    name: '用户查看',
    description: '查看用户信息',
    resource: 'user',
    action: 'read',
    category: 'user',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm-007',
    name: '用户管理',
    description: '管理用户信息',
    resource: 'user',
    action: 'write',
    category: 'user',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  
  // 消息权限
  {
    id: 'perm-008',
    name: '消息查看',
    description: '查看消息信息',
    resource: 'message',
    action: 'read',
    category: 'message',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm-009',
    name: '消息管理',
    description: '管理消息信息',
    resource: 'message',
    action: 'write',
    category: 'message',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm-010',
    name: '消息删除',
    description: '删除消息',
    resource: 'message',
    action: 'delete',
    category: 'message',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  
  // 备份权限
  {
    id: 'perm-011',
    name: '备份查看',
    description: '查看备份信息',
    resource: 'backup',
    action: 'read',
    category: 'backup',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'perm-012',
    name: '备份管理',
    description: '管理备份操作',
    resource: 'backup',
    action: 'write',
    category: 'backup',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// 获取用户统计信息
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      inactiveUsers: users.filter(u => u.status === 'inactive').length,
      suspendedUsers: users.filter(u => u.status === 'suspended').length,
      totalRoles: roles.length,
      systemRoles: roles.filter(r => r.isSystem).length,
      customRoles: roles.filter(r => !r.isSystem).length,
      totalPermissions: permissions.length,
      systemPermissions: permissions.filter(p => p.isSystem).length,
      customPermissions: permissions.filter(p => !p.isSystem).length,
      byRole: roles.reduce((acc, role) => {
        acc[role.name] = users.filter(u => u.role === role.name).length;
        return acc;
      }, {} as Record<string, number>),
      byStatus: {
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        suspended: users.filter(u => u.status === 'suspended').length
      },
      byTenant: users.reduce((acc, user) => {
        const tenantId = user.tenantId || 'system';
        acc[tenantId] = (acc[tenantId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取用户统计信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取角色列表
router.get('/roles', (req, res) => {
  try {
    const { isSystem } = req.query;
    
    let filteredRoles = [...roles];
    
    // 系统角色过滤
    if (isSystem !== undefined) {
      filteredRoles = filteredRoles.filter(role => role.isSystem === (isSystem === 'true'));
    }
    
    res.json({
      success: true,
      data: filteredRoles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取角色列表失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取权限列表
router.get('/permissions', (req, res) => {
  try {
    const { category, isSystem } = req.query;
    
    let filteredPermissions = [...permissions];
    
    // 分类过滤
    if (category) {
      filteredPermissions = filteredPermissions.filter(perm => perm.category === category);
    }
    
    // 系统权限过滤
    if (isSystem !== undefined) {
      filteredPermissions = filteredPermissions.filter(perm => perm.isSystem === (isSystem === 'true'));
    }
    
    res.json({
      success: true,
      data: filteredPermissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取权限列表失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取单个角色
router.get('/roles/:id', (req, res) => {
  try {
    const { id } = req.params;
    const role = roles.find(r => r.id === id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: '角色不存在'
      });
    }
    
    res.json({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取角色详情失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 创建角色
router.post('/roles', (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    
    // 验证必填字段
    if (!name || !description || !permissions) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段'
      });
    }
    
    // 检查角色名是否已存在
    const existingRole = roles.find(r => r.name === name);
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: '角色名已存在'
      });
    }
    
    const newRole: Role = {
      id: uuidv4(),
      name,
      description,
      permissions,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userCount: 0
    };
    
    roles.push(newRole);
    
    res.status(201).json({
      success: true,
      message: '角色创建成功',
      data: newRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建角色失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 更新角色
router.put('/roles/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const roleIndex = roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '角色不存在'
      });
    }
    
    const role = roles[roleIndex];
    
    // 不能修改系统角色
    if (role.isSystem) {
      return res.status(400).json({
        success: false,
        message: '不能修改系统角色'
      });
    }
    
    // 检查角色名唯一性
    if (updateData.name) {
      const existingRole = roles.find(r => r.name === updateData.name && r.id !== id);
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: '角色名已存在'
        });
      }
    }
    
    // 更新角色信息
    roles[roleIndex] = {
      ...roles[roleIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: '角色更新成功',
      data: roles[roleIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新角色失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 删除角色
router.delete('/roles/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const roleIndex = roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '角色不存在'
      });
    }
    
    const role = roles[roleIndex];
    
    // 不能删除系统角色
    if (role.isSystem) {
      return res.status(400).json({
        success: false,
        message: '不能删除系统角色'
      });
    }
    
    // 检查是否有用户使用此角色
    if (role.userCount > 0) {
      return res.status(400).json({
        success: false,
        message: '该角色下还有用户，无法删除'
      });
    }
    
    roles.splice(roleIndex, 1);
    
    res.json({
      success: true,
      message: '角色删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除角色失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 创建权限
router.post('/permissions', (req, res) => {
  try {
    const { name, description, resource, action, category } = req.body;
    
    // 验证必填字段
    if (!name || !description || !resource || !action || !category) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段'
      });
    }
    
    // 检查权限是否已存在
    const existingPermission = permissions.find(p => 
      p.resource === resource && p.action === action
    );
    if (existingPermission) {
      return res.status(400).json({
        success: false,
        message: '权限已存在'
      });
    }
    
    const newPermission: Permission = {
      id: uuidv4(),
      name,
      description,
      resource,
      action,
      category,
      isSystem: false,
      createdAt: new Date().toISOString()
    };
    
    permissions.push(newPermission);
    
    res.status(201).json({
      success: true,
      message: '权限创建成功',
      data: newPermission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建权限失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取用户列表
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 20, status, role, tenantId, search } = req.query;
    
    let filteredUsers = [...users];
    
    // 状态过滤
    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    // 角色过滤
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    // 租户过滤
    if (tenantId) {
      filteredUsers = filteredUsers.filter(user => user.tenantId === tenantId);
    }
    
    // 搜索过滤
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.fullName.toLowerCase().includes(searchLower)
      );
    }
    
    // 分页
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / Number(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取用户列表失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取单个用户
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取用户详情失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 创建用户
router.post('/', (req, res) => {
  try {
    const { username, email, fullName, role, tenantId, metadata = {} } = req.body;
    
    // 验证必填字段
    if (!username || !email || !fullName || !role) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段'
      });
    }
    
    // 检查用户名是否已存在
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }
    
    // 检查邮箱是否已存在
    const existingEmail = users.find(u => u.email === email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: '邮箱已存在'
      });
    }
    
    // 获取角色权限
    const roleInfo = roles.find(r => r.name === role);
    if (!roleInfo) {
      return res.status(400).json({
        success: false,
        message: '无效的角色'
      });
    }
    
    const newUser: User = {
      id: uuidv4(),
      username,
      email,
      fullName,
      role,
      status: 'active',
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: roleInfo.permissions,
      metadata
    };
    
    users.push(newUser);
    
    // 更新角色用户数
    roleInfo.userCount += 1;
    
    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建用户失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 更新用户
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 检查用户名唯一性
    if (updateData.username) {
      const existingUser = users.find(u => u.username === updateData.username && u.id !== id);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名已存在'
        });
      }
    }
    
    // 检查邮箱唯一性
    if (updateData.email) {
      const existingEmail = users.find(u => u.email === updateData.email && u.id !== id);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: '邮箱已存在'
        });
      }
    }
    
    // 如果更新角色，更新权限
    if (updateData.role) {
      const roleInfo = roles.find(r => r.name === updateData.role);
      if (roleInfo) {
        updateData.permissions = roleInfo.permissions;
      }
    }
    
    // 更新用户信息
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: '用户更新成功',
      data: users[userIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新用户失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 删除用户
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    const user = users[userIndex];
    
    // 不能删除超级管理员
    if (user.role === 'super_admin') {
      return res.status(400).json({
        success: false,
        message: '不能删除超级管理员'
      });
    }
    
    // 更新角色用户数
    const roleInfo = roles.find(r => r.name === user.role);
    if (roleInfo) {
      roleInfo.userCount = Math.max(0, roleInfo.userCount - 1);
    }
    
    users.splice(userIndex, 1);
    
    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除用户失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 更新用户状态
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    user.status = status;
    user.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: '用户状态更新成功',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新用户状态失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 更新用户权限
router.patch('/:id/permissions', (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;
    
    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    user.permissions = permissions;
    user.updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: '用户权限更新成功',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新用户权限失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 批量分配角色
router.post('/batch-assign-role', (req, res) => {
  try {
    const { userIds, role } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || !role) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段'
      });
    }
    
    // 验证角色是否存在
    const roleInfo = roles.find(r => r.name === role);
    if (!roleInfo) {
      return res.status(400).json({
        success: false,
        message: '无效的角色'
      });
    }
    
    let updatedCount = 0;
    const updatedUsers: User[] = [];
    
    for (const userId of userIds) {
      const user = users.find(u => u.id === userId);
      if (user) {
        // 更新用户角色和权限
        user.role = role;
        user.permissions = roleInfo.permissions;
        user.updatedAt = new Date().toISOString();
        updatedUsers.push(user);
        updatedCount++;
      }
    }
    
    // 更新角色用户数
    roleInfo.userCount = users.filter(u => u.role === role).length;
    
    res.json({
      success: true,
      message: `成功为 ${updatedCount} 个用户分配角色`,
      data: {
        updatedCount,
        updatedUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '批量分配角色失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router; 