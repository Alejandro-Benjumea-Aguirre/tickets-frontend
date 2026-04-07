import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface TicketRow {
  id: string;
  asunto: string;
  prio: string;
  estado: string;
  fecha: string;
  fechaISO: string;
  enEspera: boolean;
  cliente?: string;
  agente?: string;
  agColor?: string;
}

interface Filters {
  codigo: string;
  asunto: string;
  prioridad: string;
  estado: string;
  agente: string;
  fechaDesde: string;
  fechaHasta: string;
  enEspera: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const prioColor: Record<string, string> = {
  Alta:  '#E24B4A',
  Media: '#EF9F27',
  Baja:  '#888780',
};

const EMPTY_FILTERS: Filters = {
  codigo: '', asunto: '', prioridad: '', estado: '',
  agente: '', fechaDesde: '', fechaHasta: '', enEspera: 'all',
};

// ── Props ──────────────────────────────────────────────────────────────────────

interface TicketsTableProps {
  allTickets: TicketRow[];
  title?: string;
  showCliente?: boolean;
  showAgente?: boolean;
  showPrioridadFilter?: boolean;
  showAgenteFilter?: boolean;
  showEnEsperaFilter?: boolean;
  agentesOptions?: string[];
  closedLabel?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const TicketsTable = ({
  allTickets,
  title = 'Tickets',
  showCliente = false,
  showAgente = false,
  showPrioridadFilter = true,
  showAgenteFilter = false,
  showEnEsperaFilter = true,
  agentesOptions = [],
  closedLabel = 'Cerrado',
}: TicketsTableProps) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const estadoMap: Record<string, { label: string; bg: string; color: string }> = {
    open:   { label: 'Abierto',     bg: '#E1F5EE', color: '#0F6E56' },
    prog:   { label: 'En progreso', bg: '#E6F1FB', color: '#185FA5' },
    closed: { label: closedLabel,   bg: '#F1EFE8', color: '#5F5E5A' },
    urgent: { label: 'Urgente',     bg: '#FCEBEB', color: '#A32D2D' },
  };

  const setFilter = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const tickets = allTickets.filter((t) => {
    if (filters.codigo     && !t.id.toLowerCase().includes(filters.codigo.toLowerCase()))     return false;
    if (filters.asunto     && !t.asunto.toLowerCase().includes(filters.asunto.toLowerCase())) return false;
    if (filters.prioridad  && t.prio   !== filters.prioridad)                                 return false;
    if (filters.estado     && t.estado !== filters.estado)                                    return false;
    if (filters.agente     && t.agente !== filters.agente)                                    return false;
    if (filters.fechaDesde && t.fechaISO < filters.fechaDesde)                               return false;
    if (filters.fechaHasta && t.fechaISO > filters.fechaHasta)                               return false;
    if (filters.enEspera === 'si' && !t.enEspera)                                            return false;
    if (filters.enEspera === 'no' &&  t.enEspera)                                            return false;
    return true;
  });

  const hasActiveFilters = Object.entries(filters).some(([k, v]) =>
    k === 'enEspera' ? v !== 'all' : v !== ''
  );

