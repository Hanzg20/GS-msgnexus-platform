import React, { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div style={{ padding: '24px' }}>
            <h1>仪表板</h1>
            <p>欢迎使用 MsgNexus 平台</p>
          </div>
        );
      case 'settings':
        return (
          <div style={{ padding: '24px' }}>
            <h1>系统设置</h1>
            <p>设置页面</p>
          </div>
        );
      default:
        return (
          <div style={{ padding: '24px' }}>
            <h1>仪表板</h1>
            <p>欢迎使用 MsgNexus 平台</p>
          </div>
        );
    }
  };

  const menuItems = [
    { key: 'dashboard', label: '仪表板', icon: '📊' },
    { key: 'settings', label: '系统设置', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: '#1a202c',
        color: 'white',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '24px',
          textAlign: 'left',
        }}>
          MsgNexus
        </div>
        <nav style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: currentPage === item.key ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: 'white',
                  fontWeight: 'medium',
                  cursor: 'pointer',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '16px',
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
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