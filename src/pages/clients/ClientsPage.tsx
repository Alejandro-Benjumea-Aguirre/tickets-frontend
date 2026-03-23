import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { Navbar } from '../../layouts/Navbar';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  engineer: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface ClientFilters {
  name: string;
  email: string;
  phone: string;
  engineer: string;
  status: string;
  fechaDesde: string;
  fechaHasta: string;
}

interface CreateClientForm {
  name: string;
  email: string;
  phone: string;
  engineer: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_CLIENTS: Client[] = [
  { id: 1,  name: 'Empresa ABC',           email: 'contacto@empresaabc.com',   phone: '601 234 5678', engineer: 'Carlos Ramírez',  status: 'active',   createdAt: '2024-11-05' },
  { id: 2,  name: 'Tech Solutions',        email: 'info@techsolutions.com',     phone: '601 987 6543', engineer: 'Laura Méndez',    status: 'active',   createdAt: '2024-12-01' },
  { id: 3,  name: 'Global Corp',           email: 'soporte@globalcorp.com',     phone: '604 456 7890', engineer: 'Diego Fernández', status: 'active',   createdAt: '2025-01-14' },
  { id: 4,  name: 'Constructora XY',       email: 'admin@constructoraxy.com',   phone: '607 321 0987', engineer: 'Laura Méndez',    status: 'inactive', createdAt: '2025-01-28' },
  { id: 5,  name: 'Finanzas SA',           email: 'it@finanzassa.com',          phone: '602 654 3210', engineer: 'Carlos Ramírez',  status: 'active',   createdAt: '2025-02-10' },
  { id: 6,  name: 'Distribuidora Norte',   email: 'sistemas@distnorte.com',     phone: '605 789 4561', engineer: 'Diego Fernández', status: 'active',   createdAt: '2025-02-20' },
  { id: 7,  name: 'Inversiones del Valle', email: 'contacto@invvalle.com',      phone: '603 147 2589', engineer: 'Paola Sánchez',   status: 'inactive', createdAt: '2025-03-02' },
  { id: 8,  name: 'Soluciones Integrales', email: 'soporte@solint.com',         phone: '606 258 3690', engineer: 'Paola Sánchez',   status: 'active',   createdAt: '2025-03-12' },
];

const EMPTY_FILTERS: ClientFilters = {
  name:       '',
  email:      '',
  phone:      '',
  engineer:   '',
  status:     '',
  fechaDesde: '',
  fechaHasta: '',
};

const EMPTY_FORM: CreateClientForm = {
  name:     '',
  email:    '',
  phone:    '',
  engineer: '',
};

// ── Filter logic ──────────────────────────────────────────────────────────────

function applyFilters(clients: Client[], f: ClientFilters): Client[] {
  return clients.filter((c) => {
    if (f.name     && !c.name.toLowerCase().includes(f.name.toLowerCase()))         return false;
    if (f.email    && !c.email.toLowerCase().includes(f.email.toLowerCase()))       return false;
    if (f.phone    && !c.phone.includes(f.phone))                                   return false;
    if (f.engineer && !c.engineer.toLowerCase().includes(f.engineer.toLowerCase())) return false;
    if (f.status   && c.status !== f.status)                                        return false;
    if (f.fechaDesde && c.createdAt < f.fechaDesde)                                 return false;
    if (f.fechaHasta && c.createdAt > f.fechaHasta)                                 return false;
    return true;
  });
}

// ── Create Client Modal ───────────────────────────────────────────────────────

interface CreateClientModalProps {
  onClose: () => void;
  onSave:  (form: CreateClientForm) => void;
}

const CreateClientModal = ({ onClose, onSave }: CreateClientModalProps) => {
  const [form, setForm]   = useState<CreateClientForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<CreateClientForm>>({});
  const overlayRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof CreateClientForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Partial<CreateClientForm> = {};
    if (!form.name.trim())     e.name     = 'El nombre es requerido';
    if (!form.email.trim())    e.email    = 'El correo es requerido';
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 8h1m-1 4h1m4-4h1m-1 4h1M9 21v-3a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4v1H3V7z" />
              </svg>
            </div>
            <div>
              <div style={ms.headerTitle}>Crear cliente</div>
              <div style={ms.headerSub}>Registra un nuevo cliente en el sistema</div>
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
              Nombre del cliente <span style={ms.req}>*</span>
            </label>
            <input
              style={{ ...ms.input, ...(errors.name ? ms.inputError : {}) }}
              type="text"
              placeholder="Ej. Empresa ABC"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && <span style={ms.error}>{errors.name}</span>}
          </div>

