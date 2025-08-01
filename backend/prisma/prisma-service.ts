// Prisma Service for Feathers.js
// 示例实现 - 展示如何集成 Prisma 与 Feathers.js

import { PrismaClient } from '../generated/prisma'
import type { Application } from '../feathers-chat-ts/src/declarations'

// 全局 Prisma 客户端实例
const prisma = new PrismaClient()

// 确保应用关闭时断开数据库连接
export const setupPrisma = (app: Application) => {
  app.on('close', async () => {
    await prisma.$disconnect()
  })
}

// 示例: 租户服务
export class TenantService {
  async find(params: any) {
    const { query = {} } = params
    
    return await prisma.tenant.findMany({
      where: query,
      include: {
        _count: {
          select: {
            users: true,
            messages: true,
            conversations: true
          }
        }
      }
    })
  }

  async get(id: string, params: any) {
    return await prisma.tenant.findUnique({
      where: { id },
      include: {
        users: true,
        conversations: true,
        webhooks: true
      }
    })
  }

  async create(data: any, params: any) {
    return await prisma.tenant.create({
      data: {
        name: data.name,
        subdomain: data.subdomain,
        apiKey: data.apiKey || generateApiKey(),
        planType: data.planType || 'basic',
        settings: data.settings || {},
        status: data.status || 'active'
      }
    })
  }

  async patch(id: string, data: any, params: any) {
    return await prisma.tenant.update({
      where: { id },
      data
    })
  }

  async remove(id: string, params: any) {
    return await prisma.tenant.delete({
      where: { id }
    })
  }
}

// 示例: 用户服务
export class UserService {
  async find(params: any) {
    const { query = {}, user } = params
    
    // 多租户过滤
    if (user?.tenantId) {
      query.tenantId = user.tenantId
    }
    
    return await prisma.user.findMany({
      where: query,
      include: {
        tenant: true,
        messages: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  }

  async get(id: string, params: any) {
    const { user } = params
    
    return await prisma.user.findFirst({
      where: {
        id,
        tenantId: user?.tenantId
      },
      include: {
        tenant: true,
        messages: true,
        conversations: {
          include: {
            conversation: true
          }
        }
      }
    })
  }

  async create(data: any, params: any) {
    const { user } = params
    
    return await prisma.user.create({
      data: {
        ...data,
        tenantId: user?.tenantId
      },
      include: {
        tenant: true
      }
    })
  }
}

// 示例: 消息服务
export class MessageService {
  async find(params: any) {
    const { query = {}, user } = params
    
    // 多租户过滤
    if (user?.tenantId) {
      query.tenantId = user.tenantId
    }
    
    return await prisma.message.findMany({
      where: query,
      include: {
        sender: true,
        conversation: true,
        replyTo: true,
        replies: {
          take: 5,
          include: {
            sender: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async get(id: string, params: any) {
    const { user } = params
    
    return await prisma.message.findFirst({
      where: {
        id,
        tenantId: user?.tenantId
      },
      include: {
        sender: true,
        conversation: true,
        replyTo: true,
        replies: {
          include: {
            sender: true
          }
        }
      }
    })
  }

  async create(data: any, params: any) {
    const { user } = params
    
    const message = await prisma.message.create({
      data: {
        ...data,
        tenantId: user?.tenantId,
        senderId: user?.id
      },
      include: {
        sender: true,
        conversation: true
      }
    })

    // 触发 Webhook 事件
    await this.triggerWebhooks('message.created', message, user?.tenantId)
    
    return message
  }

  private async triggerWebhooks(event: string, data: any, tenantId: string) {
    const webhooks = await prisma.webhook.findMany({
      where: {
        tenantId,
        isActive: true,
        events: {
          has: event
        }
      }
    })

    // 异步发送 Webhook 请求
    for (const webhook of webhooks) {
      // 这里应该实现实际的 Webhook 发送逻辑
      console.log(`Triggering webhook ${webhook.url} for event ${event}`)
    }
  }
}

// 工具函数
function generateApiKey(): string {
  return 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// 导出 Prisma 客户端供其他服务使用
export { prisma } 