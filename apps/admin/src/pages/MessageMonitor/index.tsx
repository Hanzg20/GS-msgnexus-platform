import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  RefreshCw, 
  Download, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  AlertTriangle,
  Info,
  Send,
  Inbox,
  Archive,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { safeRender, safeRenderArray } from '../../utils/safeRender';

// 定义类型
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
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    search: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchMessages();
    fetchStats();
    fetchTrends();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // 模拟 API 调用
      const mockMessages: Message[] = [
        {
          id: '1',
          tenantId: 'tenant1',
          type: 'email',
          status: 'delivered',
          priority: 'high',
          sender: 'system@msgnexus.com',
          recipient: 'user1@example.com',
          subject: '系统通知',
          content: '您的账户已成功创建',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:01:00Z',
          sentAt: '2024-01-15T10:00:30Z',
          deliveredAt: '2024-01-15T10:01:00Z',
          retryCount: 0,
          maxRetries: 3
        },
        {
          id: '2',
          tenantId: 'tenant1',
          type: 'sms',
          status: 'sent',
          priority: 'normal',
          sender: 'MsgNexus',
          recipient: '+1234567890',
          content: '验证码：123456',
          createdAt: '2024-01-15T09:30:00Z',
          updatedAt: '2024-01-15T09:30:05Z',
          sentAt: '2024-01-15T09:30:05Z',
          retryCount: 0,
          maxRetries: 3
        },
        {
          id: '3',
          tenantId: 'tenant2',
          type: 'push',
          status: 'failed',
          priority: 'low',
          sender: 'app',
          recipient: 'device_token_123',
          content: '推送通知内容',
          createdAt: '2024-01-15T09:00:00Z',
          updatedAt: '2024-01-15T09:00:10Z',
          retryCount: 2,
          maxRetries: 3,
          errorMessage: '设备离线'
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('获取消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const mockStats: MessageStats = {
        total: 1500,
        byStatus: {
          pending: 50,
          sent: 800,
          delivered: 600,
          failed: 40,
          retrying: 10
        },
        byType: {
          email: 800,
          sms: 400,
          push: 200,
          webhook: 100
        },
        byPriority: {
          low: 300,
          normal: 800,
          high: 300,
          urgent: 100
        },
        successRate: 93.3,
        avgDelaySeconds: 2.5,
        failedCount: 40,
        retryingCount: 10
      };

      setStats(mockStats);
    } catch (error) {
      console.error('获取统计失败:', error);
    }
  };

  const fetchTrends = async () => {
    try {
      const mockTrends: TrendData[] = [
        { date: '2024-01-10', total: 120, successful: 110, failed: 10, successRate: '91.7%' },
        { date: '2024-01-11', total: 135, successful: 125, failed: 10, successRate: '92.6%' },
        { date: '2024-01-12', total: 150, successful: 140, failed: 10, successRate: '93.3%' },
        { date: '2024-01-13', total: 165, successful: 155, failed: 10, successRate: '93.9%' },
        { date: '2024-01-14', total: 180, successful: 170, failed: 10, successRate: '94.4%' },
        { date: '2024-01-15', total: 195, successful: 185, failed: 10, successRate: '94.9%' }
      ];

      setTrends(mockTrends);
    } catch (error) {
      console.error('获取趋势失败:', error);
    }
  };

  const retryMessage = async (messageId: string) => {
    try {
      // 模拟重试逻辑
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'retrying' as const, retryCount: msg.retryCount + 1 }
          : msg
      ));
      
      // 模拟重试成功
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: 'sent' as const }
            : msg
        ));
      }, 2000);
    } catch (error) {
      console.error('重试消息失败:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('删除消息失败:', error);
    }
  };

  const updateMessageStatus = async (messageId: string, status: string, errorMessage?: string) => {
    try {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: status as any, errorMessage }
          : msg
      ));
    } catch (error) {
      console.error('更新消息状态失败:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock style={{ width: '16px', height: '16px', color: '#f59e0b' }} />;
      case 'sent':
        return <Send style={{ width: '16px', height: '16px', color: '#3b82f6' }} />;
      case 'delivered':
        return <CheckCircle style={{ width: '16px', height: '16px', color: '#22c55e' }} />;
      case 'failed':
        return <XCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />;
      case 'retrying':
        return <RotateCcw style={{ width: '16px', height: '16px', color: '#f59e0b' }} />;
      default:
        return <Info style={{ width: '16px', height: '16px', color: '#6b7280' }} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Inbox style={{ width: '16px', height: '16px', color: '#3b82f6' }} />;
      case 'sms':
        return <MessageSquare style={{ width: '16px', height: '16px', color: '#22c55e' }} />;
      case 'push':
        return <AlertTriangle style={{ width: '16px', height: '16px', color: '#f59e0b' }} />;
      case 'webhook':
        return <BarChart3 style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />;
      default:
        return <MessageSquare style={{ width: '16px', height: '16px', color: '#6b7280' }} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return '#6b7280';
      case 'normal':
        return '#3b82f6';
      case 'high':
        return '#f59e0b';
      case 'urgent':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'sent':
        return '#3b82f6';
      case 'delivered':
        return '#22c55e';
      case 'failed':
        return '#ef4444';
      case 'retrying':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesStatus = !filters.status || message.status === filters.status;
    const matchesType = !filters.type || message.type === filters.type;
    const matchesPriority = !filters.priority || message.priority === filters.priority;
    const matchesSearch = !filters.search || 
      message.recipient.toLowerCase().includes(filters.search.toLowerCase()) ||
      (message.subject && message.subject.toLowerCase().includes(filters.search.toLowerCase()));
    
    return matchesStatus && matchesType && matchesPriority && matchesSearch;
  });

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
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{safeRender(stats.total)}</p>
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
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{safeRender(stats.successRate)}%</p>
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
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{safeRender(stats.failedCount)}</p>
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
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{safeRender(stats.retryingCount)}</p>
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
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 过滤器和搜索 */}
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: '#6b7280'
              }} />
              <input
                type="text"
                placeholder="搜索收件人、主题..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
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
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
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
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              style={{
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">所有优先级</option>
              <option value="low">低</option>
              <option value="normal">普通</option>
              <option value="high">高</option>
              <option value="urgent">紧急</option>
            </select>
            <Button variant="ghost" onClick={() => setFilters({ status: '', type: '', priority: '', search: '', startDate: '', endDate: '' })}>
              <Filter style={{ width: '16px', height: '16px' }} />
              清除过滤
            </Button>
          </div>
        </Card>

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
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>创建时间</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {safeRenderArray(filteredMessages, (message, index) => (
                  <tr key={message.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                          {safeRender(message.subject || '无主题')}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          {safeRender(message.recipient)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                          {safeRender(message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content)}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {safeRender(getTypeIcon(message.type))}
                        <span style={{ fontSize: '14px', textTransform: 'uppercase' }}>
                          {safeRender(message.type)}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {safeRender(getStatusIcon(message.status))}
                        <span style={{ 
                          fontSize: '14px',
                          color: getStatusColor(message.status)
                        }}>
                          {safeRender(message.status === 'pending' ? '待发送' : 
                                   message.status === 'sent' ? '已发送' :
                                   message.status === 'delivered' ? '已送达' :
                                   message.status === 'failed' ? '发送失败' : '重试中')}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '2px 8px', 
                        backgroundColor: getPriorityColor(message.priority) + '20',
                        color: getPriorityColor(message.priority),
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {safeRender(message.priority === 'low' ? '低' :
                                 message.priority === 'normal' ? '普通' :
                                 message.priority === 'high' ? '高' : '紧急')}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>
                      {safeRender(new Date(message.createdAt).toLocaleString())}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="ghost" size="sm">
                          <Eye style={{ width: '14px', height: '14px' }} />
                        </Button>
                        {message.status === 'failed' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => retryMessage(message.id)}
                          >
                            <RotateCcw style={{ width: '14px', height: '14px' }} />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MessageMonitor; 