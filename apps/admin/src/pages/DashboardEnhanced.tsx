import React, { useState, useEffect } from 'react';

const DashboardEnhanced: React.FC = () => {
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

  // 现代化样式
  const containerStyle = {
    padding: '24px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  };

  const headerStyle = {
    marginBottom: '32px',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#64748b',
    margin: 0,
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  };

  const statCardStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  const statCardHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  };

  const statIconStyle = (color: string) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '16px',
  });

  const statValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '4px',
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  const sectionStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
    marginBottom: '24px',
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const welcomeTextStyle = {
    fontSize: '16px',
    color: '#475569',
    lineHeight: '1.6',
    marginBottom: '24px',
  };

  const featureGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  };

  const featureCardStyle = {
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const featureCardHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  };

  const statusIndicatorStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  const StatCard: React.FC<{
    icon: string;
    value: string | number;
    label: string;
    color: string;
    trend?: string;
  }> = ({ icon, value, label, color, trend }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          ...statCardStyle,
          ...(isHovered ? statCardHoverStyle : {}),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={statIconStyle(color)}>
          {icon}
        </div>
        <div style={statValueStyle}>{value}</div>
        <div style={statLabelStyle}>{label}</div>
        {trend && (
          <div style={{
            fontSize: '12px',
            color: trend.startsWith('+') ? '#10b981' : '#ef4444',
            marginTop: '8px',
          }}>
            {trend}
          </div>
        )}
      </div>
    );
  };

  const FeatureCard: React.FC<{
    title: string;
    description: string;
    icon: string;
    color: string;
  }> = ({ title, description, icon, color }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          ...featureCardStyle,
          ...(isHovered ? featureCardHoverStyle : {}),
          borderLeft: `4px solid ${color}`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
          }}>
            {icon}
          </div>
          <h4 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: '#1e293b',
          }}>
            {title}
          </h4>
        </div>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#64748b',
          lineHeight: '1.5',
        }}>
          {description}
        </p>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          📊 仪表板
          <span style={{
            fontSize: '14px',
            fontWeight: '400',
            color: '#64748b',
            backgroundColor: '#f1f5f9',
            padding: '4px 12px',
            borderRadius: '20px',
          }}>
            实时数据
          </span>
        </h1>
        <p style={subtitleStyle}>
          欢迎回来！这里是您的系统概览和关键指标
        </p>
      </div>

      {/* 统计卡片 */}
      <div style={statsGridStyle}>
        <StatCard
          icon="🏢"
          value={stats.tenants}
          label="总租户数"
          color="#3b82f6"
          trend="+2 本月"
        />
        <StatCard
          icon="👥"
          value={stats.users.toLocaleString()}
          label="活跃用户"
          color="#10b981"
          trend="+12% 本周"
        />
        <StatCard
          icon="💬"
          value={stats.messages.toLocaleString()}
          label="今日消息"
          color="#f59e0b"
          trend="+8% 今日"
        />
        <StatCard
          icon="✅"
          value={stats.systemStatus}
          label="系统状态"
          color="#10b981"
        />
      </div>

      {/* 系统概览 */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          🎯 系统概览
        </h2>
        <p style={welcomeTextStyle}>
          欢迎使用 GoldSky MessageCore 管理后台！这是一个功能完整的消息核心系统管理平台，
          为您提供强大的租户管理、用户权限、消息监控等功能。
        </p>
        
        <div style={featureGridStyle}>
          <FeatureCard
            title="租户管理"
            description="管理和配置系统租户，支持多租户架构"
            icon="🏢"
            color="#3b82f6"
          />
          <FeatureCard
            title="用户权限"
            description="管理用户权限和角色，确保系统安全"
            icon="🔐"
            color="#10b981"
          />
          <FeatureCard
            title="消息监控"
            description="实时监控消息流量，掌握系统动态"
            icon="📡"
            color="#f59e0b"
          />
          <FeatureCard
            title="数据分析"
            description="深度分析数据，提供决策支持"
            icon="📈"
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* 系统信息 */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>
          ℹ️ 系统信息
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          <div>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
            }}>
              当前时间
            </h4>
            <p style={{
              margin: 0,
              fontSize: '16px',
              fontFamily: 'monospace',
              color: '#1f2937',
            }}>
              {currentTime.toLocaleString()}
            </p>
          </div>
          
          <div>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
            }}>
              系统版本
            </h4>
            <p style={{
              margin: 0,
              fontSize: '16px',
              color: '#1f2937',
            }}>
              GoldSky MessageCore v1.0.0
            </p>
          </div>
          
          <div>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
            }}>
              运行环境
            </h4>
            <p style={{
              margin: 0,
              fontSize: '16px',
              color: '#1f2937',
            }}>
              React 18 + TypeScript
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEnhanced; 