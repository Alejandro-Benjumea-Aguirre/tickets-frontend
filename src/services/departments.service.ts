import { api } from '../config/api'

export const getDepartments = () => {
  return api.get('/departments')
}

export const getDepartment = (id: number) => {
  return api.get(`/departments/${id}`)
}

export const setDepartment = (department: Departments) => {
  return api.post('/departments', department)
}
