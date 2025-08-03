import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 租户数据存储 (实际项目中应该使用数据库)
let tenants = [
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
    config: {
      maxUsers: 2000,
      maxMessages: 100000,
      features: ['advanced_analytics', 'custom_branding', 'priority_support']
    }
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
    config: {
      maxUsers: 1000,
      maxMessages: 50000,
      features: ['basic_analytics', 'custom_branding']
    }
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
    config: {
      maxUsers: 500,
      maxMessages: 10000,
      features: ['basic_analytics']
    }
  }
];

// 获取所有租户
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, status, planType } = req.query;
    
    let filteredTenants = [...tenants];
    
    // 状态过滤
    if (status) {
      filteredTenants = filteredTenants.filter(tenant => tenant.status === status);
    }
    
    // 套餐类型过滤
    if (planType) {
      filteredTenants = filteredTenants.filter(tenant => tenant.planType === planType);
    }
    
    // 分页
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedTenants = filteredTenants.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedTenants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredTenants.length,
        totalPages: Math.ceil(filteredTenants.length / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取租户列表失败',
      error: error.message
    });
  }
});

// 获取单个租户
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const tenant = tenants.find(t => t.id === id);
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: '租户不存在'
      });
    }
    
    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取租户信息失败',
      error: error.message
    });
  }
});

// 创建租户
router.post('/', (req, res) => {
  try {
    const { name, subdomain, planType } = req.body;
    
    // 验证必填字段
    if (!name || !subdomain || !planType) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段'
      });
    }
    
    // 检查子域名是否已存在
    const existingTenant = tenants.find(t => t.subdomain === subdomain);
    if (existingTenant) {
      return res.status(400).json({
        success: false,
        message: '子域名已存在'
      });
    }
    
    // 根据套餐类型设置配置
    const getConfigByPlan = (plan: string) => {
      switch (plan) {
        case 'basic':
          return {
            maxUsers: 500,
            maxMessages: 10000,
            features: ['basic_analytics']
          };
        case 'professional':
          return {
            maxUsers: 1000,
            maxMessages: 50000,
            features: ['basic_analytics', 'custom_branding']
          };
        case 'enterprise':
          return {
            maxUsers: 2000,
            maxMessages: 100000,
            features: ['advanced_analytics', 'custom_branding', 'priority_support']
          };
        default:
          return {
            maxUsers: 500,
            maxMessages: 10000,
            features: ['basic_analytics']
          };
      }
    };
    
    const newTenant = {
      id: uuidv4(),
      name,
      subdomain,
      planType,
      status: 'active',
      userCount: 0,
      messageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: new Date().toLocaleString(),
      config: getConfigByPlan(planType)
    };
    
    tenants.push(newTenant);
    
    res.status(201).json({
      success: true,
      message: '租户创建成功',
      data: newTenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建租户失败',
      error: error.message
    });
  }
});

// 更新租户
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const tenantIndex = tenants.findIndex(t => t.id === id);
    if (tenantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '租户不存在'
      });
    }
    
    // 检查子域名唯一性
    if (updateData.subdomain) {
      const existingTenant = tenants.find(t => t.subdomain === updateData.subdomain && t.id !== id);
      if (existingTenant) {
        return res.status(400).json({
          success: false,
          message: '子域名已存在'
        });
      }
    }
    
    // 更新租户信息
    tenants[tenantIndex] = {
      ...tenants[tenantIndex],
      ...updateData,
      lastActive: new Date().toLocaleString()
    };
    
    res.json({
      success: true,
      message: '租户更新成功',
      data: tenants[tenantIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新租户失败',
      error: error.message
    });
  }
});

// 删除租户
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const tenantIndex = tenants.findIndex(t => t.id === id);
    if (tenantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '租户不存在'
      });
    }
    
    tenants.splice(tenantIndex, 1);
    
    res.json({
      success: true,
      message: '租户删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除租户失败',
      error: error.message
    });
  }
});

// 更新租户状态
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: '租户不存在'
      });
    }
    
    tenant.status = status;
    tenant.lastActive = new Date().toLocaleString();
    
    res.json({
      success: true,
      message: '租户状态更新成功',
      data: tenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新租户状态失败',
      error: error.message
    });
  }
});

// 获取租户统计信息
router.get('/:id/stats', (req, res) => {
  try {
    const { id } = req.params;
    const tenant = tenants.find(t => t.id === id);
    
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: '租户不存在'
      });
    }
    
    const stats = {
      userCount: tenant.userCount,
      messageCount: tenant.messageCount,
      userUsage: Math.round((tenant.userCount / tenant.config.maxUsers) * 100),
      messageUsage: Math.round((tenant.messageCount / tenant.config.maxMessages) * 100),
      lastActive: tenant.lastActive,
      uptime: Math.floor(Math.random() * 100) + '%', // 模拟数据
      responseTime: Math.floor(Math.random() * 50) + 'ms' // 模拟数据
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取租户统计信息失败',
      error: error.message
    });
  }
});

export default router; 