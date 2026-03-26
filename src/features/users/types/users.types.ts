import { ReactNode } from "react"

export interface User {
  id: number
  username: string
  name: string
  email: string
  status?: string
  rol?: string
  rol_id: number
  status_id?: number
  department_id?: number
  campus_id?: number
  password?: string
  phone?: string
  client?: string
  created_at: string
}

export interface AuthContextType {
  user: User | null;
  loginUser: (username: string, password: string) => Promise<void>;
  registerUser: (user: User) => Promise<void>;
  logoutUser: () => void;
  updateUser: (updates: { email?: string; phone?: string }) => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface UserFilters {
  name: string;
  rol_id: string;
  fechaDesde: string;
  fechaHasta: string;
  status: string;
}

export interface CreateUserForm {
  name: string;
  client: string;
  rol_id: string;
  password: string;
  email: string;
  phone: string;
}
