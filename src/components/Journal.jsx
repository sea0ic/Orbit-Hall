import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'nsj_journal_entries';

function loadEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveEntries(e) { localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); }
function fmtDate(iso) { return new Date(iso).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}); }
function fmtTime(iso) { return new Date(iso).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'}); }

export default function Journal({ location, observingTime }) {
  const [open, setOpen]           = useState(false);
  const [entries, setEntries]     = useState(loadEntries);
  const [view, setView]           = useState('list');
  const [activeEntry, setActive]  = useState(null);
  const [draft, setDraft]         = useState({ title:'', body:'', tags:'' });
  const [search, setSearch]       = useState('');
  const textRef = useRef(null);

  useEffect(() => { if (view==='new' && textRef.current) textRef.current.focus(); }, [view]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const h = e => { if (!e.target.closest('[data-journal]')) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const saveEntry = () => {
    if (!draft.title.trim() && !draft.body.trim()) return;
    const entry = {
      id: Date.now().toString(),
      title: draft.title.trim() || 'Untitled observation',
      body: draft.body.trim(),
      tags: draft.tags.split(',').map(t=>t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      location: location?.name || null,
      observingTime: observingTime?.toISOString() || null,
    };
    const updated = [entry, ...entries];
    setEntries(updated); saveEntries(updated);
    setDraft({title:'',body:'',tags:''});
    setActive(entry); setView('read');
  };

  const deleteEntry = id => {
    const updated = entries.filter(e=>e.id!==id);
    setEntries(updated); saveEntries(updated);
    if (activeEntry?.id===id) { setActive(null); setView('list'); }
  };

  const filtered = entries.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.body.toLowerCase().includes(search.toLowerCase()) ||
    e.tags.some(t=>t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div data-journal style={{ position:'relative' }}>
      {/* ── Toggle button ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o=>!o)}
        title="Observatory Journal"
        style={{
          width: 42, height: 42,
          borderRadius: '50%',
          background: open
            ? 'rgba(160,188,216,0.14)'
            : 'rgba(4,8,18,0.88)',
          border: `1px solid ${open
            ? 'rgba(160,188,216,0.35)'
            : 'rgba(140,175,230,0.18)'}`,
          backdropFilter: 'blur(14px)',
          cursor: 'pointer',
          display: 'flex', alignItems:'center', justifyContent:'center',
          color: open ? '#a0bcd8' : '#5878a0',
          transition: 'all 180ms',
          boxShadow: open
            ? '0 0 20px rgba(160,188,216,0.18), 0 4px 16px rgba(0,0,0,0.5)'
            : '0 0 0 1px rgba(80,120,200,0.08), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(180,210,255,0.06)',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(160,188,216,0.32)';
          e.currentTarget.style.color = '#a0bcd8';
          e.currentTarget.style.boxShadow = '0 0 22px rgba(160,188,216,0.16), 0 4px 16px rgba(0,0,0,0.55)';
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.borderColor = 'rgba(140,175,230,0.18)';
            e.currentTarget.style.color = '#5878a0';
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(80,120,200,0.08), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(180,210,255,0.06)';
          }
        }}
      >
        <JournalIcon size={20} />
      </button>

      {/* ── Panel ─────────────────────────────────────────────────── */}
      {open && (
        <div style={{
          position: 'absolute',
          bottom: 50, right: 0,
          width: 318,
          background: 'rgba(4,8,18,0.96)',
          border: '1px solid rgba(140,175,230,0.18)',
          borderRadius: 14,
          backdropFilter: 'blur(22px) saturate(1.6)',
          boxShadow: `
            0 0 0 1px rgba(80,120,200,0.10),
            0 0 32px rgba(80,120,200,0.08),
            0 -8px 48px rgba(0,0,0,0.75),
            inset 0 1px 0 rgba(180,210,255,0.07)
          `,
          overflow: 'hidden',
          animation: 'panelUp 160ms cubic-bezier(0.32,0.72,0,1)',
          zIndex: 200,
        }}>

          {/* Header */}
          <div style={{
            padding: '13px 15px 11px',
            borderBottom: '1px solid rgba(120,160,220,0.10)',
            display: 'flex', alignItems: 'center', gap: 9,
            background: 'rgba(255,255,255,0.018)',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(160,188,216,0.08)',
              border: '1px solid rgba(160,188,216,0.16)',
              display: 'flex', alignItems:'center', justifyContent:'center',
              flexShrink: 0,
            }}>
              <JournalIcon size={14} color="#7a90b0" />
            </div>
            <div>
              <div style={{ color:'#c8d8f0', fontSize:'12px', fontWeight:600, letterSpacing:'0.03em' }}>
                Observatory Journal
              </div>
              <div style={{ color:'#3d5070', fontSize:'10px', marginTop:1 }}>
                {entries.length} {entries.length===1?'entry':'entries'} saved
              </div>
            </div>
            <button
              onClick={()=>{ setDraft({title:'',body:'',tags:''}); setView('new'); }}
              style={{
                marginLeft:'auto',
                background:'rgba(160,188,216,0.10)',
                border:'1px solid rgba(160,188,216,0.20)',
                borderRadius:6, padding:'4px 10px',
                color:'#a0bcd8', cursor:'pointer',
                fontSize:'11px', fontWeight:600,
                transition:'all 130ms',
                display:'flex', alignItems:'center', gap:5,
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(160,188,216,0.18)';e.currentTarget.style.borderColor='rgba(160,188,216,0.30)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(160,188,216,0.10)';e.currentTarget.style.borderColor='rgba(160,188,216,0.20)';}}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M4.5 1v7M1 4.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              New
            </button>
          </div>

          {/* Content */}
          <div style={{ maxHeight: 430, overflowY:'auto' }}>

            {/* New entry form */}
            {view==='new' && (
              <div style={{ padding:14, display:'flex', flexDirection:'column', gap:10 }}>
                <input
                  placeholder="Entry title…"
                  value={draft.title}
                  onChange={e=>setDraft(d=>({...d,title:e.target.value}))}
                  style={iStyle}
                />
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                  {location?.name && <Chip>{location.name}</Chip>}
                  {observingTime && <Chip>{fmtDate(observingTime.toISOString())} · {fmtTime(observingTime.toISOString())}</Chip>}
                </div>
                <textarea
                  ref={textRef}
                  placeholder="What did you observe tonight?&#10;Record what you saw, sky conditions, thoughts…"
                  value={draft.body}
                  onChange={e=>setDraft(d=>({...d,body:e.target.value}))}
                  rows={6}
                  style={{...iStyle, resize:'vertical', lineHeight:1.7}}
                />
                <input
                  placeholder="Tags: meteor, iss, deep-sky, planets…"
                  value={draft.tags}
                  onChange={e=>setDraft(d=>({...d,tags:e.target.value}))}
                  style={{...iStyle, fontSize:'11px'}}
                />
                <div style={{ display:'flex', gap:7 }}>
                  <button onClick={saveEntry} style={primaryBtn}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Save Entry
                  </button>
                  <button onClick={()=>setView('list')} style={ghostBtn}>Cancel</button>
                </div>
              </div>
            )}

            {/* Read single entry */}
            {view==='read' && activeEntry && (
              <div style={{ padding:14 }}>
                <button onClick={()=>setView('list')} style={{
                  ...ghostBtn, marginBottom:12, padding:'3px 9px',
                  fontSize:'11px', display:'flex', alignItems:'center', gap:5,
                }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M6 1.5L2.5 4.5 6 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  All entries
                </button>

                <h3 style={{ margin:'0 0 7px', color:'#e8edf5', fontSize:'15px', fontWeight:600, lineHeight:1.3 }}>
                  {activeEntry.title}
                </h3>
                <div style={{ display:'flex', gap:10, marginBottom:10, flexWrap:'wrap' }}>
                  <Meta>{fmtDate(activeEntry.createdAt)}</Meta>
                  <Meta>{fmtTime(activeEntry.createdAt)}</Meta>
                  {activeEntry.location && <Meta>📍 {activeEntry.location}</Meta>}
                </div>
                {activeEntry.tags?.length>0 && (
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
                    {activeEntry.tags.map(t=><Chip key={t}>{t}</Chip>)}
                  </div>
                )}
                <p style={{ margin:'0 0 16px', color:'#b8cce0', fontSize:'13px', lineHeight:1.8, whiteSpace:'pre-wrap' }}>
                  {activeEntry.body || <span style={{color:'#3d5070',fontStyle:'italic'}}>No notes written.</span>}
                </p>
                <button onClick={()=>deleteEntry(activeEntry.id)} style={{
                  ...ghostBtn, color:'#b06860', borderColor:'rgba(160,90,80,0.22)',
                  fontSize:'11px', padding:'4px 10px',
                  display:'flex', alignItems:'center', gap:5,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 3h7M4 1.5h2M3 3l.5 5.5h3L7 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                  Delete entry
                </button>
              </div>
            )}

            {/* Entry list */}
            {view==='list' && (
              <div>
                {entries.length > 2 && (
                  <div style={{ padding:'10px 14px 6px' }}>
                    <input
                      placeholder="Search entries…"
                      value={search}
                      onChange={e=>setSearch(e.target.value)}
                      style={{...iStyle, fontSize:'12px'}}
                    />
                  </div>
                )}
                {filtered.length===0 && (
                  <div style={{ padding:'32px 14px', textAlign:'center' }}>
                    {entries.length===0 ? (
                      <>
                        <EmptyState />
                        <div style={{ color:'#3d5070', fontSize:'12px', lineHeight:1.7, marginTop:10 }}>
                          Your journal is empty.<br/>
                          Tap <strong style={{color:'#5878a0'}}>New</strong> to log your first observation.
                        </div>
                      </>
                    ) : (
                      <div style={{ color:'#3d5070', fontSize:'12px' }}>No entries match your search.</div>
                    )}
                  </div>
                )}
                {filtered.map((entry,i)=>(
                  <button
                    key={entry.id}
                    onClick={()=>{ setActive(entry); setView('read'); }}
                    style={{
                      width:'100%', textAlign:'left', background:'transparent',
                      border:'none',
                      borderTop: i===0 ? 'none' : '1px solid rgba(120,160,220,0.07)',
                      padding:'11px 14px', cursor:'pointer',
                      transition:'background 100ms',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(120,160,220,0.05)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                      <div style={{
                        width:6, height:6, borderRadius:'50%', flexShrink:0, marginTop:5,
                        background:'rgba(140,175,220,0.4)',
                      }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ color:'#d8e4f0', fontSize:'13px', fontWeight:500,
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {entry.title}
                        </div>
                        <div style={{ color:'#3d5070', fontSize:'11px', marginTop:2,
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {entry.body || 'No notes'}
                        </div>
                      </div>
                      <div style={{ color:'#2a3a50', fontSize:'10px',
                        fontFamily:'Space Mono,monospace', flexShrink:0, textAlign:'right', lineHeight:1.5 }}>
                        <div>{fmtDate(entry.createdAt)}</div>
                        {entry.tags?.length>0 && (
                          <div style={{ color:'#2d4060' }}>{entry.tags.slice(0,2).join(', ')}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes panelUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Journal icon SVG ─────────────────────────────────────────────────────── */
function JournalIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      {/* Book body */}
      <rect x="4" y="2" width="13" height="18" rx="2" stroke={color} strokeWidth="1.4"/>
      {/* Spine */}
      <line x1="7" y1="2" x2="7" y2="20" stroke={color} strokeWidth="1.4"/>
      {/* Lines */}
      <line x1="9.5" y1="7"  x2="14.5" y2="7"  stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="9.5" y1="10" x2="14.5" y2="10" stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="9.5" y1="13" x2="13"   y2="13" stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
      {/* Star accent */}
      <circle cx="16.5" cy="16.5" r="3" fill={color} opacity="0.18"/>
      <path d="M16.5 14.2l.4 1.2h1.3l-1.05.76.4 1.24-1.05-.76-1.05.76.4-1.24L14.8 15.4h1.3z"
        fill={color} opacity="0.8"/>
    </svg>
  );
}

/* ── Shared styles ─────────────────────────────────────────────────────────── */
const iStyle = {
  width:'100%', background:'rgba(255,255,255,0.04)',
  border:'1px solid rgba(120,160,220,0.14)',
  borderRadius:7, padding:'7px 10px',
  color:'#e8edf5', fontSize:'13px',
  fontFamily:'Inter,sans-serif', outline:'none',
  boxSizing:'border-box', transition:'border-color 160ms',
};
const primaryBtn = {
  flex:1, background:'rgba(140,175,216,0.12)',
  border:'1px solid rgba(140,175,216,0.24)',
  borderRadius:7, padding:'8px 0',
  color:'#a0bcd8', cursor:'pointer',
  fontSize:'12px', fontWeight:600,
  display:'flex', alignItems:'center', justifyContent:'center', gap:6,
  transition:'all 130ms',
};
const ghostBtn = {
  background:'transparent',
  border:'1px solid rgba(120,160,220,0.13)',
  borderRadius:7, padding:'8px 14px',
  color:'#5878a0', cursor:'pointer',
  fontSize:'12px', transition:'all 130ms',
};
const Chip = ({children}) => (
  <span style={{
    background:'rgba(120,160,220,0.09)',
    border:'1px solid rgba(120,160,220,0.17)',
    borderRadius:4, padding:'2px 8px',
    color:'#7a90b0', fontSize:'10px',
    fontFamily:'Space Mono,monospace',
  }}>{children}</span>
);
const Meta = ({children}) => (
  <span style={{ color:'#3d5070', fontSize:'10px', fontFamily:'Space Mono,monospace' }}>{children}</span>
);

function EmptyState() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity:0.25, margin:'0 auto', display:'block' }}>
      <rect x="8" y="6" width="28" height="36" rx="4" stroke="#a0bcd8" strokeWidth="1.8"/>
      <line x1="14" y1="6" x2="14" y2="42" stroke="#a0bcd8" strokeWidth="1.8"/>
      <line x1="19" y1="16" x2="30" y2="16" stroke="#a0bcd8" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="19" y1="21" x2="30" y2="21" stroke="#a0bcd8" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="19" y1="26" x2="26" y2="26" stroke="#a0bcd8" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="35" cy="35" r="7" fill="none" stroke="#a0bcd8" strokeWidth="1.5"/>
      <path d="M33 35l1.5 1.5 3-3" stroke="#a0bcd8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}