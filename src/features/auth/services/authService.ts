import api from '../../../config/api';
import { User } from '../../../types/users.types';

export const login = (username: string, password: string) => {
  return api.post('/auth/login', { username, password });
};

export const register = (user: User) => {
  return api.post('/users', user);
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
