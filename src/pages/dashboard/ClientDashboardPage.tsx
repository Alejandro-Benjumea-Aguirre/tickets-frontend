import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTicketModal from '../../features/tickets/components/CreateTicketModal';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { Navbar } from '../../layouts/Navbar';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Ticket {
  id: string;
  asunto: string;
  prio: string;
  estado: string;
  fecha: string;
  fechaISO: string;
  enEspera: boolean;
}

interface Filters {
  codigo: string;
  asunto: string;
  estado: string;
  fechaDesde: string;
  fechaHasta: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const clientKpis = [
  { label: 'Mis tickets',   val: 5,  sub: 'en total',       dot: '#888780' },
  { label: 'Abiertos',      val: 2,  sub: 'sin resolver',   dot: '#1D9E75' },
  { label: 'En progreso',   val: 1,  sub: 'siendo atendido',dot: '#378ADD' },
  { label: 'Resueltos',     val: 2,  sub: 'este mes',       dot: '#EF9F27' },
];

// Tickets del cliente (en producción se filtraría por ID de cliente)
const myTickets: Ticket[] = [
  { id: '#1042', asunto: 'No puedo iniciar sesión',     prio: 'Alta',  estado: 'open',   fecha: 'hace 10 min', fechaISO: '2026-03-19', enEspera: false },
  { id: '#1040', asunto: 'Cambio de plan de servicio',  prio: 'Media', estado: 'prog',   fecha: 'hace 1h',     fechaISO: '2026-03-19', enEspera: false },
  { id: '#1035', asunto: 'Problema con facturación',    prio: 'Alta',  estado: 'closed', fecha: 'hace 2 días',  fechaISO: '2026-03-17', enEspera: false },
  { id: '#1030', asunto: 'Consulta de producto',        prio: 'Baja',  estado: 'closed', fecha: 'hace 5 días',  fechaISO: '2026-03-14', enEspera: false },
  { id: '#1025', asunto: 'Error en descarga de reporte',prio: 'Media', estado: 'open',   fecha: 'hace 1 sem',   fechaISO: '2026-03-12', enEspera: true  },
];

const estadoMap: Record<string, { label: string; bg: string; color: string }> = {
  open:   { label: 'Abierto',     bg: '#E1F5EE', color: '#0F6E56' },
  prog:   { label: 'En progreso', bg: '#E6F1FB', color: '#185FA5' },
  closed: { label: 'Resuelto',    bg: '#F1EFE8', color: '#5F5E5A' },
  urgent: { label: 'Urgente',     bg: '#FCEBEB', color: '#A32D2D' },
};

const prioColor: Record<string, string> = {
  Alta:  '#E24B4A',
  Media: '#EF9F27',
  Baja:  '#888780',
};

const EMPTY_FILTERS: Filters = {
  codigo:     '',
  asunto:     '',
  estado:     '',
  fechaDesde: '',
  fechaHasta: '',
};

// ── Filter logic ──────────────────────────────────────────────────────────────

function applyFilters(tickets: Ticket[], f: Filters): Ticket[] {
  return tickets.filter((t) => {
    if (f.codigo    && !t.id.toLowerCase().includes(f.codigo.toLowerCase()))       return false;
    if (f.asunto    && !t.asunto.toLowerCase().includes(f.asunto.toLowerCase()))   return false;
    if (f.estado    && t.estado !== f.estado)                                      return false;
    if (f.fechaDesde && t.fechaISO < f.fechaDesde)                                 return false;
    if (f.fechaHasta && t.fechaISO > f.fechaHasta)                                 return false;
    return true;
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

const ClientDashboardPage = () => {
  const authContext = useContext(AuthContext);
  const navigate    = useNavigate();
  const [filters, setFilters]     = useState<Filters>(EMPTY_FILTERS);
  const [showModal, setShowModal] = useState(false);

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;

  const { user, logoutUser } = authContext;
  const tickets = applyFilters(myTickets, filters);

  const setFilter = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />
      {showModal && <CreateTicketModal onClose={() => setShowModal(false)} />}

      <div style={s.db}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div style={s.topbarLeft}>
            <div style={s.logoIcon}>
              <svg viewBox="0 0 24 24" width={16} height={16} fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 11H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
            <span style={s.appTitle}>Mis solicitudes de soporte</span>
            <button style={s.addBtn} onClick={() => setShowModal(true)}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuevo ticket
            </button>
          </div>
          <span style={s.greeting}>Bienvenido, {user?.name ?? 'Cliente'}</span>
        </div>

        {/* KPIs */}
        <div style={s.kpis}>
          {clientKpis.map((k) => (
            <div key={k.label} style={s.kpi}>
              <div style={s.kpiLabel}><span style={{ ...s.kpiDot, background: k.dot }} />{k.label}</div>
              <div style={s.kpiVal}>{k.val}</div>
              <div style={s.kpiSub}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Tickets table + filters */}
        <div style={s.card}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ ...s.cardTitle, marginBottom: 0 }}>Mis tickets</div>
              {tickets.length !== myTickets.length && (
                <span style={s.filterBadge}>{tickets.length} de {myTickets.length}</span>
              )}
            </div>
            {hasActiveFilters && (
              <button style={s.clearBtn} onClick={() => setFilters(EMPTY_FILTERS)}>
                <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Filters */}
          <div style={s.filterBox}>
            <div style={s.filterGrid}>

              <div style={s.filterField}>
                <label style={s.filterLabel}>Código</label>
                <input style={s.filterInput} type="text" placeholder="#1042" value={filters.codigo} onChange={(e) => setFilter('codigo', e.target.value)} />
              </div>

              <div style={{ ...s.filterField, gridColumn: 'span 2' }}>
                <label style={s.filterLabel}>Asunto</label>
                <input style={s.filterInput} type="text" placeholder="Buscar por asunto…" value={filters.asunto} onChange={(e) => setFilter('asunto', e.target.value)} />
              </div>

              <div style={s.filterField}>
                <label style={s.filterLabel}>Estado</label>
                <select style={s.filterSelect} value={filters.estado} onChange={(e) => setFilter('estado', e.target.value)}>
                  <option value="">Todos</option>
                  <option value="open">Abierto</option>
                  <option value="prog">En progreso</option>
                  <option value="closed">Resuelto</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div style={s.filterField}>
                <label style={s.filterLabel}>Fecha desde</label>
                <input style={s.filterInput} type="date" value={filters.fechaDesde} onChange={(e) => setFilter('fechaDesde', e.target.value)} />
              </div>

              <div style={s.filterField}>
                <label style={s.filterLabel}>Fecha hasta</label>
                <input style={s.filterInput} type="date" value={filters.fechaHasta} onChange={(e) => setFilter('fechaHasta', e.target.value)} />
              </div>

            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['#', 'Asunto', 'Prioridad', 'Estado', 'En espera', 'Creado', ''].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: '2rem' }}>
                      Sin resultados para los filtros aplicados
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.id} style={s.tr}>
                      <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{t.id}</td>
                      <td style={{ ...s.td, fontWeight: 500, maxWidth: 280 }}>{t.asunto}</td>
                      <td style={s.td}>
                        <span style={s.prio}>
                          <span style={{ ...s.prioDot, background: prioColor[t.prio] }} />{t.prio}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, background: estadoMap[t.estado].bg, color: estadoMap[t.estado].color }}>
                          {estadoMap[t.estado].label}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, ...(t.enEspera ? { background: '#FEF3CD', color: '#8A6400' } : { background: '#F1EFE8', color: '#5F5E5A' }) }}>
                          {t.enEspera ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td style={{ ...s.td, fontSize: 12, color: 'var(--text-tertiary)' }}>{t.fecha}</td>
                      <td style={s.td}>
                        <button
                          style={s.detailBtn}
                          onClick={() => navigate(`/tickets/${t.id.replace('#', '')}`)}
                        >
                          <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  db:             { padding: '1.5rem', background: 'var(--bg-page)', minHeight: 'calc(100vh - 56px)', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' },
  topbar:         { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
  topbarLeft:     { display: 'flex', alignItems: 'center', gap: 10 },
  addBtn:         { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.01em' },
  logoIcon:       { width: 32, height: 32, borderRadius: 8, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  appTitle:       { fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' },
  greeting:       { fontSize: 13, color: 'var(--text-secondary)' },
  kpis:           { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: '1.5rem' },
  kpi:            { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1rem 1.25rem' },
  kpiLabel:       { fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 },
  kpiDot:         { width: 7, height: 7, borderRadius: '50%', display: 'inline-block' },
  kpiVal:         { fontSize: 24, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1 },
  kpiSub:         { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 },
  card:           { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1.25rem' },
  cardTitle:      { fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1rem' },
  filterBadge:    { fontSize: 11, fontWeight: 500, background: '#E1F5EE', color: '#0F6E56', padding: '2px 8px', borderRadius: 20 },
  clearBtn:       { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  filterBox:      { background: 'var(--bg-filter)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' },
  filterGrid:     { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px 12px', alignItems: 'end' },
  filterField:    { display: 'flex', flexDirection: 'column', gap: 4 },
  filterLabel:    { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' },
  filterInput:    { height: 34, padding: '0 10px', border: '0.5px solid var(--border-input)', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', width: '100%' },
  filterSelect:   { height: 34, padding: '0 8px', border: '0.5px solid var(--border-input)', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', cursor: 'pointer' },
  table:          { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th:             { textAlign: 'left', padding: '6px 8px', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', borderBottom: '0.5px solid var(--border)', letterSpacing: '0.03em' },
  tr:             { borderBottom: '0.5px solid var(--border)' },
  td:             { padding: '9px 8px', color: 'var(--text-primary)', verticalAlign: 'middle' },
  badge:          { display: 'inline-block', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  prio:           { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 },
  prioDot:        { width: 6, height: 6, borderRadius: '50%', display: 'inline-block' },
  detailBtn:      { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '0.5px solid var(--border)', borderRadius: 7, background: 'transparent', color: 'var(--text-primary)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: 'pointer' },
};

export default ClientDashboardPage;
