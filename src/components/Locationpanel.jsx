import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'nsj_location';

export default function LocationPanel({ location, onLocationChange }) {
  const [query,      setQuery]      = useState('');
  const [results,    setResults]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError,   setGeoError]   = useState('');
  const [expanded,   setExpanded]   = useState(false);
  const timeoutRef = useRef(null);
  const panelRef   = useRef(null);

  useEffect(() => {
    const h = e => { if (panelRef.current && !panelRef.current.contains(e.target)) { setExpanded(false); setResults([]); setQuery(''); }};
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const searchCity = q => {
    clearTimeout(timeoutRef.current);
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`);
        const d = await r.json();
        setResults(d.results || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 350);
  };

  const pick = r => {
    const loc = { name:`${r.name}${r.country_code?`, ${r.country_code}`:''}`, lat:r.latitude, lon:r.longitude };
    onLocationChange(loc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    setExpanded(false); setResults([]); setQuery('');
  };

  const geolocate = () => {
    setGeoError(''); setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude:lat, longitude:lon } = pos.coords;
      const loc = { name:`${lat.toFixed(3)}°, ${lon.toFixed(3)}°`, lat, lon };
      onLocationChange(loc);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
      setExpanded(false); setGeoLoading(false);
    }, err => {
      setGeoLoading(false);
      setGeoError(err.code===1?'Location access denied':err.code===2?'Position unavailable':'Request timed out');
    }, { timeout:8000 });
  };

  return (
    <div ref={panelRef} className="float-panel" style={{ width: expanded?212:undefined }}>
      {/* Trigger row */}
      <button onClick={()=>setExpanded(e=>!e)} style={{
        width:'100%', display:'flex', alignItems:'center', gap:8,
        background:'transparent', border:'none', cursor:'pointer', padding:0,
      }}>
        <div style={{
          width:24, height:24, borderRadius:6, flexShrink:0,
          background:'rgba(120,160,220,0.08)', border:'1px solid rgba(120,160,220,0.14)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="5.5" cy="4.5" r="1.8" stroke="#7a90b0" strokeWidth="1.1"/>
            <path d="M5.5 1C3.3 1 1.5 2.8 1.5 5c0 3 4 6 4 6s4-3 4-6c0-2.2-1.8-4-4-4z" stroke="#7a90b0" strokeWidth="1.1" fill="none"/>
          </svg>
        </div>
        <div style={{ flex:1, textAlign:'left', minWidth:0 }}>
          <div style={{ color:'#2d4055', fontSize:'10px', letterSpacing:'0.05em', textTransform:'uppercase' }}>Location</div>
          <div style={{ color:'#c8d8ec', fontSize:'12px', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1 }}>
            {location?.name || 'Set location'}
          </div>
        </div>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transform:expanded?'rotate(180deg)':'none', transition:'transform 160ms', flexShrink:0 }}>
          <path d="M2 4l3 3 3-3" stroke="#3d5070" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {location && (
        <div style={{ color:'#2d4055', fontSize:'10px', fontFamily:'Space Mono,monospace', marginTop:3 }}>
          {location.lat?.toFixed(2)}° {location.lon?.toFixed(2)}°
        </div>
      )}

      {expanded && (
        <div style={{ marginTop:11, animation:'fadeSlideDown 120ms ease' }}>
          <div style={{ position:'relative' }}>
            <input
              autoFocus type="text" value={query}
              onChange={e=>{ setQuery(e.target.value); searchCity(e.target.value); }}
              placeholder="Search city…"
              style={iStyle}
            />
            {loading && <div className="spinner" style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)' }}/>}
          </div>

          <button onClick={geolocate} disabled={geoLoading} style={{
            marginTop:7, width:'100%',
            display:'flex', alignItems:'center', gap:7,
            background:'rgba(120,160,220,0.07)', border:'1px solid rgba(120,160,220,0.14)',
            borderRadius:7, padding:'7px 10px',
            color: geoLoading?'#3d5070':'#a0bcd8', cursor:geoLoading?'default':'pointer',
            fontSize:'11px', fontFamily:'Inter,sans-serif',
            transition:'all 140ms',
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="5.5" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.1"/>
              <line x1="5.5" y1="1"   x2="5.5" y2="3"   stroke="currentColor" strokeWidth="1.1"/>
              <line x1="5.5" y1="8"   x2="5.5" y2="10"  stroke="currentColor" strokeWidth="1.1"/>
              <line x1="1"   y1="5.5" x2="3"   y2="5.5" stroke="currentColor" strokeWidth="1.1"/>
              <line x1="8"   y1="5.5" x2="10"  y2="5.5" stroke="currentColor" strokeWidth="1.1"/>
            </svg>
            {geoLoading ? 'Locating…' : 'Use my location'}
          </button>

          {geoError && <div style={{ color:'#b07060', fontSize:'11px', marginTop:6 }}>{geoError}</div>}

          {results.length > 0 && (
            <ul style={{ listStyle:'none', marginTop:7, borderRadius:7, overflow:'hidden',
              border:'1px solid rgba(120,160,220,0.12)' }}>
              {results.map((r,i)=>(
                <li key={r.id||i}>
                  <button
                    onMouseDown={e=>{e.preventDefault();pick(r);}}
                    style={{
                      width:'100%', textAlign:'left',
                      background:'rgba(4,8,18,0.9)', border:'none',
                      cursor:'pointer', padding:'8px 10px',
                      borderBottom:i<results.length-1?'1px solid rgba(120,160,220,0.08)':'none',
                      transition:'background 100ms',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(120,160,220,0.09)'}
                    onMouseLeave={e=>e.currentTarget.style.background='rgba(4,8,18,0.9)'}
                  >
                    <div style={{ color:'#d0dce8', fontSize:'12px' }}>
                      {r.name}{r.admin1?`, ${r.admin1}`:''}
                    </div>
                    <div style={{ color:'#3d5070', fontSize:'10px', fontFamily:'Space Mono,monospace', marginTop:1 }}>
                      {r.country} · {r.latitude?.toFixed(2)}°, {r.longitude?.toFixed(2)}°
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <style>{`
        .spinner {
          width:10px; height:10px;
          border:1.5px solid rgba(120,160,220,0.15);
          border-top-color:#a0bcd8;
          border-radius:50%;
          animation:spin 0.65s linear infinite;
        }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}

const iStyle = {
  width:'100%', background:'rgba(255,255,255,0.04)',
  border:'1px solid rgba(120,160,220,0.14)', borderRadius:7,
  padding:'7px 10px', color:'#e8edf5', fontSize:'12px',
  fontFamily:'Inter,sans-serif', outline:'none', boxSizing:'border-box',
};