import { Object, Alert, User } from '../types';

export const initialObjects: Object[] = [
  {
    id: 'obj1',
    name: 'Склад "Северный"',
    type: 'warehouse',
    address: 'Москва, ул. Северная, 1',
    lat: 55.7558,
    lng: 37.6173,
    createdAt: new Date().toISOString(),
    status: 'green',
    devices: [
      {
        id: 'dev1',
        objectId: 'obj1',
        type: 'modem',
        imei: '123456789012345',
        iccid: '89312345678901234567',
        apn: 'corp.apn',
        ip: '10.0.1.1',
        serial: 'SN123',
        installedAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        status: 'green'
      },
      {
        id: 'dev2',
        objectId: 'obj1',
        type: 'sensor',
        serial: 'SN124',
        lastHeartbeat: new Date().toISOString(),
        status: 'green'
      }
    ]
  },
  {
    id: 'obj2',
    name: 'Терминал "Южный"',
    type: 'terminal',
    address: 'Москва, ул. Южная, 5',
    lat: 55.6558,
    lng: 37.5173,
    createdAt: new Date().toISOString(),
    status: 'green',
    devices: [
      {
        id: 'dev3',
        objectId: 'obj2',
        type: 'modem',
        imei: '987654321098765',
        iccid: '89398765432109876543',
        apn: 'corp.apn',
        ip: '10.0.2.1',
        serial: 'SN125',
        installedAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        status: 'green'
      }
    ]
  },
  {
    id: 'obj3',
    name: 'Офис "Центральный"',
    type: 'office',
    address: 'Москва, ул. Центральная, 10',
    lat: 55.8558,
    lng: 37.4173,
    createdAt: new Date().toISOString(),
    status: 'green',
    devices: [
      {
        id: 'dev4',
        objectId: 'obj3',
        type: 'modem',
        imei: '111122223333444',
        iccid: '89311112222333344445',
        apn: 'corp.apn',
        ip: '10.0.3.1',
        serial: 'SN126',
        installedAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        status: 'green'
      }
    ]
  },
  {
    id: 'obj4',
    name: 'Склад "Восточный"',
    type: 'warehouse',
    address: 'Московская обл., Балашиха, ул. Восточная, 15',
    lat: 55.7963,
    lng: 37.9382,
    createdAt: new Date().toISOString(),
    status: 'green',
    devices: [
      {
        id: 'dev5',
        objectId: 'obj4',
        type: 'modem',
        imei: '444455556666777',
        iccid: '89344445555666677778',
        apn: 'corp.apn',
        ip: '10.0.4.1',
        serial: 'SN127',
        installedAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        status: 'green'
      }
    ]
  },
  {
    id: 'obj5',
    name: 'Вышка "Западная"',
    type: 'tower',
    address: 'Московская обл., Красногорск, ул. Западная, 20',
    lat: 55.8318,
    lng: 37.3300,
    createdAt: new Date().toISOString(),
    status: 'green',
    devices: [
      {
        id: 'dev6',
        objectId: 'obj5',
        type: 'modem',
        imei: '555566667777888',
        iccid: '89355556666777788889',
        apn: 'corp.apn',
        ip: '10.0.5.1',
        serial: 'SN128',
        installedAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        status: 'green'
      }
    ]
  }
];

export const initialAlerts: Alert[] = [
  {
    id: 'alert1',
    objectId: 'obj1',
    deviceId: 'dev1',
    type: 'Подмена IMEI',
    description: 'Обнаружено два устройства с одинаковым IMEI 123456789012345',
    priority: 'high',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'alert2',
    objectId: 'obj2',
    type: 'Потеря связи',
    description: 'Heartbeat не поступает более 5 минут',
    priority: 'medium',
    status: 'resolved',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    resolvedAt: new Date(Date.now() - 600000).toISOString(),
  }
];

export const initialUsers: User[] = [
  { id: 'u1', name: 'Администратор', email: 'admin@example.com', role: 'admin', password: 'admin123', active: true },
  { id: 'u2', name: 'Инженер Иванов', email: 'engineer@example.com', role: 'engineer', password: 'eng123', active: true },
  { id: 'u3', name: 'Наблюдатель Петров', email: 'viewer@example.com', role: 'viewer', password: 'view123', active: true },
];