import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/dashboard/DashboardPage';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};
