import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { ThemeProvider } from './features/theme/ThemeContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersPage from './pages/users/UsersPage';
import ClientsPage from './pages/clients/ClientsPage';
import SucesosPage from './pages/sucesos/SucesosPage';
import ReportesPage from './pages/reportes/ReportesPage';
import EstadisticasPage from './pages/estadisticas/EstadisticasPage';
import TicketDetailPage from './pages/tickets/TicketDetailPage';
import PrivateRoute from './router/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute>
                  <UsersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/clientes"
              element={
                <PrivateRoute>
                  <ClientsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/sucesos"
              element={
                <PrivateRoute>
                  <SucesosPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reportes"
              element={
                <PrivateRoute>
                  <ReportesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/estadisticas"
              element={
                <PrivateRoute>
                  <EstadisticasPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/tickets/:id"
              element={
                <PrivateRoute>
                  <TicketDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Navigate to="/dashboard" replace />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
