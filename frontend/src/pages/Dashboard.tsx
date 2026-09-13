import React, { useEffect } from 'react';
import { Row, Col, Card, List, Tag, Empty, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import MapLibreMap from '../components/common/MapLibreMap';
import {
  AlertOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';

const KpiTile: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: 'brand' | 'success' | 'warning' | 'danger';
}> = ({ label, value, icon, tone = 'brand' }) => (
  <div className={`kpi kpi--${tone}`}>
    <span className="kpi__icon">{icon}</span>
    <span>
      <div className="kpi__label">{label}</div>
      <div className="kpi__value">{value}</div>
    </span>
  </div>
);

const PRIORITY_COLOR: Record<string, string> = {
  high: 'error',
  medium: 'warning',
  low: 'default',
};

const Dashboard: React.FC = () => {
  const { objects, alerts, fetchObjects, fetchAlerts } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchObjects();
    fetchAlerts();
    const interval = setInterval(() => {
      fetchObjects();
      fetchAlerts();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const green = objects.filter(o => o.status === 'green').length;
  const yellow = objects.filter(o => o.status === 'yellow').length;
  const red = objects.filter(o => o.status === 'red').length;
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const recentAlerts = [...alerts]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Оперативная панель</h1>
          <p className="page__subtitle">
            Состояние объектов и активные инциденты в реальном времени
          </p>
        </div>
        <Button type="primary" onClick={() => navigate('/alerts')}>
          Все алармы
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} lg={6}>
          <KpiTile label="Объектов на контроле" value={objects.length} icon={<AppstoreOutlined />} />
        </Col>
        <Col xs={12} lg={6}>
          <KpiTile label="В норме" value={green} icon={<CheckCircleOutlined />} tone="success" />
        </Col>
        <Col xs={12} lg={6}>
          <KpiTile label="Предупреждения" value={yellow} icon={<WarningOutlined />} tone="warning" />
        </Col>
        <Col xs={12} lg={6}>
          <KpiTile label="Критичных" value={red} icon={<ExclamationCircleOutlined />} tone="danger" />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={17}>
          <Card
            title="Карта объектов"
            styles={{ body: { padding: 0, height: 560 } }}
            extra={<span style={{ color: '#64748B', fontSize: 13 }}>{objects.length} объектов</span>}
          >
            <MapLibreMap />
          </Card>
        </Col>
        <Col xs={24} xl={7}>
          <Card
            title="Последние алармы"
            extra={
              activeAlerts.length > 0 ? (
                <Tag color="error">{activeAlerts.length} активных</Tag>
              ) : (
                <Tag color="success">Чисто</Tag>
              )
            }
            styles={{ body: { padding: '4px 20px', height: 560, overflow: 'auto' } }}
          >
            <List
              dataSource={recentAlerts}
              locale={{ emptyText: <Empty description="Алармов нет" /> }}
              renderItem={alert => (
                <List.Item style={{ cursor: 'pointer' }} onClick={() => navigate('/alerts')}>
                  <List.Item.Meta
                    avatar={
                      <AlertOutlined
                        style={{
                          fontSize: 18,
                          color: alert.status === 'resolved' ? '#94A3B8' : alert.priority === 'high' ? '#DC2626' : '#F59E0B',
                        }}
                      />
                    }
                    title={
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 500 }}>{alert.type}</span>
                        <Tag color={alert.status === 'active' ? PRIORITY_COLOR[alert.priority] : 'success'}>
                          {alert.status === 'active' ? 'активен' : 'закрыт'}
                        </Tag>
                      </span>
                    }
                    description={
                      <span style={{ fontSize: 13 }}>
                        {alert.description}
                        <br />
                        <span style={{ color: '#94A3B8' }}>
                          {new Date(alert.createdAt).toLocaleString('ru-RU')}
                        </span>
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
