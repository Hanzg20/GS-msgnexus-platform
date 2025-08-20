import winston from 'winston';

// 日志级别配置
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 根据环境选择日志级别
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// 日志颜色配置
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// 日志格式配置
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// 日志传输配置
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// 创建 logger 实例
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// 开发环境下的额外配置
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// 导出便捷方法
export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: any) => {
  logger.error(message, error);
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

export const logHttp = (message: string, meta?: any) => {
  logger.http(message, meta);
};

// 请求日志中间件（增强：记录 IP、用户、租户、UA）
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '-';
    const user = req.user || {};
    const userId = user.id || '-';
    const userEmail = user.email || '-';
    const tenantId = user.tenantId || '-';
    const ua = req.get?.('User-Agent') || '-';

    const line = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms ip=${ip} user=${userId}/${userEmail} tenant=${tenantId} ua="${ua}"`;

    if (res.statusCode >= 400) {
      logger.warn(line);
    } else {
      logger.info(line);
    }
  });

  next();
};

// 错误日志中间件
export const errorLogger = (error: any, req: any, res: any, next: any) => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  next(error);
};

export default logger; 