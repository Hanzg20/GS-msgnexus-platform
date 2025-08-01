// Ant Design 风格主题系统
export const antdTheme = {
  // 主色调
  primary: {
    colorPrimary: '#1890ff',
    colorPrimaryHover: '#40a9ff',
    colorPrimaryActive: '#096dd9',
    colorPrimaryBg: '#e6f7ff',
    colorPrimaryBgHover: '#bae7ff',
    colorPrimaryBorder: '#91d5ff',
    colorPrimaryBorderHover: '#69c0ff',
  },
  
  // 成功色
  success: {
    colorSuccess: '#52c41a',
    colorSuccessHover: '#73d13d',
    colorSuccessActive: '#389e0d',
    colorSuccessBg: '#f6ffed',
    colorSuccessBgHover: '#d9f7be',
    colorSuccessBorder: '#b7eb8f',
    colorSuccessBorderHover: '#95de64',
  },
  
  // 警告色
  warning: {
    colorWarning: '#faad14',
    colorWarningHover: '#ffc53d',
    colorWarningActive: '#d48806',
    colorWarningBg: '#fffbe6',
    colorWarningBgHover: '#fff1b8',
    colorWarningBorder: '#ffe58f',
    colorWarningBorderHover: '#ffd666',
  },
  
  // 错误色
  error: {
    colorError: '#ff4d4f',
    colorErrorHover: '#ff7875',
    colorErrorActive: '#cf1322',
    colorErrorBg: '#fff2f0',
    colorErrorBgHover: '#ffccc7',
    colorErrorBorder: '#ffa39e',
    colorErrorBorderHover: '#ff7875',
  },
  
  // 中性色
  neutral: {
    colorText: '#262626',
    colorTextSecondary: '#595959',
    colorTextTertiary: '#8c8c8c',
    colorTextQuaternary: '#bfbfbf',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgSpotlight: '#ffffff',
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    colorFill: '#f5f5f5',
    colorFillSecondary: '#fafafa',
    colorFillTertiary: '#ffffff',
    colorFillQuaternary: '#ffffff',
  },
  
  // 阴影
  shadow: {
    boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
  },
  
  // 圆角
  borderRadius: {
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,
  },
  
  // 字体
  font: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    lineHeight: 1.5714,
    lineHeightLG: 1.5,
    lineHeightSM: 1.6666,
  },
  
  // 间距
  spacing: {
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
    marginXL: 32,
    marginXXL: 48,
    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingMD: 20,
    paddingLG: 24,
    paddingXL: 32,
    paddingXXL: 48,
  },
  
  // 动画
  motion: {
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    motionEaseInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    motionEaseOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};

