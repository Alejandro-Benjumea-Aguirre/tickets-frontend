import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/dashboard/DashboardPage';

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};
