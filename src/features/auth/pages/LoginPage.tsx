import Swal from 'sweetalert2';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUsername } from '../services/authService';
import { styles } from '../styles/AuthPage.style';
import { CodeModal } from '../components/CodeModal';
import { NewPasswordModal } from '../components/NewPasswordModal';
import { DEMO_ACCOUNTS } from '../data/authConstant';


// ── Login Page ─────────────────────────────────────────────────────────────────

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate    = useNavigate();

  // Forgot password flow
  const [forgotStep,    setForgotStep]    = useState<null | 'code' | 'password'>(null);
  const [forgotEmail,   setForgotEmail]   = useState('');
  const [sentCode,      setSentCode]      = useState('');
  const [newPass,       setNewPass]       = useState('');
  const [confirmPass,   setConfirmPass]   = useState('');

  const fillDemo = (u: string, p: string) => { setUsername(u); setPassword(p); };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authContext && authContext.loginUser) {
      try {
        await authContext.loginUser(username, password);
        navigate('/dashboard');
      } catch (error) {
        console.log('Error: ', error);
        const message = error instanceof Error ? error.message : 'Se presentó un error al momento de iniciar sesión.';
        Swal.fire({ title: '¡Error!', text: message, icon: 'warning' });
      }
    }
  };

  const handleForgot = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      Swal.fire({
        title: 'Usuario requerido',
        text: 'Ingresa tu nombre de usuario en el campo correspondiente antes de continuar.',
        icon: 'info',
        confirmButtonColor: '#1D9E75',
      });
      return;
    }

    const result = await getUsername(username.trim());

    if (result.data.error) {
      Swal.fire({
        title: 'Usuario no encontrado',
        text: 'El usuario ingresado no existe en el sistema.',
        icon: 'warning',
        confirmButtonColor: '#1D9E75',
      });
      return;
    }

    if (!result.data.body?.email) {
      Swal.fire({
        title: 'Sin correo válido',
        text: 'Este usuario no tiene un correo electrónico válido asociado para realizar la recuperación de contraseña. Contacta al administrador.',
        icon: 'warning',
        confirmButtonColor: '#1D9E75',
      });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setForgotEmail(result.data.body.email);
    setNewPass('');
    setConfirmPass('');
    setForgotStep('code');
  };

  const handleVerifyCode = () => {
    setForgotStep('password');
  };

  const handleSavePassword = () => {
    setForgotStep(null);
    Swal.fire({
      title: '¡Contraseña actualizada!',
      text: 'Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.',
      icon: 'success',
      confirmButtonColor: '#1D9E75',
    });
  };

  const closeForgot = () => setForgotStep(null);

  return (
    <>
      {forgotStep === 'code' && (
        <CodeModal
          email={forgotEmail}
          demoCode={sentCode}
          onVerify={handleVerifyCode}
          onClose={closeForgot}
        />
      )}

      {forgotStep === 'password' && (
        <NewPasswordModal
          onSave={handleSavePassword}
          onClose={closeForgot}
          newPass={newPass}
          setNewPass={setNewPass}
          confirmPass={confirmPass}
          setConfirmPass={setConfirmPass}
        />
      )}

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
              <a href="javascript:void(0)" style={styles.forgot} onClick={handleForgot}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit */}
            <button type="submit" style={styles.btn}>
              Iniciar sesión
            </button>
          </form>

          {/* Demo accounts */}
          <div style={styles.demoBox}>
            <div style={styles.demoTitle}>Cuentas de demo</div>
            <div style={styles.demoList}>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  style={styles.demoBtn}
                  onClick={() => fillDemo(acc.username, acc.password)}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = acc.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e0e0e0')}
                >
                  <span style={{ ...styles.demoDot, background: acc.color }} />
                  <span style={styles.demoLabel}>{acc.label}</span>
                  <span style={styles.demoUser}>{acc.username}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default LoginPage;
