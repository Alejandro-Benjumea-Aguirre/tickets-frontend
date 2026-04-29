import { useState, useContext } from 'react';
import CreateTicketModal from '../../tickets/components/CreateTicketModal';
import { TicketsTable, type TicketRow } from '../../tickets/components/TicketsTable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { AuthContext } from '../../auth/context/AuthContext';
import { Navbar } from '../../../layouts/Navbar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip);

// ── Data ──────────────────────────────────────────────────────────────────────

const agenteKpis = [
  { label: 'Mis tickets',   val: 12,    sub: 'asignados',     dot: '#378ADD' },
  { label: 'Resueltos hoy', val: 4,     sub: 'buen ritmo',    dot: '#1D9E75' },
  { label: 'Pendientes',    val: 8,     sub: 'sin respuesta', dot: '#EF9F27' },
  { label: 'Satisfacción',  val: '94%', sub: 'últimas 30',    dot: '#639922' },
];

// Tickets asignados al agente (en producción se filtraría por ID de usuario)
const myTickets: TicketRow[] = [
  { id: '#1042', cliente: 'Ana Torres',  asunto: 'No puedo iniciar sesión',      prio: 'Alta',  estado: 'open',   agente: 'CR', agColor: '#1D9E75', fecha: 'hace 10 min', fechaISO: '2026-03-19', enEspera: false },
  { id: '#1040', cliente: 'Sara López',  asunto: 'Cambio de plan de servicio',    prio: 'Media', estado: 'prog',   agente: 'CR', agColor: '#1D9E75', fecha: 'hace 1h',     fechaISO: '2026-03-19', enEspera: false },
  { id: '#1037', cliente: 'Carlos Vera', asunto: 'Actualizar datos de contacto',  prio: 'Baja',  estado: 'closed', agente: 'CR', agColor: '#1D9E75', fecha: 'ayer',         fechaISO: '2026-03-17', enEspera: false },
];


// ── Chart configs ─────────────────────────────────────────────────────────────

const lineData = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    { label: 'Abiertos',  data: [4,6,3,8,5,2,1], borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.08)', tension: 0.4, pointRadius: 3, borderWidth: 2, fill: true },
    { label: 'Cerrados',  data: [2,4,3,5,6,3,2], borderColor: '#888780', backgroundColor: 'transparent',            tension: 0.4, pointRadius: 3, borderWidth: 2, borderDash: [4,3] },
  ],
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } },
    y: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { font: { size: 11 }, color: '#888' }, beginAtZero: true },
  },
};

const donutItems = [
  { label: 'Abiertos',    val: 5,  color: '#1D9E75' },
  { label: 'En progreso', val: 3,  color: '#378ADD' },
  { label: 'Cerrados',    val: 4,  color: '#B4B2A9' },
];

const donutData = {
  labels: donutItems.map((d) => d.label),
  datasets: [{ data: donutItems.map((d) => d.val), backgroundColor: donutItems.map((d) => d.color), borderWidth: 0, hoverOffset: 4 }],
};

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: { legend: { display: false } },
};

// ── Component ─────────────────────────────────────────────────────────────────

const AgentDashboardPage = () => {
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
            <span style={s.appTitle}>Tickets — atención al cliente</span>
            <button style={s.addBtn} onClick={() => setShowModal(true)}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Adicionar ticket
            </button>
          </div>
          <span style={s.greeting}>Bienvenido, {user?.name ?? 'Agente'}</span>
        </div>

        {/* KPIs */}
        <div style={s.kpis}>
          {agenteKpis.map((k) => (
            <div key={k.label} style={s.kpi}>
              <div style={s.kpiLabel}><span style={{ ...s.kpiDot, background: k.dot }} />{k.label}</div>
              <div style={s.kpiVal}>{k.val}</div>
              <div style={s.kpiSub}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={s.mid}>
          <div style={s.card}>
            <div style={s.cardTitle}>Mis tickets por semana</div>
            <div style={s.legend}>
              {[{ color: '#1D9E75', label: 'Abiertos' }, { color: '#888780', label: 'Cerrados' }].map((l) => (
                <div key={l.label} style={s.legItem}><div style={{ ...s.legSq, background: l.color }} />{l.label}</div>
              ))}
            </div>
            <div style={{ position: 'relative', height: 180 }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>
          <div style={s.card}>
            <div style={s.cardTitle}>Distribución por estado</div>
            <div style={s.donutWrap}>
              <div style={{ position: 'relative', width: 120, height: 120 }}>
                <Doughnut data={donutData} options={donutOptions} />
              </div>
              <div style={s.donutLabels}>
                {donutItems.map((d) => (
                  <div key={d.label} style={s.dlRow}>
                    <div style={{ ...s.legSq, background: d.color }} />{d.label}
                    <span style={s.dlVal}>{d.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tickets table + filters */}
        <TicketsTable
          allTickets={myTickets}
          title="Mis tickets"
          showCliente
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
  mid:            { display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 12, marginBottom: '1.5rem' },
  card:           { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1.25rem' },
  cardTitle:      { fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1rem' },
  legend:         { display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  legItem:        { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' },
  legSq:          { width: 9, height: 9, borderRadius: 2, display: 'inline-block' },
  donutWrap:      { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' },
  donutLabels:    { display: 'flex', flexDirection: 'column', gap: 8 },
  dlRow:          { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' },
  dlVal:          { fontWeight: 500, color: 'var(--text-primary)', marginLeft: 'auto', paddingLeft: 8 },
};

export default AgentDashboardPage;
