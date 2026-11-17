/**
 * starRenderer.js
 *
 * Star rendering for HTML Canvas 2D, tuned to read like a photographic sky
 * (Stellarium-style) rather than a plotted chart:
 *
 *   - a compact, brightness-scaled core (the Airy disk)
 *   - a soft additive halo around brighter stars (no diffraction spikes)
 *   - colour from the real B-V index, desaturated toward white
 *   - atmospheric extinction near the horizon, with slight reddening
 *
 * Halo sprites are pre-rendered once per colour bucket and blitted with
 * `globalCompositeOperation = 'lighter'`, which is both fast and physically
 * correct: coincident stars add their light.
 */

// ── B-V colour index → RGB ────────────────────────────────────────────────────
export function bvToRGB(ci) {
  const t = Math.max(-0.4, Math.min(2.0, ci ?? 0.6));

  let r, g, b;

  if (t < -0.25) {
    r = 0.61; g = 0.70; b = 1.00;
  } else if (t < 0.00) {
    const x = (t + 0.25) / 0.25;
    r = 0.61 + 0.11 * x; g = 0.70 + 0.07 * x; b = 1.00;
  } else if (t < 0.15) {
    r = 0.83; g = 0.87; b = 1.00;
  } else if (t < 0.30) {
    const x = (t - 0.15) / 0.15;
    r = 0.83 + 0.10 * x; g = 0.87 + 0.05 * x; b = 1.00 - 0.05 * x;
  } else if (t < 0.58) {
    const x = (t - 0.30) / 0.28;
    r = 0.93 + 0.07 * x; g = 0.92 - 0.02 * x; b = 0.95 - 0.30 * x;
  } else if (t < 1.00) {
    const x = (t - 0.58) / 0.42;
    r = 1.00; g = 0.90 - 0.18 * x; b = 0.65 - 0.30 * x;
  } else if (t < 1.50) {
    const x = (t - 1.00) / 0.50;
    r = 1.00; g = 0.72 - 0.22 * x; b = 0.35 - 0.25 * x;
  } else {
    const x = Math.min(1, (t - 1.50) / 0.50);
    r = 1.00; g = 0.50 - 0.15 * x; b = 0.10 - 0.05 * x;
  }

  // Photographic sky: real stars read as white with a tint, not pure colour.
  const W = 0.45;
  r += (1 - r) * W; g += (1 - g) * W; b += (1 - b) * W;

  return `rgb(${Math.round(Math.max(0, Math.min(1, r)) * 255)},${Math.round(
    Math.max(0, Math.min(1, g)) * 255)},${Math.round(Math.max(0, Math.min(1, b)) * 255)})`;
}

// ── Colour lookup ────────────────────────────────────────────────────────────
const BV_LUT_SIZE = 400;
const BV_MIN = -0.4, BV_MAX = 2.0;
const BV_LUT = new Array(BV_LUT_SIZE);
for (let i = 0; i < BV_LUT_SIZE; i++) {
  BV_LUT[i] = bvToRGB(BV_MIN + (BV_MAX - BV_MIN) * i / (BV_LUT_SIZE - 1));
}

export function bvToRGBFast(ci) {
  const idx = Math.round((Math.max(BV_MIN, Math.min(BV_MAX, ci ?? 0.6)) - BV_MIN)
    / (BV_MAX - BV_MIN) * (BV_LUT_SIZE - 1));
  return BV_LUT[Math.max(0, Math.min(BV_LUT_SIZE - 1, idx))];
}

export function bvToRGBArray(ci) {
  const s = bvToRGBFast(ci);
  const m = s.match(/\d+/g);
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

// ── Halo sprites ─────────────────────────────────────────────────────────────
const SPRITE_PX = 96;
const SPRITE_COLORS = 16;
const spriteCache = new Map();

function haloColorForBucket(b) {
  const ci = BV_MIN + (BV_MAX - BV_MIN) * (b / (SPRITE_COLORS - 1));
  return bvToRGBArray(ci);
}

function buildHaloSprite(rgb) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SPRITE_PX;
  const g = canvas.getContext('2d');
  const c = SPRITE_PX / 2;
  const [r, gg, b] = rgb;

  const grad = g.createRadialGradient(c, c, 0, c, c, c);
  grad.addColorStop(0.00, `rgba(${r},${gg},${b},1)`);
  grad.addColorStop(0.07, `rgba(${r},${gg},${b},0.72)`);
  grad.addColorStop(0.16, `rgba(${r},${gg},${b},0.34)`);
  grad.addColorStop(0.30, `rgba(${r},${gg},${b},0.12)`);
  grad.addColorStop(0.48, `rgba(${r},${gg},${b},0.040)`);
  grad.addColorStop(0.68, `rgba(${r},${gg},${b},0.012)`);
  grad.addColorStop(1.00, `rgba(${r},${gg},${b},0)`);

  g.fillStyle = grad;
  g.fillRect(0, 0, SPRITE_PX, SPRITE_PX);
  return canvas;
}

