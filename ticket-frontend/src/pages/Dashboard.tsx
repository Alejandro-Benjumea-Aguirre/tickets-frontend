import { useContext } from 'react';
import { AuthContext } from '../features/auth/AuthContext';

const Dashboard = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Error: AuthContext no está disponible</div>;
  }

  const { user, logoutUser } = authContext;

  return (
    <div>
      <h1>Bienvenido {user?.name || 'Usuario'}</h1>
      <button onClick={logoutUser}>Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;
