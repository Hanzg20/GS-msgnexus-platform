import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 消息类型定义
interface Message {
  id: string;
  tenantId: string;
  type: 'sms' | 'email' | 'push' | 'webhook';
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'retrying';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sender: string;
  recipient: string;
  subject?: string;
  content: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  deliveredAt?: string;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
}

// 模拟消息数据
let messages: Message[] = [
  {
    id: 'msg-001',
    tenantId: 'tenant-001',
    type: 'email',
    status: 'delivered',
    priority: 'normal',
    sender: 'system@msgnexus.com',
    recipient: 'user1@example.com',
    subject: '欢迎使用 MsgNexus',
    content: '感谢您选择我们的消息管理平台！',
    metadata: { campaignId: 'camp-001', templateId: 'tpl-welcome' },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:01:30Z',
    sentAt: '2024-01-15T10:00:30Z',
    deliveredAt: '2024-01-15T10:01:30Z',
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: 'msg-002',
    tenantId: 'tenant-001',
    type: 'sms',
    status: 'sent',
    priority: 'high',
    sender: 'MsgNexus',
    recipient: '+1234567890',
    content: '您的验证码是：123456，5分钟内有效。',
    metadata: { verificationCode: '123456', expiresAt: '2024-01-15T10:05:00Z' },
    createdAt: '2024-01-15T10:02:00Z',
    updatedAt: '2024-01-15T10:02:15Z',
    sentAt: '2024-01-15T10:02:15Z',
    retryCount: 0,
    maxRetries: 3
  },
  {
    id: 'msg-003',
    tenantId: 'tenant-002',
    type: 'push',
    status: 'failed',
    priority: 'normal',
    sender: 'app-notification',
    recipient: 'device-token-123',
    subject: '新消息通知',
    content: '您有一条新的消息',
    metadata: { deviceId: 'device-123', appVersion: '1.2.0' },
    createdAt: '2024-01-15T10:03:00Z',
    updatedAt: '2024-01-15T10:03:45Z',
    retryCount: 2,
    maxRetries: 3,
    errorMessage: '设备令牌无效'
  },
  {
    id: 'msg-004',
    tenantId: 'tenant-001',
    type: 'webhook',
    status: 'pending',
    priority: 'low',
    sender: 'system',
    recipient: 'https://api.example.com/webhook',
    content: JSON.stringify({ event: 'user_registered', userId: 'user-123' }),
    metadata: { eventType: 'user_registered', webhookId: 'webhook-001' },
    createdAt: '2024-01-15T10:04:00Z',
    updatedAt: '2024-01-15T10:04:00Z',
    retryCount: 0,
    maxRetries: 3
  }
];

