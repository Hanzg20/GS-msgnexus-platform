import React, { useState, useEffect } from 'react';

interface DiagnosticResult {
  id: string;
  name: string;
  status: 'pass' | 'warning' | 'fail' | 'running';
  description: string;
  details?: string;
  recommendations?: string[];
  timestamp: Date;
  duration: number;
  category: 'performance' | 'security' | 'network' | 'database' | 'system';
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

const SystemDiagnostics: React.FC = () => {
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // 模拟诊断结果
  useEffect(() => {
    const mockResults: DiagnosticResult[] = [
      {
        id: 'cpu-check',
        name: 'CPU 使用率检查',
        status: 'pass',
        description: 'CPU 使用率正常，当前使用率 45%',
        details: 'CPU 核心数: 8\n当前负载: 3.6\n峰值负载: 7.2\n平均使用率: 45%',
        recommendations: ['监控 CPU 使用率趋势', '考虑优化高负载进程'],
        timestamp: new Date(Date.now() - 300000),
        duration: 2.3,
        category: 'performance'
      },
      {
        id: 'memory-check',
        name: '内存使用率检查',
        status: 'warning',
        description: '内存使用率较高，当前使用率 78%',
        details: '总内存: 16GB\n已使用: 12.5GB\n可用内存: 3.5GB\n交换使用: 0GB',
        recommendations: ['清理不必要的进程', '增加系统内存', '优化内存密集型应用'],
        timestamp: new Date(Date.now() - 240000),
        duration: 1.8,
        category: 'performance'
      },
      {
        id: 'disk-check',
        name: '磁盘空间检查',
        status: 'pass',
        description: '磁盘空间充足，使用率 32%',
        details: '总空间: 1TB\n已使用: 320GB\n可用空间: 680GB\n主要分区: / (32%)',
        recommendations: ['定期清理日志文件', '监控磁盘使用趋势'],
        timestamp: new Date(Date.now() - 180000),
        duration: 3.1,
        category: 'performance'
      },
      {
        id: 'network-check',
        name: '网络连接检查',
        status: 'pass',
        description: '网络连接正常，延迟 15ms',
        details: '带宽: 100Mbps\n延迟: 15ms\n丢包率: 0%\n连接数: 1,234',
        recommendations: ['监控网络流量', '定期检查网络配置'],
        timestamp: new Date(Date.now() - 120000),
        duration: 4.2,
        category: 'network'
      },
      {
        id: 'database-check',
        name: '数据库连接检查',
        status: 'pass',
        description: '数据库连接正常，响应时间 5ms',
        details: '连接池: 20/100\n查询响应时间: 5ms\n慢查询: 0\n事务数: 1,567',
        recommendations: ['优化慢查询', '监控连接池使用情况'],
        timestamp: new Date(Date.now() - 60000),
        duration: 2.8,
        category: 'database'
      },
      {
        id: 'security-check',
        name: '安全配置检查',
        status: 'fail',
        description: '发现安全配置问题',
        details: '防火墙状态: 正常\nSSL 证书: 即将过期 (30天)\n未授权访问尝试: 5次\n安全更新: 需要更新',
        recommendations: ['更新 SSL 证书', '安装安全补丁', '检查访问日志'],
        timestamp: new Date(Date.now() - 30000),
        duration: 5.5,
        category: 'security'
      },
      {
        id: 'service-check',
        name: '核心服务检查',
        status: 'pass',
        description: '所有核心服务运行正常',
        details: 'API 服务: 运行中\n实时服务: 运行中\n数据库服务: 运行中\n缓存服务: 运行中',
        recommendations: ['定期检查服务状态', '设置服务监控告警'],
        timestamp: new Date(Date.now() - 15000),
        duration: 1.2,
        category: 'system'
      }
    ];

    const mockMetrics: PerformanceMetric[] = [
      {
        name: 'CPU 使用率',
        value: 45,
        unit: '%',
        threshold: 80,
        status: 'good',
        trend: 'stable'
      },
      {
        name: '内存使用率',
        value: 78,
        unit: '%',
        threshold: 85,
        status: 'warning',
        trend: 'up'
      },
      {
        name: '磁盘使用率',
        value: 32,
        unit: '%',
        threshold: 90,
        status: 'good',
        trend: 'stable'
      },
      {
        name: '网络延迟',
        value: 15,
        unit: 'ms',
        threshold: 100,
        status: 'good',
        trend: 'down'
      },
      {
        name: '数据库响应时间',
        value: 5,
        unit: 'ms',
        threshold: 50,
        status: 'good',
        trend: 'stable'
      },
      {
        name: '活跃连接数',
        value: 1234,
        unit: '',
        threshold: 2000,
        status: 'good',
        trend: 'up'
      }
    ];

    setDiagnosticResults(mockResults);
    setPerformanceMetrics(mockMetrics);
  }, []);

  const runDiagnostics = async () => {
    setIsRunning(true);
    
    // 模拟运行诊断
    setTimeout(() => {
      setDiagnosticResults(prev => prev.map(result => ({
        ...result,
        status: Math.random() > 0.8 ? 'warning' : Math.random() > 0.9 ? 'fail' : 'pass',
        timestamp: new Date(),
        duration: Math.random() * 5 + 1
      })));
      setIsRunning(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'fail': return '#ef4444';
      case 'running': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅';
      case 'warning': return '⚠️';
      case 'fail': return '❌';
      case 'running': return '🔄';
      default: return '❓';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return '⚡';
      case 'security': return '🔒';
      case 'network': return '🌐';
      case 'database': return '🗄️';
      case 'system': return '⚙️';
      default: return '📊';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const filteredResults = selectedCategory === 'all' 
    ? diagnosticResults 
    : diagnosticResults.filter(result => result.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(diagnosticResults.map(r => r.category)))];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 800, 
          color: '#0f172a', 
          margin: 0, 
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🔍 系统诊断工具
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b', 
          margin: 0,
          fontWeight: 500
        }}>
          全面诊断系统性能、安全和网络状态，提供优化建议
        </p>
      </div>

      {/* 性能指标 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#0f172a', 
          margin: 0, 
          marginBottom: '20px' 
        }}>
          📊 实时性能指标
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {performanceMetrics.map(metric => (
            <div
              key={metric.name}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                background: 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: '#0f172a', 
                  margin: 0 
                }}>
                  {metric.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{getTrendIcon(metric.trend)}</span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getMetricStatusColor(metric.status)
                  }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ 
                  fontSize: '32px', 
                  fontWeight: 800, 
                  color: getMetricStatusColor(metric.status) 
                }}>
                  {metric.value}
                </span>
                <span style={{ fontSize: '16px', color: '#64748b' }}>
                  {metric.unit}
                </span>
              </div>
              
              <div style={{ 
                width: '100%', 
                height: '6px', 
                background: '#f1f5f9', 
                borderRadius: '3px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%`, 
                  height: '100%', 
                  background: getMetricStatusColor(metric.status),
                  borderRadius: '3px'
                }} />
              </div>
              
              <div style={{ 
                fontSize: '12px', 
                color: '#64748b', 
                marginTop: '8px' 
              }}>
                阈值: {metric.threshold}{metric.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 诊断控制 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
            系统诊断
          </h3>
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            style={{
              padding: '12px 24px',
              background: isRunning ? '#6b7280' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              opacity: isRunning ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isRunning ? '🔄 诊断中...' : '🔍 运行诊断'}
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                background: selectedCategory === category ? '#3b82f6' : '#f1f5f9',
                color: selectedCategory === category ? 'white' : '#475569',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {category === 'all' ? '全部' : 
               category === 'performance' ? '⚡ 性能' :
               category === 'security' ? '🔒 安全' :
               category === 'network' ? '🌐 网络' :
               category === 'database' ? '🗄️ 数据库' :
               category === 'system' ? '⚙️ 系统' : category}
            </button>
          ))}
        </div>
      </div>

      {/* 诊断结果 */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#0f172a', 
          margin: 0, 
          marginBottom: '24px' 
        }}>
          诊断结果 ({filteredResults.length})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredResults.map(result => (
            <div
              key={result.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: showDetails === result.id ? '#f8fafc' : 'white'
              }}
              onClick={() => setShowDetails(showDetails === result.id ? null : result.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '24px' }}>{getCategoryIcon(result.category)}</div>
                  <div>
                    <h4 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: '#0f172a', 
                      margin: 0, 
                      marginBottom: '4px' 
                    }}>
                      {result.name}
                    </h4>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#64748b', 
                      margin: 0 
                    }}>
                      {result.description}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: `${getStatusColor(result.status)}10`,
                    color: getStatusColor(result.status),
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600
                  }}>
                    {getStatusIcon(result.status)} {result.status === 'pass' ? '通过' : 
                                                     result.status === 'warning' ? '警告' : 
                                                     result.status === 'fail' ? '失败' : '运行中'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {result.duration.toFixed(1)}s
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {result.timestamp.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {result.category === 'performance' ? '⚡ 性能' :
                   result.category === 'security' ? '🔒 安全' :
                   result.category === 'network' ? '🌐 网络' :
                   result.category === 'database' ? '🗄️ 数据库' :
                   result.category === 'system' ? '⚙️ 系统' : result.category}
                </div>
              </div>
              
              {showDetails === result.id && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  {result.details && (
                    <div style={{ marginBottom: '16px' }}>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0' }}>
                        详细信息
                      </h5>
                      <pre style={{ 
                        fontSize: '14px', 
                        color: '#64748b', 
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        background: '#f8fafc',
                        padding: '12px',
                        borderRadius: '6px'
                      }}>
                        {result.details}
                      </pre>
                    </div>
                  )}
                  
                  {result.recommendations && result.recommendations.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0' }}>
                        优化建议
                      </h5>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {result.recommendations.map((rec, index) => (
                          <li key={index} style={{ 
                            fontSize: '14px', 
                            color: '#64748b', 
                            marginBottom: '4px' 
                          }}>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredResults.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, marginBottom: '8px' }}>
              暂无诊断结果
            </h3>
            <p style={{ fontSize: '14px', margin: 0 }}>
              点击"运行诊断"开始系统检查
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemDiagnostics; 