function getHaloSprite(ci) {
  const b = Math.round(
    (Math.max(BV_MIN, Math.min(BV_MAX, ci ?? 0.6)) - BV_MIN) / (BV_MAX - BV_MIN) * (SPRITE_COLORS - 1)
  );
  let s = spriteCache.get(b);
  if (!s) { s = buildHaloSprite(haloColorForBucket(b)); spriteCache.set(b, s); }
  return s;
}

// ── Photometry helpers ───────────────────────────────────────────────────────
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);

// Magnitude → brightness lookup, so the hot loop avoids Math.pow per star.
const MAG_LUT_MIN = -2, MAG_LUT_STEP = 0.05;
const MAG_LUT_N = Math.ceil((8.6 - MAG_LUT_MIN) / MAG_LUT_STEP) + 1;
const MAG_LUT = new Float32Array(MAG_LUT_N);
for (let i = 0; i < MAG_LUT_N; i++) {
  const mag = MAG_LUT_MIN + i * MAG_LUT_STEP;
  MAG_LUT[i] = clamp01((6.9 - mag) / 8.4);
}

/** Normalised brightness: mag 6.9 → 0, mag −1.5 → 1. */
export function brightness01(mag) {
  let i = Math.round((mag - MAG_LUT_MIN) / MAG_LUT_STEP);
  if (i < 0) i = 0; else if (i >= MAG_LUT_N) i = MAG_LUT_N - 1;
  return MAG_LUT[i];
}

/** Core (Airy disk) radius in pixels, before device-pixel scaling. */
export function coreRadius(mag, zoomFactor) {
  const b = brightness01(mag);
  const zoom = Math.pow(Math.max(0.75, Math.min(4.5, zoomFactor)), 0.70);
  return (0.62 + 2.20 * Math.pow(b, 1.40)) * zoom;
}

/** Kept for callers that only need an apparent size. */
export function magToRadius(mag, zoomFactor) {
  return coreRadius(mag, zoomFactor);
}

/**
 * Atmospheric extinction: 1 above 20°, fading toward the horizon.
 * Not zero at the horizon — stars there are dim and reddened, not deleted.
 */
export function atmosphericExtinction(altDeg) {
  if (altDeg >= 14) return 1.0;
  if (altDeg <= 0) return 0.18;
  const t = (altDeg - 0) / 14;
  return 0.18 + 0.82 * (t * t * (3 - 2 * t));
}

// Warm tint applied as a star approaches the horizon.
function redden(rgb, amount) {
  const a = Math.min(1, Math.max(0, amount));
  return [
    Math.round(rgb[0] + (255 - rgb[0]) * a * 0.45),
    Math.round(rgb[1] - rgb[1] * a * 0.22),
    Math.round(rgb[2] - rgb[2] * a * 0.45),
  ];
}

// Building a fillStyle string per star per frame is surprisingly expensive, so
// cache the reddened variant by (colour bucket, redden bucket).
const _colorCache = new Map();

function starColor(ci, reddenAmount) {
  if (reddenAmount < 0.02) return bvToRGBFast(ci);
  const cb = Math.round((Math.max(BV_MIN, Math.min(BV_MAX, ci ?? 0.6)) - BV_MIN) / (BV_MAX - BV_MIN) * 24);
  const rb = Math.round(Math.min(1, reddenAmount) * 12);
  const key = cb * 32 + rb;
  let s = _colorCache.get(key);
  if (!s) {
    const base = haloColorForBucket(Math.round(cb * (SPRITE_COLORS - 1) / 24));
    const [r, g, b] = redden(base, rb / 12);
    s = `rgb(${r},${g},${b})`;
    _colorCache.set(key, s);
  }
  return s;
}

