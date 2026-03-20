import api from '../config/api';

export const getDepartments = () => {
  return api.get('/departments');
};
