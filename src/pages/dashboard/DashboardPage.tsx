import { useState, useContext } from 'react';
import CreateTicketModal from '../../features/tickets/components/CreateTicketModal';
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

// ── Types ──────────────────────────────────────────────────────────────────────

interface Ticket {
  id: string;
  cliente: string;
  asunto: string;
  prio: string;
  estado: string;
  agente: string;
  agColor: string;
  fecha: string;
  fechaISO: string;
  enEspera: boolean;
}

interface Filters {
  codigo: string;
  asunto: string;
  prioridad: string;
  estado: string;
  agente: string;
  fechaDesde: string;
  fechaHasta: string;
  enEspera: string; // 'all' | 'si' | 'no'
}

// ── Data ──────────────────────────────────────────────────────────────────────

const adminKpis = [
  { label: 'Total tickets',    val: 248,    sub: 'este mes',    dot: '#888780' },
  { label: 'Abiertos',         val: 43,     sub: '+5 hoy',      dot: '#1D9E75' },
  { label: 'En progreso',      val: 31,     sub: 'asignados',   dot: '#378ADD' },
  { label: 'Tiempo promedio',  val: '2.4h', sub: 'resolución',  dot: '#EF9F27' },
];

const agenteKpis = [
  { label: 'Mis tickets',   val: 12,    sub: 'asignados',     dot: '#378ADD' },
  { label: 'Resueltos hoy', val: 4,     sub: 'buen ritmo',    dot: '#1D9E75' },
  { label: 'Pendientes',    val: 8,     sub: 'sin respuesta', dot: '#EF9F27' },
  { label: 'Satisfacción',  val: '94%', sub: 'últimas 30',    dot: '#639922' },
];

const allTickets: Ticket[] = [
  { id: '#1042', cliente: 'Ana Torres',  asunto: 'No puedo iniciar sesión',      prio: 'Alta',  estado: 'open',   agente: 'CR', agColor: '#1D9E75', fecha: 'hace 10 min', fechaISO: '2026-03-19', enEspera: false },
  { id: '#1041', cliente: 'Juan Mesa',   asunto: 'Error al generar factura',      prio: 'Alta',  estado: 'prog',   agente: 'LM', agColor: '#378ADD', fecha: 'hace 32 min', fechaISO: '2026-03-19', enEspera: true  },
  { id: '#1040', cliente: 'Sara López',  asunto: 'Cambio de plan de servicio',    prio: 'Media', estado: 'prog',   agente: 'CR', agColor: '#1D9E75', fecha: 'hace 1h',     fechaISO: '2026-03-19', enEspera: false },
  { id: '#1039', cliente: 'Pedro Ríos',  asunto: 'Reembolso pendiente',           prio: 'Alta',  estado: 'urgent', agente: '—',  agColor: '#888',    fecha: 'hace 2h',     fechaISO: '2026-03-18', enEspera: true  },
  { id: '#1038', cliente: 'Mónica Gil',  asunto: 'Consulta sobre términos',       prio: 'Baja',  estado: 'closed', agente: 'LM', agColor: '#378ADD', fecha: 'hace 3h',     fechaISO: '2026-03-18', enEspera: false },
  { id: '#1037', cliente: 'Carlos Vera', asunto: 'Actualizar datos de contacto',  prio: 'Baja',  estado: 'closed', agente: 'CR', agColor: '#1D9E75', fecha: 'ayer',         fechaISO: '2026-03-17', enEspera: false },
];

const estadoMap: Record<string, { label: string; bg: string; color: string }> = {
  open:   { label: 'Abierto',     bg: '#E1F5EE', color: '#0F6E56' },
  prog:   { label: 'En progreso', bg: '#E6F1FB', color: '#185FA5' },
  closed: { label: 'Cerrado',     bg: '#F1EFE8', color: '#5F5E5A' },
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
  prioridad:  '',
  estado:     '',
  agente:     '',
  fechaDesde: '',
  fechaHasta: '',
  enEspera:   'all',
};

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

// ── Filter logic ──────────────────────────────────────────────────────────────

