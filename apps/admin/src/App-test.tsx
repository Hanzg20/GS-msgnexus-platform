import React from 'react';

function App() {
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
        <h2>欢迎使用 MsgNexus</h2>
        <p>这是一个测试页面，用于验证前端是否正常工作。</p>
        <p>如果您能看到这个页面，说明前端服务运行正常。</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>系统状态：</h3>
          <ul>
            <li>✅ 前端服务：运行中</li>
            <li>✅ React应用：已加载</li>
            <li>✅ 样式文件：已加载</li>
            <li>✅ JavaScript：正常运行</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3>下一步：</h3>
          <p>如果这个测试页面显示正常，我们可以继续加载完整的功能模块。</p>
        </div>
      </div>
    </div>
  );
}

export default App; 