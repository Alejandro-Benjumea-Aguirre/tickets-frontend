import axios from 'axios';

const URL = import.meta.env.VITE_APP_URL_API ? import.meta.env.VITE_APP_URL_API : 'localhost:8000';

export const getCampus = () => {
  return axios.get(`${URL}/campus`);
};