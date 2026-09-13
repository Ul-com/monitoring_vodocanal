import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Card, Tag, Avatar, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons';
import { useStore } from '../store';
import { User } from '../types';

const ROLE_META: Record<string, { label: string; color: string }> = {
  admin: { label: 'Администратор', color: 'blue' },
  engineer: { label: 'Инженер', color: 'cyan' },
  viewer: { label: 'Наблюдатель', color: 'default' },
};

const UsersPage: React.FC = () => {
  const { users, fetchUsers, addUser, updateUser, deleteUser, currentUser } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: 'Удалить пользователя?',
      content: `${user.name} (${user.email}) потеряет доступ к системе.`,
      okText: 'Удалить',
      okButtonProps: { danger: true },
      cancelText: 'Отмена',
      onOk: () => deleteUser(user.id),
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values);
        message.success('Пользователь обновлён');
      } else {
        await addUser(values);
        message.success('Пользователь создан');
      }
      setModalVisible(false);
    } catch (e) {
      message.error('Не удалось сохранить пользователя');
    }
  };

  const columns = [
    {
      title: 'Пользователь',
      dataIndex: 'name',
      key: 'name',
      render: (_: unknown, record: User) => (
        <Space>
          <Avatar style={{ background: '#E6F0FA', color: '#003366' }}>{record.name.charAt(0)}</Avatar>
          <span>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{record.email}</div>
          </span>
        </Space>
      ),
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color={ROLE_META[role]?.color}>{ROLE_META[role]?.label ?? role}</Tag>,
    },
    {
      title: 'Доступ',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>{active ? 'Активен' : 'Заблокирован'}</Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 110,
      render: (_: unknown, record: User) => (
        <Space>
          <Tooltip title="Редактировать">
            <Button type="text" icon={<EditOutlined />} aria-label="Редактировать" onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title={record.id === currentUser?.id ? 'Нельзя удалить себя' : 'Удалить'}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label="Удалить"
              disabled={record.id === currentUser?.id}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Пользователи</h1>
          <p className="page__subtitle">Доступ к системе и роли сотрудников</p>
        </div>
        <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>
          Добавить пользователя
        </Button>
      </div>

      <Card styles={{ body: { padding: 16 } }}>
        <Table rowKey="id" dataSource={users} columns={columns} pagination={{ hideOnSinglePage: true }} />
      </Card>

      <Modal
        title={editingUser ? 'Редактирование пользователя' : 'Новый пользователь'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Укажите имя' }]}>
            <Input placeholder="Иванов Иван" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Электронная почта"
            rules={[{ required: true, type: 'email', message: 'Укажите корректный адрес' }]}
          >
            <Input placeholder="ivanov@mosvodokanal.ru" />
          </Form.Item>
          <Form.Item name="role" label="Роль" rules={[{ required: true, message: 'Выберите роль' }]}>
            <Select
              options={[
                { value: 'admin', label: 'Администратор — полный доступ' },
                { value: 'engineer', label: 'Инженер — работа с алармами' },
                { value: 'viewer', label: 'Наблюдатель — только просмотр' },
              ]}
            />
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Задайте пароль' }]}>
              <Input.Password autoComplete="new-password" />
            </Form.Item>
          )}
          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Сохранить
              </Button>
              <Button onClick={() => setModalVisible(false)}>Отмена</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
