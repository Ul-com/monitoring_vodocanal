import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { DeploymentUnitOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    const success = await login(values.email, values.password);
    setLoading(false);
    if (success) {
      navigate('/');
    } else {
      message.error(useStore.getState().error);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-card__brand">
          <span className="login-card__mark">
            <DeploymentUnitOutlined />
          </span>
          <span>
            <div className="login-card__title">Мониторинг рисков IoT</div>
            <div className="login-card__subtitle">АО «Мосводоканал»</div>
          </span>
        </div>

        <Form onFinish={onFinish} layout="vertical" requiredMark={false} size="large">
          <Form.Item
            name="email"
            label="Электронная почта"
            rules={[{ required: true, message: 'Введите электронную почту' }]}
          >
            <Input prefix={<MailOutlined style={{ color: '#94A3B8' }} />} autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#94A3B8' }} />} autoComplete="current-password" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Войти
            </Button>
          </Form.Item>
        </Form>

        <div className="login-hint">
          Тестовые учётные записи пилота:
          <br />
          <code>admin@example.com / admin123</code> — администратор
          <br />
          <code>engineer@example.com / eng123</code> — инженер
          <br />
          <code>viewer@example.com / view123</code> — наблюдатель
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
