#!/usr/bin/env ts-node

/**
 * 🏠 Jinbean 聊天功能数据迁移脚本（简化版）
 * 只包含聊天功能相关的示例数据
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JinbeanTenantData {
  name: string;
  subdomain: string;
  planType: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
}

interface JinbeanUserData {
  externalUserId: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  userType: 'customer' | 'provider' | 'admin';
  isActive: boolean;
}

interface JinbeanConversationData {
  name: string;
  type: 'direct' | 'group';
  isActive: boolean;
}

// Jinbean示例数据
const jinbeanTenants: JinbeanTenantData[] = [
  {
    name: 'Jinbean便民服务',
    subdomain: 'jinbean',
    planType: 'enterprise',
    status: 'active'
  }
];

const jinbeanUsers: JinbeanUserData[] = [
  // 客户用户
  {
    externalUserId: 'customer001',
    email: 'customer1@jinbean.com',
    displayName: '张小明',
    phoneNumber: '13800138001',
    userType: 'customer',
    isActive: true
  },
  {
    externalUserId: 'customer002',
    email: 'customer2@jinbean.com',
    displayName: '李小红',
    phoneNumber: '13800138002',
    userType: 'customer',
    isActive: true
  },
  {
    externalUserId: 'customer003',
    email: 'customer3@jinbean.com',
    displayName: '王小华',
    phoneNumber: '13800138003',
    userType: 'customer',
    isActive: true
  },
  
  // 服务提供者
  {
    externalUserId: 'provider001',
    email: 'provider1@jinbean.com',
    displayName: '陈师傅',
    phoneNumber: '13900139001',
    userType: 'provider',
    isActive: true
  },
  {
    externalUserId: 'provider002',
    email: 'provider2@jinbean.com',
    displayName: '刘阿姨',
    phoneNumber: '13900139002',
    userType: 'provider',
    isActive: true
  },
  {
    externalUserId: 'provider003',
    email: 'provider3@jinbean.com',
    displayName: '赵师傅',
    phoneNumber: '13900139003',
    userType: 'provider',
    isActive: true
  },
  
  // 管理员
  {
    externalUserId: 'admin001',
    email: 'admin@jinbean.com',
    displayName: '系统管理员',
    phoneNumber: '13700137001',
    userType: 'admin',
    isActive: true
  }
];

const jinbeanConversations: JinbeanConversationData[] = [
  {
    name: '客服咨询',
    type: 'direct',
    isActive: true
  },
  {
    name: '技术支持',
    type: 'direct',
    isActive: true
  },
  {
    name: '用户反馈',
    type: 'direct',
    isActive: true
  }
];

async function migrateJinbeanSimpleData() {
  try {
    console.log('🏠 开始Jinbean聊天功能数据迁移...');

    // 1. 创建Jinbean租户
    console.log('📝 创建Jinbean租户...');
    const tenants = [];
    for (const tenantData of jinbeanTenants) {
      const tenant = await prisma.tenant.create({
        data: {
          ...tenantData,
          apiKey: `jinbean-api-key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          settings: {
            appName: 'Jinbean便民服务',
            maxMessageLength: 1000,
            fileUploadSize: 10485760,
            enableVoiceMessage: true,
            enableFileMessage: true
          }
        }
      });
      tenants.push(tenant);
      console.log(`✅ 租户创建成功: ${tenant.name} (${tenant.id})`);
    }

    // 2. 创建Jinbean用户
    console.log('👥 创建Jinbean用户...');
    const users = [];
    for (const tenant of tenants) {
      for (const userData of jinbeanUsers) {
        const user = await prisma.user.create({
          data: {
            ...userData,
            tenantId: tenant.id,
            preferences: {
              notifications: true,
              language: 'zh-CN',
              timezone: 'Asia/Shanghai',
              theme: 'light'
            }
          }
        });
        users.push(user);
        console.log(`✅ 用户创建成功: ${user.displayName} (${user.userType})`);
      }
    }

    // 3. 创建对话
    console.log('💬 创建对话...');
    const conversations = [];
    const customers = users.filter(user => user.userType === 'customer');
    const providers = users.filter(user => user.userType === 'provider');
    
    for (let i = 0; i < jinbeanConversations.length; i++) {
      const conversationData = jinbeanConversations[i];
      const customer = customers[i % customers.length];
      const provider = providers[i % providers.length];
      
      const conversation = await prisma.conversation.create({
        data: {
          ...conversationData,
          tenantId: tenants[0].id,
          participants: {
            create: [
              {
                userId: customer.id,
                role: 'customer'
              },
              {
                userId: provider.id,
                role: 'provider'
              }
            ]
          }
        }
      });
      conversations.push(conversation);
      console.log(`✅ 对话创建成功: ${conversation.name} (${conversation.type})`);
    }

    // 4. 创建示例消息
    console.log('💭 创建示例消息...');
    const sampleMessages = [
      {
        content: { text: '您好，我想咨询一下服务' },
        messageType: 'text'
      },
      {
        content: { text: '您好！很高兴为您服务，请问您需要什么帮助？' },
        messageType: 'text'
      },
      {
        content: { text: '我想了解一下你们的服务范围' },
        messageType: 'text'
      },
      {
        content: { text: '我们提供家政、维修、配送等多种便民服务，您具体需要哪种服务呢？' },
        messageType: 'text'
      },
      {
        content: { text: '好的，谢谢您的介绍' },
        messageType: 'text'
      }
    ];

    for (const conversation of conversations) {
      const participants = await prisma.conversationParticipant.findMany({
        where: { conversationId: conversation.id },
        include: { user: true }
      });

      for (let i = 0; i < sampleMessages.length; i++) {
        const messageData = sampleMessages[i];
        const sender = participants[i % participants.length].user;
        
        const message = await prisma.message.create({
          data: {
            ...messageData,
            tenantId: tenants[0].id,
            conversationId: conversation.id,
            senderId: sender.id,
            status: 'sent'
          }
        });
        console.log(`✅ 消息创建成功: ${message.content.text?.substring(0, 20)}...`);
      }
    }

    // 5. 创建系统配置
    console.log('⚙️ 创建系统配置...');
    const systemConfigs = [
      { key: 'jinbean.app_name', value: 'Jinbean便民服务' },
      { key: 'jinbean.max_message_length', value: 1000 },
      { key: 'jinbean.file_upload_size', value: 10485760 },
      { key: 'jinbean.enable_voice_message', value: true },
      { key: 'jinbean.enable_file_message', value: true },
      { key: 'jinbean.currency', value: 'CNY' },
      { key: 'jinbean.timezone', value: 'Asia/Shanghai' }
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

    console.log('');
    console.log('🎉 Jinbean聊天功能数据迁移完成！');
    console.log('');
    console.log('📊 迁移统计：');
    console.log(`- 租户: ${tenants.length}`);
    console.log(`- 用户: ${users.length} (客户: ${users.filter(u => u.userType === 'customer').length}, 服务商: ${users.filter(u => u.userType === 'provider').length})`);
    console.log(`- 对话: ${conversations.length}`);
    console.log(`- 消息: ${sampleMessages.length * conversations.length}`);
    console.log(`- 系统配置: ${systemConfigs.length}`);
    console.log('');
    console.log('🚀 Jinbean聊天功能已准备就绪！');

  } catch (error) {
    console.error('❌ Jinbean聊天功能数据迁移失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 运行迁移
if (require.main === module) {
  migrateJinbeanSimpleData()
    .then(() => {
      console.log('✅ Jinbean聊天功能迁移脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Jinbean聊天功能迁移脚本执行失败:', error);
      process.exit(1);
    });
}

export { migrateJinbeanSimpleData }; 