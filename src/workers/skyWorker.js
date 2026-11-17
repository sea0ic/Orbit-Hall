/**
 * skyWorker.js — Web Worker for star position calculations.
 *
 * Messages in:
 *   { type:'setStars', stars:[...] }            — cache the catalog (sent once)
 *   { type:'compute', stars?, lat, lon, timestamp, camAz, camAlt, fov, W, H }
 *
 * Message out:
 *   { type:'result', stars:[{x,y,mag,ci,alt,az,ra,dec,name?,hip?,con?,sp?}], timestamp }
 *
 * The catalog is cached inside the worker so panning/zooming only has to send
 * camera parameters, not 40k+ star objects every frame-tick. All trigonometry
 * runs off the main thread so canvas rendering stays smooth.
 */

let CATALOG = [];

// ── Fast local sidereal time (degrees) ───────────────────────────────────────
function lst(lon, ms) {
  const jd = ms / 86400000 + 2440587.5;
  const T  = (jd - 2451545.0) / 36525.0;
  let g = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
        + 0.000387933 * T * T - T * T * T / 38710000;
  g = ((g % 360) + 360) % 360;
  return ((g + lon) % 360 + 360) % 360;
}

// ── RA (hours) / Dec (deg) → Altitude / Azimuth (deg) ────────────────────────
function toHorizon(ra_h, dec_d, lat_d, lon_d, ms) {
  const D2R = Math.PI / 180;
  const ha  = (lst(lon_d, ms) - ra_h * 15) * D2R;
  const dec = dec_d * D2R;
  const lat = lat_d * D2R;

  const sinAlt = Math.sin(dec)*Math.sin(lat) + Math.cos(dec)*Math.cos(lat)*Math.cos(ha);
  const alt    = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const cosAz  = (Math.sin(dec) - Math.sin(alt)*Math.sin(lat)) / (Math.cos(alt)*Math.cos(lat) + 1e-12);
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz)));
  if (Math.sin(ha) > 0) az = 2 * Math.PI - az;

  return { alt: alt * (180/Math.PI), az: az * (180/Math.PI) };
}

// ── Gnomonic (tangent plane) projection ──────────────────────────────────────
function project(alt_d, az_d, camAz, camAlt, fov, cx, cy, W) {
  const D2R = Math.PI / 180;
  const altR = alt_d * D2R, azR  = az_d  * D2R;
  const cAzR = camAz * D2R, cAlR = camAlt * D2R;

  const cosAlt = Math.cos(altR);
  const nx = cosAlt * Math.sin(azR);
  const ny = cosAlt * Math.cos(azR);
  const nz = Math.sin(altR);

  const cosCA = Math.cos(cAlR);
  const fx = cosCA * Math.sin(cAzR);
  const fy = cosCA * Math.cos(cAzR);
  const fz = Math.sin(cAlR);

  const dot = nx*fx + ny*fy + nz*fz;
  if (dot <= 0.05) return null;

  // Camera right vector (forward × world_up, normalised)
  let rx = fy*1 - fz*0, ry = fz*0 - fx*1, rz = fx*0 - fy*0;
  const rL = Math.sqrt(rx*rx + ry*ry + rz*rz);
  if (rL < 1e-9) { rx=1; ry=0; rz=0; } else { rx/=rL; ry/=rL; rz/=rL; }

  // Camera up = right × forward
  const ux = ry*fz - rz*fy;
  const uy = rz*fx - rx*fz;
  const uz = rx*fy - ry*fx;

  const pxPerRad = (W / 2) / Math.tan((fov / 2) * D2R);
  return {
    x: cx + (nx*rx + ny*ry + nz*rz) / dot * pxPerRad,
    y: cy - (nx*ux + ny*uy + nz*uz) / dot * pxPerRad,
  };
}

// ── Message handler ───────────────────────────────────────────────────────────
self.onmessage = function(e) {
  const msg = e.data;

  if (msg.type === 'setStars') {
    CATALOG = msg.stars || [];
    return;
  }
  if (msg.type !== 'compute') return;

  const { lat, lon, timestamp, camAz, camAlt, fov, W } = msg;
  const source = msg.stars || CATALOG;
  const magLimit = msg.magLimit != null ? msg.magLimit : 8;

  const cx = W / 2;
  const H = msg.H != null ? msg.H : W;
  const pad = 24;
  const out = [];

  for (let i = 0; i < source.length; i++) {
    const s = source[i];
    if (s.mag > magLimit) continue;
    const h = toHorizon(s.ra, s.dec, lat, lon, timestamp);
    if (h.alt < -6) continue;

    const p = project(h.alt, h.az, camAz, camAlt, fov, cx, H / 2, W);
    if (!p) continue;
    if (p.x < -pad || p.x > W+pad || p.y < -pad || p.y > H+pad) continue;

    const item = {
      x:   p.x,
      y:   p.y,
      mag: s.mag,
      ci:  s.ci,
      alt: h.alt,
      az:  h.az,
      ra:  s.ra,
      dec: s.dec,
    };
    if (s.name) item.name = s.name;
    if (s.hip)  item.hip  = s.hip;
    if (s.con)  item.con  = s.con;
    if (s.sp)   item.sp   = s.sp;
    out.push(item);
  }

  self.postMessage({ type: 'result', stars: out, timestamp });
};
