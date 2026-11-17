/**
 * Tonight's highlights — calculates what's interesting in the sky
 * right now from the observer's location and time.
 */
import { equatorialToHorizon } from './skyCalculations';
import { computePlanetPositions, PLANET_DEFS } from './planetCalculations';
import { getMoonData, getSkyDarkness } from './moonCalculations';
import { STARS } from '../data/stars';
import { CONSTELLATIONS } from '../data/constellations';
import {
  Observer, MakeTime, Body, SearchRiseSet,
  Elongation, PlanetOrbitalPeriod,
} from 'astronomy-engine';

/**
 * Main function — returns a sorted array of highlight items.
 * Each item: { type, title, subtitle, detail, icon, priority, color, data }
 */
export function computeHighlights(lat, lon, date) {
  const highlights = [];

  // ── Moon ──────────────────────────────────────────────────────────────────
  const moon = getMoonData(lat, lon, date);
  if (moon) {
    const darkness = getSkyDarkness(moon);
    highlights.push({
      type: 'moon',
      icon: getMoonEmoji(moon.phaseAngle),
      title: moon.phaseName,
      subtitle: `${Math.round(moon.illumination * 100)}% illuminated`,
      detail: moon.isVisible
        ? `Altitude ${moon.altitude.toFixed(0)}° · Sets ${fmtTime(moon.setTime)}`
        : `Below horizon · Rises ${fmtTime(moon.riseTime)}`,
      color: '#d8d0a0',
      priority: 10,
      data: moon,
      skyNote: darkness.description,
    });
  }

  // ── Planets ───────────────────────────────────────────────────────────────
  let planets = [];
  try { planets = computePlanetPositions(lat, lon, date); } catch {}

  planets.forEach(planet => {
    if (planet.altitude < 5) return; // only usefully visible ones

    let detail = `Altitude ${planet.altitude.toFixed(0)}° · Azimuth ${planet.azimuth.toFixed(0)}°`;

    // Special events
    let special = null;
    try {
      if (['Mercury', 'Venus'].includes(planet.body)) {
        const elong = Elongation(planet.body, MakeTime(date));
        const deg   = elong.elongation;
        if (deg > 15) {
          special = `${elong.visibility === 'morning' ? 'Morning' : 'Evening'} star · ${deg.toFixed(0)}° elongation`;
        }
      }
    } catch {}

    highlights.push({
      type: 'planet',
      icon: planet.symbol,
      title: planet.name,
      subtitle: special || `Magnitude ${planet.mag.toFixed(1)}`,
      detail,
      color: planet.color,
      priority: planet.mag < 0 ? 9 : planet.mag < 2 ? 8 : 6,
      data: planet,
    });
  });

  // ── Bright stars near zenith ───────────────────────────────────────────────
  const brightStars = STARS
    .filter(s => s.mag < 1.5)
    .map(s => {
      const hor = equatorialToHorizon(s.ra, s.dec, lat, lon, date);
      return hor ? { ...s, ...hor } : null;
    })
    .filter(s => s && s.altitude > 40) // high in the sky
    .sort((a, b) => a.mag - b.mag)
    .slice(0, 3);

  brightStars.forEach(star => {
    highlights.push({
      type: 'star',
      icon: '★',
      title: star.name,
      subtitle: `${star.constellation} · Magnitude ${star.mag.toFixed(2)}`,
      detail: `High in sky · Altitude ${star.altitude.toFixed(0)}°`,
      color: '#c8d8f8',
      priority: 5,
      data: star,
    });
  });

  // ── Best constellations visible ────────────────────────────────────────────
  const constellationScores = CONSTELLATIONS.map(con => {
    const stars = con.lines.flat()
      .filter((id, i, arr) => arr.indexOf(id) === i) // unique ids
      .map(id => STARS.find(s => s.id === id))
      .filter(Boolean);

    if (stars.length === 0) return null;

    const altitudes = stars.map(s => {
      const hor = equatorialToHorizon(s.ra, s.dec, lat, lon, date);
      return hor ? hor.altitude : -90;
    });

    const avgAlt  = altitudes.reduce((a, b) => a + b, 0) / altitudes.length;
    const allUp   = altitudes.every(a => a > 10);
    const halfUp  = altitudes.filter(a => a > 5).length >= altitudes.length * 0.6;

    if (!halfUp) return null;
    return { con, avgAlt, allUp, score: avgAlt + (allUp ? 20 : 0) };
  }).filter(Boolean).sort((a, b) => b.score - a.score);

  constellationScores.slice(0, 2).forEach(({ con, avgAlt, allUp }) => {
    highlights.push({
      type: 'constellation',
      icon: '⋆',
      title: con.name,
      subtitle: allUp ? 'Fully visible' : 'Mostly visible',
      detail: `Average altitude ${avgAlt.toFixed(0)}° above horizon`,
      color: '#a0a8d8',
      priority: 4,
      data: con,
    });
  });

  // ── Astronomical twilight note ─────────────────────────────────────────────
  const hour = date.getHours();
  if (hour >= 21 || hour <= 4) {
    highlights.push({
      type: 'condition',
      icon: '◉',
      title: 'Astronomical Night',
      subtitle: 'Full darkness — optimal observing',
      detail: 'Sun is more than 18° below horizon',
      color: '#7890c8',
      priority: 3,
    });
  } else if (hour >= 19 || hour <= 6) {
    highlights.push({
      type: 'condition',
      icon: '◑',
      title: 'Civil Twilight',
      subtitle: 'Sky brightening / darkening',
      detail: 'Best targets: Moon, bright planets, named stars',
      color: '#c8a870',
      priority: 3,
    });
  }

  // Sort by priority descending
  return highlights.sort((a, b) => b.priority - a.priority);
}

function getMoonEmoji(angle) {
  if (angle < 22.5 || angle > 337.5) return '🌑';
  if (angle < 67.5)  return '🌒';
  if (angle < 112.5) return '🌓';
  if (angle < 157.5) return '🌔';
  if (angle < 202.5) return '🌕';
  if (angle < 247.5) return '🌖';
  if (angle < 292.5) return '🌗';
  return '🌘';
}

function fmtTime(date) {
  if (!date) return 'unknown';
  return new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}