import { useEffect, useRef, useState } from 'react';
import { ms } from '../styles/SucesosModal.style';
import { CreateSucesoForm, CreateSucesoModalProps } from '../types/sucesos.types';
import { EMPTY_FORM, LEVEL_COLORS, LEVEL_LABELS, LEVEL_DOT } from '../data/sucesosConstant';


export const CreateSucesoModal = ({ sucesos, onClose, onSave }: CreateSucesoModalProps) => {
  const [form, setForm]     = useState<CreateSucesoForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<CreateSucesoForm>>({});
  const overlayRef          = useRef<HTMLDivElement>(null);

  const selectedLevel = Number(form.level);

  // Sucesos disponibles como padre: nivel inmediatamente anterior
  const parentOptions = sucesos.filter((s) => s.level === selectedLevel - 1);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const set = (key: keyof CreateSucesoForm, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Al cambiar nivel, limpiar selección de padre
      if (key === 'level') next.parentId = '';
      return next;
    });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Partial<CreateSucesoForm> = {};
    if (!form.name.trim()) e.name  = 'El nombre es requerido';
    if (!form.level)       e.level = 'Selecciona un nivel';
    if (selectedLevel > 1 && !form.parentId) e.parentId = 'Selecciona el suceso superior';
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
                <circle cx="12" cy="12" r="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
            <div>
              <div style={ms.headerTitle}>Crear suceso</div>
              <div style={ms.headerSub}>Define el nombre y jerarquía del suceso</div>
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
              Nombre del suceso <span style={ms.req}>*</span>
            </label>
            <input
              style={{ ...ms.input, ...(errors.name ? ms.inputError : {}) }}
              type="text"
              placeholder="Ej. Incidente de red"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              autoFocus
            />
            {errors.name && <span style={ms.error}>{errors.name}</span>}
          </div>

          {/* Nivel */}
          <div style={ms.field}>
            <label style={ms.label}>
              Nivel del suceso <span style={ms.req}>*</span>
            </label>
            <div style={ms.levelGrid}>
              {[1, 2, 3, 4, 5].map((lvl) => {
                const active = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    style={{
                      ...ms.levelBtn,
                      ...(active ? {
                        background: LEVEL_COLORS[lvl].bg,
                        color: LEVEL_COLORS[lvl].color,
                        border: `1.5px solid ${LEVEL_DOT[lvl]}`,
                        fontWeight: 600,
                      } : {}),
                    }}
                    onClick={() => set('level', String(lvl))}
                  >
                    <span style={{
                      ...ms.levelDot,
                      background: active ? LEVEL_DOT[lvl] : 'var(--text-tertiary)',
                    }} />
                    Nivel {lvl}
                  </button>
                );
              })}
            </div>
            {errors.level && <span style={ms.error}>{errors.level}</span>}
          </div>

          {/* Suceso superior — solo si nivel > 1 */}
          {selectedLevel > 1 && (
            <div style={ms.field}>
              <label style={ms.label}>
                Suceso superior
                <span style={{ ...ms.levelChip, background: LEVEL_COLORS[selectedLevel - 1].bg, color: LEVEL_COLORS[selectedLevel - 1].color }}>
                  Nivel {selectedLevel - 1}
                </span>
                <span style={ms.req}> *</span>
              </label>

              {parentOptions.length === 0 ? (
                <div style={ms.emptyParent}>
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  No hay sucesos de Nivel {selectedLevel - 1} registrados
                </div>
              ) : (
                <select
                  style={{ ...ms.select, ...(errors.parentId ? ms.inputError : {}) }}
                  value={form.parentId}
                  onChange={(e) => set('parentId', e.target.value)}
                >
                  <option value="">Seleccionar suceso superior…</option>
                  {parentOptions.map((p) => (
                    <option key={p.id} value={String(p.id)}>{p.name}</option>
                  ))}
                </select>
              )}
              {errors.parentId && <span style={ms.error}>{errors.parentId}</span>}
            </div>
          )}

          {/* Preview jerarquía */}
          {form.name && selectedLevel > 0 && (
            <div style={ms.preview}>
              <div style={ms.previewLabel}>Vista previa de jerarquía</div>
              <div style={ms.previewPath}>
                {selectedLevel > 1 && form.parentId && (
                  <>
                    <span style={ms.previewParent}>
                      {parentOptions.find((p) => String(p.id) === form.parentId)?.name ?? '…'}
                    </span>
                    <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="var(--text-tertiary)" strokeWidth={2}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </>
                )}
                <span style={{ ...ms.previewCurrent, color: LEVEL_COLORS[selectedLevel]?.color ?? 'var(--text-primary)' }}>
                  {form.name}
                </span>
                <span style={{ ...ms.levelBadgeSmall, background: LEVEL_COLORS[selectedLevel]?.bg, color: LEVEL_COLORS[selectedLevel]?.color }}>
                  {LEVEL_LABELS[selectedLevel]}
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={ms.footer}>
            <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={ms.saveBtn}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Crear suceso
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};