// ── Main star draw ───────────────────────────────────────────────────────────
/**
 * Draw one star.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} mag
 * @param {number} ci         - B-V colour index
 * @param {number} altDeg     - altitude, for extinction
 * @param {number} zoomFactor - DEFAULT_FOV / currentFOV
 * @param {boolean} isSelected
 * @param {string|null} label
 */
export function drawStar(ctx, x, y, mag, ci, altDeg, zoomFactor, isSelected = false, label = null) {
  const ext = atmosphericExtinction(altDeg);
  if (ext <= 0.02) return;

  const b = brightness01(mag);
  const coreR = coreRadius(mag, zoomFactor);
  const haloR = coreR * (2.1 + 3.1 * Math.pow(b, 1.15));

  const coreCol = starColor(ci, (1 - ext) * 0.75);

  // ── light: halo + core, additive ──────────────────────────────────────────
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  const haloAlpha = 0.55 * Math.pow(b, 1.15) * ext;
  if (haloAlpha > 0.01) {
    ctx.globalAlpha = haloAlpha;
    ctx.drawImage(getHaloSprite(ci), x - haloR, y - haloR, haloR * 2, haloR * 2);
  }

  ctx.globalAlpha = Math.min(1, 0.40 + 0.72 * Math.pow(b, 0.65)) * ext;
  ctx.fillStyle = coreCol;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.3, coreR), 0, Math.PI * 2);
  ctx.fill();

  // Hot white centre for the brightest stars.
  if (b > 0.55) {
    ctx.globalAlpha = Math.min(1, (b - 0.45) * 1.6) * ext;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.35, coreR * 0.48), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ── overlay: selection ring + label (normal blending) ─────────────────────
  if (isSelected) {
    ctx.save();
    ctx.globalAlpha = 0.8 * ext;
    ctx.strokeStyle = 'rgba(160,210,255,0.9)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(x, y, coreR + 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.22 * ext;
    ctx.beginPath();
    ctx.arc(x, y, coreR + 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (label) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.78, ext);
    ctx.fillStyle = 'rgba(178,205,238,0.9)';
    ctx.font = `11px 'Inter', sans-serif`;
    ctx.fillText(label, x + coreR + 6, y + 4);
    ctx.restore();
  }
}

// ── Faint background stars ───────────────────────────────────────────────────
// No halo and no gradient — just a sub-pixel core at the right brightness.
export function drawFaintStar(ctx, x, y, mag, ci, altDeg, zoomFactor, magLimit = 8) {
  const ext = atmosphericExtinction(altDeg);
  if (ext <= 0.02) return;

  const b = brightness01(mag);
  const r = coreRadius(mag, zoomFactor);

  // Fade out toward the current limiting magnitude so the field has depth
  // instead of turning into uniform dust when zoomed in.
  const fade = Math.max(0.16, Math.min(1, (magLimit - mag) / 1.6));
  const alpha = Math.min(0.98, 0.32 + 0.80 * Math.pow(b, 0.62)) * ext * fade;

  ctx.globalAlpha = alpha;
  ctx.fillStyle = starColor(ci, (1 - ext) * 0.75);

  if (r <= 0.5) {
    ctx.fillRect(Math.round(x - 0.5), Math.round(y - 0.5), 1, 1);
  } else {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── Legacy helpers kept for compatibility ────────────────────────────────────
export function drawStarGlow(ctx, x, y, r, color, opacity) {
  const glowR = r * 3;
  const grd = ctx.createRadialGradient(x, y, 0, x, y, glowR);
  grd.addColorStop(0.0, color.replace('rgb(', 'rgba(').replace(')', `,${opacity})`));
  grd.addColorStop(0.3, color.replace('rgb(', 'rgba(').replace(')', `,${opacity * 0.45})`));
  grd.addColorStop(1.0, color.replace('rgb(', 'rgba(').replace(')', ',0)'));
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(x, y, glowR, 0, Math.PI * 2);
  ctx.fill();
}

/** No longer used: diffraction spikes are not part of this look. */
export function drawDiffractionSpikes() {}
