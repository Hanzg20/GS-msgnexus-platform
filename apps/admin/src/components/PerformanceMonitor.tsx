import React, { useState, useEffect } from 'react';

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    in: number;
    out: number;
  };
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeConnections: number;
}

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: number;
  memory: number;
  cpu: number;
  lastCheck: string;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpu: 45.2,
    memory: 68.5,
    disk: 32.1,
    network: { in: 1024, out: 2048 },
    responseTime: 125,
    throughput: 1500,
    errorRate: 0.02,
    activeConnections: 245
  });

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'API 服务',
      status: 'running',
      uptime: 86400,
      memory: 256,
      cpu: 15.2,
      lastCheck: '2024-01-01T10:00:00Z'
    },
    {
      name: '实时通信服务',
      status: 'running',
      uptime: 86400,
      memory: 128,
      cpu: 8.5,
      lastCheck: '2024-01-01T10:00:00Z'
    },
    {
      name: '数据库服务',
      status: 'running',
      uptime: 172800,
      memory: 512,
      cpu: 12.3,
      lastCheck: '2024-01-01T10:00:00Z'
    },
    {
      name: 'Redis 缓存',
      status: 'running',
      uptime: 86400,
      memory: 64,
      cpu: 3.1,
      lastCheck: '2024-01-01T10:00:00Z'
    }
  ]);

  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        // 模拟实时数据更新
        setMetrics(prev => ({
          ...prev,
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          responseTime: Math.random() * 200 + 50,
          throughput: Math.random() * 2000 + 1000,
          activeConnections: Math.floor(Math.random() * 500 + 100)
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'stopped': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value < threshold * 0.7) return 'text-green-600';
    if (value < threshold * 0.9) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}天 ${hours}小时`;
    if (hours > 0) return `${hours}小时 ${minutes}分钟`;
    return `${minutes}分钟`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const exportPerformanceReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      services,
      timeRange: selectedTimeRange
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">性能监控</h1>
        <p className="text-gray-600">实时监控系统性能和资源使用情况</p>
      </div>

      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">时间范围</label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="1h">最近1小时</option>
                  <option value="6h">最近6小时</option>
                  <option value="24h">最近24小时</option>
                  <option value="7d">最近7天</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={isAutoRefresh}
                  onChange={(e) => setIsAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoRefresh" className="ml-2 text-sm text-gray-700">
                  自动刷新
                </label>
              </div>
            </div>
            <button
              onClick={exportPerformanceReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              导出报告
            </button>
          </div>
        </div>
      </div>

      {/* 系统指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">CPU 使用率</h3>
            <span className={`text-2xl font-bold ${getPerformanceColor(metrics.cpu, 80)}`}>
              {metrics.cpu.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(metrics.cpu, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">阈值: 80%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">内存使用率</h3>
            <span className={`text-2xl font-bold ${getPerformanceColor(metrics.memory, 85)}`}>
              {metrics.memory.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(metrics.memory, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">阈值: 85%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">响应时间</h3>
            <span className={`text-2xl font-bold ${getPerformanceColor(metrics.responseTime, 200)}`}>
              {metrics.responseTime.toFixed(0)}ms
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((metrics.responseTime / 500) * 100, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">阈值: 200ms</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">活跃连接</h3>
            <span className="text-2xl font-bold text-blue-600">
              {metrics.activeConnections}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((metrics.activeConnections / 1000) * 100, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">最大: 1000</p>
        </div>
      </div>

      {/* 详细指标 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">网络流量</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">入站流量</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatBytes(metrics.network.in * 1024)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">出站流量</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatBytes(metrics.network.out * 1024)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">吞吐量</span>
                <span className="text-sm font-medium text-gray-900">
                  {metrics.throughput.toFixed(0)} req/s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">错误率</span>
                <span className={`text-sm font-medium ${getPerformanceColor(metrics.errorRate * 100, 5)}`}>
                  {(metrics.errorRate * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">磁盘使用</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">使用率</span>
                <span className={`text-sm font-medium ${getPerformanceColor(metrics.disk, 80)}`}>
                  {metrics.disk.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full"
                  style={{ width: `${metrics.disk}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">可用空间</span>
                <span className="text-sm font-medium text-gray-900">
                  {((100 - metrics.disk) * 10).toFixed(1)} GB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 服务状态 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">服务状态</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">服务名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">运行时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内存使用</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPU 使用</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最后检查</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                      {service.status === 'running' ? '运行中' : 
                       service.status === 'stopped' ? '已停止' : '错误'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatUptime(service.uptime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.memory} MB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.cpu.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(service.lastCheck).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">重启</button>
                      <button className="text-gray-600 hover:text-gray-900">日志</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 