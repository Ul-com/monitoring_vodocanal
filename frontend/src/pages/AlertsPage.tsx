import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Button, Space, Select, Modal, Card, Empty } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useStore } from '../store';
import { Alert } from '../types';

const PRIORITY_META: Record<string, { color: string; label: string }> = {
  high: { color: 'error', label: 'Высокий' },
  medium: { color: 'warning', label: 'Средний' },
  low: { color: 'default', label: 'Низкий' },
};

const AlertsPage: React.FC = () => {
  const { alerts, objects, fetchAlerts, fetchObjects, resolveAlert, currentUser } = useStore();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterType, setFilterType] = useState<string | undefined>();

  useEffect(() => {
    fetchAlerts();
    fetchObjects();
  }, []);

  const objectNames = useMemo(
    () => Object.fromEntries(objects.map(o => [o.id, o.name])),
    [objects]
  );

  const filteredAlerts = useMemo(
    () =>
      alerts.filter(a => {
        if (filterStatus && a.status !== filterStatus) return false;
        if (filterType && a.type !== filterType) return false;
        return true;
      }),
    [alerts, filterStatus, filterType]
  );

  const canResolve = currentUser?.role === 'admin' || currentUser?.role === 'engineer';

  const handleResolve = (record: Alert) => {
    Modal.confirm({
      title: 'Закрыть инцидент?',
      content: `«${record.type}» — ${record.description}`,
      okText: 'Закрыть инцидент',
      cancelText: 'Отмена',
      onOk: () => resolveAlert(record.id),
    });
  };

  const columns = [
    {
      title: 'Время',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (value: string) => (
        <span className="tabular">{new Date(value).toLocaleString('ru-RU')}</span>
      ),
      sorter: (a: Alert, b: Alert) => +new Date(a.createdAt) - +new Date(b.createdAt),
      defaultSortOrder: 'descend' as const,
    },
    { title: 'Тип', dataIndex: 'type', key: 'type', render: (v: string) => <b>{v}</b> },
    {
      title: 'Объект',
      dataIndex: 'objectId',
      key: 'objectId',
      render: (id: string) => objectNames[id] ?? '—',
    },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: (p: string) => <Tag color={PRIORITY_META[p]?.color}>{PRIORITY_META[p]?.label ?? p}</Tag>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s: string) => (
        <Tag color={s === 'active' ? 'error' : 'success'}>{s === 'active' ? 'Активен' : 'Закрыт'}</Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 130,
      render: (_: unknown, record: Alert) =>
        record.status === 'active' && canResolve ? (
          <Button size="small" icon={<CheckOutlined />} onClick={() => handleResolve(record)}>
            Закрыть
          </Button>
        ) : null,
    },
  ];

  const typeOptions = [...new Set(alerts.map(a => a.type))].map(t => ({ value: t, label: t }));
  const activeCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Алармы</h1>
          <p className="page__subtitle">
            Активных инцидентов: <b>{activeCount}</b> из {alerts.length}
          </p>
        </div>
      </div>

      <Card styles={{ body: { padding: 16 } }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            placeholder="Все статусы"
            allowClear
            onChange={setFilterStatus}
            style={{ width: 180 }}
            options={[
              { value: 'active', label: 'Активные' },
              { value: 'resolved', label: 'Закрытые' },
            ]}
          />
          <Select
            placeholder="Все типы"
            allowClear
            onChange={setFilterType}
            style={{ width: 220 }}
            options={typeOptions}
          />
        </Space>
        <Table
          rowKey="id"
          dataSource={filteredAlerts}
          columns={columns}
          locale={{ emptyText: <Empty description="Инцидентов не найдено" /> }}
          pagination={{ pageSize: 12, hideOnSinglePage: true }}
        />
      </Card>
    </div>
  );
};

export default AlertsPage;
