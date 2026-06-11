import { useState, useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Navbar } from '../../../layouts/Navbar/pages/Navbar';
import { MOCK_SUCESOS, LEVEL_LABELS, LEVEL_COLORS, LEVEL_DOT, EMPTY_FILTERS } from '../data/sucesosConstant';
import { Suceso, SucesoFilters, CreateSucesoForm } from '../types/sucesos.types';
import { s } from '../styles/SucesosPage.style';
import { CreateSucesoModal } from '../components/CreateSucesoModal';

// ── Filter logic ──────────────────────────────────────────────────────────────

function applyFilters(sucesos: Suceso[], f: SucesoFilters): Suceso[] {
  return sucesos.filter((s) => {
    if (f.name   && !s.name.toLowerCase().includes(f.name.toLowerCase()))             return false;
    if (f.parent && !s.parentName.toLowerCase().includes(f.parent.toLowerCase()))     return false;
    return true;
  });
}

// ── Sucesos Page ──────────────────────────────────────────────────────────────

const SucesosPage = () => {
  const authContext               = useContext(AuthContext);
  const [filters, setFilters]     = useState<SucesoFilters>(EMPTY_FILTERS);
  const [showModal, setShowModal] = useState(false);
  const [sucesos, setSucesos]     = useState<Suceso[]>(MOCK_SUCESOS);

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;
  const { user, logoutUser } = authContext;

  const filtered = applyFilters(sucesos, filters);

  const setFilter = (key: keyof SucesoFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  const handleToggleStatus = (id: number) => {
    setSucesos((prev) =>
      prev.map((su) => su.id === id ? { ...su, status: su.status === 'active' ? 'inactive' : 'active' } : su)
    );
  };

  const handleSave = (form: CreateSucesoForm) => {
    const level    = Number(form.level);
    const parentId = form.parentId ? Number(form.parentId) : null;
    const parent   = sucesos.find((s) => s.id === parentId);

    const newSuceso: Suceso = {
      id:         sucesos.length + 1,
      name:       form.name,
      level,
      parentId,
      parentName: parent?.name ?? '—',
      createdAt:  new Date().toISOString().slice(0, 10),
      status:     'active',
    };
    setSucesos((prev) => [...prev, newSuceso]);
    setShowModal(false);
  };

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />
      {showModal && (
        <CreateSucesoModal
          sucesos={sucesos}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <div style={s.page}>

        {/* Topbar */}
        <div style={s.topbar}>
          <div>
            <div style={s.pageTitle}>Sucesos</div>
            <div style={s.pageSub}>Gestiona la jerarquía de sucesos del sistema</div>
          </div>
          <button style={s.addBtn} onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Crear suceso
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

            {/* Suceso superior */}
            <div style={s.filterField}>
              <label style={s.filterLabel}>Suceso superior</label>
              <div style={s.inputWrap}>
                <svg style={s.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <input
                  style={s.inputWithIcon}
                  type="text"
                  placeholder="Buscar por suceso relacionado…"
                  value={filters.parent}
                  onChange={(e) => setFilter('parent', e.target.value)}
                />
              </div>
            </div>

            {/* Clear */}
            <div style={{ ...s.filterField, justifyContent: 'flex-end' }}>
              <label style={{ ...s.filterLabel, visibility: 'hidden' }}>·</label>
              {hasActiveFilters ? (
                <button style={s.clearBtn} onClick={() => setFilters(EMPTY_FILTERS)}>
                  <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Limpiar
                </button>
              ) : <div />}
            </div>

          </div>
        </div>

        {/* Tree legend */}
        <div style={s.legendCard}>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div key={lvl} style={s.legendItem}>
              <span style={{ ...s.legendDot, background: LEVEL_DOT[lvl] }} />
              <span style={{ ...s.legendBadge, background: LEVEL_COLORS[lvl].bg, color: LEVEL_COLORS[lvl].color }}>
                {LEVEL_LABELS[lvl]}
              </span>
              <span style={s.legendCount}>
                {sucesos.filter((s) => s.level === lvl).length} suceso{sucesos.filter((s) => s.level === lvl).length !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div style={s.card}>

          <div style={s.tableHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={s.tableTitle}>Lista de sucesos</span>
              <span style={s.countBadge}>
                {filtered.length} {filtered.length === 1 ? 'suceso' : 'sucesos'}
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Nombre', 'Nivel', 'Suceso superior', 'Creado', 'Acciones'].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ ...s.td, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke="var(--text-tertiary)" strokeWidth={1.5}>
                          <circle cx="12" cy="12" r="3" />
                          <path strokeLinecap="round" d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                        </svg>
                        Sin resultados para los filtros aplicados
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((su) => (
                    <tr
                      key={su.id}
                      style={s.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-filter)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >

                      {/* Nombre con indentación visual por nivel */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: (su.level - 1) * 18 }}>
                          {su.level > 1 && (
                            <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="var(--text-tertiary)" strokeWidth={2} style={{ flexShrink: 0 }}>
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          )}
                          <span style={{ ...s.levelDotInline, background: LEVEL_DOT[su.level] }} />
                          <span style={{ fontSize: 13, fontWeight: su.level === 1 ? 600 : 400, color: 'var(--text-primary)' }}>
                            {su.name}
                          </span>
                        </div>
                      </td>

                      {/* Nivel */}
                      <td style={s.td}>
                        <span style={{ ...s.levelBadge, background: LEVEL_COLORS[su.level].bg, color: LEVEL_COLORS[su.level].color }}>
                          {LEVEL_LABELS[su.level]}
                        </span>
                      </td>

                      {/* Suceso superior */}
                      <td style={s.td}>
                        {su.parentName === '—' ? (
                          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>—</span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ ...s.levelDotInline, background: LEVEL_DOT[su.level - 1] }} />
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{su.parentName}</span>
                          </div>
                        )}
                      </td>

                      {/* Creado */}
                      <td style={{ ...s.td, fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                        {new Date(su.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Acciones */}
                      <td style={{ ...s.td, whiteSpace: 'nowrap' }}>
                        <button
                          style={su.status === 'active' ? s.actionBtnDanger : s.actionBtnSuccess}
                          onClick={() => handleToggleStatus(su.id)}
                        >
                          {su.status === 'active' ? 'Inactivar' : 'Activar'}
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

export default SucesosPage;
