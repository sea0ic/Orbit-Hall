import { useState, useEffect } from 'react';

function toLocal(d) {
  const p = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function TimeControls({ observingTime, onTimeChange, onZoomIn, onZoomOut, onResetView }) {
  const [val, setVal] = useState(toLocal(observingTime || new Date()));
  const isNow = !observingTime || Math.abs(observingTime - Date.now()) < 70000;

  useEffect(() => { if (observingTime) setVal(toLocal(observingTime)); }, [observingTime]);

  const handleChange = e => {
    setVal(e.target.value);
    const d = new Date(e.target.value);
    if (!isNaN(d)) onTimeChange(d);
  };

  const handleNow = () => { const n=new Date(); onTimeChange(n); setVal(toLocal(n)); };

  const fmt = d => d.toLocaleString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});

  return (
    <div className="float-panel" style={{ minWidth:194 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:9 }}>
        <div style={{
          width:24, height:24, borderRadius:6, flexShrink:0,
          background:'rgba(120,160,220,0.08)', border:'1px solid rgba(120,160,220,0.14)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="#7a90b0" strokeWidth="1.1"/>
            <path d="M5.5 3v2.5l1.5 1.5" stroke="#7a90b0" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div style={{ color:'#2d4055', fontSize:'10px', letterSpacing:'0.05em', textTransform:'uppercase' }}>
            Observing Time
          </div>
        </div>
        {isNow && (
          <span style={{ marginLeft:'auto', fontSize:'10px', fontWeight:600, color:'#78c8a0',
            display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#78c8a0',
              boxShadow:'0 0 6px #78c8a088', display:'inline-block' }}/>
            Live
          </span>
        )}
      </div>

      {/* Current time display */}
      <div style={{ color:'#d0dce8', fontSize:'13px', fontFamily:'Space Mono,monospace', marginBottom:9, letterSpacing:'0.02em' }}>
        {fmt(observingTime || new Date())}
      </div>

      {/* Datetime input */}
      <input
        type="datetime-local" value={val} onChange={handleChange}
        style={{
          width:'100%', background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(120,160,220,0.14)', borderRadius:7,
          padding:'6px 8px', color:'#d0dce8',
          fontSize:'11px', fontFamily:'Space Mono,monospace',
          outline:'none', colorScheme:'dark', boxSizing:'border-box',
        }}
      />

      {/* Buttons row */}
      <div style={{ display:'flex', gap:6, marginTop:9 }}>
        <button onClick={handleNow} style={{
          flex:1,
          background: isNow ? 'rgba(120,200,160,0.12)' : 'rgba(140,175,216,0.10)',
          border: `1px solid ${isNow ? 'rgba(120,200,160,0.25)' : 'rgba(120,160,220,0.18)'}`,
          borderRadius:7, padding:'6px 0',
          color: isNow ? '#78c8a0' : '#a0bcd8',
          cursor:'pointer', fontSize:'11px', fontWeight:600,
          transition:'all 160ms',
        }}>Now</button>

        <div style={{ display:'flex', gap:4 }}>
          {[
            { fn:onZoomIn,    title:'Zoom in',   icon:<ZoomInIcon/> },
            { fn:onZoomOut,   title:'Zoom out',  icon:<ZoomOutIcon/> },
            { fn:onResetView, title:'Reset view', icon:<ResetIcon/> },
          ].map(({fn,title,icon},i)=>(
            <button key={i} onClick={fn} title={title} style={{
              width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(120,160,220,0.12)',
              borderRadius:6, cursor:'pointer', color:'#5878a0', transition:'all 140ms',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(120,160,220,0.10)';e.currentTarget.style.color='#a0bcd8';e.currentTarget.style.borderColor='rgba(120,160,220,0.22)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.color='#5878a0';e.currentTarget.style.borderColor='rgba(120,160,220,0.12)';}}
            >{icon}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const ZoomInIcon  = () => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 4v3M4 5.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 8.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const ZoomOutIcon = () => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 8.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const ResetIcon   = () => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6a4 4 0 0 1 7-2.65M10 2v3H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>);