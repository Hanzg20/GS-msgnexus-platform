import React from 'react';

function App() {
  console.log('App component is rendering...');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#1a202c',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>MsgNexus</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>专业消息管理平台</p>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>React 应用测试</h2>
        <p>如果您能看到这个页面，说明 React 应用正常运行。</p>
        <p>当前时间: {new Date().toLocaleString()}</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>测试按钮:</h3>
          <button 
            onClick={() => alert('按钮点击正常！')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            点击测试
          </button>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>系统信息:</h3>
          <ul>
            <li>React 版本: {React.version}</li>
            <li>用户代理: {navigator.userAgent}</li>
            <li>屏幕分辨率: {window.screen.width} x {window.screen.height}</li>
            <li>窗口大小: {window.innerWidth} x {window.innerHeight}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App; 