import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, login, register, logout } from '../services/authService';
import { AuthProviderProps, AuthContextType, User } from '../../users/types/users.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const MOCK_USER: User = {
  id: 1,
  username: "alejandro_admin",
  name: "Alejandro Benjumea Aguirre",
  email: "alejandro.admin@empresa.com.co",
  status: "Activo",
  rol: "admin",
  rol_id: 1,
  status_id: 1,
  department_id: 5,
  campus_id: 2,
  password: "",
  phone: "3001234567",
  client: "Soluciones Tech SAS",
  created_at: "2026-04-29 08:30:00"
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const loginUser = async (username: string, password: string) => {
    const isMockEnabled = import.meta.env.VITE_USE_MOCK === 'true';

    if (isMockEnabled) {
      console.warn("⚠️ Iniciando sesión con datos MOCK (Simulados)");
      
      await new Promise(resolve => setTimeout(resolve, 500));

      localStorage.setItem("user", JSON.stringify(MOCK_USER));
      setUser(MOCK_USER);
      return;
    }

    try {
      const response = await login(username, password);
      
      if (response.data.error) {
        throw new Error(String(response.data.body));
      }

      if (response.data.body) {
        localStorage.setItem("user", JSON.stringify(response.data.body));
        setUser(response.data.body);
      }
    } catch (error) {
      console.error("Error en el login real:", error);
      throw error;
    }
  };

  const registerUser = async (user: User) => {
    await register(user);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  const updateUser = (updates: { email?: string; phone?: string }) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
