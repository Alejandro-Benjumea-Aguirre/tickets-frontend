import { api } from '../config/api';

export const getCampus = () => {
  return api.get('/campus');
};
