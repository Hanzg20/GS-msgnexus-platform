import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Send, 
  MessageSquare,
  Activity,
  Globe,
  Building,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  Settings,
  MoreHorizontal,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Crown,
  MessageCircle,
  Hash,
  AtSign
} from 'lucide-react';

// 🎯 产品经理视角：租户管理和API调用监控平台
// 核心功能：了解平台使用者、监控API调用、提供沟通支持

interface Tenant {
  id: string;
  name: string;
  company: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'basic' | 'premium' | 'enterprise';
  apiCalls: number;
  lastActive: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  issues: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface APICall {
  id: string;
  tenantId: string;
  endpoint: string;
  method: string;
  status: number;
  timestamp: string;
  responseTime: number;
  ipAddress: string;
  userAgent: string;
  success: boolean;
}

interface Message {
  id: string;
  tenantId: string;
  tenantName: string;
  type: 'question' | 'issue' | 'request' | 'feedback';
  content: string;
  timestamp: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  lastResponse: string;
}

interface ChatRoomProps {
  tenantId?: string;
  currentUserId?: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ 
  tenantId = '1', 
  currentUserId = 'admin-001' 
}) => {
  // 核心业务数据
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: 't-001',
      name: 'TechCorp',
      company: '科技公司A',
      status: 'active',
      plan: 'enterprise',
      apiCalls: 15420,
      lastActive: '2024-01-15 14:30',
      location: '北京',
      contactPerson: '张经理',
      email: 'zhang@techcorp.com',
      phone: '+86 138-0013-8000',
      issues: 2,
      priority: 'medium'
    },
    {
      id: 't-002',
      name: 'DataFlow',
      company: '数据流公司',
      status: 'active',
      plan: 'premium',
      apiCalls: 8920,
      lastActive: '2024-01-15 13:45',
      location: '上海',
      contactPerson: '李总监',
      email: 'li@dataflow.com',
      phone: '+86 139-0023-9000',
      issues: 0,
      priority: 'low'
    },
    {
      id: 't-003',
      name: 'CloudNet',
      company: '云网络科技',
      status: 'active',
      plan: 'basic',
      apiCalls: 3450,
      lastActive: '2024-01-15 12:20',
      location: '深圳',
      contactPerson: '王工程师',
      email: 'wang@cloudnet.com',
      phone: '+86 137-0033-7000',
      issues: 1,
      priority: 'high'
    },
    {
      id: 't-004',
      name: 'SmartBiz',
      company: '智能商务',
      status: 'suspended',
      plan: 'basic',
      apiCalls: 0,
      lastActive: '2024-01-10 09:15',
      location: '杭州',
      contactPerson: '陈经理',
      email: 'chen@smartbiz.com',
      phone: '+86 136-0043-6000',
      issues: 3,
      priority: 'urgent'
    }
  ]);

  const [apiCalls, setApiCalls] = useState<APICall[]>([
    {
      id: 'api-001',
      tenantId: 't-001',
      endpoint: '/api/v1/messages',
      method: 'POST',
      status: 200,
      timestamp: '2024-01-15 14:30:25',
      responseTime: 45,
      ipAddress: '192.168.1.100',
      userAgent: 'MsgNexus-Client/1.0',
      success: true
    },
    {
      id: 'api-002',
      tenantId: 't-002',
      endpoint: '/api/v1/system/health',
      method: 'GET',
      status: 200,
      timestamp: '2024-01-15 14:29:18',
      responseTime: 12,
      ipAddress: '10.0.0.50',
      userAgent: 'HealthMonitor/2.1',
      success: true
    },
    {
      id: 'api-003',
      tenantId: 't-003',
      endpoint: '/api/v1/tenants',
      method: 'GET',
      status: 403,
      timestamp: '2024-01-15 14:28:42',
      responseTime: 8,
      ipAddress: '172.16.0.25',
      userAgent: 'TenantManager/1.5',
      success: false
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-001',
      tenantId: 't-003',
      tenantName: 'CloudNet',
      type: 'issue',
      content: 'API调用返回403错误，请问是什么原因？',
      timestamp: '2024-01-15 14:25',
      status: 'open',
      priority: 'high',
      assignedTo: 'admin-001',
      lastResponse: '正在检查权限配置...'
    },
    {
      id: 'msg-002',
      tenantId: 't-001',
      tenantName: 'TechCorp',
      type: 'request',
      content: '能否增加API调用频率限制？',
      timestamp: '2024-01-15 14:20',
      status: 'in_progress',
      priority: 'medium',
      assignedTo: 'admin-001',
      lastResponse: '已提交技术团队评估...'
    }
  ]);

  // UI状态
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showTenantDetails, setShowTenantDetails] = useState(false);
  const [showAPIMonitor, setShowAPIMonitor] = useState(false);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('lastActive');

  // 引用
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, text: '活跃' },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: <Clock className="w-4 h-4" />, text: '非活跃' },
      suspended: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-4 h-4" />, text: '已暂停' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      basic: { color: 'bg-blue-100 text-blue-800', icon: <Star className="w-4 h-4" />, text: '基础版' },
      premium: { color: 'bg-purple-100 text-purple-800', icon: <Zap className="w-4 h-4" />, text: '高级版' },
      enterprise: { color: 'bg-indigo-100 text-indigo-800', icon: <Crown className="w-4 h-4" />, text: '企业版' }
    };
    
    const config = planConfig[plan as keyof typeof planConfig] || planConfig.basic;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800', text: '低' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: '中' },
      high: { color: 'bg-orange-100 text-orange-800', text: '高' },
      urgent: { color: 'bg-red-100 text-red-800', text: '紧急' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low;
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tenant.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tenant.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || tenant.plan === filterPlan;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const sortedTenants = [...filteredTenants].sort((a, b) => {
    switch (sortBy) {
      case 'lastActive':
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      case 'apiCalls':
        return b.apiCalls - a.apiCalls;
      case 'issues':
        return b.issues - a.issues;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // 计算总API调用量（从租户数据中获取）
  const totalAPICalls = tenants.reduce((sum, tenant) => sum + tenant.apiCalls, 0);
  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const totalIssues = messages.filter(m => m.status !== 'resolved').length;

  return (
    <div className="flex h-full bg-gray-50">
      {/* 左侧租户列表 - 核心业务功能 */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* 头部 - 平台概览 */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h1 className="text-xl font-bold mb-4">MsgNexus 租户管理</h1>
          
          {/* 关键指标 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{tenants.length}</div>
              <div className="text-sm text-blue-100">总租户</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{activeTenants}</div>
              <div className="text-sm text-blue-100">活跃租户</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalIssues}</div>
              <div className="text-sm text-blue-100">待处理问题</div>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索租户..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2 mb-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有状态</option>
              <option value="active">活跃</option>
              <option value="inactive">非活跃</option>
              <option value="suspended">已暂停</option>
            </select>
            
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">所有套餐</option>
              <option value="basic">基础版</option>
              <option value="premium">高级版</option>
              <option value="enterprise">企业版</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lastActive">最后活跃</option>
              <option value="apiCalls">API调用量</option>
              <option value="issues">问题数量</option>
              <option value="name">名称</option>
            </select>
          </div>
        </div>

        {/* 租户列表 */}
        <div className="flex-1 overflow-y-auto">
          {sortedTenants.map((tenant) => (
            <div
              key={tenant.id}
              onClick={() => {
                setSelectedTenant(tenant);
                setShowTenantDetails(true);
              }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedTenant?.id === tenant.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">{tenant.name}</span>
                </div>
                {getStatusBadge(tenant.status)}
              </div>
              
              <div className="text-sm text-gray-600 mb-2">{tenant.company}</div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{tenant.contactPerson}</span>
                {getPlanBadge(tenant.plan)}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">API: {tenant.apiCalls.toLocaleString()}</span>
                  <span className="text-gray-500">问题: {tenant.issues}</span>
                </div>
                <span className="text-gray-400">{tenant.lastActive}</span>
              </div>
              
              {tenant.issues > 0 && (
                <div className="mt-2">
                  {getPriorityBadge(tenant.priority)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 右侧主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部操作栏 */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAPIMonitor(!showAPIMonitor)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showAPIMonitor 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                API监控
              </button>
              
              <button
                onClick={() => setShowSupportChat(!showSupportChat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showSupportChat 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                支持沟通
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RefreshCw className="w-4 h-4" />
              <span>最后更新: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-6">
          {showAPIMonitor && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">API 调用监控</h2>
              
              {/* API 统计概览 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">{totalAPICalls.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">总API调用</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">{apiCalls.filter(c => c.success).length}</div>
                  <div className="text-sm text-gray-600">成功调用</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-red-600">{apiCalls.filter(c => !c.success).length}</div>
                  <div className="text-sm text-gray-600">失败调用</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(apiCalls.reduce((sum, c) => sum + c.responseTime, 0) / apiCalls.length)}ms
                  </div>
                  <div className="text-sm text-gray-600">平均响应时间</div>
                </div>
              </div>
              
              {/* API 调用列表 */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">最近API调用</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">租户</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">接口</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">响应时间</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP地址</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {apiCalls.map((call) => (
                        <tr key={call.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tenants.find(t => t.id === call.tenantId)?.name || call.tenantId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {call.method} {call.endpoint}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              call.success 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {call.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {call.responseTime}ms
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {call.ipAddress}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {call.timestamp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {showSupportChat && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">支持沟通</h2>
              
              {/* 问题统计 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">{messages.filter(m => m.status === 'open').length}</div>
                  <div className="text-sm text-gray-600">待处理</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-yellow-600">{messages.filter(m => m.status === 'in_progress').length}</div>
                  <div className="text-sm text-gray-600">处理中</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">{messages.filter(m => m.status === 'resolved').length}</div>
                  <div className="text-sm text-gray-600">已解决</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-red-600">{messages.filter(m => m.priority === 'urgent').length}</div>
                  <div className="text-sm text-gray-600">紧急问题</div>
                </div>
              </div>
              
              {/* 问题列表 */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">最近问题</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {messages.map((message) => (
                    <div key={message.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{message.tenantName}</span>
                          <span className="text-sm text-gray-500">#{message.id}</span>
                          {getPriorityBadge(message.priority)}
                        </div>
                        <span className="text-sm text-gray-500">{message.timestamp}</span>
                      </div>
                      
                      <div className="text-gray-700 mb-3">{message.content}</div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500">类型: {message.type}</span>
                          <span className="text-gray-500">状态: {message.status}</span>
                          <span className="text-gray-500">负责人: {message.assignedTo}</span>
                        </div>
                        
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          回复
                        </button>
                      </div>
                      
                      {message.lastResponse && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">最新回复:</div>
                          <div className="text-gray-700">{message.lastResponse}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!showAPIMonitor && !showSupportChat && (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">选择功能模块</h3>
              <p className="text-gray-600 mb-8">
                请选择要查看的功能模块：API监控或支持沟通
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 右侧租户详情面板 */}
      {showTenantDetails && selectedTenant && (
        <div className="w-96 bg-white border-l border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">租户详情</h3>
            <button
              onClick={() => setShowTenantDetails(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* 基本信息 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">基本信息</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">公司名称:</span>
                  <span className="font-medium">{selectedTenant.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">联系人:</span>
                  <span className="font-medium">{selectedTenant.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">套餐:</span>
                  {getPlanBadge(selectedTenant.plan)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">状态:</span>
                  {getStatusBadge(selectedTenant.status)}
                </div>
              </div>
            </div>
            
            {/* 联系信息 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">联系信息</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{selectedTenant.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{selectedTenant.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{selectedTenant.location}</span>
                </div>
              </div>
            </div>
            
            {/* 使用统计 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">使用统计</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">API调用量:</span>
                  <span className="font-medium">{selectedTenant.apiCalls.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">最后活跃:</span>
                  <span className="text-sm text-gray-500">{selectedTenant.lastActive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">待处理问题:</span>
                  <span className="font-medium">{selectedTenant.issues}</span>
                </div>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                发送消息
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                查看API日志
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                管理设置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom; 