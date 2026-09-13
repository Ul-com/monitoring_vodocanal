import React, { useEffect } from 'react';
import { Row, Col, Card, Empty } from 'antd';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useStore } from '../store';
import { STATUS_META } from '../objectTypes';

const SERIES = '#2a78d6';
const GRID = '#E2E8F0';
const AXIS_TEXT = '#64748B';

const tooltipStyle = {
  borderRadius: 10,
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
  fontSize: 13,
};

const KpiTile: React.FC<{
  label: string;
  value: React.ReactNode;
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

const StatisticsPage: React.FC = () => {
  const { statistics, fetchStatistics } = useStore();

  useEffect(() => {
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 15000);
    return () => clearInterval(interval);
  }, []);

  const {
    statusCounts = {},
    alertsByType = {},
    alertsByDay = {},
    totalObjects = 0,
    activeAlerts = 0,
    resolvedAlerts = 0,
    averageDetectionTime = '—',
  } = statistics ?? {};

  const statusData = (Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>)
    .filter(key => statusCounts[key])
    .map(key => ({
      name: STATUS_META[key].label,
      value: statusCounts[key],
      color: STATUS_META[key].color,
    }));

  const typeData = Object.keys(alertsByType)
    .map(key => ({ name: key, value: alertsByType[key] }))
    .sort((a, b) => b.value - a.value);

  const dayData = Object.keys(alertsByDay)
    .sort()
    .map(key => {
      const [year, month, day] = key.split('-').map(Number);
      return {
        date: new Date(year, month - 1, day).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
        count: alertsByDay[key],
      };
    });

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Статистика</h1>
          <p className="page__subtitle">Сводные показатели работы системы мониторинга</p>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} lg={6}>
          <KpiTile label="Всего объектов" value={totalObjects} icon={<AppstoreOutlined />} />
        </Col>
        <Col xs={12} lg={6}>
          <KpiTile label="Активных алармов" value={activeAlerts} icon={<ExclamationCircleOutlined />} tone="danger" />
        </Col>
        <Col xs={12} lg={6}>
          <KpiTile label="Закрытых алармов" value={resolvedAlerts} icon={<CheckCircleOutlined />} tone="success" />
        </Col>
        <Col xs={12} lg={6}>
          <KpiTile label="Среднее время обнаружения" value={averageDetectionTime} icon={<ClockCircleOutlined />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={10}>
          <Card title="Статусы объектов" styles={{ body: { height: 320 } }}>
            {statusData.length === 0 ? (
              <Empty description="Нет данных" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={96}
                    paddingAngle={2}
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {statusData.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} объектов`, '']} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card title="Алармы по типам" styles={{ body: { height: 320 } }}>
            {typeData.length === 0 ? (
              <Empty description="Нет данных" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} layout="vertical" margin={{ left: 8, right: 32 }}>
                  <CartesianGrid horizontal={false} stroke={GRID} />
                  <XAxis type="number" allowDecimals={false} stroke={AXIS_TEXT} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    stroke={AXIS_TEXT}
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#F1F5F9' }} />
                  <Bar dataKey="value" fill={SERIES} radius={[0, 4, 4, 0]} barSize={18} name="Алармов">
                    <LabelList dataKey="value" position="right" fill={AXIS_TEXT} fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Динамика алармов по дням" styles={{ body: { height: 300 } }}>
            {dayData.length === 0 ? (
              <Empty description="Нет данных" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dayData} margin={{ left: 8, right: 16 }}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="date" stroke={AXIS_TEXT} fontSize={12} tickLine={false} />
                  <YAxis allowDecimals={false} stroke={AXIS_TEXT} fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Алармов']} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={SERIES}
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
