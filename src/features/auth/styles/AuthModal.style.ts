// ── Modal styles ───────────────────────────────────────────────────────────────

export const ms: Record<string, React.CSSProperties> = {
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:       { background: '#ffffff', border: '0.5px solid #e0e0e0', borderRadius: 14, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' },
  header:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '0.5px solid #e0e0e0' },
  headerLeft:  { display: 'flex', alignItems: 'center', gap: 12 },
  headerIcon:  { width: 38, height: 38, borderRadius: 10, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerTitle: { fontSize: 14, fontWeight: 600, color: '#1a1a1a' },
  headerSub:   { fontSize: 12, color: '#888', marginTop: 2 },
  closeBtn:    { background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', padding: 4 },
  body:        { padding: '1.5rem' },
  infoBox:     { display: 'flex', alignItems: 'flex-start', gap: 8, background: '#E6F1FB', border: '0.5px solid #B8D4F0', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#185FA5', marginBottom: 12 },
  demoHint:    { display: 'flex', alignItems: 'center', gap: 7, background: '#FEF3CD', border: '0.5px solid #F0D980', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#8A6400', marginBottom: 16 },
  field:       { marginBottom: '1.25rem' },
  label:       { display: 'block', fontSize: 11, fontWeight: 500, color: '#888', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' },
  input:       { width: '100%', height: 42, padding: '0 12px', border: '0.5px solid #d0d0d0', borderRadius: 8, background: '#f9f9f9', color: '#1a1a1a', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' },
  fieldError:  { fontSize: 12, color: '#E24B4A', marginTop: 6 },
  eyeBtn:      { position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', padding: 2 },
  rulesBox:    { background: '#f9faf9', border: '0.5px solid #e0e0e0', borderRadius: 8, padding: '10px 12px', marginBottom: 14 },
  footer:      { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  cancelBtn:   { padding: '9px 18px', borderRadius: 8, border: '0.5px solid #d0d0d0', background: 'transparent', color: '#555', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  saveBtn:     { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#1D9E75', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
};