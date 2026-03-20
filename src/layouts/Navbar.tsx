import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavbarProps } from '../types/components.types';

const NAV_LINKS = [
  { label: 'Tickets',   to: '/dashboard' },
  { label: 'Usuarios',  to: '/admin/users' },
  { label: 'Clientes',  to: '/clientes' },
  { label: 'Sucesos',   to: '/sucesos' },
  { label: 'Reportes',  to: '/reportes' },
];

export const Navbar = ({ user, logoutUser }: NavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  return (
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
          {NAV_LINKS.map((link) => {
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

        {/* Right — user dropdown */}
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
              stroke="#888"
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
                  <Link
                    to="/perfil"
                    style={s.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f7f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cambiar-contrasena"
                    style={s.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f7f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Cambiar contraseña
                  </Link>
                </li>
              </ul>

              <div style={s.dropdownDivider} />

              {/* Logout */}
              <ul style={s.dropdownList}>
                <li>
                  <button
                    style={{ ...s.dropdownItem, width: '100%', border: 'none', cursor: 'pointer', color: '#A32D2D', background: 'transparent', textAlign: 'left' }}
                    onClick={() => { setDropdownOpen(false); logoutUser(); }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#FCEBEB')}
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
    </nav>
  );
};

const s: Record<string, React.CSSProperties> = {
  nav: {
    background: '#ffffff',
    borderBottom: '0.5px solid #e0e0e0',
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
    color: '#1a1a1a',
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
    color: '#666',
    textDecoration: 'none',
    borderRadius: 6,
    transition: 'all 0.15s',
  },
  navLinkActive: {
    color: '#1D9E75',
    background: '#E1F5EE',
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
    border: '0.5px solid #e0e0e0',
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
    color: '#1a1a1a',
    maxWidth: 120,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: '#ffffff',
    border: '0.5px solid #e0e0e0',
    borderRadius: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
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
    color: '#1a1a1a',
  },
  dropdownEmail: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dropdownDivider: {
    height: '0.5px',
    background: '#e0e0e0',
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
    color: '#444',
    textDecoration: 'none',
    transition: 'background 0.1s',
    background: 'transparent',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
  },
};
