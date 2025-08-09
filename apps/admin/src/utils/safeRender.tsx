import React from 'react';

// 安全渲染工具函数
export const safeRender = (content: any): React.ReactNode => {
  if (content === null || content === undefined) {
    return null;
  }
  
  if (typeof content === 'string' || typeof content === 'number' || typeof content === 'boolean') {
    return content;
  }
  
  if (React.isValidElement(content)) {
    return content;
  }
  
  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <React.Fragment key={index}>
        {safeRender(item)}
      </React.Fragment>
    ));
  }
  
  // 如果是对象但不是 React 元素，转换为字符串
  if (typeof content === 'object') {
    try {
      return String(content);
    } catch (error) {
      console.warn('Safe render error:', error);
      return null;
    }
  }
  
  return null;
};

// 安全渲染数组
export const safeRenderArray = (array: any[], renderFn: (item: any, index: number) => React.ReactNode): React.ReactNode[] => {
  if (!Array.isArray(array)) {
    return [];
  }
  
  return array.map((item, index) => {
    try {
      const result = renderFn(item, index);
      // 确保返回的是有效的 React 元素
      if (React.isValidElement(result)) {
        return result;
      } else if (typeof result === 'string' || typeof result === 'number' || typeof result === 'boolean') {
        return <React.Fragment key={index}>{result}</React.Fragment>;
      } else {
        console.warn('Invalid render result:', result);
        return <div key={index}>渲染错误</div>;
      }
    } catch (error) {
      console.warn('Safe render error:', error);
      return <div key={index}>渲染错误</div>;
    }
  });
};

// 安全渲染对象属性
export const safeRenderProperty = (obj: any, property: string): React.ReactNode => {
  if (!obj || typeof obj !== 'object') {
    return null;
  }
  
  const value = obj[property];
  return safeRender(value);
};

// 安全渲染图标
export const safeRenderIcon = (icon: any): React.ReactNode => {
  if (React.isValidElement(icon)) {
    return icon;
  }
  
  if (typeof icon === 'string') {
    return <span>{icon}</span>;
  }
  
  return null;
};

// 安全渲染标签
export const safeRenderLabel = (label: any): React.ReactNode => {
  if (typeof label === 'string' || typeof label === 'number') {
    return label;
  }
  
  if (React.isValidElement(label)) {
    return label;
  }
  
  return String(label || '');
};

// 安全渲染菜单项
export const safeRenderMenuItem = (item: any, renderFn: (item: any) => React.ReactNode): React.ReactNode => {
  try {
    const result = renderFn(item);
    if (React.isValidElement(result)) {
      return result;
    } else {
      console.warn('Invalid menu item render result:', result);
      return <div>菜单项错误</div>;
    }
  } catch (error) {
    console.warn('Menu item render error:', error);
    return <div>菜单项错误</div>;
  }
}; 