import { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Button, Upload, message, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/user';
import type { User } from '../../types';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');

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
        message.success('更新成功');
        setEditing(false);
        // 这里可以触发 store 更新
      } else {
        message.error(res.message || '更新失败');
      }
    } catch (error: any) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      setAvatar(info.file.response.url);
      message.success('头像上传成功');
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  if (!user) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>未登录</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>个人中心</h1>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Avatar size={64} src={avatar} style={{ marginRight: '16px' }} />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
              {user.username}
            </div>
            <div style={{ color: '#666' }}>{user.email}</div>
          </div>
        </div>

        {!editing && (
          <Button type="primary" onClick={() => setEditing(true)}>
            编辑资料
          </Button>
        )}

        {editing && (
          <>
            <Input
              label="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginBottom: '16px' }}
            />

            <Upload
              name="avatar"
              listType="picture"
              showUploadList={false}
              action="/api/upload" // 这里需要实现上传接口
              beforeUpload={(file) => {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                  message.error('只能上传 JPG/PNG 文件');
                }
                return isJpgOrPng;
              }}
              onChange={handleAvatarUpload}
              style={{ marginBottom: '16px' }}
            >
              <Button icon={<UploadOutlined />}>点击上传头像</Button>
            </Upload>

            <Button type="primary" onClick={handleUpdate} loading={loading}>
              保存
            </Button>
            <Button style={{ marginLeft: '8px' }} onClick={() => setEditing(false)}>
              取消
            </Button>
          </>
        )}
      </Card>

      <Card title="账户信息">
        <Descriptions bordered>
          <Descriptions.Item label="用户 ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
          <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {new Date(user.created_at).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="最后更新">
            {new Date(user.updated_at).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Profile;
