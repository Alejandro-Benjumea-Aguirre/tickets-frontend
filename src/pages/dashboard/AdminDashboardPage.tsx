import { useState, useContext } from 'react';
import CreateTicketModal from '../../features/tickets/components/CreateTicketModal';
import { TicketsTable, type TicketRow } from '../../features/tickets/components/TicketsTable';
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
import { AuthContext } from '../../features/auth/context/AuthContext';
import { Navbar } from '../../layouts/Navbar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip);

// ── Data ──────────────────────────────────────────────────────────────────────

const adminKpis = [
  { label: 'Total tickets',    val: 248,    sub: 'este mes',    dot: '#888780' },
  { label: 'Abiertos',         val: 43,     sub: '+5 hoy',      dot: '#1D9E75' },
  { label: 'En progreso',      val: 31,     sub: 'asignados',   dot: '#378ADD' },
  { label: 'Tiempo promedio',  val: '2.4h', sub: 'resolución',  dot: '#EF9F27' },
];

const allTickets: TicketRow[] = [
  { id: '#1042', cliente: 'Ana Torres',  asunto: 'No puedo iniciar sesión',      prio: 'Alta',  estado: 'open',   agente: 'CR', agColor: '#1D9E75', fecha: 'hace 10 min', fechaISO: '2026-03-19', enEspera: false },
  { id: '#1041', cliente: 'Juan Mesa',   asunto: 'Error al generar factura',      prio: 'Alta',  estado: 'prog',   agente: 'LM', agColor: '#378ADD', fecha: 'hace 32 min', fechaISO: '2026-03-19', enEspera: true  },
  { id: '#1040', cliente: 'Sara López',  asunto: 'Cambio de plan de servicio',    prio: 'Media', estado: 'prog',   agente: 'CR', agColor: '#1D9E75', fecha: 'hace 1h',     fechaISO: '2026-03-19', enEspera: false },
  { id: '#1039', cliente: 'Pedro Ríos',  asunto: 'Reembolso pendiente',           prio: 'Alta',  estado: 'urgent', agente: '—',  agColor: '#888',    fecha: 'hace 2h',     fechaISO: '2026-03-18', enEspera: true  },
  { id: '#1038', cliente: 'Mónica Gil',  asunto: 'Consulta sobre términos',       prio: 'Baja',  estado: 'closed', agente: 'LM', agColor: '#378ADD', fecha: 'hace 3h',     fechaISO: '2026-03-18', enEspera: false },
  { id: '#1037', cliente: 'Carlos Vera', asunto: 'Actualizar datos de contacto',  prio: 'Baja',  estado: 'closed', agente: 'CR', agColor: '#1D9E75', fecha: 'ayer',         fechaISO: '2026-03-17', enEspera: false },
];


// ── Chart configs ─────────────────────────────────────────────────────────────

const lineData = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    { label: 'Abiertos',    data: [18,22,15,28,20,12,8],  borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.08)', tension: 0.4, pointRadius: 3, borderWidth: 2, fill: true },
    { label: 'En progreso', data: [10,14,12,18,15,9,6],   borderColor: '#378ADD', backgroundColor: 'transparent',             tension: 0.4, pointRadius: 3, borderWidth: 2 },
    { label: 'Cerrados',    data: [8,12,10,15,18,10,5],   borderColor: '#888780', backgroundColor: 'transparent',             tension: 0.4, pointRadius: 3, borderWidth: 2, borderDash: [4,3] },
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
  { label: 'Abiertos',    val: 43,  color: '#1D9E75' },
  { label: 'En progreso', val: 31,  color: '#378ADD' },
  { label: 'Cerrados',    val: 174, color: '#B4B2A9' },
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

const AdminDashboardPage = () => {
  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;

  const { user, logoutUser } = authContext;
  const kpis = adminKpis;

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
          <div />
        </div>

        {/* KPIs */}
        <div style={s.kpis}>
          {kpis.map((k) => (
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
            <div style={s.cardTitle}>Tickets por semana</div>
            <div style={s.legend}>
              {[{ color: '#1D9E75', label: 'Abiertos' }, { color: '#378ADD', label: 'En progreso' }, { color: '#888780', label: 'Cerrados' }].map((l) => (
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
          allTickets={allTickets}
          title="Tickets recientes"
          showCliente
          showAgente
          showAgenteFilter
          agentesOptions={['CR', 'LM']}
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
  viewToggle:     { display: 'flex', gap: 4, background: 'var(--bg-toggle)', border: '0.5px solid var(--border)', borderRadius: 8, padding: 3 },
  vbtn:           { padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" },
  vbtnActive:     { background: 'var(--bg-active)', color: '#1D9E75', border: '0.5px solid var(--border-input)' },
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

export default AdminDashboardPage;
