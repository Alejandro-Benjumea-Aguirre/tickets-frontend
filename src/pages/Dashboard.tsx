import { useContext } from 'react';
import { AuthContext } from '../features/auth/AuthContext';
import { Navbar } from '../layouts/Navbar';

const Dashboard = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Error: AuthContext no está disponible</div>;
  }

  const { user, logoutUser } = authContext;

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />
    </>
  );
};

export default Dashboard;
