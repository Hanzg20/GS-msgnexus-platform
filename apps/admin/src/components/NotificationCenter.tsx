import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '系统更新完成',
      message: 'MsgNexus 平台已成功更新到最新版本 v1.2.0',
      type: 'success',
      timestamp: '2024-01-01T10:00:00Z',
      isRead: false,
      category: '系统',
      priority: 'medium'
    },
    {
      id: '2',
      title: '新用户注册',
      message: '用户 user123@example.com 已完成注册',
      type: 'info',
      timestamp: '2024-01-01T09:30:00Z',
      isRead: false,
      category: '用户',
      priority: 'low'
    },
    {
      id: '3',
      title: '安全警告',
      message: '检测到异常登录尝试，请检查账户安全',
      type: 'warning',
      timestamp: '2024-01-01T09:00:00Z',
      isRead: true,
      category: '安全',
      priority: 'high'
    },
    {
      id: '4',
      title: '备份失败',
      message: '自动备份任务执行失败，请检查存储空间',
      type: 'error',
      timestamp: '2024-01-01T08:30:00Z',
      isRead: false,
      category: '备份',
      priority: 'urgent'
    }
  ]);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showRead, setShowRead] = useState(true);

  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filterType === 'all' || notification.type === filterType;
    const categoryMatch = filterCategory === 'all' || notification.category === filterCategory;
    const priorityMatch = filterPriority === 'all' || notification.priority === filterPriority;
    const readMatch = showRead || !notification.isRead;
    
    return typeMatch && categoryMatch && priorityMatch && readMatch;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">通知中心</h1>
        <p className="text-gray-600">管理系统通知和消息</p>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">总通知数</div>
          <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">未读通知</div>
          <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">紧急通知</div>
          <div className="text-2xl font-bold text-red-600">
            {notifications.filter(n => n.priority === 'urgent').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">今日通知</div>
          <div className="text-2xl font-bold text-green-600">
            {notifications.filter(n => {
              const today = new Date().toDateString();
              return new Date(n.timestamp).toDateString() === today;
            }).length}
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">全部</option>
                  <option value="info">信息</option>
                  <option value="success">成功</option>
                  <option value="warning">警告</option>
                  <option value="error">错误</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">全部</option>
                  <option value="系统">系统</option>
                  <option value="用户">用户</option>
                  <option value="安全">安全</option>
                  <option value="备份">备份</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">全部</option>
                  <option value="urgent">紧急</option>
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showRead"
                  checked={showRead}
                  onChange={(e) => setShowRead(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showRead" className="ml-2 text-sm text-gray-700">
                  显示已读
                </label>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                全部标记为已读
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                清空通知
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 通知列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">通知列表 ({filteredNotifications.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`text-lg font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type === 'success' ? '成功' :
                         notification.type === 'warning' ? '警告' :
                         notification.type === 'error' ? '错误' : '信息'}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === 'urgent' ? '紧急' :
                         notification.priority === 'high' ? '高' :
                         notification.priority === 'medium' ? '中' : '低'}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                        {notification.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{formatDate(notification.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      标记已读
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredNotifications.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            暂无通知
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter; 