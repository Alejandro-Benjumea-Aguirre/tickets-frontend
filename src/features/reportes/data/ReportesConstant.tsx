// ── Mock data ──────────────────────────────────────────────────────────────────

import { ModuleConfig } from "../types/reportes.types";

export const TICKETS = [
  { id: '#1042', cliente: 'Ana Torres',   asunto: 'No puedo iniciar sesión',     prio: 'Alta',  estado: 'Abierto',     agente: 'Carlos R.',  fecha: '2026-03-19' },
  { id: '#1041', cliente: 'Juan Mesa',    asunto: 'Error al generar factura',     prio: 'Alta',  estado: 'En progreso', agente: 'Laura M.',   fecha: '2026-03-19' },
  { id: '#1040', cliente: 'Sara López',   asunto: 'Cambio de plan de servicio',   prio: 'Media', estado: 'En progreso', agente: 'Carlos R.',  fecha: '2026-03-19' },
  { id: '#1039', cliente: 'Pedro Ríos',   asunto: 'Reembolso pendiente',          prio: 'Alta',  estado: 'Urgente',     agente: '—',          fecha: '2026-03-18' },
  { id: '#1038', cliente: 'Mónica Gil',   asunto: 'Consulta sobre términos',      prio: 'Baja',  estado: 'Cerrado',     agente: 'Laura M.',   fecha: '2026-03-18' },
  { id: '#1037', cliente: 'Carlos Vera',  asunto: 'Actualizar datos de contacto', prio: 'Baja',  estado: 'Cerrado',     agente: 'Carlos R.',  fecha: '2026-03-17' },
];

export const USUARIOS = [
  { name: 'Carlos Ramírez',  email: 'carlos@empresa.com',  phone: '300 123 4567', role: 'Administrador', status: 'Activo',   createdAt: '2025-01-10' },
  { name: 'Laura Méndez',    email: 'laura@empresa.com',   phone: '300 987 6543', role: 'Agente',         status: 'Activo',   createdAt: '2025-02-14' },
  { name: 'Ana Torres',      email: 'ana@empresa.com',     phone: '310 456 7890', role: 'Cliente',        status: 'Activo',   createdAt: '2025-03-01' },
  { name: 'Juan Mesa',       email: 'juan@empresa.com',    phone: '315 234 5678', role: 'Cliente',        status: 'Inactivo', createdAt: '2025-03-05' },
  { name: 'Diego Fernández', email: 'diego@empresa.com',   phone: '300 345 6789', role: 'Agente',         status: 'Activo',   createdAt: '2025-01-22' },
  { name: 'Paola Sánchez',   email: 'paola@empresa.com',   phone: '311 678 9012', role: 'Cliente',        status: 'Activo',   createdAt: '2025-02-28' },
  { name: 'Andrés Herrera',  email: 'andres@empresa.com',  phone: '316 789 0123', role: 'Agente',         status: 'Inactivo', createdAt: '2025-01-30' },
  { name: 'Mónica Gil',      email: 'monica@empresa.com',  phone: '318 901 2345', role: 'Cliente',        status: 'Activo',   createdAt: '2025-03-10' },
];

export const CLIENTES = [
  { name: 'Empresa ABC',           email: 'contacto@empresaabc.com', phone: '601 234 5678', engineer: 'Carlos Ramírez',  status: 'Activo',   createdAt: '2024-11-05' },
  { name: 'Tech Solutions',        email: 'info@techsolutions.com',   phone: '601 987 6543', engineer: 'Laura Méndez',    status: 'Activo',   createdAt: '2024-12-01' },
  { name: 'Global Corp',           email: 'soporte@globalcorp.com',   phone: '604 456 7890', engineer: 'Diego Fernández', status: 'Activo',   createdAt: '2025-01-14' },
  { name: 'Constructora XY',       email: 'admin@constructoraxy.com', phone: '607 321 0987', engineer: 'Laura Méndez',    status: 'Inactivo', createdAt: '2025-01-28' },
  { name: 'Finanzas SA',           email: 'it@finanzassa.com',        phone: '602 654 3210', engineer: 'Carlos Ramírez',  status: 'Activo',   createdAt: '2025-02-10' },
  { name: 'Distribuidora Norte',   email: 'sistemas@distnorte.com',   phone: '605 789 4561', engineer: 'Diego Fernández', status: 'Activo',   createdAt: '2025-02-20' },
  { name: 'Inversiones del Valle', email: 'contacto@invvalle.com',    phone: '603 147 2589', engineer: 'Paola Sánchez',   status: 'Inactivo', createdAt: '2025-03-02' },
  { name: 'Soluciones Integrales', email: 'soporte@solint.com',       phone: '606 258 3690', engineer: 'Paola Sánchez',   status: 'Activo',   createdAt: '2025-03-12' },
];

