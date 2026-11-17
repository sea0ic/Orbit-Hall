import { useEffect } from 'react';

export const DEFAULT_LAYERS = {
  stars:          true,
  constellations: true,
  labels:         true,
  planets:        true,
  moon:           true,
  deepSky:        true,
  grid:           false,
  redMode:        false,
};

const LAYER_DEFS = [
  { id:'stars',          label:'Stars',          icon:<StarsIcon/> },
  { id:'constellations', label:'Constellations',  icon:<ConIcon/> },
  { id:'labels',         label:'Labels',          icon:<LabelIcon/> },
  { id:'planets',        label:'Planets',         icon:<PlanetIcon/> },
  { id:'moon',           label:'Moon',            icon:<MoonIcon/> },
  { id:'deepSky',        label:'Deep Sky',        icon:<DeepSkyIcon/> },
  { id:'grid',           label:'Grid',            icon:<GridIcon/> },
];

export default function LayerControls({ layers, onChange }) {
  // Keyboard: G = grid, R = red mode, D = deep sky
  useEffect(() => {
    const h = e => {
      if (e.target.matches('input,textarea')) return;
      if (e.key === 'g') onChange(prev => ({ ...prev, grid: !prev.grid }));
      if (e.key === 'r') onChange(prev => ({ ...prev, redMode: !prev.redMode }));
      if (e.key === 'd') onChange(prev => ({ ...prev, deepSky: !prev.deepSky }));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onChange]);

  const toggle = id => onChange(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="float-panel" style={{ minWidth: 186 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:11 }}>
        <div style={{
          width:24, height:24, borderRadius:6, flexShrink:0,
          background:'rgba(120,160,220,0.08)', border:'1px solid rgba(120,160,220,0.14)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="3" cy="3" r="1.5" stroke="#7a90b0" strokeWidth="1.1"/>
            <circle cx="9" cy="3" r="1.5" stroke="#7a90b0" strokeWidth="1.1"/>
            <circle cx="3" cy="9" r="1.5" stroke="#7a90b0" strokeWidth="1.1"/>
            <circle cx="9" cy="9" r="1.5" stroke="#7a90b0" strokeWidth="1.1"/>
          </svg>
        </div>
        <span style={{ color:'#7a90b0', fontSize:'10px', letterSpacing:'0.06em', textTransform:'uppercase' }}>
          Sky Layers
        </span>
      </div>

      {/* Layer toggles */}
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {LAYER_DEFS.map(({ id, label, icon }) => (
          <LayerRow
            key={id}
            label={label}
            icon={icon}
            active={layers[id]}
            onToggle={() => toggle(id)}
          />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height:1, background:'rgba(120,160,220,0.08)', margin:'8px 0' }}/>

      {/* Red mode toggle */}
      <button
        onClick={() => toggle('redMode')}
        style={{
          width:'100%', display:'flex', alignItems:'center', gap:8,
          background: layers.redMode
            ? 'rgba(200,80,60,0.12)'
            : 'rgba(255,255,255,0.03)',
          border: `1px solid ${layers.redMode
            ? 'rgba(200,80,60,0.30)'
            : 'rgba(120,160,220,0.10)'}`,
          borderRadius:7, padding:'7px 9px',
          cursor:'pointer', transition:'all 160ms',
        }}
      >
        <span style={{ fontSize:12 }}>🔴</span>
        <span style={{ flex:1, textAlign:'left', color: layers.redMode ? '#e07060' : '#7a90b0', fontSize:'12px', fontWeight:500 }}>
          Red Night Mode
        </span>
        <TogglePill active={layers.redMode} color="#c85040" />
      </button>

      {/* Hint */}
      <div style={{ marginTop:8, color:'#2a3848', fontSize:'10px', lineHeight:1.6 }}>
        R — red mode · G — grid · D — deep sky
      </div>
    </div>
  );
}

function LayerRow({ label, icon, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width:'100%', display:'flex', alignItems:'center', gap:8,
        background:'transparent', border:'none', borderRadius:6,
        padding:'5px 4px', cursor:'pointer', transition:'background 120ms',
      }}
      onMouseEnter={e=>e.currentTarget.style.background='rgba(120,160,220,0.05)'}
      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
    >
      <span style={{ color: active ? '#a0bcd8' : '#3d5070', transition:'color 160ms', flexShrink:0 }}>
        {icon}
      </span>
      <span style={{ flex:1, textAlign:'left', color: active ? '#c8d8ec' : '#4a6070', fontSize:'12px', transition:'color 160ms' }}>
        {label}
      </span>
      <TogglePill active={active} />
    </button>
  );
}

function TogglePill({ active, color = '#5890d0' }) {
  return (
    <div style={{
      width:28, height:15, borderRadius:8, flexShrink:0,
      background: active ? `${color}40` : 'rgba(255,255,255,0.06)',
      border: `1px solid ${active ? `${color}60` : 'rgba(120,160,220,0.14)'}`,
      position:'relative', transition:'all 180ms',
    }}>
      <div style={{
        position:'absolute', top:2,
        left: active ? 'calc(100% - 13px)' : 2,
        width:9, height:9, borderRadius:'50%',
        background: active ? color : 'rgba(120,160,220,0.3)',
        boxShadow: active ? `0 0 6px ${color}88` : 'none',
        transition:'all 180ms',
      }}/>
    </div>
  );
}

// ── Layer icons ───────────────────────────────────────────────────────────────
function StarsIcon()   { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="1.8" fill="currentColor"/><circle cx="2" cy="2.5" r="0.9" fill="currentColor" opacity="0.6"/><circle cx="11" cy="3" r="0.7" fill="currentColor" opacity="0.5"/><circle cx="10.5" cy="10" r="0.8" fill="currentColor" opacity="0.6"/><circle cx="2.5" cy="10.5" r="0.6" fill="currentColor" opacity="0.4"/></svg>; }
function ConIcon()     { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="2" cy="2" r="1.2" fill="currentColor"/><circle cx="11" cy="4" r="1.2" fill="currentColor"/><circle cx="6.5" cy="11" r="1.2" fill="currentColor"/><line x1="2" y1="2" x2="11" y2="4" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/><line x1="11" y1="4" x2="6.5" y2="11" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/></svg>; }
function LabelIcon()   { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="3.5" cy="6.5" r="1.5" fill="currentColor"/><line x1="6" y1="6.5" x2="11" y2="6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="6" y1="4.5" x2="9" y2="4.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/><line x1="6" y1="8.5" x2="9.5" y2="8.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.5"/></svg>; }
function PlanetIcon()  { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.1"/><ellipse cx="6.5" cy="6.5" rx="5.5" ry="1.6" stroke="currentColor" strokeWidth="0.9" opacity="0.6"/></svg>; }
function MoonIcon()    { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 6.5a4 4 0 1 1-4-4 3 3 0 0 0 4 4z" stroke="currentColor" strokeWidth="1.1" fill="none"/></svg>; }
function DeepSkyIcon() { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><ellipse cx="6.5" cy="6.5" rx="4" ry="2.2" stroke="currentColor" strokeWidth="1" opacity="0.7"/><ellipse cx="6.5" cy="6.5" rx="2" ry="1.1" fill="currentColor" opacity="0.5"/></svg>; }
function GridIcon()    { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><line x1="1" y1="4.5" x2="12" y2="4.5" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.5" opacity="0.7"/><line x1="1" y1="8.5" x2="12" y2="8.5" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.5" opacity="0.7"/><line x1="4.5" y1="1" x2="4.5" y2="12" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.5" opacity="0.7"/><line x1="8.5" y1="1" x2="8.5" y2="12" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1.5" opacity="0.7"/></svg>; }