import { useEffect, useRef, useState } from "react";
import { ClientFilters, FileFormat, GenerateModalProps, SucesoFilters, TicketFilters, UserFilters } from "../types/reportes.types";
import { ms } from "../styles/ReporteModal.style";

export const GenerateModal = ({ module, onClose }: GenerateModalProps) => {
  const overlayRef              = useRef<HTMLDivElement>(null);
  const [format, setFormat]     = useState<FileFormat>('excel');
  const [generated, setGenerated] = useState(false);

  // Per-module filter states
  const [ticketF, setTicketF]   = useState<TicketFilters>({ fechaDesde: '', fechaHasta: '', prioridad: '', estado: '' });
  const [userF,   setUserF]     = useState<UserFilters>({ name: '', rol: '', status: '' });
  const [clientF, setClientF]   = useState<ClientFilters>({ name: '', engineer: '', status: '' });
  const [sucesoF, setSucesoF]   = useState<SucesoFilters>({ name: '', level: '' });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleGenerate = () => setGenerated(true);

  const filterCount = () => {
    if (module.key === 'tickets') return Object.values(ticketF).filter(Boolean).length;
    if (module.key === 'usuarios') return Object.values(userF).filter(Boolean).length;
    if (module.key === 'clientes') return Object.values(clientF).filter(Boolean).length;
    return Object.values(sucesoF).filter(Boolean).length;
  };

  const ext  = format === 'excel' ? 'xlsx' : 'csv';
  const filename = `reporte_${module.key}_${new Date().toISOString().slice(0,10)}.${ext}`;

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
            <div style={{ ...ms.headerIcon, background: module.iconColor }}>
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div>
              <div style={ms.headerTitle}>Generar reporte — {module.label}</div>
              <div style={ms.headerSub}>Configura los filtros y el formato de exportación</div>
            </div>
          </div>
          <button style={ms.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {!generated ? (
          <div style={ms.body}>

            {/* ── Filtros por módulo ── */}
            <div style={ms.section}>
              <div style={ms.sectionTitle}>
                <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filtros
                {filterCount() > 0 && <span style={ms.filterCount}>{filterCount()} aplicado{filterCount() > 1 ? 's' : ''}</span>}
              </div>

              {/* TICKETS */}
              {module.key === 'tickets' && (
                <div style={ms.filterGrid2}>
                  <div style={ms.field}>
                    <label style={ms.label}>Fecha desde</label>
                    <input style={ms.input} type="date" value={ticketF.fechaDesde} onChange={(e) => setTicketF(p => ({ ...p, fechaDesde: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Fecha hasta</label>
                    <input style={ms.input} type="date" value={ticketF.fechaHasta} onChange={(e) => setTicketF(p => ({ ...p, fechaHasta: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Prioridad</label>
                    <select style={ms.select} value={ticketF.prioridad} onChange={(e) => setTicketF(p => ({ ...p, prioridad: e.target.value }))}>
                      <option value="">Todas</option>
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Estado</label>
                    <select style={ms.select} value={ticketF.estado} onChange={(e) => setTicketF(p => ({ ...p, estado: e.target.value }))}>
                      <option value="">Todos</option>
                      <option value="Abierto">Abierto</option>
                      <option value="En progreso">En progreso</option>
                      <option value="Cerrado">Cerrado</option>
                      <option value="Urgente">Urgente</option>
                    </select>
                  </div>
                </div>
              )}

              {/* USUARIOS */}
              {module.key === 'usuarios' && (
                <div style={ms.filterGrid3}>
                  <div style={ms.field}>
                    <label style={ms.label}>Nombre</label>
                    <input style={ms.input} type="text" placeholder="Buscar por nombre…" value={userF.name} onChange={(e) => setUserF(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Rol</label>
                    <select style={ms.select} value={userF.rol} onChange={(e) => setUserF(p => ({ ...p, rol: e.target.value }))}>
                      <option value="">Todos</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Agente">Agente</option>
                      <option value="Cliente">Cliente</option>
                    </select>
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Estado</label>
                    <select style={ms.select} value={userF.status} onChange={(e) => setUserF(p => ({ ...p, status: e.target.value }))}>
                      <option value="">Todos</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              )}

              {/* CLIENTES */}
              {module.key === 'clientes' && (
                <div style={ms.filterGrid3}>
                  <div style={ms.field}>
                    <label style={ms.label}>Nombre</label>
                    <input style={ms.input} type="text" placeholder="Buscar cliente…" value={clientF.name} onChange={(e) => setClientF(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Ingeniero</label>
                    <input style={ms.input} type="text" placeholder="Nombre del ingeniero…" value={clientF.engineer} onChange={(e) => setClientF(p => ({ ...p, engineer: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Estado</label>
                    <select style={ms.select} value={clientF.status} onChange={(e) => setClientF(p => ({ ...p, status: e.target.value }))}>
                      <option value="">Todos</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              )}

              {/* SUCESOS */}
              {module.key === 'sucesos' && (
                <div style={ms.filterGrid2}>
                  <div style={ms.field}>
                    <label style={ms.label}>Nombre</label>
                    <input style={ms.input} type="text" placeholder="Buscar suceso…" value={sucesoF.name} onChange={(e) => setSucesoF(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div style={ms.field}>
                    <label style={ms.label}>Nivel</label>
                    <select style={ms.select} value={sucesoF.level} onChange={(e) => setSucesoF(p => ({ ...p, level: e.target.value }))}>
                      <option value="">Todos los niveles</option>
                      {[1,2,3,4,5].map(l => <option key={l} value={String(l)}>Nivel {l}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* ── Formato de exportación ── */}
            <div style={ms.section}>
              <div style={ms.sectionTitle}>
                <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Formato de exportación
              </div>
              <div style={ms.formatGrid}>

                {/* Excel */}
                <button
                  type="button"
                  style={{ ...ms.formatBtn, ...(format === 'excel' ? ms.formatBtnActive : {}) }}
                  onClick={() => setFormat('excel')}
                >
                  <div style={{ ...ms.formatIconWrap, background: format === 'excel' ? '#E1F5EE' : 'var(--bg-filter)' }}>
                    <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
                      <rect x="2" y="3" width="20" height="18" rx="2" fill={format === 'excel' ? '#1D9E75' : 'var(--text-tertiary)'} opacity="0.15"/>
                      <path d="M8 8l2.5 4L8 16M12 8h4M12 12h3M12 16h4" stroke={format === 'excel' ? '#1D9E75' : 'var(--text-secondary)'} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ ...ms.formatLabel, color: format === 'excel' ? '#1D9E75' : 'var(--text-primary)' }}>Excel</div>
                    <div style={ms.formatExt}>.xlsx — Hoja de cálculo</div>
                  </div>
                  <div style={{ ...ms.formatCheck, borderColor: format === 'excel' ? '#1D9E75' : 'var(--border-input)', background: format === 'excel' ? '#1D9E75' : 'transparent' }}>
                    {format === 'excel' && (
                      <svg viewBox="0 0 24 24" width={10} height={10} fill="none" stroke="white" strokeWidth={3}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                </button>

                {/* CSV */}
                <button
                  type="button"
                  style={{ ...ms.formatBtn, ...(format === 'csv' ? ms.formatBtnActive : {}) }}
                  onClick={() => setFormat('csv')}
                >
                  <div style={{ ...ms.formatIconWrap, background: format === 'csv' ? '#E6F1FB' : 'var(--bg-filter)' }}>
                    <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
                      <rect x="2" y="3" width="20" height="18" rx="2" fill={format === 'csv' ? '#378ADD' : 'var(--text-tertiary)'} opacity="0.15"/>
                      <path d="M7 9h10M7 12h7M7 15h5" stroke={format === 'csv' ? '#378ADD' : 'var(--text-secondary)'} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ ...ms.formatLabel, color: format === 'csv' ? '#378ADD' : 'var(--text-primary)' }}>CSV</div>
                    <div style={ms.formatExt}>.csv — Valores separados por coma</div>
                  </div>
                  <div style={{ ...ms.formatCheck, borderColor: format === 'csv' ? '#378ADD' : 'var(--border-input)', background: format === 'csv' ? '#378ADD' : 'transparent' }}>
                    {format === 'csv' && (
                      <svg viewBox="0 0 24 24" width={10} height={10} fill="none" stroke="white" strokeWidth={3}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                </button>

              </div>

              {/* Filename preview */}
              <div style={ms.filenamePreview}>
                <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="var(--text-tertiary)" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
                <span style={ms.filenameText}>{filename}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={ms.footer}>
              <button type="button" style={ms.cancelBtn} onClick={onClose}>Cancelar</button>
              <button type="button" style={ms.generateBtn} onClick={handleGenerate}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Generar reporte
              </button>
            </div>
          </div>
        ) : (
          /* ── Success state ── */
          <div style={ms.successBody}>
            <div style={ms.successIcon}>
              <svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke="#1D9E75" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div style={ms.successTitle}>¡Reporte generado!</div>
            <div style={ms.successSub}>
              Tu archivo <strong>{filename}</strong> está listo para descargarse.
            </div>
            <div style={ms.successMeta}>
              <span style={ms.metaChip}>
                <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                {ext.toUpperCase()}
              </span>
              <span style={ms.metaChip}>{module.count} registros</span>
              {filterCount() > 0 && <span style={ms.metaChip}>{filterCount()} filtro{filterCount() > 1 ? 's' : ''}</span>}
            </div>
            <div style={ms.successActions}>
              <button style={ms.downloadBtn}>
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Descargar {filename}
              </button>
              <button style={ms.cancelBtn} onClick={onClose}>Cerrar</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};