import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

export const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};