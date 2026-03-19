import { DashboardRoutes } from './DashboardRoutes';
import { AdminRoutes } from './AdminRoutes';

export const AllRoutes = () => {
  return (
    <>
      <DashboardRoutes />
      <AdminRoutes />
    </>
  );
};
