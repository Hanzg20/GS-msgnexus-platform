import React, { useState, useEffect } from 'react';

interface Process {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  pid: number;
  memory: number;
  cpu: number;
  uptime: number;
  port: number;
}

const ProcessManager: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([
    {
      id: '1',
      name: 'MsgNexus API',
      status: 'running',
      pid: 12345,
      memory: 128,
      cpu: 2.5,
      uptime: 3600,
      port: 3030
    },
    {
      id: '2',
      name: 'MsgNexus Real-time',
      status: 'running',
      pid: 12346,
      memory: 64,
      cpu: 1.2,
      uptime: 1800,
      port: 3031
    },
    {
      id: '3',
      name: 'Database',
      status: 'running',
      pid: 12347,
      memory: 256,
      cpu: 5.0,
      uptime: 7200,
      port: 5432
    },
    {
      id: '4',
      name: 'Redis',
      status: 'running',
      pid: 12348,
      memory: 32,
      cpu: 0.8,
      uptime: 5400,
      port: 6379
    }
  ]);

  const [loading, setLoading] = useState(false);

  const handleStartProcess = async (processId: string) => {
    setLoading(true);
    // 模拟启动进程
    setTimeout(() => {
      setProcesses(prev => prev.map(p => 
        p.id === processId ? { ...p, status: 'running' as const } : p
      ));
      setLoading(false);
    }, 1000);
  };

  const handleStopProcess = async (processId: string) => {
    setLoading(true);
    // 模拟停止进程
    setTimeout(() => {
      setProcesses(prev => prev.map(p => 
        p.id === processId ? { ...p, status: 'stopped' as const } : p
      ));
      setLoading(false);
    }, 1000);
  };

  const handleRestartProcess = async (processId: string) => {
    setLoading(true);
    // 模拟重启进程
    setTimeout(() => {
      setProcesses(prev => prev.map(p => 
        p.id === processId ? { ...p, status: 'running' as const, uptime: 0 } : p
      ));
      setLoading(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">进程管理</h1>
        <p className="text-gray-600">管理系统服务的启动、停止和重启</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">系统服务</h2>
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setProcesses(prev => prev.map(p => ({ ...p, status: 'running' as const })));
                  setLoading(false);
                }, 2000);
              }}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '操作中...' : '启动所有服务'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  服务名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  内存 (MB)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPU (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  运行时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  端口
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processes.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{process.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(process.status)}`}>
                      {process.status === 'running' ? '运行中' : 
                       process.status === 'stopped' ? '已停止' : '错误'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.pid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.memory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.cpu.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatUptime(process.uptime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {process.port}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {process.status === 'stopped' ? (
                        <button
                          onClick={() => handleStartProcess(process.id)}
                          disabled={loading}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          启动
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStopProcess(process.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          停止
                        </button>
                      )}
                      <button
                        onClick={() => handleRestartProcess(process.id)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                      >
                        重启
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">总服务数</div>
          <div className="text-2xl font-bold text-gray-900">{processes.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">运行中</div>
          <div className="text-2xl font-bold text-green-600">
            {processes.filter(p => p.status === 'running').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">已停止</div>
          <div className="text-2xl font-bold text-red-600">
            {processes.filter(p => p.status === 'stopped').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">总内存使用</div>
          <div className="text-2xl font-bold text-gray-900">
            {processes.reduce((sum, p) => sum + p.memory, 0)} MB
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessManager; 