import { initialObjects, initialAlerts, initialUsers } from './mockData';
import { Object, Alert, User } from '../types';

export class InMemoryDB {
  objects: Object[] = [];
  alerts: Alert[] = [];
  users: User[] = [];

  constructor() {
    this.objects = JSON.parse(JSON.stringify(initialObjects));
    this.alerts = JSON.parse(JSON.stringify(initialAlerts));
    this.users = JSON.parse(JSON.stringify(initialUsers));
  }

  // Вспомогательные методы для поиска
  findObject(id: string) { return this.objects.find(o => o.id === id); }
  findAlert(id: string) { return this.alerts.find(a => a.id === id); }
  findUser(id: string) { return this.users.find(u => u.id === id); }
  findUserByEmail(email: string) { return this.users.find(u => u.email === email); }
}

export const db = new InMemoryDB();