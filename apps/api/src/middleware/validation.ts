import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from './errorHandler';
import { logger } from '../utils/logger';

// 通用验证中间件
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      logger.warn(`Validation failed for ${req.method} ${req.path}`, {
        errors,
        body: req.body
      });

      throw new ValidationError('Validation failed', errors);
    }

    // 用验证后的数据替换请求体
    req.body = value;
    next();
  };
};

// 查询参数验证
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      logger.warn(`Query validation failed for ${req.method} ${req.path}`, {
        errors,
        query: req.query
      });

      throw new ValidationError('Query validation failed', errors);
    }

    req.query = value;
    next();
  };
};

// 路径参数验证
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      logger.warn(`Params validation failed for ${req.method} ${req.path}`, {
        errors,
        params: req.params
      });

      throw new ValidationError('Params validation failed', errors);
    }

    req.params = value;
    next();
  };
};

// 常用验证模式
export const commonSchemas = {
  // ID 验证
  id: Joi.string().uuid().required(),
  
  // 分页验证
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    sortBy: Joi.string().default('createdAt')
  }),

  // 搜索验证
  search: Joi.object({
    q: Joi.string().min(1).max(100),
    fields: Joi.array().items(Joi.string()),
    exact: Joi.boolean().default(false)
  }),

  // 日期范围验证
  dateRange: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    timezone: Joi.string().default('UTC')
  }),

  // 文件上传验证
  fileUpload: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().max(10 * 1024 * 1024), // 10MB
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string()
  })
};

// 租户相关验证模式
export const tenantSchemas = {
  // 创建租户
  createTenant: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    subdomain: Joi.string().min(2).max(50).pattern(/^[a-z0-9-]+$/).required(),
    planType: Joi.string().valid('basic', 'pro', 'enterprise').default('basic'),
    settings: Joi.object({
      timezone: Joi.string().default('UTC'),
      language: Joi.string().default('en'),
      features: Joi.object({
        ai: Joi.boolean().default(false),
        analytics: Joi.boolean().default(false),
        customBranding: Joi.boolean().default(false)
      })
    }).default({})
  }),

  // 更新租户
  updateTenant: Joi.object({
    name: Joi.string().min(2).max(100),
    planType: Joi.string().valid('basic', 'pro', 'enterprise'),
    status: Joi.string().valid('active', 'suspended', 'cancelled'),
    settings: Joi.object({
      timezone: Joi.string(),
      language: Joi.string(),
      features: Joi.object({
        ai: Joi.boolean(),
        analytics: Joi.boolean(),
        customBranding: Joi.boolean()
      })
    })
  })
};

// 用户相关验证模式
export const userSchemas = {
  // 创建用户
  createUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    role: Joi.string().valid('admin', 'user', 'moderator').default('user'),
    externalUserId: Joi.string().max(100),
    metadata: Joi.object().default({})
  }),

  // 更新用户
  updateUser: Joi.object({
    firstName: Joi.string().min(1).max(50),
    lastName: Joi.string().min(1).max(50),
    role: Joi.string().valid('admin', 'user', 'moderator'),
    status: Joi.string().valid('active', 'inactive', 'suspended'),
    metadata: Joi.object()
  }),

  // 登录
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// 消息相关验证模式
export const messageSchemas = {
  // 创建消息
  createMessage: Joi.object({
    conversationId: Joi.string().uuid().required(),
    content: Joi.string().min(1).max(10000).required(),
    messageType: Joi.string().valid('text', 'image', 'file', 'system').default('text'),
    replyToId: Joi.string().uuid(),
    metadata: Joi.object({
      attachments: Joi.array().items(Joi.object({
        filename: Joi.string().required(),
        url: Joi.string().uri().required(),
        size: Joi.number().positive(),
        mimeType: Joi.string()
      })),
      mentions: Joi.array().items(Joi.string().uuid()),
      tags: Joi.array().items(Joi.string())
    }).default({})
  }),

  // 更新消息
  updateMessage: Joi.object({
    content: Joi.string().min(1).max(10000),
    metadata: Joi.object()
  })
};

// 系统相关验证模式
export const systemSchemas = {
  // 系统配置
  systemConfig: Joi.object({
    key: Joi.string().required(),
    value: Joi.any().required(),
    description: Joi.string().max(500),
    category: Joi.string().valid('general', 'security', 'performance', 'ai').default('general')
  }),

  // AI 配置
  aiConfig: Joi.object({
    enabled: Joi.boolean().default(false),
    model: Joi.string().valid('gpt-3.5-turbo', 'gpt-4', 'claude-3').default('gpt-3.5-turbo'),
    apiKey: Joi.string().min(1),
    maxTokens: Joi.number().integer().min(1).max(4000).default(1000),
    temperature: Joi.number().min(0).max(2).default(0.7),
    features: Joi.object({
      chat: Joi.boolean().default(true),
      analysis: Joi.boolean().default(true),
      suggestions: Joi.boolean().default(true)
    }).default({})
  })
};

// 自定义验证器
export const customValidators = {
  // 验证 UUID
  uuid: (value: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },

  // 验证邮箱
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  // 验证密码强度
  passwordStrength: (value: string): boolean => {
    // 至少8位，包含大小写字母、数字和特殊字符
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value);
  },

  // 验证子域名
  subdomain: (value: string): boolean => {
    const subdomainRegex = /^[a-z0-9-]+$/;
    return subdomainRegex.test(value) && value.length >= 2 && value.length <= 50;
  }
};

// 验证中间件工厂
export const createValidationMiddleware = (schemas: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        validate(schemas.body)(req, res, () => {});
      }
      if (schemas.query) {
        validateQuery(schemas.query)(req, res, () => {});
      }
      if (schemas.params) {
        validateParams(schemas.params)(req, res, () => {});
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}; 