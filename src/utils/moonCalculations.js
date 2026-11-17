/**
 * Moon calculations using astronomy-engine.
 * Returns phase, illumination, position, rise/set times.
 */
import {
  MoonPhase,
  Illumination,
  Horizon,
  Observer,
  MakeTime,
  SearchRiseSet,
  Body,
  Equator,
} from 'astronomy-engine';

/**
 * Get full moon data for a given observer and time.
 */
export function getMoonData(lat, lon, date) {
  try {
    const observer = new Observer(lat, lon, 0);
    const time     = MakeTime(date);

    // Phase angle (0=new, 90=first quarter, 180=full, 270=last quarter)
    const phaseAngle = MoonPhase(time);

    // Illumination fraction (0–1)
    const illum = Illumination(Body.Moon, time);
    const illuminationFraction = illum.phase_fraction;

    // Equatorial → horizon position
    const eq  = Equator(Body.Moon, time, observer, true, true);
    const hor = Horizon(time, observer, eq.ra, eq.dec, 'normal');

    // Rise and set times (search within ±12h)
    let riseTime = null, setTime  = null;
    try {
      const rise = SearchRiseSet(Body.Moon, observer, +1, time, 1);
      if (rise) riseTime = rise.date;
    } catch {}
    try {
      const set = SearchRiseSet(Body.Moon, observer, -1, time, 1);
      if (set) setTime = set.date;
    } catch {}

    // Age in days (days since last new moon)
    const ageDays = (phaseAngle / 360) * 29.53;

    return {
      phaseAngle,
      illumination: illuminationFraction,
      altitude:  hor.altitude,
      azimuth:   hor.azimuth,
      ra:        eq.ra,
      dec:       eq.dec,
      riseTime,
      setTime,
      ageDays,
      phaseName: getPhaseName(phaseAngle),
      isVisible: hor.altitude > 0,
    };
  } catch (e) {
    console.warn('Moon calculation error:', e?.message);
    return null;
  }
}

/**
 * Human-readable phase name from angle.
 */
export function getPhaseName(angle) {
  if (angle < 3 || angle > 357)  return 'New Moon';
  if (angle < 85)                return 'Waxing Crescent';
  if (angle < 95)                return 'First Quarter';
  if (angle < 175)               return 'Waxing Gibbous';
  if (angle < 185)               return 'Full Moon';
  if (angle < 265)               return 'Waning Gibbous';
  if (angle < 275)               return 'Last Quarter';
  return                                'Waning Crescent';
}

/**
 * Sky darkness quality rating based on Moon.
 * Returns { label, color, description }
 */
export function getSkyDarkness(moonData) {
  if (!moonData || !moonData.isVisible) {
    return { label: 'Excellent', color: '#78c8a0', description: 'Moon is below the horizon — ideal for deep-sky.' };
  }
  const pct = moonData.illumination * 100;
  if (pct < 15) return { label: 'Very Good',  color: '#a0d890', description: 'Thin crescent — minimal light pollution.' };
  if (pct < 40) return { label: 'Good',        color: '#c8d870', description: 'Partial Moon — bright objects still excellent.' };
  if (pct < 70) return { label: 'Fair',        color: '#d8b860', description: 'Moon washing out faint objects.' };
  return          { label: 'Poor',        color: '#c87860', description: 'Bright Moon — stick to planets and bright stars.' };
}

/**
 * Format a Date as HH:MM local time.
 */
export function fmtTime(date) {
  if (!date) return '—';
  return new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}