          {/* Correo + Teléfono */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>
                Correo electrónico <span style={ms.req}>*</span>
              </label>
              <div style={ms.inputWrap}>
                <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  style={{ ...ms.input, ...ms.inputWithIcon, ...(errors.email ? ms.inputError : {}) }}
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>
              {errors.email && <span style={ms.error}>{errors.email}</span>}
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Teléfono</label>
              <div style={ms.inputWrap}>
                <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l1.62-1.62a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15z" />
                </svg>
                <input
                  style={{ ...ms.input, ...ms.inputWithIcon }}
                  type="tel"
                  placeholder="601 000 0000"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Ingeniero */}
          <div style={ms.field}>
            <label style={ms.label}>Ingeniero asignado</label>
            <div style={ms.inputWrap}>
              <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                style={{ ...ms.input, ...ms.inputWithIcon }}
                type="text"
                placeholder="Nombre del ingeniero"
                value={form.engineer}
                onChange={(e) => set('engineer', e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={ms.footer}>
            <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={ms.saveBtn}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Crear cliente
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

// ── Edit Client Modal ─────────────────────────────────────────────────────────

interface EditClientForm {
  email:    string;
  phone:    string;
  engineer: string;
}

interface EditClientModalProps {
  client:  Client;
  onClose: () => void;
  onSave:  (id: number, form: EditClientForm) => void;
}

const EditClientModal = ({ client, onClose, onSave }: EditClientModalProps) => {
  const [form, setForm]     = useState<EditClientForm>({
    email:    client.email,
    phone:    client.phone === '—' ? '' : client.phone,
    engineer: client.engineer === '—' ? '' : client.engineer,
  });
  const [errors, setErrors] = useState<Partial<EditClientForm>>({});
  const overlayRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof EditClientForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Partial<EditClientForm> = {};
    if (!form.email.trim()) e.email = 'El correo es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(client.id, form);
  };

  const avatarBgFn = (name: string) => {
    const colors = ['#1D9E75', '#378ADD', '#7C5CBF', '#EF9F27', '#E24B4A', '#0891B2'];
    return colors[name.charCodeAt(0) % colors.length];
  };
  const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const formattedDate = new Date(client.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

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
            <div style={{ ...ms.headerIcon, background: avatarBgFn(client.name), fontSize: 13, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
              {initials(client.name)}
            </div>
            <div>
              <div style={ms.headerTitle}>Editar cliente</div>
              <div style={ms.headerSub}>{client.name}</div>
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

          {/* Row 1: Nombre (readonly) + Estado (readonly) */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Nombre del cliente</label>
              <div style={ms.readonlyField}>
                {client.name}
              </div>
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Estado</label>
              <div style={{ ...ms.readonlyField, gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: client.status === 'active' ? '#1D9E75' : '#B4B2A9', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ color: client.status === 'active' ? '#0F6E56' : 'var(--text-tertiary)', fontWeight: 500 }}>
                  {client.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Fecha creación (readonly) + Correo (editable) */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Fecha de creación</label>
              <div style={ms.readonlyField}>{formattedDate}</div>
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Correo electrónico <span style={ms.req}>*</span></label>
              <div style={ms.inputWrap}>
                <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  style={{ ...ms.input, ...ms.inputWithIcon, ...(errors.email ? ms.inputError : {}) }}
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>
              {errors.email && <span style={ms.error}>{errors.email}</span>}
            </div>
          </div>

          {/* Row 3: Teléfono + Ingeniero */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Teléfono</label>
              <div style={ms.inputWrap}>
                <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l1.62-1.62a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15z" />
                </svg>
                <input
                  style={{ ...ms.input, ...ms.inputWithIcon }}
                  type="tel"
                  placeholder="601 000 0000"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
              </div>
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Ingeniero asignado</label>
              <div style={ms.inputWrap}>
                <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  style={{ ...ms.input, ...ms.inputWithIcon }}
                  type="text"
                  placeholder="Nombre del ingeniero"
                  value={form.engineer}
                  onChange={(e) => set('engineer', e.target.value)}
                />
              </div>
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

// ── Clients Page ──────────────────────────────────────────────────────────────

const ClientsPage = () => {
  const authContext                 = useContext(AuthContext);
  const [filters, setFilters]       = useState<ClientFilters>(EMPTY_FILTERS);
  const [showModal, setShowModal]   = useState(false);
  const [clients, setClients]       = useState<Client[]>(MOCK_CLIENTS);
  const [editClient, setEditClient] = useState<Client | null>(null);

  if (!authContext) return <div>Error: AuthContext no está disponible</div>;
  const { user, logoutUser } = authContext;

  const filtered = applyFilters(clients, filters);

  const setFilter = (key: keyof ClientFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  const handleToggleStatus = (id: number) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
      )
    );
  };

  const handleEditSave = (id: number, form: EditClientForm) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, email: form.email, phone: form.phone || '—', engineer: form.engineer || '—' }
          : c
      )
    );
    setEditClient(null);
  };

  const handleSave = (form: CreateClientForm) => {
    const newClient: Client = {
      id:        clients.length + 1,
      name:      form.name,
      email:     form.email,
      phone:     form.phone  || '—',
      engineer:  form.engineer || '—',
      status:    'active',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setClients((prev) => [newClient, ...prev]);
    setShowModal(false);
  };

  const initials = (name: string) =>
    name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const avatarBg = (name: string) => {
    const colors = ['#1D9E75', '#378ADD', '#7C5CBF', '#EF9F27', '#E24B4A', '#0891B2'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />
      {showModal   && <CreateClientModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      {editClient  && <EditClientModal client={editClient} onClose={() => setEditClient(null)} onSave={handleEditSave} />}

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

          <div style={s.tableHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={s.tableTitle}>Lista de clientes</span>
              <span style={s.countBadge}>
                {filtered.length} {filtered.length === 1 ? 'cliente' : 'clientes'}
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
                {filtered.length === 0 ? (
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
                  filtered.map((c) => (
                    <tr key={c.id} style={s.tr}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-filter)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >

                      {/* Cliente */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ ...s.avatar, background: avatarBg(c.name) }}>
                            {initials(c.name)}
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
                          <div style={s.engineerAv}>{initials(c.engineer === '—' ? '?' : c.engineer)}</div>
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

// ── Page styles ───────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page:           { padding: '1.5rem', background: 'var(--bg-page)', minHeight: 'calc(100vh - 56px)', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' },
  topbar:         { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' },
  pageTitle:      { fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 },
  pageSub:        { fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 },
  addBtn:         { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 },
  card:           { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' },
  filterGrid:     { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px 12px', alignItems: 'end' },
  filterField:    { display: 'flex', flexDirection: 'column', gap: 4 },
  filterLabel:    { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' },
  inputWrap:      { position: 'relative' },
  inputIcon:      { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' },
  inputWithIcon:  { height: 34, padding: '0 10px 0 32px', border: '0.5px solid var(--border-input)', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' },
  input:          { height: 34, padding: '0 10px', border: '0.5px solid var(--border-input)', borderRadius: 7, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' },
  toggleGroup:    { display: 'flex', gap: 3, background: 'var(--bg-toggle)', border: '0.5px solid var(--border-input)', borderRadius: 7, padding: 3, height: 34, boxSizing: 'border-box', alignItems: 'center' },
  toggleBtn:      { flex: 1, height: '100%', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', color: 'var(--text-secondary)', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' },
  toggleBtnActive:{ background: 'var(--bg-active)', color: '#1D9E75', border: '0.5px solid var(--border-input)' },
  clearBtn:       { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', background: 'transparent', border: '0.5px solid var(--border)', borderRadius: 6, padding: '0 10px', height: 34, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' },
  tableHeader:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  tableTitle:     { fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' },
  countBadge:     { fontSize: 11, fontWeight: 500, background: 'var(--bg-filter)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: 20, border: '0.5px solid var(--border)' },
  table:          { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th:             { textAlign: 'left', padding: '6px 10px', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', borderBottom: '0.5px solid var(--border)', letterSpacing: '0.03em', whiteSpace: 'nowrap' },
  tr:             { borderBottom: '0.5px solid var(--border)', transition: 'background 0.1s' },
  td:             { padding: '11px 10px', verticalAlign: 'middle' },
  avatar:         { width: 34, height: 34, borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  engineerAv:     { width: 24, height: 24, borderRadius: '50%', background: '#E1F5EE', color: '#0F6E56', fontSize: 9, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statusDot:        { width: 6, height: 6, borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  actionBtn:        { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '0.5px solid var(--border)', borderRadius: 7, background: 'transparent', color: 'var(--text-primary)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' },
  actionBtnDanger:  { borderColor: '#FBCFCF', color: '#A32D2D', background: '#FDF3F3' },
  actionBtnSuccess: { borderColor: '#B5E4D4', color: '#0F6E56', background: '#E8F9F3' },
};

// ── Modal styles ──────────────────────────────────────────────────────────────

const ms: Record<string, React.CSSProperties> = {
  overlay:      { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:        { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 14, width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' },
  header:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '0.5px solid var(--border)' },
  headerLeft:   { display: 'flex', alignItems: 'center', gap: 12 },
  headerIcon:   { width: 36, height: 36, borderRadius: 10, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerTitle:  { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' },
  headerSub:    { fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 },
  closeBtn:     { width: 32, height: 32, borderRadius: 8, border: '0.5px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' },
  body:         { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  row:          { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field:        { display: 'flex', flexDirection: 'column', gap: 5 },
  label:        { fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', letterSpacing: '0.03em' },
  req:          { color: '#E24B4A' },
  inputWrap:    { position: 'relative' },
  inputIcon:    { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' },
  input:        { height: 38, padding: '0 12px', border: '0.5px solid var(--border-input)', borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', boxSizing: 'border-box' },
  inputWithIcon:{ paddingLeft: 34 },
  inputError:   { borderColor: '#E24B4A' },
  error:        { fontSize: 11, color: '#E24B4A', marginTop: 2 },
  footer:       { display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: '0.75rem', borderTop: '0.5px solid var(--border)', marginTop: '0.25rem' },
  cancelBtn:    { height: 36, padding: '0 16px', border: '0.5px solid var(--border)', borderRadius: 8, background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' },
  saveBtn:       { height: 36, padding: '0 18px', border: 'none', borderRadius: 8, background: '#1D9E75', color: '#fff', fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
  readonlyField: { height: 38, display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--text-primary)', padding: '0 12px', background: 'var(--bg-filter)', border: '0.5px solid var(--border)', borderRadius: 8, boxSizing: 'border-box' },
};

export default ClientsPage;
