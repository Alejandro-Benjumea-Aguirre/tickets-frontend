import api from '../../../config/api';
import { User } from '../../../types/users.types';

// ── Mock users (demo) ─────────────────────────────────────────────────────────

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin123',
    user: {
      username: 'admin',
      name: 'Carlos Ramírez',
      email: 'admin@tickets.com',
      rol_id: 1,
      state_id: 1,
      department_id: 1,
      campus_id: 1,
      password: '',
      phone: '+57 300 123 4567',
      client: 'Interna',
      created_at: '2024-01-15',
    },
  },
  agente: {
    password: 'agente123',
    user: {
      username: 'agente',
      name: 'Laura Méndez',
      email: 'agente@tickets.com',
      rol_id: 2,
      state_id: 1,
      department_id: 2,
      campus_id: 1,
      password: '',
      phone: '+57 310 987 6543',
      client: 'Interna',
      created_at: '2024-03-20',
    },
  },
  cliente: {
    password: 'cliente123',
    user: {
      username: 'cliente',
      name: 'Ana Torres',
      email: 'cliente@tickets.com',
      rol_id: 3,
      state_id: 1,
      department_id: undefined,
      campus_id: undefined,
      password: '',
      phone: '+57 320 456 7890',
      client: 'Empresa ABC',
      created_at: '2024-06-01',
    },
  },
};

export const getUserEmail = (username: string): { found: boolean; email: string | null } => {
  const mock = MOCK_USERS[username];
  if (!mock) return { found: false, email: null };
  const email = mock.user.email;
  return { found: true, email: email && email.includes('@') ? email : null };
};

export const login = (username: string, password: string) => {
  const mock = MOCK_USERS[username];
  if (mock && mock.password === password) {
    return Promise.resolve({ data: { body: mock.user } });
  }
  return api.post('/auth/login', { username, password });
};

export const register = (user: User) => {
  return api.post('/users', user);
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
