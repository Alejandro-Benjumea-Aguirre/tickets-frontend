import { useContext } from 'react';
import { AuthContext } from '../../features/auth/context/AuthContext';
import AdminDashboardPage from './AdminDashboardPage';
import AgentDashboardPage from './AgentDashboardPage';
import ClientDashboardPage from './ClientDashboardPage';

const DashboardPage = () => {
  const authContext = useContext(AuthContext);
  const rolId = authContext?.user?.rol_id;

  if (rolId === 1) return <AdminDashboardPage />;
  if (rolId === 2) return <AgentDashboardPage />;
  return <ClientDashboardPage />;
};

export default DashboardPage;
