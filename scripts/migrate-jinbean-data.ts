#!/usr/bin/env ts-node

/**
 * 🏠 Jinbean 数据迁移脚本
 * 用于初始化Jinbean便民应用的示例数据
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
  location: any;
  isActive: boolean;
}

interface JinbeanServiceData {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  location: any;
  images: string[];
  tags: string[];
}

interface JinbeanConversationData {
  name: string;
  type: 'service' | 'support' | 'general';
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
    location: { lat: 39.9042, lng: 116.4074, address: '北京市朝阳区' },
    isActive: true
  },
  {
    externalUserId: 'customer002',
    email: 'customer2@jinbean.com',
    displayName: '李小红',
    phoneNumber: '13800138002',
    userType: 'customer',
    location: { lat: 39.9042, lng: 116.4074, address: '北京市海淀区' },
    isActive: true
  },
  {
    externalUserId: 'customer003',
    email: 'customer3@jinbean.com',
    displayName: '王小华',
    phoneNumber: '13800138003',
    userType: 'customer',
    location: { lat: 39.9042, lng: 116.4074, address: '北京市西城区' },
    isActive: true
  },
  
  // 服务提供者
  {
    externalUserId: 'provider001',
    email: 'provider1@jinbean.com',
    displayName: '陈师傅',
    phoneNumber: '13900139001',
    userType: 'provider',
    location: { lat: 39.9042, lng: 116.4074, address: '北京市朝阳区' },
    isActive: true
  },
  {
    externalUserId: 'provider002',
    email: 'provider2@jinbean.com',
    displayName: '刘阿姨',
    phoneNumber: '13900139002',
    userType: 'provider',
    location: { lat: 39.9042, lng: 116.4074, address: '北京市海淀区' },
    isActive: true
  },
  {
    externalUserId: 'provider003',
    email: 'provider3@jinbean.com',
    displayName: '赵师傅',
    phoneNumber: '13900139003',
    userType: 'provider',
    location: { lat: 39.9042, lng: 116.4074, address: '北京市西城区' },
    isActive: true
  },
  
  // 管理员
  {
    externalUserId: 'admin001',
    email: 'admin@jinbean.com',
    displayName: '系统管理员',
    phoneNumber: '13700137001',
    userType: 'admin',
    location: { lat: 39.9042, lng: 116.4074, address: '北京市' },
    isActive: true
  }
];

const jinbeanServices: JinbeanServiceData[] = [
  {
    name: '专业家政保洁',
    description: '提供专业的家庭保洁服务，包括日常清洁、深度清洁、玻璃清洗等',
    category: '家政',
    subcategory: '保洁',
    price: 80.00,
    location: { lat: 39.9042, lng: 116.4074, address: '北京市朝阳区', radius: 10 },
    images: ['https://example.com/cleaning1.jpg', 'https://example.com/cleaning2.jpg'],
    tags: ['保洁', '家政', '清洁', '专业']
  },
  {
    name: '家电维修服务',
    description: '专业维修各种家电，包括冰箱、洗衣机、空调、电视等',
    category: '维修',
    subcategory: '家电维修',
    price: 120.00,
    location: { lat: 39.9042, lng: 116.4074, address: '北京市海淀区', radius: 15 },
    images: ['https://example.com/repair1.jpg', 'https://example.com/repair2.jpg'],
    tags: ['维修', '家电', '专业', '快速']
  },
  {
    name: '同城快递配送',
    description: '提供同城快递配送服务，快速安全，价格实惠',
    category: '配送',
    subcategory: '快递配送',
    price: 15.00,
    location: { lat: 39.9042, lng: 116.4074, address: '北京市西城区', radius: 20 },
    images: ['https://example.com/delivery1.jpg', 'https://example.com/delivery2.jpg'],
    tags: ['配送', '快递', '同城', '快速']
  },
  {
    name: '英语家教服务',
    description: '专业英语教师，提供一对一或小班教学服务',
    category: '教育',
    subcategory: '英语教学',
    price: 200.00,
    location: { lat: 39.9042, lng: 116.4074, address: '北京市朝阳区', radius: 8 },
    images: ['https://example.com/education1.jpg', 'https://example.com/education2.jpg'],
    tags: ['教育', '英语', '家教', '专业']
  },
  {
    name: '上门按摩服务',
    description: '专业按摩师提供上门按摩服务，缓解疲劳，促进健康',
    category: '美容',
    subcategory: '按摩',
    price: 150.00,
    location: { lat: 39.9042, lng: 116.4074, address: '北京市海淀区', radius: 12 },
    images: ['https://example.com/massage1.jpg', 'https://example.com/massage2.jpg'],
    tags: ['按摩', '美容', '健康', '专业']
  }
];

const jinbeanConversations: JinbeanConversationData[] = [
  {
    name: '家政服务咨询',
    type: 'service',
    isActive: true
  },
  {
    name: '家电维修咨询',
    type: 'service',
    isActive: true
  },
  {
    name: '配送服务咨询',
    type: 'service',
    isActive: true
  }
];

async function migrateJinbeanData() {
  try {
    console.log('🏠 开始Jinbean数据迁移...');

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
            defaultRadius: 10,
            maxMessageLength: 1000,
            fileUploadSize: 10485760,
            serviceCategories: ['家政', '维修', '配送', '教育', '医疗', '美容', '其他']
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
              timezone: 'Asia/Shanghai'
            }
          }
        });
        users.push(user);
        console.log(`✅ 用户创建成功: ${user.displayName} (${user.userType})`);
      }
    }

    // 3. 创建服务
    console.log('🛠️ 创建服务...');
    const services = [];
    const providers = users.filter(user => user.userType === 'provider');
    
    for (let i = 0; i < jinbeanServices.length; i++) {
      const serviceData = jinbeanServices[i];
      const provider = providers[i % providers.length];
      
      const service = await prisma.service.create({
        data: {
          ...serviceData,
          tenantId: tenants[0].id,
          providerId: provider.id,
          currency: 'CNY',
          status: 'active',
          rating: 4.5 + Math.random() * 0.5, // 4.5-5.0之间的随机评分
          reviewCount: Math.floor(Math.random() * 50) + 10 // 10-60之间的随机评价数
        }
      });
      services.push(service);
      console.log(`✅ 服务创建成功: ${service.name} (${service.category})`);
    }

    // 4. 创建对话
    console.log('💬 创建对话...');
    const conversations = [];
    const customers = users.filter(user => user.userType === 'customer');
    
    for (let i = 0; i < jinbeanConversations.length; i++) {
      const conversationData = jinbeanConversations[i];
      const customer = customers[i % customers.length];
      const provider = providers[i % providers.length];
      
      const conversation = await prisma.conversation.create({
        data: {
          ...conversationData,
          tenantId: tenants[0].id,
          metadata: {
            serviceId: services[i]?.id,
            category: services[i]?.category
          },
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

    // 5. 创建示例消息
    console.log('💭 创建示例消息...');
    const sampleMessages = [
      {
        content: { text: '您好，我想咨询一下家政保洁服务' },
        messageType: 'text'
      },
      {
        content: { text: '您好！很高兴为您服务，请问您需要什么类型的保洁服务？' },
        messageType: 'text'
      },
      {
        content: { text: '我需要日常清洁，大概100平米，请问价格是多少？' },
        messageType: 'text'
      },
      {
        content: { text: '日常清洁100平米的价格是80元，包括客厅、卧室、厨房、卫生间的清洁。您觉得可以吗？' },
        messageType: 'text'
      },
      {
        content: { text: '可以的，请问什么时候可以安排？' },
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

    // 6. 创建示例订单
    console.log('📋 创建示例订单...');
    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      const service = services[i];
      const customer = customers[i % customers.length];
      const provider = providers[i % providers.length];
      
      const order = await prisma.order.create({
        data: {
          tenantId: tenants[0].id,
          customerId: customer.id,
          providerId: provider.id,
          conversationId: conversation.id,
          serviceId: service?.id,
          orderNumber: `JB${Date.now()}${i}`,
          status: 'confirmed',
          serviceDetails: {
            serviceName: service?.name,
            category: service?.category,
            price: service?.price,
            scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 明天
          },
          totalAmount: service?.price || 100.00,
          currency: 'CNY',
          scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          customerAddress: customer.location,
          providerAddress: provider.location,
          notes: '请按时到达，谢谢！'
        }
      });
      console.log(`✅ 订单创建成功: ${order.orderNumber} (${order.status})`);
    }

    // 7. 创建系统配置
    console.log('⚙️ 创建系统配置...');
    const systemConfigs = [
      { key: 'jinbean.app_name', value: 'Jinbean便民服务' },
      { key: 'jinbean.default_radius', value: 10 },
      { key: 'jinbean.max_message_length', value: 1000 },
      { key: 'jinbean.file_upload_size', value: 10485760 },
      { key: 'jinbean.service_categories', value: ['家政', '维修', '配送', '教育', '医疗', '美容', '其他'] },
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
    console.log('🎉 Jinbean数据迁移完成！');
    console.log('');
    console.log('📊 迁移统计：');
    console.log(`- 租户: ${tenants.length}`);
    console.log(`- 用户: ${users.length} (客户: ${users.filter(u => u.userType === 'customer').length}, 服务商: ${users.filter(u => u.userType === 'provider').length})`);
    console.log(`- 服务: ${services.length}`);
    console.log(`- 对话: ${conversations.length}`);
    console.log(`- 消息: ${sampleMessages.length * conversations.length}`);
    console.log(`- 订单: ${conversations.length}`);
    console.log(`- 系统配置: ${systemConfigs.length}`);
    console.log('');
    console.log('🚀 Jinbean便民应用已准备就绪！');

  } catch (error) {
    console.error('❌ Jinbean数据迁移失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 运行迁移
if (require.main === module) {
  migrateJinbeanData()
    .then(() => {
      console.log('✅ Jinbean迁移脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Jinbean迁移脚本执行失败:', error);
      process.exit(1);
    });
}

export { migrateJinbeanData }; 