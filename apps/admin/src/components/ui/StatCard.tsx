import React from 'react';
import { motion } from 'framer-motion';
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
      bg: 'bg-primary-50',
      icon: 'bg-primary-500',
      text: 'text-primary-600',
      border: 'border-primary-200',
    },
    success: {
      bg: 'bg-success-50',
      icon: 'bg-success-500',
      text: 'text-success-600',
      border: 'border-success-200',
    },
    warning: {
      bg: 'bg-warning-50',
      icon: 'bg-warning-500',
      text: 'text-warning-600',
      border: 'border-warning-200',
    },
    error: {
      bg: 'bg-error-50',
      icon: 'bg-error-500',
      text: 'text-error-600',
      border: 'border-error-200',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-500',
      text: 'text-purple-600',
      border: 'border-purple-200',
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'bg-indigo-500',
      text: 'text-indigo-600',
      border: 'border-indigo-200',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl border ${colors.border} ${colors.bg} p-6 ${className}`}
    >
      {/* 装饰性背景 */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br from-current to-transparent" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {value}
            </p>
            {trend && (
              <div className="mt-2 flex items-center">
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-error-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                }`}>
                  {trend.value}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          
          <div className={`w-12 h-12 rounded-lg ${colors.icon} flex items-center justify-center text-white`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard; 