// 组件样式
export const antdComponents = {
  // 卡片组件
  card: {
    base: {
      backgroundColor: antdTheme.neutral.colorBgContainer,
      borderRadius: antdTheme.borderRadius.borderRadiusLG,
      boxShadow: antdTheme.shadow.boxShadowTertiary,
      border: `1px solid ${antdTheme.neutral.colorBorderSecondary}`,
      transition: `all ${antdTheme.motion.motionDurationMid} ${antdTheme.motion.motionEaseInOut}`,
    },
    hover: {
      boxShadow: antdTheme.shadow.boxShadow,
      transform: 'translateY(-2px)',
    },
    header: {
      padding: `${antdTheme.spacing.paddingLG} ${antdTheme.spacing.paddingLG} 0`,
      borderBottom: `1px solid ${antdTheme.neutral.colorBorderSecondary}`,
      marginBottom: antdTheme.spacing.marginLG,
    },
    body: {
      padding: antdTheme.spacing.paddingLG,
    },
  },
  
  // 按钮组件
  button: {
    base: {
      padding: `${antdTheme.spacing.paddingSM} ${antdTheme.spacing.paddingLG}`,
      borderRadius: antdTheme.borderRadius.borderRadius,
      border: 'none',
      cursor: 'pointer',
      fontSize: antdTheme.font.fontSize,
      fontWeight: 400,
      transition: `all ${antdTheme.motion.motionDurationMid} ${antdTheme.motion.motionEaseInOut}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: antdTheme.spacing.marginXS,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    primary: {
      backgroundColor: antdTheme.primary.colorPrimary,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: antdTheme.primary.colorPrimaryHover,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${antdTheme.primary.colorPrimary}40`,
      },
      '&:active': {
        backgroundColor: antdTheme.primary.colorPrimaryActive,
        transform: 'translateY(0)',
      },
    },
    default: {
      backgroundColor: antdTheme.neutral.colorBgContainer,
      color: antdTheme.neutral.colorText,
      border: `1px solid ${antdTheme.neutral.colorBorder}`,
      '&:hover': {
        color: antdTheme.primary.colorPrimary,
        borderColor: antdTheme.primary.colorPrimary,
        backgroundColor: antdTheme.primary.colorPrimaryBg,
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: antdTheme.neutral.colorTextSecondary,
      '&:hover': {
        color: antdTheme.primary.colorPrimary,
        backgroundColor: antdTheme.primary.colorPrimaryBg,
      },
    },
  },
  
  // 输入框组件
  input: {
    base: {
      padding: `${antdTheme.spacing.paddingSM} ${antdTheme.spacing.padding}`,
      borderRadius: antdTheme.borderRadius.borderRadius,
      border: `1px solid ${antdTheme.neutral.colorBorder}`,
      fontSize: antdTheme.font.fontSize,
      transition: `all ${antdTheme.motion.motionDurationMid} ${antdTheme.motion.motionEaseInOut}`,
      backgroundColor: antdTheme.neutral.colorBgContainer,
      '&:focus': {
        outline: 'none',
        borderColor: antdTheme.primary.colorPrimary,
        boxShadow: `0 0 0 2px ${antdTheme.primary.colorPrimary}20`,
      },
      '&:hover': {
        borderColor: antdTheme.primary.colorPrimaryHover,
      },
    },
  },
  
  // 标签组件
  tag: {
    base: {
      padding: `${antdTheme.spacing.paddingXS} ${antdTheme.spacing.paddingSM}`,
      borderRadius: antdTheme.borderRadius.borderRadius,
      fontSize: antdTheme.font.fontSizeSM,
      fontWeight: 400,
      display: 'inline-flex',
      alignItems: 'center',
      gap: antdTheme.spacing.marginXS,
    },
    success: {
      backgroundColor: antdTheme.success.colorSuccessBg,
      color: antdTheme.success.colorSuccess,
      border: `1px solid ${antdTheme.success.colorSuccessBorder}`,
    },
    warning: {
      backgroundColor: antdTheme.warning.colorWarningBg,
      color: antdTheme.warning.colorWarning,
      border: `1px solid ${antdTheme.warning.colorWarningBorder}`,
    },
    error: {
      backgroundColor: antdTheme.error.colorErrorBg,
      color: antdTheme.error.colorError,
      border: `1px solid ${antdTheme.error.colorErrorBorder}`,
    },
  },
  
  // 统计数值组件
  statistic: {
    base: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: antdTheme.spacing.marginXS,
    },
    title: {
      fontSize: antdTheme.font.fontSizeSM,
      color: antdTheme.neutral.colorTextSecondary,
      fontWeight: 400,
      margin: 0,
    },
    value: {
      fontSize: antdTheme.font.fontSizeHeading2,
      fontWeight: 600,
      color: antdTheme.neutral.colorText,
      margin: 0,
      lineHeight: 1.2,
    },
    suffix: {
      fontSize: antdTheme.font.fontSizeSM,
      color: antdTheme.neutral.colorTextSecondary,
      marginLeft: antdTheme.spacing.marginXS,
    },
  },
  
  // 进度条组件
  progress: {
    base: {
      width: '100%',
      height: 8,
      backgroundColor: antdTheme.neutral.colorFill,
      borderRadius: antdTheme.borderRadius.borderRadius,
      overflow: 'hidden' as const,
    },
    bar: {
      height: '100%',
      borderRadius: antdTheme.borderRadius.borderRadius,
      transition: `width ${antdTheme.motion.motionDurationSlow} ${antdTheme.motion.motionEaseInOut}`,
    },
    primary: {
      backgroundColor: antdTheme.primary.colorPrimary,
    },
    success: {
      backgroundColor: antdTheme.success.colorSuccess,
    },
  },
};

// 工具函数
export const antdUtils = {
  // 创建渐变背景
  createGradient: (startColor: string, endColor: string, direction: 'to right' | 'to bottom' = 'to right') => {
    return `linear-gradient(${direction}, ${startColor}, ${endColor})`;
  },
  
  // 创建阴影
  createShadow: (level: 1 | 2 | 3) => {
    const shadows = {
      1: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      2: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
      3: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    };
    return shadows[level];
  },
  
  // 创建动画
  createAnimation: (name: string, duration: string = antdTheme.motion.motionDurationMid) => {
    return {
      animation: `${name} ${duration} ${antdTheme.motion.motionEaseInOut}`,
    };
  },
}; 