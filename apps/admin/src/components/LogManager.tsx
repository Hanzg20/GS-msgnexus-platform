import React, { useState, useEffect } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  message: string;
  details?: string;
}

const LogManager: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2024-01-01T10:00:00Z',
      level: 'info',
      service: 'API',
      message: 'Server started successfully on port 3030'
    },
    {
      id: '2',
      timestamp: '2024-01-01T10:01:00Z',
      level: 'info',
      service: 'Real-time',
      message: 'WebSocket server initialized'
    },
    {
      id: '3',
      timestamp: '2024-01-01T10:02:00Z',
      level: 'warn',
      service: 'Database',
      message: 'Connection pool running low'
    },
    {
      id: '4',
      timestamp: '2024-01-01T10:03:00Z',
      level: 'error',
      service: 'API',
      message: 'Failed to connect to external service',
      details: 'Connection timeout after 30 seconds'
    },
    {
      id: '5',
      timestamp: '2024-01-01T10:04:00Z',
      level: 'debug',
      service: 'Cache',
      message: 'Cache miss for key: user:123'
    }
  ]);

  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const filteredLogs = logs.filter(log => {
    const levelMatch = filterLevel === 'all' || log.level === filterLevel;
    const serviceMatch = filterService === 'all' || log.service === filterService;
    const searchMatch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    return levelMatch && serviceMatch && searchMatch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warn': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'debug': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,Level,Service,Message,Details',
      ...filteredLogs.map(log => 
        `"${log.timestamp}","${log.level}","${log.service}","${log.message}","${log.details || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // 模拟新的日志条目
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: ['info', 'warn', 'error', 'debug'][Math.floor(Math.random() * 4)] as any,
        service: ['API', 'Real-time', 'Database', 'Cache'][Math.floor(Math.random() * 4)],
        message: `Auto-generated log entry ${Date.now()}`
      };
      setLogs(prev => [newLog, ...prev.slice(0, 99)]); // 保持最多100条日志
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">日志管理</h1>
        <p className="text-gray-600">查看和管理系统日志</p>
      </div>

      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日志级别</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">全部</option>
                <option value="error">错误</option>
                <option value="warn">警告</option>
                <option value="info">信息</option>
                <option value="debug">调试</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">服务</label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">全部</option>
                <option value="API">API</option>
                <option value="Real-time">Real-time</option>
                <option value="Database">Database</option>
                <option value="Cache">Cache</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">搜索</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索日志内容..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">自动刷新</label>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={exportLogs}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                导出日志
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                清空日志
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 日志统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">总日志数</div>
          <div className="text-2xl font-bold text-gray-900">{logs.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">错误</div>
          <div className="text-2xl font-bold text-red-600">
            {logs.filter(log => log.level === 'error').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">警告</div>
          <div className="text-2xl font-bold text-yellow-600">
            {logs.filter(log => log.level === 'warn').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">信息</div>
          <div className="text-2xl font-bold text-blue-600">
            {logs.filter(log => log.level === 'info').length}
          </div>
        </div>
      </div>

      {/* 日志列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">日志条目 ({filteredLogs.length})</h2>
        </div>

        <div className="overflow-y-auto max-h-96">
          {filteredLogs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              没有找到匹配的日志条目
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <div key={log.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{log.service}</span>
                        <span className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</span>
                      </div>
                      <div className="text-sm text-gray-900 mb-1">{log.message}</div>
                      {log.details && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {log.details}
                        </div>
                      )}
                    </div>
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

export default LogManager; 