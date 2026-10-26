import { apiFetch } from './client';
import { User } from '../types';

export const authApi = {
  login: (username: string, password: string, role: string) =>
    apiFetch<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role })
    }),

  getFarmers: () => apiFetch<User[]>('/api/auth/farmers'),

  createFarmer: (farmer: Partial<User> & { password: string }) =>
    apiFetch<User>('/api/auth/farmers', {
      method: 'POST',
      body: JSON.stringify(farmer)
    }),

  deleteFarmer: (id: string) =>
    apiFetch<{ message: string; id: string }>(`/api/auth/farmers/${id}`, {
      method: 'DELETE'
    }),

  assignFarms: (userId: string, farmIds: string[]) =>
    apiFetch<User>(`/api/auth/farmers/${userId}/farms`, {
      method: 'PUT',
      body: JSON.stringify({ farmIds })
    })
};
