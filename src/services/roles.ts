import axios from 'axios';

const URL = import.meta.env.VITE_APP_URL_API ? import.meta.env.VITE_APP_URL_API : 'localhost:3000/api';

export const getRoles = () => {
  return axios.get(`${URL}/roles`, {
    withCredentials: true,
  });
};