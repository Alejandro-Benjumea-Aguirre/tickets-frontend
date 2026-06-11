import { useState } from "react";
import { ChangePasswordModalProps } from "../types/navbar.types";
import { PASSWORD_RULES } from "../data/navbarConstant";
import { changePassword } from "../../../features/auth/services/authService";
import Swal from "sweetalert2";
import { cp } from "../styles/changePass.styles";

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

export const ChangePasswordModal = ({ onClose, userId }: ChangePasswordModalProps) => {
  const [newPass,     setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [saving,      setSaving]      = useState(false);

  const rulesPassed   = PASSWORD_RULES.every((r) => r.test(newPass));
  const passwordsMatch = newPass === confirmPass && confirmPass !== '';
  const canSave       = rulesPassed && passwordsMatch;

  const handleSave = async () => {
    setSubmitted(true);
    if (!canSave) return;
    setSaving(true);
    try {
      const result = await changePassword(userId, newPass);
      if (result.data.error) {
        Swal.fire({ title: 'Error', text: String(result.data.body), icon: 'error', confirmButtonColor: '#1D9E75' });
        return;
      }
      Swal.fire({ title: 'Contraseña actualizada', icon: 'success', confirmButtonColor: '#1D9E75', timer: 2000, showConfirmButton: false });
      onClose();
    } catch {
      Swal.fire({ title: 'Error de conexión', text: 'No se pudo cambiar la contraseña. Intenta de nuevo.', icon: 'error', confirmButtonColor: '#1D9E75' });
    } finally {
      setSaving(false);
    }
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
          <button style={cp.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar contraseña'}
          </button>
        </div>

      </div>
    </div>
  );
};