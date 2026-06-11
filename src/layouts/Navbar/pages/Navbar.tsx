import { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavbarProps } from '../../../types/components.types';
import { useTheme } from '../../../features/theme/ThemeContext';
import { AuthContext } from '../../../features/auth/context/AuthContext';
import { NAV_LINKS } from '../data/navbarConstant';
import { ProfileModal } from '../components/ProfileModal';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { s } from '../styles/navbar.styles';
import { Chat } from '../../../components/Chat';

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
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

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
    {changePassOpen && user && (
      <ChangePasswordModal onClose={() => setChangePassOpen(false)} userId={user.id} />
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
          <div className="relative">
            {/* Botón del Chat */}
            <button 
              onClick={toggleChat}
              className={`relative p-2 rounded-full transition-all focus:outline-none
                ${isChatOpen 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              aria-label="Abrir mensajes"
            >
              {/* Ícono SVG de Mensaje */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.222 3.419.169A13.714 13.714 0 0 0 14.25 18v-2.25m4.5-4.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              
              {/* UX Indicator: Punto de notificación si hubiese mensajes nuevos pendientes */}
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900" />
            </button>

            {/* VENTANA FLOTANTE (ESTILO LINKEDIN) */}
            {isChatOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 md:w-[400px] bg-white rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                {/* Renderizamos el componente Chat que ya refactorizamos */}
                <Chat currentUser={user?.name ?? 'Usuario'} />
              </div>
            )}
          </div>
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
