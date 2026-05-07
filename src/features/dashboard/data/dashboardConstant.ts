// ── Data ──────────────────────────────────────────────────────────────────────

export const adminKpis = [
  { label: 'Total tickets',    val: 248,    sub: 'este mes',    dot: '#888780' },
  { label: 'Abiertos',         val: 43,     sub: '+5 hoy',      dot: '#1D9E75' },
  { label: 'En progreso',      val: 31,     sub: 'asignados',   dot: '#378ADD' },
  { label: 'Tiempo promedio',  val: '2.4h', sub: 'resolución',  dot: '#EF9F27' },
];

export const agenteKpis = [
  { label: 'Mis tickets',   val: 12,    sub: 'asignados',     dot: '#378ADD' },
  { label: 'Resueltos hoy', val: 4,     sub: 'buen ritmo',    dot: '#1D9E75' },
  { label: 'Pendientes',    val: 8,     sub: 'sin respuesta', dot: '#EF9F27' },
  { label: 'Satisfacción',  val: '94%', sub: 'últimas 30',    dot: '#639922' },
];

export const clientKpis = [
  { label: 'Mis tickets',   val: 5,  sub: 'en total',       dot: '#888780' },
  { label: 'Abiertos',      val: 2,  sub: 'sin resolver',   dot: '#1D9E75' },
  { label: 'En progreso',   val: 1,  sub: 'siendo atendido',dot: '#378ADD' },
  { label: 'Resueltos',     val: 2,  sub: 'este mes',       dot: '#EF9F27' },
];

export const allTickets = [
  { id: '#1042', cliente: 'Ana Torres',  asunto: 'No puedo iniciar sesión',      prio: 'Alta',  estado: 'open',   agente: 'CR', agColor: '#1D9E75', fecha: 'hace 10 min', fechaISO: '2026-03-19', enEspera: false },
  { id: '#1041', cliente: 'Juan Mesa',   asunto: 'Error al generar factura',      prio: 'Alta',  estado: 'prog',   agente: 'LM', agColor: '#378ADD', fecha: 'hace 32 min', fechaISO: '2026-03-19', enEspera: true  },
  { id: '#1040', cliente: 'Sara López',  asunto: 'Cambio de plan de servicio',    prio: 'Media', estado: 'prog',   agente: 'CR', agColor: '#1D9E75', fecha: 'hace 1h',     fechaISO: '2026-03-19', enEspera: false },
  { id: '#1039', cliente: 'Pedro Ríos',  asunto: 'Reembolso pendiente',           prio: 'Alta',  estado: 'urgent', agente: '—',  agColor: '#888',    fecha: 'hace 2h',     fechaISO: '2026-03-18', enEspera: true  },
  { id: '#1038', cliente: 'Mónica Gil',  asunto: 'Consulta sobre términos',       prio: 'Baja',  estado: 'closed', agente: 'LM', agColor: '#378ADD', fecha: 'hace 3h',     fechaISO: '2026-03-18', enEspera: false },
  { id: '#1037', cliente: 'Carlos Vera', asunto: 'Actualizar datos de contacto',  prio: 'Baja',  estado: 'closed', agente: 'CR', agColor: '#1D9E75', fecha: 'ayer',         fechaISO: '2026-03-17', enEspera: false },
];

export const myTickets = [
  { id: '#1042', cliente: 'Ana Torres',  asunto: 'No puedo iniciar sesión',      prio: 'Alta',  estado: 'open',   agente: 'CR', agColor: '#1D9E75', fecha: 'hace 10 min', fechaISO: '2026-03-19', enEspera: false },
  { id: '#1040', cliente: 'Sara López',  asunto: 'Cambio de plan de servicio',    prio: 'Media', estado: 'prog',   agente: 'CR', agColor: '#1D9E75', fecha: 'hace 1h',     fechaISO: '2026-03-19', enEspera: false },
  { id: '#1037', cliente: 'Carlos Vera', asunto: 'Actualizar datos de contacto',  prio: 'Baja',  estado: 'closed', agente: 'CR', agColor: '#1D9E75', fecha: 'ayer',         fechaISO: '2026-03-17', enEspera: false },
];

// ── Chart configs ─────────────────────────────────────────────────────────────

export const lineData = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    { label: 'Abiertos',    data: [18,22,15,28,20,12,8],  borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.08)', tension: 0.4, pointRadius: 3, borderWidth: 2, fill: true },
    { label: 'En progreso', data: [10,14,12,18,15,9,6],   borderColor: '#378ADD', backgroundColor: 'transparent',             tension: 0.4, pointRadius: 3, borderWidth: 2 },
    { label: 'Cerrados',    data: [8,12,10,15,18,10,5],   borderColor: '#888780', backgroundColor: 'transparent',             tension: 0.4, pointRadius: 3, borderWidth: 2, borderDash: [4,3] },
  ],
};

export const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#888' } },
    y: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { font: { size: 11 }, color: '#888' }, beginAtZero: true },
  },
};

export const donutItems = [
  { label: 'Abiertos',    val: 43,  color: '#1D9E75' },
  { label: 'En progreso', val: 31,  color: '#378ADD' },
  { label: 'Cerrados',    val: 174, color: '#B4B2A9' },
];

export const donutData = {
  labels: donutItems.map((d) => d.label),
  datasets: [{ data: donutItems.map((d) => d.val), backgroundColor: donutItems.map((d) => d.color), borderWidth: 0, hoverOffset: 4 }],
};

export const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: { legend: { display: false } },
};
