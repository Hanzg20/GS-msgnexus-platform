import React, { useState, useEffect } from 'react';

interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'database' | 'files';
  status: 'completed' | 'in_progress' | 'failed' | 'scheduled';
  size: number;
  createdAt: Date;
  completedAt?: Date;
  description: string;
  retention: number; // 保留天数
  location: 'local' | 'cloud' | 'external';
  checksum: string;
  compression: boolean;
  encryption: boolean;
}

const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  // 模拟备份数据
  useEffect(() => {
    const mockBackups: Backup[] = [
      {
        id: 'backup-1',
        name: '完整系统备份',
        type: 'full',
        status: 'completed',
        size: 2048576, // 2GB
        createdAt: new Date(Date.now() - 86400000),
        completedAt: new Date(Date.now() - 86400000 + 1800000),
        description: '包含数据库、文件、配置的完整系统备份',
        retention: 30,
        location: 'local',
        checksum: 'sha256:abc123...',
        compression: true,
        encryption: true
      },
      {
        id: 'backup-2',
        name: '数据库备份',
        type: 'database',
        status: 'completed',
        size: 512000, // 512MB
        createdAt: new Date(Date.now() - 43200000),
        completedAt: new Date(Date.now() - 43200000 + 900000),
        description: '仅包含数据库的备份',
        retention: 7,
        location: 'cloud',
        checksum: 'sha256:def456...',
        compression: true,
        encryption: false
      },
      {
        id: 'backup-3',
        name: '增量备份',
        type: 'incremental',
        status: 'in_progress',
        size: 128000, // 128MB
        createdAt: new Date(Date.now() - 3600000),
        description: '基于上次完整备份的增量备份',
        retention: 7,
        location: 'local',
        checksum: 'sha256:ghi789...',
        compression: true,
        encryption: true
      },
      {
        id: 'backup-4',
        name: '文件备份',
        type: 'files',
        status: 'scheduled',
        size: 0,
        createdAt: new Date(Date.now() + 3600000),
        description: '用户上传文件的备份',
        retention: 90,
        location: 'external',
        checksum: '',
        compression: false,
        encryption: true
      }
    ];
    setBackups(mockBackups);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full': return '💾';
      case 'incremental': return '📈';
      case 'database': return '🗄️';
      case 'files': return '📁';
      default: return '📦';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'scheduled': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'in_progress': return '进行中';
      case 'failed': return '失败';
      case 'scheduled': return '已计划';
      default: return '未知';
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'local': return '💻';
      case 'cloud': return '☁️';
      case 'external': return '🌐';
      default: return '📦';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (start: Date, end?: Date) => {
    if (!end) return '进行中...';
    const duration = end.getTime() - start.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}分${seconds}秒`;
  };

  const createBackup = async (backupData: Partial<Backup>) => {
    setIsCreating(true);
    
    // 模拟创建备份
    setTimeout(() => {
      const newBackup: Backup = {
        id: `backup-${Date.now()}`,
        name: backupData.name || '新备份',
        type: backupData.type || 'full',
        status: 'in_progress',
        size: 0,
        createdAt: new Date(),
        description: backupData.description || '',
        retention: backupData.retention || 30,
        location: backupData.location || 'local',
        checksum: '',
        compression: backupData.compression || false,
        encryption: backupData.encryption || false
      };
      
      setBackups(prev => [newBackup, ...prev]);
      setIsCreating(false);
      setShowCreateDialog(false);
      
      // 模拟备份完成
      setTimeout(() => {
        setBackups(prev => prev.map(backup => 
          backup.id === newBackup.id 
            ? { 
                ...backup, 
                status: 'completed', 
                completedAt: new Date(),
                size: Math.floor(Math.random() * 1000000) + 100000
              }
            : backup
        ));
      }, 5000);
    }, 2000);
  };

  const restoreBackup = async (backupId: string) => {
    setIsRestoring(true);
    
    // 模拟恢复备份
    setTimeout(() => {
      setIsRestoring(false);
      setShowRestoreDialog(false);
      alert('备份恢复完成！');
    }, 3000);
  };

  const deleteBackup = (backupId: string) => {
    if (window.confirm('确定要删除这个备份吗？此操作不可恢复。')) {
      setBackups(prev => prev.filter(backup => backup.id !== backupId));
    }
  };

  const downloadBackup = (backup: Backup) => {
    // 模拟下载
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${backup.name}-${backup.createdAt.toISOString().split('T')[0]}.zip`;
    link.click();
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
          💾 备份与恢复
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          margin: 0,
          fontWeight: 500
        }}>
          管理系统备份，确保数据安全和业务连续性
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
              💾
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {backups.length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                总备份数
              </div>
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
                {backups.filter(b => b.status === 'completed').length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                成功备份
              </div>
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
              📊
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {formatSize(backups.reduce((sum, b) => sum + b.size, 0))}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                总存储空间
              </div>
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
              background: '#8b5cf6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              ⏰
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {backups.filter(b => b.status === 'scheduled').length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                计划备份
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCreateDialog(true)}
            disabled={isCreating}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isCreating ? 'not-allowed' : 'pointer',
              opacity: isCreating ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isCreating ? '创建中...' : '➕ 创建备份'}
          </button>
          
          <button
            onClick={() => setShowRestoreDialog(true)}
            disabled={!selectedBackup || isRestoring}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: (!selectedBackup || isRestoring) ? 'not-allowed' : 'pointer',
              opacity: (!selectedBackup || isRestoring) ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isRestoring ? '恢复中...' : '🔄 恢复备份'}
          </button>
          
          <button
            onClick={() => selectedBackup && downloadBackup(selectedBackup)}
            disabled={!selectedBackup}
            style={{
              padding: '12px 24px',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: !selectedBackup ? 'not-allowed' : 'pointer',
              opacity: !selectedBackup ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            📥 下载备份
          </button>
          
          <button
            onClick={() => selectedBackup && deleteBackup(selectedBackup.id)}
            disabled={!selectedBackup}
            style={{
              padding: '12px 24px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: !selectedBackup ? 'not-allowed' : 'pointer',
              opacity: !selectedBackup ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            🗑️ 删除备份
          </button>
        </div>
      </div>

      {/* 备份列表 */}
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
          📋 备份列表
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {backups.map(backup => (
            <div
              key={backup.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: selectedBackup?.id === backup.id ? '#f8fafc' : 'white'
              }}
              onClick={() => setSelectedBackup(selectedBackup?.id === backup.id ? null : backup)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '24px' }}>{getTypeIcon(backup.type)}</div>
                  <div>
                    <h4 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: '#0f172a', 
                      margin: 0, 
                      marginBottom: '4px' 
                    }}>
                      {backup.name}
                    </h4>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#64748b', 
                      margin: 0 
                    }}>
                      {backup.description}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: `${getStatusColor(backup.status)}10`,
                    color: getStatusColor(backup.status),
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {getStatusText(backup.status)}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>大小</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {formatSize(backup.size)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>创建时间</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {backup.createdAt.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>保留时间</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {backup.retention} 天
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>存储位置</span>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                    {getLocationIcon(backup.location)} {backup.location}
                  </div>
                </div>
                {backup.completedAt && (
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>完成时间</span>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                      {backup.completedAt.toLocaleString()}
                    </div>
                  </div>
                )}
                {backup.completedAt && (
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>耗时</span>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                      {formatDuration(backup.createdAt, backup.completedAt)}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {backup.compression && (
                  <span style={{
                    padding: '2px 6px',
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 500
                  }}>
                    压缩
                  </span>
                )}
                {backup.encryption && (
                  <span style={{
                    padding: '2px 6px',
                    background: '#8b5cf6',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 500
                  }}>
                    加密
                  </span>
                )}
                {backup.checksum && (
                  <span style={{
                    padding: '2px 6px',
                    background: '#3b82f6',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 500
                  }}>
                    校验
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 创建备份对话框 */}
      {showCreateDialog && (
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
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#0f172a', 
              margin: 0, 
              marginBottom: '24px' 
            }}>
              创建新备份
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
                  备份名称
                </label>
                <input
                  type="text"
                  placeholder="输入备份名称"
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
                  备份类型
                </label>
                <select style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}>
                  <option value="full">完整备份</option>
                  <option value="incremental">增量备份</option>
                  <option value="database">数据库备份</option>
                  <option value="files">文件备份</option>
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
                  描述
                </label>
                <textarea
                  placeholder="备份描述"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
                    保留天数
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    defaultValue="30"
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
                
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
                    存储位置
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}>
                    <option value="local">本地存储</option>
                    <option value="cloud">云存储</option>
                    <option value="external">外部存储</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="compression" defaultChecked />
                  <label htmlFor="compression" style={{ fontSize: '14px', color: '#475569' }}>
                    启用压缩
                  </label>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="encryption" defaultChecked />
                  <label htmlFor="encryption" style={{ fontSize: '14px', color: '#475569' }}>
                    启用加密
                  </label>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setShowCreateDialog(false)}
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
                onClick={() => createBackup({})}
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
                创建备份
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 恢复备份对话框 */}
      {showRestoreDialog && selectedBackup && (
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
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#0f172a', 
              margin: 0, 
              marginBottom: '24px' 
            }}>
              恢复备份
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '16px', color: '#374151', margin: 0, marginBottom: '16px' }}>
                确定要恢复以下备份吗？
              </p>
              <div style={{ 
                background: '#f8fafc', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0' }}>
                  {selectedBackup.name}
                </h4>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0, marginBottom: '8px' }}>
                  {selectedBackup.description}
                </p>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  创建时间: {selectedBackup.createdAt.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div style={{ 
              background: '#fef3c7', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #f59e0b',
              marginBottom: '24px'
            }}>
              <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                ⚠️ 警告：恢复操作将覆盖当前数据，请确保已备份重要数据。
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowRestoreDialog(false)}
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
                onClick={() => restoreBackup(selectedBackup.id)}
                style={{
                  padding: '12px 24px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                确认恢复
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupManager; 