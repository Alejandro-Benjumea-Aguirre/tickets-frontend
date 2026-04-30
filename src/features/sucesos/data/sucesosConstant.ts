import { Suceso, SucesoFilters, CreateSucesoForm } from '../types/sucesos.types';


// ── Mock data ──────────────────────────────────────────────────────────────────

export const MOCK_SUCESOS: Suceso[] = [
  { id: 1,  name: 'Incidente',                    level: 1, parentId: null, parentName: '—',                         createdAt: '2024-10-01', status: 'active' },
  { id: 2,  name: 'Solicitud de servicio',         level: 1, parentId: null, parentName: '—',                         createdAt: '2024-10-01', status: 'active' },
  { id: 3,  name: 'Queja',                         level: 1, parentId: null, parentName: '—',                         createdAt: '2024-10-01', status: 'active' },
  { id: 4,  name: 'Consulta',                      level: 1, parentId: null, parentName: '—',                         createdAt: '2024-10-02', status: 'active' },
  { id: 5,  name: 'Acceso y autenticación',        level: 2, parentId: 1,    parentName: 'Incidente',                  createdAt: '2024-10-05', status: 'active' },
  { id: 6,  name: 'Facturación y pagos',           level: 2, parentId: 1,    parentName: 'Incidente',                  createdAt: '2024-10-05', status: 'active' },
  { id: 7,  name: 'Soporte técnico',               level: 2, parentId: 2,    parentName: 'Solicitud de servicio',      createdAt: '2024-10-06', status: 'active' },
  { id: 8,  name: 'Gestión de cuenta',             level: 2, parentId: 4,    parentName: 'Consulta',                   createdAt: '2024-10-06', status: 'active' },
  { id: 9,  name: 'Inicio de sesión',              level: 3, parentId: 5,    parentName: 'Acceso y autenticación',     createdAt: '2024-10-10', status: 'active' },
  { id: 10, name: 'Recuperación de contraseña',    level: 3, parentId: 5,    parentName: 'Acceso y autenticación',     createdAt: '2024-10-10', status: 'active' },
  { id: 11, name: 'Fallo en pago',                 level: 3, parentId: 6,    parentName: 'Facturación y pagos',        createdAt: '2024-10-11', status: 'active' },
  { id: 12, name: 'Reembolso',                     level: 3, parentId: 6,    parentName: 'Facturación y pagos',        createdAt: '2024-10-11', status: 'active' },
  { id: 13, name: 'Configuración de dispositivo',  level: 4, parentId: 9,    parentName: 'Inicio de sesión',           createdAt: '2024-11-01', status: 'active' },
  { id: 14, name: 'Acceso remoto',                 level: 4, parentId: 7,    parentName: 'Soporte técnico',            createdAt: '2024-11-03', status: 'active' },
  { id: 15, name: 'Portal web',                    level: 5, parentId: 13,   parentName: 'Configuración de dispositivo', createdAt: '2024-11-15', status: 'active' },
];

export const LEVEL_LABELS: Record<number, string> = {
  1: 'Nivel 1',
  2: 'Nivel 2',
  3: 'Nivel 3',
  4: 'Nivel 4',
  5: 'Nivel 5',
};

export const LEVEL_COLORS: Record<number, { bg: string; color: string }> = {
  1: { bg: '#E1F5EE', color: '#0F6E56' },
  2: { bg: '#E6F1FB', color: '#185FA5' },
  3: { bg: '#F5F0FF', color: '#6B3FA0' },
  4: { bg: '#FEF3CD', color: '#8A6400' },
  5: { bg: '#FCEBEB', color: '#A32D2D' },
};

export const LEVEL_DOT: Record<number, string> = {
  1: '#1D9E75',
  2: '#378ADD',
  3: '#7C5CBF',
  4: '#EF9F27',
  5: '#E24B4A',
};

export const EMPTY_FILTERS: SucesoFilters = { name: '', parent: '' };
export const EMPTY_FORM: CreateSucesoForm  = { name: '', level: '', parentId: '' };