import React, { useState } from 'react';
import DashboardModern from './pages/DashboardModern';
import TenantManagement from './pages/TenantManagement';
import MessageMonitor from './pages/MessageMonitor';
import SystemMonitor from './pages/SystemMonitor';
import HelpCenter from './components/HelpCenter';
import NotificationCenter from './components/NotificationCenter';
import SystemSettings from './components/SystemSettings';
import ProcessManager from './components/ProcessManager';
import LogManager from './components/LogManager';
import BackupManager from './components/BackupManager';
import UserPermissionManager from './components/UserPermissionManager';
import SystemDiagnostics from './components/SystemDiagnostics';
import AuditLog from './components/AuditLog';
import ChatRoom from './components/ChatRoom';
import AIAssistant from './components/AIAssistant';
import PerformanceMonitor from './components/PerformanceMonitor';
import SecurityMonitor from './components/SecurityMonitor';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardModern />;
      case 'tenant':
        return <TenantManagement />;
      case 'message':
        return <MessageMonitor />;
      case 'monitor':
        return <SystemMonitor />;
      case 'chat':
        return <ChatRoom />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'permissions':
        return <UserPermissionManager />;
      case 'performance':
        return <PerformanceMonitor />;
      case 'security':
        return <SecurityMonitor />;
      case 'settings':
        return <SystemSettings />;
      case 'notifications':
        return <NotificationCenter />;
      case 'help':
        return <HelpCenter />;
      case 'process':
        return <ProcessManager />;
      case 'logs':
        return <LogManager />;
      case 'backup':
        return <BackupManager />;
      case 'diagnostics':
        return <SystemDiagnostics />;
      case 'audit':
        return <AuditLog />;
      default:
        return <DashboardModern />;
    }
  };

  const menuItems = [
    { key: 'dashboard', label: '仪表板', icon: '📊' },
    {
      key: 'business-management',
      label: '业务管理',
      icon: '🏢',
      children: [
        { key: 'tenant', label: '租户管理', icon: '🏢' },
        { key: 'message', label: '消息监控', icon: '💬' },
        { key: 'monitor', label: '系统监控', icon: '📈' },
        { key: 'chat', label: '实时聊天', icon: '💭' },
        { key: 'ai-assistant', label: 'AI 助手', icon: '🤖' },
        { key: 'permissions', label: '权限管理', icon: '🔐' },
      ],
    },
    {
      key: 'system-management',
      label: '系统管理',
      icon: '⚙️',
      children: [
        { key: 'performance', label: '性能监控', icon: '📊' },
        { key: 'security', label: '安全监控', icon: '🛡️' },
        { key: 'process', label: '进程管理', icon: '⚙️' },
        { key: 'logs', label: '日志管理', icon: '📋' },
        { key: 'backup', label: '备份恢复', icon: '💾' },
        { key: 'diagnostics', label: '系统诊断', icon: '🔍' },
        { key: 'audit', label: '审计日志', icon: '📋' },
      ],
    },
    {
      key: 'operations-support',
      label: '运维支持',
      icon: '🛠️',
      children: [
        { key: 'notifications', label: '通知中心', icon: '🔔' },
        { key: 'help', label: '帮助中心', icon: '📚' },
        { key: 'settings', label: '系统设置', icon: '⚙️' },
      ],
    },
  ];

  const renderMenuItem = (item: any) => {
    const isActive = currentPage === item.key;
    const isParentActive = item.children && item.children.some((child: any) => currentPage === child.key);

    const itemStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      borderRadius: '8px',
      backgroundColor: isActive || isParentActive ? 'rgba(255,255,255,0.1)' : 'transparent',
      color: 'white',
      fontWeight: 'medium',
      transition: 'all 0.2s ease-in-out',
      cursor: 'pointer',
      border: 'none',
      textAlign: 'left' as const,
      fontSize: '16px',
      position: 'relative' as const,
    } as React.CSSProperties;

    const hoverStyle = {
      backgroundColor: 'rgba(255,255,255,0.05)',
      transform: 'translateX(4px)',
    };

    return (
      <div key={item.key}>
        <button
          onClick={() => item.children ? null : setCurrentPage(item.key)}
          style={itemStyle}
          onMouseEnter={(e) => {
            if (!isActive && !isParentActive) {
              Object.assign(e.currentTarget.style, hoverStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive && !isParentActive) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateX(0)';
            }
          }}
        >
          <span style={{ fontSize: '20px' }}>{item.icon}</span>
          {!isSidebarCollapsed && item.label}
          {isSidebarCollapsed && (
            <span style={{
              position: 'absolute',
              left: 'calc(100% + 10px)',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: '#334155',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 0.2s ease-in-out',
            }} className="group-hover:opacity-100">
              {item.label}
            </span>
          )}
        </button>
        {item.children && !isSidebarCollapsed && (
          <div style={{ marginLeft: '24px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {item.children.map((child: any) => (
              <button
                key={child.key}
                onClick={() => setCurrentPage(child.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: currentPage === child.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: 'white',
                  fontWeight: 'normal',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== child.key) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== child.key) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{child.icon}</span>
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <aside style={{
        width: isSidebarCollapsed ? '80px' : '280px',
        backgroundColor: '#1a202c',
        color: 'white',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 10px rgba(0,0,0,0.2)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        overflowX: 'hidden',
      }}>
        {/* Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{
            position: 'absolute',
            top: '20px',
            right: isSidebarCollapsed ? '18px' : '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            zIndex: 10,
            transition: 'all 0.3s ease-in-out',
            transform: isSidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
        >
          {isSidebarCollapsed ? '▶️' : '◀️'}
        </button>

        <div style={{
          fontSize: '2xl',
          fontWeight: 'bold',
          marginBottom: '24px',
          textAlign: isSidebarCollapsed ? 'center' : 'left',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transition: 'all 0.3s ease-in-out',
          paddingLeft: isSidebarCollapsed ? '0' : '16px',
        }}>
          {isSidebarCollapsed ? 'MN' : 'MsgNexus'}
        </div>
        <nav style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
            {menuItems.map(item => renderMenuItem(item))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '24px', overflowY: 'auto' }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App; 