import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/users" element={<ManageUsers />} />
    </Routes>
  );
};