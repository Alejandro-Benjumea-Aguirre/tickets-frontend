import api from '../config/api';

export const getRoles = () => {
  return api.get('/roles');
};
