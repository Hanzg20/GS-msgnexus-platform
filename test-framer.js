// 测试 framer-motion 模块是否能被正确导入
try {
  const framerMotion = require('./node_modules/framer-motion/dist/cjs/index.js');
  console.log('✅ framer-motion 模块导入成功');
  console.log('可用的导出:', Object.keys(framerMotion));
} catch (error) {
  console.error('❌ framer-motion 模块导入失败:', error.message);
} 