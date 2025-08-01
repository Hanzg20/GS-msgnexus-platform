import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    tenants: 25,
    users: 1234,
    messages: 5678,
    systemStatus: '正常'
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const cardStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  };

  const statCardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center' as const,
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ color: '#1890ff', marginBottom: '24px', fontSize: '28px' }}>
        📊 仪表板
      </h1>
      
      {/* 统计卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏢</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#666' }}>总租户数</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890ff' }}>
            {stats.tenants}
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#666' }}>活跃用户</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a' }}>
            {stats.users.toLocaleString()}
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#666' }}>今日消息</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fa8c16' }}>
            {stats.messages.toLocaleString()}
          </div>
        </div>
        
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#666' }}>系统状态</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#52c41a' }}>
            {stats.systemStatus}
          </div>
        </div>
      </div>

      {/* 系统概览 */}
      <div style={cardStyle}>
        <h2 style={{ color: '#333', marginBottom: '16px' }}>系统概览</h2>
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
          欢迎使用 GoldSky MessageCore 管理后台！这是一个功能完整的消息核心系统管理平台。
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <div style={{ 
            backgroundColor: '#f6ffed', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #b7eb8f'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#52c41a' }}>租户管理</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>管理和配置系统租户</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#e6f7ff', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #91d5ff'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#1890ff' }}>用户权限</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>管理用户权限和角色</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#fff7e6', 
            padding: '16px', 
            borderRadius: '6px',
            border: '1px solid #ffd591'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#fa8c16' }}>消息监控</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>实时监控消息流量</p>
          </div>
        </div>
      </div>

      {/* 系统信息 */}
      <div style={cardStyle}>
        <h2 style={{ color: '#333', marginBottom: '16px' }}>系统信息</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px' 
        }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>当前时间</h4>
            <p style={{ margin: 0, color: '#666', fontFamily: 'monospace' }}>
              {currentTime.toLocaleString()}
            </p>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>系统版本</h4>
            <p style={{ margin: 0, color: '#666' }}>GoldSky MessageCore v1.0.0</p>
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>运行环境</h4>
            <p style={{ margin: 0, color: '#666' }}>React 18 + TypeScript</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 