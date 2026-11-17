import { useState, useEffect } from 'react';
import { STAR_LORE } from '../data/starLore';
import { PLANET_LORE } from '../utils/planetCalculations';

// ─── Spectral class color map ─────────────────────────────────────────────────
function spectralColor(cls) {
  if (!cls) return '#e8edf5';
  const c = cls[0].toUpperCase();
  return { O:'#c0d0ff', B:'#d0e4ff', A:'#f0f4ff', F:'#fffaee', G:'#fff5d0', K:'#ffd890', M:'#ff9966', W:'#c0e8ff' }[c] || '#e8edf5';
}

function spectralLabel(cls) {
  if (!cls) return '';
  const c = cls[0].toUpperCase();
  return { O:'O — hot blue', B:'B — blue-white', A:'A — white', F:'F — yellow-white', G:'G — yellow', K:'K — orange', M:'M — red', W:'W — Wolf-Rayet' }[c] || cls;
}

// ─── Format helpers ────────────────────────────────────────────────────────────
function fmtRA(ra) {
  const h = Math.floor(ra);
  const mf = (ra - h) * 60; const m = Math.floor(mf);
  const s = ((mf - m) * 60).toFixed(1);
  return `${h}h ${m}m ${s}s`;
}
function fmtDec(dec) {
  const sign = dec >= 0 ? '+' : '−';
  const abs = Math.abs(dec);
  const d = Math.floor(abs); const mf = (abs - d) * 60; const m = Math.floor(mf);
  const s = ((mf - m) * 60).toFixed(0);
  return `${sign}${d}° ${m}′ ${s}″`;
}
function fmtDist(ly) {
  if (!ly) return '—';
  if (ly < 100) return `${ly.toFixed(1)} ly`;
  if (ly < 10000) return `${Math.round(ly).toLocaleString()} ly`;
  return `${(ly / 1000).toFixed(1)} kly`;
}
function sizeCompare(r) {
  if (!r) return null;
  if (r >= 500) return `${Math.round(r)}× the Sun — a hypergiant`;
  if (r >= 100) return `${Math.round(r)}× the Sun — a supergiant`;
  if (r >= 10)  return `${Math.round(r)}× the Sun — a giant`;
  if (r >= 1.5) return `${r.toFixed(1)}× the Sun`;
  if (r >= 0.8) return `Similar in size to the Sun`;
  return `${r.toFixed(2)}× the Sun — smaller than average`;
}
function lumCompare(l) {
  if (!l) return null;
  if (l >= 100000) return `${(l/1000).toFixed(0)}k× the Sun — extraordinarily luminous`;
  if (l >= 1000)   return `${Math.round(l).toLocaleString()}× the Sun`;
  if (l >= 10)     return `${Math.round(l)}× the Sun`;
  if (l >= 0.1)    return `${l.toFixed(2)}× the Sun`;
  return `${l.toFixed(3)}× the Sun`;
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = ['Overview', 'Science', 'Lore'];

// ─── Component ────────────────────────────────────────────────────────────────
export default function StarDetailsDrawer({ star, planet, onClose }) {
  const [tab, setTab] = useState('Overview');
  const [visible, setVisible] = useState(false);

  // Animate in
  useEffect(() => {
    if (star || planet) {
      setTab('Overview');
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [star, planet]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 220);
  };

  const obj = star || planet;
  if (!obj) return null;

  const isPlanet = !!planet;
  const lore = isPlanet ? PLANET_LORE[planet.id] : STAR_LORE[star?.id];
  const sColor = star ? spectralColor(star.spectral) : (planet?.color || '#e8edf5');
  const altOk = obj.altitude !== undefined && obj.altitude >= 0;

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(5, 9, 20, 0.94)',
          border: '1px solid rgba(120, 160, 220, 0.15)',
          borderBottom: 'none',
          borderRadius: '16px 16px 0 0',
          backdropFilter: 'blur(20px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
          boxShadow: '0 -8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1)',
          pointerEvents: 'auto',
          overflow: 'hidden',
        }}
      >
        {/* ── Drag handle ─────────────────────────────────────────────── */}
        <div style={{ display:'flex', justifyContent:'center', paddingTop:'10px' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'rgba(120,160,220,0.2)' }} />
        </div>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ padding:'14px 20px 0', display:'flex', alignItems:'flex-start', gap:14 }}>
          {/* Star/planet icon */}
          <div style={{
            width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
            background: isPlanet
              ? `radial-gradient(circle at 35% 35%, #ffffff, ${planet.color})`
              : `radial-gradient(circle at 35% 35%, #ffffff, ${sColor}88)`,
            boxShadow: `0 0 20px ${sColor}55, 0 0 40px ${sColor}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isPlanet ? '20px' : '10px',
          }}>
            {isPlanet ? planet.symbol : ''}
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <h2 style={{ margin:0, color:'#f0f4ff', fontSize:'20px', fontWeight:600, letterSpacing:'-0.01em' }}>
                {obj.name}
              </h2>
              {isPlanet && (
                <span style={{ fontSize:'11px', color: planet.color, background:`${planet.color}18`,
                  border:`1px solid ${planet.color}30`, borderRadius:4, padding:'1px 7px' }}>
                  Planet
                </span>
              )}
              {!isPlanet && star.spectral && (
                <span style={{ fontSize:'11px', color: sColor, background:`${sColor}18`,
                  border:`1px solid ${sColor}30`, borderRadius:4, padding:'1px 7px',
                  fontFamily:'Space Mono, monospace' }}>
                  {star.spectral}
                </span>
              )}
            </div>
            <div style={{ color:'#7a90b0', fontSize:'12px', marginTop:2 }}>
              {isPlanet ? 'Solar System · ' : (obj.constellation ? `${obj.constellation} · ` : '')}
              <span style={{ color: altOk ? '#78c8a0' : '#c07060' }}>
                {altOk ? '● Visible now' : '● Below horizon'}
              </span>
            </div>
          </div>

          <button onClick={handleClose} style={{
            background:'none', border:'none', cursor:'pointer',
            color:'#3d5070', padding:'4px', flexShrink:0,
            transition:'color 160ms',
          }}
            onMouseEnter={e=>e.currentTarget.style.color='#a0bcd8'}
            onMouseLeave={e=>e.currentTarget.style.color='#3d5070'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Quick stats bar ──────────────────────────────────────────── */}
        <div style={{
          display:'flex', gap:0,
          margin:'12px 20px 0',
          background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(120,160,220,0.1)',
          borderRadius:8, overflow:'hidden',
        }}>
          {[
            { label:'Magnitude', value: obj.mag !== undefined ? obj.mag.toFixed(2) : '—' },
            { label:'Altitude',  value: obj.altitude !== undefined ? `${obj.altitude > 0 ? '+' : ''}${obj.altitude.toFixed(1)}°` : '—' },
            { label:'Azimuth',   value: obj.azimuth !== undefined ? `${obj.azimuth.toFixed(1)}°` : '—' },
            ...(!isPlanet ? [{ label:'Distance', value: fmtDist(star?.dist) }] : []),
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              flex:1, padding:'8px 0', textAlign:'center',
              borderRight: i < arr.length - 1 ? '1px solid rgba(120,160,220,0.08)' : 'none',
            }}>
              <div style={{ color:'#3d5070', fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase' }}>{item.label}</div>
              <div style={{ color:'#e8edf5', fontSize:'13px', fontFamily:'Space Mono, monospace', marginTop:2 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div style={{ display:'flex', borderBottom:'1px solid rgba(120,160,220,0.1)', margin:'12px 20px 0', gap:2 }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background:'none', border:'none', cursor:'pointer',
                padding:'7px 14px 10px',
                color: tab === t ? '#a0bcd8' : '#3d5070',
                fontSize:'12px', fontWeight: tab === t ? 600 : 400,
                borderBottom: tab === t ? '2px solid #a0bcd8' : '2px solid transparent',
                marginBottom:'-1px',
                transition:'color 160ms',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Tab content ─────────────────────────────────────────────── */}
        <div style={{ padding:'14px 20px 24px', maxHeight:'38vh', overflowY:'auto' }}>
          {tab === 'Overview' && <OverviewTab obj={obj} star={star} isPlanet={isPlanet} sColor={sColor} />}
          {tab === 'Science'  && <ScienceTab  obj={obj} star={star} planet={planet} isPlanet={isPlanet} lore={lore} />}
          {tab === 'Lore'     && <LoreTab     lore={lore} obj={obj} />}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab({ obj, star, isPlanet, sColor }) {
  const rows = [];

  if (!isPlanet) {
    rows.push(
      { label:'Right Ascension', value: fmtRA(obj.ra), mono: true },
      { label:'Declination',     value: fmtDec(obj.dec), mono: true },
    );
    if (star?.spectral) rows.push({ label:'Spectral Type', value: spectralLabel(star.spectral), accent: sColor });
    if (star?.dist)     rows.push({ label:'Distance',      value: fmtDist(star.dist) });
    if (star?.radius)   rows.push({ label:'Size',          value: sizeCompare(star.radius) });
    if (star?.luminosity) rows.push({ label:'Luminosity',  value: lumCompare(star.luminosity) });
    if (star?.absMag !== undefined) rows.push({ label:'Absolute Magnitude', value: star.absMag?.toFixed(2), mono:true });
  } else {
    rows.push(
      { label:'Symbol',       value: obj.symbol },
      { label:'Approx. Magnitude', value: obj.mag?.toFixed(1), mono:true },
    );
    if (obj.distAU) rows.push({ label:'Distance from Earth', value:`${obj.distAU.toFixed(2)} AU` });
  }

  if (obj.altitude !== undefined) {
    rows.push({ label:'Altitude', value:`${obj.altitude > 0 ? '+' : ''}${obj.altitude.toFixed(2)}°`, mono:true });
    rows.push({ label:'Azimuth',  value:`${obj.azimuth.toFixed(2)}°`, mono:true });
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 20px' }}>
      {rows.map(r => (
        <div key={r.label}>
          <div style={{ color:'#3d5070', fontSize:'10px', letterSpacing:'0.06em', textTransform:'uppercase' }}>{r.label}</div>
          <div style={{
            color: r.accent || '#e8edf5',
            fontSize: r.mono ? '11px' : '13px',
            fontFamily: r.mono ? 'Space Mono, monospace' : 'Inter, sans-serif',
            marginTop:2, lineHeight:1.4,
          }}>{r.value || '—'}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Science ─────────────────────────────────────────────────────────────
function ScienceTab({ star, planet, isPlanet, lore }) {
  const text = lore?.science;
  const fact = lore?.fact;

  if (!text && !fact) {
    return (
      <div style={{ color:'#3d5070', fontSize:'13px', lineHeight:1.7 }}>
        Detailed science data is available for the brightest named stars. More entries are being added.
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {text && (
        <p style={{ margin:0, color:'#c8d8ec', fontSize:'13px', lineHeight:1.75 }}>{text}</p>
      )}
      {fact && (
        <div style={{
          background:'rgba(160,188,216,0.07)',
          border:'1px solid rgba(160,188,216,0.14)',
          borderLeft:'3px solid #a0bcd8',
          borderRadius:'0 6px 6px 0',
          padding:'10px 14px',
        }}>
          <div style={{ color:'#7a90b0', fontSize:'10px', letterSpacing:'0.1em', marginBottom:4 }}>QUICK FACT</div>
          <p style={{ margin:0, color:'#e8edf5', fontSize:'12px', lineHeight:1.65 }}>{fact}</p>
        </div>
      )}
      {!isPlanet && star && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          {[
            { label:'Mass', value: star.radius ? `~${(star.radius ** 1.5 * 0.5).toFixed(1)} M☉` : null },
            { label:'Temp', value: star.spectral ? spectralToTemp(star.spectral) : null },
            { label:'Age',  value: star.spectral ? spectralToAge(star.spectral) : null },
          ].filter(r => r.value).map(r => (
            <div key={r.label} style={{
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(120,160,220,0.1)',
              borderRadius:6, padding:'8px 10px', textAlign:'center',
            }}>
              <div style={{ color:'#3d5070', fontSize:'10px' }}>{r.label}</div>
              <div style={{ color:'#e8edf5', fontSize:'11px', fontFamily:'Space Mono, monospace', marginTop:2 }}>{r.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function spectralToTemp(cls) {
  const c = cls?.[0]?.toUpperCase();
  return { O:'>30,000 K', B:'10–30k K', A:'7.5–10k K', F:'6–7.5k K', G:'5.2–6k K', K:'3.7–5.2k K', M:'<3.7k K' }[c] || null;
}
function spectralToAge(cls) {
  const c = cls?.[0]?.toUpperCase();
  return { O:'<10 Myr', B:'10–500 Myr', A:'0.5–3 Gyr', F:'1–5 Gyr', G:'3–10 Gyr', K:'5–15 Gyr', M:'>10 Gyr' }[c] || null;
}

// ─── Tab: Lore ────────────────────────────────────────────────────────────────
function LoreTab({ lore, obj }) {
  if (!lore?.myth && !lore?.history) {
    return (
      <div style={{ color:'#3d5070', fontSize:'13px', lineHeight:1.7 }}>
        <p style={{ margin:'0 0 10px' }}>
          The name <em style={{ color:'#a0bcd8' }}>{obj.name}</em> has been carried across centuries of astronomical tradition.
        </p>
        <p style={{ margin:0 }}>
          Detailed mythological and historical notes are available for the brightest named stars. More are being added continuously.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      {lore.myth && (
        <div>
          <div style={{ color:'#7a90b0', fontSize:'10px', letterSpacing:'0.1em', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1l.8 2.5H8.5L6 5.2l.9 2.8L5 6.5 3.1 8l.9-2.8L1.5 3.5H4.2z" fill="#7a90b0"/>
            </svg>
            MYTHOLOGY & CULTURE
          </div>
          <p style={{ margin:0, color:'#c8d8ec', fontSize:'13px', lineHeight:1.78 }}>{lore.myth}</p>
        </div>
      )}
      {lore.history && (
        <div>
          <div style={{ color:'#7a90b0', fontSize:'10px', letterSpacing:'0.1em', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="3.5" stroke="#7a90b0" strokeWidth="1.2"/>
              <path d="M5 3v2.5l1.5 1" stroke="#7a90b0" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            DISCOVERY & HISTORY
          </div>
          <p style={{ margin:0, color:'#c8d8ec', fontSize:'13px', lineHeight:1.78 }}>{lore.history}</p>
        </div>
      )}
    </div>
  );
}