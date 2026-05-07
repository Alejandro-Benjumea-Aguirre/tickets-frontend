// ── Types ──────────────────────────────────────────────────────────────────────

export type ModuleKey = 'tickets' | 'usuarios' | 'clientes' | 'sucesos';
export type FileFormat = 'excel' | 'csv';

export interface TicketFilters   { fechaDesde: string; fechaHasta: string; prioridad: string; estado: string; }
export interface UserFilters     { name: string; rol: string; status: string; }
export interface ClientFilters   { name: string; engineer: string; status: string; }
export interface SucesoFilters   { name: string; level: string; }

export interface ModuleConfig {
  key:       ModuleKey;
  label:     string;
  desc:      string;
  count:     number;
  iconColor: string;
  icon:      React.ReactNode;
}

// ── Generate Report Modal ─────────────────────────────────────────────────────

export interface GenerateModalProps {
  module: ModuleConfig;
  onClose: () => void;
}
