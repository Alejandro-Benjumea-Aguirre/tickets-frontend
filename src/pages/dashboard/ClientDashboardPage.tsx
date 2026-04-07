import { useState, useContext } from 'react';
import CreateTicketModal from '../../features/tickets/components/CreateTicketModal';
import { TicketsTable, type TicketRow } from '../../features/tickets/components/TicketsTable';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { Navbar } from '../../layouts/Navbar';

// ── Data ──────────────────────────────────────────────────────────────────────

const clientKpis = [
  { label: 'Mis tickets',   val: 5,  sub: 'en total',       dot: '#888780' },
  { label: 'Abiertos',      val: 2,  sub: 'sin resolver',   dot: '#1D9E75' },
  { label: 'En progreso',   val: 1,  sub: 'siendo atendido',dot: '#378ADD' },
  { label: 'Resueltos',     val: 2,  sub: 'este mes',       dot: '#EF9F27' },
];

// Tickets del cliente (en producción se filtraría por ID de cliente)
const myTickets: TicketRow[] = [
  { id: '#1042', asunto: 'No puedo iniciar sesión',     prio: 'Alta',  estado: 'open',   fecha: 'hace 10 min', fechaISO: '2026-03-19', enEspera: false },
  { id: '#1040', asunto: 'Cambio de plan de servicio',  prio: 'Media', estado: 'prog',   fecha: 'hace 1h',     fechaISO: '2026-03-19', enEspera: false },
  { id: '#1035', asunto: 'Problema con facturación',    prio: 'Alta',  estado: 'closed', fecha: 'hace 2 días',  fechaISO: '2026-03-17', enEspera: false },
  { id: '#1030', asunto: 'Consulta de producto',        prio: 'Baja',  estado: 'closed', fecha: 'hace 5 días',  fechaISO: '2026-03-14', enEspera: false },
  { id: '#1025', asunto: 'Error en descarga de reporte',prio: 'Media', estado: 'open',   fecha: 'hace 1 sem',   fechaISO: '2026-03-12', enEspera: true  },
];


// ── Component ─────────────────────────────────────────────────────────────────

const ClientDashboardPage = () => {
  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;

  const { user, logoutUser } = authContext;

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
        <TicketsTable
          allTickets={myTickets}
          title="Mis tickets"
          closedLabel="Resuelto"
          showPrioridadFilter={false}
          showEnEsperaFilter={false}
        />
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
};

export default ClientDashboardPage;
