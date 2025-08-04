import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const getVariantStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#3b82f6',
          color: 'white',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        };
      case 'secondary':
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: '1px solid #d1d5db'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#6b7280'
        };
      case 'danger':
        return {
          backgroundColor: '#ef4444',
          color: 'white'
        };
      default:
        return {};
    }
  };

  const getSizeStyle = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 12px',
          fontSize: '12px',
          minHeight: '32px'
        };
      case 'md':
        return {
          padding: '8px 16px',
          fontSize: '14px',
          minHeight: '36px'
        };
      case 'lg':
        return {
          padding: '12px 20px',
          fontSize: '16px',
          minHeight: '44px'
        };
      default:
        return {};
    }
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    textDecoration: 'none',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    ...getVariantStyle(),
    ...getSizeStyle()
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button; 