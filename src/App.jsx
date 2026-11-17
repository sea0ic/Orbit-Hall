import { useState, useEffect, useRef, useCallback } from 'react';
import PlanetariumMap from './components/Planetariummap';
import SearchBar from './components/Searchbar';
import LocationPanel from './components/Locationpanel';
import WeatherPanel from './components/Weatherpanel';
import TimeControls from './components/TimeControl';
import StarDetailsDrawer from './components/StarDetailsDrawer';
import DeepSkyDrawer from './components/DeepSkyDrawer';
import Journal from './components/Journal';
import AuthModal, { useAuth } from './components/AuthModal';
import MoonPanel from './components/MoonPanel';
import TonightHighlights from './components/TonightHighlights';
import LayerControls, { DEFAULT_LAYERS } from './components/LayerControls';
import { equatorialToHorizon } from './utils/skyCalculations';
import { computePlanetPositions } from './utils/planetCalculations';
import './App.css';

const LOCATION_KEY = 'nsj_location';
const DEFAULT_LOC  = { name:'London, GB', lat:51.5074, lon:-0.1278 };
const LAYERS_KEY   = 'nsj_layers';

export default function App() {
  const [location, setLocation] = useState(()=>{
    try{const s=localStorage.getItem(LOCATION_KEY);return s?JSON.parse(s):DEFAULT_LOC;}catch{return DEFAULT_LOC;}
  });
  const [observingTime, setObservingTime] = useState(new Date());
  const [isNowMode, setIsNowMode]         = useState(true);

  const [selectedStar,    setSelectedStar]    = useState(null);
  const [selectedPlanet,  setSelectedPlanet]  = useState(null);
  const [selectedDSO,     setSelectedDSO]     = useState(null);
  const [targetStar,      setTargetStar]      = useState(null);

  const [uiVisible,  setUiVisible]  = useState(true);
  const [showAuth,   setShowAuth]   = useState(false);
  const [showLayers, setShowLayers] = useState(false);

  const [layers, setLayers] = useState(()=>{
    try{const s=localStorage.getItem(LAYERS_KEY);return s?{...DEFAULT_LAYERS,...JSON.parse(s)}:DEFAULT_LAYERS;}
    catch{return DEFAULT_LAYERS;}
  });

  const { user, signOut, refresh } = useAuth();
  const mapRef = useRef(null);

  // Persist layers
  useEffect(()=>{ localStorage.setItem(LAYERS_KEY, JSON.stringify(layers)); },[layers]);

  // Live clock
  useEffect(()=>{
    if(!isNowMode)return;
    const t=setInterval(()=>setObservingTime(new Date()),60000);
    return()=>clearInterval(t);
  },[isNowMode]);

  // Close any selection when red mode is toggled
  const drawerOpen = !!(selectedStar || selectedPlanet || selectedDSO);

  const handleTimeChange = useCallback(date=>{
    setObservingTime(date);
    setIsNowMode(Math.abs(date-Date.now())<90000);
  },[]);

  const handleSelectStar = useCallback(star=>{
    if(!star){setSelectedStar(null);return;}
    const hor=equatorialToHorizon(star.ra,star.dec,location?.lat??51.5,location?.lon??0,observingTime);
    setSelectedStar(hor?{...star,...hor}:star);
    setSelectedPlanet(null);setSelectedDSO(null);
  },[location,observingTime]);

  const handleSelectPlanet = useCallback(planet=>{
    setSelectedPlanet(planet||null);
    if(planet){setSelectedStar(null);setSelectedDSO(null);}
  },[]);

  const handleSelectDSO = useCallback(dso=>{
    if(!dso){setSelectedDSO(null);return;}
    const hor=equatorialToHorizon(dso.ra,dso.dec,location?.lat??51.5,location?.lon??0,observingTime);
    setSelectedDSO(hor?{...dso,...hor}:dso);
    setSelectedStar(null);setSelectedPlanet(null);
  },[location,observingTime]);

  const handleSearchSelect = useCallback(item=>{
    const lat=location?.lat??51.5,lon=location?.lon??0;
    if(item.type==='star'){
      const star=item.data;
      const hor=equatorialToHorizon(star.ra,star.dec,lat,lon,observingTime);
      setSelectedStar(hor?{...star,...hor}:star);setSelectedPlanet(null);setSelectedDSO(null);
      setTargetStar(star);
    } else if(item.type==='planet'){
      try{
        const planets=computePlanetPositions(lat,lon,observingTime);
        const found=planets.find(p=>p.id===item.id);
        if(found){setSelectedPlanet(found);setSelectedStar(null);setSelectedDSO(null);setTargetStar({ra:found.ra,dec:found.dec,id:found.id,name:found.name});}
      }catch{}
    } else if(item.type==='dso'){
      const dso=item.data;
      const hor=equatorialToHorizon(dso.ra,dso.dec,lat,lon,observingTime);
      setSelectedDSO(hor?{...dso,...hor}:dso);setSelectedStar(null);setSelectedPlanet(null);
      setTargetStar({ra:dso.ra,dec:dso.dec,id:dso.id,name:dso.name});
    } else if(item.type==='constellation'){
      import('./data/stars').then(({STARS})=>{
        const con=item.data;if(!con.lines?.length)return;
        const star=STARS.find(s=>s.id===con.lines[0][0]);
        if(star){setTargetStar({...star,_conTarget:true});setSelectedStar(null);setSelectedPlanet(null);setSelectedDSO(null);}
      });
    }
  },[location,observingTime]);

  const handleTargetReached = useCallback(()=>setTargetStar(null),[]);

  const handleCloseDrawer = useCallback(()=>{
    setSelectedStar(null);setSelectedPlanet(null);setSelectedDSO(null);
  },[]);

  const handleLocationChange = useCallback(loc=>{
    setLocation(loc);localStorage.setItem(LOCATION_KEY,JSON.stringify(loc));
  },[]);

  // Keyboard shortcuts
  useEffect(()=>{
    const h=e=>{
      if(e.target.matches('input,textarea'))return;
      if(e.key==='h')setUiVisible(v=>!v);
      if(e.key==='Escape'){handleCloseDrawer();setShowLayers(false);}
      if(e.key==='l')setShowLayers(v=>!v);
    };
    window.addEventListener('keydown',h);
    return()=>window.removeEventListener('keydown',h);
  },[handleCloseDrawer]);

  return(
    <div className="app-root" style={layers.redMode?{filter:'url(#red-filter)'}:{}}>

      {/* Red mode SVG filter */}
      {layers.redMode&&(
        <svg style={{position:'fixed',width:0,height:0}}>
          <defs>
            <filter id="red-filter">
              <feColorMatrix type="matrix" values="0.4 0 0 0 0.4  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
            </filter>
          </defs>
        </svg>
      )}

      {/* Sky canvas */}
      <PlanetariumMap
        ref={mapRef}
        location={location}
        observingTime={observingTime}
        selectedStar={selectedStar}
        selectedPlanet={selectedPlanet}
        selectedDSO={selectedDSO}
        onSelectStar={handleSelectStar}
        onSelectPlanet={handleSelectPlanet}
        onSelectDSO={handleSelectDSO}
        targetStar={targetStar}
        onTargetReached={handleTargetReached}
        layers={layers}
      />

      {/* Top bar */}
      <header className="top-bar">
        <div className="brand">
          <BrandMark/>
          <span className="brand-name">Sky Tonight</span>
        </div>
        <SearchBar
          onSelectResult={handleSearchSelect}
          onToggleUI={()=>setUiVisible(v=>!v)}
          uiVisible={uiVisible}
        />
        <div className="auth-area" style={{display:'flex',alignItems:'center',gap:8}}>
          {/* Layer toggle */}
          <button onClick={()=>setShowLayers(v=>!v)} title="Sky Layers (L)"
            style={{
              height:32, borderRadius:7,
              background:showLayers?'rgba(160,188,216,0.13)':'rgba(4,8,18,0.82)',
              border:`1px solid ${showLayers?'rgba(160,188,216,0.28)':'rgba(140,175,230,0.18)'}`,
              backdropFilter:'blur(14px)',
              cursor:'pointer', color:showLayers?'#a0bcd8':'#5878a0',
              padding:'0 11px', fontSize:'12px', fontWeight:500,
              display:'flex', alignItems:'center', gap:6,
              transition:'all 160ms', whiteSpace:'nowrap',
            }}>
            <LayersIcon/> Layers
          </button>

          {user?(
            <div style={{display:'flex',alignItems:'center',gap:7}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(160,188,216,0.14)',border:'1px solid rgba(160,188,216,0.22)',display:'flex',alignItems:'center',justifyContent:'center',color:'#a0bcd8',fontSize:'11px',fontWeight:600,userSelect:'none'}}>
                {user.name?.[0]?.toUpperCase()||'?'}
              </div>
              <button onClick={signOut} style={smallBtn}>Sign out</button>
            </div>
          ):(
            <button onClick={()=>setShowAuth(true)} style={accentBtn}>Sign in</button>
          )}
        </div>
      </header>

      {/* Layer controls panel — top right below header */}
      {showLayers&&(
        <div style={{position:'fixed',top:56,right:16,zIndex:150,animation:'panelUp 160ms ease'}}>
          <LayerControls layers={layers} onChange={setLayers}/>
        </div>
      )}

      {/* Floating panels */}
      <div className={`panels-container ${uiVisible?'panels-visible':'panels-hidden'}`}>
        <div className="panels-left">
          <LocationPanel location={location} onLocationChange={handleLocationChange}/>
          <WeatherPanel  location={location}/>
          <MoonPanel     location={location} observingTime={observingTime}/>
        </div>
        <div className="panels-bottom-right">
          <div style={{marginBottom:8,display:'flex',justifyContent:'flex-end'}}>
            <TonightHighlights
              location={location} observingTime={observingTime}
              onSelectStar={handleSelectStar} onSelectPlanet={handleSelectPlanet}
            />
          </div>
          <TimeControls
            observingTime={observingTime} onTimeChange={handleTimeChange}
            onZoomIn={()=>mapRef.current?.zoomIn()}
            onZoomOut={()=>mapRef.current?.zoomOut()}
            onResetView={()=>mapRef.current?.resetView()}
          />
          <div style={{marginTop:8,display:'flex',justifyContent:'flex-end',position:'relative'}}>
            <Journal location={location} observingTime={observingTime}/>
          </div>
        </div>
      </div>

      {/* Eye toggle */}
      <button onClick={()=>setUiVisible(v=>!v)} title={uiVisible?'Hide controls (H)':'Show controls (H)'}
        className={`eye-toggle ${uiVisible?'eye-open':'eye-closed'}`}>
        {uiVisible?<EyeOpen/>:<EyeClosed/>}
      </button>

      {/* Star / planet details */}
      {drawerOpen&&!selectedDSO&&(
        <StarDetailsDrawer star={selectedStar} planet={selectedPlanet} onClose={handleCloseDrawer}/>
      )}

      {/* Deep-sky details */}
      {drawerOpen&&selectedDSO&&(
        <DeepSkyDrawer object={selectedDSO} onClose={handleCloseDrawer}/>
      )}

      {/* Auth modal */}
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={()=>refresh()}/>}

      {/* First-visit hint */}
      <OnboardHint/>
    </div>
  );
}

