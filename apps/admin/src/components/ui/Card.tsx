import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  padding = 'md',
  shadow = 'md',
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    sm: 'shadow-soft',
    md: 'shadow-medium',
    lg: 'shadow-large',
  };

  const cardClasses = clsx(
    'bg-white rounded-xl border border-gray-100',
    paddingClasses[padding],
    shadowClasses[shadow],
    hover && 'hover:shadow-lg transition-shadow duration-300',
    className
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={cardClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

export default Card; 