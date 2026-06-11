import { useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Navbar } from '../../../layouts/Navbar/pages/Navbar';
import { s } from '../styles/ClientsPage.style';

// Hooks y Utils
import { useClients } from '../hooks/useClients';
import { getInitials, getAvatarBg } from '../utils/clientUtils';

// Componentes
import { CreateClientModal } from '../components/CreateClientModal';
import { EditClientModal } from '../components/EditClientModal';


// ── Clients Page ──────────────────────────────────────────────────────────────

const ClientsPage = () => {
  const authContext = useContext(AuthContext);
  const {
    clients, filters, setFilter, clearFilters,
    showModal, setShowModal, editClient, setEditClient,
    handleToggleStatus, handleSave, handleEditSave, hasActiveFilters
  } = useClients();

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;
  const { user, logoutUser } = authContext;

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />
      {showModal   && 
        <CreateClientModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSave} />
      }
      {editClient  && 
        <EditClientModal 
          client={editClient} 
          onClose={() => setEditClient(null)} 
          onSave={handleEditSave} />
      }

      <div style={s.page}>

        {/* Topbar */}
        <div style={s.topbar}>
          <div>
            <div style={s.pageTitle}>Clientes</div>
            <div style={s.pageSub}>Gestiona los clientes registrados en el sistema</div>
          </div>
          <button style={s.addBtn} onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Crear cliente
          </button>
        </div>

        {/* Filters card */}
        <div style={s.card}>
          <div style={s.filterGrid}>

            {/* Nombre */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Nombre</label>
              <div style={s.inputWrap}>
                <svg style={s.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  style={s.inputWithIcon}
                  type="text"
                  placeholder="Buscar cliente…"
                  value={filters.name}
                  onChange={(e) => setFilter('name', e.target.value)}
                />
              </div>
            </div>

            {/* Correo */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Correo</label>
              <div style={s.inputWrap}>
                <svg style={s.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  style={s.inputWithIcon}
                  type="text"
                  placeholder="correo@empresa.com"
                  value={filters.email}
                  onChange={(e) => setFilter('email', e.target.value)}
                />
              </div>
            </div>

            {/* Teléfono */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Teléfono</label>
              <div style={s.inputWrap}>
                <svg style={s.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l1.62-1.62a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15z" />
                </svg>
                <input
                  style={s.inputWithIcon}
                  type="text"
                  placeholder="601 000 0000"
                  value={filters.phone}
                  onChange={(e) => setFilter('phone', e.target.value)}
                />
              </div>
            </div>

            {/* Ingeniero */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Ingeniero</label>
              <div style={s.inputWrap}>
                <svg style={s.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  style={s.inputWithIcon}
                  type="text"
                  placeholder="Nombre del ingeniero…"
                  value={filters.engineer}
                  onChange={(e) => setFilter('engineer', e.target.value)}
                />
              </div>
            </div>

            {/* Fecha desde */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Creado desde</label>
              <input
                style={s.input}
                type="date"
                value={filters.fechaDesde}
                onChange={(e) => setFilter('fechaDesde', e.target.value)}
              />
            </div>

            {/* Fecha hasta */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Creado hasta</label>
              <input
                style={s.input}
                type="date"
                value={filters.fechaHasta}
                onChange={(e) => setFilter('fechaHasta', e.target.value)}
              />
            </div>

            {/* Estado */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Estado</label>
              <div style={s.toggleGroup}>
                {([['', 'Todos'], ['active', 'Activo'], ['inactive', 'Inactivo']] as const).map(([val, lbl]) => (
                  <button
                    key={val}
                    style={{ ...s.toggleBtn, ...(filters.status === val ? s.toggleBtnActive : {}) }}
                    onClick={() => setFilter('status', val)}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            <div style={{ ...s.filterField, justifyContent: 'flex-end' }}>
              <label style={{ ...s.filterLabel, visibility: 'hidden' }}>·</label>
              {hasActiveFilters ? (
                <button style={s.clearBtn} onClick={clearFilters}>
                  <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Limpiar
                </button>
              ) : <div />}
            </div>

          </div>
        </div>

        {/* Table card */}
        <div style={s.card}>

          <div style={s.tableHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={s.tableTitle}>Lista de clientes</span>
              <span style={s.countBadge}>
                {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Cliente', 'Correo', 'Teléfono', 'Ingeniero', 'Estado', 'Creado', 'Acciones'].map((h) => (
                    <th key={h} style={h === 'Acciones' ? { ...s.th, textAlign: 'center' } : s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ ...s.td, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke="var(--text-tertiary)" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 8h1m-1 4h1m4-4h1m-1 4h1M9 21v-3a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v3" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4v1H3V7z" />
                        </svg>
                        Sin clientes para los filtros aplicados
                      </div>
                    </td>
                  </tr>
                ) : (
                  clients.map((c) => (
                    <tr key={c.id} style={s.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-filter)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >

                      {/* Cliente */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ ...s.avatar, background: getAvatarBg(c.name) }}>
                            {getInitials(c.name)}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                            {c.name}
                          </span>
                        </div>
                      </td>

                      {/* Correo */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="var(--text-tertiary)" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.email}</span>
                        </div>
                      </td>

                      {/* Teléfono */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="var(--text-tertiary)" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l1.62-1.62a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15z" />
                          </svg>
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.phone}</span>
                        </div>
                      </td>

                      {/* Ingeniero */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={s.engineerAv}>{getInitials(c.engineer === '—' ? '?' : c.engineer)}</div>
                          <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{c.engineer}</span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ ...s.statusDot, background: c.status === 'active' ? '#1D9E75' : '#B4B2A9' }} />
                          <span style={{ fontSize: 12, color: c.status === 'active' ? '#0F6E56' : 'var(--text-tertiary)' }}>
                            {c.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </td>

                      {/* Creado */}
                      <td style={{ ...s.td, fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                        {new Date(c.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Acciones */}
                      <td style={{ ...s.td, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>

                          {/* Editar */}
                          <button
                            style={s.actionBtn}
                            title="Editar cliente"
                            onClick={() => setEditClient(c)}
                          >
                            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Editar
                          </button>

                          {/* Activar / Inactivar */}
                          <button
                            style={{
                              ...s.actionBtn,
                              ...(c.status === 'active' ? s.actionBtnDanger : s.actionBtnSuccess),
                            }}
                            title={c.status === 'active' ? 'Inactivar cliente' : 'Activar cliente'}
                            onClick={() => handleToggleStatus(c.id)}
                          >
                            {c.status === 'active' ? (
                              <>
                                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                </svg>
                                Inactivar
                              </>
                            ) : (
                              <>
                                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Activar
                              </>
                            )}
                          </button>

                        </div>
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

export default ClientsPage;
