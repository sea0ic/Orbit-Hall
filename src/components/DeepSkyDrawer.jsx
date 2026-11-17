import { useState, useEffect } from 'react';

const TYPE_META = {
  galaxy:           { label:'Galaxy',            color:'#c8a8e8', icon:'🌌' },
  nebula:           { label:'Nebula',             color:'#a8d8c8', icon:'🌫' },
  cluster_open:     { label:'Open Cluster',       color:'#e8d890', icon:'✦' },
  cluster_glob:     { label:'Globular Cluster',   color:'#f0c878', icon:'⊙' },
  supernova_remnant:{ label:'Supernova Remnant',  color:'#e89898', icon:'💥' },
  planetary_nebula: { label:'Planetary Nebula',   color:'#98d8f0', icon:'◎' },
};

function fmtDist(ly) {
  if (!ly) return '—';
  if (ly >= 1e9)  return `${(ly/1e9).toFixed(2)} Gly`;
  if (ly >= 1e6)  return `${(ly/1e6).toFixed(2)} Mly`;
  if (ly >= 1000) return `${Math.round(ly/1000).toLocaleString()} kly`;
  return `${Math.round(ly).toLocaleString()} ly`;
}

function fmtSize(arcmin) {
  if (!arcmin) return '—';
  if (arcmin >= 60) return `${(arcmin/60).toFixed(1)}°`;
  return `${arcmin}′`;
}

function fmtRA(ra) {
  const h=Math.floor(ra), mf=(ra-h)*60, m=Math.floor(mf), s=((mf-m)*60).toFixed(0);
  return `${h}h ${m}m ${s}s`;
}
function fmtDec(dec) {
  const sign=dec>=0?'+':'−', a=Math.abs(dec), d=Math.floor(a), mf=(a-d)*60, m=Math.floor(mf);
  return `${sign}${d}° ${m}′`;
}

