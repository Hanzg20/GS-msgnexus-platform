#!/usr/bin/env ts-node

/**
 * 🗄️ MsgNexus 数据迁移脚本
 * 用于初始化数据库和插入示例数据
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TenantData {
  name: string;
  subdomain: string;
  planType: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
}

interface UserData {
  externalUserId: string;
  email: string;
  displayName: string;
  isActive: boolean;
}

interface ConversationData {
  name: string;
  type: 'direct' | 'group' | 'channel';
  isActive: boolean;
}

interface MessageData {
  messageType: 'text' | 'image' | 'file' | 'system';
  content: any;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

// 示例数据
const sampleTenants: TenantData[] = [
  {
    name: 'Acme Corporation',
    subdomain: 'acme',
    planType: 'enterprise',
    status: 'active'
  },
  {
    name: 'TechStart Inc',
    subdomain: 'techstart',
    planType: 'professional',
    status: 'active'
  },
  {
    name: 'InnovateLab',
    subdomain: 'innovatelab',
    planType: 'basic',
    status: 'suspended'
  }
];

const sampleUsers: UserData[] = [
  {
    externalUserId: 'user1',
    email: 'user1@example.com',
    displayName: 'John Doe',
    isActive: true
  },
  {
    externalUserId: 'user2',
    email: 'user2@example.com',
    displayName: 'Jane Smith',
    isActive: true
  },
  {
    externalUserId: 'user3',
    email: 'user3@example.com',
    displayName: 'Bob Johnson',
    isActive: true
  }
];

const sampleConversations: ConversationData[] = [
  {
    name: 'General Chat',
    type: 'channel',
    isActive: true
  },
  {
    name: 'Support',
    type: 'channel',
    isActive: true
  },
  {
    name: 'Team Chat',
    type: 'group',
    isActive: true
  }
];

const sampleMessages: MessageData[] = [
  {
    messageType: 'text',
    content: { text: 'Hello everyone! Welcome to our platform.' },
    status: 'sent'
  },
  {
    messageType: 'text',
    content: { text: 'This is a test message for the system.' },
    status: 'sent'
  },
  {
    messageType: 'system',
    content: { type: 'notification', message: 'System maintenance scheduled for tonight.' },
    status: 'sent'
  }
];

async function migrateData() {
  try {
    console.log('🚀 开始数据迁移...');

    // 1. 创建租户
    console.log('📝 创建租户...');
    const tenants = [];
    for (const tenantData of sampleTenants) {
      const tenant = await prisma.tenant.create({
        data: {
          ...tenantData,
          apiKey: `api-key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          settings: {}
        }
      });
      tenants.push(tenant);
      console.log(`✅ 租户创建成功: ${tenant.name} (${tenant.id})`);
    }

    // 2. 为每个租户创建用户
    console.log('👥 创建用户...');
    const users = [];
    for (const tenant of tenants) {
      for (const userData of sampleUsers) {
        const user = await prisma.user.create({
          data: {
            ...userData,
            tenantId: tenant.id
          }
        });
        users.push(user);
        console.log(`✅ 用户创建成功: ${user.displayName} (${user.id})`);
      }
    }

    // 3. 为每个租户创建对话
    console.log('💬 创建对话...');
    const conversations = [];
    for (const tenant of tenants) {
      for (const conversationData of sampleConversations) {
        const conversation = await prisma.conversation.create({
          data: {
            ...conversationData,
            tenantId: tenant.id
          }
        });
        conversations.push(conversation);
        console.log(`✅ 对话创建成功: ${conversation.name} (${conversation.id})`);
      }
    }

    // 4. 为每个对话添加参与者
    console.log('👤 添加对话参与者...');
    for (const conversation of conversations) {
      const tenantUsers = users.filter(user => user.tenantId === conversation.tenantId);
      for (const user of tenantUsers.slice(0, 2)) { // 只添加前两个用户
        await prisma.conversationParticipant.create({
          data: {
            conversationId: conversation.id,
            userId: user.id,
            role: 'member'
          }
        });
        console.log(`✅ 参与者添加成功: ${user.displayName} -> ${conversation.name}`);
      }
    }

    // 5. 为每个对话创建消息
    console.log('💭 创建消息...');
    for (const conversation of conversations) {
      const tenantUsers = users.filter(user => user.tenantId === conversation.tenantId);
      if (tenantUsers.length > 0) {
        for (const messageData of sampleMessages) {
          const message = await prisma.message.create({
            data: {
              ...messageData,
              tenantId: conversation.tenantId,
              conversationId: conversation.id,
              senderId: tenantUsers[0].id
            }
          });
          console.log(`✅ 消息创建成功: ${message.messageType} (${message.id})`);
        }
      }
    }

    // 6. 创建系统配置
    console.log('⚙️ 创建系统配置...');
    const systemConfigs = [
      { key: 'system.version', value: '1.0.0' },
      { key: 'system.maintenance', value: false },
      { key: 'system.features', value: ['real_time_messaging', 'file_sharing', 'analytics'] },
      { key: 'system.max_file_size', value: 10485760 },
      { key: 'system.allowed_file_types', value: ['jpg', 'png', 'pdf', 'doc', 'txt'] }
    ];

    for (const config of systemConfigs) {
      await prisma.systemConfig.create({
        data: {
          key: config.key,
          value: config.value
        }
      });
      console.log(`✅ 系统配置创建成功: ${config.key}`);
    }

    // 7. 创建 Webhook 配置
    console.log('🔗 创建 Webhook 配置...');
    for (const tenant of tenants) {
      const webhook = await prisma.webhook.create({
        data: {
          tenantId: tenant.id,
          name: 'Default Webhook',
          url: `https://${tenant.subdomain}.example.com/webhook`,
          events: ['message.created', 'user.joined', 'conversation.created'],
          secret: `webhook-secret-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          isActive: true
        }
      });
      console.log(`✅ Webhook 创建成功: ${webhook.name} (${webhook.id})`);
    }

    console.log('');
    console.log('🎉 数据迁移完成！');
    console.log('');
    console.log('📊 迁移统计：');
    console.log(`- 租户: ${tenants.length}`);
    console.log(`- 用户: ${users.length}`);
    console.log(`- 对话: ${conversations.length}`);
    console.log(`- 消息: ${sampleMessages.length * conversations.length}`);
    console.log(`- 系统配置: ${systemConfigs.length}`);
    console.log('');

  } catch (error) {
    console.error('❌ 数据迁移失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 运行迁移
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✅ 迁移脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 迁移脚本执行失败:', error);
      process.exit(1);
    });
}

export { migrateData }; 