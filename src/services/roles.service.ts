import { api } from '../config/api';
import { Roles } from '../types/roles.types'

export const getRoles = async () => {
  return await api.get<Roles[]>('/roles');
};

export const getRol = async (id: number) => {
  return await api.get<Roles>(`/roles/${id}`)
}