export default function DeepSkyDrawer({ object: obj, onClose }) {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (obj) { setTab('overview'); requestAnimationFrame(() => setVisible(true)); }
    else setVisible(false);
  }, [obj]);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 220); };

  if (!obj) return null;
  const meta = TYPE_META[obj.type] || { label: obj.type, color:'#a0bcd8', icon:'✦' };

  return (
    <div onClick={e=>e.stopPropagation()} style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:300,
      display:'flex', justifyContent:'center', alignItems:'flex-end',
      pointerEvents:'none',
    }}>
      <div style={{
        width:'100%', maxWidth:560,
        background:'rgba(4,8,18,0.96)',
        border:'1px solid rgba(140,175,230,0.18)',
        borderBottom:'none', borderRadius:'16px 16px 0 0',
        backdropFilter:'blur(22px) saturate(1.5)',
        boxShadow:`
          0 0 0 1px rgba(160,188,216,0.05) inset,
          0 -12px 60px rgba(0,0,0,0.8),
          0 0 40px ${meta.color}08
        `,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition:'transform 220ms cubic-bezier(0.32,0.72,0,1)',
        pointerEvents:'auto',
        overflow:'hidden',
      }}>
        {/* Drag handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 0' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'rgba(120,160,220,0.18)' }}/>
        </div>

        {/* Header */}
        <div style={{
          padding:'14px 20px 0',
          display:'flex', alignItems:'flex-start', gap:14,
        }}>
          {/* Type icon */}
          <div style={{
            width:50, height:50, borderRadius:12, flexShrink:0,
            background:`${meta.color}12`,
            border:`1px solid ${meta.color}28`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:24,
            boxShadow:`0 0 24px ${meta.color}20`,
          }}>
            {meta.icon}
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <h2 style={{ margin:0, color:'#f0f4ff', fontSize:'19px', fontWeight:600, letterSpacing:'-0.01em' }}>
                {obj.name}
              </h2>
              <span style={{
                fontSize:'11px', color:meta.color,
                background:`${meta.color}14`,
                border:`1px solid ${meta.color}28`,
                borderRadius:4, padding:'1px 7px',
              }}>{meta.label}</span>
            </div>
            <div style={{ color:'#5878a0', fontSize:'12px', marginTop:3, display:'flex', gap:10, flexWrap:'wrap' }}>
              <span>{obj.id}</span>
              {obj.constellation && <span>· {obj.constellation}</span>}
              {obj.season && (
                <span style={{ color:'#a0bcd8' }}>
                  · Best: {obj.season}
                </span>
              )}
            </div>
          </div>

          <button onClick={handleClose} style={{
            background:'none', border:'none', cursor:'pointer',
            color:'#3d5070', padding:4, flexShrink:0,
            borderRadius:6, transition:'color 120ms, background 120ms',
          }}
            onMouseEnter={e=>{e.currentTarget.style.color='#a0bcd8';e.currentTarget.style.background='rgba(160,188,216,0.08)';}}
            onMouseLeave={e=>{e.currentTarget.style.color='#3d5070';e.currentTarget.style.background='none';}}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Stats bar */}
        <div style={{
          display:'flex', gap:0,
          margin:'12px 20px 0',
          background:'rgba(255,255,255,0.025)',
          border:'1px solid rgba(140,175,230,0.10)',
          borderRadius:8, overflow:'hidden',
        }}>
          {[
            { label:'Magnitude', value: obj.mag?.toFixed(1) ?? '—' },
            { label:'Distance',  value: fmtDist(obj.dist) },
            { label:'Size',      value: fmtSize(obj.size) },
            { label:'Altitude',  value: obj.altitude !== undefined ? `${obj.altitude > 0 ? '+' : ''}${obj.altitude.toFixed(0)}°` : '—' },
          ].map((s,i,arr) => (
            <div key={s.label} style={{
              flex:1, padding:'8px 0', textAlign:'center',
              borderRight: i<arr.length-1 ? '1px solid rgba(140,175,230,0.08)' : 'none',
            }}>
              <div style={{ color:'#2d4055', fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase' }}>{s.label}</div>
              <div style={{ color:'#d0dce8', fontSize:'12px', fontFamily:'Space Mono,monospace', marginTop:2 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid rgba(120,160,220,0.10)', margin:'12px 20px 0', gap:2 }}>
          {[['overview','Overview'],['coords','Coords'],['about','About']].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{
              background:'none', border:'none', cursor:'pointer',
              padding:'6px 14px 10px',
              color: tab===id ? '#a0bcd8' : '#3d5070',
              fontSize:'12px', fontWeight: tab===id ? 600 : 400,
              borderBottom: tab===id ? '2px solid #a0bcd8' : '2px solid transparent',
              marginBottom:'-1px', transition:'color 160ms',
            }}>{label}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding:'14px 20px 28px', maxHeight:'38vh', overflowY:'auto' }}>
          {tab==='overview' && <OverviewTab obj={obj} meta={meta}/>}
          {tab==='coords'   && <CoordsTab   obj={obj}/>}
          {tab==='about'    && <AboutTab     obj={obj} meta={meta}/>}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ obj, meta }) {
  const isVisible = obj.altitude !== undefined && obj.altitude > 0;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {/* Visibility status */}
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        background: isVisible ? 'rgba(100,190,130,0.07)' : 'rgba(160,80,60,0.07)',
        border:`1px solid ${isVisible ? 'rgba(100,190,130,0.18)' : 'rgba(160,80,60,0.18)'}`,
        borderRadius:8, padding:'9px 12px',
      }}>
        <span style={{
          width:8, height:8, borderRadius:'50%', flexShrink:0,
          background: isVisible ? '#78c8a0' : '#c87860',
          boxShadow:`0 0 8px ${isVisible ? '#78c8a0' : '#c87860'}88`,
        }}/>
        <div>
          <div style={{ color: isVisible ? '#78c8a0' : '#c87860', fontSize:'12px', fontWeight:600 }}>
            {isVisible ? 'Visible now' : 'Below horizon'}
          </div>
          <div style={{ color:'#3d5070', fontSize:'11px', marginTop:1 }}>
            {isVisible
              ? `Altitude ${obj.altitude?.toFixed(1)}° · Azimuth ${obj.azimuth?.toFixed(1)}°`
              : `Best season: ${obj.season || 'check star charts'}`}
          </div>
        </div>
      </div>

      {/* Type description */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 16px' }}>
        <Cell label="Object Type" value={meta.label} accent={meta.color}/>
        <Cell label="Magnitude"   value={obj.mag?.toFixed(1) ?? '—'}/>
        <Cell label="Distance"    value={fmtDist(obj.dist)}/>
        <Cell label="App. Size"   value={fmtSize(obj.size)}/>
        <Cell label="Constellation" value={obj.constellation || '—'}/>
        <Cell label="Best Season" value={obj.season || '—'}/>
      </div>

      {/* Observing tip */}
      <div style={{
        background:'rgba(160,188,216,0.05)',
        border:'1px solid rgba(160,188,216,0.12)',
        borderLeft:`3px solid ${meta.color}`,
        borderRadius:'0 8px 8px 0', padding:'9px 12px',
      }}>
        <div style={{ color:'#5878a0', fontSize:'10px', letterSpacing:'0.08em', marginBottom:4 }}>OBSERVING TIP</div>
        <div style={{ color:'#b8cce0', fontSize:'12px', lineHeight:1.65 }}>
          {getObservingTip(obj.type, obj.mag)}
        </div>
      </div>
    </div>
  );
}

function CoordsTab({ obj }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 16px' }}>
      <Cell label="Right Ascension" value={fmtRA(obj.ra)} mono/>
      <Cell label="Declination"     value={fmtDec(obj.dec)} mono/>
      <Cell label="Altitude"        value={obj.altitude !== undefined ? `${obj.altitude > 0?'+':''}${obj.altitude.toFixed(2)}°` : '—'} mono highlight={obj.altitude>0}/>
      <Cell label="Azimuth"         value={obj.azimuth !== undefined ? `${obj.azimuth.toFixed(2)}°` : '—'} mono/>
      <Cell label="Distance"        value={fmtDist(obj.dist)} mono/>
      <Cell label="App. Size"       value={fmtSize(obj.size)} mono/>
      <Cell label="Magnitude"       value={obj.mag?.toFixed(2) ?? '—'} mono/>
      <Cell label="Catalog ID"      value={obj.id} mono/>
    </div>
  );
}

