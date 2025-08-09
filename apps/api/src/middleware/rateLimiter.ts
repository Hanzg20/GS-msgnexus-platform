import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'redis';

// Memory-based rate limiter for development
const memoryRateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

// Redis-based rate limiter for production
let redisRateLimiter: RateLimiterRedis | null = null;

if (process.env.REDIS_URL) {
  const redisClient = Redis.createClient({
    url: process.env.REDIS_URL
  });

  redisRateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    points: 100,
    duration: 60,
  });
}

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limiter = redisRateLimiter || memoryRateLimiter;
    await limiter.consume(req.ip);
    next();
  } catch (error: any) {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
        retryAfter: error.msBeforeNext / 1000
      }
    });
  }
};

export const userRateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || req.ip;
    const limiter = redisRateLimiter || memoryRateLimiter;
    await limiter.consume(`user-${userId}`);
    next();
  } catch (error: any) {
    res.status(429).json({
      success: false,
      error: {
        code: 'USER_RATE_LIMIT_EXCEEDED',
        message: 'User rate limit exceeded',
        retryAfter: error.msBeforeNext / 1000
      }
    });
  }
};

export const apiRateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string || req.ip;
    const limiter = redisRateLimiter || memoryRateLimiter;
    await limiter.consume(`api-${apiKey}`);
    next();
  } catch (error: any) {
    res.status(429).json({
      success: false,
      error: {
        code: 'API_RATE_LIMIT_EXCEEDED',
        message: 'API rate limit exceeded',
        retryAfter: error.msBeforeNext / 1000
      }
    });
  }
};

export const loginRateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limiter = new RateLimiterMemory({
      points: 5, // 5 login attempts
      duration: 300, // Per 5 minutes
    });
    await limiter.consume(req.ip);
    next();
  } catch (error: any) {
    res.status(429).json({
      success: false,
      error: {
        code: 'LOGIN_RATE_LIMIT_EXCEEDED',
        message: 'Too many login attempts, please try again later',
        retryAfter: error.msBeforeNext / 1000
      }
    });
  }
};

export const messageRateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || req.ip;
    const limiter = new RateLimiterMemory({
      points: 50, // 50 messages
      duration: 60, // Per minute
    });
    await limiter.consume(`message-${userId}`);
    next();
  } catch (error: any) {
    res.status(429).json({
      success: false,
      error: {
        code: 'MESSAGE_RATE_LIMIT_EXCEEDED',
        message: 'Message rate limit exceeded',
        retryAfter: error.msBeforeNext / 1000
      }
    });
  }
}; 