import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', style = {}, onClick }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    padding: '16px',
    transition: 'box-shadow 0.2s ease-in-out',
    ...style
  };

  if (onClick) {
    cardStyle.cursor = 'pointer';
    cardStyle.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  }

  return (
    <div 
      className={className}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={onClick ? () => {
        if (cardStyle) {
          cardStyle.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }
      } : undefined}
      onMouseLeave={onClick ? () => {
        if (cardStyle) {
          cardStyle.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

export default Card; 