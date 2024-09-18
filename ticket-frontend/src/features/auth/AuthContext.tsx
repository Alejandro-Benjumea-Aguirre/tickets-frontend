import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, login, register, logout } from '../../services/authService';
import { AuthContextType, User } from '../../interfaces/users';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const loginUser = async (email: string, password: string) => {
    const response = await login(email, password);
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    }
  };

  const registerUser = async (user: User) => {
    await register(user);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
