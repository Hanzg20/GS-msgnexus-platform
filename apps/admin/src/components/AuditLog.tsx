import React, { useState, useEffect } from 'react';

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const AuditLog: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
    {
      id: '1',
      timestamp: '2024-01-01T10:00:00Z',
      userId: '1',
      username: 'admin',
      action: 'LOGIN',
      resource: 'auth',
      details: '用户登录成功',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      severity: 'low'
    },
    {
      id: '2',
      timestamp: '2024-01-01T10:05:00Z',
      userId: '1',
      username: 'admin',
      action: 'CREATE_USER',
      resource: 'user',
      resourceId: '5',
      details: '创建新用户: user5@msgnexus.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      severity: 'medium'
    },
    {
      id: '3',
      timestamp: '2024-01-01T10:10:00Z',
      userId: '2',
      username: 'manager',
      action: 'UPDATE_PERMISSIONS',
      resource: 'role',
      resourceId: '3',
      details: '更新角色权限: 普通用户',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'success',
      severity: 'medium'
    },
    {
      id: '4',
      timestamp: '2024-01-01T10:15:00Z',
      userId: '3',
      username: 'user1',
      action: 'LOGIN_FAILED',
      resource: 'auth',
      details: '登录失败: 密码错误',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      status: 'failure',
      severity: 'medium'
    },
    {
      id: '5',
      timestamp: '2024-01-01T10:20:00Z',
      userId: '1',
      username: 'admin',
      action: 'DELETE_USER',
      resource: 'user',
      resourceId: '4',
      details: '删除用户: user4@msgnexus.com',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      severity: 'high'
    },
    {
      id: '6',
      timestamp: '2024-01-01T10:25:00Z',
      userId: '1',
      username: 'admin',
      action: 'SYSTEM_CONFIG_CHANGE',
      resource: 'system',
      details: '修改系统配置: 数据库连接池大小',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      severity: 'high'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterAction, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditEntry | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    const statusMatch = filterStatus === 'all' || log.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || log.severity === filterSeverity;
    const actionMatch = filterAction === 'all' || log.action === filterAction;
    const searchMatch = log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.ipAddress.includes(searchTerm);

    return statusMatch && severityMatch && actionMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failure': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const exportAuditLog = () => {
    const csvContent = [
      'Timestamp,User,Action,Resource,Details,IP Address,Status,Severity',
      ...filteredLogs.map(log => 
        `"${log.timestamp}","${log.username}","${log.action}","${log.resource}","${log.details}","${log.ipAddress}","${log.status}","${log.severity}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN': return '🔐';
      case 'LOGIN_FAILED': return '❌';
      case 'CREATE_USER': return '➕';
      case 'UPDATE_USER': return '✏️';
      case 'DELETE_USER': return '🗑️';
      case 'UPDATE_PERMISSIONS': return '🔑';
      case 'SYSTEM_CONFIG_CHANGE': return '⚙️';
      case 'DATA_EXPORT': return '📤';
      case 'DATA_IMPORT': return '📥';
      default: return '📝';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">审计日志</h1>
        <p className="text-gray-600">监控和记录系统操作</p>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">总日志数</div>
          <div className="text-2xl font-bold text-gray-900">{auditLogs.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">成功操作</div>
          <div className="text-2xl font-bold text-green-600">
            {auditLogs.filter(log => log.status === 'success').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">失败操作</div>
          <div className="text-2xl font-bold text-red-600">
            {auditLogs.filter(log => log.status === 'failure').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">高风险操作</div>
          <div className="text-2xl font-bold text-orange-600">
            {auditLogs.filter(log => log.severity === 'high' || log.severity === 'critical').length}
          </div>
        </div>
      </div>

      {/* 过滤和搜索 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">全部</option>
                <option value="success">成功</option>
                <option value="failure">失败</option>
                <option value="warning">警告</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">严重程度</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">全部</option>
                <option value="critical">严重</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">操作类型</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">全部</option>
                <option value="LOGIN">登录</option>
                <option value="CREATE_USER">创建用户</option>
                <option value="UPDATE_USER">更新用户</option>
                <option value="DELETE_USER">删除用户</option>
                <option value="UPDATE_PERMISSIONS">更新权限</option>
                <option value="SYSTEM_CONFIG_CHANGE">系统配置</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">搜索</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索用户、详情或IP..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={exportAuditLog}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                导出日志
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 日志列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">审计记录 ({filteredLogs.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">资源</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">详情</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP地址</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">严重程度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.username}</div>
                    <div className="text-sm text-gray-500">ID: {log.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getActionIcon(log.action)}</span>
                      <span className="text-sm font-medium text-gray-900">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.resource}
                    {log.resourceId && (
                      <div className="text-xs text-gray-500">ID: {log.resourceId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                      {log.status === 'success' ? '成功' : 
                       log.status === 'failure' ? '失败' : '警告'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                      {log.severity === 'critical' ? '严重' :
                       log.severity === 'high' ? '高' :
                       log.severity === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 详情模态框 */}
      {selectedLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">审计日志详情</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">时间</label>
                  <div className="mt-1 text-sm text-gray-900">{formatDate(selectedLog.timestamp)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">用户</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedLog.username} (ID: {selectedLog.userId})</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">操作</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedLog.action}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">资源</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedLog.resource}
                    {selectedLog.resourceId && ` (ID: ${selectedLog.resourceId})`}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">详情</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedLog.details}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IP地址</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedLog.ipAddress}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">用户代理</label>
                  <div className="mt-1 text-sm text-gray-900 break-all">{selectedLog.userAgent}</div>
                </div>
                <div className="flex space-x-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">状态</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status === 'success' ? '成功' : 
                       selectedLog.status === 'failure' ? '失败' : '警告'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">严重程度</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(selectedLog.severity)}`}>
                      {selectedLog.severity === 'critical' ? '严重' :
                       selectedLog.severity === 'high' ? '高' :
                       selectedLog.severity === 'medium' ? '中' : '低'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog; 