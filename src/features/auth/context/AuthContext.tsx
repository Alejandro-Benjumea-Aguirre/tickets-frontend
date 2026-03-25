import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, login, register, logout } from '../services/authService';
import { AuthProviderProps, AuthContextType, User } from '../../user/types/users.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const loginUser = async (username: string, password: string) => {
    const response = await login(username, password);
    if (response.data.error) {
      throw new Error(response.data.body);
    }
    if (response.data.body) {
      localStorage.setItem("user", JSON.stringify(response.data.body));
      setUser(response.data.body);
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