  const colCount =
    2 + // # + Asunto
    1 + // Prioridad (siempre)
    1 + // Estado
    1 + // En espera (siempre)
    1 + // Creado
    1 + // Acciones
    (showCliente ? 1 : 0) +
    (showAgente  ? 1 : 0);

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ ...s.cardTitle, marginBottom: 0 }}>{title}</div>
          {tickets.length !== allTickets.length && (
            <span style={s.filterBadge}>{tickets.length} de {allTickets.length}</span>
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

          {showPrioridadFilter && (
            <div style={s.filterField}>
              <label style={s.filterLabel}>Prioridad</label>
              <select style={s.filterSelect} value={filters.prioridad} onChange={(e) => setFilter('prioridad', e.target.value)}>
                <option value="">Todas</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          )}

          <div style={s.filterField}>
            <label style={s.filterLabel}>Estado</label>
            <select style={s.filterSelect} value={filters.estado} onChange={(e) => setFilter('estado', e.target.value)}>
              <option value="">Todos</option>
              <option value="open">Abierto</option>
              <option value="prog">En progreso</option>
              <option value="closed">{closedLabel}</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          {showAgenteFilter && agentesOptions.length > 0 && (
            <div style={s.filterField}>
              <label style={s.filterLabel}>Agente</label>
              <select style={s.filterSelect} value={filters.agente} onChange={(e) => setFilter('agente', e.target.value)}>
                <option value="">Todos</option>
                {agentesOptions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          )}

          <div style={s.filterField}>
            <label style={s.filterLabel}>Fecha desde</label>
            <input style={s.filterInput} type="date" value={filters.fechaDesde} onChange={(e) => setFilter('fechaDesde', e.target.value)} />
          </div>

          <div style={s.filterField}>
            <label style={s.filterLabel}>Fecha hasta</label>
            <input style={s.filterInput} type="date" value={filters.fechaHasta} onChange={(e) => setFilter('fechaHasta', e.target.value)} />
          </div>

          {showEnEsperaFilter && (
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
          )}

        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>#</th>
              {showCliente && <th style={s.th}>Cliente</th>}
              <th style={s.th}>Asunto</th>
              <th style={s.th}>Prioridad</th>
              <th style={s.th}>Estado</th>
              {showAgente && <th style={s.th}>Agente</th>}
              <th style={s.th}>En espera</th>
              <th style={s.th}>Creado</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={colCount} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: '2rem' }}>
                  Sin resultados para los filtros aplicados
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} style={s.tr}>
                  <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{t.id}</td>
                  {showCliente && <td style={{ ...s.td, fontWeight: 500 }}>{t.cliente}</td>}
                  <td style={{ ...s.td, color: 'var(--text-secondary)', maxWidth: 180 }}>{t.asunto}</td>
                  <td style={s.td}>
                    <span style={s.prio}>
                      <span style={{ ...s.prioDot, background: prioColor[t.prio] }} />{t.prio}
                    </span>
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: estadoMap[t.estado]?.bg, color: estadoMap[t.estado]?.color }}>
                      {estadoMap[t.estado]?.label}
                    </span>
                  </td>
                  {showAgente && (
                    <td style={s.td}>
                      <span style={{ ...s.agentAv, background: (t.agColor ?? '#888') + '22', color: t.agColor ?? '#888' }}>
                        {t.agente}
                      </span>
                    </td>
                  )}
                  <td style={s.td}>
                    <span style={{ ...s.badge, ...(t.enEspera ? { background: '#FEF3CD', color: '#8A6400' } : { background: '#F1EFE8', color: '#5F5E5A' }) }}>
                      {t.enEspera ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td style={{ ...s.td, fontSize: 12, color: 'var(--text-tertiary)' }}>{t.fecha}</td>
                  <td style={s.td}>
                    <button style={s.detailBtn} onClick={() => navigate(`/tickets/${t.id.replace('#', '')}`)}>
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
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
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
  toggleGroup:    { display: 'flex', gap: 3, background: 'var(--bg-toggle)', border: '0.5px solid var(--border-input)', borderRadius: 7, padding: 3, height: 34, boxSizing: 'border-box', alignItems: 'center' },
  toggleBtn:      { flex: 1, height: '100%', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif" },
  toggleBtnActive:{ background: 'var(--bg-active)', color: '#1D9E75', border: '0.5px solid var(--border-input)' },
  table:          { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th:             { textAlign: 'left', padding: '6px 8px', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', borderBottom: '0.5px solid var(--border)', letterSpacing: '0.03em' },
  tr:             { borderBottom: '0.5px solid var(--border)' },
  td:             { padding: '9px 8px', color: 'var(--text-primary)', verticalAlign: 'middle' },
  badge:          { display: 'inline-block', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  prio:           { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 },
  prioDot:        { width: 6, height: 6, borderRadius: '50%', display: 'inline-block' },
  agentAv:        { width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500 },
  detailBtn:      { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '0.5px solid var(--border)', borderRadius: 7, background: 'transparent', color: 'var(--text-primary)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: 'pointer' },
};
