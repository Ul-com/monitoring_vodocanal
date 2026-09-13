import client from './client';
import { Object, Alert, User } from '../types';

export const objectsApi = {
  getAll: () => client.get<Object[]>('/objects'),
  get: (id: string) => client.get<Object>(`/objects/${id}`),
  create: (data: Partial<Object>) => client.post<Object>('/objects', data),
  update: (id: string, data: Partial<Object>) => client.put<Object>(`/objects/${id}`, data),
  delete: (id: string) => client.delete(`/objects/${id}`),
};

export const alertsApi = {
  getAll: () => client.get<Alert[]>('/alerts'),
  get: (id: string) => client.get<Alert>(`/alerts/${id}`),
  create: (data: Partial<Alert>) => client.post<Alert>('/alerts', data),
  resolve: (id: string) => client.patch<Alert>(`/alerts/${id}/resolve`),
};

export const usersApi = {
  getAll: () => client.get<User[]>('/users'),
  get: (id: string) => client.get<User>(`/users/${id}`),
  create: (data: Partial<User> & { password?: string }) => client.post<User>('/users', data),
  update: (id: string, data: Partial<User>) => client.put<User>(`/users/${id}`, data),
  delete: (id: string) => client.delete(`/users/${id}`),
  login: (email: string, password: string) => client.post<{ user: User, token: string }>('/users/login', { email, password }),
};

export const statisticsApi = {
  get: () => client.get('/statistics'),
};