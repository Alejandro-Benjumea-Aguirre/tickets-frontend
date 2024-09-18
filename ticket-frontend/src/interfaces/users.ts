import { ReactNode } from "react"

export interface User {
  username: string
  name: string
  email: string
  rol_id: number
  state_id?: number
  department_id?: number
  campus_id?: number
  password: string
}

export interface AuthContextType {
  user: User | null; // `user` puede ser `null` si no hay usuario autenticado
  logoutUser: () => void; // Función para cerrar sesión
}

export interface AuthProviderProps {
  children: ReactNode;
}