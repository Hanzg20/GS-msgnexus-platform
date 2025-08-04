import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Memory, 
  Network, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Bell,
  Eye,
  Download,
  Server,
  Database,
  Globe
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient from '../../services/api';

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connections: number;
  };
  uptime: number;
  platform: string;
  nodeVersion: string;
  processMemory: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
}

interface HealthStatus {
  overall: string;
  timestamp: string;
  uptime: number;
  checks: {
    cpu: { status: string; value: number; threshold: number };
    memory: { status: string; value: number; threshold: number };
    disk: { status: string; value: number; threshold: number };
    network: { status: string; value: number; threshold: number };
    database: { status: string; value: number; threshold: number };
  };
  services: {
    api: string;
    database: string;
    redis: string;
    nginx: string;
  };
}

interface Alert {
  id: string;
  timestamp: string;
  severity: string;
  status: string;
  title: string;
  message: string;
  source: string;
  metric: string;
  value: number;
  threshold: number;
  acknowledged: boolean;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
}

const SystemMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  // 获取系统概览
  const fetchSystemOverview = async () => {
    try {
      const response = await apiClient.get('/api/v1/system/overview');
      if (response.success) {
        setMetrics(response.data);
      }
    } catch (error: any) {
      console.error('获取系统概览失败:', error);
    }
  };

  // 获取健康状态
  const fetchHealthStatus = async () => {
    try {
      const response = await apiClient.get('/api/v1/system/health');
      if (response.success) {
        setHealth(response.data);
      }
    } catch (error: any) {
      console.error('获取健康状态失败:', error);
    }
  };

  // 获取告警信息
  const fetchAlerts = async () => {
    try {
      const response = await apiClient.get('/api/v1/system/alerts');
      if (response.success) {
        setAlerts(response.data.alerts);
      }
    } catch (error: any) {
      console.error('获取告警信息失败:', error);
    }
  };

  // 确认告警
  const acknowledgeAlert = async (alertId: string) => {
    try {
      const response = await apiClient.post(`/api/v1/system/alerts/${alertId}/acknowledge`, {
        acknowledgedBy: 'admin'
      });
      if (response.success) {
        fetchAlerts();
      }
    } catch (error: any) {
      console.error('确认告警失败:', error);
    }
  };

  // 刷新数据
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchSystemOverview(),
      fetchHealthStatus(),
      fetchAlerts()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();

    // 自动刷新
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(refreshData, 30000); // 每30秒刷新一次
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}天 ${hours}小时 ${minutes}分钟`;
    } else if (hours > 0) {
      return `${hours}小时 ${minutes}分钟`;
    } else {
      return `${minutes}分钟`;
    }
  };

  if (loading && !metrics) {
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
          <p style={{ color: '#6b7280', fontSize: '18px' }}>正在加载系统监控数据...</p>
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
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>系统监控</h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              实时监控系统性能、资源使用情况和健康状态
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button
              variant="ghost"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              刷新
            </Button>
            <Button
              variant={autoRefresh ? 'primary' : 'ghost'}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Activity style={{ width: '16px', height: '16px' }} />
              {autoRefresh ? '自动刷新开启' : '自动刷新关闭'}
            </Button>
            <Button variant="ghost">
              <Download style={{ width: '16px', height: '16px' }} />
              导出报告
            </Button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* 系统概览卡片 */}
        {metrics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>CPU 使用率</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{metrics.cpu.usage}%</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{metrics.cpu.cores} 核心</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Memory style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>内存使用率</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{metrics.memory.usage}%</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HardDrive style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>磁盘使用率</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{metrics.disk.usage}%</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{formatBytes(metrics.disk.used)} / {formatBytes(metrics.disk.total)}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#8b5cf6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Network style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>网络连接</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{metrics.network.connections}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{formatBytes(metrics.network.bytesIn)} / {formatBytes(metrics.network.bytesOut)}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 健康状态 */}
        {health && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <Card>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>系统健康状态</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                {getStatusIcon(health.overall)}
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  ...getStatusColor(health.overall).split(' ').reduce((acc, className) => {
                    if (className.includes('text-')) acc.color = className.replace('text-', '#');
                    return acc;
                  }, {} as any)
                }}>
                  {health.overall === 'healthy' ? '健康' : health.overall === 'warning' ? '警告' : '严重'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(health.checks).map(([key, check]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(check.status)}
                      <span style={{ fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                        {key === 'cpu' ? 'CPU' : key === 'memory' ? '内存' : key === 'disk' ? '磁盘' : key === 'network' ? '网络' : '数据库'}
                      </span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{check.value}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>服务状态</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(health.services).map(([service, status]) => (
                  <div key={service} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {status === 'running' ? (
                        <CheckCircle style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                      ) : (
                        <AlertTriangle style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                      )}
                      <span style={{ fontSize: '14px', color: '#374151', textTransform: 'capitalize' }}>
                        {service === 'api' ? 'API服务' : service === 'database' ? '数据库' : service === 'redis' ? 'Redis缓存' : 'Nginx'}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      backgroundColor: status === 'running' ? '#dcfce7' : '#fef2f2',
                      color: status === 'running' ? '#166534' : '#dc2626'
                    }}>
                      {status === 'running' ? '运行中' : '停止'}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  运行时间: {formatUptime(health.uptime)}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  最后检查: {new Date(health.timestamp).toLocaleString()}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* 资源使用详情 */}
        {metrics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <Card>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>CPU 负载</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>1分钟平均</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{metrics.cpu.loadAverage[0].toFixed(2)}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(metrics.cpu.loadAverage[0] * 10, 100)}%`, 
                      height: '100%', 
                      backgroundColor: '#3b82f6', 
                      transition: 'width 0.3s ease' 
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>5分钟平均</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{metrics.cpu.loadAverage[1].toFixed(2)}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(metrics.cpu.loadAverage[1] * 10, 100)}%`, 
                      height: '100%', 
                      backgroundColor: '#f59e0b', 
                      transition: 'width 0.3s ease' 
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>15分钟平均</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{metrics.cpu.loadAverage[2].toFixed(2)}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${Math.min(metrics.cpu.loadAverage[2] * 10, 100)}%`, 
                      height: '100%', 
                      backgroundColor: '#10b981', 
                      transition: 'width 0.3s ease' 
                    }} />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>内存详情</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>已使用</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{formatBytes(metrics.memory.used)}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${metrics.memory.usage}%`, 
                      height: '100%', 
                      backgroundColor: '#f59e0b', 
                      transition: 'width 0.3s ease' 
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>可用</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{formatBytes(metrics.memory.free)}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${100 - metrics.memory.usage}%`, 
                      height: '100%', 
                      backgroundColor: '#10b981', 
                      transition: 'width 0.3s ease' 
                    }} />
                  </div>
                </div>
                <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    进程内存: {formatBytes(metrics.processMemory.heapUsed)} / {formatBytes(metrics.processMemory.heapTotal)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 告警列表 */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>系统告警</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                共 {alerts.length} 条告警
              </span>
            </div>
          </div>
          
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <CheckCircle style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#22c55e' }} />
              <p>暂无告警</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {alerts.map((alert) => (
                <div key={alert.id} style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  backgroundColor: alert.severity === 'critical' ? '#fef2f2' : 
                                  alert.severity === 'warning' ? '#fffbeb' : '#f0f9ff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        {alert.severity === 'critical' ? (
                          <AlertTriangle style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                        ) : alert.severity === 'warning' ? (
                          <AlertTriangle style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                        ) : (
                          <Bell style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                        )}
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: alert.severity === 'critical' ? '#dc2626' : 
                                 alert.severity === 'warning' ? '#d97706' : '#2563eb'
                        }}>
                          {alert.title}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: alert.status === 'active' ? '#fef2f2' : '#f0fdf4',
                          color: alert.status === 'active' ? '#dc2626' : '#166534'
                        }}>
                          {alert.status === 'active' ? '活跃' : '已解决'}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                        {alert.message}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
                        <span>来源: {alert.source}</span>
                        <span>值: {alert.value} (阈值: {alert.threshold})</span>
                        <span>时间: {new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    {alert.status === 'active' && !alert.acknowledged && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        确认
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SystemMonitor; 