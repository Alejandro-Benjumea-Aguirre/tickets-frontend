import { useState, useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Navbar } from '../../../layouts/Navbar/pages/Navbar';
import { ModuleKey } from '../types/reportes.types';
import { s } from '../styles/ReportePage.style';
import { CLIENTES, ESTADO_MAP, LEVEL_COLORS, MODULE_CONFIGS, PRIO_COLORS, SUCESOS, TICKETS, USUARIOS } from '../data/ReportesConstant';
import { GenerateModal } from '../components/ReporteModal';

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

export default ReportesPage;
