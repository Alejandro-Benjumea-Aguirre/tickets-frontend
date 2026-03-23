import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { Navbar } from '../../layouts/Navbar';

// ── Types ──────────────────────────────────────────────────────────────────────

type ModuleKey = 'tickets' | 'usuarios' | 'clientes' | 'sucesos';
type FileFormat = 'excel' | 'csv';

interface TicketFilters   { fechaDesde: string; fechaHasta: string; prioridad: string; estado: string; }
interface UserFilters     { name: string; rol: string; status: string; }
interface ClientFilters   { name: string; engineer: string; status: string; }
interface SucesoFilters   { name: string; level: string; }

type ReportFilters = TicketFilters | UserFilters | ClientFilters | SucesoFilters;

// ── Mock data ──────────────────────────────────────────────────────────────────

const TICKETS = [
  { id: '#1042', cliente: 'Ana Torres',   asunto: 'No puedo iniciar sesión',     prio: 'Alta',  estado: 'Abierto',     agente: 'Carlos R.',  fecha: '2026-03-19' },
  { id: '#1041', cliente: 'Juan Mesa',    asunto: 'Error al generar factura',     prio: 'Alta',  estado: 'En progreso', agente: 'Laura M.',   fecha: '2026-03-19' },
  { id: '#1040', cliente: 'Sara López',   asunto: 'Cambio de plan de servicio',   prio: 'Media', estado: 'En progreso', agente: 'Carlos R.',  fecha: '2026-03-19' },
  { id: '#1039', cliente: 'Pedro Ríos',   asunto: 'Reembolso pendiente',          prio: 'Alta',  estado: 'Urgente',     agente: '—',          fecha: '2026-03-18' },
  { id: '#1038', cliente: 'Mónica Gil',   asunto: 'Consulta sobre términos',      prio: 'Baja',  estado: 'Cerrado',     agente: 'Laura M.',   fecha: '2026-03-18' },
  { id: '#1037', cliente: 'Carlos Vera',  asunto: 'Actualizar datos de contacto', prio: 'Baja',  estado: 'Cerrado',     agente: 'Carlos R.',  fecha: '2026-03-17' },
];

const USUARIOS = [
  { name: 'Carlos Ramírez',  email: 'carlos@empresa.com',  phone: '300 123 4567', role: 'Administrador', status: 'Activo',   createdAt: '2025-01-10' },
  { name: 'Laura Méndez',    email: 'laura@empresa.com',   phone: '300 987 6543', role: 'Agente',         status: 'Activo',   createdAt: '2025-02-14' },
  { name: 'Ana Torres',      email: 'ana@empresa.com',     phone: '310 456 7890', role: 'Cliente',        status: 'Activo',   createdAt: '2025-03-01' },
  { name: 'Juan Mesa',       email: 'juan@empresa.com',    phone: '315 234 5678', role: 'Cliente',        status: 'Inactivo', createdAt: '2025-03-05' },
  { name: 'Diego Fernández', email: 'diego@empresa.com',   phone: '300 345 6789', role: 'Agente',         status: 'Activo',   createdAt: '2025-01-22' },
  { name: 'Paola Sánchez',   email: 'paola@empresa.com',   phone: '311 678 9012', role: 'Cliente',        status: 'Activo',   createdAt: '2025-02-28' },
  { name: 'Andrés Herrera',  email: 'andres@empresa.com',  phone: '316 789 0123', role: 'Agente',         status: 'Inactivo', createdAt: '2025-01-30' },
  { name: 'Mónica Gil',      email: 'monica@empresa.com',  phone: '318 901 2345', role: 'Cliente',        status: 'Activo',   createdAt: '2025-03-10' },
];

