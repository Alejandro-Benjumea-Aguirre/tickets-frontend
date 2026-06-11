import { useState } from "react";
import { ProfileModalProps } from "../types/navbar.types";
import { ROL_LABEL, STATE_LABEL } from "../data/navbarConstant";
import { pm } from "../styles/profileModal.styles";

function formatDate(iso?: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export const ProfileModal = ({ user, onClose, onSave }: ProfileModalProps) => {
  const [email, setEmail] = useState(user.email ?? '');
  const [phone, setPhone] = useState(user.phone ?? '');
  const [saving, setSaving] = useState(false);

  const state = user.status_id ? STATE_LABEL[user.status_id] : undefined;

  const handleSave = () => {
    setSaving(true);
    onSave({ email, phone });
    setSaving(false);
    onClose();
  };

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div style={pm.overlay} onClick={onClose}>
      <div style={pm.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={pm.header}>
          <div style={pm.avatarLg}>{initials}</div>
          <div>
            <div style={pm.modalTitle}>Mi perfil</div>
            <div style={pm.modalSub}>{ROL_LABEL[user.rol_id] ?? 'Usuario'}</div>
          </div>
          <button style={pm.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={pm.divider} />

        {/* Body */}
        <div style={pm.body}>

          {/* Read-only fields */}
          <div style={pm.row}>
            <div style={pm.field}>
              <span style={pm.label}>Nombre</span>
              <span style={pm.value}>{user.name}</span>
            </div>
            <div style={pm.field}>
              <span style={pm.label}>Estado</span>
              {state
                ? <span style={{ ...pm.badge, background: state.bg, color: state.color }}>{state.label}</span>
                : <span style={pm.value}>—</span>
              }
            </div>
          </div>

          <div style={pm.row}>
            <div style={pm.field}>
              <span style={pm.label}>Cliente</span>
              <span style={pm.value}>{user.client ?? '—'}</span>
            </div>
            <div style={pm.field}>
              <span style={pm.label}>Fecha de creación</span>
              <span style={pm.value}>{formatDate(user.created_at)}</span>
            </div>
          </div>

          <div style={pm.divider} />

          {/* Editable fields */}
          <div style={{ ...pm.row, marginTop: 4 }}>
            <div style={pm.fieldFull}>
              <label style={pm.inputLabel}>Correo electrónico</label>
              <input
                style={pm.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={pm.row}>
            <div style={pm.fieldFull}>
              <label style={pm.inputLabel}>Teléfono</label>
              <input
                style={pm.input}
                type="tel"
                value={phone}
                placeholder="Ej. +57 300 123 4567"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={pm.divider} />

        {/* Footer */}
        <div style={pm.footer}>
          <button style={pm.cancelBtn} onClick={onClose}>Cancelar</button>
          <button style={pm.saveBtn} onClick={handleSave} disabled={saving}>
            Guardar cambios
          </button>
        </div>

      </div>
    </div>
  );
};