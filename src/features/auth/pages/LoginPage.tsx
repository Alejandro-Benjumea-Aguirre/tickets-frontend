import Swal from 'sweetalert2';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUsername } from '../services/authService';

// ── Password rules ─────────────────────────────────────────────────────────────

const PASSWORD_RULES = [
  { id: 'len',   label: 'Mínimo 8 caracteres',          test: (v: string) => v.length >= 8 },
  { id: 'upper', label: 'Al menos 1 letra mayúscula',    test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'Al menos 1 letra minúscula',    test: (v: string) => /[a-z]/.test(v) },
  { id: 'num',   label: 'Al menos 1 número',             test: (v: string) => /[0-9]/.test(v) },
  { id: 'spec',  label: 'Al menos 1 carácter especial',  test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  return local[0] + '***@' + domain;
};

// ── Demo accounts ──────────────────────────────────────────────────────────────

const DEMO_ACCOUNTS = [
  { label: 'Administrador', username: 'admin',   password: 'Admin123!',   color: '#1D9E75' },
  { label: 'Agente',        username: 'agente',  password: 'agente123',  color: '#378ADD' },
  { label: 'Cliente',       username: 'cliente', password: 'cliente123', color: '#EF9F27' },
];

// ── Modal: verificación de código ─────────────────────────────────────────────

interface CodeModalProps {
  email: string;
  demoCode: string;
  onVerify: (code: string) => void;
  onClose: () => void;
}

const CodeModal = ({ email, demoCode, onVerify, onClose }: CodeModalProps) => {
  const [code, setCode]     = useState('');
  const [error, setError]   = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() !== demoCode) {
      setError('El código ingresado no es válido. Verifica e intenta de nuevo.');
      return;
    }
    onVerify(code);
  };

  return (
    <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>

        {/* Header */}
        <div style={ms.header}>
          <div style={ms.headerLeft}>
            <div style={ms.headerIcon}>
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="white" strokeWidth={2}>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div>
              <div style={ms.headerTitle}>Verificación de identidad</div>
              <div style={ms.headerSub}>Ingresa el código enviado a tu correo</div>
            </div>
          </div>
          <button style={ms.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={ms.body}>

          <div style={ms.infoBox}>
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="#378ADD" strokeWidth={2} style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              Se envió un código de 6 dígitos a <strong>{maskEmail(email)}</strong>
            </span>
          </div>

          <div style={ms.field}>
            <label style={ms.label}>Código de verificación</label>
            <input
              style={{ ...ms.input, textAlign: 'center', letterSpacing: '0.3em', fontSize: 18, fontFamily: "'DM Mono', monospace" }}
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
              maxLength={6}
              autoFocus
            />
            {error && <div style={ms.fieldError}>{error}</div>}
          </div>

          <div style={ms.footer}>
            <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={{ ...ms.saveBtn, opacity: code.length === 6 ? 1 : 0.5 }} disabled={code.length < 6}>
              Verificar código
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ── Modal: nueva contraseña ────────────────────────────────────────────────────

interface NewPasswordModalProps {
  onSave: () => void;
  onClose: () => void;
  newPass: string;
  setNewPass: (v: string) => void;
  confirmPass: string;
  setConfirmPass: (v: string) => void;
}

const NewPasswordModal = ({ onSave, onClose, newPass, setNewPass, confirmPass, setConfirmPass }: NewPasswordModalProps) => {
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]             = useState('');

  const rulesMet  = PASSWORD_RULES.every((r) => r.test(newPass));
  const passMatch = newPass === confirmPass && confirmPass !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rulesMet) { setError('La contraseña no cumple con todos los requisitos.'); return; }
    if (!passMatch) { setError('Las contraseñas no coinciden.'); return; }
    onSave();
  };

  const EyeIcon = ({ show }: { show: boolean }) => (
    show ? (
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
    )
  );

  return (
    <div style={ms.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={ms.modal}>

        {/* Header */}
        <div style={ms.header}>
          <div style={ms.headerLeft}>
            <div style={ms.headerIcon}>
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="white" strokeWidth={2}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <div style={ms.headerTitle}>Nueva contraseña</div>
              <div style={ms.headerSub}>Crea una contraseña segura para tu cuenta</div>
            </div>
          </div>
          <button style={ms.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={ms.body}>

          {/* Nueva contraseña */}
          <div style={ms.field}>
            <label style={ms.label}>Nueva contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...ms.input, paddingRight: 40 }}
                type={showNew ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPass}
                onChange={(e) => { setNewPass(e.target.value); setError(''); }}
                autoFocus
              />
              <button type="button" style={ms.eyeBtn} onClick={() => setShowNew(!showNew)}>
                <EyeIcon show={showNew} />
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div style={ms.field}>
            <label style={ms.label}>Confirmar contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...ms.input, paddingRight: 40, borderColor: confirmPass && !passMatch ? '#E24B4A' : confirmPass && passMatch ? '#1D9E75' : undefined }}
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPass}
                onChange={(e) => { setConfirmPass(e.target.value); setError(''); }}
              />
              <button type="button" style={ms.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                <EyeIcon show={showConfirm} />
              </button>
            </div>
          </div>

          {/* Reglas */}
          <div style={ms.rulesBox}>
            {PASSWORD_RULES.map((rule) => {
              const ok = rule.test(newPass);
              return (
                <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke={newPass === '' ? '#aaa' : ok ? '#1D9E75' : '#E24B4A'} strokeWidth={2.5}>
                    {ok || newPass === '' ? <polyline points="20 6 9 17 4 12" /> : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>}
                  </svg>
                  <span style={{ fontSize: 12, color: newPass === '' ? '#aaa' : ok ? '#1D9E75' : '#E24B4A' }}>{rule.label}</span>
                </div>
              );
            })}
          </div>

          {error && <div style={{ ...ms.fieldError, marginBottom: 12 }}>{error}</div>}

          <div style={ms.footer}>
            <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={{ ...ms.saveBtn, opacity: rulesMet && passMatch ? 1 : 0.5 }}>
              Guardar contraseña
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

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

// ── Styles ─────────────────────────────────────────────────────────────────────

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
  logo:      { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2rem' },
  logoIcon:  { width: 36, height: 36, borderRadius: 10, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText:  { fontSize: 16, fontWeight: 500, color: '#1a1a1a' },
  logoSub:   { fontSize: 11, color: '#888', fontFamily: "'DM Mono', monospace", letterSpacing: '0.05em' },
  tag:       { display: 'inline-flex', alignItems: 'center', gap: 5, background: '#E1F5EE', color: '#0F6E56', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, marginBottom: '1.5rem', fontFamily: "'DM Mono', monospace" },
  dot:       { width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', display: 'inline-block' },
  heading:   { fontSize: 22, fontWeight: 500, color: '#1a1a1a', marginBottom: '0.35rem' },
  subheading:{ fontSize: 14, color: '#888', marginBottom: '2rem' },
  field:     { marginBottom: '1.25rem' },
  label:     { display: 'block', fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' },
  input:     { width: '100%', height: 40, padding: '0 12px', border: '0.5px solid #d0d0d0', borderRadius: 8, background: '#f9f9f9', color: '#1a1a1a', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' },
  row:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  checkLabel:{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888', cursor: 'pointer' },
  forgot:    { fontSize: 13, color: '#1D9E75', textDecoration: 'none', fontWeight: 500 },
  btn:       { width: '100%', height: 42, borderRadius: 8, background: '#1D9E75', color: 'white', fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", border: 'none', cursor: 'pointer', letterSpacing: '0.02em' },
  demoBox:   { marginTop: '1.5rem', background: '#f9faf9', border: '0.5px solid #e0e0e0', borderRadius: 10, padding: '1rem' },
  demoTitle: { fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: '0.6rem' },
  demoList:  { display: 'flex', flexDirection: 'column' as const, gap: 6 },
  demoBtn:   { display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', background: '#ffffff', border: '0.5px solid #e0e0e0', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.15s', textAlign: 'left' as const },
  demoDot:   { width: 8, height: 8, borderRadius: '50%', flexShrink: 0, display: 'inline-block' },
  demoLabel: { fontSize: 13, fontWeight: 500, color: '#1a1a1a', flex: 1 },
  demoUser:  { fontSize: 11, color: '#aaa', fontFamily: "'DM Mono', monospace" },
};

// ── Modal styles ───────────────────────────────────────────────────────────────

const ms: Record<string, React.CSSProperties> = {
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:       { background: '#ffffff', border: '0.5px solid #e0e0e0', borderRadius: 14, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' },
  header:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '0.5px solid #e0e0e0' },
  headerLeft:  { display: 'flex', alignItems: 'center', gap: 12 },
  headerIcon:  { width: 38, height: 38, borderRadius: 10, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerTitle: { fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
  headerSub:   { fontSize: 12, color: '#888', marginTop: 2 },
  closeBtn:    { background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', padding: 4 },
  body:        { padding: '1.5rem' },
  infoBox:     { display: 'flex', alignItems: 'flex-start', gap: 8, background: '#E6F1FB', border: '0.5px solid #B8D4F0', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#185FA5', marginBottom: 12 },
  demoHint:    { display: 'flex', alignItems: 'center', gap: 7, background: '#FEF3CD', border: '0.5px solid #F0D980', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#8A6400', marginBottom: 16 },
  field:       { marginBottom: '1.25rem' },
  label:       { display: 'block', fontSize: 11, fontWeight: 500, color: '#888', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' },
  input:       { width: '100%', height: 42, padding: '0 12px', border: '0.5px solid #d0d0d0', borderRadius: 8, background: '#f9f9f9', color: '#1a1a1a', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' },
  fieldError:  { fontSize: 12, color: '#E24B4A', marginTop: 6 },
  eyeBtn:      { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', padding: 2 },
  rulesBox:    { background: '#f9faf9', border: '0.5px solid #e0e0e0', borderRadius: 8, padding: '10px 12px', marginBottom: 14 },
  footer:      { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  cancelBtn:   { padding: '9px 18px', borderRadius: 8, border: '0.5px solid #d0d0d0', background: 'transparent', color: '#555', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  saveBtn:     { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#1D9E75', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
};

export default LoginPage;
