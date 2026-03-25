import { api } from '../config/api';
import { Campus } from '../types/campus.types'

export const getAllCampus = async () => {
  return await api.get<Campus[]>('/campus');
};

export const getCampus = async (id: number) => {
  return await api.get<Campus>(`/campus/${id}`);
}

export const register = async (campus: Campus) => {
  return await api.post('/campus', campus);
};
