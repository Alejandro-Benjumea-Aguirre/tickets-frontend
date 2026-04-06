import { api } from '../../../config/api'
import { TicketComment } from '../types/tickets.types'

export const getComments = async () => {
  return await api.get<TicketComment[]>(`/comments`)
}

export const getComment = async (id: number) => {
  return await api.get<TicketComment>(`/comments/${id}`)
}

export const setComment = async (comment: TicketComment) => {
  return await api.post('/comments', comment)
}

export const updateComment = async (id: number, comment: TicketComment) => {
  return await api.patch(`/comments/${id}`, comment)
}

export const updateStatus = async (id: number, status: number) => {
  return await api.patch(`/comments/${id}/status`, status)
}
