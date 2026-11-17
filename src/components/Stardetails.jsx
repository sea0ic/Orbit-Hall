export default function StarDetails({ star, onClose }) {
  if (!star) return null;

  const raH = Math.floor(star.ra);
  const raM = Math.floor((star.ra - raH) * 60);
  const raS = (((star.ra - raH) * 60 - raM) * 60).toFixed(1);

  const decSign = star.dec >= 0 ? '+' : '';
  const decD = Math.floor(Math.abs(star.dec));
  const decM = Math.floor((Math.abs(star.dec) - decD) * 60);
  const decS = (((Math.abs(star.dec) - decD) * 60 - decM) * 60).toFixed(0);

  const altStr = star.altitude !== undefined
    ? `${star.altitude >= 0 ? '+' : ''}${star.altitude.toFixed(1)}°`
    : null;
  const azStr = star.azimuth !== undefined
    ? `${star.azimuth.toFixed(1)}°`
    : null;

  return (
    <div
      className="float-panel"
      style={{
        minWidth: '180px',
        animation: 'panelIn 160ms ease',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            {/* Star icon */}
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 40%, #ffffff, #c8d8f8)',
              boxShadow: '0 0 8px rgba(200,220,255,0.4)',
              flexShrink: 0,
            }} />
            <div>
              <div style={{ color: '#e8edf5', fontSize: '15px', fontWeight: 600 }}>
                {star.name}
              </div>
              {star.constellation && (
                <div style={{ color: '#7a90b0', fontSize: '11px' }}>{star.constellation}</div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#3d5070', padding: '0', marginLeft: '8px',
            display: 'flex', alignItems: 'center',
            transition: 'color 160ms',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#7a90b0'}
          onMouseLeave={e => e.currentTarget.style.color = '#3d5070'}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Data grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 12px' }}>
        <DetailItem label="Magnitude" value={star.mag?.toFixed(2)} />
        {altStr && <DetailItem label="Altitude" value={altStr} highlight={star.altitude >= 0} />}
        <DetailItem
          label="RA"
          value={`${raH}h ${raM}m ${raS}s`}
          mono
        />
        {azStr && <DetailItem label="Azimuth" value={azStr} />}
        <DetailItem
          label="Dec"
          value={`${decSign}${decD}° ${decM}′ ${decS}″`}
          mono
        />
        {star.altitude !== undefined && star.altitude < 0 && (
          <div style={{ gridColumn: '1/-1', marginTop: '4px' }}>
            <div style={{
              background: 'rgba(180, 100, 80, 0.1)',
              border: '1px solid rgba(180,100,80,0.2)',
              borderRadius: '4px', padding: '5px 8px',
              color: '#c08070', fontSize: '11px',
            }}>
              Below horizon · not visible now
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes panelIn {
          from { opacity: 0; transform: scale(0.97) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function DetailItem({ label, value, mono, highlight }) {
  return (
    <div>
      <div style={{ color: '#3d5070', fontSize: '10px', marginBottom: '1px' }}>{label}</div>
      <div style={{
        color: highlight ? '#78c8a0' : '#e8edf5',
        fontSize: mono ? '10px' : '12px',
        fontFamily: mono ? 'Space Mono, monospace' : 'Inter, sans-serif',
        lineHeight: 1.3,
      }}>
        {value ?? '—'}
      </div>
    </div>
  );
}