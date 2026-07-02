export const PASSWORD_RULES = [
  { id: 'len',   label: 'Mínimo 8 caracteres',          test: (v: string) => v.length >= 8 },
  { id: 'upper', label: 'Al menos 1 letra mayúscula',    test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'Al menos 1 letra minúscula',    test: (v: string) => /[a-z]/.test(v) },
  { id: 'num',   label: 'Al menos 1 número',             test: (v: string) => /[0-9]/.test(v) },
  { id: 'spec',  label: 'Al menos 1 carácter especial',  test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export const DEMO_ACCOUNTS = [
  { label: 'Administrador', username: 'admin',   password: 'Admin123!',   color: '#1D9E75' },
  { label: 'Agente',        username: 'agente',  password: 'agente123',  color: '#378ADD' },
  { label: 'Cliente',       username: 'cliente', password: 'cliente123', color: '#EF9F27' },
];
