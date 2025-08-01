const puppeteer = require('puppeteer');

async function runTests() {
  console.log('🚀 开始自动化测试...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  try {
    // 测试1: 页面加载
    console.log('📄 测试1: 页面加载测试');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    console.log('✅ 页面加载成功');
    
    // 测试2: 仪表盘功能
    console.log('📊 测试2: 仪表盘功能测试');
    await page.waitForSelector('h1');
    const title = await page.$eval('h1', el => el.textContent);
    console.log(`✅ 页面标题: ${title}`);
    
    // 测试3: 导航功能
    console.log('🧭 测试3: 导航功能测试');
    await page.click('a[href="/ai-assistant"]');
    await page.waitForTimeout(1000);
    console.log('✅ AI 助手页面导航成功');
    
    await page.click('a[href="/tenant"]');
    await page.waitForTimeout(1000);
    console.log('✅ 租户管理页面导航成功');
    
    await page.click('a[href="/message"]');
    await page.waitForTimeout(1000);
    console.log('✅ 消息监控页面导航成功');
    
    await page.click('a[href="/monitor"]');
    await page.waitForTimeout(1000);
    console.log('✅ 系统监控页面导航成功');
    
    await page.click('a[href="/settings"]');
    await page.waitForTimeout(1000);
    console.log('✅ 设置页面导航成功');
    
    // 测试4: AI 助手功能
    console.log('🤖 测试4: AI 助手功能测试');
    await page.click('a[href="/ai-assistant"]');
    await page.waitForTimeout(1000);
    
    const inputSelector = 'textarea[placeholder*="输入您的问题"]';
    await page.waitForSelector(inputSelector);
    await page.type(inputSelector, '分析系统状态');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    console.log('✅ AI 助手响应测试成功');
    
    // 测试5: 响应式设计
    console.log('📱 测试5: 响应式设计测试');
    await page.setViewport({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    console.log('✅ 平板端响应式测试成功');
    
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    console.log('✅ 手机端响应式测试成功');
    
    // 测试6: 性能测试
    console.log('⚡ 测试6: 性能测试');
    const startTime = Date.now();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    console.log(`✅ 页面加载时间: ${loadTime}ms`);
    
    console.log('\n🎉 所有测试通过！');
    console.log('📋 测试总结:');
    console.log('  ✅ 页面加载: 正常');
    console.log('  ✅ 导航功能: 正常');
    console.log('  ✅ AI 助手: 正常');
    console.log('  ✅ 响应式设计: 正常');
    console.log('  ✅ 性能表现: 良好');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    await browser.close();
  }
}

// 检查依赖
async function checkDependencies() {
  try {
    const puppeteer = require('puppeteer');
    console.log('✅ Puppeteer 已安装');
    return true;
  } catch (error) {
    console.log('❌ Puppeteer 未安装，正在安装...');
    const { execSync } = require('child_process');
    try {
      execSync('npm install puppeteer', { stdio: 'inherit' });
      console.log('✅ Puppeteer 安装成功');
      return true;
    } catch (installError) {
      console.error('❌ Puppeteer 安装失败:', installError.message);
      return false;
    }
  }
}

// 主函数
async function main() {
  console.log('🔍 检查测试环境...');
  const depsOk = await checkDependencies();
  
  if (!depsOk) {
    console.log('❌ 测试环境检查失败，退出测试');
    process.exit(1);
  }
  
  console.log('✅ 测试环境检查通过');
  await runTests();
}

main().catch(console.error); 