import axios from 'axios';
import { User } from '../interfaces/users';

const URL = import.meta.env.VITE_APP_URL_API ? import.meta.env.VITE_APP_URL_API : 'localhost:8000';

export const login = (email: string, password: string) => {
  return axios.post(`${URL}/auth/login`, { email, password });
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