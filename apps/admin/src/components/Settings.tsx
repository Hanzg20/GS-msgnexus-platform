import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      systemName: 'GoldSky MessageCore',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN',
      theme: 'light',
      autoRefresh: true,
      refreshInterval: 30
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      ipWhitelist: '',
      loginAttempts: 5
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      performanceWarnings: true,
      securityAlerts: true,
      weeklyReports: false
    },
    performance: {
      cacheEnabled: true,
      cacheSize: 512,
      logLevel: 'info',
      maxConnections: 1000,
      compressionEnabled: true
    }
  });

  const tabs = [
    { id: 'general', label: '常规设置', icon: '⚙️' },
    { id: 'security', label: '安全设置', icon: '🔒' },
    { id: 'notifications', label: '通知设置', icon: '🔔' },
    { id: 'performance', label: '性能设置', icon: '⚡' }
  ];

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '16px' }}>
          系统信息
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              系统名称
            </label>
            <input
              type="text"
              value={settings.general.systemName}
              onChange={(e) => updateSetting('general', 'systemName', e.target.value)}
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
              时区
            </label>
            <select
              value={settings.general.timezone}
              onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
              <option value="UTC">UTC (UTC+0)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              语言
            </label>
            <select
              value={settings.general.language}
              onChange={(e) => updateSetting('general', 'language', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              主题
            </label>
            <select
              value={settings.general.theme}
              onChange={(e) => updateSetting('general', 'theme', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="light">浅色主题</option>
              <option value="dark">深色主题</option>
              <option value="auto">跟随系统</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '16px' }}>
          自动刷新
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <input
            type="checkbox"
            checked={settings.general.autoRefresh}
            onChange={(e) => updateSetting('general', 'autoRefresh', e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <label style={{ fontSize: '14px', color: '#374151' }}>
            启用自动刷新
          </label>
        </div>
        {settings.general.autoRefresh && (
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              刷新间隔 (秒)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              value={settings.general.refreshInterval}
              onChange={(e) => updateSetting('general', 'refreshInterval', parseInt(e.target.value))}
              style={{
                width: '200px',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '16px' }}>
          双因素认证
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <input
            type="checkbox"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <label style={{ fontSize: '14px', color: '#374151' }}>
            启用双因素认证 (2FA)
          </label>
        </div>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
          启用后，用户登录时需要输入额外的验证码
        </p>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '16px' }}>
          会话管理
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              会话超时时间 (分钟)
            </label>
            <input
              type="number"
              min="5"
              max="480"
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
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
              密码策略
            </label>
            <select
              value={settings.security.passwordPolicy}
              onChange={(e) => updateSetting('security', 'passwordPolicy', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="weak">弱 (至少6位)</option>
              <option value="medium">中等 (至少8位，包含字母和数字)</option>
              <option value="strong">强 (至少10位，包含大小写字母、数字和特殊字符)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '16px' }}>
          IP 白名单
        </h3>
        <div>
          <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
            IP 地址 (每行一个)
          </label>
          <textarea
            value={settings.security.ipWhitelist}
            onChange={(e) => updateSetting('security', 'ipWhitelist', e.target.value)}
            placeholder="192.168.1.1&#10;10.0.0.0/8&#10;172.16.0.0/12"
            style={{
              width: '100%',
              height: '100px',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical'
            }}
          />
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '8px 0 0 0' }}>
            留空表示允许所有 IP 地址访问
          </p>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '16px' }}>
          通知类型
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { key: 'emailNotifications', label: '邮件通知', desc: '重要事件通过邮件通知' },
            { key: 'systemAlerts', label: '系统警报', desc: '系统异常和错误通知' },
            { key: 'performanceWarnings', label: '性能警告', desc: '系统性能问题提醒' },
            { key: 'securityAlerts', label: '安全警报', desc: '安全相关事件通知' },
            { key: 'weeklyReports', label: '周报', desc: '每周系统运行报告' }
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <input
                type="checkbox"
                checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <div>
                <label style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
                  {item.label}
                </label>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformanceSettings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '16px' }}>
          缓存设置
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <input
            type="checkbox"
            checked={settings.performance.cacheEnabled}
            onChange={(e) => updateSetting('performance', 'cacheEnabled', e.target.checked)}
            style={{ width: '18px', height: '18px' }}
          />
          <label style={{ fontSize: '14px', color: '#374151' }}>
            启用缓存
          </label>
        </div>
        {settings.performance.cacheEnabled && (
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              缓存大小 (MB)
            </label>
            <input
              type="number"
              min="64"
              max="2048"
              value={settings.performance.cacheSize}
              onChange={(e) => updateSetting('performance', 'cacheSize', parseInt(e.target.value))}
              style={{
                width: '200px',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        )}
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0, marginBottom: '16px' }}>
          系统配置
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              日志级别
            </label>
            <select
              value={settings.performance.logLevel}
              onChange={(e) => updateSetting('performance', 'logLevel', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px', display: 'block' }}>
              最大连接数
            </label>
            <input
              type="number"
              min="100"
              max="10000"
              value={settings.performance.maxConnections}
              onChange={(e) => updateSetting('performance', 'maxConnections', parseInt(e.target.value))}
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
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <input
              type="checkbox"
              checked={settings.performance.compressionEnabled}
              onChange={(e) => updateSetting('performance', 'compressionEnabled', e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <label style={{ fontSize: '14px', color: '#374151' }}>
              启用数据压缩
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'performance': return renderPerformanceSettings();
      default: return renderGeneralSettings();
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
          ⚙️ 系统设置
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          margin: 0,
          fontWeight: 500
        }}>
          配置系统参数、安全设置和性能选项
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* 侧边栏 */}
        <div style={{ 
          width: '280px', 
          background: 'white', 
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0',
          height: 'fit-content'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === tab.id ? '#eff6ff' : 'transparent',
                  color: activeTab === tab.id ? '#1d4ed8' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: 500,
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 主内容区 */}
        <div style={{ flex: 1 }}>
          {renderContent()}
        </div>
      </div>

      {/* 保存按钮 */}
      <div style={{ 
        position: 'fixed', 
        bottom: '32px', 
        right: '32px',
        display: 'flex',
        gap: '12px'
      }}>
        <button style={{
          padding: '12px 24px',
          background: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}>
          重置
        </button>
        <button style={{
          padding: '12px 24px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}>
          保存设置
        </button>
      </div>
    </div>
  );
};

export default Settings; 