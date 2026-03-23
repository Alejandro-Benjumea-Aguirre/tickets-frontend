import { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavbarProps } from '../types/components.types';
import { useTheme } from '../features/theme/ThemeContext';
import { AuthContext } from '../features/auth/context/AuthContext';
import { User } from '../types/users.types';

// ── Helpers ────────────────────────────────────────────────────────────────────

const ROL_LABEL: Record<number, string> = { 1: 'Administrador', 2: 'Agente', 3: 'Cliente' };
const STATE_LABEL: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Activo',   color: '#0F6E56', bg: '#E1F5EE' },
  2: { label: 'Inactivo', color: '#A32D2D', bg: '#FCEBEB' },
};

function formatDate(iso?: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// ── ProfileModal ───────────────────────────────────────────────────────────────

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updates: { email: string; phone: string }) => void;
}

const ProfileModal = ({ user, onClose, onSave }: ProfileModalProps) => {
  const [email, setEmail] = useState(user.email ?? '');
  const [phone, setPhone] = useState(user.phone ?? '');
  const [saving, setSaving] = useState(false);

  const state = user.state_id ? STATE_LABEL[user.state_id] : undefined;

  const handleSave = () => {
    setSaving(true);
    onSave({ email, phone });
    setSaving(false);
    onClose();
  };

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div style={pm.overlay} onClick={onClose}>
      <div style={pm.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={pm.header}>
          <div style={pm.avatarLg}>{initials}</div>
          <div>
            <div style={pm.modalTitle}>Mi perfil</div>
            <div style={pm.modalSub}>{ROL_LABEL[user.rol_id] ?? 'Usuario'}</div>
          </div>
          <button style={pm.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={pm.divider} />

        {/* Body */}
        <div style={pm.body}>

          {/* Read-only fields */}
          <div style={pm.row}>
            <div style={pm.field}>
              <span style={pm.label}>Nombre</span>
              <span style={pm.value}>{user.name}</span>
            </div>
            <div style={pm.field}>
              <span style={pm.label}>Estado</span>
              {state
                ? <span style={{ ...pm.badge, background: state.bg, color: state.color }}>{state.label}</span>
                : <span style={pm.value}>—</span>
              }
            </div>
          </div>

          <div style={pm.row}>
            <div style={pm.field}>
              <span style={pm.label}>Cliente</span>
              <span style={pm.value}>{user.client ?? '—'}</span>
            </div>
            <div style={pm.field}>
              <span style={pm.label}>Fecha de creación</span>
              <span style={pm.value}>{formatDate(user.created_at)}</span>
            </div>
          </div>

          <div style={pm.divider} />

          {/* Editable fields */}
          <div style={{ ...pm.row, marginTop: 4 }}>
            <div style={pm.fieldFull}>
              <label style={pm.inputLabel}>Correo electrónico</label>
              <input
                style={pm.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={pm.row}>
            <div style={pm.fieldFull}>
              <label style={pm.inputLabel}>Teléfono</label>
              <input
                style={pm.input}
                type="tel"
                value={phone}
                placeholder="Ej. +57 300 123 4567"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={pm.divider} />

        {/* Footer */}
        <div style={pm.footer}>
          <button style={pm.cancelBtn} onClick={onClose}>Cancelar</button>
          <button style={pm.saveBtn} onClick={handleSave} disabled={saving}>
            Guardar cambios
          </button>
        </div>

      </div>
    </div>
  );
};

const pm: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: 'var(--bg-card)', border: '0.5px solid var(--border)',
    borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
    width: '100%', maxWidth: 460, fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '20px 20px 16px',
  },
  avatarLg: {
    width: 48, height: 48, borderRadius: '50%', background: '#1D9E75',
    color: '#fff', fontSize: 16, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  modalTitle: { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' },
  modalSub:   { fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 },
  closeBtn: {
    marginLeft: 'auto', background: 'transparent', border: 'none',
    cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 6,
  },
  divider: { height: '0.5px', background: 'var(--border)' },
  body:    { padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 },
  row:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field:   { display: 'flex', flexDirection: 'column', gap: 4 },
  fieldFull: { display: 'flex', flexDirection: 'column', gap: 4, gridColumn: 'span 2' },
  label:   { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  value:   { fontSize: 13, color: 'var(--text-primary)', fontWeight: 400 },
  badge:   { display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, width: 'fit-content' },
  inputLabel: { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: {
    height: 36, padding: '0 10px', border: '0.5px solid var(--border-input)',
    borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-primary)',
    fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none',
    boxSizing: 'border-box', width: '100%',
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
    gap: 8, padding: '14px 20px',
  },
  cancelBtn: {
    padding: '7px 16px', border: '0.5px solid var(--border)', borderRadius: 8,
    background: 'transparent', color: 'var(--text-primary)', fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: 500,
  },
  saveBtn: {
    padding: '7px 16px', border: 'none', borderRadius: 8,
    background: '#1D9E75', color: '#fff', fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: 500,
  },
};

// ── ChangePasswordModal ────────────────────────────────────────────────────────

const PASSWORD_RULES = [
  { id: 'len',   label: 'Mínimo 8 caracteres',       test: (v: string) => v.length >= 8 },
  { id: 'upper', label: 'Al menos 1 letra mayúscula', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'Al menos 1 letra minúscula', test: (v: string) => /[a-z]/.test(v) },
  { id: 'num',   label: 'Al menos 1 número',          test: (v: string) => /[0-9]/.test(v) },
  { id: 'spec',  label: 'Al menos 1 carácter especial (!@#$…)', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

interface ChangePasswordModalProps {
  onClose: () => void;
}

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const ChangePasswordModal = ({ onClose }: ChangePasswordModalProps) => {
  const [newPass,     setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const rulesPassed   = PASSWORD_RULES.every((r) => r.test(newPass));
  const passwordsMatch = newPass === confirmPass && confirmPass !== '';
  const canSave       = rulesPassed && passwordsMatch;

  const handleSave = () => {
    setSubmitted(true);
    if (!canSave) return;
    // TODO: llamar al endpoint de cambio de contraseña
    onClose();
  };

  return (
    <div style={cp.overlay} onClick={onClose}>
      <div style={cp.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={cp.header}>
          <div style={cp.iconWrap}>
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#1D9E75" strokeWidth={2}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <div style={cp.title}>Cambiar contraseña</div>
            <div style={cp.sub}>La nueva contraseña debe cumplir los requisitos indicados</div>
          </div>
          <button style={cp.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={cp.divider} />

        {/* Body */}
        <div style={cp.body}>

          {/* Nueva contraseña */}
          <div style={cp.fieldGroup}>
            <label style={cp.label}>Nueva contraseña</label>
            <div style={cp.inputWrap}>
              <input
                style={{ ...cp.input, ...(submitted && !rulesPassed ? cp.inputError : {}) }}
                type={showNew ? 'text' : 'password'}
                value={newPass}
                placeholder="••••••••"
                onChange={(e) => setNewPass(e.target.value)}
              />
              <button
                style={cp.eyeBtn}
                type="button"
                onClick={() => setShowNew((p) => !p)}
                tabIndex={-1}
              >
                <EyeIcon open={showNew} />
              </button>
            </div>
          </div>

          {/* Requisitos */}
          <div style={cp.rules}>
            {PASSWORD_RULES.map((r) => {
              const ok = r.test(newPass);
              return (
                <div key={r.id} style={{ ...cp.ruleItem, color: ok ? '#1D9E75' : newPass.length === 0 ? 'var(--text-secondary)' : '#A32D2D' }}>
                  <span style={{ ...cp.ruleDot, background: ok ? '#1D9E75' : newPass.length === 0 ? 'var(--border)' : '#A32D2D' }} />
                  {r.label}
                </div>
              );
            })}
          </div>

          {/* Confirmar contraseña */}
          <div style={cp.fieldGroup}>
            <label style={cp.label}>Confirmar contraseña</label>
            <div style={cp.inputWrap}>
              <input
                style={{ ...cp.input, ...(submitted && !passwordsMatch ? cp.inputError : confirmPass && passwordsMatch ? cp.inputOk : {}) }}
                type={showConfirm ? 'text' : 'password'}
                value={confirmPass}
                placeholder="••••••••"
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <button
                style={cp.eyeBtn}
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                tabIndex={-1}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {submitted && !passwordsMatch && confirmPass !== '' && (
              <span style={cp.errorMsg}>Las contraseñas no coinciden</span>
            )}
            {submitted && confirmPass === '' && (
              <span style={cp.errorMsg}>Confirma tu nueva contraseña</span>
            )}
          </div>

        </div>

        <div style={cp.divider} />

        {/* Footer */}
        <div style={cp.footer}>
          <button style={cp.cancelBtn} onClick={onClose}>Cancelar</button>
          <button style={cp.saveBtn} onClick={handleSave}>
            Guardar contraseña
          </button>
        </div>

      </div>
    </div>
  );
};

const cp: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: 'var(--bg-card)', border: '0.5px solid var(--border)',
    borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
    width: '100%', maxWidth: 420, fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '20px 20px 16px',
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: 10, background: '#E1F5EE',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  title:    { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 },
  sub:      { fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 },
  closeBtn: {
    marginLeft: 'auto', background: 'transparent', border: 'none',
    cursor: 'pointer', color: 'var(--text-secondary)',
    display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6, flexShrink: 0,
  },
  divider:  { height: '0.5px', background: 'var(--border)' },
  body:     { padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label:    { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  input: {
    height: 38, padding: '0 40px 0 10px', border: '0.5px solid var(--border-input)',
    borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-primary)',
    fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none',
    boxSizing: 'border-box', width: '100%', transition: 'border-color 0.15s',
  },
  inputError: { borderColor: '#E24B4A' },
  inputOk:    { borderColor: '#1D9E75' },
  eyeBtn: {
    position: 'absolute', right: 10, background: 'transparent', border: 'none',
    cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex',
    alignItems: 'center', padding: 0,
  },
  rules: { display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 2 },
  ruleItem: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, transition: 'color 0.15s' },
  ruleDot:  { width: 6, height: 6, borderRadius: '50%', flexShrink: 0, transition: 'background 0.15s' },
  errorMsg: { fontSize: 11, color: '#E24B4A', marginTop: 2 },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
    gap: 8, padding: '14px 20px',
  },
  cancelBtn: {
    padding: '7px 16px', border: '0.5px solid var(--border)', borderRadius: 8,
    background: 'transparent', color: 'var(--text-primary)', fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: 500,
  },
  saveBtn: {
    padding: '7px 16px', border: 'none', borderRadius: 8,
    background: '#1D9E75', color: '#fff', fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: 500,
  },
};

// ── Nav links ──────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Tickets',       to: '/dashboard',      adminOnly: false },
  { label: 'Usuarios',      to: '/admin/users',    adminOnly: true  },
  { label: 'Clientes',      to: '/clientes',       adminOnly: true  },
  { label: 'Sucesos',       to: '/sucesos',        adminOnly: true  },
  { label: 'Reportes',      to: '/reportes',       adminOnly: false },
  { label: 'Estadísticas',  to: '/estadisticas',   adminOnly: true  },
];

export const Navbar = ({ user, logoutUser }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const authContext = useContext(AuthContext);
  const isAdmin = user?.rol_id === 1;
  const visibleLinks = NAV_LINKS.filter((link) => !link.adminOnly || isAdmin);
  const [dropdownOpen,   setDropdownOpen]   = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const hoverBg    = theme === 'dark' ? '#2d3139' : '#f5f7f6';
  const logoutHover = theme === 'dark' ? '#2d1515' : '#FCEBEB';

  return (
    <>
    {profileOpen && user && (
      <ProfileModal
        user={user}
        onClose={() => setProfileOpen(false)}
        onSave={(updates) => authContext?.updateUser(updates)}
      />
    )}
    {changePassOpen && (
      <ChangePasswordModal onClose={() => setChangePassOpen(false)} />
    )}
    <nav style={s.nav}>
      <div style={s.inner}>

        {/* Left — logo */}
        <Link to="/dashboard" style={s.brand}>
          <div style={s.logoIcon}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 11H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          <span style={s.brandText}>Tickets</span>
        </Link>

        {/* Center — nav links */}
        <ul style={s.navList}>
          {visibleLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  style={{ ...s.navLink, ...(active ? s.navLinkActive : {}) }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right — theme toggle + user dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            style={s.themeBtn}
            onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {theme === 'dark' ? (
              /* Sun icon */
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1"  x2="12" y2="3"  />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"   />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1"  y1="12" x2="3"  y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78"  x2="5.64" y2="18.36"  />
                <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
              </svg>
            ) : (
              /* Moon icon */
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* User dropdown */}
          <div style={s.userArea} ref={dropdownRef}>
            <button
              style={s.avatarBtn}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span style={s.avatar}>{initials}</span>
              <span style={s.userName}>{user?.name ?? 'Usuario'}</span>
              <svg
                viewBox="0 0 20 20"
                width={14}
                height={14}
                fill="none"
                stroke="var(--text-secondary)"
                strokeWidth={2}
                style={{ transition: 'transform 0.15s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
              </svg>
            </button>

            {dropdownOpen && (
              <div style={s.dropdown}>
                {/* User info */}
                <div style={s.dropdownHeader}>
                  <div style={s.dropdownName}>{user?.name}</div>
                  <div style={s.dropdownEmail}>{user?.email}</div>
                </div>

                <div style={s.dropdownDivider} />

                {/* Options */}
                <ul style={s.dropdownList}>
                  <li>
                    <button
                      style={{ ...s.dropdownItem, width: '100%', border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left' }}
                      onClick={() => { setDropdownOpen(false); setProfileOpen(true); }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Perfil
                    </button>
                  </li>
                  <li>
                    <button
                      style={{ ...s.dropdownItem, width: '100%', border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left' }}
                      onClick={() => { setDropdownOpen(false); setChangePassOpen(true); }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Cambiar contraseña
                    </button>
                  </li>
                </ul>

                <div style={s.dropdownDivider} />

                {/* Logout */}
                <ul style={s.dropdownList}>
                  <li>
                    <button
                      style={{ ...s.dropdownItem, width: '100%', border: 'none', cursor: 'pointer', color: '#A32D2D', background: 'transparent', textAlign: 'left' }}
                      onClick={() => { setDropdownOpen(false); logoutUser(); }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = logoutHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
    </>
  );
};

const s: Record<string, React.CSSProperties> = {
  nav: {
    background: 'var(--bg-card)',
    borderBottom: '0.5px solid var(--border)',
    fontFamily: "'DM Sans', sans-serif",
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 1.5rem',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: '#1D9E75',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  navList: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    display: 'block',
    padding: '5px 12px',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-link)',
    textDecoration: 'none',
    borderRadius: 6,
    transition: 'all 0.15s',
  },
  navLinkActive: {
    color: '#1D9E75',
    background: '#E1F5EE',
  },
  themeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 8,
    border: '0.5px solid var(--border)',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'background 0.15s',
    flexShrink: 0,
  },
  userArea: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'transparent',
    border: '0.5px solid var(--border)',
    borderRadius: 8,
    padding: '5px 10px',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: '#1D9E75',
    color: '#fff',
    fontSize: 10,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-primary)',
    maxWidth: 120,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: 'var(--bg-card)',
    border: '0.5px solid var(--border)',
    borderRadius: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    minWidth: 200,
    zIndex: 200,
    overflow: 'hidden',
  },
  dropdownHeader: {
    padding: '12px 14px',
  },
  dropdownName: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  dropdownEmail: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    marginTop: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdownDivider: {
    height: '0.5px',
    background: 'var(--border)',
  },
  dropdownList: {
    listStyle: 'none',
    margin: 0,
    padding: '4px 0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    fontSize: 13,
    color: 'var(--text-primary)',
    textDecoration: 'none',
    transition: 'background 0.1s',
    background: 'transparent',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
  },
};
