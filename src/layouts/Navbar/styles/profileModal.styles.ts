export const pm: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: 'var(--bg-card)', border: '0.5px solid var(--border)',
    borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
    width: '100%', maxWidth: 460, fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '20px 20px 16px',
  },
  avatarLg: {
    width: 48, height: 48, borderRadius: '50%', background: '#1D9E75',
    color: '#fff', fontSize: 16, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  modalTitle: { fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' },
  modalSub:   { fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 },
  closeBtn: {
    marginLeft: 'auto', background: 'transparent', border: 'none',
    cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 6,
  },
  divider: { height: '0.5px', background: 'var(--border)' },
  body:    { padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 },
  row:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field:   { display: 'flex', flexDirection: 'column', gap: 4 },
  fieldFull: { display: 'flex', flexDirection: 'column', gap: 4, gridColumn: 'span 2' },
  label:   { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  value:   { fontSize: 13, color: 'var(--text-primary)', fontWeight: 400 },
  badge:   { display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, width: 'fit-content' },
  inputLabel: { fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: {
    height: 36, padding: '0 10px', border: '0.5px solid var(--border-input)',
    borderRadius: 8, background: 'var(--bg-input)', color: 'var(--text-primary)',
    fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none',
    boxSizing: 'border-box', width: '100%',
  },
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