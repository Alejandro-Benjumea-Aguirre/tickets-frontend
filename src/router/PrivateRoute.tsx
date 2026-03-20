import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../features/auth/context/AuthContext';
import { AuthProviderProps } from '../types/users.types';

const PrivateRoute = ({ children }: AuthProviderProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