// 获取消息列表
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      tenantId,
      priority,
      startDate,
      endDate,
      search
    } = req.query;

    let filteredMessages = [...messages];

    // 按状态过滤
    if (status) {
      filteredMessages = filteredMessages.filter(msg => msg.status === status);
    }

    // 按类型过滤
    if (type) {
      filteredMessages = filteredMessages.filter(msg => msg.type === type);
    }

    // 按租户过滤
    if (tenantId) {
      filteredMessages = filteredMessages.filter(msg => msg.tenantId === tenantId);
    }

    // 按优先级过滤
    if (priority) {
      filteredMessages = filteredMessages.filter(msg => msg.priority === priority);
    }

    // 按日期范围过滤
    if (startDate || endDate) {
      filteredMessages = filteredMessages.filter(msg => {
        const msgDate = new Date(msg.createdAt);
        if (startDate && msgDate < new Date(startDate as string)) return false;
        if (endDate && msgDate > new Date(endDate as string)) return false;
        return true;
      });
    }

    // 搜索功能
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredMessages = filteredMessages.filter(msg =>
        msg.recipient.toLowerCase().includes(searchTerm) ||
        msg.content.toLowerCase().includes(searchTerm) ||
        msg.subject?.toLowerCase().includes(searchTerm)
      );
    }

    // 分页
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        messages: paginatedMessages,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filteredMessages.length,
          totalPages: Math.ceil(filteredMessages.length / limitNum)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取消息列表失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取单个消息详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const message = messages.find(msg => msg.id === id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: '消息不存在'
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取消息详情失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 创建新消息
router.post('/', (req, res) => {
  try {
    const {
      tenantId,
      type,
      priority = 'normal',
      sender,
      recipient,
      subject,
      content,
      metadata,
      maxRetries = 3
    } = req.body;

    // 验证必填字段
    if (!tenantId || !type || !sender || !recipient || !content) {
      return res.status(400).json({
        success: false,
        error: '缺少必填字段'
      });
    }

    // 验证消息类型
    const validTypes = ['sms', 'email', 'push', 'webhook'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: '无效的消息类型'
      });
    }

    // 验证优先级
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: '无效的优先级'
      });
    }

    const now = new Date().toISOString();
    const newMessage: Message = {
      id: `msg-${uuidv4().substring(0, 8)}`,
      tenantId,
      type,
      status: 'pending',
      priority,
      sender,
      recipient,
      subject,
      content,
      metadata,
      createdAt: now,
      updatedAt: now,
      retryCount: 0,
      maxRetries
    };

    messages.push(newMessage);

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建消息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 更新消息状态
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, errorMessage } = req.body;

    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '消息不存在'
      });
    }

    const validStatuses = ['pending', 'sent', 'delivered', 'failed', 'retrying'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: '无效的状态'
      });
    }

    const message = messages[messageIndex];
    message.status = status;
    message.updatedAt = new Date().toISOString();

    // 更新相关时间戳
    if (status === 'sent' && !message.sentAt) {
      message.sentAt = new Date().toISOString();
    } else if (status === 'delivered' && !message.deliveredAt) {
      message.deliveredAt = new Date().toISOString();
    }

    if (errorMessage) {
      message.errorMessage = errorMessage;
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新消息状态失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 重试失败的消息
router.post('/:id/retry', (req, res) => {
  try {
    const { id } = req.params;
    const messageIndex = messages.findIndex(msg => msg.id === id);

    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '消息不存在'
      });
    }

    const message = messages[messageIndex];

    if (message.status !== 'failed') {
      return res.status(400).json({
        success: false,
        error: '只能重试失败的消息'
      });
    }

    if (message.retryCount >= message.maxRetries) {
      return res.status(400).json({
        success: false,
        error: '已达到最大重试次数'
      });
    }

    message.status = 'retrying';
    message.retryCount += 1;
    message.updatedAt = new Date().toISOString();
    message.errorMessage = undefined;

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '重试消息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 删除消息
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const messageIndex = messages.findIndex(msg => msg.id === id);

    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '消息不存在'
      });
    }

    messages.splice(messageIndex, 1);

    res.json({
      success: true,
      message: '消息删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除消息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取消息统计信息
router.get('/stats/overview', (req, res) => {
  try {
    const { tenantId, startDate, endDate } = req.query;

    let filteredMessages = [...messages];

    // 按租户过滤
    if (tenantId) {
      filteredMessages = filteredMessages.filter(msg => msg.tenantId === tenantId);
    }

    // 按日期范围过滤
    if (startDate || endDate) {
      filteredMessages = filteredMessages.filter(msg => {
        const msgDate = new Date(msg.createdAt);
        if (startDate && msgDate < new Date(startDate as string)) return false;
        if (endDate && msgDate > new Date(endDate as string)) return false;
        return true;
      });
    }

    // 计算统计数据
    const total = filteredMessages.length;
    const byStatus = filteredMessages.reduce((acc, msg) => {
      acc[msg.status] = (acc[msg.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byType = filteredMessages.reduce((acc, msg) => {
      acc[msg.type] = (acc[msg.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPriority = filteredMessages.reduce((acc, msg) => {
      acc[msg.priority] = (acc[msg.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 计算成功率
    const successful = (byStatus.delivered || 0) + (byStatus.sent || 0);
    const successRate = total > 0 ? (successful / total * 100).toFixed(2) : '0.00';

    // 计算平均延迟
    const deliveredMessages = filteredMessages.filter(msg => msg.deliveredAt);
    const totalDelay = deliveredMessages.reduce((sum, msg) => {
      const sentTime = new Date(msg.sentAt || msg.createdAt).getTime();
      const deliveredTime = new Date(msg.deliveredAt!).getTime();
      return sum + (deliveredTime - sentTime);
    }, 0);
    const avgDelay = deliveredMessages.length > 0 ? (totalDelay / deliveredMessages.length / 1000).toFixed(2) : '0.00';

    res.json({
      success: true,
      data: {
        total,
        byStatus,
        byType,
        byPriority,
        successRate: parseFloat(successRate),
        avgDelaySeconds: parseFloat(avgDelay),
        failedCount: byStatus.failed || 0,
        retryingCount: byStatus.retrying || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取统计信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取消息趋势数据
router.get('/stats/trends', (req, res) => {
  try {
    const { tenantId, days = 7 } = req.query;
    const daysNum = parseInt(days as string);

    let filteredMessages = [...messages];

    // 按租户过滤
    if (tenantId) {
      filteredMessages = filteredMessages.filter(msg => msg.tenantId === tenantId);
    }

    // 生成日期范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    // 按日期分组统计
    const trends = [];
    for (let i = 0; i < daysNum; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const dayMessages = filteredMessages.filter(msg => {
        const msgDate = new Date(msg.createdAt).toISOString().split('T')[0];
        return msgDate === dateStr;
      });

      const successful = dayMessages.filter(msg => 
        msg.status === 'delivered' || msg.status === 'sent'
      ).length;

      trends.push({
        date: dateStr,
        total: dayMessages.length,
        successful,
        failed: dayMessages.filter(msg => msg.status === 'failed').length,
        successRate: dayMessages.length > 0 ? (successful / dayMessages.length * 100).toFixed(2) : '0.00'
      });
    }

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取趋势数据失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router; 