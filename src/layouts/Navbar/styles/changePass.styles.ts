export const cp: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: 'var(--bg-card)', border: '0.5px solid var(--border)',
    borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
    width: '100%', maxWidth: 420, fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '20px 20px 16px',
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: 10, background: '#E1F5EE',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  title:    { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 },
  sub:      { fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 },
  closeBtn: {
    marginLeft: 'auto', background: 'transparent', border: 'none',
    cursor: 'pointer', color: 'var(--text-secondary)',
    display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6, flexShrink: 0,
  },
  divider:  { height: '0.5px', background: 'var(--border)' },
  body:     { padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label:    { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  input: {
    height: 38, padding: '0 40px 0 10px', border: '0.5px solid var(--border-input)',
    borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-primary)',
    fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none',
    boxSizing: 'border-box', width: '100%', transition: 'border-color 0.15s',
  },
  inputError: { borderColor: '#E24B4A' },
  inputOk:    { borderColor: '#1D9E75' },
  eyeBtn: {
    position: 'absolute', right: 10, background: 'transparent', border: 'none',
    cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex',
    alignItems: 'center', padding: 0,
  },
  rules: { display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 2 },
  ruleItem: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, transition: 'color 0.15s' },
  ruleDot:  { width: 6, height: 6, borderRadius: '50%', flexShrink: 0, transition: 'background 0.15s' },
  errorMsg: { fontSize: 11, color: '#E24B4A', marginTop: 2 },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
    gap: 8, padding: '14px 20px',
  },
  cancelBtn: {
    padding: '7px 16px', border: '0.5px solid var(--border)', borderRadius: 8,
    background: 'transparent', color: 'var(--text-primary)', fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: 500,
  },
  saveBtn: {
    padding: '7px 16px', border: 'none', borderRadius: 8,
    background: '#1D9E75', color: '#fff', fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', fontWeight: 500,
  },
};