const CLIENTES = [
  { name: 'Empresa ABC',           email: 'contacto@empresaabc.com', phone: '601 234 5678', engineer: 'Carlos Ramírez',  status: 'Activo',   createdAt: '2024-11-05' },
  { name: 'Tech Solutions',        email: 'info@techsolutions.com',   phone: '601 987 6543', engineer: 'Laura Méndez',    status: 'Activo',   createdAt: '2024-12-01' },
  { name: 'Global Corp',           email: 'soporte@globalcorp.com',   phone: '604 456 7890', engineer: 'Diego Fernández', status: 'Activo',   createdAt: '2025-01-14' },
  { name: 'Constructora XY',       email: 'admin@constructoraxy.com', phone: '607 321 0987', engineer: 'Laura Méndez',    status: 'Inactivo', createdAt: '2025-01-28' },
  { name: 'Finanzas SA',           email: 'it@finanzassa.com',        phone: '602 654 3210', engineer: 'Carlos Ramírez',  status: 'Activo',   createdAt: '2025-02-10' },
  { name: 'Distribuidora Norte',   email: 'sistemas@distnorte.com',   phone: '605 789 4561', engineer: 'Diego Fernández', status: 'Activo',   createdAt: '2025-02-20' },
  { name: 'Inversiones del Valle', email: 'contacto@invvalle.com',    phone: '603 147 2589', engineer: 'Paola Sánchez',   status: 'Inactivo', createdAt: '2025-03-02' },
  { name: 'Soluciones Integrales', email: 'soporte@solint.com',       phone: '606 258 3690', engineer: 'Paola Sánchez',   status: 'Activo',   createdAt: '2025-03-12' },
];

