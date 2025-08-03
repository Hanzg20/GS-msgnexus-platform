import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  color: 'primary' | 'success' | 'warning' | 'error' | 'purple' | 'indigo';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color,
  className,
}) => {
  const colorClasses = {
    primary: {
      bg: '#eff6ff',
      icon: '#3b82f6',
      text: '#1d4ed8',
      border: '#bfdbfe',
    },
    success: {
      bg: '#f0fdf4',
      icon: '#22c55e',
      text: '#15803d',
      border: '#bbf7d0',
    },
    warning: {
      bg: '#fffbeb',
      icon: '#f59e0b',
      text: '#d97706',
      border: '#fde68a',
    },
    error: {
      bg: '#fef2f2',
      icon: '#ef4444',
      text: '#dc2626',
      border: '#fecaca',
    },
    purple: {
      bg: '#faf5ff',
      icon: '#8b5cf6',
      text: '#7c3aed',
      border: '#c4b5fd',
    },
    indigo: {
      bg: '#eef2ff',
      icon: '#6366f1',
      text: '#4f46e5',
      border: '#c7d2fe',
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        padding: '24px',
        transition: 'all 0.3s ease-in-out',
        ...className && { className }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* 装饰性背景 */}
      <div style={{
        position: 'absolute',
        top: '-16px',
        right: '-16px',
        width: '96px',
        height: '96px',
        borderRadius: '50%',
        opacity: 0.1,
        background: `linear-gradient(135deg, ${colors.icon}, transparent)`
      }} />
      
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              {title}
            </p>
            <p style={{
              marginTop: '8px',
              fontSize: '30px',
              fontWeight: 'bold',
              color: '#111827'
            }}>
              {value}
            </p>
            {trend && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                {trend.isPositive ? (
                  <TrendingUp style={{ width: '16px', height: '16px', color: '#22c55e', marginRight: '4px' }} />
                ) : (
                  <TrendingDown style={{ width: '16px', height: '16px', color: '#ef4444', marginRight: '4px' }} />
                )}
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: trend.isPositive ? '#15803d' : '#dc2626'
                }}>
                  {trend.value}%
                </span>
                <span style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginLeft: '4px'
                }}>
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: colors.icon,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 