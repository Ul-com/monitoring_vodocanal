import React from 'react';
import { Layout, Button, Tooltip, Avatar } from 'antd';
import { LogoutOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { useStore } from '../../store';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const ROLE_LABELS: Record<string, string> = {
  admin: 'Администратор',
  engineer: 'Инженер',
  viewer: 'Наблюдатель',
};

const Header: React.FC = () => {
  const { currentUser, setCurrentUser } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <AntHeader className="app-header">
      <div className="app-brand">
        <span className="app-brand__mark">
          <DeploymentUnitOutlined />
        </span>
        <span>
          <div className="app-brand__title">Мониторинг рисков IoT</div>
          <div className="app-brand__subtitle">АО «Мосводоканал»</div>
        </span>
      </div>

      {currentUser && (
        <div className="app-user">
          <Avatar style={{ background: 'rgba(255,255,255,0.16)' }}>
            {currentUser.name.charAt(0)}
          </Avatar>
          <span>
            <div className="app-user__name">{currentUser.name}</div>
            <div className="app-user__role">{ROLE_LABELS[currentUser.role] ?? currentUser.role}</div>
          </span>
          <Tooltip title="Выйти из системы">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              aria-label="Выйти из системы"
              style={{ color: '#fff' }}
            />
          </Tooltip>
        </div>
      )}
    </AntHeader>
  );
};

export default Header;
