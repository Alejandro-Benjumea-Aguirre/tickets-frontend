// ── Mock data ─────────────────────────────────────────────────────────────────

export const CLIENTES = [
  { value: 'c1', label: 'Ana Torres — ana.torres@empresa.com' },
  { value: 'c2', label: 'Juan Mesa — juan.mesa@empresa.com' },
  { value: 'c3', label: 'Sara López — sara.lopez@empresa.com' },
  { value: 'c4', label: 'Pedro Ríos — pedro.rios@empresa.com' },
  { value: 'c5', label: 'Mónica Gil — monica.gil@empresa.com' },
  { value: 'c6', label: 'Carlos Vera — carlos.vera@empresa.com' },
];

export const USUARIOS = [
  { value: 'u1', label: 'Carlos Rodríguez (CR)' },
  { value: 'u2', label: 'Laura Martínez (LM)' },
  { value: 'u3', label: 'Diego Fernández (DF)' },
  { value: 'u4', label: 'Paola Sánchez (PS)' },
];

export const SUCESOS: { label: string; options: { value: string; label: string }[] }[] = [
  {
    label: 'Tipo de suceso',
    options: [
      { value: 'incidente',  label: 'Incidente' },
      { value: 'solicitud',  label: 'Solicitud de servicio' },
      { value: 'queja',      label: 'Queja' },
      { value: 'consulta',   label: 'Consulta' },
      { value: 'cambio',     label: 'Solicitud de cambio' },
    ],
  },
  {
    label: 'Categoría',
    options: [
      { value: 'acceso',     label: 'Acceso y autenticación' },
      { value: 'factura',    label: 'Facturación y pagos' },
      { value: 'tecnico',    label: 'Soporte técnico' },
      { value: 'cuenta',     label: 'Gestión de cuenta' },
      { value: 'otro',       label: 'Otro' },
    ],
  },
  {
    label: 'Subcategoría',
    options: [
      { value: 'login',      label: 'Inicio de sesión' },
      { value: 'password',   label: 'Recuperación de contraseña' },
      { value: 'pago',       label: 'Fallo en pago' },
      { value: 'reembolso',  label: 'Reembolso' },
      { value: 'config',     label: 'Configuración' },
    ],
  },
  {
    label: 'Canal de entrada',
    options: [
      { value: 'email',      label: 'Correo electrónico' },
      { value: 'chat',       label: 'Chat en vivo' },
      { value: 'telefono',   label: 'Teléfono' },
      { value: 'portal',     label: 'Portal web' },
      { value: 'whatsapp',   label: 'WhatsApp' },
    ],
  },
  {
    label: 'Área afectada',
    options: [
      { value: 'sistemas',   label: 'Sistemas' },
      { value: 'comercial',  label: 'Comercial' },
      { value: 'operaciones',label: 'Operaciones' },
      { value: 'rrhh',       label: 'Recursos humanos' },
      { value: 'finanzas',   label: 'Finanzas' },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export const MAX_SIZE_MB = 2;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
export const ACCEPTED = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
