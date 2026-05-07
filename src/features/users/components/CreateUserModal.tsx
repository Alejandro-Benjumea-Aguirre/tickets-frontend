import { useEffect, useRef, useState } from "react";
import { CLIENTES_OPTIONS, EMPTY_FORM, ROLES_OPTIONS } from "../data/usersConstant";
import { CreateUserForm, CreateUserModalProps } from "../types/users.types";
import { ms } from "../styles/UserModal.style";

export const CreateUserModal = ({ onClose, onSave }: CreateUserModalProps) => {
  const [form, setForm]           = useState<CreateUserForm>(EMPTY_FORM);
  const [showPass, setShowPass]   = useState(false);
  const [errors, setErrors]       = useState<Partial<CreateUserForm>>({});
  const overlayRef                = useRef<HTMLDivElement>(null);

  // Close on overlay click
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof CreateUserForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Partial<CreateUserForm> = {};
    if (!form.name.trim())     e.name     = 'El nombre es requerido';
    if (!form.email.trim())    e.email    = 'El correo es requerido';
    if (!form.rol_id)          e.rol_id   = 'Selecciona un rol';
    if (!form.password.trim()) e.password = 'La contraseña es requerida';
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <div style={ms.headerTitle}>Crear usuario</div>
              <div style={ms.headerSub}>Completa los datos del nuevo usuario</div>
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

          {/* Row 1: Nombre + Correo */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Nombre completo <span style={ms.req}>*</span></label>
              <input
                style={{ ...ms.input, ...(errors.name ? ms.inputError : {}) }}
                type="text"
                placeholder="Ej. Juan Pérez"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
              {errors.name && <span style={ms.error}>{errors.name}</span>}
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Correo electrónico <span style={ms.req}>*</span></label>
              <input
                style={{ ...ms.input, ...(errors.email ? ms.inputError : {}) }}
                type="email"
                placeholder="correo@empresa.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
              {errors.email && <span style={ms.error}>{errors.email}</span>}
            </div>
          </div>

          {/* Row 2: Teléfono + Contraseña */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Teléfono</label>
              <input
                style={ms.input}
                type="tel"
                placeholder="300 000 0000"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Contraseña <span style={ms.req}>*</span></label>
              <div style={ms.passWrap}>
                <input
                  style={{ ...ms.input, ...ms.passInput, ...(errors.password ? ms.inputError : {}) }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                />
                <button
                  type="button"
                  style={ms.eyeBtn}
                  onClick={() => setShowPass((p) => !p)}
                  tabIndex={-1}
                >
                  {showPass ? (
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
                  )}
                </button>
              </div>
              {errors.password && <span style={ms.error}>{errors.password}</span>}
            </div>
          </div>

          {/* Row 3: Rol + Cliente */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Rol <span style={ms.req}>*</span></label>
              <select
                style={{ ...ms.select, ...(errors.rol_id ? ms.inputError : {}) }}
                value={form.rol_id}
                onChange={(e) => set('rol_id', e.target.value)}
              >
                <option value="">Seleccionar rol…</option>
                {ROLES_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {errors.rol_id && <span style={ms.error}>{errors.rol_id}</span>}
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Cliente</label>
              <select
                style={ms.select}
                value={form.client}
                onChange={(e) => set('client', e.target.value)}
              >
                <option value="">Sin cliente asignado</option>
                {CLIENTES_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div style={ms.footer}>
            <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={ms.saveBtn}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Crear usuario
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};