function applyFilters(tickets: Ticket[], f: Filters): Ticket[] {
  return tickets.filter((t) => {
    if (f.codigo    && !t.id.toLowerCase().includes(f.codigo.toLowerCase()))       return false;
    if (f.asunto    && !t.asunto.toLowerCase().includes(f.asunto.toLowerCase()))   return false;
    if (f.prioridad && t.prio    !== f.prioridad)                                  return false;
    if (f.estado    && t.estado  !== f.estado)                                     return false;
    if (f.agente    && t.agente  !== f.agente)                                     return false;
    if (f.fechaDesde && t.fechaISO < f.fechaDesde)                                 return false;
    if (f.fechaHasta && t.fechaISO > f.fechaHasta)                                 return false;
    if (f.enEspera === 'si' && !t.enEspera)                                        return false;
    if (f.enEspera === 'no' &&  t.enEspera)                                        return false;
    return true;
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

const DashboardPage = () => {
  const authContext = useContext(AuthContext);
  const [view, setView]           = useState<'admin' | 'agente'>('admin');
  const [filters, setFilters]     = useState<Filters>(EMPTY_FILTERS);
  const [showModal, setShowModal] = useState(false);

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;

  const { user, logoutUser } = authContext;
  const kpis        = view === 'admin' ? adminKpis : agenteKpis;
  const byView      = view === 'agente' ? allTickets.filter((t) => t.agente === 'CR') : allTickets;
  const tickets     = applyFilters(byView, filters);
  const greetingName = view === 'admin' ? 'Bienvenido, Admin' : `Bienvenido, ${user?.name ?? 'Agente'}`;

  const setFilter = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const hasActiveFilters = Object.entries(filters).some(([k, v]) =>
    k === 'enEspera' ? v !== 'all' : v !== ''
  );

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={s.viewToggle}>
              <button style={{ ...s.vbtn, ...(view === 'admin'  ? s.vbtnActive : {}) }} onClick={() => setView('admin')}>Administrador</button>
              <button style={{ ...s.vbtn, ...(view === 'agente' ? s.vbtnActive : {}) }} onClick={() => setView('agente')}>Agente</button>
            </div>
            <span style={s.greeting}>{greetingName}</span>
          </div>
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
        <div style={s.card}>

          {/* Table header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ ...s.cardTitle, marginBottom: 0 }}>Tickets recientes</div>
              {tickets.length !== byView.length && (
                <span style={s.filterBadge}>{tickets.length} de {byView.length}</span>
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

          {/* Filter section */}
          <div style={s.filterBox}>
            <div style={s.filterGrid}>

              {/* Código */}
              <div style={s.filterField}>
                <label style={s.filterLabel}>Código</label>
                <input
                  style={s.filterInput}
                  type="text"
                  placeholder="#1042"
                  value={filters.codigo}
                  onChange={(e) => setFilter('codigo', e.target.value)}
                />
              </div>

              {/* Asunto */}
              <div style={{ ...s.filterField, gridColumn: 'span 2' }}>
                <label style={s.filterLabel}>Asunto</label>
                <input
                  style={s.filterInput}
                  type="text"
                  placeholder="Buscar por asunto…"
                  value={filters.asunto}
                  onChange={(e) => setFilter('asunto', e.target.value)}
                />
              </div>

              {/* Prioridad */}
              <div style={s.filterField}>
                <label style={s.filterLabel}>Prioridad</label>
                <select style={s.filterSelect} value={filters.prioridad} onChange={(e) => setFilter('prioridad', e.target.value)}>
                  <option value="">Todas</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>

              {/* Estado */}
              <div style={s.filterField}>
                <label style={s.filterLabel}>Estado</label>
                <select style={s.filterSelect} value={filters.estado} onChange={(e) => setFilter('estado', e.target.value)}>
                  <option value="">Todos</option>
                  <option value="open">Abierto</option>
                  <option value="prog">En progreso</option>
                  <option value="closed">Cerrado</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              {/* Agente */}
              <div style={s.filterField}>
                <label style={s.filterLabel}>Agente</label>
                <select style={s.filterSelect} value={filters.agente} onChange={(e) => setFilter('agente', e.target.value)}>
                  <option value="">Todos</option>
                  <option value="CR">CR</option>
                  <option value="LM">LM</option>
                </select>
              </div>

              {/* Fecha desde */}
              <div style={s.filterField}>
                <label style={s.filterLabel}>Fecha desde</label>
                <input
                  style={s.filterInput}
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) => setFilter('fechaDesde', e.target.value)}
                />
              </div>

              {/* Fecha hasta */}
              <div style={s.filterField}>
                <label style={s.filterLabel}>Fecha hasta</label>
                <input
                  style={s.filterInput}
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) => setFilter('fechaHasta', e.target.value)}
                />
              </div>

              {/* En espera */}
              <div style={s.filterField}>
                <label style={s.filterLabel}>En espera</label>
                <div style={s.toggleGroup}>
                  {(['all', 'si', 'no'] as const).map((opt) => (
                    <button
                      key={opt}
                      style={{ ...s.toggleBtn, ...(filters.enEspera === opt ? s.toggleBtnActive : {}) }}
                      onClick={() => setFilter('enEspera', opt)}
                    >
                      {opt === 'all' ? 'Todos' : opt === 'si' ? 'Sí' : 'No'}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['#', 'Cliente', 'Asunto', 'Prioridad', 'Estado', 'Agente', 'En espera', 'Creado'].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: '2rem' }}>
                      Sin resultados para los filtros aplicados
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.id} style={s.tr}>
                      <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12, color: '#888' }}>{t.id}</td>
                      <td style={{ ...s.td, fontWeight: 500 }}>{t.cliente}</td>
                      <td style={{ ...s.td, color: '#888', maxWidth: 180 }}>{t.asunto}</td>
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
                        <span style={{ ...s.agentAv, background: t.agColor + '22', color: t.agColor }}>{t.agente}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.badge, ...(t.enEspera ? { background: '#FEF3CD', color: '#8A6400' } : { background: '#F1EFE8', color: '#5F5E5A' }) }}>
                          {t.enEspera ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td style={{ ...s.td, fontSize: 12, color: '#aaa' }}>{t.fecha}</td>
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
  db:             { padding: '1.5rem', background: '#f5f7f6', minHeight: 'calc(100vh - 56px)', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' },
  topbar:         { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' },
  topbarLeft:     { display: 'flex', alignItems: 'center', gap: 10 },
  addBtn:         { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.01em' },
  logoIcon:       { width: 32, height: 32, borderRadius: 8, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  appTitle:       { fontSize: 16, fontWeight: 500, color: '#1a1a1a' },
  viewToggle:     { display: 'flex', gap: 4, background: '#f0f2f1', border: '0.5px solid #e0e0e0', borderRadius: 8, padding: 3 },
  vbtn:           { padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', background: 'transparent', color: '#888', fontFamily: "'DM Sans', sans-serif" },
  vbtnActive:     { background: '#ffffff', color: '#1D9E75', border: '0.5px solid #d0d0d0' },
  greeting:       { fontSize: 13, color: '#888' },
  kpis:           { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: '1.5rem' },
  kpi:            { background: '#ffffff', border: '0.5px solid #e0e0e0', borderRadius: 10, padding: '1rem 1.25rem' },
  kpiLabel:       { fontSize: 12, color: '#888', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 },
  kpiDot:         { width: 7, height: 7, borderRadius: '50%', display: 'inline-block' },
  kpiVal:         { fontSize: 24, fontWeight: 500, color: '#1a1a1a', lineHeight: 1 },
  kpiSub:         { fontSize: 11, color: '#aaa', marginTop: 4 },
  mid:            { display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 12, marginBottom: '1.5rem' },
  card:           { background: '#ffffff', border: '0.5px solid #e0e0e0', borderRadius: 10, padding: '1.25rem' },
  cardTitle:      { fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: '1rem' },
  legend:         { display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  legItem:        { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#888' },
  legSq:          { width: 9, height: 9, borderRadius: 2, display: 'inline-block' },
  donutWrap:      { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' },
  donutLabels:    { display: 'flex', flexDirection: 'column', gap: 8 },
  dlRow:          { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888' },
  dlVal:          { fontWeight: 500, color: '#1a1a1a', marginLeft: 'auto', paddingLeft: 8 },
  filterBadge:    { fontSize: 11, fontWeight: 500, background: '#E1F5EE', color: '#0F6E56', padding: '2px 8px', borderRadius: 20 },
  clearBtn:       { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#888', background: 'transparent', border: '0.5px solid #e0e0e0', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  filterBox:      { background: '#f9faf9', border: '0.5px solid #e8eae8', borderRadius: 8, padding: '1rem', marginBottom: '1rem' },
  filterGrid:     { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px 12px', alignItems: 'end' },
  filterField:    { display: 'flex', flexDirection: 'column', gap: 4 },
  filterLabel:    { fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: '0.04em', textTransform: 'uppercase' },
  filterInput:    { height: 34, padding: '0 10px', border: '0.5px solid #d8dad8', borderRadius: 7, background: '#ffffff', color: '#1a1a1a', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', width: '100%' },
  filterSelect:   { height: 34, padding: '0 8px', border: '0.5px solid #d8dad8', borderRadius: 7, background: '#ffffff', color: '#1a1a1a', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', cursor: 'pointer' },
  toggleGroup:    { display: 'flex', gap: 3, background: '#f0f2f1', border: '0.5px solid #d8dad8', borderRadius: 7, padding: 3, height: 34, boxSizing: 'border-box', alignItems: 'center' },
  toggleBtn:      { flex: 1, height: '100%', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', color: '#888', fontFamily: "'DM Sans', sans-serif" },
  toggleBtnActive:{ background: '#ffffff', color: '#1D9E75', border: '0.5px solid #d0d0d0' },
  table:          { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th:             { textAlign: 'left', padding: '6px 8px', fontSize: 11, fontWeight: 500, color: '#888', borderBottom: '0.5px solid #e0e0e0', letterSpacing: '0.03em' },
  tr:             { borderBottom: '0.5px solid #e0e0e0' },
  td:             { padding: '9px 8px', color: '#1a1a1a', verticalAlign: 'middle' },
  badge:          { display: 'inline-block', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  prio:           { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 },
  prioDot:        { width: 6, height: 6, borderRadius: '50%', display: 'inline-block' },
  agentAv:        { width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500 },
};

export default DashboardPage;
