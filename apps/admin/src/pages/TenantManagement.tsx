import React, { useState } from 'react';

interface Tenant {
  id: number;
  name: string;
  subdomain: string;
  plan: string;
  status: string;
  createdAt: string;
  users: number;
}

const TenantManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants] = useState<Tenant[]>([
    {
      id: 1,
      name: 'GoldSky Corp',
      subdomain: 'goldsky',
      plan: '企业版',
      status: '活跃',
      createdAt: '2024-01-15',
      users: 150
    },
    {
      id: 2,
      name: 'Tech Startup',
      subdomain: 'techstartup',
      plan: '专业版',
      status: '活跃',
      createdAt: '2024-02-20',
      users: 45
    },
    {
      id: 3,
      name: 'Digital Agency',
      subdomain: 'digitalagency',
      plan: '标准版',
      status: '暂停',
      createdAt: '2024-03-10',
      users: 23
    }
  ]);

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const buttonStyle = {
    padding: '8px 16px',
    margin: '4px',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
    color: 'white',
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ff4d4f',
    borderColor: '#ff4d4f',
    color: 'white',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginTop: '16px',
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left' as const,
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
    fontWeight: 'bold',
    color: '#333',
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
    color: '#666',
  };

  const statusStyle = (status: string) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: status === '活跃' ? '#f6ffed' : '#fff2e8',
    color: status === '活跃' ? '#52c41a' : '#fa8c16',
    border: `1px solid ${status === '活跃' ? '#b7eb8f' : '#ffd591'}`,
  });

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h1 style={{ color: '#1890ff', margin: 0, fontSize: '28px' }}>
          🏢 租户管理
        </h1>
        <button style={primaryButtonStyle}>
          ➕ 添加租户
        </button>
      </div>

      {/* 搜索和过滤 */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>
              搜索租户
            </label>
            <input
              type="text"
              placeholder="输入租户名称或子域名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333' }}>
              状态过滤
            </label>
            <select style={{
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              fontSize: '14px',
            }}>
              <option value="">全部状态</option>
              <option value="active">活跃</option>
              <option value="suspended">暂停</option>
            </select>
          </div>
        </div>
      </div>

      {/* 租户列表 */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ color: '#333', marginBottom: '16px' }}>租户列表</h2>
        
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>租户名称</th>
              <th style={thStyle}>子域名</th>
              <th style={thStyle}>套餐类型</th>
              <th style={thStyle}>状态</th>
              <th style={thStyle}>用户数</th>
              <th style={thStyle}>创建时间</th>
              <th style={thStyle}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map(tenant => (
              <tr key={tenant.id}>
                <td style={tdStyle}>{tenant.id}</td>
                <td style={tdStyle}>
                  <strong style={{ color: '#333' }}>{tenant.name}</strong>
                </td>
                <td style={tdStyle}>
                  <code style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {tenant.subdomain}
                  </code>
                </td>
                <td style={tdStyle}>{tenant.plan}</td>
                <td style={tdStyle}>
                  <span style={statusStyle(tenant.status)}>
                    {tenant.status}
                  </span>
                </td>
                <td style={tdStyle}>{tenant.users}</td>
                <td style={tdStyle}>{tenant.createdAt}</td>
                <td style={tdStyle}>
                  <button style={buttonStyle}>
                    ✏️ 编辑
                  </button>
                  <button style={dangerButtonStyle}>
                    🗑️ 删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTenants.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666' 
          }}>
            没有找到匹配的租户
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantManagement; 