import { React } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LogoutOutlined, HomeOutlined, BookOutlined, FileTextOutlined, BarChartOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const { Header, Content, Sider } = Layout;

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/knowledge',
      icon: <BookOutlined />,
      label: '知识库',
      children: [
        { key: '/knowledge', label: '知识点列表' },
        { key: '/knowledge/graph', label: '知识图谱' },
      ],
    },
    {
      key: '/learning',
      icon: <BarChartOutlined />,
      label: '学习进度',
      children: [
        { key: '/learning', label: '学习仪表盘' },
        { key: '/learning/graph', label: '知识图谱' },
      ],
    },
    {
      key: '/exercises',
      icon: <FileTextOutlined />,
      label: '练习题',
      children: [
        { key: '/exercises', label: '练习列表' },
        { key: '/exercises/wrong', label: '错题本' },
      ],
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith('/knowledge') || key.startsWith('/learning') || key.startsWith('/exercises') || key === '/profile') {
      navigate(key);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
      >
        <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>八股文学习</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {location.pathname === '/' && '首页'}
            {location.pathname.startsWith('/knowledge') && '知识库'}
            {location.pathname.startsWith('/learning') && '学习进度'}
            {location.pathname.startsWith('/exercises') && '练习题'}
            {location.pathname === '/profile' && '个人中心'}
          </div>
          {user && (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar src={user.avatar} style={{ marginRight: '8px' }}>
                  {user.username?.charAt(0).toUpperCase()}
                </Avatar>
                <span>{user.username}</span>
              </div>
            </Dropdown>
          )}
        </Header>
        <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
