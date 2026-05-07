import { useEffect, useRef, useState } from "react";
import { EditUserForm, EditUserModalProps } from "../types/users.types";
import { ms } from "../styles/UserModal.style";
import { CLIENTES_OPTIONS } from "../data/usersConstant";

export const EditUserModal = ({ user, onClose, onSave }: EditUserModalProps) => {
  const [form, setForm]     = useState<EditUserForm>({
    name:   user.name,
    email:  user.email,
    phone:  user.phone ?? '',
    client: user.client ?? '',
  });
  const [errors, setErrors] = useState<Partial<EditUserForm>>({});
  const overlayRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof EditUserForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Partial<EditUserForm> = {};
    if (!form.name.trim())  e.name  = 'El nombre es requerido';
    if (!form.email.trim()) e.email = 'El correo es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(user.id, form);
  };

  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const avatarBg = ({ 1: '#1D9E75', 2: '#378ADD', 3: '#7C5CBF' } as Record<number, string>)[user.rol_id] ?? '#888';
  const formattedDate = new Date(user.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

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
            <div style={{ ...ms.headerIcon, background: avatarBg, fontSize: 13, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {initials}
            </div>
            <div>
              <div style={ms.headerTitle}>Editar usuario</div>
              <div style={ms.headerSub}>{user.username} · {user.rol}</div>
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

          {/* Read-only row: Estado + Fecha creación */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Estado</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: user.status === 'active' ? '#1D9E75' : '#B4B2A9', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: user.status === 'active' ? '#0F6E56' : 'var(--text-tertiary)', fontWeight: 500 }}>
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Fecha de creación</label>
              <div style={{ ...ms.readonlyField }}>{formattedDate}</div>
            </div>
          </div>

          {/* Nombre + Correo */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Nombre completo <span style={ms.req}>*</span></label>
              <input
                style={{ ...ms.input, ...(errors.name ? ms.inputError : {}) }}
                type="text"
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
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
              {errors.email && <span style={ms.error}>{errors.email}</span>}
            </div>
          </div>

          {/* Teléfono + Cliente */}
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
              Guardar cambios
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};