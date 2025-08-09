#!/bin/bash

# 🗄️ MsgNexus 数据库设置脚本
# 用于快速设置 Supabase + Upstash Redis 数据库环境

set -e

echo "🚀 开始设置 MsgNexus 数据库环境..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查必要的工具
check_requirements() {
    echo -e "${BLUE}📋 检查必要工具...${NC}"
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 未安装${NC}"
        exit 1
    fi
    
    # 检查 npx
    if ! command -v npx &> /dev/null; then
        echo -e "${RED}❌ npx 未安装${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 所有必要工具已安装${NC}"
}

# 设置环境变量
setup_environment() {
    echo -e "${BLUE}🔧 设置环境变量...${NC}"
    
    # 检查 .env 文件是否存在
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  .env 文件不存在，正在创建...${NC}"
        cp env.example .env
        echo -e "${GREEN}✅ .env 文件已创建${NC}"
    else
        echo -e "${GREEN}✅ .env 文件已存在${NC}"
    fi
    
    # 提示用户配置环境变量
    echo -e "${YELLOW}📝 请手动配置以下环境变量：${NC}"
    echo -e "${BLUE}1. DATABASE_URL - Supabase PostgreSQL 连接字符串${NC}"
    echo -e "${BLUE}2. REDIS_URL - Upstash Redis 连接字符串${NC}"
    echo -e "${BLUE}3. SUPABASE_URL - Supabase 项目 URL${NC}"
    echo -e "${BLUE}4. SUPABASE_ANON_KEY - Supabase 匿名密钥${NC}"
    echo -e "${BLUE}5. SUPABASE_SERVICE_ROLE_KEY - Supabase 服务角色密钥${NC}"
    echo ""
    read -p "按回车键继续..."
}

# 安装依赖
install_dependencies() {
    echo -e "${BLUE}📦 安装依赖...${NC}"
    
    # 安装根目录依赖
    npm install
    
    # 安装 API 依赖
    cd apps/api
    npm install
    cd ../..
    
    # 安装 Admin 依赖
    cd apps/admin
    npm install
    cd ../..
    
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
}

# 设置 Prisma
setup_prisma() {
    echo -e "${BLUE}🗄️ 设置 Prisma...${NC}"
    
    cd backend/prisma
    
    # 检查 DATABASE_URL 是否已设置
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${YELLOW}⚠️  DATABASE_URL 未设置，请先配置环境变量${NC}"
        cd ../..
        return 1
    fi
    
    # 生成 Prisma 客户端
    echo -e "${BLUE}🔨 生成 Prisma 客户端...${NC}"
    npx prisma generate
    
    # 运行数据库迁移
    echo -e "${BLUE}🔄 运行数据库迁移...${NC}"
    npx prisma migrate dev --name init
    
    # 查看数据库
    echo -e "${BLUE}👀 打开 Prisma Studio...${NC}"
    echo -e "${GREEN}✅ Prisma 设置完成${NC}"
    
    cd ../..
}

# 测试数据库连接
test_connections() {
    echo -e "${BLUE}🧪 测试数据库连接...${NC}"
    
    # 测试 PostgreSQL 连接
    echo -e "${BLUE}📊 测试 PostgreSQL 连接...${NC}"
    cd backend/prisma
    npx prisma db pull
    cd ../..
    
    # 测试 Redis 连接
    echo -e "${BLUE}🔴 测试 Redis 连接...${NC}"
    node -e "
    const Redis = require('ioredis');
    const redis = new Redis(process.env.REDIS_URL);
    redis.ping().then(() => {
      console.log('✅ Redis 连接成功');
      process.exit(0);
    }).catch(err => {
      console.error('❌ Redis 连接失败:', err.message);
      process.exit(1);
    });
    "
    
    echo -e "${GREEN}✅ 数据库连接测试完成${NC}"
}

# 插入初始数据
insert_initial_data() {
    echo -e "${BLUE}📝 插入初始数据...${NC}"
    
    cd backend/prisma
    
    # 运行数据迁移脚本
    if [ -f "../../scripts/migrate-data.ts" ]; then
        echo -e "${BLUE}🔄 运行数据迁移脚本...${NC}"
        npx ts-node ../../scripts/migrate-data.ts
    else
        echo -e "${YELLOW}⚠️  数据迁移脚本不存在，跳过${NC}"
    fi
    
    cd ../..
    
    echo -e "${GREEN}✅ 初始数据插入完成${NC}"
}

# 启动应用
start_application() {
    echo -e "${BLUE}🚀 启动应用...${NC}"
    
    # 检查端口是否被占用
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  端口 3000 已被占用${NC}"
    else
        echo -e "${GREEN}✅ 端口 3000 可用${NC}"
    fi
    
    if lsof -Pi :3030 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  端口 3030 已被占用${NC}"
    else
        echo -e "${GREEN}✅ 端口 3030 可用${NC}"
    fi
    
    echo -e "${BLUE}🎯 启动命令：${NC}"
    echo -e "${GREEN}npm run dev${NC}"
}

# 显示帮助信息
show_help() {
    echo -e "${BLUE}📖 使用说明：${NC}"
    echo ""
    echo -e "${YELLOW}1. 设置 Supabase：${NC}"
    echo "   - 访问 https://supabase.com"
    echo "   - 创建新项目"
    echo "   - 获取连接信息"
    echo ""
    echo -e "${YELLOW}2. 设置 Upstash Redis：${NC}"
    echo "   - 访问 https://upstash.com"
    echo "   - 创建 Redis 数据库"
    echo "   - 获取连接信息"
    echo ""
    echo -e "${YELLOW}3. 配置环境变量：${NC}"
    echo "   - 编辑 .env 文件"
    echo "   - 填入数据库连接信息"
    echo ""
    echo -e "${YELLOW}4. 运行设置脚本：${NC}"
    echo "   - ./scripts/setup-database.sh"
    echo ""
    echo -e "${YELLOW}5. 启动应用：${NC}"
    echo "   - npm run dev"
}

# 主函数
main() {
    echo -e "${GREEN}🎯 MsgNexus 数据库设置脚本${NC}"
    echo "=================================="
    echo ""
    
    # 检查参数
    if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        show_help
        exit 0
    fi
    
    # 执行设置步骤
    check_requirements
    setup_environment
    install_dependencies
    
    # 询问是否继续
    echo ""
    read -p "是否继续设置数据库？(y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_prisma
        test_connections
        insert_initial_data
        start_application
    else
        echo -e "${YELLOW}⚠️  跳过数据库设置${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 设置完成！${NC}"
    echo ""
    echo -e "${BLUE}📋 下一步：${NC}"
    echo "1. 配置环境变量"
    echo "2. 运行数据库迁移"
    echo "3. 启动应用"
    echo ""
    echo -e "${BLUE}📖 更多信息：${NC}"
    echo "查看 docs/DATABASE_IMPLEMENTATION_PLAN.md"
}

# 运行主函数
main "$@" 