import React, { useState } from 'react';
import { Card, Form, Input, Switch, Button, Select, Space, message, Divider, Row, Col } from 'antd';
import { 
  SettingOutlined, 
  SecurityScanOutlined, 
  ThunderboltOutlined,
  DatabaseOutlined,
  CloudOutlined,
  BellOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Option } = Select;
const { TextArea } = Input;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [aiForm] = Form.useForm();
  const [securityForm] = Form.useForm();

  const [settings, setSettings] = useState({
    system: {
      appName: 'GoldSky MessageCore',
      version: '1.0.0',
      timezone: 'Asia/Shanghai',
      language: 'zh-CN',
      debugMode: false,
    },
    ai: {
      enabled: true,
      model: 'gpt-4',
      apiKey: 'sk-...',
      maxTokens: 2000,
      temperature: 0.7,
    },
    security: {
      enableSSL: true,
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      enable2FA: false,
      passwordPolicy: 'strong',
    },
  });

  const handleSystemSave = async () => {
    try {
      const values = await form.validateFields();
      setSettings(prev => ({
        ...prev,
        system: { ...prev.system, ...values },
      }));
      message.success('系统设置保存成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleAISave = async () => {
    try {
      const values = await aiForm.validateFields();
      setSettings(prev => ({
        ...prev,
        ai: { ...prev.ai, ...values },
      }));
      message.success('AI 设置保存成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleSecuritySave = async () => {
    try {
      const values = await securityForm.validateFields();
      setSettings(prev => ({
        ...prev,
        security: { ...prev.security, ...values },
      }));
      message.success('安全设置保存成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          系统设置
        </h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          系统配置 · AI 设置 · 安全策略
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {/* 系统设置 */}
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <Card
              title={
                <Space>
                  <SettingOutlined />
                  系统设置
                </Space>
              }
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={settings.system}
              >
                <Form.Item
                  name="appName"
                  label="应用名称"
                  rules={[{ required: true, message: '请输入应用名称' }]}
                >
                  <Input placeholder="请输入应用名称" />
                </Form.Item>

                <Form.Item
                  name="version"
                  label="版本号"
                >
                  <Input placeholder="版本号" disabled />
                </Form.Item>

                <Form.Item
                  name="timezone"
                  label="时区"
                  rules={[{ required: true, message: '请选择时区' }]}
                >
                  <Select placeholder="请选择时区">
                    <Option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</Option>
                    <Option value="America/New_York">America/New_York (UTC-5)</Option>
                    <Option value="Europe/London">Europe/London (UTC+0)</Option>
                    <Option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="language"
                  label="语言"
                  rules={[{ required: true, message: '请选择语言' }]}
                >
                  <Select placeholder="请选择语言">
                    <Option value="zh-CN">简体中文</Option>
                    <Option value="en-US">English</Option>
                    <Option value="ja-JP">日本語</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="debugMode"
                  label="调试模式"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" onClick={handleSystemSave}>
                    保存系统设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </motion.div>
        </Col>

        {/* AI 设置 */}
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <Card
              title={
                <Space>
                  <ThunderboltOutlined />
                  AI 设置
                </Space>
              }
            >
              <Form
                form={aiForm}
                layout="vertical"
                initialValues={settings.ai}
              >
                <Form.Item
                  name="enabled"
                  label="启用 AI 功能"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="model"
                  label="AI 模型"
                  rules={[{ required: true, message: '请选择 AI 模型' }]}
                >
                  <Select placeholder="请选择 AI 模型">
                    <Option value="gpt-4">GPT-4</Option>
                    <Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Option>
                    <Option value="claude-3">Claude-3</Option>
                    <Option value="custom">自定义模型</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="apiKey"
                  label="API 密钥"
                  rules={[{ required: true, message: '请输入 API 密钥' }]}
                >
                  <Input.Password placeholder="请输入 API 密钥" />
                </Form.Item>

                <Form.Item
                  name="maxTokens"
                  label="最大 Token 数"
                  rules={[{ required: true, message: '请输入最大 Token 数' }]}
                >
                  <Input type="number" placeholder="请输入最大 Token 数" />
                </Form.Item>

                <Form.Item
                  name="temperature"
                  label="温度 (创造性)"
                  rules={[{ required: true, message: '请输入温度值' }]}
                >
                  <Input type="number" step="0.1" min="0" max="2" placeholder="0.0-2.0" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" onClick={handleAISave}>
                    保存 AI 设置
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </motion.div>
        </Col>

        {/* 安全设置 */}
        <Col xs={24}>
          <motion.div variants={itemVariants}>
            <Card
              title={
                <Space>
                  <SecurityScanOutlined />
                  安全设置
                </Space>
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Form
                    form={securityForm}
                    layout="vertical"
                    initialValues={settings.security}
                  >
                    <Form.Item
                      name="enableSSL"
                      label="启用 SSL"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item
                      name="sessionTimeout"
                      label="会话超时时间 (秒)"
                      rules={[{ required: true, message: '请输入会话超时时间' }]}
                    >
                      <Input type="number" placeholder="请输入会话超时时间" />
                    </Form.Item>

                    <Form.Item
                      name="maxLoginAttempts"
                      label="最大登录尝试次数"
                      rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
                    >
                      <Input type="number" placeholder="请输入最大登录尝试次数" />
                    </Form.Item>

                    <Form.Item
                      name="enable2FA"
                      label="启用双因素认证"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item
                      name="passwordPolicy"
                      label="密码策略"
                      rules={[{ required: true, message: '请选择密码策略' }]}
                    >
                      <Select placeholder="请选择密码策略">
                        <Option value="weak">弱 (仅字母数字)</Option>
                        <Option value="medium">中等 (字母数字+符号)</Option>
                        <Option value="strong">强 (大小写字母+数字+符号)</Option>
                        <Option value="very-strong">很强 (大小写字母+数字+符号+特殊字符)</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" onClick={handleSecuritySave}>
                        保存安全设置
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>

                <Col xs={24} lg={12}>
                  <Card title="安全状态" size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <strong>SSL 状态:</strong> 
                        <span style={{ color: '#52c41a', marginLeft: 8 }}>✓ 已启用</span>
                      </div>
                      <div>
                        <strong>防火墙状态:</strong> 
                        <span style={{ color: '#52c41a', marginLeft: 8 }}>✓ 正常运行</span>
                      </div>
                      <div>
                        <strong>数据库加密:</strong> 
                        <span style={{ color: '#52c41a', marginLeft: 8 }}>✓ 已加密</span>
                      </div>
                      <div>
                        <strong>备份状态:</strong> 
                        <span style={{ color: '#52c41a', marginLeft: 8 }}>✓ 最近备份: 2小时前</span>
                      </div>
                      <div>
                        <strong>安全评分:</strong> 
                        <span style={{ color: '#52c41a', marginLeft: 8 }}>95/100</span>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Settings; 