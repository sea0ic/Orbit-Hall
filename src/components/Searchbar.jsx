import { useState, useRef, useEffect, useCallback } from 'react';
import { STARS } from '../data/stars';
import { CONSTELLATIONS } from '../data/constellations';
import { PLANET_DEFS } from '../utils/planetCalculations';
import { MESSIER } from '../data/messier';

export default function SearchBar({ onSelectResult, onToggleUI, uiVisible }) {
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen]             = useState(false);
  const [focused, setFocused]       = useState(false);
  const inputRef  = useRef(null);
  const listRef   = useRef(null);

  const search = useCallback((q) => {
    if (!q.trim()) { setSuggestions([]); setOpen(false); return; }
    const lower = q.toLowerCase();

    const starMatches = STARS
      .filter(s => s.name.toLowerCase().includes(lower) || s.constellation?.toLowerCase().includes(lower))
      .sort((a, b) => a.mag - b.mag)
      .slice(0, 6)
      .map(s => ({
        type:'star', id:s.id,
        label:s.name,
        sub: `${s.constellation || ''} · mag ${s.mag.toFixed(2)}`,
        data:s,
      }));

    const conMatches = CONSTELLATIONS
      .filter(c => c.name.toLowerCase().includes(lower))
      .slice(0, 2)
      .map(c => ({
        type:'constellation', id:c.id,
        label:c.name, sub:'Constellation', data:c,
      }));

    const planetMatches = PLANET_DEFS
      .filter(p => p.name.toLowerCase().includes(lower))
      .slice(0, 3)
      .map(p => ({
        type:'planet', id:p.id,
        label:p.name,
        sub:`Planet · ${p.symbol}`,
        data:p,
      }));

    const dsoMatches = MESSIER
      .filter(m => m.name.toLowerCase().includes(lower) || m.id.toLowerCase().includes(lower) || m.constellation?.toLowerCase().includes(lower))
      .sort((a,b) => a.mag - b.mag)
      .slice(0, 4)
      .map(m => ({
        type:'dso', id:m.id,
        label:`${m.id} — ${m.name}`,
        sub:`${m.type.replace(/_/g,' ')} · ${m.constellation}`,
        data:m,
      }));

    const all = [...starMatches, ...planetMatches, ...dsoMatches, ...conMatches].slice(0, 10);
    setSuggestions(all);
    setOpen(all.length > 0);
    setActiveIndex(-1);
  }, []);

  const handleInput = e => { setQuery(e.target.value); search(e.target.value); };

  const handleSelect = item => {
    setQuery(''); setSuggestions([]); setOpen(false);
    onSelectResult(item);
    inputRef.current?.blur();
  };

  const handleKeyDown = e => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && activeIndex >= 0) handleSelect(suggestions[activeIndex]);
    else if (e.key === 'Escape') { setOpen(false); setQuery(''); inputRef.current?.blur(); }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      listRef.current.children[activeIndex]?.scrollIntoView({ block:'nearest' });
    }
  }, [activeIndex]);

  useEffect(() => {
    const handler = e => { if (!e.target.closest('[data-searchbar]')) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const typeIcon = type => {
    if (type === 'star')          return <StarIcon />;
    if (type === 'planet')        return <PlanetIcon />;
    if (type === 'constellation') return <ConIcon />;
    if (type === 'dso')           return <DSOIcon />;
    return null;
  };

  return (
    <div data-searchbar style={{ position:'relative' }}>
      {/* Input row */}
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        background: focused ? 'rgba(8, 14, 28, 0.92)' : 'rgba(6, 10, 18, 0.80)',
        border: `1px solid ${focused ? 'rgba(160,188,216,0.25)' : 'rgba(120,160,220,0.13)'}`,
        borderRadius:8, padding:'0 10px',
        backdropFilter:'blur(14px)',
        height:38, width:300,
        transition:'border-color 160ms, background 160ms',
        boxShadow: focused ? '0 0 0 3px rgba(160,188,216,0.07)' : 'none',
      }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0, opacity:0.5 }}>
          <circle cx="6" cy="6" r="4.5" stroke="#a0bcd8" strokeWidth="1.4"/>
          <path d="M9.5 9.5l2.5 2.5" stroke="#a0bcd8" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => { setFocused(true); query && setOpen(suggestions.length > 0); }}
          onBlur={() => setFocused(false)}
          placeholder="Search stars, planets, constellations…"
          style={{
            flex:1, background:'transparent', border:'none', outline:'none',
            color:'#e8edf5', fontSize:'13px', fontFamily:'Inter, sans-serif',
            caretColor:'#a0bcd8',
          }}
        />

        {query && (
          <button onClick={() => { setQuery(''); setSuggestions([]); setOpen(false); }}
            style={{ background:'none', border:'none', cursor:'pointer', color:'#3d5070',
              padding:'2px', flexShrink:0, display:'flex', alignItems:'center',
              transition:'color 160ms' }}
            onMouseEnter={e=>e.currentTarget.style.color='#7a90b0'}
            onMouseLeave={e=>e.currentTarget.style.color='#3d5070'}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        <div style={{ width:1, height:16, background:'rgba(120,160,220,0.1)', margin:'0 2px' }} />

        <button onClick={onToggleUI} title={uiVisible ? 'Hide controls (H)' : 'Show controls (H)'}
          style={{
            background:'none', border:'none', cursor:'pointer',
            color: uiVisible ? '#7a90b0' : '#3d5070',
            padding:'2px', flexShrink:0, display:'flex', alignItems:'center',
            transition:'color 160ms',
          }}
          onMouseEnter={e=>e.currentTarget.style.color='#a0bcd8'}
          onMouseLeave={e=>e.currentTarget.style.color = uiVisible ? '#7a90b0' : '#3d5070'}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="2" y="3.5" width="10" height="1.3" rx="0.65" fill="currentColor"/>
            <rect x="2" y="6.35" width="10" height="1.3" rx="0.65" fill="currentColor"/>
            <rect x="2" y="9.2" width="10" height="1.3" rx="0.65" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 5px)', left:0, right:0,
          background:'rgba(5, 9, 20, 0.97)',
          border:'1px solid rgba(120,160,220,0.14)',
          borderRadius:8, backdropFilter:'blur(20px)',
          zIndex:200, overflow:'hidden',
          boxShadow:'0 12px 40px rgba(0,0,0,0.7)',
          animation:'fadeSlideDown 110ms ease',
        }}>
          <ul ref={listRef} style={{ listStyle:'none', maxHeight:300, overflowY:'auto' }}>
            {suggestions.map((item, i) => (
              <li key={item.id || i}>
                <button
                  onMouseDown={e => { e.preventDefault(); handleSelect(item); }}
                  onMouseEnter={() => setActiveIndex(i)}
                  style={{
                    width:'100%', textAlign:'left',
                    background: i === activeIndex ? 'rgba(120,160,220,0.09)' : 'transparent',
                    border:'none', cursor:'pointer',
                    padding:'9px 12px',
                    display:'flex', alignItems:'center', gap:10,
                    borderBottom: i < suggestions.length - 1 ? '1px solid rgba(120,160,220,0.06)' : 'none',
                    transition:'background 80ms',
                  }}
                >
                  {typeIcon(item.type)}
                  <span style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:'#e8edf5', fontSize:'13px', fontWeight:500 }}>
                      {highlight(item.label, query)}
                    </div>
                    <div style={{ color:'#4a6080', fontSize:'11px', fontFamily:'Space Mono, monospace', marginTop:1 }}>
                      {item.sub}
                    </div>
                  </span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity:0.3, flexShrink:0 }}>
                    <path d="M3 5h4M5 3l2 2-2 2" stroke="#a0bcd8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <div style={{ padding:'6px 12px', borderTop:'1px solid rgba(120,160,220,0.07)',
            display:'flex', gap:12, alignItems:'center' }}>
            <span style={{ color:'#2d4060', fontSize:'10px' }}>↑↓ navigate</span>
            <span style={{ color:'#2d4060', fontSize:'10px' }}>↵ select</span>
            <span style={{ color:'#2d4060', fontSize:'10px' }}>esc dismiss</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity:0; transform:translateY(-4px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}

