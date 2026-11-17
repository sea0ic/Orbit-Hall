import { useState, useEffect } from 'react';

/**
 * Auth modal — localStorage-based for now.
 * Architecture is ready to swap the localStorage calls for a real API
 * (Supabase, Firebase, your own backend) when you're ready.
 *
 * Stored users: nsj_users = [ { email, passwordHash, name, createdAt } ]
 * Current session: nsj_session = { email, name }
 */

const USERS_KEY   = 'nsj_users';
const SESSION_KEY = 'nsj_session';

function hashPassword(pw) {
  // Simple deterministic hash — NOT cryptographically secure.
  // Replace with bcrypt/Argon2 when using a real backend.
  let h = 5381;
  for (let i = 0; i < pw.length; i++) h = ((h << 5) + h) ^ pw.charCodeAt(i);
  return (h >>> 0).toString(16);
}

export function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch { return null; }
  });
  const signOut = () => { localStorage.removeItem(SESSION_KEY); setUser(null); };
  const refresh = () => {
    try { setUser(JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')); }
    catch { setUser(null); }
  };
  return { user, signOut, refresh };
}

export default function AuthModal({ onClose, onAuth }) {
  const [mode, setMode]       = useState('signin'); // 'signin' | 'signup'
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Close on escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const validate = () => {
    if (!email.trim() || !email.includes('@')) return 'Please enter a valid email.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (mode === 'signup' && !name.trim()) return 'Please enter your name.';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const err = validate(); if (err) { setError(err); return; }
    setLoading(true);

    setTimeout(() => { // simulate async
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const hash  = hashPassword(password);

      if (mode === 'signup') {
        if (users.find(u => u.email === email.toLowerCase())) {
          setError('An account with this email already exists.'); setLoading(false); return;
        }
        const newUser = { email: email.toLowerCase(), passwordHash: hash, name: name.trim(), createdAt: new Date().toISOString() };
        localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
        const session = { email: newUser.email, name: newUser.name };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setSuccess(`Welcome, ${newUser.name}!`);
        setTimeout(() => { onAuth(session); onClose(); }, 900);

      } else {
        const found = users.find(u => u.email === email.toLowerCase() && u.passwordHash === hash);
        if (!found) { setError('Incorrect email or password.'); setLoading(false); return; }
        const session = { email: found.email, name: found.name };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setSuccess(`Welcome back, ${found.name}!`);
        setTimeout(() => { onAuth(session); onClose(); }, 700);
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:'fixed', inset:0, zIndex:500,
        background:'rgba(2,4,10,0.80)',
        backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:16,
        animation:'fadeIn 140ms ease',
      }}
    >
      <div style={{
        width:'100%', maxWidth:380,
        background:'rgba(5,9,20,0.97)',
        border:'1px solid rgba(120,160,220,0.16)',
        borderRadius:14,
        padding:28,
        boxShadow:'0 24px 80px rgba(0,0,0,0.8)',
        animation:'slideUp 160ms ease',
      }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', marginBottom:22 }}>
          <div>
            <div style={{ color:'#e8edf5', fontSize:'18px', fontWeight:600 }}>
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </div>
            <div style={{ color:'#3d5070', fontSize:'12px', marginTop:2 }}>Night Sky Journal</div>
          </div>
          <button onClick={onClose} style={{ marginLeft:'auto', background:'none', border:'none',
            cursor:'pointer', color:'#3d5070', padding:4, transition:'color 120ms' }}
            onMouseEnter={e=>e.currentTarget.style.color='#7a90b0'}
            onMouseLeave={e=>e.currentTarget.style.color='#3d5070'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {mode === 'signup' && (
            <Field label="Name" type="text" value={name}
              onChange={e=>setName(e.target.value)} placeholder="Your name" autoFocus />
          )}
          <Field label="Email" type="email" value={email}
            onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
            autoFocus={mode==='signin'} />
          <Field label="Password" type="password" value={password}
            onChange={e=>setPassword(e.target.value)} placeholder={mode==='signup'?'At least 6 characters':'Password'} />

          {error && (
            <div style={{ background:'rgba(180,80,70,0.1)', border:'1px solid rgba(180,80,70,0.2)',
              borderRadius:6, padding:'8px 12px', color:'#d08070', fontSize:'12px' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background:'rgba(100,190,130,0.1)', border:'1px solid rgba(100,190,130,0.2)',
              borderRadius:6, padding:'8px 12px', color:'#80c8a0', fontSize:'12px' }}>
              {success}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            marginTop:4, padding:'10px 0', borderRadius:8,
            background: loading ? 'rgba(160,188,216,0.08)' : 'rgba(160,188,216,0.15)',
            border:'1px solid rgba(160,188,216,0.25)',
            color: loading ? '#3d5070' : '#a0bcd8',
            fontSize:'13px', fontWeight:600, cursor: loading ? 'default' : 'pointer',
            transition:'all 160ms',
          }}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {/* Toggle mode */}
        <div style={{ marginTop:18, textAlign:'center', color:'#3d5070', fontSize:'12px' }}>
          {mode === 'signin' ? (
            <>Don't have an account?{' '}
              <button onClick={()=>{ setMode('signup'); setError(''); }}
                style={{ background:'none', border:'none', color:'#7a90b0', cursor:'pointer',
                  fontSize:'12px', textDecoration:'underline', padding:0 }}>
                Sign up
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={()=>{ setMode('signin'); setError(''); }}
                style={{ background:'none', border:'none', color:'#7a90b0', cursor:'pointer',
                  fontSize:'12px', textDecoration:'underline', padding:0 }}>
                Sign in
              </button>
            </>
          )}
        </div>

        {mode === 'signin' && (
          <div style={{ marginTop:10, textAlign:'center', color:'#2d3d50', fontSize:'11px', lineHeight:1.5 }}>
            Data is stored locally in your browser.<br/>
            Cloud sync coming in a future update.
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
      `}</style>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, autoFocus }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display:'block', color:'#5878a0', fontSize:'11px',
        letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:5 }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} autoFocus={autoFocus}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{
          width:'100%', background:'rgba(255,255,255,0.04)',
          border:`1px solid ${focused?'rgba(160,188,216,0.3)':'rgba(120,160,220,0.14)'}`,
          borderRadius:7, padding:'9px 12px',
          color:'#e8edf5', fontSize:'13px', fontFamily:'Inter,sans-serif',
          outline:'none', boxSizing:'border-box',
          boxShadow: focused ? '0 0 0 3px rgba(160,188,216,0.07)' : 'none',
          transition:'border-color 160ms, box-shadow 160ms',
        }}
      />
    </div>
  );
}