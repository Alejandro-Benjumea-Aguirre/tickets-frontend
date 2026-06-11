import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 1. Importar el proveedor global de Toasts
import { AuthProvider } from './features/auth/context/AuthContext';
import { ThemeProvider } from './features/theme/ThemeContext';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import UsersPage from './features/users/pages/UsersPage';
import ClientsPage from './features/clients/pages/ClientsPage';
import SucesosPage from './features/sucesos/pages/SucesosPage';
import ReportesPage from './features/reportes/pages/ReportesPage';
import EstadisticasPage from './features/estadisticas/pages/EstadisticasPage';
import TicketDetailPage from './features/tickets/pages/TicketDetailPage';
import PrivateRoute from './router/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>

        <Toaster 
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4500,
            style: {
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            },
          }}
        />

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