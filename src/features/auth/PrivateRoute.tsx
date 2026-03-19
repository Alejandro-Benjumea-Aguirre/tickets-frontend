import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { AuthProviderProps } from '../../interfaces/users';

const PrivateRoute = ({ children }: AuthProviderProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;