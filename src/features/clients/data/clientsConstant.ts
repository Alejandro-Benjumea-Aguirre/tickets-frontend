import { Client, ClientFilters, CreateClientForm } from '../types/clients.types';

// ── Mock data ──────────────────────────────────────────────────────────────────

export const MOCK_CLIENTS: Client[] = [
  { id: 1,  name: 'Empresa ABC',           email: 'contacto@empresaabc.com',   phone: '601 234 5678', engineer: 'Carlos Ramírez',  status: 'active',   createdAt: '2024-11-05' },
  { id: 2,  name: 'Tech Solutions',        email: 'info@techsolutions.com',     phone: '601 987 6543', engineer: 'Laura Méndez',    status: 'active',   createdAt: '2024-12-01' },
  { id: 3,  name: 'Global Corp',           email: 'soporte@globalcorp.com',     phone: '604 456 7890', engineer: 'Diego Fernández', status: 'active',   createdAt: '2025-01-14' },
  { id: 4,  name: 'Constructora XY',       email: 'admin@constructoraxy.com',   phone: '607 321 0987', engineer: 'Laura Méndez',    status: 'inactive', createdAt: '2025-01-28' },
  { id: 5,  name: 'Finanzas SA',           email: 'it@finanzassa.com',          phone: '602 654 3210', engineer: 'Carlos Ramírez',  status: 'active',   createdAt: '2025-02-10' },
  { id: 6,  name: 'Distribuidora Norte',   email: 'sistemas@distnorte.com',     phone: '605 789 4561', engineer: 'Diego Fernández', status: 'active',   createdAt: '2025-02-20' },
  { id: 7,  name: 'Inversiones del Valle', email: 'contacto@invvalle.com',      phone: '603 147 2589', engineer: 'Paola Sánchez',   status: 'inactive', createdAt: '2025-03-02' },
  { id: 8,  name: 'Soluciones Integrales', email: 'soporte@solint.com',         phone: '606 258 3690', engineer: 'Paola Sánchez',   status: 'active',   createdAt: '2025-03-12' },
];

export const EMPTY_FILTERS: ClientFilters = {
  name:       '',
  email:      '',
  phone:      '',
  engineer:   '',
  status:     '',
  fechaDesde: '',
  fechaHasta: '',
};

export const EMPTY_FORM: CreateClientForm = {
  name:     '',
  email:    '',
  phone:    '',
  engineer: '',
};