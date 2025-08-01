import React, { useState, useEffect } from 'react';

interface AuditEvent {
  id: string;
  timestamp: Date;
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
  category: 'user' | 'system' | 'security' | 'data' | 'admin';
  sessionId: string;
  duration?: number;
  errorMessage?: string;
}

const AuditLog: React.FC = () => {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [filter, setFilter] = useState({
    category: 'all',
    severity: 'all',
    status: 'all',
    search: '',
    startDate: '',
    endDate: '',
    userId: ''
  });
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟审计日志数据
  useEffect(() => {
    const mockEvents: AuditEvent[] = [
      {
        id: 'audit-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        userId: 'user-1',
        username: 'admin',
        action: 'LOGIN',
        resource: 'auth',
        details: '用户登录成功',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        status: 'success',
        severity: 'low',
        category: 'security',
        sessionId: 'session-123'
      },
      {
        id: 'audit-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        userId: 'user-2',
        username: 'tenant1_admin',
        action: 'CREATE',
        resource: 'user',
        resourceId: 'user-15',
        details: '创建新用户: john.doe@example.com',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        status: 'success',
        severity: 'medium',
        category: 'user',
        sessionId: 'session-124'
      },
      {
        id: 'audit-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        userId: 'user-3',
        username: 'user_manager',
        action: 'UPDATE',
        resource: 'role',
        resourceId: 'role-3',
        details: '更新角色权限: 用户管理员',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        status: 'success',
        severity: 'medium',
        category: 'admin',
        sessionId: 'session-125'
      },
      {
        id: 'audit-4',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        userId: 'unknown',
        username: 'unknown',
        action: 'LOGIN',
        resource: 'auth',
        details: '登录失败: 无效的用户名或密码',
        ipAddress: '203.0.113.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        status: 'failure',
        severity: 'high',
        category: 'security',
        sessionId: 'session-126',
        errorMessage: 'Invalid credentials'
      },
      {
        id: 'audit-5',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        userId: 'system',
        username: 'system',
        action: 'BACKUP',
        resource: 'backup',
        details: '系统自动备份完成',
        ipAddress: '127.0.0.1',
        userAgent: 'System/BackupService',
        status: 'success',
        severity: 'low',
        category: 'system',
        sessionId: 'system-session',
        duration: 180
      },
      {
        id: 'audit-6',
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        userId: 'user-1',
        username: 'admin',
        action: 'DELETE',
        resource: 'user',
        resourceId: 'user-10',
        details: '删除用户: old.user@example.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        status: 'success',
        severity: 'high',
        category: 'user',
        sessionId: 'session-123'
      },
      {
        id: 'audit-7',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        userId: 'user-4',
        username: 'viewer1',
        action: 'ACCESS',
        resource: 'sensitive_data',
        details: '访问敏感数据: 用户列表',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Linux; x86_64)',
        status: 'success',
        severity: 'medium',
        category: 'data',
        sessionId: 'session-127'
      },
      {
        id: 'audit-8',
        timestamp: new Date(Date.now() - 1000 * 60 * 150),
        userId: 'unknown',
        username: 'unknown',
        action: 'BRUTE_FORCE',
        resource: 'auth',
        details: '检测到暴力破解尝试',
        ipAddress: '203.0.113.2',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        status: 'failure',
        severity: 'critical',
        category: 'security',
        sessionId: 'session-128',
        errorMessage: 'Multiple failed login attempts'
      }
    ];

    setAuditEvents(mockEvents);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'failure': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user': return '👤';
      case 'system': return '⚙️';
      case 'security': return '🔒';
      case 'data': return '📊';
      case 'admin': return '👨‍💼';
      default: return '📝';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN': return '🔑';
      case 'LOGOUT': return '🚪';
      case 'CREATE': return '➕';
      case 'UPDATE': return '✏️';
      case 'DELETE': return '🗑️';
      case 'ACCESS': return '👁️';
      case 'BACKUP': return '💾';
      case 'BRUTE_FORCE': return '⚠️';
      default: return '📝';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const filteredEvents = auditEvents.filter(event => {
    const matchesCategory = filter.category === 'all' || event.category === filter.category;
    const matchesSeverity = filter.severity === 'all' || event.severity === filter.severity;
    const matchesStatus = filter.status === 'all' || event.status === filter.status;
    const matchesSearch = !filter.search || 
      event.username.toLowerCase().includes(filter.search.toLowerCase()) ||
      event.action.toLowerCase().includes(filter.search.toLowerCase()) ||
      event.details.toLowerCase().includes(filter.search.toLowerCase());
    const matchesDate = (!filter.startDate || event.timestamp >= new Date(filter.startDate)) &&
                       (!filter.endDate || event.timestamp <= new Date(filter.endDate));
    const matchesUserId = !filter.userId || event.userId === filter.userId;
    
    return matchesCategory && matchesSeverity && matchesStatus && matchesSearch && matchesDate && matchesUserId;
  });

  const exportAuditLog = () => {
    const csvContent = [
      '时间,用户,操作,资源,详情,IP地址,状态,严重程度,类别',
      ...filteredEvents.map(event => 
        `${event.timestamp.toISOString()},${event.username},${event.action},${event.resource},"${event.details}",${event.ipAddress},${event.status},${event.severity},${event.category}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  const clearAuditLog = () => {
    if (window.confirm('确定要清空审计日志吗？此操作不可恢复。')) {
      setAuditEvents([]);
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 800, 
          color: '#0f172a', 
          margin: 0, 
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          📋 审计日志
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          margin: 0,
          fontWeight: 500
        }}>
          记录和监控系统操作，确保安全性和合规性
        </p>
      </div>

      {/* 统计信息 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              📊
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {auditEvents.length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>总事件数</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#ef4444',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              ⚠️
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {auditEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>高风险事件</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#10b981',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              ✅
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {auditEvents.filter(e => e.status === 'success').length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>成功操作</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#f59e0b',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              👥
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {Array.from(new Set(auditEvents.map(e => e.userId))).length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>活跃用户</div>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选和操作 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
            筛选和操作
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowExportDialog(true)}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📥 导出日志
            </button>
            <button
              onClick={clearAuditLog}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🗑️ 清空日志
            </button>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              类别
            </label>
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="all">所有类别</option>
              <option value="user">用户操作</option>
              <option value="system">系统事件</option>
              <option value="security">安全事件</option>
              <option value="data">数据访问</option>
              <option value="admin">管理操作</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              严重程度
            </label>
            <select
              value={filter.severity}
              onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="all">所有级别</option>
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
              <option value="critical">严重</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              状态
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="all">所有状态</option>
              <option value="success">成功</option>
              <option value="failure">失败</option>
              <option value="warning">警告</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              搜索
            </label>
            <input
              type="text"
              placeholder="搜索用户、操作或详情..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              开始日期
            </label>
            <input
              type="datetime-local"
              value={filter.startDate}
              onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              结束日期
            </label>
            <input
              type="datetime-local"
              value={filter.endDate}
              onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* 审计日志列表 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#0f172a', 
          margin: 0, 
          marginBottom: '24px' 
        }}>
          审计事件 ({filteredEvents.length})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredEvents.map(event => (
            <div
              key={event.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: selectedEvent?.id === event.id ? '#f8fafc' : 'white'
              }}
              onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '24px' }}>{getCategoryIcon(event.category)}</div>
                  <div>
                    <h4 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: '#0f172a', 
                      margin: 0, 
                      marginBottom: '4px' 
                    }}>
                      {event.username} ({event.action})
                    </h4>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#64748b', 
                      margin: 0 
                    }}>
                      {event.details}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: `${getStatusColor(event.status)}10`,
                    color: getStatusColor(event.status),
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {event.status === 'success' ? '✅ 成功' : 
                     event.status === 'failure' ? '❌ 失败' : '⚠️ 警告'}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    background: `${getSeverityColor(event.severity)}10`,
                    color: getSeverityColor(event.severity),
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {event.severity === 'low' ? '低' :
                     event.severity === 'medium' ? '中' :
                     event.severity === 'high' ? '高' : '严重'}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>时间</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {event.timestamp.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>IP地址</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {event.ipAddress}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>资源</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {event.resource} {event.resourceId && `(${event.resourceId})`}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>类别</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {event.category === 'user' ? '用户操作' :
                     event.category === 'system' ? '系统事件' :
                     event.category === 'security' ? '安全事件' :
                     event.category === 'data' ? '数据访问' :
                     event.category === 'admin' ? '管理操作' : event.category}
                  </div>
                </div>
              </div>
              
              {selectedEvent?.id === event.id && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    <div>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0' }}>
                        详细信息
                      </h5>
                      <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                        <div><strong>用户代理:</strong> {event.userAgent}</div>
                        <div><strong>会话ID:</strong> {event.sessionId}</div>
                        {event.duration && (
                          <div><strong>执行时间:</strong> {formatDuration(event.duration)}</div>
                        )}
                        {event.errorMessage && (
                          <div><strong>错误信息:</strong> {event.errorMessage}</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0' }}>
                        操作详情
                      </h5>
                      <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                        <div><strong>操作:</strong> {event.action}</div>
                        <div><strong>资源:</strong> {event.resource}</div>
                        {event.resourceId && (
                          <div><strong>资源ID:</strong> {event.resourceId}</div>
                        )}
                        <div><strong>详情:</strong> {event.details}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, marginBottom: '8px' }}>
              暂无审计事件
            </h3>
            <p style={{ fontSize: '14px', margin: 0 }}>
              当前筛选条件下没有找到审计事件
            </p>
          </div>
        )}
      </div>

      {/* 导出对话框 */}
      {showExportDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📥</div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#0f172a', 
              margin: 0, 
              marginBottom: '16px' 
            }}>
              导出审计日志
            </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#64748b', 
              margin: 0, 
              marginBottom: '24px' 
            }}>
              将导出 {filteredEvents.length} 条审计事件记录为 CSV 文件
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowExportDialog(false)}
                style={{
                  padding: '12px 24px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={exportAuditLog}
                style={{
                  padding: '12px 24px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                确认导出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog; 