import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Database, 
  FileText, 
  Server, 
  Play, 
  Pause, 
  Trash2, 
  Download, 
  Upload, 
  Clock, 
  Calendar,
  Settings,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Plus,
  Edit,
  Eye,
  BarChart3,
  TrendingUp,
  Archive,
  Shield
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import Card from './ui/Card';
import Button from './ui/Button';
import apiClient from '../services/api';

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
    [key: string]: any;
  };
}

interface BackupSchedule {
  id: string;
  name: string;
  type: 'database' | 'files' | 'full';
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  retention: number;
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
  createdAt: string;
}

interface BackupStats {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  runningJobs: number;
  totalSize: number;
  totalSchedules: number;
  enabledSchedules: number;
  byType: {
    database: number;
    files: number;
    full: number;
  };
  byStatus: {
    pending: number;
    running: number;
    completed: number;
    failed: number;
    cancelled: number;
  };
}

const BackupManager: React.FC = () => {
  const [jobs, setJobs] = useState<BackupJob[]>([]);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<BackupJob | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showCreateSchedule, setShowCreateSchedule] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });

  // 获取备份作业列表
  const fetchJobs = async () => {
    try {
      const response = await apiClient.get('/api/v1/backup/jobs');
      if (response.data) {
        const data = response.data as any;
        // 确保jobs是数组
        let jobsData = [];
        if (Array.isArray(data)) {
          jobsData = data;
        } else if (data && Array.isArray(data.jobs)) {
          jobsData = data.jobs;
        } else if (data && typeof data === 'object') {
          // 如果data是对象但不是数组，尝试转换为数组
          jobsData = Object.values(data).filter(item => typeof item === 'object' && item !== null);
        }
        setJobs(jobsData);
      } else {
        setJobs([]);
      }
    } catch (error: any) {
      console.error('获取备份作业列表失败:', error);
      setJobs([]);
    }
  };

  // 获取备份计划列表
  const fetchSchedules = async () => {
    try {
      const response = await apiClient.get('/api/v1/backup/schedules');
      if (response.data) {
        const data = response.data as any;
        setSchedules(Array.isArray(data) ? data : (data.schedules || []));
      }
    } catch (error: any) {
      console.error('获取备份计划列表失败:', error);
      setSchedules([]);
    }
  };

  // 获取备份统计信息
  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/v1/backup/stats');
      if (response.data) {
        const data = response.data as BackupStats;
        setStats(data);
      }
    } catch (error: any) {
      console.error('获取备份统计信息失败:', error);
      setStats(null);
    }
  };

  // 创建备份作业
  const createBackupJob = async (jobData: { name: string; type: string; metadata?: any }) => {
    try {
      const response = await apiClient.post('/api/v1/backup/jobs', jobData);
      if (response.data) {
        fetchJobs();
        setShowCreateJob(false);
      }
    } catch (error: any) {
      console.error('创建备份作业失败:', error);
    }
  };

  // 取消备份作业
  const cancelBackupJob = async (jobId: string) => {
    try {
      const response = await apiClient.post(`/api/v1/backup/jobs/${jobId}/cancel`);
      if (response.data) {
        fetchJobs();
      }
    } catch (error: any) {
      console.error('取消备份作业失败:', error);
    }
  };

  // 删除备份作业
  const deleteBackupJob = async (jobId: string) => {
    if (!confirm('确定要删除这个备份作业吗？')) return;
    
    try {
      const response = await apiClient.delete(`/api/v1/backup/jobs/${jobId}`);
      if (response.data) {
        fetchJobs();
        fetchStats();
      }
    } catch (error: any) {
      console.error('删除备份作业失败:', error);
    }
  };

  // 恢复备份
  const restoreBackup = async (jobId: string, targetLocation?: string) => {
    try {
      const response = await apiClient.post(`/api/v1/backup/jobs/${jobId}/restore`, {
        targetLocation: targetLocation || '/restore'
      });
      if (response.data) {
        fetchJobs();
        alert('备份恢复已开始');
      }
    } catch (error: any) {
      console.error('恢复备份失败:', error);
    }
  };

  // 创建备份计划
  const createBackupSchedule = async (scheduleData: any) => {
    try {
      const response = await apiClient.post('/api/v1/backup/schedules', scheduleData);
      if (response.data) {
        fetchSchedules();
        setShowCreateSchedule(false);
      }
    } catch (error: any) {
      console.error('创建备份计划失败:', error);
    }
  };

  // 切换备份计划状态
  const toggleSchedule = async (scheduleId: string) => {
    try {
      const response = await apiClient.patch(`/api/v1/backup/schedules/${scheduleId}/toggle`);
      if (response.data) {
        fetchSchedules();
      }
    } catch (error: any) {
      console.error('切换备份计划状态失败:', error);
    }
  };

  // 删除备份计划
  const deleteSchedule = async (scheduleId: string) => {
    if (!confirm('确定要删除这个备份计划吗？')) return;
    
    try {
      const response = await apiClient.delete(`/api/v1/backup/schedules/${scheduleId}`);
      if (response.data) {
        fetchSchedules();
        fetchStats();
      }
    } catch (error: any) {
      console.error('删除备份计划失败:', error);
    }
  };

  // 清理过期备份
  const cleanupExpiredBackups = async (retentionDays: number = 30) => {
    try {
      const response = await apiClient.post(`/api/v1/backup/cleanup?retentionDays=${retentionDays}`);
      if (response.data) {
        fetchJobs();
        fetchStats();
        alert('备份清理已开始');
      }
    } catch (error: any) {
      console.error('清理过期备份失败:', error);
    }
  };

  // 刷新数据
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchJobs(),
      fetchSchedules(),
      fetchStats()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <Pause className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'files':
        return <FileText className="w-4 h-4" />;
      case 'full':
        return <Server className="w-4 h-4" />;
      case 'restore':
        return <RotateCcw className="w-4 h-4" />;
      case 'cleanup':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <HardDrive className="w-4 h-4" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
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
          <p style={{ color: '#6b7280', fontSize: '18px' }}>正在加载备份管理数据...</p>
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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>备份管理</h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              管理系统备份、恢复和备份计划
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="ghost" onClick={refreshData}>
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              刷新
            </Button>
            <Button variant="primary" onClick={() => setShowCreateJob(true)}>
              <Plus style={{ width: '16px', height: '16px' }} />
              创建备份
            </Button>
            <Button variant="secondary" onClick={() => setShowCreateSchedule(true)}>
              <Calendar style={{ width: '16px', height: '16px' }} />
              创建计划
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
                  <Archive style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>总备份数</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.totalJobs}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#22c55e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>成功备份</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.completedJobs}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HardDrive style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>总大小</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{formatBytes(stats.totalSize)}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#8b5cf6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>备份计划</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.enabledSchedules}/{stats.totalSchedules}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 备份作业列表 */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>备份作业</h3>
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
                <option value="pending">待执行</option>
                <option value="running">运行中</option>
                <option value="completed">已完成</option>
                <option value="failed">失败</option>
                <option value="cancelled">已取消</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">所有类型</option>
                <option value="database">数据库</option>
                <option value="files">文件</option>
                <option value="full">完整备份</option>
                <option value="restore">恢复</option>
                <option value="cleanup">清理</option>
              </select>
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>作业名称</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>类型</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>状态</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>大小</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>创建时间</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(jobs) ? jobs
                  .filter(job => 
                    (!filters.status || job.status === filters.status) &&
                    (!filters.type || job.type === filters.type)
                  )
                  .map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <p style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                          {job.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          {job.location}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getTypeIcon(job.type)}
                        <span style={{ textTransform: 'capitalize' }}>
                          {job.type === 'database' ? '数据库' : 
                           job.type === 'files' ? '文件' : 
                           job.type === 'full' ? '完整备份' : 
                           job.type === 'restore' ? '恢复' : '清理'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusIcon(job.status)}
                        <span style={{ textTransform: 'capitalize' }}>
                          {job.status === 'pending' ? '待执行' : 
                           job.status === 'running' ? '运行中' : 
                           job.status === 'completed' ? '已完成' : 
                           job.status === 'failed' ? '失败' : '已取消'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <p style={{ fontSize: '14px', color: '#374151' }}>{formatBytes(job.size)}</p>
                      {job.duration && (
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          {formatDuration(job.duration)}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>
                        {new Date(job.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedJob(job); setShowJobDetails(true); }}
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </Button>
                        {job.status === 'completed' && job.type !== 'restore' && job.type !== 'cleanup' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => restoreBackup(job.id)}
                          >
                            <RotateCcw style={{ width: '16px', height: '16px' }} />
                          </Button>
                        )}
                        {(job.status === 'pending' || job.status === 'running') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelBackupJob(job.id)}
                          >
                            <Pause style={{ width: '16px', height: '16px' }} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBackupJob(job.id)}
                        >
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : []}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 备份计划列表 */}
        <div style={{ marginTop: '24px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>备份计划</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {schedules.map((schedule) => (
                <div key={schedule.id} style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  backgroundColor: schedule.enabled ? '#f0f9ff' : '#f9fafb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                        {schedule.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getTypeIcon(schedule.type)}
                        <span style={{ fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>
                          {schedule.type === 'database' ? '数据库' : 
                           schedule.type === 'files' ? '文件' : '完整备份'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSchedule(schedule.id)}
                      >
                        {schedule.enabled ? <Pause style={{ width: '16px', height: '16px' }} /> : <Play style={{ width: '16px', height: '16px' }} />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSchedule(schedule.id)}
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                      </Button>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>频率:</span>
                      <span style={{ textTransform: 'capitalize' }}>
                        {schedule.frequency === 'daily' ? '每日' : 
                         schedule.frequency === 'weekly' ? '每周' : '每月'}
                        {schedule.frequency === 'weekly' && schedule.dayOfWeek !== undefined && 
                         ` (周${['日', '一', '二', '三', '四', '五', '六'][schedule.dayOfWeek]})`}
                        {schedule.frequency === 'monthly' && schedule.dayOfMonth && 
                         ` (${schedule.dayOfMonth}日)`}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>时间:</span>
                      <span>{schedule.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>保留天数:</span>
                      <span>{schedule.retention} 天</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>下次运行:</span>
                      <span>{new Date(schedule.nextRun).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 快速操作 */}
        <div style={{ marginTop: '24px' }}>
          <Card>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>快速操作</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                onClick={() => cleanupExpiredBackups(30)}
              >
                <Trash2 style={{ width: '16px', height: '16px' }} />
                清理30天前备份
              </Button>
              <Button
                variant="secondary"
                onClick={() => cleanupExpiredBackups(90)}
              >
                <Trash2 style={{ width: '16px', height: '16px' }} />
                清理90天前备份
              </Button>
              <Button
                variant="secondary"
                onClick={() => createBackupJob({ name: '手动数据库备份', type: 'database' })}
              >
                <Database style={{ width: '16px', height: '16px' }} />
                立即备份数据库
              </Button>
              <Button
                variant="secondary"
                onClick={() => createBackupJob({ name: '手动文件备份', type: 'files' })}
              >
                <FileText style={{ width: '16px', height: '16px' }} />
                立即备份文件
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 备份作业详情弹窗 */}
      {showJobDetails && selectedJob && (
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
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>备份作业详情</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowJobDetails(false)}>
                ✕
              </Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>作业名称</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedJob.name}</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>类型</label>
                  <p style={{ fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>
                    {selectedJob.type === 'database' ? '数据库' : 
                     selectedJob.type === 'files' ? '文件' : 
                     selectedJob.type === 'full' ? '完整备份' : 
                     selectedJob.type === 'restore' ? '恢复' : '清理'}
                  </p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>状态</label>
                  <p style={{ fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>
                    {selectedJob.status === 'pending' ? '待执行' : 
                     selectedJob.status === 'running' ? '运行中' : 
                     selectedJob.status === 'completed' ? '已完成' : 
                     selectedJob.status === 'failed' ? '失败' : '已取消'}
                  </p>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>存储位置</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedJob.location}</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>大小</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{formatBytes(selectedJob.size)}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>耗时</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{formatDuration(selectedJob.duration || 0)}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>创建时间</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{new Date(selectedJob.createdAt).toLocaleString()}</p>
                </div>
                {selectedJob.completedAt && (
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>完成时间</label>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>{new Date(selectedJob.completedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              {selectedJob.errorMessage && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>错误信息</label>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#dc2626'
                  }}>
                    {selectedJob.errorMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupManager; 