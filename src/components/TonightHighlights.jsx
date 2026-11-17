import { useState, useMemo, useEffect } from 'react';
import { computeHighlights } from '../utils/highlightsCalculations';

export default function TonightHighlights({ location, observingTime, onSelectStar, onSelectPlanet }) {
  const [modalOpen, setModalOpen] = useState(false);

  const lat  = location?.lat ?? 51.5;
  const lon  = location?.lon ?? 0;
  const date = observingTime || new Date();

  const highlights = useMemo(() => {
    try { return computeHighlights(lat, lon, date); }
    catch(e) { console.warn('Highlights:', e?.message); return []; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, Math.floor(date.getTime() / 60000)]);

  // Close on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const h = e => { if (e.key === 'Escape') setModalOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [modalOpen]);

  const moonItem = highlights.find(h => h.type === 'moon');

  const handleSelect = (item) => {
    if (item.type === 'star'   && onSelectStar)    onSelectStar(item.data);
    if (item.type === 'planet' && onSelectPlanet)  onSelectPlanet(item.data);
    setModalOpen(false);
  };

  return (
    <>
      {/* ── Trigger button ───────────────────────────────────────────── */}
      <button
        onClick={() => setModalOpen(true)}
        title="Tonight's Sky"
        style={{
          height: 36, borderRadius: 8,
          background: 'rgba(5,9,20,0.82)',
          border: '1px solid rgba(120,160,220,0.18)',
          backdropFilter: 'blur(14px)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '0 14px',
          color: '#7a90b0',
          fontSize: '12px', fontWeight: 500,
          transition: 'all 180ms',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(10,18,36,0.92)';
          e.currentTarget.style.borderColor = 'rgba(160,188,216,0.32)';
          e.currentTarget.style.color = '#a0bcd8';
          e.currentTarget.style.boxShadow = '0 0 18px rgba(160,188,216,0.1), 0 2px 12px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(5,9,20,0.82)';
          e.currentTarget.style.borderColor = 'rgba(120,160,220,0.18)';
          e.currentTarget.style.color = '#7a90b0';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.4)';
        }}
      >
        <span style={{ fontSize: 15 }}>{moonItem ? moonItem.icon : '✦'}</span>
        <span>Tonight's Sky</span>
        {highlights.length > 0 && (
          <span style={{
            background: 'rgba(160,188,216,0.12)',
            border: '1px solid rgba(160,188,216,0.18)',
            borderRadius: 10, padding: '1px 6px',
            fontSize: '10px', color: '#a0bcd8',
          }}>
            {highlights.length}
          </span>
        )}
      </button>

      {/* ── Full-screen modal overlay ────────────────────────────────── */}
      {modalOpen && (
        <HighlightsModal
          highlights={highlights}
          moonItem={moonItem}
          date={date}
          onSelect={handleSelect}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function HighlightsModal({ highlights, moonItem, date, onSelect, onClose }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: 'rgba(2,4,12,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'overlayIn 160ms ease',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 560,
        /* Square-ish: fixed aspect ratio via min/max height */
        minHeight: 460, maxHeight: '80vh',
        background: 'rgba(4,8,18,0.97)',
        border: '1px solid rgba(120,160,220,0.2)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: `
          0 0 0 1px rgba(160,188,216,0.06) inset,
          0 32px 80px rgba(0,0,0,0.85),
          0 0 60px rgba(100,140,220,0.06)
        `,
        display: 'flex', flexDirection: 'column',
        animation: 'modalIn 180ms cubic-bezier(0.32,0.72,0,1)',
      }}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <div style={{
          padding: '18px 22px 14px',
          borderBottom: '1px solid rgba(120,160,220,0.1)',
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.018)',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'rgba(160,188,216,0.08)',
            border: '1px solid rgba(160,188,216,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            {moonItem ? moonItem.icon : '✦'}
          </div>
          <div>
            <div style={{ color: '#e8edf5', fontSize: '16px', fontWeight: 600 }}>Tonight's Sky</div>
            <div style={{ color: '#3d5070', fontSize: '11px', fontFamily: 'Space Mono,monospace', marginTop: 1 }}>
              {date.toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' })}
              {' · '}
              {date.toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' })}
            </div>
          </div>
          <button onClick={onClose} style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            cursor: 'pointer', color: '#3d5070', padding: 4,
            borderRadius: 6, transition: 'color 120ms, background 120ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.color='#a0bcd8'; e.currentTarget.style.background='rgba(160,188,216,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='#3d5070'; e.currentTarget.style.background='none'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Sky quality banner ───────────────────────────────────── */}
        {moonItem && (
          <div style={{
            padding: '10px 22px',
            background: 'rgba(255,255,255,0.012)',
            borderBottom: '1px solid rgba(120,160,220,0.07)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: getSkyColor(moonItem),
              boxShadow: `0 0 8px ${getSkyColor(moonItem)}88`,
              flexShrink: 0,
            }} />
            <span style={{ color: getSkyColor(moonItem), fontSize: '12px', fontWeight: 500 }}>
              {getSkyLabel(moonItem)}
            </span>
            <span style={{ color: '#3d5070', fontSize: '11px' }}>
              {moonItem.skyNote}
            </span>
          </div>
        )}

        {/* ── Grid of highlight cards ──────────────────────────────── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '14px 16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: 10,
          alignContent: 'start',
        }}>
          {highlights.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#3d5070',
              fontSize: '13px', padding: '40px 0' }}>
              No highlights computed. Check your location setting.
            </div>
          )}
          {highlights.map((item, i) => (
            <HighlightCard key={i} item={item} onSelect={onSelect} />
          ))}
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div style={{
          padding: '10px 22px',
          borderTop: '1px solid rgba(120,160,220,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ color: '#2d3d50', fontSize: '11px' }}>
            Click a star or planet card to navigate the sky
          </span>
          <button onClick={onClose} style={{
            background: 'rgba(160,188,216,0.08)',
            border: '1px solid rgba(160,188,216,0.15)',
            borderRadius: 6, padding: '5px 14px',
            color: '#7a90b0', cursor: 'pointer', fontSize: '12px',
            transition: 'all 140ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(160,188,216,0.15)'; e.currentTarget.style.color='#a0bcd8'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(160,188,216,0.08)'; e.currentTarget.style.color='#7a90b0'; }}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}

// ── Single highlight card ──────────────────────────────────────────────────────
function HighlightCard({ item, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const interactive = item.type === 'star' || item.type === 'planet';

  return (
    <div
      onClick={interactive ? () => onSelect(item) : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && interactive
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered && interactive
          ? `${item.color}40`
          : 'rgba(120,160,220,0.1)'}`,
        borderRadius: 10,
        padding: '13px 14px',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all 160ms',
        display: 'flex', flexDirection: 'column', gap: 8,
        boxShadow: hovered && interactive
          ? `0 0 20px ${item.color}18, inset 0 1px 0 rgba(255,255,255,0.04)`
          : 'inset 0 1px 0 rgba(255,255,255,0.02)',
      }}
    >
      {/* Top row: icon + type badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: `${item.color}12`,
          border: `1px solid ${item.color}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: item.type === 'moon' ? 20 : item.type === 'planet' ? 16 : 13,
          color: item.color,
        }}>
          {item.icon}
        </div>
        <span style={{
          fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: item.color, background: `${item.color}12`,
          border: `1px solid ${item.color}22`,
          borderRadius: 4, padding: '2px 6px',
        }}>
          {TYPE_LABELS[item.type] || item.type}
        </span>
      </div>

      {/* Title + subtitle */}
      <div>
        <div style={{ color: '#e8edf5', fontSize: '14px', fontWeight: 600, lineHeight: 1.3 }}>
          {item.title}
        </div>
        <div style={{ color: item.color, fontSize: '11px', marginTop: 3, opacity: 0.85 }}>
          {item.subtitle}
        </div>
      </div>

      {/* Detail */}
      <div style={{
        color: '#3d5070', fontSize: '10px',
        fontFamily: 'Space Mono, monospace',
        lineHeight: 1.6, marginTop: 'auto',
        paddingTop: 6,
        borderTop: '1px solid rgba(120,160,220,0.07)',
      }}>
        {item.detail}
      </div>

      {/* Navigate hint */}
      {interactive && (
        <div style={{
          color: '#3d5878', fontSize: '10px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 140ms',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 4h6M5 2l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Navigate to {item.title}
        </div>
      )}
    </div>
  );
}

const TYPE_LABELS = { moon:'Moon', planet:'Planet', star:'Star', constellation:'Const.', condition:'Sky' };

function getSkyColor(moonItem) {
  const pct = moonItem?.data?.illumination * 100 || 0;
  const visible = moonItem?.data?.isVisible;
  if (!visible) return '#78c8a0';
  if (pct < 15)  return '#a0d890';
  if (pct < 40)  return '#c8d870';
  if (pct < 70)  return '#d8b860';
  return '#c87860';
}
function getSkyLabel(moonItem) {
  const pct = moonItem?.data?.illumination * 100 || 0;
  const visible = moonItem?.data?.isVisible;
  if (!visible) return 'Excellent seeing';
  if (pct < 15)  return 'Very good seeing';
  if (pct < 40)  return 'Good seeing';
  if (pct < 70)  return 'Fair seeing';
  return 'Poor seeing';
}