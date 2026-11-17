/**
 * Planet position calculations using astronomy-engine.
 *
 * Returns horizon coordinates (altitude, azimuth) for the
 * eight planets visible from Earth at a given time and location.
 */
import { Horizon, Observer, MakeTime, GeoVector, Equator, Body } from 'astronomy-engine';

export const PLANET_DEFS = [
  { id: 'mercury', name: 'Mercury', body: 'Mercury', color: '#c8b090', mag: 0.0,  symbol: '☿', radius: 4 },
  { id: 'venus',   name: 'Venus',   body: 'Venus',   color: '#fff5d0', mag: -4.0, symbol: '♀', radius: 6 },
  { id: 'mars',    name: 'Mars',    body: 'Mars',    color: '#d07050', mag: -0.5, symbol: '♂', radius: 5 },
  { id: 'jupiter', name: 'Jupiter', body: 'Jupiter', color: '#d8c8a8', mag: -2.0, symbol: '♃', radius: 7 },
  { id: 'saturn',  name: 'Saturn',  body: 'Saturn',  color: '#e0d0a0', mag: 0.7,  symbol: '♄', radius: 6 },
  { id: 'uranus',  name: 'Uranus',  body: 'Uranus',  color: '#90d8e0', mag: 5.5,  symbol: '♅', radius: 4 },
  { id: 'neptune', name: 'Neptune', body: 'Neptune', color: '#6080d0', mag: 8.0,  symbol: '♆', radius: 3 },
];

/**
 * Compute planet positions for a given time and observer location.
 * @param {number} lat  - Observer latitude degrees
 * @param {number} lon  - Observer longitude degrees
 * @param {Date}   date - Observing time
 * @returns {Array} - Array of planet objects with altitude, azimuth, ra, dec added
 */
export function computePlanetPositions(lat, lon, date) {
  const observer = new Observer(lat, lon, 0);
  const time = MakeTime(date);

  return PLANET_DEFS.map(planet => {
    try {
      // Get equatorial coordinates of the planet
      const eq = Equator(planet.body, time, observer, true, true);
      // Convert to horizon coordinates
      const hor = Horizon(time, observer, eq.ra, eq.dec, 'normal');
      return {
        ...planet,
        ra: eq.ra,
        dec: eq.dec,
        altitude: hor.altitude,
        azimuth: hor.azimuth,
        distAU: eq.dist,
      };
    } catch (e) {
      // If astronomy-engine doesn't have the body or an error occurs, skip it
      console.warn(`Planet calculation failed for ${planet.name}:`, e?.message);
      return null;
    }
  }).filter(Boolean);
}

/**
 * Planet lore for the details panel
 */
