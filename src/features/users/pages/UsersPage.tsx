import { useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Navbar } from '../../../layouts/Navbar/pages/Navbar';
import { ROLES_OPTIONS, roleColors } from '../data/usersConstant';
import { s } from '../styles/UserPage.style';
import { applyFilters, getInitials, getAvatarColor } from '../utils/userUtils';
import { useUsers } from '../hooks/useUsers';
import { CreateUserModal } from '../components/CreateUserModal';
import { EditUserModal } from '../components/EditUserModal';

// ── Users Page ────────────────────────────────────────────────────────────────

const UsersPage = () => {
  const authContext = useContext(AuthContext);

  const {
    users, filters, showModal, editUser, hasActiveFilters,
    setFilter, setShowModal, setEditUser,
    handleToggleStatus, handleEditSave, handleSave, clearFilters
  } = useUsers();

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;
  const { user, logoutUser } = authContext;

  const filtered = applyFilters(users, filters);

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />
      {showModal  && <CreateUserModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      {editUser   && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={handleEditSave} />}

      <div style={s.page}>

        {/* Topbar */}
        <div style={s.topbar}>
          <div>
            <div style={s.pageTitle}>Usuarios</div>
            <div style={s.pageSub}>Gestiona los usuarios del sistema</div>
          </div>
          <button style={s.addBtn} onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Crear usuario
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
                  placeholder="Buscar por nombre…"
                  value={filters.name}
                  onChange={(e) => setFilter('name', e.target.value)}
                />
              </div>
            </div>

            {/* Rol */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Rol</label>
              <select style={s.select} value={filters.rol_id} onChange={(e) => setFilter('rol_id', e.target.value)}>
                <option value="">Todos los roles</option>
                {ROLES_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {/* Fecha desde */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Creado desde</label>
              <input style={s.input} type="date" value={filters.fechaDesde} onChange={(e) => setFilter('fechaDesde', e.target.value)} />
            </div>

            {/* Fecha hasta */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Creado hasta</label>
              <input style={s.input} type="date" value={filters.fechaHasta} onChange={(e) => setFilter('fechaHasta', e.target.value)} />
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
                <button style={s.clearBtn} onClick={clearFilters}> {/* ← sin setFilters directo */}
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

          {/* Table header */}
          <div style={s.tableHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={s.tableTitle}>Lista de usuarios</span>
              <span style={s.badge}>{filtered.length} {filtered.length === 1 ? 'usuario' : 'usuarios'}</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Usuario', 'Correo', 'Teléfono', 'Rol', 'Cliente', 'Estado', 'Creado', 'Acciones'].map((h) => (
                    <th key={h} style={h === 'Acciones' ? { ...s.th, textAlign: 'center' } : s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ ...s.td, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke="var(--text-tertiary)" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Sin usuarios para los filtros aplicados
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} style={s.tr}>

                      {/* Usuario */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ ...s.avatar, background: getAvatarColor(u.rol_id) }}>
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>@{u.username}</div>
                          </div>
                        </div>
                      </td>

                      {/* Correo */}
                      <td style={{ ...s.td, color: 'var(--text-secondary)', fontSize: 13 }}>{u.email}</td>

                      {/* Teléfono */}
                      <td style={{ ...s.td, color: 'var(--text-secondary)', fontSize: 13 }}>{u.phone}</td>

                      {/* Rol */}
                      <td style={s.td}>
                        <span style={{ ...s.rolBadge, background: roleColors[u.rol_id]?.bg ?? '#EEE', color: roleColors[u.rol_id]?.color ?? '#666' }}>
                          {u.rol}
                        </span>
                      </td>

                      {/* Cliente */}
                      <td style={{ ...s.td, color: 'var(--text-secondary)', fontSize: 13 }}>{u.client}</td>

                      {/* Estado */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ ...s.statusDot, background: u.status === 'active' ? '#1D9E75' : '#B4B2A9' }} />
                          <span style={{ fontSize: 12, color: u.status === 'active' ? '#0F6E56' : 'var(--text-tertiary)' }}>
                            {u.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </td>

                      {/* Creado */}
                      <td style={{ ...s.td, fontSize: 12, color: 'var(--text-tertiary)' }}>
                        {new Date(u.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Acciones */}
                      <td style={{ ...s.td, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>

                          {/* Editar */}
                          <button
                            style={s.actionBtn}
                            title="Editar usuario"
                            onClick={() => setEditUser(u)}
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
                              ...(u.status === 'active' ? s.actionBtnDanger : s.actionBtnSuccess),
                            }}
                            title={u.status === 'active' ? 'Inactivar usuario' : 'Activar usuario'}
                            onClick={() => handleToggleStatus(u.id, u.status)}
                          >
                            {u.status === 'active' ? (
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

export default UsersPage;
