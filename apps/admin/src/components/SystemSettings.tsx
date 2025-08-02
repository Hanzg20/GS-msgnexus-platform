import React, { useState } from 'react';

interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    enableAuditLog: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  backup: {
    autoBackup: boolean;
    backupInterval: number;
    retentionDays: number;
    backupLocation: string;
  };
}

const SystemSettings: React.FC = () => {
  const [config, setConfig] = useState<SystemConfig>({
    general: {
      siteName: 'MsgNexus',
      siteDescription: '专业的消息管理平台',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN',
      maintenanceMode: false
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
      enableAuditLog: true
    },
    email: {
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      smtpUser: 'admin@example.com',
      smtpPassword: '********',
      fromEmail: 'noreply@msgnexus.com',
      fromName: 'MsgNexus System'
    },
    backup: {
      autoBackup: true,
      backupInterval: 24,
      retentionDays: 30,
      backupLocation: '/backup'
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('设置已保存');
  };

  const handleTestEmail = () => {
    alert('测试邮件已发送');
  };

  const handleBackupNow = () => {
    alert('备份任务已启动');
  };

  const tabs = [
    { id: 'general', label: '基本设置', icon: '⚙️' },
    { id: 'security', label: '安全设置', icon: '🔒' },
    { id: 'email', label: '邮件设置', icon: '📧' },
    { id: 'backup', label: '备份设置', icon: '💾' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">系统设置</h1>
        <p className="text-gray-600">配置系统参数和功能选项</p>
      </div>

      {/* 标签页 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">基本配置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">站点名称</label>
                    <input
                      type="text"
                      value={config.general.siteName}
                      onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">站点描述</label>
                    <input
                      type="text"
                      value={config.general.siteDescription}
                      onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">时区</label>
                    <select
                      value={config.general.timezone}
                      onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Asia/Shanghai">Asia/Shanghai</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">语言</label>
                    <select
                      value={config.general.language}
                      onChange={(e) => updateConfig('general', 'language', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="zh-CN">中文</option>
                      <option value="en-US">English</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.general.maintenanceMode}
                      onChange={(e) => updateConfig('general', 'maintenanceMode', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">维护模式</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">安全配置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">会话超时时间（分钟）</label>
                    <input
                      type="number"
                      value={config.security.sessionTimeout}
                      onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">最大登录尝试次数</label>
                    <input
                      type="number"
                      value={config.security.maxLoginAttempts}
                      onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">密码最小长度</label>
                    <input
                      type="number"
                      value={config.security.passwordMinLength}
                      onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.security.requireTwoFactor}
                      onChange={(e) => updateConfig('security', 'requireTwoFactor', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">启用双因素认证</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.security.enableAuditLog}
                      onChange={(e) => updateConfig('security', 'enableAuditLog', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">启用审计日志</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">邮件配置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 服务器</label>
                    <input
                      type="text"
                      value={config.email.smtpHost}
                      onChange={(e) => updateConfig('email', 'smtpHost', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP 端口</label>
                    <input
                      type="number"
                      value={config.email.smtpPort}
                      onChange={(e) => updateConfig('email', 'smtpPort', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
                    <input
                      type="text"
                      value={config.email.smtpUser}
                      onChange={(e) => updateConfig('email', 'smtpUser', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                    <input
                      type="password"
                      value={config.email.smtpPassword}
                      onChange={(e) => updateConfig('email', 'smtpPassword', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">发件人邮箱</label>
                    <input
                      type="email"
                      value={config.email.fromEmail}
                      onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">发件人名称</label>
                    <input
                      type="text"
                      value={config.email.fromName}
                      onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleTestEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    发送测试邮件
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">备份配置</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">备份间隔（小时）</label>
                    <input
                      type="number"
                      value={config.backup.backupInterval}
                      onChange={(e) => updateConfig('backup', 'backupInterval', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">保留天数</label>
                    <input
                      type="number"
                      value={config.backup.retentionDays}
                      onChange={(e) => updateConfig('backup', 'retentionDays', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">备份位置</label>
                    <input
                      type="text"
                      value={config.backup.backupLocation}
                      onChange={(e) => updateConfig('backup', 'backupLocation', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.backup.autoBackup}
                      onChange={(e) => updateConfig('backup', 'autoBackup', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">启用自动备份</span>
                  </label>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleBackupNow}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    立即备份
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings; 