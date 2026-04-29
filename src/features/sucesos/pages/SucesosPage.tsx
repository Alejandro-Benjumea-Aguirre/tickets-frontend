import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Navbar } from '../../../layouts/Navbar';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Suceso {
  id: number;
  name: string;
  level: number;
  parentId: number | null;
  parentName: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

interface SucesoFilters {
  name:   string;
  parent: string;
}

interface CreateSucesoForm {
  name:     string;
  level:    string;
  parentId: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_SUCESOS: Suceso[] = [
  { id: 1,  name: 'Incidente',                    level: 1, parentId: null, parentName: '—',                         createdAt: '2024-10-01', status: 'active' },
  { id: 2,  name: 'Solicitud de servicio',         level: 1, parentId: null, parentName: '—',                         createdAt: '2024-10-01', status: 'active' },
  { id: 3,  name: 'Queja',                         level: 1, parentId: null, parentName: '—',                         createdAt: '2024-10-01', status: 'active' },
  { id: 4,  name: 'Consulta',                      level: 1, parentId: null, parentName: '—',                         createdAt: '2024-10-02', status: 'active' },
  { id: 5,  name: 'Acceso y autenticación',        level: 2, parentId: 1,    parentName: 'Incidente',                  createdAt: '2024-10-05', status: 'active' },
  { id: 6,  name: 'Facturación y pagos',           level: 2, parentId: 1,    parentName: 'Incidente',                  createdAt: '2024-10-05', status: 'active' },
  { id: 7,  name: 'Soporte técnico',               level: 2, parentId: 2,    parentName: 'Solicitud de servicio',      createdAt: '2024-10-06', status: 'active' },
  { id: 8,  name: 'Gestión de cuenta',             level: 2, parentId: 4,    parentName: 'Consulta',                   createdAt: '2024-10-06', status: 'active' },
  { id: 9,  name: 'Inicio de sesión',              level: 3, parentId: 5,    parentName: 'Acceso y autenticación',     createdAt: '2024-10-10', status: 'active' },
  { id: 10, name: 'Recuperación de contraseña',    level: 3, parentId: 5,    parentName: 'Acceso y autenticación',     createdAt: '2024-10-10', status: 'active' },
  { id: 11, name: 'Fallo en pago',                 level: 3, parentId: 6,    parentName: 'Facturación y pagos',        createdAt: '2024-10-11', status: 'active' },
  { id: 12, name: 'Reembolso',                     level: 3, parentId: 6,    parentName: 'Facturación y pagos',        createdAt: '2024-10-11', status: 'active' },
  { id: 13, name: 'Configuración de dispositivo',  level: 4, parentId: 9,    parentName: 'Inicio de sesión',           createdAt: '2024-11-01', status: 'active' },
  { id: 14, name: 'Acceso remoto',                 level: 4, parentId: 7,    parentName: 'Soporte técnico',            createdAt: '2024-11-03', status: 'active' },
  { id: 15, name: 'Portal web',                    level: 5, parentId: 13,   parentName: 'Configuración de dispositivo', createdAt: '2024-11-15', status: 'active' },
];

const LEVEL_LABELS: Record<number, string> = {
  1: 'Nivel 1',
  2: 'Nivel 2',
  3: 'Nivel 3',
  4: 'Nivel 4',
  5: 'Nivel 5',
};

const LEVEL_COLORS: Record<number, { bg: string; color: string }> = {
  1: { bg: '#E1F5EE', color: '#0F6E56' },
  2: { bg: '#E6F1FB', color: '#185FA5' },
  3: { bg: '#F5F0FF', color: '#6B3FA0' },
  4: { bg: '#FEF3CD', color: '#8A6400' },
  5: { bg: '#FCEBEB', color: '#A32D2D' },
};

const LEVEL_DOT: Record<number, string> = {
  1: '#1D9E75',
  2: '#378ADD',
  3: '#7C5CBF',
  4: '#EF9F27',
  5: '#E24B4A',
};

const EMPTY_FILTERS: SucesoFilters = { name: '', parent: '' };
const EMPTY_FORM: CreateSucesoForm  = { name: '', level: '', parentId: '' };

// ── Filter logic ──────────────────────────────────────────────────────────────

function applyFilters(sucesos: Suceso[], f: SucesoFilters): Suceso[] {
  return sucesos.filter((s) => {
    if (f.name   && !s.name.toLowerCase().includes(f.name.toLowerCase()))             return false;
    if (f.parent && !s.parentName.toLowerCase().includes(f.parent.toLowerCase()))     return false;
    return true;
  });
}

// ── Create Suceso Modal ───────────────────────────────────────────────────────

interface CreateSucesoModalProps {
  sucesos: Suceso[];
  onClose: () => void;
  onSave:  (form: CreateSucesoForm) => void;
}

const CreateSucesoModal = ({ sucesos, onClose, onSave }: CreateSucesoModalProps) => {
  const [form, setForm]     = useState<CreateSucesoForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<CreateSucesoForm>>({});
  const overlayRef          = useRef<HTMLDivElement>(null);

  const selectedLevel = Number(form.level);

  // Sucesos disponibles como padre: nivel inmediatamente anterior
  const parentOptions = sucesos.filter((s) => s.level === selectedLevel - 1);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof CreateSucesoForm, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Al cambiar nivel, limpiar selección de padre
      if (key === 'level') next.parentId = '';
      return next;
    });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Partial<CreateSucesoForm> = {};
    if (!form.name.trim()) e.name  = 'El nombre es requerido';
    if (!form.level)       e.level = 'Selecciona un nivel';
    if (selectedLevel > 1 && !form.parentId) e.parentId = 'Selecciona el suceso superior';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  return (
    <div
      ref={overlayRef}
      style={ms.overlay}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div style={ms.modal}>

        {/* Header */}
        <div style={ms.header}>
          <div style={ms.headerLeft}>
            <div style={ms.headerIcon}>
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="white" strokeWidth={2}>
                <circle cx="12" cy="12" r="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
            <div>
              <div style={ms.headerTitle}>Crear suceso</div>
              <div style={ms.headerSub}>Define el nombre y jerarquía del suceso</div>
            </div>
          </div>
          <button style={ms.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={ms.body}>

          {/* Nombre */}
          <div style={ms.field}>
            <label style={ms.label}>
              Nombre del suceso <span style={ms.req}>*</span>
            </label>
            <input
              style={{ ...ms.input, ...(errors.name ? ms.inputError : {}) }}
              type="text"
              placeholder="Ej. Incidente de red"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              autoFocus
            />
            {errors.name && <span style={ms.error}>{errors.name}</span>}
          </div>

          {/* Nivel */}
          <div style={ms.field}>
            <label style={ms.label}>
              Nivel del suceso <span style={ms.req}>*</span>
            </label>
            <div style={ms.levelGrid}>
              {[1, 2, 3, 4, 5].map((lvl) => {
                const active = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    style={{
                      ...ms.levelBtn,
                      ...(active ? {
                        background: LEVEL_COLORS[lvl].bg,
                        color: LEVEL_COLORS[lvl].color,
                        border: `1.5px solid ${LEVEL_DOT[lvl]}`,
                        fontWeight: 600,
                      } : {}),
                    }}
                    onClick={() => set('level', String(lvl))}
                  >
                    <span style={{
                      ...ms.levelDot,
                      background: active ? LEVEL_DOT[lvl] : 'var(--text-tertiary)',
                    }} />
                    Nivel {lvl}
                  </button>
                );
              })}
            </div>
            {errors.level && <span style={ms.error}>{errors.level}</span>}
          </div>

          {/* Suceso superior — solo si nivel > 1 */}
          {selectedLevel > 1 && (
            <div style={ms.field}>
              <label style={ms.label}>
                Suceso superior
                <span style={{ ...ms.levelChip, background: LEVEL_COLORS[selectedLevel - 1].bg, color: LEVEL_COLORS[selectedLevel - 1].color }}>
                  Nivel {selectedLevel - 1}
                </span>
                <span style={ms.req}> *</span>
              </label>

              {parentOptions.length === 0 ? (
                <div style={ms.emptyParent}>
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  No hay sucesos de Nivel {selectedLevel - 1} registrados
                </div>
              ) : (
                <select
                  style={{ ...ms.select, ...(errors.parentId ? ms.inputError : {}) }}
                  value={form.parentId}
                  onChange={(e) => set('parentId', e.target.value)}
                >
                  <option value="">Seleccionar suceso superior…</option>
                  {parentOptions.map((p) => (
                    <option key={p.id} value={String(p.id)}>{p.name}</option>
                  ))}
                </select>
              )}
              {errors.parentId && <span style={ms.error}>{errors.parentId}</span>}
            </div>
          )}

          {/* Preview jerarquía */}
          {form.name && selectedLevel > 0 && (
            <div style={ms.preview}>
              <div style={ms.previewLabel}>Vista previa de jerarquía</div>
              <div style={ms.previewPath}>
                {selectedLevel > 1 && form.parentId && (
                  <>
                    <span style={ms.previewParent}>
                      {parentOptions.find((p) => String(p.id) === form.parentId)?.name ?? '…'}
                    </span>
                    <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="var(--text-tertiary)" strokeWidth={2}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </>
                )}
                <span style={{ ...ms.previewCurrent, color: LEVEL_COLORS[selectedLevel]?.color ?? 'var(--text-primary)' }}>
                  {form.name}
                </span>
                <span style={{ ...ms.levelBadgeSmall, background: LEVEL_COLORS[selectedLevel]?.bg, color: LEVEL_COLORS[selectedLevel]?.color }}>
                  {LEVEL_LABELS[selectedLevel]}
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={ms.footer}>
            <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={ms.saveBtn}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Crear suceso
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

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

// ── Page styles ───────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page:           { padding: '1.5rem', background: 'var(--bg-page)', minHeight: 'calc(100vh - 56px)', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' },
  topbar:         { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' },
  pageTitle:      { fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 },
  pageSub:        { fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 },
  addBtn:         { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 },
  card:           { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' },
  legendCard:     { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '0.875rem 1.25rem', marginBottom: '1rem', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' },
  legendItem:     { display: 'flex', alignItems: 'center', gap: 6 },
  legendDot:      { width: 7, height: 7, borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  legendBadge:    { display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  legendCount:    { fontSize: 11, color: 'var(--text-tertiary)' },
  filterGrid:     { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px 12px', alignItems: 'end' },
  filterField:    { display: 'flex', flexDirection: 'column', gap: 4 },
  filterLabel:    { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' },
  inputWrap:      { position: 'relative' },
  inputIcon:      { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' },
  inputWithIcon:  { height: 34, padding: '0 10px 0 32px', border: '0.5px solid var(--border-input)', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' },
  clearBtn:       { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: 6, padding: '0 10px', height: 34, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  tableHeader:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  tableTitle:     { fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' },
  countBadge:     { fontSize: 11, fontWeight: 500, background: 'var(--bg-filter)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 20, border: '0.5px solid var(--border)' },
  table:          { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th:             { textAlign: 'left', padding: '6px 10px', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', borderBottom: '0.5px solid var(--border)', letterSpacing: '0.03em', whiteSpace: 'nowrap' },
  tr:             { borderBottom: '0.5px solid var(--border)', transition: 'background 0.1s' },
  td:             { padding: '10px 10px', verticalAlign: 'middle' },
  levelBadge:     { display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  levelDotInline:   { width: 7, height: 7, borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  actionBtnDanger:  { fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", background: '#FCEBEB', color: '#A32D2D' },
  actionBtnSuccess: { fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", background: '#E1F5EE', color: '#0F6E56' },
};

// ── Modal styles ──────────────────────────────────────────────────────────────

const ms: Record<string, React.CSSProperties> = {
  overlay:        { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:          { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 14, width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' },
  header:         { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '0.5px solid var(--border)' },
  headerLeft:     { display: 'flex', alignItems: 'center', gap: 12 },
  headerIcon:     { width: 36, height: 36, borderRadius: 10, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerTitle:    { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' },
  headerSub:      { fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 },
  closeBtn:       { width: 32, height: 32, borderRadius: 8, border: '0.5px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' },
  body:           { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field:          { display: 'flex', flexDirection: 'column', gap: 6 },
  label:          { fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 6 },
  req:            { color: '#E24B4A' },
  input:          { height: 38, padding: '0 12px', border: '0.5px solid var(--border-input)', borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' },
  select:         { height: 38, padding: '0 10px', border: '0.5px solid var(--border-input)', borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', cursor: 'pointer' },
  inputError:     { borderColor: '#E24B4A' },
  error:          { fontSize: 11, color: '#E24B4A' },
  levelGrid:      { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 },
  levelBtn:       { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 4px', border: '0.5px solid var(--border-input)', borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' },
  levelDot:       { width: 7, height: 7, borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  levelChip:      { display: 'inline-block', padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 600, marginLeft: 4 },
  levelBadgeSmall:{ display: 'inline-block', padding: '1px 7px', borderRadius: 20, fontSize: 10, fontWeight: 500 },
  emptyParent:    { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)', background: 'var(--bg-filter)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '10px 12px' },
  preview:        { background: 'var(--bg-filter)', border: '0.5px solid var(--border-light)', borderRadius: 8, padding: '10px 14px' },
  previewLabel:   { fontSize: 10, fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 },
  previewPath:    { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  previewParent:  { fontSize: 12, color: 'var(--text-secondary)' },
  previewCurrent: { fontSize: 13, fontWeight: 600 },
  footer:         { display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: '0.75rem', borderTop: '0.5px solid var(--border)', marginTop: '0.25rem' },
  cancelBtn:      { height: 36, padding: '0 16px', border: '0.5px solid var(--border)', borderRadius: 8, background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' },
  saveBtn:        { height: 36, padding: '0 18px', border: 'none', borderRadius: 8, background: '#1D9E75', color: '#fff', fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
};

export default SucesosPage;
