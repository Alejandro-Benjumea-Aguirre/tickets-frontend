import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { Navbar } from '../../layouts/Navbar';

// ── Types ──────────────────────────────────────────────────────────────────────

interface MockUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  rol_id: number;
  client: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface UserFilters {
  name: string;
  rol_id: string;
  fechaDesde: string;
  fechaHasta: string;
  status: string;
}

interface CreateUserForm {
  name: string;
  client: string;
  rol_id: string;
  password: string;
  email: string;
  phone: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_USERS: MockUser[] = [
  { id: 1, name: 'Carlos Ramírez',   username: 'cramirez',   email: 'carlos@empresa.com',  phone: '300 123 4567', role: 'Administrador', rol_id: 1, client: '—',              status: 'active',   createdAt: '2025-01-10' },
  { id: 2, name: 'Laura Méndez',     username: 'lmendez',    email: 'laura@empresa.com',   phone: '300 987 6543', role: 'Agente',         rol_id: 2, client: '—',              status: 'active',   createdAt: '2025-02-14' },
  { id: 3, name: 'Ana Torres',       username: 'atorres',    email: 'ana@empresa.com',     phone: '310 456 7890', role: 'Cliente',        rol_id: 3, client: 'Empresa ABC',    status: 'active',   createdAt: '2025-03-01' },
  { id: 4, name: 'Juan Mesa',        username: 'jmesa',      email: 'juan@empresa.com',    phone: '315 234 5678', role: 'Cliente',        rol_id: 3, client: 'Tech Solutions', status: 'inactive', createdAt: '2025-03-05' },
  { id: 5, name: 'Diego Fernández',  username: 'dfernandez', email: 'diego@empresa.com',   phone: '300 345 6789', role: 'Agente',         rol_id: 2, client: '—',              status: 'active',   createdAt: '2025-01-22' },
  { id: 6, name: 'Paola Sánchez',    username: 'psanchez',   email: 'paola@empresa.com',   phone: '311 678 9012', role: 'Cliente',        rol_id: 3, client: 'Global Corp',    status: 'active',   createdAt: '2025-02-28' },
  { id: 7, name: 'Andrés Herrera',   username: 'aherrera',   email: 'andres@empresa.com',  phone: '316 789 0123', role: 'Agente',         rol_id: 2, client: '—',              status: 'inactive', createdAt: '2025-01-30' },
  { id: 8, name: 'Mónica Gil',       username: 'mgil',       email: 'monica@empresa.com',  phone: '318 901 2345', role: 'Cliente',        rol_id: 3, client: 'Constructora XY',status: 'active',   createdAt: '2025-03-10' },
];

const CLIENTES_OPTIONS = [
  { value: 'abc',  label: 'Empresa ABC' },
  { value: 'tech', label: 'Tech Solutions' },
  { value: 'glob', label: 'Global Corp' },
  { value: 'cons', label: 'Constructora XY' },
  { value: 'fin',  label: 'Finanzas SA' },
];

const ROLES_OPTIONS = [
  { value: '1', label: 'Administrador' },
  { value: '2', label: 'Agente' },
  { value: '3', label: 'Cliente' },
];

const EMPTY_FILTERS: UserFilters = {
  name:       '',
  rol_id:     '',
  fechaDesde: '',
  fechaHasta: '',
  status:     '',
};

const EMPTY_FORM: CreateUserForm = {
  name:     '',
  client:   '',
  rol_id:   '',
  password: '',
  email:    '',
  phone:    '',
};

const roleColors: Record<number, { bg: string; color: string }> = {
  1: { bg: '#E1F5EE', color: '#0F6E56' },
  2: { bg: '#E6F1FB', color: '#185FA5' },
  3: { bg: '#F5F0FF', color: '#6B3FA0' },
};

// ── Filter logic ──────────────────────────────────────────────────────────────

function applyFilters(users: MockUser[], f: UserFilters): MockUser[] {
  return users.filter((u) => {
    if (f.name   && !u.name.toLowerCase().includes(f.name.toLowerCase())) return false;
    if (f.rol_id && String(u.rol_id) !== f.rol_id)                         return false;
    if (f.status && u.status !== f.status)                                  return false;
    if (f.fechaDesde && u.createdAt < f.fechaDesde)                        return false;
    if (f.fechaHasta && u.createdAt > f.fechaHasta)                        return false;
    return true;
  });
}

// ── Create User Modal ─────────────────────────────────────────────────────────

interface CreateUserModalProps {
  onClose: () => void;
  onSave: (form: CreateUserForm) => void;
}

const CreateUserModal = ({ onClose, onSave }: CreateUserModalProps) => {
  const [form, setForm]           = useState<CreateUserForm>(EMPTY_FORM);
  const [showPass, setShowPass]   = useState(false);
  const [errors, setErrors]       = useState<Partial<CreateUserForm>>({});
  const overlayRef                = useRef<HTMLDivElement>(null);

  // Close on overlay click
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof CreateUserForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Partial<CreateUserForm> = {};
    if (!form.name.trim())     e.name     = 'El nombre es requerido';
    if (!form.email.trim())    e.email    = 'El correo es requerido';
    if (!form.rol_id)          e.rol_id   = 'Selecciona un rol';
    if (!form.password.trim()) e.password = 'La contraseña es requerida';
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <div style={ms.headerTitle}>Crear usuario</div>
              <div style={ms.headerSub}>Completa los datos del nuevo usuario</div>
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

          {/* Row 1: Nombre + Correo */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Nombre completo <span style={ms.req}>*</span></label>
              <input
                style={{ ...ms.input, ...(errors.name ? ms.inputError : {}) }}
                type="text"
                placeholder="Ej. Juan Pérez"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
              {errors.name && <span style={ms.error}>{errors.name}</span>}
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Correo electrónico <span style={ms.req}>*</span></label>
              <input
                style={{ ...ms.input, ...(errors.email ? ms.inputError : {}) }}
                type="email"
                placeholder="correo@empresa.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
              {errors.email && <span style={ms.error}>{errors.email}</span>}
            </div>
          </div>

          {/* Row 2: Teléfono + Contraseña */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Teléfono</label>
              <input
                style={ms.input}
                type="tel"
                placeholder="300 000 0000"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Contraseña <span style={ms.req}>*</span></label>
              <div style={ms.passWrap}>
                <input
                  style={{ ...ms.input, ...ms.passInput, ...(errors.password ? ms.inputError : {}) }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                />
                <button
                  type="button"
                  style={ms.eyeBtn}
                  onClick={() => setShowPass((p) => !p)}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span style={ms.error}>{errors.password}</span>}
            </div>
          </div>

          {/* Row 3: Rol + Cliente */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Rol <span style={ms.req}>*</span></label>
              <select
                style={{ ...ms.select, ...(errors.rol_id ? ms.inputError : {}) }}
                value={form.rol_id}
                onChange={(e) => set('rol_id', e.target.value)}
              >
                <option value="">Seleccionar rol…</option>
                {ROLES_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {errors.rol_id && <span style={ms.error}>{errors.rol_id}</span>}
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Cliente</label>
              <select
                style={ms.select}
                value={form.client}
                onChange={(e) => set('client', e.target.value)}
              >
                <option value="">Sin cliente asignado</option>
                {CLIENTES_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div style={ms.footer}>
            <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={ms.saveBtn}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Crear usuario
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

// ── Edit User Modal ───────────────────────────────────────────────────────────

interface EditUserForm {
  name:   string;
  email:  string;
  phone:  string;
  client: string;
}

interface EditUserModalProps {
  user:    MockUser;
  onClose: () => void;
  onSave:  (id: number, form: EditUserForm) => void;
}

const EditUserModal = ({ user, onClose, onSave }: EditUserModalProps) => {
  const [form, setForm]     = useState<EditUserForm>({
    name:   user.name,
    email:  user.email,
    phone:  user.phone === '—' ? '' : user.phone,
    client: user.client === '—' ? '' : user.client,
  });
  const [errors, setErrors] = useState<Partial<EditUserForm>>({});
  const overlayRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof EditUserForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Partial<EditUserForm> = {};
    if (!form.name.trim())  e.name  = 'El nombre es requerido';
    if (!form.email.trim()) e.email = 'El correo es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(user.id, form);
  };

  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const avatarBg = ({ 1: '#1D9E75', 2: '#378ADD', 3: '#7C5CBF' } as Record<number, string>)[user.rol_id] ?? '#888';
  const formattedDate = new Date(user.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

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
            <div style={{ ...ms.headerIcon, background: avatarBg, fontSize: 13, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {initials}
            </div>
            <div>
              <div style={ms.headerTitle}>Editar usuario</div>
              <div style={ms.headerSub}>{user.username} · {user.role}</div>
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

          {/* Read-only row: Estado + Fecha creación */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Estado</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: user.status === 'active' ? '#1D9E75' : '#B4B2A9', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: user.status === 'active' ? '#0F6E56' : 'var(--text-tertiary)', fontWeight: 500 }}>
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Fecha de creación</label>
              <div style={{ ...ms.readonlyField }}>{formattedDate}</div>
            </div>
          </div>

          {/* Nombre + Correo */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Nombre completo <span style={ms.req}>*</span></label>
              <input
                style={{ ...ms.input, ...(errors.name ? ms.inputError : {}) }}
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
              {errors.name && <span style={ms.error}>{errors.name}</span>}
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Correo electrónico <span style={ms.req}>*</span></label>
              <input
                style={{ ...ms.input, ...(errors.email ? ms.inputError : {}) }}
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
              {errors.email && <span style={ms.error}>{errors.email}</span>}
            </div>
          </div>

          {/* Teléfono + Cliente */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Teléfono</label>
              <input
                style={ms.input}
                type="tel"
                placeholder="300 000 0000"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Cliente</label>
              <select
                style={ms.select}
                value={form.client}
                onChange={(e) => set('client', e.target.value)}
              >
                <option value="">Sin cliente asignado</option>
                {CLIENTES_OPTIONS.map((c) => (
                  <option key={c.value} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div style={ms.footer}>
            <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={ms.saveBtn}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Guardar cambios
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

// ── Users Page ────────────────────────────────────────────────────────────────

const UsersPage = () => {
  const authContext               = useContext(AuthContext);
  const [filters, setFilters]     = useState<UserFilters>(EMPTY_FILTERS);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers]         = useState<MockUser[]>(MOCK_USERS);
  const [editUser, setEditUser]   = useState<MockUser | null>(null);

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;
  const { user, logoutUser } = authContext;

  const filtered = applyFilters(users, filters);

  const setFilter = (key: keyof UserFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  const handleToggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
  };

  const handleEditSave = (id: number, form: EditUserForm) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, name: form.name, email: form.email, phone: form.phone || '—', client: form.client || '—' }
          : u
      )
    );
    setEditUser(null);
  };

  const handleSave = (form: CreateUserForm) => {
    const roleLabel = ROLES_OPTIONS.find((r) => r.value === form.rol_id)?.label ?? '';
    const clientLabel = CLIENTES_OPTIONS.find((c) => c.value === form.client)?.label ?? '—';
    const newUser: MockUser = {
      id:        users.length + 1,
      name:      form.name,
      username:  form.name.split(' ').map((w) => w[0]).join('').toLowerCase(),
      email:     form.email,
      phone:     form.phone || '—',
      role:      roleLabel,
      rol_id:    Number(form.rol_id),
      client:    clientLabel,
      status:    'active',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setUsers((prev) => [newUser, ...prev]);
    setShowModal(false);
  };

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const avatarColor = (rol_id: number) =>
    ({ 1: '#1D9E75', 2: '#378ADD', 3: '#7C5CBF' }[rol_id] ?? '#888');

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
                          <div style={{ ...s.avatar, background: avatarColor(u.rol_id) }}>
                            {initials(u.name)}
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
                        <span style={{ ...s.rolBadge, background: roleColors[u.rol_id].bg, color: roleColors[u.rol_id].color }}>
                          {u.role}
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
                        {new Date(u.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
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
                            onClick={() => handleToggleStatus(u.id)}
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

// ── Page styles ───────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page:          { padding: '1.5rem', background: 'var(--bg-page)', minHeight: 'calc(100vh - 56px)', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' },
  topbar:        { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' },
  pageTitle:     { fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 },
  pageSub:       { fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 },
  addBtn:        { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif', letterSpacing: '0.01em'", flexShrink: 0 },
  card:          { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' },
  filterGrid:    { display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '10px 12px', alignItems: 'end' },
  filterField:   { display: 'flex', flexDirection: 'column', gap: 4 },
  filterLabel:   { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' },
  inputWrap:     { position: 'relative' },
  inputIcon:     { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' },
  inputWithIcon: { height: 34, padding: '0 10px 0 32px', border: '0.5px solid var(--border-input)', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' },
  input:         { height: 34, padding: '0 10px', border: '0.5px solid var(--border-input)', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' },
  select:        { height: 34, padding: '0 8px', border: '0.5px solid var(--border-input)', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', cursor: 'pointer' },
  toggleGroup:   { display: 'flex', gap: 3, background: 'var(--bg-toggle)', border: '0.5px solid var(--border-input)', borderRadius: 7, padding: 3, height: 34, boxSizing: 'border-box', alignItems: 'center' },
  toggleBtn:     { flex: 1, height: '100%', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' },
  toggleBtnActive:{ background: 'var(--bg-active)', color: '#1D9E75', border: '0.5px solid var(--border-input)' },
  clearBtn:      { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: 6, padding: '0 10px', height: 34, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' },
  tableHeader:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  tableTitle:    { fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' },
  badge:         { fontSize: 11, fontWeight: 500, background: 'var(--bg-filter)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 20, border: '0.5px solid var(--border)' },
  table:         { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th:            { textAlign: 'left', padding: '6px 10px', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', borderBottom: '0.5px solid var(--border)', letterSpacing: '0.03em', whiteSpace: 'nowrap' },
  tr:            { borderBottom: '0.5px solid var(--border)' },
  td:            { padding: '10px 10px', verticalAlign: 'middle' },
  avatar:        { width: 32, height: 32, borderRadius: '50%', color: '#fff', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rolBadge:      { display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  statusDot:        { width: 6, height: 6, borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  actionBtn:        { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '0.5px solid var(--border)', borderRadius: 7, background: 'transparent', color: 'var(--text-primary)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' },
  actionBtnDanger:  { borderColor: '#FBCFCF', color: '#A32D2D', background: '#FDF3F3' },
  actionBtnSuccess: { borderColor: '#B5E4D4', color: '#0F6E56', background: '#E8F9F3' },
};

// ── Modal styles ──────────────────────────────────────────────────────────────

const ms: Record<string, React.CSSProperties> = {
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:      { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 14, width: '100%', maxWidth: 580, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' },
  header:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '0.5px solid var(--border)' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerTitle:{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' },
  headerSub:  { fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 },
  closeBtn:   { width: 32, height: 32, borderRadius: 8, border: '0.5px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' },
  body:       { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  row:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field:      { display: 'flex', flexDirection: 'column', gap: 5 },
  label:      { fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.03em' },
  req:        { color: '#E24B4A' },
  input:      { height: 38, padding: '0 12px', border: '0.5px solid var(--border-input)', borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' },
  inputError: { borderColor: '#E24B4A' },
  select:     { height: 38, padding: '0 10px', border: '0.5px solid var(--border-input)', borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', cursor: 'pointer' },
  passWrap:   { position: 'relative' },
  passInput:  { paddingRight: 40 },
  eyeBtn:     { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: 0 },
  error:      { fontSize: 11, color: '#E24B4A', marginTop: 2 },
  footer:     { display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: '0.5rem', borderTop: '0.5px solid var(--border)', marginTop: '0.25rem' },
  cancelBtn:  { height: 36, padding: '0 16px', border: '0.5px solid var(--border)', borderRadius: 8, background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' },
  saveBtn:       { height: 36, padding: '0 18px', border: 'none', borderRadius: 8, background: '#1D9E75', color: '#fff', fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
  readonlyField: { height: 38, display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--text-primary)', padding: '0 12px', background: 'var(--bg-filter)', border: '0.5px solid var(--border)', borderRadius: 8 },
};

export default UsersPage;
