import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Database, 
  Globe, 
  Users, 
  Key, 
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Monitor,
  Wifi,
  HardDrive,
  Server
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { safeRender } from '../../utils/safeRender';

// 定义标签类型
interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'MsgNexus',
      siteDescription: '企业级消息管理平台',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN',
      theme: 'light'
    },
    security: {
      enableTwoFactor: true,
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      enableAuditLog: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      systemAlerts: true,
      weeklyReports: false
    },
    system: {
      maxFileSize: 10,
      enableBackup: true,
      backupFrequency: 'daily',
      enableMonitoring: true
    }
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // 模拟保存设置
    console.log('保存设置:', settings);
    alert('设置已保存');
  };

  const tabs: TabItem[] = [
    { key: 'general', label: '常规设置', icon: <SettingsIcon style={{ width: '16px', height: '16px' }} /> },
    { key: 'security', label: '安全设置', icon: <Shield style={{ width: '16px', height: '16px' }} /> },
    { key: 'notifications', label: '通知设置', icon: <Bell style={{ width: '16px', height: '16px' }} /> },
    { key: 'system', label: '系统设置', icon: <Database style={{ width: '16px', height: '16px' }} /> }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* 头部 */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>系统设置</h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              管理系统配置和个性化设置
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="ghost">
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              重置
            </Button>
            <Button variant="primary" onClick={saveSettings}>
              <Save style={{ width: '16px', height: '16px' }} />
              保存设置
            </Button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
          {/* 侧边栏导航 */}
          <div>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: activeTab === tab.key ? '#3b82f6' : 'transparent',
                      color: activeTab === tab.key ? 'white' : '#374151',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: activeTab === tab.key ? '500' : '400',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    {safeRender(tab.icon)}
                    {safeRender(tab.label)}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* 设置内容 */}
          <div>
            {activeTab === 'general' && (
              <Card>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
                  常规设置
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                      站点名称
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                      站点描述
                    </label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                        时区
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="Asia/Shanghai">Asia/Shanghai</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                        语言
                      </label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="zh-CN">中文 (简体)</option>
                        <option value="en-US">English (US)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                      主题
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => handleSettingChange('general', 'theme', 'light')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          border: `1px solid ${settings.general.theme === 'light' ? '#3b82f6' : '#d1d5db'}`,
                          backgroundColor: settings.general.theme === 'light' ? '#eff6ff' : 'white',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Sun className="w-4 h-4" />
                        浅色主题
                      </button>
                      <button
                        onClick={() => handleSettingChange('general', 'theme', 'dark')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          border: `1px solid ${settings.general.theme === 'dark' ? '#3b82f6' : '#d1d5db'}`,
                          backgroundColor: settings.general.theme === 'dark' ? '#eff6ff' : 'white',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Moon className="w-4 h-4" />
                        深色主题
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
                  安全设置
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block' }}>
                        启用双因素认证
                      </label>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        提高账户安全性
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.enableTwoFactor}
                      onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                      会话超时时间 (分钟)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                      密码策略
                    </label>
                    <select
                      value={settings.security.passwordPolicy}
                      onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="weak">弱 (至少6位)</option>
                      <option value="medium">中等 (至少8位，包含字母和数字)</option>
                      <option value="strong">强 (至少12位，包含大小写字母、数字和特殊字符)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block' }}>
                        启用审计日志
                      </label>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        记录所有用户操作和系统事件
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.enableAuditLog}
                      onChange={(e) => handleSettingChange('security', 'enableAuditLog', e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
                  通知设置
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block' }}>
                        邮件通知
                      </label>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        接收重要事件的邮件通知
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block' }}>
                        推送通知
                      </label>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        接收实时推送通知
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block' }}>
                        系统告警
                      </label>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        接收系统异常和错误告警
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.systemAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block' }}>
                        周报邮件
                      </label>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        每周发送系统使用情况报告
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'system' && (
              <Card>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
                  系统设置
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                      最大文件大小 (MB)
                    </label>
                    <input
                      type="number"
                      value={settings.system.maxFileSize}
                      onChange={(e) => handleSettingChange('system', 'maxFileSize', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block' }}>
                        启用自动备份
                      </label>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        定期备份系统数据
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.system.enableBackup}
                      onChange={(e) => handleSettingChange('system', 'enableBackup', e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                    />
                  </div>

                  {settings.system.enableBackup && (
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>
                        备份频率
                      </label>
                      <select
                        value={settings.system.backupFrequency}
                        onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="hourly">每小时</option>
                        <option value="daily">每天</option>
                        <option value="weekly">每周</option>
                        <option value="monthly">每月</option>
                      </select>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block' }}>
                        启用系统监控
                      </label>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        监控系统性能和资源使用情况
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.system.enableMonitoring}
                      onChange={(e) => handleSettingChange('system', 'enableMonitoring', e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                    />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 