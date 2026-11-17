import { useState, useEffect } from 'react';

const WMO = {
  0:'Clear sky', 1:'Mainly clear', 2:'Partly cloudy', 3:'Overcast',
  45:'Fog', 48:'Icy fog',
  51:'Light drizzle', 53:'Drizzle', 55:'Heavy drizzle',
  61:'Light rain', 63:'Rain', 65:'Heavy rain',
  71:'Light snow', 73:'Snow', 75:'Heavy snow',
  80:'Rain showers', 81:'Showers', 82:'Heavy showers',
  95:'Thunderstorm', 96:'Thunderstorm', 99:'Thunderstorm',
};

function seeingQuality(clouds) {
  if (clouds === undefined) return null;
  if (clouds < 20) return { label:'Excellent', color:'#78c8a0' };
  if (clouds < 40) return { label:'Good',      color:'#a0c878' };
  if (clouds < 70) return { label:'Fair',       color:'#c8c060' };
  return               { label:'Poor',      color:'#c87860' };
}

export default function WeatherPanel({ location }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!location?.lat || !location?.lon) return;
    setLoading(true); setError(''); setWeather(null);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,cloud_cover,weather_code,wind_speed_10m&wind_speed_unit=ms&timezone=auto`;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => {
        const c = d.current;
        setWeather({ temp:c.temperature_2m, humidity:c.relative_humidity_2m, clouds:c.cloud_cover, code:c.weather_code, wind:c.wind_speed_10m });
      })
      .catch(() => setError('Weather unavailable'))
      .finally(() => setLoading(false));
  }, [location?.lat, location?.lon]);

  const seeing = weather ? seeingQuality(weather.clouds) : null;

  return (
    <div className="float-panel">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 8.5a3 3 0 0 1 2.5-3H5A3.5 3.5 0 1 1 9.5 8.5H2z" stroke="#7a90b0" strokeWidth="1.2" fill="none"/>
        </svg>
        <span style={{ color:'#7a90b0', fontSize:'10px', letterSpacing:'0.06em', textTransform:'uppercase' }}>
          Conditions
        </span>
        {seeing && (
          <span style={{ marginLeft:'auto', fontSize:'10px', fontWeight:600, color:seeing.color,
            display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:seeing.color,
              boxShadow:`0 0 6px ${seeing.color}88`, display:'inline-block' }}/>
            {seeing.label}
          </span>
        )}
      </div>

      {!location && (
        <div style={{ color:'#2d3d50', fontSize:'11px' }}>Set a location above</div>
      )}
      {location && loading && (
        <div style={{ display:'flex', gap:8, alignItems:'center', padding:'4px 0' }}>
          <div className="spinner"/>
          <span style={{ color:'#3d5070', fontSize:'11px' }}>Fetching…</span>
        </div>
      )}
      {location && error && !loading && (
        <div style={{ color:'#906050', fontSize:'11px' }}>{error}</div>
      )}
      {weather && !loading && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'7px 14px' }}>
            <DataCell label="Temp"      value={`${weather.temp?.toFixed(0)}°C`} />
            <DataCell label="Clouds"    value={`${weather.clouds}%`} />
            <DataCell label="Humidity"  value={`${weather.humidity}%`} />
            <DataCell label="Wind"      value={`${weather.wind?.toFixed(1)} m/s`} />
          </div>
          {weather.code !== undefined && (
            <div style={{ marginTop:8, paddingTop:8, borderTop:'1px solid rgba(120,160,220,0.08)' }}>
              <DataCell label="Sky" value={WMO[weather.code] || 'Unknown'} />
            </div>
          )}
        </>
      )}

      <style>{`
        .spinner {
          width:10px; height:10px;
          border:1.5px solid rgba(120,160,220,0.15);
          border-top-color:#a0bcd8;
          border-radius:50%;
          animation:spin 0.65s linear infinite;
          flex-shrink:0;
        }
        @keyframes spin { to{ transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}

function DataCell({ label, value }) {
  return (
    <div>
      <div style={{ color:'#2d4055', fontSize:'10px', letterSpacing:'0.05em', marginBottom:2 }}>{label}</div>
      <div style={{ color:'#d0dce8', fontSize:'12px', fontFamily:'Space Mono,monospace' }}>{value}</div>
    </div>
  );
}