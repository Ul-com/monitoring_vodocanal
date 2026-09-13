import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Space, Select, Row, Col } from 'antd';
import { useStore } from '../store';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ObjectType } from '../types';
import { OBJECT_TYPE_META } from '../objectTypes';
import LocationPicker from '../components/common/LocationPicker';

const typeOptions = (Object.keys(OBJECT_TYPE_META) as ObjectType[]).map(value => {
  const { label, Icon } = OBJECT_TYPE_META[value];
  return {
    value,
    label: (
      <Space>
        <Icon style={{ color: '#003366' }} />
        {label}
      </Space>
    ),
  };
});

const ConstructorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get('id');
  const { objects, addObject, updateObject, fetchObjects } = useStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const lat = Form.useWatch('lat', form);
  const lng = Form.useWatch('lng', form);
  const selectedType = Form.useWatch('type', form) as ObjectType | undefined;
  const coordsMissing = submitFailed && (typeof lat !== 'number' || typeof lng !== 'number');

  useEffect(() => {
    fetchObjects();
  }, []);

  useEffect(() => {
    if (objectId) {
      const obj = objects.find(o => o.id === objectId);
      if (obj) form.setFieldsValue(obj);
    } else {
      form.resetFields();
    }
  }, [objectId, objects]);

  const onFinish = async (values: any) => {
    setSubmitFailed(false);
    setLoading(true);
    try {
      if (objectId) {
        await updateObject(objectId, values);
        message.success('Объект обновлён');
      } else {
        await addObject(values);
        message.success('Объект создан');
      }
      navigate('/objects');
    } catch (e) {
      message.error('Не удалось сохранить объект');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">{objectId ? 'Редактирование объекта' : 'Новый объект'}</h1>
          <p className="page__subtitle">
            Тип объекта определяет значок на карте, координаты — его положение
          </p>
        </div>
      </div>

      <Card style={{ maxWidth: 760 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={() => setSubmitFailed(true)}
          initialValues={{ type: 'pumping' }}
        >
          <Form.Item name="name" label="Название" rules={[{ required: true, message: 'Укажите название' }]}>
            <Input placeholder='Например, Насосная станция «Северная»' />
          </Form.Item>

          <Form.Item name="type" label="Тип объекта" rules={[{ required: true, message: 'Выберите тип' }]}>
            <Select options={typeOptions} />
          </Form.Item>

          <Form.Item name="address" label="Адрес" rules={[{ required: true, message: 'Укажите адрес' }]}>
            <Input placeholder="Москва, ул. Северная, 1" />
          </Form.Item>

          <Form.Item
            label="Расположение на карте"
            required
            validateStatus={coordsMissing ? 'error' : undefined}
            help={coordsMissing ? 'Отметьте объект на карте' : undefined}
          >
            <LocationPicker
              lat={lat}
              lng={lng}
              type={selectedType}
              onChange={coords => form.setFieldsValue(coords)}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lat"
                label="Широта"
                rules={[{ required: true, message: 'Укажите широту' }]}
                extra="Заполняется кликом по карте, можно ввести вручную"
              >
                <InputNumber step={0.000001} min={-90} max={90} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lng"
                label="Долгота"
                rules={[{ required: true, message: 'Укажите долготу' }]}
                extra="Заполняется кликом по карте, можно ввести вручную"
              >
                <InputNumber step={0.000001} min={-180} max={180} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} placeholder="Комментарий для дежурной смены" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Сохранить
              </Button>
              <Button onClick={() => navigate('/objects')}>Отмена</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ConstructorPage;
