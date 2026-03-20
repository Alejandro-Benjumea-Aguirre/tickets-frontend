import { useState, useRef, useEffect } from 'react';

export interface SearchableOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect = ({ options, value, onChange, placeholder = 'Buscar…' }: SearchableSelectProps) => {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState('');
  const containerRef        = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSelect = (opt: SearchableOption) => {
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger */}
      <div style={s.trigger} onClick={handleOpen}>
        <span style={{ color: selected ? '#1a1a1a' : '#aaa', fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
        {selected ? (
          <svg onClick={handleClear} viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="#aaa" strokeWidth={2} style={{ cursor: 'pointer', flexShrink: 0 }}>
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" width={13} height={13} fill="none" stroke="#aaa" strokeWidth={2} style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
          </svg>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={s.dropdown}>
          <div style={s.searchWrap}>
            <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="#aaa" strokeWidth={2} style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              style={s.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar…"
            />
          </div>
          <ul style={s.list}>
            {filtered.length === 0 ? (
              <li style={s.empty}>Sin resultados</li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt.value}
                  style={{ ...s.option, ...(opt.value === value ? s.optionActive : {}) }}
                  onMouseDown={() => handleSelect(opt)}
                >
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  trigger:     { display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 10px', border: '0.5px solid #d8dad8', borderRadius: 7, background: '#fff', cursor: 'pointer', userSelect: 'none', boxSizing: 'border-box' },
  dropdown:    { position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 300, overflow: 'hidden' },
  searchWrap:  { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderBottom: '0.5px solid #e8e8e8' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: 12, color: '#1a1a1a', fontFamily: "'DM Sans', sans-serif", background: 'transparent' },
  list:        { listStyle: 'none', margin: 0, padding: '4px 0', maxHeight: 180, overflowY: 'auto' },
  option:      { padding: '7px 10px', fontSize: 13, color: '#444', cursor: 'pointer', transition: 'background 0.1s' },
  optionActive:{ background: '#E1F5EE', color: '#0F6E56', fontWeight: 500 },
  empty:       { padding: '10px', fontSize: 12, color: '#aaa', textAlign: 'center' },
};

export default SearchableSelect;
