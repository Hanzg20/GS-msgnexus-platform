import React, { useState, useEffect } from 'react';

interface Process {
  id: string;
  name: string;
  type: 'api' | 'realtime' | 'database' | 'redis' | 'nginx' | 'cron';
  status: 'running' | 'stopped' | 'error' | 'starting' | 'stopping';
  pid?: number;
  memory: number;
  cpu: number;
  uptime: number;
  port: number;
  health: 'healthy' | 'warning' | 'critical';
  lastRestart?: Date;
  autoRestart: boolean;
}

const SystemProcessManager: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([
    {
      id: 'api-server',
      name: 'API 服务',
      type: 'api',
      status: 'running',
      pid: 12345,
      memory: 256,
      cpu: 15,
      uptime: 86400,
      port: 3030,
      health: 'healthy',
      lastRestart: new Date(Date.now() - 3600000),
      autoRestart: true
    },
    {
      id: 'realtime-server',
      name: '实时通信服务',
      type: 'realtime',
      status: 'running',
      pid: 12346,
      memory: 128,
      cpu: 8,
      uptime: 86400,
      port: 3031,
      health: 'healthy',
      lastRestart: new Date(Date.now() - 7200000),
      autoRestart: true
    },
    {
      id: 'database',
      name: '数据库服务',
      type: 'database',
      status: 'running',
      pid: 12347,
      memory: 512,
      cpu: 25,
      uptime: 172800,
      port: 5432,
      health: 'healthy',
      lastRestart: new Date(Date.now() - 86400000),
      autoRestart: true
    },
    {
      id: 'redis',
      name: 'Redis 缓存',
      type: 'redis',
      status: 'running',
      pid: 12348,
      memory: 64,
      cpu: 5,
      uptime: 86400,
      port: 6379,
      health: 'healthy',
      lastRestart: new Date(Date.now() - 3600000),
      autoRestart: true
    },
    {
      id: 'nginx',
      name: 'Nginx 代理',
      type: 'nginx',
      status: 'running',
      pid: 12349,
      memory: 32,
      cpu: 2,
      uptime: 86400,
      port: 80,
      health: 'healthy',
      lastRestart: new Date(Date.now() - 3600000),
      autoRestart: true
    },
    {
      id: 'cron',
      name: '定时任务',
      type: 'cron',
      status: 'running',
      pid: 12350,
      memory: 16,
      cpu: 1,
      uptime: 86400,
      port: 0,
      health: 'healthy',
      lastRestart: new Date(Date.now() - 3600000),
      autoRestart: true
    }
  ]);

  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'start' | 'stop' | 'restart' | 'kill'>('stop');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return '#10b981';
      case 'stopped': return '#6b7280';
      case 'error': return '#ef4444';
      case 'starting': return '#f59e0b';
      case 'stopping': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return '🌐';
      case 'realtime': return '⚡';
      case 'database': return '🗄️';
      case 'redis': return '🔴';
      case 'nginx': return '🔄';
      case 'cron': return '⏰';
      default: return '⚙️';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}天 ${hours}小时`;
    if (hours > 0) return `${hours}小时 ${minutes}分钟`;
    return `${minutes}分钟`;
  };

  const handleProcessAction = async (processId: string, action: 'start' | 'stop' | 'restart' | 'kill') => {
    setIsLoading(true);
    setActionType(action);
    setShowConfirmDialog(true);
    
    // 模拟API调用
    setTimeout(() => {
      setProcesses(prev => prev.map(process => {
        if (process.id === processId) {
          let newStatus: Process['status'] = process.status;
          switch (action) {
            case 'start':
              newStatus = 'starting';
              break;
            case 'stop':
              newStatus = 'stopping';
              break;
            case 'restart':
              newStatus = 'starting';
              break;
            case 'kill':
              newStatus = 'stopped';
              break;
          }
          
          return {
            ...process,
            status: newStatus,
            lastRestart: action === 'restart' ? new Date() : process.lastRestart
          };
        }
        return process;
      }));
      
      // 模拟状态更新
      setTimeout(() => {
        setProcesses(prev => prev.map(process => {
          if (process.id === processId) {
            let finalStatus: Process['status'] = process.status;
            switch (action) {
              case 'start':
              case 'restart':
                finalStatus = 'running';
                break;
              case 'stop':
              case 'kill':
                finalStatus = 'stopped';
                break;
            }
            
            return {
              ...process,
              status: finalStatus,
              uptime: action === 'restart' ? 0 : process.uptime
            };
          }
          return process;
        }));
      }, 2000);
      
      setIsLoading(false);
      setShowConfirmDialog(false);
    }, 1000);
  };

  const handleBulkAction = async (action: 'start' | 'stop' | 'restart') => {
    setIsLoading(true);
    setActionType(action);
    
    // 模拟批量操作
    setTimeout(() => {
      setProcesses(prev => prev.map(process => ({
        ...process,
        status: action === 'stop' ? 'stopped' : 'running',
        uptime: action === 'restart' ? 0 : process.uptime,
        lastRestart: action === 'restart' ? new Date() : process.lastRestart
      })));
      setIsLoading(false);
    }, 3000);
  };

  const toggleAutoRestart = (processId: string) => {
    setProcesses(prev => prev.map(process => 
      process.id === processId 
        ? { ...process, autoRestart: !process.autoRestart }
        : process
    ));
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
          ⚙️ 系统进程管理
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          margin: 0,
          fontWeight: 500
        }}>
          监控和管理系统核心服务的运行状态
        </p>
      </div>

      {/* 批量操作 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#0f172a', 
          margin: 0, 
          marginBottom: '16px' 
        }}>
          🚀 批量操作
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleBulkAction('start')}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? '启动中...' : '启动所有服务'}
          </button>
          <button
            onClick={() => handleBulkAction('stop')}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? '停止中...' : '停止所有服务'}
          </button>
          <button
            onClick={() => handleBulkAction('restart')}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? '重启中...' : '重启所有服务'}
          </button>
        </div>
      </div>

      {/* 进程列表 */}
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
          📋 服务进程列表
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {processes.map(process => (
            <div
              key={process.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                transition: 'all 0.3s ease',
                background: selectedProcess === process.id ? '#f8fafc' : 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '24px' }}>{getTypeIcon(process.type)}</div>
                  <div>
                    <h4 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: '#0f172a', 
                      margin: 0, 
                      marginBottom: '4px' 
                    }}>
                      {process.name}
                    </h4>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#64748b', 
                      margin: 0 
                    }}>
                      PID: {process.pid || 'N/A'} | 端口: {process.port || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getStatusColor(process.status)
                    }} />
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: getStatusColor(process.status) 
                    }}>
                      {process.status === 'running' ? '运行中' :
                       process.status === 'stopped' ? '已停止' :
                       process.status === 'error' ? '错误' :
                       process.status === 'starting' ? '启动中' :
                       process.status === 'stopping' ? '停止中' : '未知'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getHealthColor(process.health)
                    }} />
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: getHealthColor(process.health) 
                    }}>
                      {process.health === 'healthy' ? '健康' :
                       process.health === 'warning' ? '警告' :
                       process.health === 'critical' ? '严重' : '未知'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>内存使用</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {process.memory} MB
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>CPU 使用</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {process.cpu}%
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>运行时间</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {formatUptime(process.uptime)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>最后重启</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {process.lastRestart ? process.lastRestart.toLocaleString() : '从未重启'}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={process.autoRestart}
                      onChange={() => toggleAutoRestart(process.id)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <label style={{ fontSize: '14px', color: '#475569' }}>
                      自动重启
                    </label>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {process.status !== 'running' && (
                    <button
                      onClick={() => handleProcessAction(process.id, 'start')}
                      disabled={isLoading}
                      style={{
                        padding: '8px 16px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1
                      }}
                    >
                      启动
                    </button>
                  )}
                  {process.status === 'running' && (
                    <>
                      <button
                        onClick={() => handleProcessAction(process.id, 'restart')}
                        disabled={isLoading}
                        style={{
                          padding: '8px 16px',
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          opacity: isLoading ? 0.6 : 1
                        }}
                      >
                        重启
                      </button>
                      <button
                        onClick={() => handleProcessAction(process.id, 'stop')}
                        disabled={isLoading}
                        style={{
                          padding: '8px 16px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          opacity: isLoading ? 0.6 : 1
                        }}
                      >
                        停止
                      </button>
                      <button
                        onClick={() => handleProcessAction(process.id, 'kill')}
                        disabled={isLoading}
                        style={{
                          padding: '8px 16px',
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          opacity: isLoading ? 0.6 : 1
                        }}
                      >
                        强制终止
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 确认对话框 */}
      {showConfirmDialog && (
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
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {actionType === 'start' ? '🚀' : 
               actionType === 'stop' ? '⏹️' : 
               actionType === 'restart' ? '🔄' : '💀'}
            </div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#0f172a', 
              margin: 0, 
              marginBottom: '16px' 
            }}>
              {actionType === 'start' ? '启动服务' : 
               actionType === 'stop' ? '停止服务' : 
               actionType === 'restart' ? '重启服务' : '强制终止服务'}
            </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#64748b', 
              margin: 0, 
              marginBottom: '24px' 
            }}>
              确定要{actionType === 'start' ? '启动' : 
                       actionType === 'stop' ? '停止' : 
                       actionType === 'restart' ? '重启' : '强制终止'}这个服务吗？
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmDialog(false)}
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
                onClick={() => {
                  if (selectedProcess) {
                    handleProcessAction(selectedProcess, actionType);
                  }
                }}
                style={{
                  padding: '12px 24px',
                  background: actionType === 'kill' ? '#dc2626' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemProcessManager; 