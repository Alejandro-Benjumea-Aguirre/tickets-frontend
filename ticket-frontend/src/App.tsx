import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './features/auth/PrivateRoute';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
