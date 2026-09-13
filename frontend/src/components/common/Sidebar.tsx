import React from 'react';
import { Layout, Menu, Badge } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  AppstoreOutlined,
  AlertOutlined,
  PlusCircleOutlined,
  UserOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useStore } from '../../store';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeAlerts = useStore(state => state.alerts.filter(a => a.status === 'active').length);

  const items = [
    { key: '/', icon: <DashboardOutlined />, label: 'Панель' },
    { key: '/objects', icon: <AppstoreOutlined />, label: 'Объекты' },
    {
      key: '/alerts',
      icon: <AlertOutlined />,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Алармы
          {activeAlerts > 0 && <Badge count={activeAlerts} size="small" color="#DC2626" />}
        </span>
      ),
    },
    { key: '/constructor', icon: <PlusCircleOutlined />, label: 'Конструктор' },
    { key: '/users', icon: <UserOutlined />, label: 'Пользователи' },
    { key: '/statistics', icon: <BarChartOutlined />, label: 'Статистика' },
  ];

  return (
    <Sider width={224} className="app-sider" breakpoint="lg" collapsedWidth={64}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
        style={{ height: '100%', borderRight: 0, paddingTop: 12 }}
      />
    </Sider>
  );
};

export default Sidebar;
