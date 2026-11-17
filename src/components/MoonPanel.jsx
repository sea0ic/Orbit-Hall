import { useMemo, useRef, useEffect } from 'react';
import { getMoonData, getSkyDarkness, fmtTime } from '../utils/moonCalculations';

/**
 * Draws a realistic Moon phase disk on a canvas.
 * Uses the standard illumination/terminator approach.
 */
function drawMoonPhase(canvas, phaseAngle, illumination) {
  if (!canvas) return;
  const size = canvas.width;
  const ctx  = canvas.getContext('2d');
  const cx   = size / 2, cy = size / 2, r = size * 0.42;

  ctx.clearRect(0, 0, size, size);

  // Dark background of the Moon disk
  ctx.fillStyle = '#1a1c24';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // The lit portion — compute terminator shape
  // phase 0=new, 90=first quarter, 180=full, 270=last quarter
  const angle = phaseAngle;
  const norm  = angle / 180; // 0–2

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  if (illumination > 0.01) {
    // The lit side
    const litGrad = ctx.createRadialGradient(cx - r * 0.15, cy - r * 0.1, 0, cx, cy, r);
    litGrad.addColorStop(0,   '#f0eee0');
    litGrad.addColorStop(0.4, '#e0dcc8');
    litGrad.addColorStop(0.8, '#c8c4b0');
    litGrad.addColorStop(1.0, '#b0ac98');

    // Draw the lit half (right side for waxing, left for waning)
    ctx.fillStyle = litGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    // The terminator ellipse
    // x-axis of ellipse: cos(phaseAngle * PI/180) * r
    // If cos > 0: ellipse bulges right (waxing), dark on left
    // If cos < 0: ellipse bulges left (waning), dark on right
    const tCos = Math.cos((angle * Math.PI) / 180);

    ctx.fillStyle = Math.abs(tCos) < 0.02 ? 'transparent' : (tCos > 0 ? '#1a1c24' : litGrad);

    if (Math.abs(tCos) > 0.02) {
      ctx.beginPath();
      // Left semicircle
      ctx.arc(cx, cy, r, Math.PI / 2, -Math.PI / 2);
      // Ellipse on the terminator: semi-axes = (|cos| * r, r)
      const ex = Math.abs(tCos) * r;
      if (tCos > 0) {
        // Waxing: dark side is the left half covered by ellipse that leans left
        ctx.ellipse(cx, cy, ex, r, 0, -Math.PI / 2, Math.PI / 2, true);
      } else {
        // Waning: lit side is left half, dark covers right portion
        ctx.ellipse(cx, cy, ex, r, 0, Math.PI / 2, -Math.PI / 2, false);
      }
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();

  // Subtle crater texture (a few faint circles)
  const craters = [
    { x: cx + r*0.12, y: cy - r*0.18, r: r*0.07 },
    { x: cx - r*0.22, y: cy + r*0.28, r: r*0.09 },
    { x: cx + r*0.30, y: cy + r*0.14, r: r*0.05 },
    { x: cx - r*0.08, y: cy - r*0.32, r: r*0.06 },
    { x: cx + r*0.18, y: cy + r*0.34, r: r*0.04 },
  ];
  craters.forEach(c => {
    // Only draw on the lit part
    const isLit = illumination > 0.5 ||
      (phaseAngle < 180 && c.x > cx - r * 0.1) ||
      (phaseAngle >= 180 && c.x < cx + r * 0.1);
    if (!isLit) return;
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#80806060';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });

  // Soft limb darkening
  const limb = ctx.createRadialGradient(cx, cy, r * 0.55, cx, cy, r);
  limb.addColorStop(0, 'rgba(0,0,0,0)');
  limb.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = limb;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Thin border
  ctx.strokeStyle = 'rgba(200,200,180,0.12)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

export default function MoonPanel({ location, observingTime }) {
  const canvasRef = useRef(null);

  const lat  = location?.lat ?? 51.5;
  const lon  = location?.lon ?? 0;
  const date = observingTime || new Date();

  const moon     = useMemo(() => getMoonData(lat, lon, date), [lat, lon, date.toISOString().slice(0,13)]);
  const darkness = useMemo(() => getSkyDarkness(moon), [moon]);

  // Draw phase disk whenever moon data changes
  useEffect(() => {
    if (!moon || !canvasRef.current) return;
    drawMoonPhase(canvasRef.current, moon.phaseAngle, moon.illumination);
  }, [moon]);

  if (!moon) return null;

  const pct = Math.round(moon.illumination * 100);

  return (
    <div className="float-panel" style={{ minWidth: 180 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M8.5 5.5a4 4 0 1 1-4-4 3 3 0 0 0 4 4z" stroke="#7a90b0" strokeWidth="1.2" fill="none"/>
        </svg>
        <span style={{ color:'#7a90b0', fontSize:'10px', letterSpacing:'0.05em' }}>Moon</span>
        <span style={{
          marginLeft:'auto', fontSize:'10px', fontWeight:500,
          color: darkness.color,
        }}>● {darkness.label}</span>
      </div>

      {/* Phase disk + info */}
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <canvas
          ref={canvasRef}
          width={56} height={56}
          style={{ borderRadius:'50%', flexShrink:0 }}
        />
        <div style={{ flex:1 }}>
          <div style={{ color:'#e8edf5', fontSize:'14px', fontWeight:600 }}>
            {moon.phaseName}
          </div>
          <div style={{ color:'#a0bcd8', fontSize:'12px', fontFamily:'Space Mono, monospace', marginTop:2 }}>
            {pct}% lit
          </div>
          <div style={{ color:'#3d5070', fontSize:'10px', marginTop:3 }}>
            Day {Math.round(moon.ageDays)} of cycle
          </div>
        </div>
      </div>

      {/* Position + times */}
      <div style={{
        marginTop:10,
        display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:'6px 12px',
        paddingTop:10,
        borderTop:'1px solid rgba(120,160,220,0.08)',
      }}>
        <DataRow label="Altitude" value={`${moon.altitude > 0 ? '+' : ''}${moon.altitude.toFixed(1)}°`}
          highlight={moon.altitude > 0} />
        <DataRow label="Azimuth"  value={`${moon.azimuth.toFixed(1)}°`} />
        <DataRow label="Rises"    value={fmtTime(moon.riseTime)} />
        <DataRow label="Sets"     value={fmtTime(moon.setTime)} />
      </div>

      {/* Sky quality note */}
      <div style={{
        marginTop:10,
        background:'rgba(255,255,255,0.03)',
        border:'1px solid rgba(120,160,220,0.08)',
        borderRadius:5, padding:'6px 9px',
        color:'#5878a0', fontSize:'11px', lineHeight:1.5,
      }}>
        {darkness.description}
      </div>
    </div>
  );
}

function DataRow({ label, value, highlight }) {
  return (
    <div>
      <div style={{ color:'#3d5070', fontSize:'10px' }}>{label}</div>
      <div style={{
        color: highlight ? '#78c8a0' : '#e8edf5',
        fontSize:'11px', fontFamily:'Space Mono, monospace', marginTop:1,
      }}>{value}</div>
    </div>
  );
}