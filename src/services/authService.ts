import axios from 'axios';
import { User } from '../interfaces/users';

const URL = import.meta.env.VITE_APP_URL_API ? import.meta.env.VITE_APP_URL_API : 'http://localhost:3000/api';

export const login = (username: string, password: string) => {
  return axios.post(`${URL}/auth/login`, { username, password });
};

export const register = (user: User) => {
  return axios.post(`${URL}/users`, user);
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};