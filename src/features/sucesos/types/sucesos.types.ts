// ── Types ──────────────────────────────────────────────────────────────────────

export interface Suceso {
  id: number;
  name: string;
  level: number;
  parentId: number | null;
  parentName: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface SucesoFilters {
  name:   string;
  parent: string;
}

export interface CreateSucesoForm {
  name:     string;
  level:    string;
  parentId: string;
}

// ── Create Suceso Modal ───────────────────────────────────────────────────────

export interface CreateSucesoModalProps {
  sucesos: Suceso[];
  onClose: () => void;
  onSave:  (form: CreateSucesoForm) => void;
}