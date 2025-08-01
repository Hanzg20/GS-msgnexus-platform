#!/usr/bin/env node

const io = require('socket.io-client');

console.log('🧪 开始测试聊天功能...\n');

// 测试配置
const config = {
  serverUrl: 'http://localhost:3031',
  roomId: 'test-room',
  testMessages: [
    '你好！这是一条测试消息',
    'Hello! This is a test message',
    '测试中文和英文混合消息 Test mixed language message',
    '🎉 测试表情符号和特殊字符 @#$%^&*()',
    '这是一条很长的测试消息，用来测试消息的换行和显示效果。这条消息包含了多个句子，应该能够正确显示在聊天界面中。'
  ]
};

// 创建多个客户端模拟多用户聊天
const clients = [];
const clientCount = 3;

function createClient(clientId) {
  return new Promise((resolve, reject) => {
    const socket = io(config.serverUrl, {
      transports: ['websocket', 'polling']
    });

    const client = {
      id: clientId,
      socket: socket,
      messageCount: 0
    };

    socket.on('connect', () => {
      console.log(`✅ 客户端 ${clientId} 已连接`);
      
      // 加入测试房间
      socket.emit('join-room', config.roomId);
      
      // 监听新消息
      socket.on('new-message', (messageData) => {
        console.log(`📨 客户端 ${clientId} 收到消息: ${messageData.userName}: ${messageData.message}`);
        client.messageCount++;
      });

      // 监听用户加入/离开事件
      socket.on('user-joined', (data) => {
        console.log(`👋 用户加入房间: ${data.userId}`);
      });

      socket.on('user-left', (data) => {
        console.log(`👋 用户离开房间: ${data.userId}`);
      });

      resolve(client);
    });

    socket.on('disconnect', () => {
      console.log(`❌ 客户端 ${clientId} 断开连接`);
    });

    socket.on('error', (error) => {
      console.error(`❌ 客户端 ${clientId} 错误:`, error);
      reject(error);
    });

    // 连接超时
    setTimeout(() => {
      reject(new Error(`客户端 ${clientId} 连接超时`));
    }, 5000);
  });
}

async function runTest() {
  try {
    console.log('🔄 创建测试客户端...');
    
    // 创建多个客户端
    for (let i = 1; i <= clientCount; i++) {
      const client = await createClient(`User_${i}`);
      clients.push(client);
    }

    console.log(`✅ 成功创建 ${clientCount} 个客户端\n`);

    // 等待所有客户端连接
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('💬 开始发送测试消息...\n');

    // 模拟消息发送
    for (let i = 0; i < config.testMessages.length; i++) {
      const client = clients[i % clientCount];
      const message = config.testMessages[i];
      
      const messageData = {
        roomId: config.roomId,
        message: message,
        userId: client.socket.id,
        userName: `测试用户_${client.id}`
      };

      client.socket.emit('send-message', messageData);
      console.log(`📤 客户端 ${client.id} 发送消息: ${message}`);
      
      // 等待消息发送间隔
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 等待所有消息处理完成
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n📊 测试结果统计:');
    clients.forEach(client => {
      console.log(`客户端 ${client.id}: 收到 ${client.messageCount} 条消息`);
    });

    // 测试房间切换
    console.log('\n🔄 测试房间切换功能...');
    const testClient = clients[0];
    
    // 离开当前房间
    testClient.socket.emit('leave-room', config.roomId);
    console.log(`客户端 ${testClient.id} 离开房间: ${config.roomId}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 加入新房间
    const newRoomId = 'new-test-room';
    testClient.socket.emit('join-room', newRoomId);
    console.log(`客户端 ${testClient.id} 加入房间: ${newRoomId}`);
    
    // 在新房间发送消息
    await new Promise(resolve => setTimeout(resolve, 500));
    testClient.socket.emit('send-message', {
      roomId: newRoomId,
      message: '这是在新房间发送的测试消息',
      userId: testClient.socket.id,
      userName: `测试用户_${testClient.id}`
    });

    // 等待消息处理
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n✅ 聊天功能测试完成！');

    // 清理连接
    console.log('\n🧹 清理测试连接...');
    clients.forEach(client => {
      client.socket.disconnect();
    });

    console.log('🎉 测试脚本执行完毕！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 检查服务器是否可用
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3031/health');
    if (response.ok) {
      console.log('✅ Realtime 服务器运行正常');
      return true;
    }
  } catch (error) {
    console.error('❌ 无法连接到 Realtime 服务器');
    console.log('请确保服务器正在运行: npm start');
    return false;
  }
}

// 主函数
async function main() {
  console.log('🔍 检查服务器状态...');
  
  if (await checkServer()) {
    await runTest();
  } else {
    process.exit(1);
  }
}

// 运行测试
main().catch(console.error); 