function AboutTab({ obj, meta }) {
  if (!obj.desc) return (
    <p style={{ color:'#3d5070', fontSize:'13px', lineHeight:1.7, margin:0 }}>
      No description available for this object.
    </p>
  );
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <p style={{ margin:0, color:'#c0d0e4', fontSize:'13px', lineHeight:1.8 }}>{obj.desc}</p>
      <div style={{
        background:`${meta.color}08`,
        border:`1px solid ${meta.color}18`,
        borderRadius:8, padding:'10px 13px',
        display:'flex', gap:10, alignItems:'flex-start',
      }}>
        <span style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{meta.icon}</span>
        <div>
          <div style={{ color:meta.color, fontSize:'11px', fontWeight:600, marginBottom:3 }}>
            {meta.label} · {obj.id}
          </div>
          <div style={{ color:'#5878a0', fontSize:'11px', lineHeight:1.6 }}>
            {fmtDist(obj.dist)} away · {fmtSize(obj.size)} apparent size · Magnitude {obj.mag?.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value, mono, accent, highlight }) {
  return (
    <div>
      <div style={{ color:'#2d4055', fontSize:'10px', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:2 }}>
        {label}
      </div>
      <div style={{
        color: accent || (highlight ? '#78c8a0' : '#d0dce8'),
        fontSize: mono ? '11px' : '13px',
        fontFamily: mono ? 'Space Mono,monospace' : 'Inter,sans-serif',
        lineHeight:1.4,
      }}>
        {value || '—'}
      </div>
    </div>
  );
}

function getObservingTip(type, mag) {
  if (type==='galaxy') {
    if (mag < 8.5) return 'Visible in binoculars from dark skies. A small telescope will reveal its shape. Light pollution is this object\'s worst enemy — drive away from city lights for best results.';
    return 'Requires a telescope and dark skies. Use low magnification to keep the surface brightness high. Avoid nights near full Moon.';
  }
  if (type==='nebula') return 'Use a wide-field eyepiece for the best view. A nebula filter (UHC or OIII) will dramatically improve contrast from light-polluted areas.';
  if (type==='cluster_open') return 'Open clusters are excellent binocular targets and reward low magnification. Look for color contrasts between member stars.';
  if (type==='cluster_glob') {
    if (mag < 7) return 'Visible to the naked eye as a fuzzy star. Through a telescope, you\'ll see individual stars popping in and out of resolution — a mesmerizing sight.';
    return 'Use medium to high magnification to resolve individual stars toward the edges. The compressed core will look like a ball of light.';
  }
  if (type==='supernova_remnant') return 'Supernova remnants are faint and benefit enormously from a UHC or OIII nebula filter. Dark skies and transparency are critical.';
  if (type==='planetary_nebula') return 'At high magnification, look for the disk shape that distinguishes a planetary nebula from a star. An OIII filter greatly improves contrast.';
  return 'Use appropriate magnification for the object\'s apparent size. Dark adapted eyes and dark skies will make a significant difference.';
}