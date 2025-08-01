import React, { useState, useEffect } from 'react';
import HelpCenter from './components/HelpCenter';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import SystemProcessManager from './components/SystemProcessManager';
import LogManager from './components/LogManager';
import BackupManager from './components/BackupManager';
import UserPermissionManager from './components/UserPermissionManager';
import SystemDiagnostics from './components/SystemDiagnostics';
import AuditLog from './components/AuditLog';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [expandedSections, setExpandedSections] = useState<string[]>(['business', 'system']);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    const timeTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(timeTimer);
    };
  }, []);

  const stats = {
    tenants: 25,
    users: 1234,
    messages: 5678,
    systemStatus: '正常',
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 32,
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    color: string; 
    icon: string;
    trend?: { value: number; isPositive: boolean; label: string } 
  }> = ({ title, value, color, icon, trend }) => (
    <div 
      style={{ 
        background: `linear-gradient(135deg, ${color}08 0%, ${color}15 100%)`,
        border: `1px solid ${color}20`,
        borderRadius: '16px',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hoveredCard === title ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hoveredCard === title 
          ? `0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px ${color}30` 
          : '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
      onMouseEnter={() => setHoveredCard(title)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* 装饰性背景 */}
      <div style={{ 
        position: 'absolute', 
        top: '-30px', 
        right: '-30px', 
        width: '120px', 
        height: '120px', 
        borderRadius: '50%', 
        opacity: 0.08, 
        background: `linear-gradient(135deg, ${color}, transparent)`,
        transform: hoveredCard === title ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1 }}>
          <p style={{ 
            fontSize: '13px', 
            fontWeight: 600, 
            color: '#64748b', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            margin: 0, 
            marginBottom: '12px' 
          }}>
            {title}
          </p>
          <p style={{ 
            fontSize: '36px', 
            fontWeight: 800, 
            color: '#1e293b', 
            margin: 0, 
            marginBottom: '12px',
            lineHeight: 1
          }}>
            {value}
          </p>
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: trend.isPositive ? '#059669' : '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {trend.isPositive ? '↗' : '↘'} {trend.value}%
              </span>
              <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '6px' }}>
                {trend.label}
              </span>
            </div>
          )}
        </div>
        
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '16px', 
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white',
          fontSize: '28px',
          boxShadow: `0 8px 24px ${color}40`,
          transform: hoveredCard === title ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
          transition: 'all 0.3s ease'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
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
                🚀 MsgNexus 仪表板
              </h1>
              <p style={{ 
                fontSize: '18px', 
                color: '#64748b', 
                margin: 0,
                fontWeight: 500
              }}>
                欢迎回来！这里是您的专业消息管理平台
              </p>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px', 
              marginBottom: '40px' 
            }}>
              <StatCard
                title="总租户数"
                value={stats.tenants}
                color="#3b82f6"
                icon="🏢"
                trend={{ value: 12, isPositive: true, label: '本月' }}
              />
              <StatCard
                title="活跃用户"
                value={stats.users.toLocaleString()}
                color="#10b981"
                icon="👥"
                trend={{ value: 8, isPositive: true, label: '本周' }}
              />
              <StatCard
                title="今日消息"
                value={stats.messages.toLocaleString()}
                color="#f59e0b"
                icon="💬"
                trend={{ value: 15, isPositive: true, label: '今日' }}
              />
              <StatCard
                title="系统状态"
                value={stats.systemStatus}
                color="#8b5cf6"
                icon="🛡️"
              />
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
              gap: '32px' 
            }}>
              <div style={{ 
                background: 'white', 
                borderRadius: '20px', 
                padding: '32px', 
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  color: '#0f172a', 
                  margin: 0, 
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  📊 系统资源监控
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { label: '🖥️ CPU 使用率', value: stats.cpuUsage, color: '#3b82f6', icon: '🖥️' },
                    { label: '💾 内存使用率', value: stats.memoryUsage, color: '#f59e0b', icon: '💾' },
                    { label: '💿 磁盘使用率', value: stats.diskUsage, color: '#10b981', icon: '💿' },
                  ].map((item, index) => (
                    <div key={index}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '15px', color: '#475569', fontWeight: 500 }}>{item.label}</span>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{item.value}%</span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '12px', 
                        background: '#f1f5f9', 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <div style={{ 
                          width: `${item.value}%`, 
                          height: '100%', 
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                          borderRadius: '8px',
                          transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: `0 2px 8px ${item.color}40`
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          animation: 'shimmer 2s infinite'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ 
                background: 'white', 
                borderRadius: '20px', 
                padding: '32px', 
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  color: '#0f172a', 
                  margin: 0, 
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  ⚡ 快速操作
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: '用户权限管理', color: '#3b82f6', icon: '🔐', page: 'permissions' },
                    { label: '系统诊断', color: '#10b981', icon: '🔍', page: 'diagnostics' },
                    { label: '审计日志', color: '#f59e0b', icon: '📋', page: 'audit' },
                    { label: '进程管理', color: '#8b5cf6', icon: '⚙️', page: 'process' },
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(item.page)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#475569',
                        textAlign: 'left',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${item.color}08, ${item.color}15)`;
                        e.currentTarget.style.borderColor = item.color;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px ${item.color}30`;
                        e.currentTarget.style.color = '#0f172a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.color = '#475569';
                      }}
                    >
                      <span style={{ fontSize: '20px', marginRight: '16px' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'help':
        return <HelpCenter />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      case 'process':
        return <SystemProcessManager />;
      case 'logs':
        return <LogManager />;
      case 'backup':
        return <BackupManager />;
      case 'permissions':
        return <UserPermissionManager />;
      case 'diagnostics':
        return <SystemDiagnostics />;
      case 'audit':
        return <AuditLog />;
      default:
        return (
          <div style={{ padding: '32px' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '40px', 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚧</div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: 700, 
                color: '#0f172a', 
                margin: 0, 
                marginBottom: '16px' 
              }}>
                功能开发中
              </h1>
              <p style={{ 
                fontSize: '18px', 
                color: '#64748b', 
                margin: 0,
                fontWeight: 500
              }}>
                此功能正在开发中，敬请期待。
              </p>
            </div>
          </div>
        );
    }
  };

  if (!isLoaded) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }} />
          <p style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>正在加载 MsgNexus...</p>
          <p style={{ fontSize: '14px', opacity: 0.8, margin: '8px 0 0 0' }}>请稍候，专业消息管理平台正在初始化</p>
        </div>
      </div>
    );
  }

  // 二层级的菜单结构
  const menuSections = [
    {
      id: 'dashboard',
      label: '仪表板',
      icon: '📊',
      items: []
    },
    {
      id: 'business',
      label: '业务管理',
      icon: '🏢',
      items: [
        { key: 'tenant', label: '租户管理', icon: '🏢' },
        { key: 'message', label: '消息监控', icon: '💬' },
        { key: 'monitor', label: '系统监控', icon: '📈' },
        { key: 'permissions', label: '权限管理', icon: '🔐' },
      ]
    },
    {
      id: 'system',
      label: '系统管理',
      icon: '⚙️',
      items: [
        { key: 'process', label: '进程管理', icon: '⚙️' },
        { key: 'logs', label: '日志管理', icon: '📋' },
        { key: 'backup', label: '备份恢复', icon: '💾' },
        { key: 'diagnostics', label: '系统诊断', icon: '🔍' },
        { key: 'audit', label: '审计日志', icon: '📋' },
      ]
    },
    {
      id: 'support',
      label: '运维支持',
      icon: '🛠️',
      items: [
        { key: 'notifications', label: '通知中心', icon: '🔔' },
        { key: 'help', label: '帮助中心', icon: '📚' },
        { key: 'settings', label: '系统设置', icon: '⚙️' },
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const renderMenuItem = (item: { key: string; label: string; icon: string }) => (
    <button
      key={item.key}
      onClick={() => setCurrentPage(item.key)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        border: 'none',
        background: currentPage === item.key 
          ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
          : 'transparent',
        color: currentPage === item.key ? 'white' : '#475569',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: '14px',
        fontWeight: 500,
        textAlign: 'left',
        margin: '2px 0',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (currentPage !== item.key) {
          e.currentTarget.style.background = '#f1f5f9';
          e.currentTarget.style.color = '#0f172a';
          e.currentTarget.style.transform = 'translateX(4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (currentPage !== item.key) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#475569';
          e.currentTarget.style.transform = 'translateX(0)';
        }
      }}
    >
      <span style={{ fontSize: '16px' }}>{item.icon}</span>
      <span>{item.label}</span>
      {item.key === 'notifications' && notificationCount > 0 && (
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#ef4444',
          color: 'white',
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 600
        }}>
          {notificationCount}
        </div>
      )}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* 头部 */}
      <div style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '20px 32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              🚀 MsgNexus
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 600
              }}>
                👤
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>管理员</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>系统管理员</div>
              </div>
            </div>
            <div style={{ 
              padding: '8px 16px', 
              background: '#f1f5f9', 
              borderRadius: '8px',
              fontSize: '14px', 
              fontWeight: 600,
              color: '#475569'
            }}>
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex' }}>
        {/* 侧边栏 */}
        <div style={{ 
          width: sidebarCollapsed ? '80px' : '280px', 
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          borderRight: '1px solid #475569',
          minHeight: 'calc(100vh - 89px)',
          padding: '24px 0',
          position: 'relative',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}>
          {/* 科技感装饰背景 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)
            `,
            pointerEvents: 'none'
          }} />
          
          {/* 网格装饰 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            opacity: 0.3,
            pointerEvents: 'none'
          }} />

          {/* 收起/展开按钮 */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              position: 'absolute',
              top: '20px',
              right: sidebarCollapsed ? '20px' : '-12px',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: '2px solid white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              zIndex: 10,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>

          <nav style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
              {menuSections.map(section => (
                <div key={section.id}>
                  {/* 主菜单项或分组标题 */}
                  {section.items.length === 0 ? (
                    // 单个菜单项（如仪表板）
                    <button
                      onClick={() => setCurrentPage(section.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: sidebarCollapsed ? '0' : '16px',
                        padding: sidebarCollapsed ? '16px 8px' : '16px 20px',
                        borderRadius: '12px',
                        border: 'none',
                        background: currentPage === section.id 
                          ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        color: currentPage === section.id ? 'white' : '#e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: sidebarCollapsed ? '20px' : '15px',
                        fontWeight: 600,
                        textAlign: 'center',
                        margin: '0 8px',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== section.id) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== section.id) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.color = '#e2e8f0';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }
                      }}
                      title={sidebarCollapsed ? section.label : undefined}
                    >
                      <span style={{ fontSize: '20px' }}>{section.icon}</span>
                      {!sidebarCollapsed && <span>{section.label}</span>}
                    </button>
                  ) : (
                    // 分组菜单
                    <div>
                      {/* 分组标题 */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                          padding: sidebarCollapsed ? '16px 8px' : '16px 20px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          fontSize: sidebarCollapsed ? '20px' : '15px',
                          fontWeight: 600,
                          textAlign: 'center',
                          margin: '0 8px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.color = '#e2e8f0';
                        }}
                        title={sidebarCollapsed ? section.label : undefined}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: sidebarCollapsed ? '0' : '16px' }}>
                          <span style={{ fontSize: '20px' }}>{section.icon}</span>
                          {!sidebarCollapsed && <span>{section.label}</span>}
                        </div>
                        {!sidebarCollapsed && (
                          <span style={{ 
                            fontSize: '14px', 
                            transition: 'transform 0.3s ease',
                            transform: expandedSections.includes(section.id) ? 'rotate(180deg)' : 'rotate(0deg)'
                          }}>
                            ▼
                          </span>
                        )}
                      </button>
                      
                      {/* 子菜单项 */}
                      {!sidebarCollapsed && expandedSections.includes(section.id) && (
                        <div style={{ 
                          marginLeft: '16px', 
                          marginTop: '8px',
                          paddingLeft: '16px',
                          borderLeft: '2px solid rgba(59, 130, 246, 0.3)'
                        }}>
                          {section.items.map(renderMenuItem)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
        
        {/* 主内容区 */}
        <div style={{ flex: 1 }}>
          {renderPage()}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App; 