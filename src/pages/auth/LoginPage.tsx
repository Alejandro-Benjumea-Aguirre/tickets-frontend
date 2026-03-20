import Swal from 'sweetalert2';
import { useState, useContext } from 'react';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authContext && authContext.loginUser) {
      try {
        await authContext.loginUser(username, password);
        navigate('/dashboard');
      } catch (error) {
        console.log('Error: ', error);
        Swal.fire({
          title: '¡Error!',
          text: 'Se presentó un error al momento de iniciar sesión.',
          icon: 'warning',
        });
      }
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 11H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          <div>
            <div style={styles.logoText}>Tickets</div>
            <div style={styles.logoSub}>sistema de soporte</div>
          </div>
        </div>

        {/* Badge */}
        <div style={styles.tag}>
          <span style={styles.dot} />
          Sistema activo
        </div>

        <h1 style={styles.heading}>Bienvenido</h1>
        <p style={styles.subheading}>Ingresa tus credenciales para continuar</p>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={styles.field}>
            <label style={styles.label}>Usuario</label>
            <input
              style={styles.input}
              type="text"
              placeholder="nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember + Forgot */}
          <div style={styles.row}>
            <label style={styles.checkLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ accentColor: '#1D9E75', width: 14, height: 14 }}
              />
              Recordarme
            </label>
            <a href="/forgot-password" style={styles.forgot}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" style={styles.btn}>
            Iniciar sesión
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>o</span>
          <span style={styles.dividerLine} />
        </div>

        {/* Register */}
        <p style={styles.register}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={styles.link}>
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7f6',
    padding: '2rem 1rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: '#ffffff',
    border: '0.5px solid #e0e0e0',
    borderRadius: 12,
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: 380,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: '2rem',
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: '#1D9E75',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#1a1a1a',
  },
  logoSub: {
    fontSize: 11,
    color: '#888',
    fontFamily: "'DM Mono', monospace",
    letterSpacing: '0.05em',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    background: '#E1F5EE',
    color: '#0F6E56',
    fontSize: 11,
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: 20,
    marginBottom: '1.5rem',
    fontFamily: "'DM Mono', monospace",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#1D9E75',
    display: 'inline-block',
  },
  heading: {
    fontSize: 22,
    fontWeight: 500,
    color: '#1a1a1a',
    marginBottom: '0.35rem',
  },
  subheading: {
    fontSize: 14,
    color: '#888',
    marginBottom: '2rem',
  },
  field: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: '#888',
    marginBottom: 6,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    height: 40,
    padding: '0 12px',
    border: '0.5px solid #d0d0d0',
    borderRadius: 8,
    background: '#f9f9f9',
    color: '#1a1a1a',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#888',
    cursor: 'pointer',
  },
  forgot: {
    fontSize: 13,
    color: '#1D9E75',
    textDecoration: 'none',
    fontWeight: 500,
  },
  btn: {
    width: '100%',
    height: 42,
    borderRadius: 8,
    background: '#1D9E75',
    color: 'white',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '1.5rem 0',
  },
  dividerLine: {
    flex: 1,
    height: '0.5px',
    background: '#e0e0e0',
    display: 'block',
  },
  dividerText: {
    fontSize: 12,
    color: '#aaa',
  },
  register: {
    textAlign: 'center',
    fontSize: 13,
    color: '#888',
  },
  link: {
    color: '#1D9E75',
    fontWeight: 500,
    textDecoration: 'none',
  },
};

export default LoginPage;
