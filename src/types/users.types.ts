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
  phone?: string
  client?: string
  created_at?: string
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
