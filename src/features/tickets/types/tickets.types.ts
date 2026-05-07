// ── Shared ticket data ─────────────────────────────────────────────────────────
// Fuente de verdad para el detalle de tickets. Los dashboards usan su propio
// subconjunto; esta lista provee la información completa para TicketDetailPage.

export interface TicketComment {
  id: string;
  autor: string;
  autorInitials: string;
  autorColor: string;
  rol: string;
  texto: string;
  fecha: string;        // dd/mm/yyyy — hh:mm
  files?: TicketFile[];
}

export interface TicketFile {
  id: string;
  nombre: string;
  tipo: string;   // 'image' | 'pdf' | 'doc' | 'other'
  tamaño: string;
  fecha: string;
}

export interface TicketDetail {
  id: string;
  asunto: string;
  descripcion: string;
  prio: string;
  estado: string;
  cliente: string;
  agente: string;
  agColor: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  enEspera: boolean;
  categoria: string;
  canal: string;
  comments: TicketComment[];
  files: TicketFile[];
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FileItem {
  id: string;
  file: File;
  preview?: string;
  error?: string;
}

export interface FileListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  formatSize: (bytes: number) => string;
  s: Record<string, React.CSSProperties>; // Pasamos los estilos
}

export interface CreateTicketModalProps {
  onClose: () => void;
}
