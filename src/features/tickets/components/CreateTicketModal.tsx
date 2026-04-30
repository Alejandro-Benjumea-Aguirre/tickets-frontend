import { useContext } from 'react';
import SearchableSelect from '../../../components/ui/SearchableSelect';
import { AuthContext } from '../../auth/context/AuthContext';
import { useCreateTicket } from '../hooks/useCreateTicket';
import { setTicket } from '../services/ticketService';
import { CreateTicketModalProps } from '../types/tickets.types';
import { CLIENTES, USUARIOS, SUCESOS, MAX_SIZE_MB } from '../data/ticketConstants';
import { s } from '../styles/CreateTicketsModal.style';
import Swal from 'sweetalert2';
import { TicketDropzone } from './TicketDropZone';
import FileList from './FileList';


const CreateTicketModal = ({ onClose }: CreateTicketModalProps) => {
  const authContext   = useContext(AuthContext);
  const isPrivileged  = (authContext?.user?.rol_id ?? 0) <= 2; // admin(1) o agente(2)

  const { 
    form, files, submitting, setSubmitting, 
    handleChange, handleSucesoChange, processFiles, setFiles 
  } = useCreateTicket();

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        asunto: form.asunto,
        descripcion: form.descripcion,
        prio: form.prioridad,
        estado: 'open',
        cliente: form.cliente,
        agente: form.responsable,
        categoria: form.sucesos[1] || '',
        canal: form.sucesos[3] || '',
        comments: form.comments || [],
        files: form.files || [],
      };

      const result = await setTicket(payload);
      if (result.data.error) throw new Error(result.data.body);
      
      Swal.fire({ title: 'Ticket creado', icon: 'success', timer: 2000, showConfirmButton: false });
      onClose();
    } catch (err) {
      Swal.fire({ title: 'Error', text: err instanceof Error ? err.message : String(err), icon: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={s.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.headerIcon}>
              <svg viewBox="0 0 24 24" width={15} height={15} fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 11H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
            <div>
              <div style={s.headerTitle}>Nuevo ticket</div>
              <div style={s.headerSub}>Completa la información para registrar el ticket</div>
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={s.body}>
          <div style={s.scrollArea}>

            {/* ── Información general ── */}
            <div style={s.section}>
              <div style={s.sectionTitle}>Información general</div>
              <div style={s.grid1}>

                {/* Asunto */}
                <div style={s.field}>
                  <label style={s.label}>Asunto <span style={s.req}>*</span></label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="Describe brevemente el problema…"
                    value={form.asunto}
                    onChange={e => handleChange('asunto', e.target.value)}
                    required
                  />
                </div>

                {/* Descripción */}
                <div style={s.field}>
                  <label style={s.label}>Descripción <span style={s.req}>*</span></label>
                  <textarea
                    style={s.textarea}
                    placeholder="Detalla el problema, los pasos para reproducirlo y cualquier información relevante…"
                    value={form.descripcion}
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                {/* Prioridad */}
                <div style={{ ...s.field, maxWidth: 220 }}>
                  <label style={s.label}>Prioridad <span style={s.req}>*</span></label>
                  <select 
                    style={s.select} 
                    value={form.prioridad} 
                    onChange={(e) => handleChange('prioridad', e.target.value)} required>
                    <option value="">Seleccionar…</option>
                    <option value="Alta">🔴 Alta</option>
                    <option value="Media">🟡 Media</option>
                    <option value="Baja">⚪ Baja</option>
                  </select>
                </div>

              </div>
            </div>

            {/* ── Sucesos ── */}
            <div style={s.section}>
              <div style={s.sectionTitle}>Clasificación de sucesos</div>
              <div style={s.grid2}>
                {SUCESOS.map((suc, i) => (
                  <div key={suc.label} style={s.field}>
                    <label style={s.label}>{suc.label}</label>
                    <select 
                      style={s.select} 
                      value={form.sucesos[i]} 
                      onChange={e => handleSucesoChange(i, e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      {suc.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Asignación (solo admin/agente) ── */}
            {isPrivileged && (
              <div style={s.section}>
                <div style={s.sectionTitle}>Asignación</div>
                <div style={s.grid2}>
                  <div style={s.field}>
                    <label style={s.label}>Cliente <span style={s.req}>*</span></label>
                    <SearchableSelect
                      options={CLIENTES}
                      value={form.cliente}
                      onChange={val => handleChange('cliente', val)}
                      placeholder="Buscar cliente…"
                    />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Usuario responsable</label>
                    <SearchableSelect
                      options={USUARIOS}
                      value={form.responsable}
                      onChange={val => handleChange('responsable', val)}
                      placeholder="Buscar agente…"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Adjuntos ── */}
            <div style={s.section}>
              <div style={s.sectionTitle}>Archivos adjuntos</div>
              <div style={s.sectionSub}>Imágenes y documentos</div>

              <TicketDropzone
                processFiles={processFiles} 
                MAX_SIZE_MB={MAX_SIZE_MB} 
              />

              {/* Listado de archivos (Este también podría ser un componente: FileList.tsx) */}
              {files.length > 0 && <FileList files={files} 
                                             onRemove={removeFile} 
                                             formatSize={formatSize}
                                             s={s} />}
            </div>
          </div>
          {/* Footer */}
          <div style={s.footer}>
            <button type="button" style={s.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={s.submitBtn} disabled={submitting}>
              {!submitting && (
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
              {submitting ? 'Creando…' : 'Crear ticket'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateTicketModal;
