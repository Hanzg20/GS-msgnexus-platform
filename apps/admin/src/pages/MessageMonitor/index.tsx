import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Bell, 
  Globe,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Download,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import apiClient from '../../services/api';

interface Message {
  id: string;
  tenantId: string;
  type: 'sms' | 'email' | 'push' | 'webhook';
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'retrying';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sender: string;
  recipient: string;
  subject?: string;
  content: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  deliveredAt?: string;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
}

interface MessageStats {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  successRate: number;
  avgDelaySeconds: number;
  failedCount: number;
  retryingCount: number;
}

interface TrendData {
  date: string;
  total: number;
  successful: number;
  failed: number;
  successRate: string;
}

const MessageMonitor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // 获取消息列表
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      const response = await apiClient.get(`/api/v1/messages?${params}`);
      if (response.success) {
        setMessages(response.data.messages);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      console.error('获取消息列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取统计信息
  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/v1/messages/stats/overview');
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('获取统计信息失败:', error);
    }
  };

  // 获取趋势数据
  const fetchTrends = async () => {
    try {
      const response = await apiClient.get('/api/v1/messages/stats/trends?days=7');
      if (response.success) {
        setTrends(response.data);
      }
    } catch (error: any) {
      console.error('获取趋势数据失败:', error);
    }
  };

  // 重试失败的消息
  const retryMessage = async (messageId: string) => {
    try {
      const response = await apiClient.post(`/api/v1/messages/${messageId}/retry`);
      if (response.success) {
        fetchMessages();
        fetchStats();
      }
    } catch (error: any) {
      console.error('重试消息失败:', error);
    }
  };

  // 删除消息
  const deleteMessage = async (messageId: string) => {
    if (!confirm('确定要删除这条消息吗？')) return;
    
    try {
      const response = await apiClient.delete(`/api/v1/messages/${messageId}`);
      if (response.success) {
        fetchMessages();
        fetchStats();
      }
    } catch (error: any) {
      console.error('删除消息失败:', error);
    }
  };

  // 更新消息状态
  const updateMessageStatus = async (messageId: string, status: string, errorMessage?: string) => {
    try {
      const response = await apiClient.patch(`/api/v1/messages/${messageId}/status`, {
        status,
        errorMessage
      });
      if (response.success) {
        fetchMessages();
        fetchStats();
      }
    } catch (error: any) {
      console.error('更新消息状态失败:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchStats();
    fetchTrends();
  }, [pagination.page, filters]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'retrying':
        return <RotateCcw className="w-4 h-4 text-orange-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <Smartphone className="w-4 h-4" />;
      case 'push':
        return <Bell className="w-4 h-4" />;
      case 'webhook':
        return <Globe className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'sent':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'retrying':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280', fontSize: '18px' }}>正在加载消息数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* 头部 */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>消息监控</h1>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              实时监控和管理所有消息的发送状态和性能指标
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="ghost" onClick={() => { fetchMessages(); fetchStats(); fetchTrends(); }}>
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              刷新
            </Button>
            <Button variant="primary">
              <Download style={{ width: '16px', height: '16px' }} />
              导出报告
            </Button>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* 统计卡片 */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>总消息数</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.total}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#22c55e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>成功率</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.successRate}%</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#ef4444', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XCircle style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>失败消息</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.failedCount}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RotateCcw style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>重试中</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{stats.retryingCount}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 图表区域 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <Card>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>消息趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="总消息数" />
                <Line type="monotone" dataKey="successful" stroke="#22c55e" strokeWidth={2} name="成功消息" />
                <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="失败消息" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>消息类型分布</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(stats?.byType || {}).map(([type, count]) => ({ name: type, value: count }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {Object.entries(stats?.byType || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 过滤器和搜索 */}
        <div style={{ marginBottom: '24px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '16px', height: '16px' }} />
                <input
                  type="text"
                  placeholder="搜索消息内容、收件人..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '16px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
              </div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">所有状态</option>
                <option value="pending">待发送</option>
                <option value="sent">已发送</option>
                <option value="delivered">已送达</option>
                <option value="failed">发送失败</option>
                <option value="retrying">重试中</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">所有类型</option>
                <option value="email">邮件</option>
                <option value="sms">短信</option>
                <option value="push">推送</option>
                <option value="webhook">Webhook</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">所有优先级</option>
                <option value="low">低</option>
                <option value="normal">普通</option>
                <option value="high">高</option>
                <option value="urgent">紧急</option>
              </select>
              <Button variant="ghost" onClick={() => setFilters({ status: '', type: '', priority: '', search: '', startDate: '', endDate: '' })}>
                清除筛选
              </Button>
            </div>
          </Card>
        </div>

        {/* 消息列表 */}
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>消息</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>类型</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>状态</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>优先级</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>收件人</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>创建时间</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <p style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                          {message.subject || message.content.substring(0, 50)}
                        </p>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>
                          {message.content.length > 50 ? `${message.content.substring(0, 50)}...` : message.content}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getTypeIcon(message.type)}
                        <span style={{ textTransform: 'capitalize' }}>{message.type}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getStatusIcon(message.status)}
                        <span style={{ textTransform: 'capitalize' }}>{message.status}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        ...getPriorityColor(message.priority).split(' ').reduce((acc, className) => {
                          if (className.includes('text-')) acc.color = className.replace('text-', '#');
                          if (className.includes('bg-')) acc.backgroundColor = className.replace('bg-', '#');
                          if (className.includes('border-')) acc.border = `1px solid ${className.replace('border-', '#')}`;
                          return acc;
                        }, {} as any)
                      }}>
                        {message.priority}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <p style={{ fontSize: '14px', color: '#374151' }}>{message.recipient}</p>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setSelectedMessage(message); setShowDetails(true); }}
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </Button>
                        {message.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => retryMessage(message.id)}
                          >
                            <RotateCcw style={{ width: '16px', height: '16px' }} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderTop: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                显示第 {((pagination.page - 1) * pagination.limit) + 1} 到 {Math.min(pagination.page * pagination.limit, pagination.total)} 条，共 {pagination.total} 条
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                >
                  上一页
                </Button>
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 消息详情弹窗 */}
      {showDetails && selectedMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>消息详情</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(false)}>
                ✕
              </Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>消息ID</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedMessage.id}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>主题</label>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedMessage.subject || '无主题'}</p>
              </div>
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>内容</label>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {selectedMessage.content}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>发送者</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedMessage.sender}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>收件人</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedMessage.recipient}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>类型</label>
                  <p style={{ fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>{selectedMessage.type}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>优先级</label>
                  <p style={{ fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>{selectedMessage.priority}</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>创建时间</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>更新时间</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{new Date(selectedMessage.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedMessage.sentAt && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>发送时间</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{new Date(selectedMessage.sentAt).toLocaleString()}</p>
                </div>
              )}
              
              {selectedMessage.deliveredAt && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>送达时间</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{new Date(selectedMessage.deliveredAt).toLocaleString()}</p>
                </div>
              )}
              
              {selectedMessage.errorMessage && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>错误信息</label>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#dc2626'
                  }}>
                    {selectedMessage.errorMessage}
                  </div>
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>重试次数</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedMessage.retryCount} / {selectedMessage.maxRetries}</p>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>租户ID</label>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{selectedMessage.tenantId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageMonitor; 