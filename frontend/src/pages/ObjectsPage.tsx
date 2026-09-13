import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Space, Card, Input, Select, Tooltip } from 'antd';
import { EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useStore } from '../store';
import StatusBadge from '../components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Object as AppObject, Status } from '../types';
import { objectTypeMeta } from '../objectTypes';

const ObjectsPage: React.FC = () => {
  const { objects, fetchObjects } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status | undefined>();

  useEffect(() => {
    fetchObjects();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return objects.filter(obj => {
      if (status && obj.status !== status) return false;
      if (!query) return true;
      return `${obj.name} ${obj.address}`.toLowerCase().includes(query);
    });
  }, [objects, search, status]);

  const columns = [
    {
      title: 'Объект',
      dataIndex: 'name',
      key: 'name',
      render: (_: unknown, record: AppObject) => {
        const { label, Icon } = objectTypeMeta(record.type);
        return (
          <Space>
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 34,
                height: 34,
                borderRadius: 10,
                background: '#E6F0FA',
                color: '#003366',
              }}
            >
              <Icon />
            </span>
            <span>
              <div style={{ fontWeight: 500 }}>{record.name}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>{label}</div>
            </span>
          </Space>
        );
      },
      sorter: (a: AppObject, b: AppObject) => a.name.localeCompare(b.name, 'ru'),
    },
    { title: 'Адрес', dataIndex: 'address', key: 'address' },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (value: Status) => <StatusBadge status={value} />,
      filters: [
        { text: 'Норма', value: 'green' },
        { text: 'Предупреждение', value: 'yellow' },
        { text: 'Критично', value: 'red' },
      ],
      onFilter: (value: any, record: AppObject) => record.status === value,
    },
    {
      title: 'Устройств',
      dataIndex: 'devices',
      key: 'devices',
      align: 'center' as const,
      render: (devices: AppObject['devices']) => <span className="tabular">{devices?.length ?? 0}</span>,
      sorter: (a: AppObject, b: AppObject) => (a.devices?.length ?? 0) - (b.devices?.length ?? 0),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: unknown, record: AppObject) => (
        <Tooltip title="Редактировать объект">
          <Button
            type="text"
            icon={<EditOutlined />}
            aria-label={`Редактировать ${record.name}`}
            onClick={() => navigate(`/constructor?id=${record.id}`)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Объекты</h1>
          <p className="page__subtitle">Инфраструктура под наблюдением и её текущее состояние</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/constructor')}>
          Добавить объект
        </Button>
      </div>

      <Card styles={{ body: { padding: 16 } }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            allowClear
            placeholder="Поиск по названию или адресу"
            prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
          <Select
            allowClear
            placeholder="Все статусы"
            value={status}
            onChange={setStatus}
            style={{ width: 200 }}
            options={[
              { value: 'green', label: 'Норма' },
              { value: 'yellow', label: 'Предупреждение' },
              { value: 'red', label: 'Критично' },
            ]}
          />
        </Space>
        <Table
          rowKey="id"
          dataSource={filtered}
          columns={columns}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
        />
      </Card>
    </div>
  );
};

export default ObjectsPage;
