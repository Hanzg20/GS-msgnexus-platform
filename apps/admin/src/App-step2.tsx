import React, { useState } from 'react';
import TenantManagement from './pages/TenantManagement';
import MessageMonitor from './pages/MessageMonitor';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div style={{ padding: '20px' }}>
            <h1>MsgNexus 仪表板</h1>
            <p>欢迎使用 MsgNexus 管理平台</p>
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={() => setCurrentPage('tenant')} 
                style={{ marginRight: '10px', padding: '10px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                租户管理
              </button>
              <button 
                onClick={() => setCurrentPage('message')} 
                style={{ marginRight: '10px', padding: '10px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                消息监控
              </button>
              <button 
                onClick={() => setCurrentPage('monitor')} 
                style={{ padding: '10px', backgroundColor: '#722ed1', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                系统监控
              </button>
            </div>
          </div>
        );
      case 'tenant':
        return <TenantManagement />;
      case 'message':
        return <MessageMonitor />;
      case 'monitor':
        return (
          <div style={{ padding: '20px' }}>
            <h1>系统监控</h1>
            <p>系统监控功能正在加载...</p>
            <button 
              onClick={() => setCurrentPage('dashboard')} 
              style={{ padding: '10px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              返回仪表板
            </button>
          </div>
        );
      default:
        return (
          <div style={{ padding: '20px' }}>
            <h1>MsgNexus 仪表板</h1>
            <p>欢迎使用 MsgNexus 管理平台</p>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#1a202c',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0 }}>MsgNexus</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>专业消息管理平台</p>
      </div>
      {renderPage()}
    </div>
  );
}

export default App; 