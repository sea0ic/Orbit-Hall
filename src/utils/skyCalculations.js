/**
 * Sky Calculations
 * Uses astronomy-engine for coordinate transforms.
 * RA is in sidereal hours (0–24), Dec in degrees (−90 to +90).
 */
import { Horizon, Observer, MakeTime } from 'astronomy-engine';

/**
 * Convert equatorial coordinates (RA hours, Dec degrees) to
 * horizon coordinates (azimuth degrees, altitude degrees)
 * for a given observer location and time.
 *
 * @param {number} ra   - Right ascension in hours (0–24)
 * @param {number} dec  - Declination in degrees
 * @param {number} lat  - Observer latitude in degrees
 * @param {number} lon  - Observer longitude in degrees
 * @param {Date}   date - Observing date/time
 * @returns {{ altitude: number, azimuth: number } | null}
 */
export function equatorialToHorizon(ra, dec, lat, lon, date) {
  try {
    const observer = new Observer(lat, lon, 0);
    const time = MakeTime(date);

    // astronomy-engine Horizon() takes RA in hours.
    const hor = Horizon(time, observer, ra, dec, 'normal');
    return {
      altitude: hor.altitude,
      azimuth: hor.azimuth,
    };
  } catch (e) {
    console.warn('skyCalculations: equatorialToHorizon failed', e);
    return null;
  }
}

/**
 * Returns true if the object is above the horizon (altitude > 0).
 */
export function isAboveHorizon(altitude) {
  return altitude > 0;
}

/**
 * Convert altitude/azimuth to stereographic canvas projection coords.
 *
 * The stereographic projection maps the celestial hemisphere onto a plane.
 * Center of projection = zenith direction.
 * The radius of the projected circle grows as we move toward the horizon.
 *
 * @param {number} altitude  - Altitude in degrees (0–90)
 * @param {number} azimuth   - Azimuth in degrees (0–360, N=0, E=90)
 * @param {number} camAz     - Camera center azimuth in degrees
 * @param {number} camAlt    - Camera center altitude in degrees
 * @param {number} fov       - Field of view in degrees (full width)
 * @param {number} cx        - Canvas center x in pixels
 * @param {number} cy        - Canvas center y in pixels
 * @param {number} scale     - Pixels per degree at center
 * @returns {{ x: number, y: number, visible: boolean }}
 */
export function projectToCanvas(altitude, azimuth, camAz, camAlt, fov, cx, cy, scale) {
  // Convert to radians
  const altR = (altitude * Math.PI) / 180;
  const azR = (azimuth * Math.PI) / 180;
  const camAzR = (camAz * Math.PI) / 180;
  const camAltR = (camAlt * Math.PI) / 180;

  // Convert alt/az to Cartesian unit vector (x=East, y=North, z=Up)
  const sinAlt = Math.sin(altR);
  const cosAlt = Math.cos(altR);
  const sinAz = Math.sin(azR);
  const cosAz = Math.cos(azR);

  // North-East-Up convention
  const nx = cosAlt * sinAz;   // East component
  const ny = cosAlt * cosAz;   // North component (N=0)
  const nz = sinAlt;           // Up component

  // Camera direction vector
  const sinCamAlt = Math.sin(camAltR);
  const cosCamAlt = Math.cos(camAltR);
  const sinCamAz = Math.sin(camAzR);
  const cosCamAz = Math.cos(camAzR);

  const cx_ = cosCamAlt * sinCamAz;
  const cy_ = cosCamAlt * cosCamAz;
  const cz_ = sinCamAlt;

  // Dot product: how aligned is this star with camera direction
  const dot = nx * cx_ + ny * cy_ + nz * cz_;

  // Stereographic projection
  // Project onto plane perpendicular to camera direction
  // Using gnomonic (tangent plane) projection which is simpler and fine for small FOV
  if (dot <= 0.01) {
    return { x: 0, y: 0, visible: false };
  }

  // Compute camera's "up" vector (perpendicular to camera dir, pointing zenith-ward)
  // Camera right = camera_dir × world_up_in_cam_plane
  // Let's compute screen coordinates using tangent plane projection

  // Camera basis vectors
  // Forward: camera direction
  // Right: forward × (0,0,1) normalized, or East
  // Up: right × forward

  const fwdLen = Math.sqrt(cx_ * cx_ + cy_ * cy_ + cz_ * cz_);
  const fx = cx_ / fwdLen, fy = cy_ / fwdLen, fz = cz_ / fwdLen;

  // World up = (0, 0, 1)
  const wx = 0, wy = 0, wz = 1;
  // right = forward cross worldUp
  let rx = fy * wz - fz * wy;
  let ry = fz * wx - fx * wz;
  let rz = fx * wy - fy * wx;
  const rLen = Math.sqrt(rx * rx + ry * ry + rz * rz);
  if (rLen < 1e-6) {
    // Looking straight up/down — use North as fallback
    rx = 1; ry = 0; rz = 0;
  } else {
    rx /= rLen; ry /= rLen; rz /= rLen;
  }

  // up = right cross forward
  const ux = ry * fz - rz * fy;
  const uy = rz * fx - rx * fz;
  const uz = rx * fy - ry * fx;

  // Project star onto tangent plane
  const tx = (nx * rx + ny * ry + nz * rz) / dot;
  const ty = (nx * ux + ny * uy + nz * uz) / dot;

  // Convert tangent-plane offsets to pixels. `scale` is already calibrated
  // for tangent-plane coordinates by fovToScale.
  const px = cx + tx * scale;
  const py = cy - ty * scale;  // y flipped (screen y increases downward)

  // Visibility: within roughly the canvas area
  const visible = dot > 0.05;

  return { x: px, y: py, visible };
}

/**
 * Angular separation between two alt/az positions (degrees).
 */
export function angularSeparation(az1, alt1, az2, alt2) {
  const d2r = Math.PI / 180;
  const a1 = alt1 * d2r, a2 = alt2 * d2r;
  const dAz = (az2 - az1) * d2r;
  const cos = Math.sin(a1) * Math.sin(a2) + Math.cos(a1) * Math.cos(a2) * Math.cos(dAz);
  return Math.acos(Math.max(-1, Math.min(1, cos))) / d2r;
}

/**
 * Compute the local sidereal time for a given location and time.
 * Returns degrees.
 */
export function localSiderealTime(lon, date) {
  // JD-based LST calculation
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525.0;
  // Greenwich Mean Sidereal Time in degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T - T * T * T / 38710000;
  gmst = ((gmst % 360) + 360) % 360;
  const lst = ((gmst + lon + 360) % 360);
  return lst;
}