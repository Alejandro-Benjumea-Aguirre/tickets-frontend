import { useState } from "react";
import { PASSWORD_RULES } from "../data/authConstant";
import { NewPasswordModalProps } from "../types/auth.types";
import { ms } from "../styles/AuthModal.style";


export const NewPasswordModal = ({ onSave, onClose, newPass, setNewPass, confirmPass, setConfirmPass }: NewPasswordModalProps) => {
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