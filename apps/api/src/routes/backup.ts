import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 备份类型接口
interface BackupJob {
  id: string;
  name: string;
  type: 'database' | 'files' | 'full' | 'restore' | 'cleanup';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  size: number;
  location: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  errorMessage?: string;
  metadata: {
    tables?: string[];
    fileCount?: number;
    compression?: boolean;
    encryption?: boolean;
    retentionDays?: number;
    expiredCount?: number;
    originalBackupId?: string;
    [key: string]: any; // 允许其他属性
  };
}

interface BackupSchedule {
  id: string;
  name: string;
  type: 'database' | 'files' | 'full';
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:mm format
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  retention: number; // days to keep backups
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
  createdAt: string;
}

// 模拟备份数据存储
let backupJobs: BackupJob[] = [
  {
    id: 'backup-001',
    name: '数据库完整备份',
    type: 'database',
    status: 'completed',
    size: 524288000, // 500MB
    location: '/backups/database/backup-2024-01-20-10-00.sql.gz',
    createdAt: '2024-01-20T10:00:00Z',
    startedAt: '2024-01-20T10:00:00Z',
    completedAt: '2024-01-20T10:05:30Z',
    duration: 330, // 5分30秒
    metadata: {
      tables: ['users', 'tenants', 'messages', 'logs'],
      compression: true,
      encryption: false
    }
  },
  {
    id: 'backup-002',
    name: '文件系统备份',
    type: 'files',
    status: 'completed',
    size: 1073741824, // 1GB
    location: '/backups/files/backup-2024-01-20-02-00.tar.gz',
    createdAt: '2024-01-20T02:00:00Z',
    startedAt: '2024-01-20T02:00:00Z',
    completedAt: '2024-01-20T02:15:45Z',
    duration: 945, // 15分45秒
    metadata: {
      fileCount: 15420,
      compression: true,
      encryption: true
    }
  },
  {
    id: 'backup-003',
    name: '系统完整备份',
    type: 'full',
    status: 'running',
    size: 0,
    location: '/backups/full/backup-2024-01-20-16-00.tar.gz',
    createdAt: '2024-01-20T16:00:00Z',
    startedAt: '2024-01-20T16:00:00Z',
    metadata: {
      compression: true,
      encryption: true
    }
  }
];