function highlight(text, query) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color:'#a0bcd8', fontWeight:700 }}>{text.slice(i, i + query.length)}</span>
      {text.slice(i + query.length)}
    </>
  );
}

const StarIcon = () => (
  <span style={{ width:22, height:22, borderRadius:'50%', background:'rgba(160,188,216,0.1)',
    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
    <svg width="9" height="9" viewBox="0 0 9 9">
      <circle cx="4.5" cy="4.5" r="2" fill="#a0bcd8"/>
      <circle cx="4.5" cy="4.5" r="1" fill="#e0f0ff"/>
    </svg>
  </span>
);

const PlanetIcon = () => (
  <span style={{ width:22, height:22, borderRadius:'50%', background:'rgba(220,190,120,0.1)',
    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
    <svg width="10" height="10" viewBox="0 0 10 10">
      <circle cx="5" cy="5" r="3" fill="#d8c080"/>
      <ellipse cx="5" cy="5" rx="5" ry="1.5" fill="none" stroke="#d8c080" strokeWidth="0.8" opacity="0.6"/>
    </svg>
  </span>
);

const DSOIcon = () => (
  <span style={{ width:22, height:22, borderRadius:'50%', background:'rgba(200,160,240,0.1)',
    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
    <svg width="10" height="10" viewBox="0 0 10 10">
      <ellipse cx="5" cy="5" rx="4" ry="2.2" fill="none" stroke="#c0a0e0" strokeWidth="0.9" opacity="0.7"/>
      <ellipse cx="5" cy="5" rx="1.8" ry="1" fill="#c0a0e0" opacity="0.5"/>
    </svg>
  </span>
);

const ConIcon = () => (
  <span style={{ width:22, height:22, borderRadius:'50%', background:'rgba(130,110,200,0.1)',
    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
    <svg width="10" height="10" viewBox="0 0 10 10">
      <circle cx="2" cy="2" r="1.2" fill="#9090c8"/>
      <circle cx="8" cy="3" r="1"   fill="#9090c8"/>
      <circle cx="5" cy="8" r="1.2" fill="#9090c8"/>
      <line x1="2" y1="2" x2="8" y2="3" stroke="#9090c8" strokeWidth="0.7" opacity="0.6"/>
      <line x1="8" y1="3" x2="5" y2="8" stroke="#9090c8" strokeWidth="0.7" opacity="0.6"/>
    </svg>
  </span>
);