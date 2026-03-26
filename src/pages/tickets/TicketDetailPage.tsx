import { useState, useContext, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../features/auth/context/AuthContext';
import { Navbar } from '../../layouts/Navbar';
import { TICKETS_DETAIL, TicketComment, TicketFile } from '../../features/tickets/types/tickets.types';

// ── Helpers ────────────────────────────────────────────────────────────────────

const ROL_LABEL: Record<number, string> = { 1: 'Administrador', 2: 'Agente', 3: 'Cliente' };

const ROL_STYLE: Record<string, { bg: string; color: string }> = {
  Administrador: { bg: '#E1F5EE', color: '#0F6E56' },
  Agente:        { bg: '#E6F1FB', color: '#185FA5' },
  Cliente:       { bg: '#F1EFE8', color: '#5F5E5A' },
};

const estadoMap: Record<string, { label: string; bg: string; color: string }> = {
  open:   { label: 'Abierto',     bg: '#E1F5EE', color: '#0F6E56' },
  prog:   { label: 'En progreso', bg: '#E6F1FB', color: '#185FA5' },
  closed: { label: 'Cerrado',     bg: '#F1EFE8', color: '#5F5E5A' },
  urgent: { label: 'Urgente',     bg: '#FCEBEB', color: '#A32D2D' },
};

const prioColor: Record<string, string> = {
  Alta:  '#E24B4A',
  Media: '#EF9F27',
  Baja:  '#888780',
};

function fileSizeLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileTypeIcon(tipo: string, size = 18) {
  if (tipo === 'image') return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#378ADD" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
  if (tipo === 'pdf') return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#E24B4A" strokeWidth={1.8}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
  if (tipo === 'doc') return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#378ADD" strokeWidth={1.8}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#888" strokeWidth={1.8}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function guessFileType(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'other';
}

function nowDatetime(): string {
  const d = new Date();
  const dd = d.getDate().toString().padStart(2, '0');
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${dd}/${mm}/${yyyy} — ${hh}:${min}`;
}

function nowDateOnly(): string {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

// ── Small file row (used in comments) ─────────────────────────────────────────

const CommentFileRow = ({ f, onRemove }: { f: TicketFile; onRemove?: () => void }) => (
  <div style={s.cFileRow}>
    <span style={{ display: 'flex', alignItems: 'center' }}>{fileTypeIcon(f.tipo, 15)}</span>
    <span style={s.cFileName}>{f.nombre}</span>
    <span style={s.cFileMeta}>{f.tamaño}</span>
    {onRemove && (
      <button style={s.removeBtn} onClick={onRemove} title="Quitar archivo">
        <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2.5}>
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    )}
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const ticketId   = `#${id}`;
  const baseTicket = TICKETS_DETAIL[ticketId];

  const [comments,      setComments]      = useState<TicketComment[]>(baseTicket?.comments ?? []);
  const [files,         setFiles]         = useState<TicketFile[]>(baseTicket?.files ?? []);
  const [newComment,    setNewComment]    = useState('');
  const [commentFiles,  setCommentFiles]  = useState<TicketFile[]>([]);
  const [dragOver,      setDragOver]      = useState(false);
  const [commentDragOver, setCommentDragOver] = useState(false);

  const ticketFileInputRef  = useRef<HTMLInputElement>(null);
  const commentFileInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef      = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest comment
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  if (!authContext) return null;
  const { user, logoutUser } = authContext;

  if (!baseTicket) {
    return (
      <>
        <Navbar user={user} logoutUser={logoutUser} />
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: "'DM Sans', sans-serif", color: 'var(--text-secondary)' }}>
          Ticket <strong>{ticketId}</strong> no encontrado.
          <br />
          <button style={{ ...s.backBtn, marginTop: '1rem' }} onClick={() => navigate('/dashboard')}>
            ← Volver al dashboard
          </button>
        </div>
      </>
    );
  }

  const ticket = { ...baseTicket, comments, files };
  const estado = estadoMap[ticket.estado] ?? estadoMap['open'];
  const userRol = ROL_LABEL[user?.rol_id ?? 3] ?? 'Usuario';

  // ── Actions ──────────────────────────────────────────────────────────────────

  const submitComment = () => {
    const text = newComment.trim();
    if (!text) return;
    const initials = user?.name
      ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
      : '?';
    setComments((prev) => [
      ...prev,
      {
        id:            `c${Date.now()}`,
        autor:         user?.name ?? 'Usuario',
        autorInitials: initials,
        autorColor:    '#1D9E75',
        rol:           userRol,
        texto:         text,
        fecha:         nowDatetime(),
        files:         commentFiles.length > 0 ? [...commentFiles] : undefined,
      },
    ]);
    setNewComment('');
    setCommentFiles([]);
  };

  // Ticket-level file handlers
  const addTicketFiles = useCallback((rawFiles: FileList | File[]) => {
    const entries: TicketFile[] = Array.from(rawFiles).map((f) => ({
      id:     `f${Date.now()}-${f.name}`,
      nombre: f.name,
      tipo:   guessFileType(f.name),
      tamaño: fileSizeLabel(f.size),
      fecha:  nowDateOnly(),
    }));
    setFiles((prev) => [...prev, ...entries]);
  }, []);

  const removeTicketFile = (fileId: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== fileId));

  // Comment-level file handlers
  const addCommentFiles = useCallback((rawFiles: FileList | File[]) => {
    const entries: TicketFile[] = Array.from(rawFiles).map((f) => ({
      id:     `cf${Date.now()}-${f.name}`,
      nombre: f.name,
      tipo:   guessFileType(f.name),
      tamaño: fileSizeLabel(f.size),
      fecha:  nowDateOnly(),
    }));
    setCommentFiles((prev) => [...prev, ...entries]);
  }, []);

  const removeCommentFile = (fileId: string) =>
    setCommentFiles((prev) => prev.filter((f) => f.id !== fileId));

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />

      <div style={s.page}>

        {/* ── Topbar ── */}
        <div style={s.topbar}>
          <button style={s.backBtn} onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver
          </button>
          <div style={s.topbarMid}>
            <span style={s.ticketId}>{ticket.id}</span>
            <span style={s.topbarAsunto}>{ticket.asunto}</span>
          </div>
          <div style={s.topbarRight}>
            <span style={{ ...s.badge, background: estado.bg, color: estado.color }}>{estado.label}</span>
            <span style={s.prioBadge}>
              <span style={{ ...s.prioDot, background: prioColor[ticket.prio] }} />
              {ticket.prio}
            </span>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div style={s.grid}>

          {/* ── LEFT COLUMN ── */}
          <div style={s.leftCol}>

            {/* Info card */}
            <div style={s.card}>
              <div style={s.cardTitle}>Información del ticket</div>

              <div style={s.descBlock}>
                <div style={s.fieldLabel}>Descripción</div>
                <p style={s.descText}>{ticket.descripcion}</p>
              </div>

              <div style={s.infoGrid}>
                <div style={s.infoItem}>
                  <span style={s.fieldLabel}>Estado</span>
                  <span style={{ ...s.badge, background: estado.bg, color: estado.color }}>{estado.label}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.fieldLabel}>Prioridad</span>
                  <span style={s.prioBadge}>
                    <span style={{ ...s.prioDot, background: prioColor[ticket.prio] }} />{ticket.prio}
                  </span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.fieldLabel}>En espera</span>
                  <span style={{ ...s.badge, ...(ticket.enEspera ? { background: '#FEF3CD', color: '#8A6400' } : { background: '#F1EFE8', color: '#5F5E5A' }) }}>
                    {ticket.enEspera ? 'Sí' : 'No'}
                  </span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.fieldLabel}>Canal</span>
                  <span style={s.infoValue}>{ticket.canal}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.fieldLabel}>Categoría</span>
                  <span style={s.infoValue}>{ticket.categoria}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.fieldLabel}>Cliente</span>
                  <span style={s.infoValue}>{ticket.cliente}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.fieldLabel}>Agente asignado</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {ticket.agente !== '—' && (
                      <span style={{ ...s.agentAv, background: ticket.agColor + '22', color: ticket.agColor }}>
                        {ticket.agente.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </span>
                    )}
                    <span style={s.infoValue}>{ticket.agente}</span>
                  </span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.fieldLabel}>Fecha creación</span>
                  <span style={s.infoValue}>{ticket.fechaCreacion}</span>
                </div>
                <div style={s.infoItem}>
                  <span style={s.fieldLabel}>Última actualización</span>
                  <span style={s.infoValue}>{ticket.fechaActualizacion}</span>
                </div>
              </div>
            </div>

            {/* Attachments card */}
            <div style={s.card}>
              <div style={s.cardTitle}>Archivos adjuntos del ticket</div>

              {/* Dropzone */}
              <div
                style={{ ...s.dropzone, ...(dragOver ? s.dropzoneActive : {}) }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addTicketFiles(e.dataTransfer.files); }}
                onClick={() => ticketFileInputRef.current?.click()}
              >
                <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke={dragOver ? '#1D9E75' : 'var(--text-secondary)'} strokeWidth={1.5}>
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                <span style={{ ...s.dropzoneText, color: dragOver ? '#1D9E75' : 'var(--text-secondary)' }}>
                  {dragOver ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí o haz clic para seleccionar'}
                </span>
                <span style={s.dropzoneHint}>PNG, JPG, PDF, DOC — cualquier formato</span>
                <input
                  ref={ticketFileInputRef}
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => { if (e.target.files) addTicketFiles(e.target.files); e.target.value = ''; }}
                />
              </div>

              {files.length > 0 ? (
                <div style={s.filesList}>
                  {files.map((f) => (
                    <div key={f.id} style={s.fileRow}>
                      <span style={s.fileIcon}>{fileTypeIcon(f.tipo)}</span>
                      <div style={s.fileInfo}>
                        <span style={s.fileName}>{f.nombre}</span>
                        <span style={s.fileMeta}>{f.tamaño} · {f.fecha}</span>
                      </div>
                      <button style={s.removeBtn} onClick={() => removeTicketFile(f.id)} title="Eliminar archivo">
                        <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={s.emptyHint}>Sin archivos adjuntos aún.</p>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={s.rightCol}>
            <div style={s.card}>
              <div style={s.cardTitle}>Actividad y comentarios</div>

              {/* ── Scrollable comments list ── */}
              <div style={s.commentsScroll}>
                {comments.length === 0 && (
                  <p style={{ ...s.emptyHint, textAlign: 'center', paddingTop: '1rem' }}>
                    Sin comentarios aún. Sé el primero en comentar.
                  </p>
                )}

                {comments.map((c) => {
                  const rolStyle = ROL_STYLE[c.rol] ?? { bg: '#F1EFE8', color: '#5F5E5A' };
                  return (
                    <div key={c.id} style={s.commentItem}>

                      {/* Avatar */}
                      <span style={{ ...s.commentAvatar, background: c.autorColor + '22', color: c.autorColor }}>
                        {c.autorInitials}
                      </span>

                      {/* Body */}
                      <div style={s.commentBody}>

                        {/* Header: name · role · date */}
                        <div style={s.commentHeader}>
                          <span style={s.commentAutor}>{c.autor}</span>
                          <span style={{ ...s.rolBadge, background: rolStyle.bg, color: rolStyle.color }}>
                            {c.rol}
                          </span>
                          <span style={s.commentFecha}>{c.fecha}</span>
                        </div>

                        {/* Text */}
                        <p style={s.commentText}>{c.texto}</p>

                        {/* Files attached to this comment */}
                        {c.files && c.files.length > 0 && (
                          <div style={s.commentFilesWrap}>
                            {c.files.map((f) => (
                              <CommentFileRow key={f.id} f={f} />
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}

                {/* Scroll anchor */}
                <div ref={commentsEndRef} />
              </div>

              {/* ── Divider ── */}
              <div style={{ height: '0.5px', background: 'var(--border)', margin: '0 -1.25rem' }} />

              {/* ── Add comment ── */}
              <div style={s.addComment}>
                <div style={s.addCommentLabel}>Agregar comentario</div>

                <textarea
                  style={s.commentTextarea}
                  placeholder="Escribe un comentario…"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submitComment(); }}
                  rows={3}
                />

                {/* Pending files for this comment */}
                {commentFiles.length > 0 && (
                  <div style={s.pendingFiles}>
                    {commentFiles.map((f) => (
                      <CommentFileRow key={f.id} f={f} onRemove={() => removeCommentFile(f.id)} />
                    ))}
                  </div>
                )}

                {/* Attach + dropzone zone for comment */}
                <div
                  style={{ ...s.commentDropzone, ...(commentDragOver ? s.commentDropzoneActive : {}) }}
                  onDragOver={(e) => { e.preventDefault(); setCommentDragOver(true); }}
                  onDragLeave={() => setCommentDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setCommentDragOver(false); if (e.dataTransfer.files.length) addCommentFiles(e.dataTransfer.files); }}
                  onClick={() => commentFileInputRef.current?.click()}
                >
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={commentDragOver ? '#1D9E75' : 'var(--text-secondary)'} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  <span style={{ fontSize: 12, color: commentDragOver ? '#1D9E75' : 'var(--text-secondary)' }}>
                    {commentDragOver ? 'Suelta aquí' : 'Adjuntar archivos al comentario'}
                  </span>
                  <input
                    ref={commentFileInputRef}
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => { if (e.target.files) addCommentFiles(e.target.files); e.target.value = ''; }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={s.commentHint}>Ctrl + Enter para enviar</span>
                  <button
                    style={{ ...s.sendBtn, opacity: newComment.trim() ? 1 : 0.5, cursor: newComment.trim() ? 'pointer' : 'default' }}
                    onClick={submitComment}
                    disabled={!newComment.trim()}
                  >
                    <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Enviar
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page:        { padding: '1.5rem', background: 'var(--bg-page)', minHeight: 'calc(100vh - 56px)', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box' },

  topbar:      { display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem', flexWrap: 'wrap' },
  backBtn:     { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: '0.5px solid var(--border)', borderRadius: 8, background: 'transparent', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: 500, flexShrink: 0 },
  topbarMid:   { display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  ticketId:    { fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)', flexShrink: 0 },
  topbarAsunto:{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },

  grid:        { display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '1rem', alignItems: 'start' },
  leftCol:     { display: 'flex', flexDirection: 'column', gap: '1rem' },
  rightCol:    { display: 'flex', flexDirection: 'column', gap: '1rem' },

  card:        { background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: 10, padding: '1.25rem' },
  cardTitle:   { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' },

  descBlock:   { marginBottom: '1.25rem' },
  fieldLabel:  { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 },
  descText:    { fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 },

  infoGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' },
  infoItem:    { display: 'flex', flexDirection: 'column', gap: 4 },
  infoValue:   { fontSize: 13, color: 'var(--text-primary)' },

  badge:       { display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, width: 'fit-content' },
  prioBadge:   { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 },
  prioDot:     { width: 6, height: 6, borderRadius: '50%', display: 'inline-block' },
  agentAv:     { width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600 },

  // Ticket dropzone
  dropzone:       { border: '1.5px dashed var(--border-input)', borderRadius: 10, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.15s', background: 'var(--bg-filter)', marginBottom: '1rem' },
  dropzoneActive: { borderColor: '#1D9E75', background: '#E1F5EE' },
  dropzoneText:   { fontSize: 13, fontWeight: 500, textAlign: 'center' as const },
  dropzoneHint:   { fontSize: 11, color: 'var(--text-secondary)' },

  filesList:   { display: 'flex', flexDirection: 'column', gap: 6 },
  fileRow:     { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', border: '0.5px solid var(--border)', borderRadius: 8, background: 'var(--bg-filter)' },
  fileIcon:    { flexShrink: 0, display: 'flex', alignItems: 'center' },
  fileInfo:    { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 },
  fileName:    { fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  fileMeta:    { fontSize: 11, color: 'var(--text-secondary)' },
  removeBtn:   { background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 4, flexShrink: 0 },

  emptyHint:   { fontSize: 12, color: 'var(--text-secondary)', margin: '0.5rem 0 0' },

  // Scrollable comments container
  commentsScroll: {
    display: 'flex', flexDirection: 'column', gap: 18,
    maxHeight: 480, overflowY: 'auto',
    paddingRight: 4, marginBottom: '1rem',
    scrollbarWidth: 'thin' as const,
  },

  commentItem:   { display: 'flex', gap: 10, alignItems: 'flex-start' },
  commentAvatar: { width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0, marginTop: 1 },
  commentBody:   { flex: 1, minWidth: 0 },
  commentHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' as const },
  commentAutor:  { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' },
  rolBadge:      { display: 'inline-block', padding: '1px 8px', borderRadius: 20, fontSize: 10, fontWeight: 500 },
  commentFecha:  { fontSize: 11, color: 'var(--text-secondary)', marginLeft: 'auto' },
  commentText:   { fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.55, margin: 0, marginBottom: 6 },

  // Files inside a comment
  commentFilesWrap: { display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 },
  cFileRow:         { display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', background: 'var(--bg-filter)', border: '0.5px solid var(--border)', borderRadius: 6 },
  cFileName:        { fontSize: 12, color: 'var(--text-primary)', fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cFileMeta:        { fontSize: 11, color: 'var(--text-secondary)', flexShrink: 0 },

  // Add comment area
  addComment:       { paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: 8 },
  addCommentLabel:  { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  commentTextarea:  { width: '100%', padding: '10px', border: '0.5px solid var(--border-input)', borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const, lineHeight: 1.5 },

  pendingFiles: { display: 'flex', flexDirection: 'column', gap: 4 },

  // Mini dropzone for comment attachments
  commentDropzone:       { display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', border: '1px dashed var(--border-input)', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s', background: 'var(--bg-filter)' },
  commentDropzoneActive: { borderColor: '#1D9E75', background: '#E1F5EE' },

  commentHint: { fontSize: 11, color: 'var(--text-secondary)' },
  sendBtn:     { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 },
};

export default TicketDetailPage;