let backupSchedules: BackupSchedule[] = [
  {
    id: 'schedule-001',
    name: '每日数据库备份',
    type: 'database',
    frequency: 'daily',
    time: '02:00',
    retention: 30,
    enabled: true,
    lastRun: '2024-01-20T02:00:00Z',
    nextRun: '2024-01-21T02:00:00Z',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'schedule-002',
    name: '每周文件备份',
    type: 'files',
    frequency: 'weekly',
    time: '03:00',
    dayOfWeek: 0, // Sunday
    retention: 90,
    enabled: true,
    lastRun: '2024-01-14T03:00:00Z',
    nextRun: '2024-01-21T03:00:00Z',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'schedule-003',
    name: '每月完整备份',
    type: 'full',
    frequency: 'monthly',
    time: '04:00',
    dayOfMonth: 1,
    retention: 365,
    enabled: false,
    nextRun: '2024-02-01T04:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// 获取备份作业列表
router.get('/jobs', (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    
    let filteredJobs = [...backupJobs];
    
    // 状态过滤
    if (status) {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }
    
    // 类型过滤
    if (type) {
      filteredJobs = filteredJobs.filter(job => job.type === type);
    }
    
    // 分页
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        jobs: paginatedJobs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredJobs.length,
          totalPages: Math.ceil(filteredJobs.length / Number(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取备份作业列表失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取单个备份作业
router.get('/jobs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const job = backupJobs.find(j => j.id === id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: '备份作业不存在'
      });
    }
    
    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取备份作业详情失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 创建备份作业
router.post('/jobs', (req, res) => {
  try {
    const { name, type, metadata = {} } = req.body;
    
    // 验证必填字段
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段'
      });
    }
    
    // 验证类型
    if (!['database', 'files', 'full'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: '无效的备份类型'
      });
    }
    
    const newJob: BackupJob = {
      id: uuidv4(),
      name,
      type,
      status: 'pending',
      size: 0,
      location: '',
      createdAt: new Date().toISOString(),
      metadata
    };
    
    backupJobs.unshift(newJob);
    
    // 模拟异步备份过程
    setTimeout(() => {
      const jobIndex = backupJobs.findIndex(j => j.id === newJob.id);
      if (jobIndex !== -1) {
        backupJobs[jobIndex].status = 'running';
        backupJobs[jobIndex].startedAt = new Date().toISOString();
        
        // 模拟备份完成
        setTimeout(() => {
          const finalJobIndex = backupJobs.findIndex(j => j.id === newJob.id);
          if (finalJobIndex !== -1) {
            backupJobs[finalJobIndex].status = 'completed';
            backupJobs[finalJobIndex].completedAt = new Date().toISOString();
            backupJobs[finalJobIndex].duration = Math.floor(Math.random() * 600) + 60; // 1-10分钟
            backupJobs[finalJobIndex].size = Math.floor(Math.random() * 1000000000) + 100000000; // 100MB-1GB
            backupJobs[finalJobIndex].location = `/backups/${type}/backup-${new Date().toISOString().split('T')[0]}-${Date.now()}.${type === 'database' ? 'sql.gz' : 'tar.gz'}`;
          }
        }, Math.floor(Math.random() * 300000) + 60000); // 1-6分钟
      }
    }, 1000);
    
    res.status(201).json({
      success: true,
      message: '备份作业创建成功',
      data: newJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建备份作业失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 取消备份作业
router.post('/jobs/:id/cancel', (req, res) => {
  try {
    const { id } = req.params;
    const jobIndex = backupJobs.findIndex(j => j.id === id);
    
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '备份作业不存在'
      });
    }
    
    const job = backupJobs[jobIndex];
    if (job.status !== 'pending' && job.status !== 'running') {
      return res.status(400).json({
        success: false,
        message: '只能取消待执行或运行中的备份作业'
      });
    }
    
    backupJobs[jobIndex].status = 'cancelled';
    backupJobs[jobIndex].completedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: '备份作业已取消',
      data: backupJobs[jobIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '取消备份作业失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 删除备份作业
router.delete('/jobs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const jobIndex = backupJobs.findIndex(j => j.id === id);
    
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '备份作业不存在'
      });
    }
    
    const job = backupJobs[jobIndex];
    if (job.status === 'running') {
      return res.status(400).json({
        success: false,
        message: '无法删除运行中的备份作业'
      });
    }
    
    backupJobs.splice(jobIndex, 1);
    
    res.json({
      success: true,
      message: '备份作业删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除备份作业失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 恢复备份
router.post('/jobs/:id/restore', (req, res) => {
  try {
    const { id } = req.params;
    const { targetLocation, options = {} } = req.body;
    
    const job = backupJobs.find(j => j.id === id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: '备份作业不存在'
      });
    }
    
    if (job.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: '只能恢复已完成的备份'
      });
    }
    
    // 模拟恢复过程
    const restoreJob = {
      id: uuidv4(),
      name: `恢复备份: ${job.name}`,
      type: 'restore' as any,
      status: 'running' as any,
      size: job.size,
      location: targetLocation || '/restore',
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      metadata: {
        ...options,
        originalBackupId: job.id
      }
    };
    
    backupJobs.unshift(restoreJob);
    
    // 模拟恢复完成
    setTimeout(() => {
      const restoreJobIndex = backupJobs.findIndex(j => j.id === restoreJob.id);
      if (restoreJobIndex !== -1) {
        backupJobs[restoreJobIndex].status = 'completed';
        backupJobs[restoreJobIndex].completedAt = new Date().toISOString();
        backupJobs[restoreJobIndex].duration = Math.floor(Math.random() * 300) + 30; // 30秒-5分钟
      }
    }, Math.floor(Math.random() * 180000) + 30000); // 30秒-3分钟
    
    res.json({
      success: true,
      message: '备份恢复已开始',
      data: restoreJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '恢复备份失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取备份计划列表
router.get('/schedules', (req, res) => {
  try {
    const { enabled, type } = req.query;
    
    let filteredSchedules = [...backupSchedules];
    
    // 启用状态过滤
    if (enabled !== undefined) {
      filteredSchedules = filteredSchedules.filter(schedule => 
        schedule.enabled === (enabled === 'true')
      );
    }
    
    // 类型过滤
    if (type) {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.type === type);
    }
    
    res.json({
      success: true,
      data: filteredSchedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取备份计划列表失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取单个备份计划
router.get('/schedules/:id', (req, res) => {
  try {
    const { id } = req.params;
    const schedule = backupSchedules.find(s => s.id === id);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: '备份计划不存在'
      });
    }
    
    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取备份计划详情失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 创建备份计划
router.post('/schedules', (req, res) => {
  try {
    const { name, type, frequency, time, dayOfWeek, dayOfMonth, retention, enabled = true } = req.body;
    
    // 验证必填字段
    if (!name || !type || !frequency || !time || !retention) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段'
      });
    }
    
    // 验证类型
    if (!['database', 'files', 'full'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: '无效的备份类型'
      });
    }
    
    // 验证频率
    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return res.status(400).json({
        success: false,
        message: '无效的频率'
      });
    }
    
    // 验证时间格式
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return res.status(400).json({
        success: false,
        message: '无效的时间格式 (HH:mm)'
      });
    }
    
    // 验证周几（每周备份）
    if (frequency === 'weekly' && (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6)) {
      return res.status(400).json({
        success: false,
        message: '每周备份需要指定星期几 (0-6)'
      });
    }
    
    // 验证日期（每月备份）
    if (frequency === 'monthly' && (dayOfMonth === undefined || dayOfMonth < 1 || dayOfMonth > 31)) {
      return res.status(400).json({
        success: false,
        message: '每月备份需要指定日期 (1-31)'
      });
    }
    
    // 计算下次运行时间
    const now = new Date();
    let nextRun = new Date();
    nextRun.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0);
    
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const newSchedule: BackupSchedule = {
      id: uuidv4(),
      name,
      type,
      frequency,
      time,
      dayOfWeek,
      dayOfMonth,
      retention,
      enabled,
      nextRun: nextRun.toISOString(),
      createdAt: new Date().toISOString()
    };
    
    backupSchedules.push(newSchedule);
    
    res.status(201).json({
      success: true,
      message: '备份计划创建成功',
      data: newSchedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建备份计划失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 更新备份计划
router.put('/schedules/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const scheduleIndex = backupSchedules.findIndex(s => s.id === id);
    if (scheduleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '备份计划不存在'
      });
    }
    
    // 更新计划
    backupSchedules[scheduleIndex] = {
      ...backupSchedules[scheduleIndex],
      ...updateData
    };
    
    res.json({
      success: true,
      message: '备份计划更新成功',
      data: backupSchedules[scheduleIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新备份计划失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 删除备份计划
router.delete('/schedules/:id', (req, res) => {
  try {
    const { id } = req.params;
    const scheduleIndex = backupSchedules.findIndex(s => s.id === id);
    
    if (scheduleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '备份计划不存在'
      });
    }
    
    backupSchedules.splice(scheduleIndex, 1);
    
    res.json({
      success: true,
      message: '备份计划删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除备份计划失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 启用/禁用备份计划
router.patch('/schedules/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const scheduleIndex = backupSchedules.findIndex(s => s.id === id);
    
    if (scheduleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '备份计划不存在'
      });
    }
    
    backupSchedules[scheduleIndex].enabled = !backupSchedules[scheduleIndex].enabled;
    
    res.json({
      success: true,
      message: `备份计划已${backupSchedules[scheduleIndex].enabled ? '启用' : '禁用'}`,
      data: backupSchedules[scheduleIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '切换备份计划状态失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取备份统计信息
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalJobs: backupJobs.length,
      completedJobs: backupJobs.filter(j => j.status === 'completed').length,
      failedJobs: backupJobs.filter(j => j.status === 'failed').length,
      runningJobs: backupJobs.filter(j => j.status === 'running').length,
      totalSize: backupJobs.reduce((sum, j) => sum + j.size, 0),
      totalSchedules: backupSchedules.length,
      enabledSchedules: backupSchedules.filter(s => s.enabled).length,
      byType: {
        database: backupJobs.filter(j => j.type === 'database').length,
        files: backupJobs.filter(j => j.type === 'files').length,
        full: backupJobs.filter(j => j.type === 'full').length
      },
      byStatus: {
        pending: backupJobs.filter(j => j.status === 'pending').length,
        running: backupJobs.filter(j => j.status === 'running').length,
        completed: backupJobs.filter(j => j.status === 'completed').length,
        failed: backupJobs.filter(j => j.status === 'failed').length,
        cancelled: backupJobs.filter(j => j.status === 'cancelled').length
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取备份统计信息失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 清理过期备份
router.post('/cleanup', (req, res) => {
  try {
    const { retentionDays = 30 } = req.query;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - Number(retentionDays));
    
    const expiredJobs = backupJobs.filter(job => 
      job.status === 'completed' && 
      new Date(job.createdAt) < cutoffDate
    );
    
    // 模拟清理过程
    const cleanupJob = {
      id: uuidv4(),
      name: `清理过期备份 (${retentionDays}天前)`,
      type: 'cleanup' as any,
      status: 'running' as any,
      size: 0,
      location: '/cleanup',
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      metadata: {
        retentionDays: Number(retentionDays),
        expiredCount: expiredJobs.length
      }
    };
    
    backupJobs.unshift(cleanupJob);
    
    // 模拟清理完成
    setTimeout(() => {
      const cleanupJobIndex = backupJobs.findIndex(j => j.id === cleanupJob.id);
      if (cleanupJobIndex !== -1) {
        backupJobs[cleanupJobIndex].status = 'completed';
        backupJobs[cleanupJobIndex].completedAt = new Date().toISOString();
        backupJobs[cleanupJobIndex].duration = Math.floor(Math.random() * 60) + 10; // 10-70秒
        backupJobs[cleanupJobIndex].size = expiredJobs.reduce((sum, j) => sum + j.size, 0);
      }
    }, Math.floor(Math.random() * 30000) + 10000); // 10-40秒
    
    res.json({
      success: true,
      message: '备份清理已开始',
      data: {
        cleanupJob,
        expiredJobs: expiredJobs.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '清理过期备份失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router; 