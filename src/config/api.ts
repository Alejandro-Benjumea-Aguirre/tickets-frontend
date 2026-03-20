import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL_API ?? 'http://localhost:3000/api',
  withCredentials: true,
});

export default api;
