import { useState, useRef, useCallback, useContext } from 'react';
import SearchableSelect from '../../../components/ui/SearchableSelect';
import { AuthContext } from '../../auth/context/AuthContext';

// ── Mock data ─────────────────────────────────────────────────────────────────

const CLIENTES = [
  { value: 'c1', label: 'Ana Torres — ana.torres@empresa.com' },
  { value: 'c2', label: 'Juan Mesa — juan.mesa@empresa.com' },
  { value: 'c3', label: 'Sara López — sara.lopez@empresa.com' },
  { value: 'c4', label: 'Pedro Ríos — pedro.rios@empresa.com' },
  { value: 'c5', label: 'Mónica Gil — monica.gil@empresa.com' },
  { value: 'c6', label: 'Carlos Vera — carlos.vera@empresa.com' },
];

const USUARIOS = [
  { value: 'u1', label: 'Carlos Rodríguez (CR)' },
  { value: 'u2', label: 'Laura Martínez (LM)' },
  { value: 'u3', label: 'Diego Fernández (DF)' },
  { value: 'u4', label: 'Paola Sánchez (PS)' },
];

const SUCESOS: { label: string; options: { value: string; label: string }[] }[] = [
  {
    label: 'Tipo de suceso',
    options: [
      { value: 'incidente',  label: 'Incidente' },
      { value: 'solicitud',  label: 'Solicitud de servicio' },
      { value: 'queja',      label: 'Queja' },
      { value: 'consulta',   label: 'Consulta' },
      { value: 'cambio',     label: 'Solicitud de cambio' },
    ],
  },
  {
    label: 'Categoría',
    options: [
      { value: 'acceso',     label: 'Acceso y autenticación' },
      { value: 'factura',    label: 'Facturación y pagos' },
      { value: 'tecnico',    label: 'Soporte técnico' },
      { value: 'cuenta',     label: 'Gestión de cuenta' },
      { value: 'otro',       label: 'Otro' },
    ],
  },
  {
    label: 'Subcategoría',
    options: [
      { value: 'login',      label: 'Inicio de sesión' },
      { value: 'password',   label: 'Recuperación de contraseña' },
      { value: 'pago',       label: 'Fallo en pago' },
      { value: 'reembolso',  label: 'Reembolso' },
      { value: 'config',     label: 'Configuración' },
    ],
  },
  {
    label: 'Canal de entrada',
    options: [
      { value: 'email',      label: 'Correo electrónico' },
      { value: 'chat',       label: 'Chat en vivo' },
      { value: 'telefono',   label: 'Teléfono' },
      { value: 'portal',     label: 'Portal web' },
      { value: 'whatsapp',   label: 'WhatsApp' },
    ],
  },
  {
    label: 'Área afectada',
    options: [
      { value: 'sistemas',   label: 'Sistemas' },
      { value: 'comercial',  label: 'Comercial' },
      { value: 'operaciones',label: 'Operaciones' },
      { value: 'rrhh',       label: 'Recursos humanos' },
      { value: 'finanzas',   label: 'Finanzas' },
    ],
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface FileItem {
  id: string;
  file: File;
  preview?: string;
  error?: string;
}

interface CreateTicketModalProps {
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const CreateTicketModal = ({ onClose }: CreateTicketModalProps) => {
  const authContext   = useContext(AuthContext);
  const isPrivileged  = (authContext?.user?.rol_id ?? 0) <= 2; // admin(1) o agente(2)

  // Form state
  const [asunto,       setAsunto]      = useState('');
  const [descripcion,  setDescripcion] = useState('');
  const [prioridad,    setPrioridad]   = useState('');
  const [sucesos,      setSucesos]     = useState<string[]>(['', '', '', '', '']);
  const [cliente,      setCliente]     = useState('');
  const [responsable,  setResponsable] = useState('');
  const [files,        setFiles]       = useState<FileItem[]>([]);
  const [dragging,     setDragging]    = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const setSuceso = (index: number, value: string) =>
    setSucesos((prev) => prev.map((s, i) => (i === index ? value : s)));

  // ── Dropzone ────────────────────────────────────────────────────────────────

  const processFiles = useCallback((rawFiles: FileList | null) => {
    if (!rawFiles) return;
    Array.from(rawFiles).forEach((file) => {
      const isImage = file.type.startsWith('image/');
      const error   = !ACCEPTED.includes(file.type)
        ? 'Tipo de archivo no permitido'
        : file.size > MAX_SIZE_BYTES
        ? `Supera el límite de ${MAX_SIZE_MB} MB`
        : undefined;

      const item: FileItem = { id: `${Date.now()}-${Math.random()}`, file, error };
      if (!error && isImage) {
        const reader = new FileReader();
        reader.onload = (e) =>
          setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, preview: e.target?.result as string } : f));
        reader.readAsDataURL(file);
      }
      setFiles((prev) => [...prev, item]);
    });
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: conectar con el endpoint de creación de tickets
    console.log({ asunto, descripcion, prioridad, sucesos, cliente, responsable, files: files.map((f) => f.file.name) });
    onClose();
  };

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
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    required
                  />
                </div>

                {/* Descripción */}
                <div style={s.field}>
                  <label style={s.label}>Descripción <span style={s.req}>*</span></label>
                  <textarea
                    style={s.textarea}
                    placeholder="Detalla el problema, los pasos para reproducirlo y cualquier información relevante…"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                {/* Prioridad */}
                <div style={{ ...s.field, maxWidth: 220 }}>
                  <label style={s.label}>Prioridad <span style={s.req}>*</span></label>
                  <select style={s.select} value={prioridad} onChange={(e) => setPrioridad(e.target.value)} required>
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
                      value={sucesos[i]}
                      onChange={(e) => setSuceso(i, e.target.value)}
                    >
                      <option value="">Seleccionar…</option>
                      {suc.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
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
                      value={cliente}
                      onChange={setCliente}
                      placeholder="Buscar cliente…"
                    />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Usuario responsable</label>
                    <SearchableSelect
                      options={USUARIOS}
                      value={responsable}
                      onChange={setResponsable}
                      placeholder="Buscar agente…"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Adjuntos ── */}
            <div style={s.section}>
              <div style={s.sectionTitle}>Archivos adjuntos</div>
              <div style={s.sectionSub}>Imágenes y documentos · máximo {MAX_SIZE_MB} MB por archivo</div>

              {/* Dropzone */}
              <div
                style={{ ...s.dropzone, ...(dragging ? s.dropzoneDragging : {}) }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED.join(',')}
                  style={{ display: 'none' }}
                  onChange={(e) => processFiles(e.target.files)}
                />
                <div style={s.dropzoneIcon}>
                  <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke={dragging ? '#1D9E75' : '#aaa'} strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div style={s.dropzoneText}>
                  {dragging
                    ? 'Suelta los archivos aquí'
                    : <>Arrastra archivos o <span style={{ color: '#1D9E75', fontWeight: 500 }}>haz clic para seleccionar</span></>
                  }
                </div>
                <div style={s.dropzoneHint}>PNG, JPG, GIF, PDF, DOC · máx. {MAX_SIZE_MB} MB</div>
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div style={s.fileList}>
                  {files.map((item) => (
                    <div key={item.id} style={{ ...s.fileItem, ...(item.error ? s.fileItemError : {}) }}>
                      {item.preview ? (
                        <img src={item.preview} alt={item.file.name} style={s.fileThumb} />
                      ) : (
                        <div style={s.fileIcon}>
                          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={item.error ? '#A32D2D' : '#888'} strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                      <div style={s.fileMeta}>
                        <div style={s.fileName}>{item.file.name}</div>
                        {item.error
                          ? <div style={s.fileError}>{item.error}</div>
                          : <div style={s.fileSize}>{formatSize(item.file.size)}</div>
                        }
                      </div>
                      <button type="button" style={s.fileRemove} onClick={() => removeFile(item.id)}>
                        <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2}>
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div style={s.footer}>
            <button type="button" style={s.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" style={s.submitBtn}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Crear ticket
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  overlay:          { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: '1rem', backdropFilter: 'blur(2px)' },
  modal:            { background: '#fff', borderRadius: 14, width: '100%', maxWidth: 740, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(0,0,0,0.15)', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' },
  header:           { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.5rem', borderBottom: '0.5px solid #e8e8e8', flexShrink: 0 },
  headerLeft:       { display: 'flex', alignItems: 'center', gap: 10 },
  headerIcon:       { width: 34, height: 34, borderRadius: 9, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerTitle:      { fontSize: 15, fontWeight: 600, color: '#1a1a1a' },
  headerSub:        { fontSize: 12, color: '#888', marginTop: 1 },
  closeBtn:         { background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6 },
  body:             { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
  scrollArea:       { flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  section:          { display: 'flex', flexDirection: 'column', gap: 12 },
  sectionTitle:     { fontSize: 12, fontWeight: 600, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.06em' },
  sectionSub:       { fontSize: 11, color: '#aaa', marginTop: -8 },
  grid1:            { display: 'flex', flexDirection: 'column', gap: 12 },
  grid2:            { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '10px 16px' },
  field:            { display: 'flex', flexDirection: 'column', gap: 5 },
  label:            { fontSize: 11, fontWeight: 500, color: '#666', letterSpacing: '0.04em', textTransform: 'uppercase' },
  req:              { color: '#E24B4A' },
  input:            { height: 36, padding: '0 11px', border: '0.5px solid #d8dad8', borderRadius: 7, background: '#fafafa', color: '#1a1a1a', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', width: '100%' },
  textarea:         { padding: '9px 11px', border: '0.5px solid #d8dad8', borderRadius: 7, background: '#fafafa', color: '#1a1a1a', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', resize: 'vertical', width: '100%', boxSizing: 'border-box', lineHeight: 1.5 },
  select:           { height: 36, padding: '0 8px', border: '0.5px solid #d8dad8', borderRadius: 7, background: '#fafafa', color: '#1a1a1a', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', width: '100%', cursor: 'pointer', boxSizing: 'border-box' },
  dropzone:         { border: '1.5px dashed #d4d6d4', borderRadius: 10, padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.15s', background: '#fafafa' },
  dropzoneDragging: { borderColor: '#1D9E75', background: '#f0faf6' },
  dropzoneIcon:     { marginBottom: 4 },
  dropzoneText:     { fontSize: 13, color: '#555', textAlign: 'center' },
  dropzoneHint:     { fontSize: 11, color: '#aaa' },
  fileList:         { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 },
  fileItem:         { display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', background: '#f9faf9', border: '0.5px solid #e8e8e8', borderRadius: 8 },
  fileItemError:    { background: '#FFF5F5', borderColor: '#F5C0C0' },
  fileThumb:        { width: 36, height: 36, objectFit: 'cover', borderRadius: 5, flexShrink: 0 },
  fileIcon:         { width: 36, height: 36, borderRadius: 5, background: '#f0f2f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  fileMeta:         { flex: 1, overflow: 'hidden' },
  fileName:         { fontSize: 12, fontWeight: 500, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  fileSize:         { fontSize: 11, color: '#aaa', marginTop: 1 },
  fileError:        { fontSize: 11, color: '#A32D2D', marginTop: 1 },
  fileRemove:       { background: 'transparent', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex', alignItems: 'center', padding: 2, flexShrink: 0 },
  footer:           { display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '1rem 1.5rem', borderTop: '0.5px solid #e8e8e8', flexShrink: 0 },
  cancelBtn:        { height: 36, padding: '0 18px', borderRadius: 8, border: '0.5px solid #d8dad8', background: '#fff', color: '#555', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  submitBtn:        { height: 36, padding: '0 20px', borderRadius: 8, border: 'none', background: '#1D9E75', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 7 },
};

export default CreateTicketModal;
