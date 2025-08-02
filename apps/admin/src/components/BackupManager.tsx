import React, { useState, useEffect } from 'react';

interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  size: number;
  status: 'completed' | 'in_progress' | 'failed';
  createdAt: string;
  retentionDays: number;
  description?: string;
}

interface BackupSchedule {
  id: string;
  name: string;
  type: 'full' | 'incremental';
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  enabled: boolean;
  retentionDays: number;
}

const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: '1',
      name: '完整备份_2024-01-01',
      type: 'full',
      size: 2048576,
      status: 'completed',
      createdAt: '2024-01-01T00:00:00Z',
      retentionDays: 30,
      description: '每日完整备份'
    },
    {
      id: '2',
      name: '增量备份_2024-01-02',
      type: 'incremental',
      size: 512000,
      status: 'completed',
      createdAt: '2024-01-02T00:00:00Z',
      retentionDays: 7,
      description: '增量备份'
    },
    {
      id: '3',
      name: '完整备份_2024-01-03',
      type: 'full',
      size: 2097152,
      status: 'in_progress',
      createdAt: '2024-01-03T00:00:00Z',
      retentionDays: 30,
      description: '正在进行的备份'
    }
  ]);

  const [schedules, setSchedules] = useState<BackupSchedule[]>([
    {
      id: '1',
      name: '每日完整备份',
      type: 'full',
      frequency: 'daily',
      time: '02:00',
      enabled: true,
      retentionDays: 30
    },
    {
      id: '2',
      name: '每周增量备份',
      type: 'incremental',
      frequency: 'weekly',
      time: '03:00',
      enabled: true,
      retentionDays: 7
    }
  ]);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full': return 'text-purple-600 bg-purple-100';
      case 'incremental': return 'text-orange-600 bg-orange-100';
      case 'differential': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const createBackup = async (type: 'full' | 'incremental' | 'differential') => {
    setIsCreatingBackup(true);
    
    // 模拟备份创建过程
    setTimeout(() => {
      const newBackup: Backup = {
        id: Date.now().toString(),
        name: `${type === 'full' ? '完整' : type === 'incremental' ? '增量' : '差异'}备份_${new Date().toISOString().split('T')[0]}`,
        type,
        size: type === 'full' ? 2000000 : 500000,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        retentionDays: type === 'full' ? 30 : 7,
        description: `手动创建的${type === 'full' ? '完整' : type === 'incremental' ? '增量' : '差异'}备份`
      };

      setBackups(prev => [newBackup, ...prev]);

      // 模拟备份完成
      setTimeout(() => {
        setBackups(prev => prev.map(backup => 
          backup.id === newBackup.id 
            ? { ...backup, status: 'completed' as const }
            : backup
        ));
        setIsCreatingBackup(false);
      }, 5000);
    }, 1000);
  };

  const restoreBackup = async (backupId: string) => {
    // 模拟恢复过程
    console.log('Restoring backup:', backupId);
    alert('备份恢复功能正在开发中...');
  };

  const deleteBackup = async (backupId: string) => {
    if (confirm('确定要删除这个备份吗？此操作不可撤销。')) {
      setBackups(prev => prev.filter(backup => backup.id !== backupId));
    }
  };

  const toggleSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, enabled: !schedule.enabled }
        : schedule
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">备份管理</h1>
        <p className="text-gray-600">管理系统备份和恢复</p>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">总备份数</div>
          <div className="text-2xl font-bold text-gray-900">{backups.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">总存储空间</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatBytes(backups.reduce((sum, backup) => sum + backup.size, 0))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">成功备份</div>
          <div className="text-2xl font-bold text-green-600">
            {backups.filter(b => b.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">活跃计划</div>
          <div className="text-2xl font-bold text-blue-600">
            {schedules.filter(s => s.enabled).length}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">备份操作</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => createBackup('full')}
              disabled={isCreatingBackup}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isCreatingBackup ? '创建中...' : '创建完整备份'}
            </button>
            <button
              onClick={() => createBackup('incremental')}
              disabled={isCreatingBackup}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {isCreatingBackup ? '创建中...' : '创建增量备份'}
            </button>
            <button
              onClick={() => createBackup('differential')}
              disabled={isCreatingBackup}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isCreatingBackup ? '创建中...' : '创建差异备份'}
            </button>
          </div>
        </div>
      </div>

      {/* 备份列表 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">备份历史</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">备份名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">大小</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">保留天数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{backup.name}</div>
                    {backup.description && (
                      <div className="text-sm text-gray-500">{backup.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(backup.type)}`}>
                      {backup.type === 'full' ? '完整' : 
                       backup.type === 'incremental' ? '增量' : '差异'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatBytes(backup.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(backup.status)}`}>
                      {backup.status === 'completed' ? '完成' : 
                       backup.status === 'in_progress' ? '进行中' : '失败'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(backup.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.retentionDays} 天
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {backup.status === 'completed' && (
                        <button
                          onClick={() => restoreBackup(backup.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          恢复
                        </button>
                      )}
                      <button
                        onClick={() => deleteBackup(backup.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 备份计划 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">备份计划</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">计划名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">频率</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">保留天数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {schedule.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(schedule.type)}`}>
                      {schedule.type === 'full' ? '完整' : '增量'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {schedule.frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.retentionDays} 天
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      schedule.enabled ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                    }`}>
                      {schedule.enabled ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleSchedule(schedule.id)}
                      className={`${
                        schedule.enabled ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {schedule.enabled ? '禁用' : '启用'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BackupManager; 