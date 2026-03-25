import { api } from '../../../config/api';
import { User } from '../../users/types/users.types';

export const getUsername = async (username: string) => {
  return await api.get<User>(`/users/username/${username}`);
};

export const login = async (username: string, password: string) => {
  return await api.post('/auth/login', { username, password });
};

export const register = async (user: User) => {
  return await api.post('/users', user);
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
