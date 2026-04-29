import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../features/dashboard/pages/DashboardPage';

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};