export const PLANET_LORE = {
  mercury: {
    myth: `Mercury, the fleet-footed messenger of the Roman gods, was named for the planet's swift movement across the sky. The Babylonians called it Nabu after the god of writing and wisdom. Because Mercury is only visible near the horizon at dawn or dusk, ancient Greeks initially thought it was two separate stars: Stilbon at dawn and Hermaon at dusk, before realizing they were the same object.`,
    science: `Mercury is the smallest planet and the closest to the Sun, completing an orbit in just 88 Earth days. Despite being closest to the Sun, it is not the hottest planet — Venus's thick atmosphere wins that distinction. Mercury has virtually no atmosphere, so temperatures swing from 430°C on its sunlit side to −180°C at night. Its core of iron makes up roughly 85% of its radius — proportionally the largest iron core in the Solar System.`,
    fact: `Mercury rotates so slowly — once every 59 Earth days — that its solar day (sunrise to sunrise) lasts 176 Earth days: two full years pass for every one Mercury day.`,
  },
  venus: {
    myth: `Venus, named for the Roman goddess of love and beauty, is called the Morning Star and Evening Star. The Babylonians called it Ishtar, the goddess of love, war, and fertility — the same deity behind the name of Aldebaran's "eye." The Mayans tracked Venus's synodic cycle with extraordinary precision and built their calendars around it, associating it with the feathered serpent Quetzalcoatl.`,
    science: `Venus is Earth's twin in size but an extreme in almost every other way: its thick atmosphere of carbon dioxide creates a runaway greenhouse effect, raising surface temperatures to 465°C — hot enough to melt lead. Atmospheric pressure at the surface is 92 times Earth's. Venus rotates backward (retrograde) so slowly that a Venusian day lasts longer than its year. Its dense clouds of sulfuric acid reflect 70% of incoming sunlight, making it the brightest object in the sky after the Sun and Moon.`,
    fact: `On Venus, the Sun rises in the west and sets in the east — and because the planet rotates so slowly, it rises only once every 116.75 Earth days.`,
  },
  mars: {
    myth: `Mars was Ares to the Greeks, the god of war — its blood-red color evoking the battlefield. To the Babylonians it was Nergal, the star of death and pestilence. The ancient Chinese called it Huǒxīng — the "fire star." Its two small moons, Phobos (Fear) and Deimos (Dread), were discovered in 1877 and named for the horses that drew Ares's chariot.`,
    science: `Mars has the largest volcano in the Solar System (Olympus Mons, three times Everest's height) and the longest canyon system (Valles Marineris, as wide as the United States). Its thin CO₂ atmosphere allows liquid water to be unstable on the surface, but abundant evidence — dry riverbeds, lake-bed sediments, polar ice — shows water once flowed freely. Its red color comes from iron oxide (rust) covering much of the surface.`,
    fact: `A day on Mars — called a "sol" — is 24 hours and 37 minutes long, comfortingly close to an Earth day, which is one reason Mars seems the most human-habitable planet to science fiction writers.`,
  },
  jupiter: {
    myth: `Jupiter, king of the Roman gods (Zeus to the Greeks), rules the sky as the largest planet rules the Solar System. The four large moons — Io, Europa, Ganymede, and Callisto — discovered by Galileo in 1610 were named for Zeus's lovers, as suggested by Simon Marius. Their discovery was critical proof that not everything in the cosmos orbited Earth, supporting the Copernican revolution.`,
    science: `Jupiter is so massive (318 Earth masses) that it is essentially a failed star — had it been about 80 times larger, it could have ignited hydrogen fusion. Its Great Red Spot is a storm larger than Earth that has raged for at least 350 years. Jupiter's magnetic field is the strongest of any planet, about 14 times more powerful than Earth's, and its radiation belts would be lethal to unprotected humans. Europa's subsurface ocean of liquid water is one of the most promising places to search for extraterrestrial life.`,
    fact: `Jupiter acts as a gravitational shield for the inner Solar System, its enormous gravity flinging or capturing many comets and asteroids that might otherwise strike Earth — a cosmic bodyguard that may have helped life here endure.`,
  },
  saturn: {
    myth: `Saturn was the Roman god of agriculture, wealth, and liberation — the father of Jupiter whom Jupiter overthrew. The Greeks called him Kronos, the god of time, who swallowed his own children to prevent them from dethroning him. Saturday takes its name from Saturn. In Mesopotamia, Saturn was associated with Ninurta, a god of agriculture and war, and its slow movement made it symbolic of patience and the grinding passage of time.`,
    science: `Saturn's rings — composed of ice and rock particles ranging from specks to house-sized boulders — are the most spectacular in the Solar System but surprisingly thin: while spanning 280,000 km across, the main rings are less than 100 meters thick in most places. Saturn is the least dense planet, less dense than water: a large enough ocean and it would float. Its moon Titan has a thick nitrogen atmosphere and lakes of liquid methane; Enceladus jets water ice into space from a subsurface ocean.`,
    fact: `Saturn's rings are geologically young — probably only 10–100 million years old — which means the dinosaurs saw a ringless Saturn when they looked up at the night sky.`,
  },
  uranus: {
    myth: `Uranus was named after the ancient Greek personification of the sky — Ouranos — the father of the Titans and grandfather of Zeus. Unlike most planets, it was not known to ancient cultures; William Herschel discovered it in 1781. Herschel wanted to name it "Georgium Sidus" (George's Star) after King George III, but the name Uranus — suggested by Johann Bode — prevailed as it followed the tradition of naming planets after classical deities.`,
    science: `Uranus is an ice giant, primarily composed of water, ammonia, and methane ices around a rocky core, rather than hydrogen/helium like Jupiter and Saturn. Its most distinctive feature is its extreme axial tilt of 97.77° — it effectively rolls around the Sun on its side, probably the result of a giant impact early in the Solar System's history. This means its poles receive more sunlight over a Uranian year than its equator, creating the most extreme seasonal variations of any planet.`,
    fact: `Uranus has 27 known moons, all named after characters from Shakespeare's plays and Alexander Pope's poetry — the only planetary system in the Solar System with a literary naming theme.`,
  },
  neptune: {
    myth: `Neptune was named for the Roman god of the sea after its blue-green color suggested water or ocean. In Greek mythology he was Poseidon, wielder of the trident. Unlike the planets known since antiquity, Neptune's existence was mathematically predicted before it was seen: Urbain Le Verrier calculated its position from perturbations in Uranus's orbit, and Johann Gottfried Galle found it within 1° of the predicted location on September 23, 1846 — a triumph of Newtonian mechanics.`,
    science: `Neptune has the fastest winds in the Solar System, reaching 2,100 km/h — faster than the speed of sound on Earth. Its largest moon, Triton, orbits backward and is almost certainly a captured Kuiper Belt Object — a world kidnapped from the outer Solar System billions of years ago, now slowly spiraling inward and predicted to break apart into a ring system in about 3.6 billion years. Neptune generates more internal heat than it receives from the Sun.`,
    fact: `Neptune has completed fewer than one full orbit since its discovery in 1846 — it takes 165 Earth years to go once around the Sun, and its first full post-discovery orbit was completed in 2011.`,
  },
};