function BrandMark(){return(<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9.5" stroke="rgba(160,188,216,0.10)" strokeWidth="1"/><circle cx="11" cy="11" r="6" stroke="rgba(160,188,216,0.22)" strokeWidth="1"/><circle cx="11" cy="11" r="2.4" fill="#a0bcd8"/><circle cx="11" cy="11" r="2.4" fill="url(#bm)" opacity=".7"/><circle cx="4.5" cy="4.5" r=".9" fill="#c8d8f8" opacity=".85"/><circle cx="17" cy="4" r=".6" fill="#c8d8f8" opacity=".65"/><circle cx="15" cy="16.5" r=".75" fill="#c8d8f8" opacity=".75"/><circle cx="3.5" cy="14" r=".5" fill="#c8d8f8" opacity=".55"/><circle cx="18" cy="12" r=".5" fill="#c8d8f8" opacity=".5"/><defs><radialGradient id="bm" cx="40%" cy="35%" r="60%"><stop offset="0%" stopColor="#fff" stopOpacity=".9"/><stop offset="100%" stopColor="#a0bcd8" stopOpacity="0"/></radialGradient></defs></svg>);}
const EyeOpen=()=>(<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="8" rx="6.5" ry="4" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>);
const EyeClosed=()=>(<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2-4 6-4 6 4 6 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M3 11l1.5-2M13 11l-1.5-2M8 12v-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>);
const LayersIcon=()=>(<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5l5.5 3L7 7.5 1.5 4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M1.5 7.5l5.5 3 5.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>);

function OnboardHint(){
  const[show,setShow]=useState(()=>!localStorage.getItem('nsj_hinted'));
  useEffect(()=>{if(!show)return;const t=setTimeout(()=>{setShow(false);localStorage.setItem('nsj_hinted','1');},6000);return()=>clearTimeout(t);},[show]);
  if(!show)return null;
  return(<div style={{position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',background:'rgba(4,8,18,.9)',border:'1px solid rgba(120,160,220,.14)',borderRadius:24,padding:'8px 20px',backdropFilter:'blur(12px)',color:'rgba(160,188,216,.65)',fontSize:'12px',pointerEvents:'none',display:'flex',gap:20,alignItems:'center',zIndex:50,animation:'fadeSlideUp 400ms ease',whiteSpace:'nowrap'}}>
    <span>🖱 Drag to pan</span><span>⚲ Scroll to zoom</span><span>★ Click to inspect</span>
    <style>{`@keyframes fadeSlideUp{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
  </div>);
}

const smallBtn={background:'transparent',border:'1px solid rgba(120,160,220,.14)',borderRadius:5,padding:'4px 10px',color:'#5878a0',cursor:'pointer',fontSize:'11px',transition:'all 160ms'};
const accentBtn={background:'rgba(160,188,216,.10)',border:'1px solid rgba(160,188,216,.22)',borderRadius:6,padding:'5px 14px',color:'#a0bcd8',cursor:'pointer',fontSize:'12px',fontWeight:500,transition:'all 160ms'};