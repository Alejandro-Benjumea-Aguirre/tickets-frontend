import { useEffect, useRef, useState } from 'react';
import { EMPTY_FORM } from '../data/clientsConstant';
import { CreateClientForm, CreateClientModalProps } from '../types/clients.types';
import { ms } from '../styles/ClientsModal.style';


export const CreateClientModal = ({ onClose, onSave }: CreateClientModalProps) => {
  const [form, setForm]   = useState<CreateClientForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<CreateClientForm>>({});
  const overlayRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof CreateClientForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Partial<CreateClientForm> = {};
    if (!form.name.trim())     e.name     = 'El nombre es requerido';
    if (!form.email.trim())    e.email    = 'El correo es requerido';
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 8h1m-1 4h1m4-4h1m-1 4h1M9 21v-3a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9-4 9 4v1H3V7z" />
              </svg>
            </div>
            <div>
              <div style={ms.headerTitle}>Crear cliente</div>
              <div style={ms.headerSub}>Registra un nuevo cliente en el sistema</div>
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

          {/* Nombre */}
          <div style={ms.field}>
            <label style={ms.label}>
              Nombre del cliente <span style={ms.req}>*</span>
            </label>
            <input
              style={{ ...ms.input, ...(errors.name ? ms.inputError : {}) }}
              type="text"
              placeholder="Ej. Empresa ABC"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && <span style={ms.error}>{errors.name}</span>}
          </div>

          {/* Correo + Teléfono */}
          <div style={ms.row}>
            <div style={ms.field}>
              <label style={ms.label}>
                Correo electrónico <span style={ms.req}>*</span>
              </label>
              <div style={ms.inputWrap}>
                <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  style={{ ...ms.input, ...ms.inputWithIcon, ...(errors.email ? ms.inputError : {}) }}
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>
              {errors.email && <span style={ms.error}>{errors.email}</span>}
            </div>
            <div style={ms.field}>
              <label style={ms.label}>Teléfono</label>
              <div style={ms.inputWrap}>
                <svg style={ms.inputIcon} viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l1.62-1.62a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15z" />
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
          </div>

          {/* Ingeniero */}
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

          {/* Footer */}
          <div style={ms.footer}>
            <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={ms.saveBtn}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Crear cliente
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};