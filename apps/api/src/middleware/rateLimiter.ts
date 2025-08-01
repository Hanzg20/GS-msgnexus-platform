import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import { logger } from '../utils/logger';

// Redis 客户端
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// 速率限制配置
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15分钟
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'); // 100次请求

// 创建速率限制器
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate_limit',
  points: RATE_LIMIT_MAX_REQUESTS,
  duration: RATE_LIMIT_WINDOW_MS / 1000, // 转换为秒
  blockDuration: 60 * 15, // 15分钟封禁
});

// 获取客户端 IP
const getClientIP = (req: Request): string => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         (req.connection as any).socket?.remoteAddress || 
         'unknown';
};

// 通用速率限制中间件
export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientIP = getClientIP(req);
    const key = `ip:${clientIP}`;

    await rateLimiter.consume(key);
    next();
  } catch (error: any) {
    if (error instanceof Error) {
      logger.warn(`Rate limit exceeded for IP: ${getClientIP(req)}`);
      
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(error.msBeforeNext / 1000),
        timestamp: new Date().toISOString()
      });
    } else {
      next();
    }
  }
};

// 用户特定速率限制
const userRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'user_rate_limit',
  points: 50, // 50次请求
  duration: 60 * 15, // 15分钟
  blockDuration: 60 * 30, // 30分钟封禁
});

// 用户速率限制中间件
export const userRateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 从认证中间件获取用户ID
    const userId = (req as any).user?.id;
    
    if (!userId) {
      next();
      return;
    }

    const key = `user:${userId}`;
    await userRateLimiter.consume(key);
    next();
  } catch (error: any) {
    if (error instanceof Error) {
      const userId = (req as any).user?.id;
      logger.warn(`User rate limit exceeded for user: ${userId}`);
      
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'User rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(error.msBeforeNext / 1000),
        timestamp: new Date().toISOString()
      });
    } else {
      next();
    }
  }
};

// API 端点特定速率限制
const apiRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'api_rate_limit',
  points: 200, // 200次请求
  duration: 60 * 15, // 15分钟
  blockDuration: 60 * 60, // 1小时封禁
});

// API 速率限制中间件
export const apiRateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientIP = getClientIP(req);
    const key = `api:${clientIP}:${req.path}`;

    await apiRateLimiter.consume(key);
    next();
  } catch (error: any) {
    if (error instanceof Error) {
      logger.warn(`API rate limit exceeded for IP: ${getClientIP(req)} on path: ${req.path}`);
      
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'API rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(error.msBeforeNext / 1000),
        timestamp: new Date().toISOString()
      });
    } else {
      next();
    }
  }
};

// 登录速率限制（防止暴力破解）
const loginRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_rate_limit',
  points: 5, // 5次登录尝试
  duration: 60 * 15, // 15分钟
  blockDuration: 60 * 60, // 1小时封禁
});

// 登录速率限制中间件
export const loginRateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clientIP = getClientIP(req);
    const key = `login:${clientIP}`;

    await loginRateLimiter.consume(key);
    next();
  } catch (error: any) {
    if (error instanceof Error) {
      logger.warn(`Login rate limit exceeded for IP: ${getClientIP(req)}`);
      
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Too many login attempts. Please try again later.',
        retryAfter: Math.ceil(error.msBeforeNext / 1000),
        timestamp: new Date().toISOString()
      });
    } else {
      next();
    }
  }
};

// 消息发送速率限制
const messageRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'message_rate_limit',
  points: 100, // 100条消息
  duration: 60 * 5, // 5分钟
  blockDuration: 60 * 10, // 10分钟封禁
});

// 消息发送速率限制中间件
export const messageRateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      next();
      return;
    }

    const key = `message:${userId}`;
    await messageRateLimiter.consume(key);
    next();
  } catch (error: any) {
    if (error instanceof Error) {
      const userId = (req as any).user?.id;
      logger.warn(`Message rate limit exceeded for user: ${userId}`);
      
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Message rate limit exceeded. Please slow down.',
        retryAfter: Math.ceil(error.msBeforeNext / 1000),
        timestamp: new Date().toISOString()
      });
    } else {
      next();
    }
  }
};

// 速率限制状态检查
export const getRateLimitStatus = async (key: string): Promise<any> => {
  try {
    const res = await rateLimiter.get(key);
    return {
      remaining: res.remainingPoints,
      resetTime: res.msBeforeNext,
      isBlocked: res.isBlocked
    };
  } catch (error) {
    return null;
  }
};

// 重置速率限制
export const resetRateLimit = async (key: string): Promise<void> => {
  try {
    await rateLimiter.delete(key);
  } catch (error) {
    logger.error(`Failed to reset rate limit for key: ${key}`, error);
  }
}; 