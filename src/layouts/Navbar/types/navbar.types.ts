import { User } from '../../../types/users.types';

// ── ProfileModal ───────────────────────────────────────────────────────────────

export interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updates: { email: string; phone: string }) => void;
}

export interface ChangePasswordModalProps {
  onClose: () => void;
  userId: number;
}