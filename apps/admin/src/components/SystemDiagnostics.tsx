import React, { useState, useEffect } from 'react';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    in: number;
    out: number;
  };
}

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  uptime: number;
  memory: number;
  cpu: number;
}

interface DiagnosticResult {
  category: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: string;
}

const SystemDiagnostics: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 45.2,
    memory: 68.5,
    disk: 32.1,
    network: { in: 1024, out: 2048 }
  });

  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'API Service', status: 'running', uptime: 3600, memory: 128, cpu: 2.5 },
    { name: 'Real-time Service', status: 'running', uptime: 1800, memory: 64, cpu: 1.2 },
    { name: 'Database', status: 'running', uptime: 7200, memory: 256, cpu: 5.0 },
    { name: 'Redis', status: 'running', uptime: 5400, memory: 32, cpu: 0.8 },
  ]);

  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  useEffect(() => {
    // 模拟实时更新系统指标
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
        network: {
          in: Math.max(0, prev.network.in + (Math.random() - 0.5) * 100),
          out: Math.max(0, prev.network.out + (Math.random() - 0.5) * 100)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setDiagnostics([]);

    // 模拟诊断过程
    const diagnosticSteps = [
      { category: '系统资源', delay: 1000 },
      { category: '网络连接', delay: 1500 },
      { category: '数据库连接', delay: 2000 },
      { category: '服务状态', delay: 1000 },
      { category: '安全检查', delay: 1500 },
    ];

    for (const step of diagnosticSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      
      const result = generateDiagnosticResult(step.category);
      setDiagnostics(prev => [...prev, result]);
    }

    setIsRunningDiagnostics(false);
  };

  const generateDiagnosticResult = (category: string): DiagnosticResult => {
    const random = Math.random();
    
    if (random > 0.8) {
      return {
        category,
        status: 'error',
        message: `${category}检查发现问题`,
        details: '需要立即处理的问题'
      };
    } else if (random > 0.6) {
      return {
        category,
        status: 'warning',
        message: `${category}检查发现警告`,
        details: '建议关注的问题'
      };
    } else {
      return {
        category,
        status: 'healthy',
        message: `${category}检查正常`,
        details: '所有指标都在正常范围内'
      };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'stopped': return 'text-red-600 bg-red-100';
      case 'error': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">系统诊断</h1>
        <p className="text-gray-600">监控系统性能和健康状况</p>
      </div>

      {/* 系统指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">CPU 使用率</div>
              <div className="text-2xl font-bold text-gray-900">{systemMetrics.cpu.toFixed(1)}%</div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              systemMetrics.cpu > 80 ? 'bg-red-100' : 
              systemMetrics.cpu > 60 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <span className={`text-lg font-bold ${
                systemMetrics.cpu > 80 ? 'text-red-600' : 
                systemMetrics.cpu > 60 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {systemMetrics.cpu.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">内存使用率</div>
              <div className="text-2xl font-bold text-gray-900">{systemMetrics.memory.toFixed(1)}%</div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              systemMetrics.memory > 80 ? 'bg-red-100' : 
              systemMetrics.memory > 60 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <span className={`text-lg font-bold ${
                systemMetrics.memory > 80 ? 'text-red-600' : 
                systemMetrics.memory > 60 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {systemMetrics.memory.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">磁盘使用率</div>
              <div className="text-2xl font-bold text-gray-900">{systemMetrics.disk.toFixed(1)}%</div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              systemMetrics.disk > 90 ? 'bg-red-100' : 
              systemMetrics.disk > 70 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <span className={`text-lg font-bold ${
                systemMetrics.disk > 90 ? 'text-red-600' : 
                systemMetrics.disk > 70 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {systemMetrics.disk.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div>
            <div className="text-sm font-medium text-gray-500">网络流量</div>
            <div className="text-sm text-gray-900">
              入: {formatBytes(systemMetrics.network.in)}/s
            </div>
            <div className="text-sm text-gray-900">
              出: {formatBytes(systemMetrics.network.out)}/s
            </div>
          </div>
        </div>
      </div>

      {/* 服务状态 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">服务状态</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">服务名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">运行时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内存 (MB)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPU (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusColor(service.status)}`}>
                      {service.status === 'running' ? '运行中' : 
                       service.status === 'stopped' ? '已停止' : '错误'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatUptime(service.uptime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.memory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.cpu.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 诊断结果 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">诊断结果</h2>
            <button
              onClick={runDiagnostics}
              disabled={isRunningDiagnostics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunningDiagnostics ? '诊断中...' : '运行诊断'}
            </button>
          </div>
        </div>
        <div className="p-6">
          {diagnostics.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              点击"运行诊断"开始系统检查
            </div>
          ) : (
            <div className="space-y-4">
              {diagnostics.map((result, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    result.status === 'healthy' ? 'bg-green-500' :
                    result.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{result.category}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
                        {result.status === 'healthy' ? '正常' : 
                         result.status === 'warning' ? '警告' : '错误'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">{result.message}</div>
                    {result.details && (
                      <div className="text-xs text-gray-500 mt-1">{result.details}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemDiagnostics; 