export const SUCESOS = [
  { name: 'Incidente',                   level: 1, parentName: '—',                         createdAt: '2024-10-01' },
  { name: 'Solicitud de servicio',        level: 1, parentName: '—',                         createdAt: '2024-10-01' },
  { name: 'Queja',                        level: 1, parentName: '—',                         createdAt: '2024-10-01' },
  { name: 'Consulta',                     level: 1, parentName: '—',                         createdAt: '2024-10-02' },
  { name: 'Acceso y autenticación',       level: 2, parentName: 'Incidente',                  createdAt: '2024-10-05' },
  { name: 'Facturación y pagos',          level: 2, parentName: 'Incidente',                  createdAt: '2024-10-05' },
  { name: 'Soporte técnico',              level: 2, parentName: 'Solicitud de servicio',      createdAt: '2024-10-06' },
  { name: 'Gestión de cuenta',            level: 2, parentName: 'Consulta',                   createdAt: '2024-10-06' },
  { name: 'Inicio de sesión',             level: 3, parentName: 'Acceso y autenticación',     createdAt: '2024-10-10' },
  { name: 'Recuperación de contraseña',   level: 3, parentName: 'Acceso y autenticación',     createdAt: '2024-10-10' },
  { name: 'Fallo en pago',               level: 3, parentName: 'Facturación y pagos',        createdAt: '2024-10-11' },
  { name: 'Reembolso',                    level: 3, parentName: 'Facturación y pagos',        createdAt: '2024-10-11' },
  { name: 'Configuración de dispositivo', level: 4, parentName: 'Inicio de sesión',           createdAt: '2024-11-01' },
  { name: 'Acceso remoto',                level: 4, parentName: 'Soporte técnico',            createdAt: '2024-11-03' },
  { name: 'Portal web',                   level: 5, parentName: 'Configuración de dispositivo', createdAt: '2024-11-15' },
];

// ── Module config ──────────────────────────────────────────────────────────────

export const LEVEL_COLORS: Record<number, { bg: string; color: string }> = {
  1: { bg: '#E1F5EE', color: '#0F6E56' },
  2: { bg: '#E6F1FB', color: '#185FA5' },
  3: { bg: '#F5F0FF', color: '#6B3FA0' },
  4: { bg: '#FEF3CD', color: '#8A6400' },
  5: { bg: '#FCEBEB', color: '#A32D2D' },
};

export const PRIO_COLORS: Record<string, string> = { Alta: '#E24B4A', Media: '#EF9F27', Baja: '#888780' };

export const ESTADO_MAP: Record<string, { bg: string; color: string }> = {
  'Abierto':     { bg: '#E1F5EE', color: '#0F6E56' },
  'En progreso': { bg: '#E6F1FB', color: '#185FA5' },
  'Cerrado':     { bg: '#F1EFE8', color: '#5F5E5A' },
  'Urgente':     { bg: '#FCEBEB', color: '#A32D2D' },
};



export const MODULE_CONFIGS: ModuleConfig[] = [
  {
    key: 'tickets', label: 'Tickets', desc: 'Historial de tickets de soporte', count: TICKETS.length, iconColor: '#1D9E75',
    icon: <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 11H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V7h10v2z" /></svg>,
  },
  {
    key: 'usuarios', label: 'Usuarios', desc: 'Listado de usuarios del sistema', count: USUARIOS.length, iconColor: '#378ADD',
    icon: <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    key: 'clientes', label: 'Clientes', desc: 'Empresas y clientes registrados', count: CLIENTES.length, iconColor: '#7C5CBF',
    icon: <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 8h1m-1 4h1m4-4h1m-1 4h1M9 21v-3a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v3"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4v1H3V7z"/></svg>,
  },
  {
    key: 'sucesos', label: 'Sucesos', desc: 'Jerarquía de sucesos configurados', count: SUCESOS.length, iconColor: '#EF9F27',
    icon: <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="3"/><path strokeLinecap="round" d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  },
];
