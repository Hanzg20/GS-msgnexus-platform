import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: '系统更新完成',
      message: 'GoldSky MessageCore 已成功更新到最新版本 v2.1.0，新功能包括增强的消息监控和性能优化。',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
      read: false,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'warning',
      title: '磁盘空间不足',
      message: '系统磁盘使用率已达到 85%，建议清理日志文件或扩展存储空间。',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
      read: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'info',
      title: '新用户注册',
      message: '用户 john.doe@example.com 已完成注册，等待管理员审核。',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4小时前
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'error',
      title: '数据库连接异常',
      message: '检测到数据库连接不稳定，已自动切换到备用数据库。',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6小时前
      read: false,
      priority: 'critical'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [showAll, setShowAll] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical': return '紧急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '未知';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'critical') return notification.priority === 'critical';
    return true;
  });

  const displayedNotifications = showAll ? filteredNotifications : filteredNotifications.slice(0, 5);
  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical').length;

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
          🔔 系统通知
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          margin: 0,
          fontWeight: 500
        }}>
          查看系统状态、更新和重要提醒
        </p>
      </div>

      {/* 统计卡片 */}
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
              📢
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {notifications.length}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>总通知</div>
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
              📖
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {unreadCount}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>未读通知</div>
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
              🚨
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>
                {criticalCount}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>紧急通知</div>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选和操作 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '20px', 
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '8px 16px',
                background: filter === 'all' ? '#3b82f6' : '#f1f5f9',
                color: filter === 'all' ? 'white' : '#475569',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                padding: '8px 16px',
                background: filter === 'unread' ? '#3b82f6' : '#f1f5f9',
                color: filter === 'unread' ? 'white' : '#475569',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              未读 ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('critical')}
              style={{
                padding: '8px 16px',
                background: filter === 'critical' ? '#ef4444' : '#f1f5f9',
                color: filter === 'critical' ? 'white' : '#475569',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              紧急 ({criticalCount})
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={markAllAsRead}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              全部标记为已读
            </button>
          </div>
        </div>
      </div>

      {/* 通知列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {displayedNotifications.map(notification => (
          <div
            key={notification.id}
            style={{
              background: notification.read ? 'white' : '#fef3c7',
              borderRadius: '12px',
              border: `1px solid ${notification.read ? '#e2e8f0' : '#f59e0b'}`,
              padding: '20px',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                fontSize: '24px',
                marginTop: '4px'
              }}>
                {getTypeIcon(notification.type)}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    margin: 0 
                  }}>
                    {notification.title}
                  </h3>
                  <span style={{
                    padding: '2px 6px',
                    background: getPriorityColor(notification.priority),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 500
                  }}>
                    {getPriorityText(notification.priority)}
                  </span>
                  {!notification.read && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#3b82f6',
                      borderRadius: '50%'
                    }} />
                  )}
                </div>
                
                <p style={{ 
                  fontSize: '14px', 
                  color: '#64748b', 
                  margin: 0,
                  marginBottom: '12px',
                  lineHeight: '1.5'
                }}>
                  {notification.message}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#9ca3af' 
                  }}>
                    {formatTime(notification.timestamp)}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        style={{
                          padding: '4px 8px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        标记已读
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      style={{
                        padding: '4px 8px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 显示更多按钮 */}
      {filteredNotifications.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {showAll ? '显示较少' : `显示更多 (${filteredNotifications.length - 5})`}
          </button>
        </div>
      )}

      {/* 空状态 */}
      {displayedNotifications.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, marginBottom: '8px' }}>
            暂无通知
          </h3>
          <p style={{ fontSize: '14px', margin: 0 }}>
            当前没有符合条件的通知
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications; 