import { api } from '../config/api';
import { Roles } from '../types/roles.types'

export const getRoles = async () => {
  return await api.get<Roles[]>('/roles')
}

export const getRol = async (id: number) => {
  return await api.get<Roles>(`/roles/${id}`)
}

export const create = async (rol: Roles) => {
  return await api.post('/roles', rol)
}

export const update = async (rol: Roles, id: string) => {
  return await api.patch(`/roles/${id}`, rol)
}

export const updateStatus = async (id: string, status: number) => {
  return await api.patch(`/roles/${id}/status`, status)
}