// ── Types ──────────────────────────────────────────────────────────────────────

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  engineer: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface ClientFilters {
  name: string;
  email: string;
  phone: string;
  engineer: string;
  status: string;
  fechaDesde: string;
  fechaHasta: string;
}

export interface CreateClientForm {
  name: string;
  email: string;
  phone: string;
  engineer: string;
}

// ── Create Client Modal ───────────────────────────────────────────────────────

export interface CreateClientModalProps {
  onClose: () => void;
  onSave:  (form: CreateClientForm) => void;
}

// ── Edit Client Modal ─────────────────────────────────────────────────────────

export interface EditClientForm {
  email:    string;
  phone:    string;
  engineer: string;
}

export interface EditClientModalProps {
  client:  Client;
  onClose: () => void;
  onSave:  (id: number, form: EditClientForm) => void;
}