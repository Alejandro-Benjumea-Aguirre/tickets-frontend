import { api } from '../../../config/api';
import { TicketDetail } from '../types/tickets.types';

export const getTickets = async () => {
  return await api.get<TicketDetail[]>(`/tickets`);
};

export const getTicket = async (id: number) => {
  return await api.get<TicketDetail>(`/tickets/${id}`);
};

export const setTicket = async (ticket: TicketDetail) => {
  return await api.post('/tickets', ticket);
};

export const updateTicket = async (id: number, ticket: TicketDetail) => {
  return await api.patch(`/tickets/${id}`, ticket);
};

export const updateStatus = async (id: number, status: number) => {
  return await api.patch(`/tickets/${id}/status`, status);
};
