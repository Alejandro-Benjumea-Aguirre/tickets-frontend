import { api } from '../../../config/api';
import { User } from '../types/users.types';

export const getUsers = async () => {
  return await api.get<User[]>(`/users`);
};

export const getUser = async (id: number) => {
  return await api.get(`/users/${id}`);
};

export const setUser = async (user: User) => {
  return await api.post('/users', user);
};

export const updateUser = async (id: number, user: User) => {
  return await api.patch(`/users/${id}`, user);
};

export const updateStatus = async (id: number, status: number) => {
  return await api.patch(`/users/${id}/status`, { status });
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
