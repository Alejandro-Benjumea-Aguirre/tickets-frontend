import { useEffect, useRef, useState } from 'react';
import { EditClientForm, EditClientModalProps } from '../types/clients.types';
import { ms } from '../styles/ClientsModal.style';

export const EditClientModal = ({ client, onClose, onSave }: EditClientModalProps) => {
  const [form, setForm]     = useState<EditClientForm>({
    email:    client.email,
    phone:    client.phone === '—' ? '' : client.phone,
    engineer: client.engineer === '—' ? '' : client.engineer,
  });
  const [errors, setErrors] = useState<Partial<EditClientForm>>({});
  const overlayRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof EditClientForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Partial<EditClientForm> = {};
    if (!form.email.trim()) e.email = 'El correo es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(client.id, form);
  };

  const avatarBgFn = (name: string) => {
    const colors = ['#1D9E75', '#378ADD', '#7C5CBF', '#EF9F27', '#E24B4A', '#0891B2'];
    return colors[name.charCodeAt(0) % colors.length];
  };
  const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const formattedDate = new Date(client.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

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
            <div style={{ ...ms.headerIcon, background: avatarBgFn(client.name), fontSize: 13, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
              {initials(client.name)}
            </div>
            <div>
              <div style={ms.headerTitle}>Editar cliente</div>
              <div style={ms.headerSub}>{client.name}</div>
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

          {/* Row 1: Nombre (readonly) + Estado (readonly) */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Nombre del cliente</label>
              <div style={ms.readonlyField}>
                {client.name}
              </div>
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Estado</label>
              <div style={{ ...ms.readonlyField, gap: 8 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: client.status === 'active' ? '#1D9E75' : '#B4B2A9', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ color: client.status === 'active' ? '#0F6E56' : 'var(--text-tertiary)', fontWeight: 500 }}>
                  {client.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Fecha creación (readonly) + Correo (editable) */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Fecha de creación</label>
              <div style={ms.readonlyField}>{formattedDate}</div>
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Correo electrónico <span style={ms.req}>*</span></label>
              <div style={ms.inputWrap}>
                <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  style={{ ...ms.input, ...ms.inputWithIcon, ...(errors.email ? ms.inputError : {}) }}
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>
              {errors.email && <span style={ms.error}>{errors.email}</span>}
            </div>
          </div>

          {/* Row 3: Teléfono + Ingeniero */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>Teléfono</label>
              <div style={ms.inputWrap}>
                <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l1.62-1.62a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15z" />
                </svg>
                <input
                  style={{ ...ms.input, ...ms.inputWithIcon }}
                  type="tel"
                  placeholder="601 000 0000"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
              </div>
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Ingeniero asignado</label>
              <div style={ms.inputWrap}>
                <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  style={{ ...ms.input, ...ms.inputWithIcon }}
                  type="text"
                  placeholder="Nombre del ingeniero"
                  value={form.engineer}
                  onChange={(e) => set('engineer', e.target.value)}
                />
              </div>
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