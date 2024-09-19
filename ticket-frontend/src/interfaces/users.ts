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
  user: User | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (user: User) => Promise<void>;
  logoutUser: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}