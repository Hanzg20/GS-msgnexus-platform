import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// 自定义错误类
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 业务错误类
export class BusinessError extends AppError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode, true);
  }
}

// 验证错误类
export class ValidationError extends AppError {
  public errors: any[];

  constructor(message: string, errors: any[] = []) {
    super(message, 400, true);
    this.errors = errors;
  }
}

// 认证错误类
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true);
  }
}

// 权限错误类
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, true);
  }
}

// 资源未找到错误类
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, true);
  }
}

// 统一错误处理中间件
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] = [];

  // 处理不同类型的错误
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    
    if (error instanceof ValidationError) {
      errors = error.errors;
    }
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = [error.message];
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    if ((error as any).code === 11000) {
      statusCode = 409;
      message = 'Duplicate field value';
    }
  }

  // 记录错误日志
  if (statusCode >= 500) {
    logger.error(`Server Error: ${error.message}`, {
      error: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  } else {
    logger.warn(`Client Error: ${error.message}`, {
      url: req.url,
      method: req.method,
      ip: req.ip,
      statusCode
    });
  }

  // 开发环境返回详细错误信息
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse: any = {
    error: true,
    message,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  };

  if (errors.length > 0) {
    errorResponse.errors = errors;
  }

  if (isDevelopment) {
    errorResponse.stack = error.stack;
    errorResponse.name = error.name;
  }

  // 发送错误响应
  res.status(statusCode).json(errorResponse);
};

// 异步错误处理包装器
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 错误处理
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: true,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};

// 请求超时处理
export const timeoutHandler = (timeout: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      res.status(408).json({
        error: true,
        message: 'Request timeout',
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method
      });
    }, timeout);

    res.on('finish', () => {
      clearTimeout(timer);
    });

    next();
  };
};

// 全局未捕获异常处理
export const setupGlobalErrorHandlers = (): void => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}; 