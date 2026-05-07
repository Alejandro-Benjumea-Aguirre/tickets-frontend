import { CreateUserForm, User, UserFilters } from '../types/users.types';


// ── Mock data ──────────────────────────────────────────────────────────────────

export const CLIENTES_OPTIONS = [
  { value: 'abc',  label: 'Empresa ABC' },
  { value: 'tech', label: 'Tech Solutions' },
  { value: 'glob', label: 'Global Corp' },
  { value: 'cons', label: 'Constructora XY' },
  { value: 'fin',  label: 'Finanzas SA' },
];

export const ROLES_OPTIONS = [
  { value: '1', label: 'Administrador' },
  { value: '2', label: 'Agente' },
  { value: '3', label: 'Cliente' },
];

export const EMPTY_FILTERS: UserFilters = {
  name:       '',
  rol_id:     '',
  fechaDesde: '',
  fechaHasta: '',
  status:     '',
};

export const EMPTY_FORM: CreateUserForm = {
  name:     '',
  client:   '',
  rol_id:   '',
  password: '',
  email:    '',
  phone:    '',
};

export const roleColors: Record<number, { bg: string; color: string }> = {
  1: { bg: '#E1F5EE', color: '#0F6E56' },
  2: { bg: '#E6F1FB', color: '#185FA5' },
  3: { bg: '#F5F0FF', color: '#6B3FA0' },
};

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'abenjumea',
    name: 'Alejandro Benjumea',
    email: 'abenjumea@empresa.com',
    phone: '300 111 2233',
    rol: 'Administrador',
    rol_id: 1,
    status: 'active',
    client: '',
    created_at: '2024-10-15',
  },
  {
    id: 2,
    username: 'cgomez',
    name: 'Carlos Gómez',
    email: 'cgomez@empresa.com',
    phone: '310 222 3344',
    rol: 'Agente',
    rol_id: 2,
    status: 'active',
    client: '',
    created_at: '2024-11-01',
  },
  {
    id: 3,
    username: 'lmendez',
    name: 'Laura Méndez',
    email: 'lmendez@empresa.com',
    phone: '320 333 4455',
    rol: 'Agente',
    rol_id: 2,
    status: 'active',
    client: '',
    created_at: '2024-11-20',
  },
  {
    id: 4,
    username: 'dfernandez',
    name: 'Diego Fernández',
    email: 'dfernandez@empresa.com',
    phone: '315 444 5566',
    rol: 'Agente',
    rol_id: 2,
    status: 'inactive',
    client: '',
    created_at: '2024-12-03',
  },
  {
    id: 5,
    username: 'jrodriguez',
    name: 'Juliana Rodríguez',
    email: 'jrodriguez@empresaabc.com',
    phone: '301 555 6677',
    rol: 'Cliente',
    rol_id: 3,
    status: 'active',
    client: 'Empresa ABC',
    created_at: '2025-01-10',
  },
  {
    id: 6,
    username: 'mmorales',
    name: 'Miguel Morales',
    email: 'mmorales@techsolutions.com',
    phone: '312 666 7788',
    rol: 'Cliente',
    rol_id: 3,
    status: 'active',
    client: 'Tech Solutions',
    created_at: '2025-01-22',
  },
  {
    id: 7,
    username: 'psanchez',
    name: 'Paola Sánchez',
    email: 'psanchez@empresa.com',
    phone: '323 777 8899',
    rol: 'Agente',
    rol_id: 2,
    status: 'active',
    client: '',
    created_at: '2025-02-05',
  },
  {
    id: 8,
    username: 'ncastro',
    name: 'Natalia Castro',
    email: 'ncastro@globalcorp.com',
    phone: '305 888 9900',
    rol: 'Cliente',
    rol_id: 3,
    status: 'inactive',
    client: 'Global Corp',
    created_at: '2025-02-18',
  },
];
