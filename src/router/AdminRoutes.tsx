import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../features/dashboard/pages/DashboardPage';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};
