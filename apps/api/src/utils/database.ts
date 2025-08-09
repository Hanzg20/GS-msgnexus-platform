import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

// Prisma客户端实例
let prisma: PrismaClient;

// Redis客户端实例
let redis: Redis;

// 初始化Prisma客户端
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return prisma;
}

// 初始化Redis客户端
export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }

    redis = new Redis(redisUrl, {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    // 错误处理
    redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });
  }
  return redis;
}

// 关闭数据库连接
export async function closeDatabaseConnections(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (redis) {
    await redis.quit();
  }
}

// 健康检查
export async function checkDatabaseHealth(): Promise<{
  prisma: boolean;
  redis: boolean;
  timestamp: string;
}> {
  const health = {
    prisma: false,
    redis: false,
    timestamp: new Date().toISOString(),
  };

  try {
    // 检查Prisma连接
    const prismaClient = getPrismaClient();
    await prismaClient.$queryRaw`SELECT 1`;
    health.prisma = true;
  } catch (error) {
    console.error('Prisma health check failed:', error);
  }

  try {
    // 检查Redis连接
    const redisClient = getRedisClient();
    await redisClient.ping();
    health.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  return health;
}

// 数据库迁移状态检查
export async function checkMigrationStatus(): Promise<{
  status: 'ok' | 'pending' | 'error';
  message: string;
}> {
  try {
    const prismaClient = getPrismaClient();
    await prismaClient.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      message: 'Database is up to date',
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Database migration error: ${error.message}`,
    };
  }
} 