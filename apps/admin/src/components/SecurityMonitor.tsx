import React, { useState, useEffect } from 'react';

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'login_failed' | 'unauthorized_access' | 'suspicious_activity' | 'data_breach' | 'malware_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: string;
  ipAddress: string;
  userAgent: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
}

interface SecurityMetrics {
  totalThreats: number;
  blockedAttacks: number;
  activeThreats: number;
  securityScore: number;
  lastScan: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const SecurityMonitor: React.FC = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      timestamp: '2024-01-01T10:00:00Z',
      type: 'login_failed',
      severity: 'medium',
      description: '多次登录失败尝试',
      source: '192.168.1.100',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'investigating'
    },
    {
      id: '2',
      timestamp: '2024-01-01T09:30:00Z',
      type: 'unauthorized_access',
      severity: 'high',
      description: '尝试访问受限资源',
      source: '10.0.0.50',
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'open'
    },
    {
      id: '3',
      timestamp: '2024-01-01T09:00:00Z',
      type: 'suspicious_activity',
      severity: 'low',
      description: '异常的数据访问模式',
      source: '172.16.0.25',
      ipAddress: '172.16.0.25',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      status: 'resolved'
    }
  ]);

  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalThreats: 156,
    blockedAttacks: 142,
    activeThreats: 14,
    securityScore: 87,
    lastScan: '2024-01-01T09:00:00Z',
    vulnerabilities: {
      critical: 2,
      high: 5,
      medium: 12,
      low: 28
    }
  });

  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100';
      case 'investigating': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'false_positive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'login_failed': return '🔐';
      case 'unauthorized_access': return '🚫';
      case 'suspicious_activity': return '⚠️';
      case 'data_breach': return '💥';
      case 'malware_detected': return '🦠';
      default: return '📝';
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredEvents = securityEvents.filter(event => {
    const severityMatch = selectedSeverity === 'all' || event.severity === selectedSeverity;
    const statusMatch = selectedStatus === 'all' || event.status === selectedStatus;
    return severityMatch && statusMatch;
  });

  const startSecurityScan = () => {
    setIsScanning(true);
    // 模拟扫描过程
    setTimeout(() => {
      setIsScanning(false);
      setMetrics(prev => ({
        ...prev,
        securityScore: Math.max(prev.securityScore - 2, 70),
        lastScan: new Date().toISOString()
      }));
    }, 3000);
  };

  const updateEventStatus = (eventId: string, newStatus: string) => {
    setSecurityEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, status: newStatus as any } : event
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">安全监控</h1>
        <p className="text-gray-600">实时监控系统安全状态和威胁检测</p>
      </div>

      {/* 安全指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">安全评分</h3>
            <span className={`text-2xl font-bold ${getSecurityScoreColor(metrics.securityScore)}`}>
              {metrics.securityScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${metrics.securityScore}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">最后扫描: {formatDate(metrics.lastScan)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">总威胁数</h3>
            <span className="text-2xl font-bold text-red-600">
              {metrics.totalThreats}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <div>已阻止: <span className="text-green-600 font-medium">{metrics.blockedAttacks}</span></div>
            <div>活跃威胁: <span className="text-red-600 font-medium">{metrics.activeThreats}</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">严重漏洞</h3>
            <span className="text-2xl font-bold text-red-600">
              {metrics.vulnerabilities.critical}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <div>高危: <span className="text-orange-600 font-medium">{metrics.vulnerabilities.high}</span></div>
            <div>中危: <span className="text-yellow-600 font-medium">{metrics.vulnerabilities.medium}</span></div>
            <div>低危: <span className="text-green-600 font-medium">{metrics.vulnerabilities.low}</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">防护状态</h3>
            <span className="text-2xl font-bold text-green-600">
              {((metrics.blockedAttacks / metrics.totalThreats) * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-600">威胁阻止率</p>
          <button
            onClick={startSecurityScan}
            disabled={isScanning}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {isScanning ? '扫描中...' : '开始扫描'}
          </button>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">严重程度</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">全部</option>
                  <option value="open">待处理</option>
                  <option value="investigating">调查中</option>
                  <option value="resolved">已解决</option>
                  <option value="false_positive">误报</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                导出报告
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                紧急响应
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 安全事件列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">安全事件 ({filteredEvents.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">描述</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">来源</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">严重程度</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(event.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getEventTypeIcon(event.type)}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {event.type === 'login_failed' ? '登录失败' :
                         event.type === 'unauthorized_access' ? '未授权访问' :
                         event.type === 'suspicious_activity' ? '可疑活动' :
                         event.type === 'data_breach' ? '数据泄露' :
                         event.type === 'malware_detected' ? '恶意软件' : '其他'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {event.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                      {event.severity === 'critical' ? '严重' :
                       event.severity === 'high' ? '高' :
                       event.severity === 'medium' ? '中' : '低'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                      {event.status === 'open' ? '待处理' :
                       event.status === 'investigating' ? '调查中' :
                       event.status === 'resolved' ? '已解决' : '误报'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateEventStatus(event.id, 'investigating')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        调查
                      </button>
                      <button
                        onClick={() => updateEventStatus(event.id, 'resolved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        解决
                      </button>
                      <button
                        onClick={() => updateEventStatus(event.id, 'false_positive')}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        误报
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 安全建议 */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">安全建议</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-red-500 text-lg">🔴</span>
              <div>
                <h4 className="font-medium text-gray-900">立即处理严重漏洞</h4>
                <p className="text-sm text-gray-600">发现 2 个严重级别的安全漏洞，建议立即修复</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-yellow-500 text-lg">🟡</span>
              <div>
                <h4 className="font-medium text-gray-900">加强访问控制</h4>
                <p className="text-sm text-gray-600">检测到多次未授权访问尝试，建议启用双因素认证</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-lg">🔵</span>
              <div>
                <h4 className="font-medium text-gray-900">定期安全扫描</h4>
                <p className="text-sm text-gray-600">建议每周进行一次完整的安全扫描</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitor; 