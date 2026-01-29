import { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Button, Upload, Form, Input, message, Tabs, Row, Col } from 'antd';
import { UploadOutlined, UserOutlined, LockOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';
import { userService } from '../../../services/user';
import type { User } from '../../../types';

const { TabPane } = Tabs;

const Profile = () => {
  const { user, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [form] = Form.useForm();
  const [userDetail, setUserDetail] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await userService.update(user.id, { username, avatar });
      if (res.code === 0 && res.data) {
        // 更新本地用户信息
        login(res.data, localStorage.getItem('token') || '');
        message.success('更新成功');
        setEditing(false);
      } else {
        message.error(res.message || '更新失败');
      }
    } catch (error: any) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功');
      setAvatar(info.file.response.url);
      setEditing(true); // 保存
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 文件');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB');
      return false;
    }
    return true;
  };

  if (!user) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>👤</div>
        <div style={{ fontSize: '18px', color: '#999' }}>未登录</div>
        <Button type="primary" onClick={() => window.location.href = '/login'} style={{ marginTop: '16px' }}>
          去登录
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: 'bold' }}>个人中心</h1>

      <Card>
        <Tabs defaultActiveKey="profile">
          <TabPane tab="基本信息" key="profile" icon={<UserOutlined />}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <Avatar 
                size={80} 
                src={avatar} 
                style={{ marginRight: '24px', fontSize: '32px' }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {user.username}
                </h2>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {user.email}
                </div>
              </div>
            </div>

            <Descriptions 
              bordered 
              column={2}
              style={{ marginBottom: '32px' }}
            >
              <Descriptions.Item label="用户 ID">{user.id}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {new Date(user.created_at).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="最后更新">
                {new Date(user.updated_at).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: '32px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
                <EditOutlined style={{ marginRight: '8px' }} /> 编辑资料
              </h3>

              {!editing ? (
                <div style={{ marginTop: '16px' }}>
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
                    <Descriptions.Item label="头像">
                      {user.avatar ? (
                        <img src={user.avatar} alt="avatar" style={{ width: '80px', height: '80px', borderRadius: '8px' }} />
                      ) : (
                        <span style={{ color: '#999' }}>未设置</span>
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                  <Button type="primary" onClick={() => setEditing(true)} style={{ marginTop: '16px', height: '40px', fontSize: '16px', fontWeight: 'bold' }}>
                    编辑
                  </Button>
                </div>
              ) : (
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                  <Form.Item label="用户名" name="username" initialValue={username}>
                    <Input 
                      placeholder="请输入用户名" 
                      size="large"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item label="头像" name="avatar">
                    <Upload
                      name="avatar"
                      listType="picture"
                      showUploadList={false}
                      action="/api/upload"
                      beforeUpload={beforeUpload}
                      onChange={handleAvatarUpload}
                      style={{ marginBottom: '16px' }}
                    >
                      <Button icon={<UploadOutlined />} size="large">
                        点击上传头像
                      </Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ height: '48px', fontSize: '16px', fontWeight: 'bold', marginRight: '12px' }}>
                      保存
                    </Button>
                    <Button onClick={() => setEditing(false)} size="large" style={{ height: '48px', fontSize: '16px' }}>
                      取消
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </div>
          </TabPane>

          <TabPane tab="修改密码" key="password" icon={<LockOutlined />}>
            <div style={{ maxWidth: '500px', margin: '0 auto', padding: '32px 0' }}>
              <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
                出于安全考虑，请定期修改密码。新密码需要至少 6 个字符。
              </p>
              <Form layout="vertical" onFinish={(values) => message.success('密码修改功能开发中')}>
                <Form.Item label="当前密码" name="current_password">
                  <Input.Password size="large" placeholder="请输入当前密码" />
                </Form.Item>
                <Form.Item label="新密码" name="new_password" rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '新密码至少 6 个字符' },
                ]}>
                  <Input.Password size="large" placeholder="请输入新密码" />
                </Form.Item>
                <Form.Item label="确认新密码" name="confirm_password" rules={[
                  { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                      validator: (_, value) => {
                        if (!value || getFieldValue('new_password') !== value) {
                          return Promise.reject(new Error('两次输入的密码不一致'));
                        }
                        return Promise.resolve();
                      },
                    }),
                ]}>
                  <Input.Password size="large" placeholder="请再次输入新密码" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" style={{ height: '48px', fontSize: '16px', fontWeight: 'bold' }}>
                    修改密码
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>

          <TabPane tab="账号安全" key="security" icon={<LockOutlined />}>
            <div style={{ padding: '32px 0' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="登录信息" style={{ height: '100%' }}>
                    <Descriptions column={1}>
                      <Descriptions.Item label="最后登录">
                        {new Date().toLocaleString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="登录方式">
                        <Tag color="green">正常</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="操作记录" style={{ height: '100%' }}>
                    <List
                      dataSource={[
                        { id: 1, action: '修改密码', time: '1 小时前' },
                        { id: 2, action: '更新头像', time: '2 小时前' },
                        { id: 3, action: '修改资料', time: '1 天前' },
                        { id: 4, action: '注册账号', time: user.created_at },
                      ]}
                      renderItem={(item: any) => (
                        <List.Item>
                          <List.Item.Meta
                            title={item.action}
                            description={item.time}
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>

              <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '2px solid #f0f0f0', paddingTop: '32px' }}>
                <Button danger size="large" onClick={handleLogout} icon={<LockOutlined />} style={{ height: '56px', fontSize: '18px', fontWeight: 'bold' }}>
                  退出登录
                </Button>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile;
