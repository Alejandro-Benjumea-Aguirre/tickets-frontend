// ── Helpers ────────────────────────────────────────────────────────────────────

export const ROL_LABEL: Record<number, string> = { 1: 'Administrador', 2: 'Agente', 3: 'Cliente' };
export const STATE_LABEL: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Activo',   color: '#0F6E56', bg: '#E1F5EE' },
  2: { label: 'Inactivo', color: '#A32D2D', bg: '#FCEBEB' },
};

// ── ChangePasswordModal ────────────────────────────────────────────────────────

export const PASSWORD_RULES = [
  { id: 'len',   label: 'Mínimo 8 caracteres',       test: (v: string) => v.length >= 8 },
  { id: 'upper', label: 'Al menos 1 letra mayúscula', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'Al menos 1 letra minúscula', test: (v: string) => /[a-z]/.test(v) },
  { id: 'num',   label: 'Al menos 1 número',          test: (v: string) => /[0-9]/.test(v) },
  { id: 'spec',  label: 'Al menos 1 carácter especial (!@#$…)', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];


// ── Nav links ──────────────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { label: 'Tickets',       to: '/dashboard',      adminOnly: false },
  { label: 'Usuarios',      to: '/admin/users',    adminOnly: true  },
  { label: 'Clientes',      to: '/clientes',       adminOnly: true  },
  { label: 'Sucesos',       to: '/sucesos',        adminOnly: true  },
  { label: 'Reportes',      to: '/reportes',       adminOnly: false },
  { label: 'Estadísticas',  to: '/estadisticas',   adminOnly: true  },
];