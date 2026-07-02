
export interface CodeModalProps {
  email: string;
  demoCode: string;
  onVerify: (code: string) => void;
  onClose: () => void;
}


export interface NewPasswordModalProps {
  onSave: () => void;
  onClose: () => void;
  newPass: string;
  setNewPass: (v: string) => void;
  confirmPass: string;
  setConfirmPass: (v: string) => void;
}