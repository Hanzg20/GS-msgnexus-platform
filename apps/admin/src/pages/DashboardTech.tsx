import React, { useState, useEffect } from 'react';
import { antdTheme, antdComponents, antdUtils } from '../styles/antd-theme';

const DashboardTech: React.FC = () => {
  const [stats, setStats] = useState({
    tenants: 25,
    users: 1234,
    messages: 5678,
    systemStatus: '正常',
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 32,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 模拟数据加载
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // 容器样式
  const containerStyle = {
    padding: antdTheme.spacing.paddingLG,
    backgroundColor: antdTheme.neutral.colorBgLayout,
    minHeight: '100vh',
    fontFamily: antdTheme.font.fontFamily,
  };

  // 头部样式
  const headerStyle = {
    marginBottom: antdTheme.spacing.marginXXL,
  };

  const titleStyle = {
    fontSize: antdTheme.font.fontSizeHeading1,
    fontWeight: 600,
    color: antdTheme.neutral.colorText,
    marginBottom: antdTheme.spacing.marginSM,
    display: 'flex',
    alignItems: 'center',
    gap: antdTheme.spacing.margin,
  };

  const subtitleStyle = {
    fontSize: antdTheme.font.fontSizeLG,
    color: antdTheme.neutral.colorTextSecondary,
    margin: 0,
    fontWeight: 400,
  };

  // 统计卡片网格
  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: antdTheme.spacing.marginLG,
    marginBottom: antdTheme.spacing.marginXXL,
  };

  // 统计卡片组件
  const StatCard: React.FC<{
    icon: string;
    value: string | number;
    label: string;
    trend?: string;
    trendType?: 'up' | 'down';
    color: string;
    gradient?: boolean;
  }> = ({ icon, value, label, trend, trendType, color, gradient = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
      ...antdComponents.card.base,
      ...(isHovered ? antdComponents.card.hover : {}),
      padding: antdTheme.spacing.paddingLG,
      position: 'relative' as const,
      overflow: 'hidden' as const,
      background: gradient 
        ? antdUtils.createGradient(`${color}10`, `${color}05`)
        : antdTheme.neutral.colorBgContainer,
    };

    const iconStyle = {
      width: 56,
      height: 56,
      borderRadius: antdTheme.borderRadius.borderRadiusLG,
      background: gradient 
        ? antdUtils.createGradient(color, `${color}80`)
        : `${color}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      marginBottom: antdTheme.spacing.marginLG,
      position: 'relative' as const,
    };

    const valueStyle = {
      ...antdComponents.statistic.value,
      fontSize: antdTheme.font.fontSizeHeading2,
      color: antdTheme.neutral.colorText,
      marginBottom: antdTheme.spacing.marginXS,
    };

    const labelStyle = {
      ...antdComponents.statistic.title,
      fontSize: antdTheme.font.fontSizeSM,
      color: antdTheme.neutral.colorTextSecondary,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      fontWeight: 500,
    };

    const trendStyle = {
      fontSize: antdTheme.font.fontSizeSM,
      color: trendType === 'up' ? antdTheme.success.colorSuccess : antdTheme.error.colorError,
      display: 'flex',
      alignItems: 'center',
      gap: antdTheme.spacing.marginXS,
      marginTop: antdTheme.spacing.marginSM,
    };

    return (
      <div
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={iconStyle}>
          {icon}
        </div>
        <div style={antdComponents.statistic.base}>
          <div style={valueStyle}>{value}</div>
          <div style={labelStyle}>{label}</div>
          {trend && (
            <div style={trendStyle}>
              <span>{trendType === 'up' ? '↗' : '↘'}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>
        
        {/* 装饰性背景元素 */}
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `${color}05`,
          opacity: 0.3,
        }} />
      </div>
    );
  };

  // 进度条组件
  const ProgressBar: React.FC<{
    percent: number;
    label: string;
    color: string;
  }> = ({ percent, label, color }) => {
    const progressStyle = {
      ...antdComponents.progress.base,
      marginBottom: antdTheme.spacing.marginSM,
    };

    const barStyle = {
      ...antdComponents.progress.bar,
      width: `${percent}%`,
      backgroundColor: color,
    };

    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: antdTheme.spacing.marginXS,
        }}>
          <span style={{
            fontSize: antdTheme.font.fontSizeSM,
            color: antdTheme.neutral.colorTextSecondary,
          }}>
            {label}
          </span>
          <span style={{
            fontSize: antdTheme.font.fontSizeSM,
            color: antdTheme.neutral.colorText,
            fontWeight: 500,
          }}>
            {percent}%
          </span>
        </div>
        <div style={progressStyle}>
          <div style={barStyle} />
        </div>
      </div>
    );
  };

  // 系统概览卡片
  const SystemOverviewCard: React.FC = () => {
    const cardStyle = {
      ...antdComponents.card.base,
      padding: antdTheme.spacing.paddingLG,
    };

    const headerStyle = {
      ...antdComponents.card.header,
      padding: 0,
      marginBottom: antdTheme.spacing.marginLG,
      borderBottom: 'none',
    };

    return (
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h3 style={{
            fontSize: antdTheme.font.fontSizeHeading4,
            fontWeight: 600,
            color: antdTheme.neutral.colorText,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: antdTheme.spacing.marginSM,
          }}>
            🎯 系统概览
          </h3>
        </div>
        
        <div style={antdComponents.card.body}>
          <p style={{
            fontSize: antdTheme.font.fontSizeLG,
            color: antdTheme.neutral.colorTextSecondary,
            lineHeight: antdTheme.font.lineHeight,
            marginBottom: antdTheme.spacing.marginLG,
          }}>
            欢迎使用 GoldSky MessageCore 管理后台！这是一个功能完整的消息核心系统管理平台，
            为您提供强大的租户管理、用户权限、消息监控等功能。
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: antdTheme.spacing.marginLG,
          }}>
            <div style={{
              padding: antdTheme.spacing.paddingLG,
              borderRadius: antdTheme.borderRadius.borderRadius,
              border: `1px solid ${antdTheme.success.colorSuccessBorder}`,
              backgroundColor: antdTheme.success.colorSuccessBg,
            }}>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: antdTheme.font.fontSize,
                fontWeight: 600,
                color: antdTheme.success.colorSuccess,
              }}>
                🏢 租户管理
              </h4>
              <p style={{
                margin: 0,
                fontSize: antdTheme.font.fontSizeSM,
                color: antdTheme.neutral.colorTextSecondary,
              }}>
                管理和配置系统租户，支持多租户架构
              </p>
            </div>
            
            <div style={{
              padding: antdTheme.spacing.paddingLG,
              borderRadius: antdTheme.borderRadius.borderRadius,
              border: `1px solid ${antdTheme.primary.colorPrimaryBorder}`,
              backgroundColor: antdTheme.primary.colorPrimaryBg,
            }}>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: antdTheme.font.fontSize,
                fontWeight: 600,
                color: antdTheme.primary.colorPrimary,
              }}>
                🔐 用户权限
              </h4>
              <p style={{
                margin: 0,
                fontSize: antdTheme.font.fontSizeSM,
                color: antdTheme.neutral.colorTextSecondary,
              }}>
                管理用户权限和角色，确保系统安全
              </p>
            </div>
            
            <div style={{
              padding: antdTheme.spacing.paddingLG,
              borderRadius: antdTheme.borderRadius.borderRadius,
              border: `1px solid ${antdTheme.warning.colorWarningBorder}`,
              backgroundColor: antdTheme.warning.colorWarningBg,
            }}>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: antdTheme.font.fontSize,
                fontWeight: 600,
                color: antdTheme.warning.colorWarning,
              }}>
                📡 消息监控
              </h4>
              <p style={{
                margin: 0,
                fontSize: antdTheme.font.fontSizeSM,
                color: antdTheme.neutral.colorTextSecondary,
              }}>
                实时监控消息流量，掌握系统动态
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 系统监控卡片
  const SystemMonitorCard: React.FC = () => {
    const cardStyle = {
      ...antdComponents.card.base,
      padding: antdTheme.spacing.paddingLG,
    };

    return (
      <div style={cardStyle}>
        <h3 style={{
          fontSize: antdTheme.font.fontSizeHeading4,
          fontWeight: 600,
          color: antdTheme.neutral.colorText,
          margin: '0 0 24px 0',
          display: 'flex',
          alignItems: 'center',
          gap: antdTheme.spacing.marginSM,
        }}>
          📊 系统监控
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: antdTheme.spacing.marginLG,
        }}>
          <ProgressBar
            percent={stats.cpuUsage}
            label="CPU 使用率"
            color={antdTheme.primary.colorPrimary}
          />
          <ProgressBar
            percent={stats.memoryUsage}
            label="内存使用率"
            color={antdTheme.warning.colorWarning}
          />
          <ProgressBar
            percent={stats.diskUsage}
            label="磁盘使用率"
            color={antdTheme.success.colorSuccess}
          />
        </div>
      </div>
    );
  };

  // 加载状态
  if (isLoading) {
    return (
      <div style={{
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: `4px solid ${antdTheme.neutral.colorFill}`,
            borderTop: `4px solid ${antdTheme.primary.colorPrimary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{
            fontSize: antdTheme.font.fontSizeLG,
            color: antdTheme.neutral.colorTextSecondary,
            margin: 0,
          }}>
            正在加载系统数据...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* 头部 */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          📊 仪表板
          <span style={{
            fontSize: antdTheme.font.fontSizeSM,
            fontWeight: 400,
            color: antdTheme.neutral.colorTextSecondary,
            backgroundColor: antdTheme.neutral.colorFill,
            padding: '4px 12px',
            borderRadius: antdTheme.borderRadius.borderRadius,
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
          trend="+2 本月"
          trendType="up"
          color={antdTheme.primary.colorPrimary}
          gradient={true}
        />
        <StatCard
          icon="👥"
          value={stats.users.toLocaleString()}
          label="活跃用户"
          trend="+12% 本周"
          trendType="up"
          color={antdTheme.success.colorSuccess}
          gradient={true}
        />
        <StatCard
          icon="💬"
          value={stats.messages.toLocaleString()}
          label="今日消息"
          trend="+8% 今日"
          trendType="up"
          color={antdTheme.warning.colorWarning}
          gradient={true}
        />
        <StatCard
          icon="✅"
          value={stats.systemStatus}
          label="系统状态"
          color={antdTheme.success.colorSuccess}
          gradient={true}
        />
      </div>

      {/* 系统概览 */}
      <SystemOverviewCard />

      {/* 系统监控 */}
      <SystemMonitorCard />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DashboardTech; 