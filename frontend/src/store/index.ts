import { create } from 'zustand';
import { Object, Alert, User } from '../types';
import { objectsApi, alertsApi, usersApi, statisticsApi } from '../api/endpoints';

interface AppState {
  objects: Object[];
  alerts: Alert[];
  users: User[];
  statistics: any;
  loading: boolean;
  error: string | null;
  currentUser: User | null;
  // actions
  fetchObjects: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  addObject: (obj: Partial<Object>) => Promise<void>;
  updateObject: (id: string, obj: Partial<Object>) => Promise<void>;
  deleteObject: (id: string) => Promise<void>;
  resolveAlert: (id: string) => Promise<void>;
  addUser: (user: Partial<User> & { password?: string }) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  setCurrentUser: (user: User | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  objects: [],
  alerts: [],
  users: [],
  statistics: {},
  loading: false,
  error: null,
  currentUser: null,

  fetchObjects: async () => {
    set({ loading: true });
    try {
      const res = await objectsApi.getAll();
      set({ objects: res.data, loading: false });
    } catch (e) {
      set({ error: 'Failed to fetch objects', loading: false });
    }
  },
  fetchAlerts: async () => {
    set({ loading: true });
    try {
      const res = await alertsApi.getAll();
      set({ alerts: res.data, loading: false });
    } catch (e) {
      set({ error: 'Failed to fetch alerts', loading: false });
    }
  },
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const res = await usersApi.getAll();
      set({ users: res.data, loading: false });
    } catch (e) {
      set({ error: 'Failed to fetch users', loading: false });
    }
  },
  fetchStatistics: async () => {
    set({ loading: true });
    try {
      const res = await statisticsApi.get();
      set({ statistics: res.data, loading: false });
    } catch (e) {
      set({ error: 'Failed to fetch statistics', loading: false });
    }
  },
  addObject: async (obj) => {
    try {
      const res = await objectsApi.create(obj);
      set({ objects: [...get().objects, res.data] });
    } catch (e) {
      set({ error: 'Failed to add object' });
    }
  },
  updateObject: async (id, obj) => {
    try {
      const res = await objectsApi.update(id, obj);
      set({ objects: get().objects.map(o => o.id === id ? res.data : o) });
    } catch (e) {
      set({ error: 'Failed to update object' });
    }
  },
  deleteObject: async (id) => {
    try {
      await objectsApi.delete(id);
      set({ objects: get().objects.filter(o => o.id !== id) });
    } catch (e) {
      set({ error: 'Failed to delete object' });
    }
  },
  resolveAlert: async (id) => {
    try {
      const res = await alertsApi.resolve(id);
      set({ alerts: get().alerts.map(a => a.id === id ? res.data : a) });
    } catch (e) {
      set({ error: 'Failed to resolve alert' });
    }
  },
  addUser: async (user) => {
    try {
      const res = await usersApi.create(user);
      set({ users: [...get().users, res.data] });
    } catch (e) {
      set({ error: 'Failed to add user' });
    }
  },
  updateUser: async (id, user) => {
    try {
      const res = await usersApi.update(id, user);
      set({ users: get().users.map(u => u.id === id ? res.data : u) });
    } catch (e) {
      set({ error: 'Failed to update user' });
    }
  },
  deleteUser: async (id) => {
    try {
      await usersApi.delete(id);
      set({ users: get().users.filter(u => u.id !== id) });
    } catch (e) {
      set({ error: 'Failed to delete user' });
    }
  },
  login: async (email, password) => {
    try {
      const res = await usersApi.login(email, password);
      set({ currentUser: res.data.user, error: null });
      return true;
    } catch (e: any) {
      set({
        error: e?.response?.status === 401
          ? 'Неверный логин или пароль'
          : 'Сервер не отвечает. Проверьте, что backend запущен на порту 5001.',
      });
      return false;
    }
  },
  setCurrentUser: (user) => set({ currentUser: user }),
}));