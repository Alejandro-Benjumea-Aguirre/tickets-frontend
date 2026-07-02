import { useState } from 'react';
import { CodeModalProps } from '../types/auth.types';
import { ms } from '../styles/AuthModal.style';


const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  return local[0] + '***@' + domain;
};


export const CodeModal = ({ email, demoCode, onVerify, onClose }: CodeModalProps) => {
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
