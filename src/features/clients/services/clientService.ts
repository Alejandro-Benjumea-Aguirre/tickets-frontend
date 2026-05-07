import { api } from '../../../config/api';
import { Client } from '../types/clients.types';

export const getClients = async () => {
  return await api.get<Client[]>(`/client`);
};

export const getClient = async (id: number) => {
  return await api.get(`/client/${id}`);
};

export const setClient = async (client: Client) => {
  return await api.post('/client', client);
};

export const updateClient = async (id: number, client: Client) => {
  return await api.patch(`/client/${id}`, client);
};

export const updateStatus = async (id: number, status: number) => {
  return await api.patch(`/client/${id}/status`, { status });
};
