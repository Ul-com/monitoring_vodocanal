export type Status = 'green' | 'yellow' | 'red';

export type ObjectType =
  | 'pumping'
  | 'reservoir'
  | 'treatment'
  | 'warehouse'
  | 'office'
  | 'tower'
  | 'terminal'
  | 'other';

export interface Device {
  id: string;
  objectId: string;
  type: 'modem' | 'sensor' | 'camera';
  imei?: string;
  iccid?: string;
  apn?: string;
  ip?: string;
  serial?: string;
  installedAt?: string;
  lastHeartbeat?: string;
  status: Status;
}

export interface Object {
  id: string;
  name: string;
  type: ObjectType;
  address: string;
  lat: number;
  lng: number;
  description?: string;
  createdAt: string;
  status: Status;
  devices: Device[];
}

export interface Alert {
  id: string;
  objectId: string;
  deviceId?: string;
  type: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'engineer' | 'viewer';
  active: boolean;
}