const SUCESOS = [
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

const LEVEL_COLORS: Record<number, { bg: string; color: string }> = {
  1: { bg: '#E1F5EE', color: '#0F6E56' },
  2: { bg: '#E6F1FB', color: '#185FA5' },
  3: { bg: '#F5F0FF', color: '#6B3FA0' },
  4: { bg: '#FEF3CD', color: '#8A6400' },
  5: { bg: '#FCEBEB', color: '#A32D2D' },
};

const PRIO_COLORS: Record<string, string> = { Alta: '#E24B4A', Media: '#EF9F27', Baja: '#888780' };

const ESTADO_MAP: Record<string, { bg: string; color: string }> = {
  'Abierto':     { bg: '#E1F5EE', color: '#0F6E56' },
  'En progreso': { bg: '#E6F1FB', color: '#185FA5' },
  'Cerrado':     { bg: '#F1EFE8', color: '#5F5E5A' },
  'Urgente':     { bg: '#FCEBEB', color: '#A32D2D' },
};

interface ModuleConfig {
  key:       ModuleKey;
  label:     string;
  desc:      string;
  count:     number;
  iconColor: string;
  icon:      React.ReactNode;
}

const MODULE_CONFIGS: ModuleConfig[] = [
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

// ── Generate Report Modal ─────────────────────────────────────────────────────

interface GenerateModalProps {
  module: ModuleConfig;
  onClose: () => void;
}

const GenerateModal = ({ module, onClose }: GenerateModalProps) => {
  const overlayRef              = useRef<HTMLDivElement>(null);
  const [format, setFormat]     = useState<FileFormat>('excel');
  const [generated, setGenerated] = useState(false);

  // Per-module filter states
  const [ticketF, setTicketF]   = useState<TicketFilters>({ fechaDesde: '', fechaHasta: '', prioridad: '', estado: '' });
  const [userF,   setUserF]     = useState<UserFilters>({ name: '', rol: '', status: '' });
  const [clientF, setClientF]   = useState<ClientFilters>({ name: '', engineer: '', status: '' });
  const [sucesoF, setSucesoF]   = useState<SucesoFilters>({ name: '', level: '' });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleGenerate = () => setGenerated(true);

  const filterCount = () => {
    if (module.key === 'tickets') return Object.values(ticketF).filter(Boolean).length;
    if (module.key === 'usuarios') return Object.values(userF).filter(Boolean).length;
    if (module.key === 'clientes') return Object.values(clientF).filter(Boolean).length;
    return Object.values(sucesoF).filter(Boolean).length;
  };

  const ext  = format === 'excel' ? 'xlsx' : 'csv';
  const filename = `reporte_${module.key}_${new Date().toISOString().slice(0,10)}.${ext}`;

  return (
    <div
      ref={overlayRef}
      style={ms.overlay}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div style={ms.modal}>

        {/* Header */}
        <div style={ms.header}>
          <div style={ms.headerLeft}>
            <div style={{ ...ms.headerIcon, background: module.iconColor }}>
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div>
              <div style={ms.headerTitle}>Generar reporte — {module.label}</div>
              <div style={ms.headerSub}>Configura los filtros y el formato de exportación</div>
            </div>
          </div>
          <button style={ms.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {!generated ? (
          <div style={ms.body}>

            {/* ── Filtros por módulo ── */}
            <div style={ms.section}>
              <div style={ms.sectionTitle}>
                <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filtros
                {filterCount() > 0 && <span style={ms.filterCount}>{filterCount()} aplicado{filterCount() > 1 ? 's' : ''}</span>}
              </div>

              {/* TICKETS */}
              {module.key === 'tickets' && (
                <div style={ms.filterGrid2}>
                  <div style={ms.field}>
                    <label style={ms.label}>Fecha desde</label>
                    <input style={ms.input} type="date" value={ticketF.fechaDesde} onChange={(e) => setTicketF(p => ({ ...p, fechaDesde: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Fecha hasta</label>
                    <input style={ms.input} type="date" value={ticketF.fechaHasta} onChange={(e) => setTicketF(p => ({ ...p, fechaHasta: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Prioridad</label>
                    <select style={ms.select} value={ticketF.prioridad} onChange={(e) => setTicketF(p => ({ ...p, prioridad: e.target.value }))}>
                      <option value="">Todas</option>
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Estado</label>
                    <select style={ms.select} value={ticketF.estado} onChange={(e) => setTicketF(p => ({ ...p, estado: e.target.value }))}>
                      <option value="">Todos</option>
                      <option value="Abierto">Abierto</option>
                      <option value="En progreso">En progreso</option>
                      <option value="Cerrado">Cerrado</option>
                      <option value="Urgente">Urgente</option>
                    </select>
                  </div>
                </div>
              )}

              {/* USUARIOS */}
              {module.key === 'usuarios' && (
                <div style={ms.filterGrid3}>
                  <div style={ms.field}>
                    <label style={ms.label}>Nombre</label>
                    <input style={ms.input} type="text" placeholder="Buscar por nombre…" value={userF.name} onChange={(e) => setUserF(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Rol</label>
                    <select style={ms.select} value={userF.rol} onChange={(e) => setUserF(p => ({ ...p, rol: e.target.value }))}>
                      <option value="">Todos</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Agente">Agente</option>
                      <option value="Cliente">Cliente</option>
                    </select>
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Estado</label>
                    <select style={ms.select} value={userF.status} onChange={(e) => setUserF(p => ({ ...p, status: e.target.value }))}>
                      <option value="">Todos</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              )}

              {/* CLIENTES */}
              {module.key === 'clientes' && (
                <div style={ms.filterGrid3}>
                  <div style={ms.field}>
                    <label style={ms.label}>Nombre</label>
                    <input style={ms.input} type="text" placeholder="Buscar cliente…" value={clientF.name} onChange={(e) => setClientF(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Ingeniero</label>
                    <input style={ms.input} type="text" placeholder="Nombre del ingeniero…" value={clientF.engineer} onChange={(e) => setClientF(p => ({ ...p, engineer: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Estado</label>
                    <select style={ms.select} value={clientF.status} onChange={(e) => setClientF(p => ({ ...p, status: e.target.value }))}>
                      <option value="">Todos</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              )}

              {/* SUCESOS */}
              {module.key === 'sucesos' && (
                <div style={ms.filterGrid2}>
                  <div style={ms.field}>
                    <label style={ms.label}>Nombre</label>
                    <input style={ms.input} type="text" placeholder="Buscar suceso…" value={sucesoF.name} onChange={(e) => setSucesoF(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Nivel</label>
                    <select style={ms.select} value={sucesoF.level} onChange={(e) => setSucesoF(p => ({ ...p, level: e.target.value }))}>
                      <option value="">Todos los niveles</option>
                      {[1,2,3,4,5].map(l => <option key={l} value={String(l)}>Nivel {l}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* ── Formato de exportación ── */}
            <div style={ms.section}>
              <div style={ms.sectionTitle}>
                <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Formato de exportación
              </div>
              <div style={ms.formatGrid}>

                {/* Excel */}
                <button
                  type="button"
                  style={{ ...ms.formatBtn, ...(format === 'excel' ? ms.formatBtnActive : {}) }}
                  onClick={() => setFormat('excel')}
                >
                  <div style={{ ...ms.formatIconWrap, background: format === 'excel' ? '#E1F5EE' : 'var(--bg-filter)' }}>
                    <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
                      <rect x="2" y="3" width="20" height="18" rx="2" fill={format === 'excel' ? '#1D9E75' : 'var(--text-tertiary)'} opacity="0.15"/>
                      <path d="M8 8l2.5 4L8 16M12 8h4M12 12h3M12 16h4" stroke={format === 'excel' ? '#1D9E75' : 'var(--text-secondary)'} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ ...ms.formatLabel, color: format === 'excel' ? '#1D9E75' : 'var(--text-primary)' }}>Excel</div>
                    <div style={ms.formatExt}>.xlsx — Hoja de cálculo</div>
                  </div>
                  <div style={{ ...ms.formatCheck, borderColor: format === 'excel' ? '#1D9E75' : 'var(--border-input)', background: format === 'excel' ? '#1D9E75' : 'transparent' }}>
                    {format === 'excel' && (
                      <svg viewBox="0 0 24 24" width={10} height={10} fill="none" stroke="white" strokeWidth={3}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                </button>

                {/* CSV */}
                <button
                  type="button"
                  style={{ ...ms.formatBtn, ...(format === 'csv' ? ms.formatBtnActive : {}) }}
                  onClick={() => setFormat('csv')}
                >
                  <div style={{ ...ms.formatIconWrap, background: format === 'csv' ? '#E6F1FB' : 'var(--bg-filter)' }}>
                    <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
                      <rect x="2" y="3" width="20" height="18" rx="2" fill={format === 'csv' ? '#378ADD' : 'var(--text-tertiary)'} opacity="0.15"/>
                      <path d="M7 9h10M7 12h7M7 15h5" stroke={format === 'csv' ? '#378ADD' : 'var(--text-secondary)'} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ ...ms.formatLabel, color: format === 'csv' ? '#378ADD' : 'var(--text-primary)' }}>CSV</div>
                    <div style={ms.formatExt}>.csv — Valores separados por coma</div>
                  </div>
                  <div style={{ ...ms.formatCheck, borderColor: format === 'csv' ? '#378ADD' : 'var(--border-input)', background: format === 'csv' ? '#378ADD' : 'transparent' }}>
                    {format === 'csv' && (
                      <svg viewBox="0 0 24 24" width={10} height={10} fill="none" stroke="white" strokeWidth={3}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                </button>

              </div>

              {/* Filename preview */}
              <div style={ms.filenamePreview}>
                <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="var(--text-tertiary)" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
                <span style={ms.filenameText}>{filename}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={ms.footer}>
              <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
              <button type="button" style={ms.generateBtn} onClick={handleGenerate}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Generar reporte
              </button>
            </div>
          </div>
        ) : (
          /* ── Success state ── */
          <div style={ms.successBody}>
            <div style={ms.successIcon}>
              <svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke="#1D9E75" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div style={ms.successTitle}>¡Reporte generado!</div>
            <div style={ms.successSub}>
              Tu archivo <strong>{filename}</strong> está listo para descargarse.
            </div>
            <div style={ms.successMeta}>
              <span style={ms.metaChip}>
                <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                {ext.toUpperCase()}
              </span>
              <span style={ms.metaChip}>{module.count} registros</span>
              {filterCount() > 0 && <span style={ms.metaChip}>{filterCount()} filtro{filterCount() > 1 ? 's' : ''}</span>}
            </div>
            <div style={ms.successActions}>
              <button style={ms.downloadBtn}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Descargar {filename}
              </button>
              <button style={ms.cancelBtn} onClick={onClose}>Cerrar</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ── Reportes Page ─────────────────────────────────────────────────────────────

const ReportesPage = () => {
  const authContext                   = useContext(AuthContext);
  const [activeModule, setActiveModule] = useState<ModuleKey | null>(null);
  const [showModal, setShowModal]     = useState(false);

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;
  const { user, logoutUser } = authContext;

  const activeConfig = MODULE_CONFIGS.find((m) => m.key === activeModule) ?? null;

  const initials = (name: string) =>
    name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />
      {showModal && activeConfig && (
        <GenerateModal module={activeConfig} onClose={() => setShowModal(false)} />
      )}

      <div style={s.page}>

        {/* Topbar */}
        <div style={s.topbar}>
          <div>
            <div style={s.pageTitle}>Reportes</div>
            <div style={s.pageSub}>Selecciona un módulo para visualizar y exportar su información</div>
          </div>
        </div>

        {/* Module cards */}
        <div style={s.moduleGrid}>
          {MODULE_CONFIGS.map((m) => {
            const active = activeModule === m.key;
            return (
              <button
                key={m.key}
                style={{
                  ...s.moduleCard,
                  ...(active ? { ...s.moduleCardActive, borderColor: m.iconColor } : {}),
                }}
                onClick={() => setActiveModule(active ? null : m.key)}
              >
                <div style={{ ...s.moduleIconWrap, background: active ? m.iconColor : 'var(--bg-filter)', color: active ? '#fff' : m.iconColor }}>
                  {m.icon}
                </div>
                <div style={s.moduleInfo}>
                  <div style={{ ...s.moduleLabel, color: active ? m.iconColor : 'var(--text-primary)' }}>{m.label}</div>
                  <div style={s.moduleDesc}>{m.desc}</div>
                </div>
                <div style={{ ...s.moduleCount, background: active ? m.iconColor + '18' : 'var(--bg-filter)', color: active ? m.iconColor : 'var(--text-tertiary)' }}>
                  {m.count}
                </div>
                {active && (
                  <div style={{ ...s.moduleActiveDot, background: m.iconColor }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Table section */}
        {activeModule === null ? (
          <div style={s.emptyState}>
            <svg viewBox="0 0 24 24" width={40} height={40} fill="none" stroke="var(--text-tertiary)" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17H7A5 5 0 0 1 7 7h2"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7h2a5 5 0 1 1 0 10h-2"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <div style={s.emptyTitle}>Selecciona un módulo</div>
            <div style={s.emptySub}>Haz clic en una de las tarjetas para ver su información</div>
          </div>
        ) : (
          <div style={s.tableCard}>

            {/* Table header */}
            <div style={s.tableTopbar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ ...s.tableIconWrap, background: activeConfig!.iconColor }}>
                  {activeConfig!.icon}
                </div>
                <div>
                  <div style={s.tableTitle}>{activeConfig!.label}</div>
                  <div style={s.tableSub}>{activeConfig!.count} registros en total</div>
                </div>
              </div>
              <button style={s.generateBtn} onClick={() => setShowModal(true)}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Generar reporte
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>

              {/* TICKETS TABLE */}
              {activeModule === 'tickets' && (
                <table style={s.table}>
                  <thead>
                    <tr>{['#', 'Cliente', 'Asunto', 'Prioridad', 'Estado', 'Agente', 'Fecha'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {TICKETS.map((t) => (
                      <tr key={t.id} style={s.tr} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-filter)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{t.id}</td>
                        <td style={{ ...s.td, fontWeight: 500 }}>{t.cliente}</td>
                        <td style={{ ...s.td, color: 'var(--text-secondary)', maxWidth: 200 }}>{t.asunto}</td>
                        <td style={s.td}>
                          <span style={s.prioBadge}>
                            <span style={{ ...s.prioDot, background: PRIO_COLORS[t.prio] }} />
                            {t.prio}
                          </span>
                        </td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, background: ESTADO_MAP[t.estado]?.bg, color: ESTADO_MAP[t.estado]?.color }}>{t.estado}</span>
                        </td>
                        <td style={{ ...s.td, color: 'var(--text-secondary)' }}>{t.agente}</td>
                        <td style={{ ...s.td, fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{new Date(t.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* USUARIOS TABLE */}
              {activeModule === 'usuarios' && (
                <table style={s.table}>
                  <thead>
                    <tr>{['Usuario', 'Correo', 'Teléfono', 'Rol', 'Estado', 'Creado'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {USUARIOS.map((u) => (
                      <tr key={u.email} style={s.tr} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-filter)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{ ...s.avatarCircle, background: u.role === 'Administrador' ? '#1D9E75' : u.role === 'Agente' ? '#378ADD' : '#7C5CBF' }}>{initials(u.name)}</div>
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ ...s.td, fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                        <td style={{ ...s.td, fontSize: 13, color: 'var(--text-secondary)' }}>{u.phone}</td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, ...(u.role === 'Administrador' ? { background: '#E1F5EE', color: '#0F6E56' } : u.role === 'Agente' ? { background: '#E6F1FB', color: '#185FA5' } : { background: '#F5F0FF', color: '#6B3FA0' }) }}>{u.role}</span>
                        </td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ ...s.statusDot, background: u.status === 'Activo' ? '#1D9E75' : '#B4B2A9' }} />
                            <span style={{ fontSize: 12, color: u.status === 'Activo' ? '#0F6E56' : 'var(--text-tertiary)' }}>{u.status}</span>
                          </div>
                        </td>
                        <td style={{ ...s.td, fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{new Date(u.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* CLIENTES TABLE */}
              {activeModule === 'clientes' && (
                <table style={s.table}>
                  <thead>
                    <tr>{['Cliente', 'Correo', 'Teléfono', 'Ingeniero', 'Estado', 'Creado'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {CLIENTES.map((c) => (
                      <tr key={c.email} style={s.tr} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-filter)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{ ...s.avatarSquare, background: ['#1D9E75','#378ADD','#7C5CBF','#EF9F27','#E24B4A','#0891B2'][c.name.charCodeAt(0) % 6] }}>{initials(c.name)}</div>
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</span>
                          </div>
                        </td>
                        <td style={{ ...s.td, fontSize: 13, color: 'var(--text-secondary)' }}>{c.email}</td>
                        <td style={{ ...s.td, fontSize: 13, color: 'var(--text-secondary)' }}>{c.phone}</td>
                        <td style={{ ...s.td, fontSize: 13, color: 'var(--text-primary)' }}>{c.engineer}</td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ ...s.statusDot, background: c.status === 'Activo' ? '#1D9E75' : '#B4B2A9' }} />
                            <span style={{ fontSize: 12, color: c.status === 'Activo' ? '#0F6E56' : 'var(--text-tertiary)' }}>{c.status}</span>
                          </div>
                        </td>
                        <td style={{ ...s.td, fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* SUCESOS TABLE */}
              {activeModule === 'sucesos' && (
                <table style={s.table}>
                  <thead>
                    <tr>{['Nombre', 'Nivel', 'Suceso superior', 'Creado'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {SUCESOS.map((su, i) => (
                      <tr key={i} style={s.tr} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-filter)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: (su.level - 1) * 16 }}>
                            {su.level > 1 && <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="var(--text-tertiary)" strokeWidth={2}><polyline points="9 18 15 12 9 6"/></svg>}
                            <span style={{ fontSize: 13, fontWeight: su.level === 1 ? 600 : 400, color: 'var(--text-primary)' }}>{su.name}</span>
                          </div>
                        </td>
                        <td style={s.td}>
                          <span style={{ ...s.badge, background: LEVEL_COLORS[su.level].bg, color: LEVEL_COLORS[su.level].color }}>Nivel {su.level}</span>
                        </td>
                        <td style={{ ...s.td, fontSize: 13, color: 'var(--text-secondary)' }}>{su.parentName}</td>
                        <td style={{ ...s.td, fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{new Date(su.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            </div>
          </div>
        )}

      </div>
    </>
  );
};

// ── Page styles ───────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page:           { padding: '1.5rem', background: 'var(--bg-page)', minHeight: 'calc(100vh - 56px)', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' },
  topbar:         { marginBottom: '1.5rem' },
  pageTitle:      { fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 },
  pageSub:        { fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 },
  moduleGrid:     { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: '1.25rem' },
  moduleCard:     { position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '1rem 1.1rem', background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 12, cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s', overflow: 'hidden' },
  moduleCardActive:{ background: 'var(--bg-card)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  moduleIconWrap: { width: 46, height: 46, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' },
  moduleInfo:     { flex: 1, minWidth: 0 },
  moduleLabel:    { fontSize: 14, fontWeight: 600, transition: 'color 0.15s' },
  moduleDesc:     { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  moduleCount:    { fontSize: 13, fontWeight: 600, padding: '3px 10px', borderRadius: 20, transition: 'all 0.15s', flexShrink: 0 },
  moduleActiveDot:{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, borderRadius: '0 0 12px 12px' },
  emptyState:     { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '4rem', background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10 },
  emptyTitle:     { fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' },
  emptySub:       { fontSize: 13, color: 'var(--text-tertiary)' },
  tableCard:      { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1.25rem' },
  tableTopbar:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' },
  tableIconWrap:  { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 },
  tableTitle:     { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' },
  tableSub:       { fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 },
  generateBtn:    { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  table:          { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th:             { textAlign: 'left', padding: '6px 10px', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', borderBottom: '0.5px solid var(--border)', letterSpacing: '0.03em', whiteSpace: 'nowrap' },
  tr:             { borderBottom: '0.5px solid var(--border)', transition: 'background 0.1s' },
  td:             { padding: '10px 10px', verticalAlign: 'middle', color: 'var(--text-primary)' },
  badge:          { display: 'inline-block', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  prioBadge:      { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 },
  prioDot:        { width: 6, height: 6, borderRadius: '50%', display: 'inline-block' },
  statusDot:      { width: 6, height: 6, borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  avatarCircle:   { width: 30, height: 30, borderRadius: '50%', color: '#fff', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarSquare:   { width: 30, height: 30, borderRadius: 7, color: '#fff', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
};

// ── Modal styles ──────────────────────────────────────────────────────────────

const ms: Record<string, React.CSSProperties> = {
  overlay:        { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:          { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 14, width: '100%', maxWidth: 540, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' },
  header:         { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '0.5px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 },
  headerLeft:     { display: 'flex', alignItems: 'center', gap: 12 },
  headerIcon:     { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerTitle:    { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' },
  headerSub:      { fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 },
  closeBtn:       { width: 32, height: 32, borderRadius: 8, border: '0.5px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', flexShrink: 0 },
  body:           { padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  section:        { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  sectionTitle:   { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' },
  filterCount:    { fontSize: 10, fontWeight: 600, background: '#E1F5EE', color: '#0F6E56', padding: '1px 6px', borderRadius: 20 },
  filterGrid2:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' },
  filterGrid3:    { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 12px' },
  field:          { display: 'flex', flexDirection: 'column', gap: 4 },
  label:          { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.03em' },
  input:          { height: 34, padding: '0 10px', border: '0.5px solid var(--border-input)', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' },
  select:         { height: 34, padding: '0 8px', border: '0.5px solid var(--border-input)', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', cursor: 'pointer' },
  formatGrid:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  formatBtn:      { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg-filter)', border: '0.5px solid var(--border)', borderRadius: 10, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textAlign: 'left', transition: 'all 0.15s' },
  formatBtnActive:{ border: '1.5px solid var(--border)', background: 'var(--bg-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  formatIconWrap: { width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' },
  formatLabel:    { fontSize: 13, fontWeight: 600, transition: 'color 0.15s' },
  formatExt:      { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 },
  formatCheck:    { width: 18, height: 18, borderRadius: '50%', border: '1.5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', flexShrink: 0, transition: 'all 0.15s' },
  filenamePreview:{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-filter)', border: '0.5px solid var(--border)', borderRadius: 7, padding: '7px 10px' },
  filenameText:   { fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'DM Mono', monospace" },
  footer:         { display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: '0.5rem', borderTop: '0.5px solid var(--border)', marginTop: '0.25rem' },
  cancelBtn:      { height: 36, padding: '0 16px', border: '0.5px solid var(--border)', borderRadius: 8, background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' },
  generateBtn:    { height: 36, padding: '0 18px', border: 'none', borderRadius: 8, background: '#1D9E75', color: '#fff', fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
  successBody:    { padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' },
  successIcon:    { width: 64, height: 64, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  successTitle:   { fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' },
  successSub:     { fontSize: 13, color: 'var(--text-secondary)', maxWidth: 320 },
  successMeta:    { display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 },
  metaChip:       { fontSize: 11, fontWeight: 500, background: 'var(--bg-filter)', color: 'var(--text-secondary)', border: '0.5px solid var(--border)', padding: '3px 10px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 },
  successActions: { display: 'flex', gap: 8, marginTop: 8 },
  downloadBtn:    { height: 36, padding: '0 18px', border: 'none', borderRadius: 8, background: '#1D9E75', color: '#fff', fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
};

export default ReportesPage;
