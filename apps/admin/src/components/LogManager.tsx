import React, { useState, useEffect } from 'react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  service: string;
  message: string;
  details?: string;
  trace?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
}

const LogManager: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState({
    level: 'all',
    service: 'all',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [logLevels, setLogLevels] = useState<{ [key: string]: number }>({
    debug: 0,
    info: 0,
    warn: 0,
    error: 0,
    fatal: 0
  });

  // 模拟日志数据
  useEffect(() => {
    const generateLogs = () => {
      const levels: LogEntry['level'][] = ['debug', 'info', 'warn', 'error', 'fatal'];
      const services = ['api', 'realtime', 'database', 'auth', 'cron'];
      const messages = [
        '用户登录成功',
        'API 请求处理完成',
        '数据库连接池已满',
        'Redis 连接超时',
        '定时任务执行失败',
        '消息发送成功',
        '系统资源使用率过高',
        '安全警告：多次登录失败',
        '备份任务开始执行',
        '系统更新完成'
      ];

      const newLogs: LogEntry[] = [];
      const now = new Date();
      
      for (let i = 0; i < 50; i++) {
        const timestamp = new Date(now.getTime() - Math.random() * 86400000);
        const level = levels[Math.floor(Math.random() * levels.length)];
        const service = services[Math.floor(Math.random() * services.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        newLogs.push({
          id: `log-${i}`,
          timestamp,
          level,
          service,
          message,
          details: level === 'error' || level === 'fatal' ? '详细错误信息...' : undefined,
          trace: level === 'error' || level === 'fatal' ? '错误堆栈跟踪...' : undefined,
          userId: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 1000)}` : undefined,
          ip: Math.random() > 0.3 ? `192.168.1.${Math.floor(Math.random() * 255)}` : undefined,
          userAgent: Math.random() > 0.7 ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' : undefined
        });
      }
      
      newLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setLogs(newLogs);
      
      // 计算各级别日志数量
      const levelCounts = { debug: 0, info: 0, warn: 0, error: 0, fatal: 0 };
      newLogs.forEach(log => {
        levelCounts[log.level]++;
      });
      setLogLevels(levelCounts);
    };

    generateLogs();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        // 添加新的日志条目
        const newLog: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date(),
          level: ['info', 'warn', 'error'][Math.floor(Math.random() * 3)] as LogEntry['level'],
          service: ['api', 'realtime', 'database'][Math.floor(Math.random() * 3)],
          message: '实时日志更新',
        };
        
        setLogs(prev => [newLog, ...prev.slice(0, 49)]);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'debug': return '#6b7280';
      case 'info': return '#3b82f6';
      case 'warn': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'fatal': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'debug': return '🔍';
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      case 'fatal': return '💀';
      default: return '📝';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'api': return '🌐';
      case 'realtime': return '⚡';
      case 'database': return '🗄️';
      case 'auth': return '🔐';
      case 'cron': return '⏰';
      default: return '⚙️';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filter.level === 'all' || log.level === filter.level;
    const matchesService = filter.service === 'all' || log.service === filter.service;
    const matchesSearch = !filter.search || 
      log.message.toLowerCase().includes(filter.search.toLowerCase()) ||
      log.service.toLowerCase().includes(filter.search.toLowerCase());
    const matchesDate = (!filter.startDate || log.timestamp >= new Date(filter.startDate)) &&
                       (!filter.endDate || log.timestamp <= new Date(filter.endDate));
    
    return matchesLevel && matchesService && matchesSearch && matchesDate;
  });

  const exportLogs = () => {
    const csvContent = [
      '时间,级别,服务,消息,用户ID,IP地址',
      ...filteredLogs.map(log => 
        `${log.timestamp.toISOString()},${log.level},${log.service},"${log.message}",${log.userId || ''},${log.ip || ''}`
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
    if (window.confirm('确定要清空所有日志吗？此操作不可恢复。')) {
      setLogs([]);
      setLogLevels({ debug: 0, info: 0, warn: 0, error: 0, fatal: 0 });
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
          📋 日志管理
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          margin: 0,
          fontWeight: 500
        }}>
          查看和管理系统日志，监控系统运行状态
        </p>
      </div>

      {/* 统计卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        {Object.entries(logLevels).map(([level, count]) => (
          <div key={level} style={{
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
                background: getLevelColor(level),
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}>
                {getLevelIcon(level)}
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                  {count}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'capitalize' }}>
                  {level} 日志
                </div>
              </div>
            </div>
          </div>
        ))}
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
            日志筛选
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={exportLogs}
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
              onClick={clearLogs}
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
              日志级别
            </label>
            <select
              value={filter.level}
              onChange={(e) => setFilter(prev => ({ ...prev, level: e.target.value }))}
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
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
              <option value="fatal">Fatal</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              服务
            </label>
            <select
              value={filter.service}
              onChange={(e) => setFilter(prev => ({ ...prev, service: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="all">所有服务</option>
              <option value="api">API 服务</option>
              <option value="realtime">实时服务</option>
              <option value="database">数据库</option>
              <option value="auth">认证服务</option>
              <option value="cron">定时任务</option>
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              搜索
            </label>
            <input
              type="text"
              placeholder="搜索日志内容..."
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
        
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <label style={{ fontSize: '14px', color: '#475569' }}>
            自动刷新日志
          </label>
        </div>
      </div>

      {/* 日志列表 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
            日志列表 ({filteredLogs.length} 条)
          </h3>
        </div>
        
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredLogs.map(log => (
            <div
              key={log.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: selectedLog?.id === log.id ? '#f8fafc' : 'white'
              }}
              onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ fontSize: '16px' }}>{getLevelIcon(log.level)}</div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      color: getLevelColor(log.level),
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      background: `${getLevelColor(log.level)}10`,
                      borderRadius: '4px'
                    }}>
                      {log.level}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {getServiceIcon(log.service)} {log.service}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {log.timestamp.toLocaleString()}
                    </span>
                    {log.userId && (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        👤 {log.userId}
                      </span>
                    )}
                    {log.ip && (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        🌐 {log.ip}
                      </span>
                    )}
                  </div>
                  
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#374151', 
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {log.message}
                  </p>
                  
                  {selectedLog?.id === log.id && log.details && (
                    <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '6px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: '0 0 8px 0' }}>
                        详细信息
                      </h4>
                      <pre style={{ 
                        fontSize: '12px', 
                        color: '#64748b', 
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace'
                      }}>
                        {log.details}
                      </pre>
                      {log.trace && (
                        <>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: '16px 0 8px 0' }}>
                            堆栈跟踪
                          </h4>
                          <pre style={{ 
                            fontSize: '12px', 
                            color: '#64748b', 
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace'
                          }}>
                            {log.trace}
                          </pre>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredLogs.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, marginBottom: '8px' }}>
              暂无日志
            </h3>
            <p style={{ fontSize: '14px', margin: 0 }}>
              当前筛选条件下没有找到日志记录
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogManager; 