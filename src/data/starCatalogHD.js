/**
 * Named star catalog — 200+ stars
 * ra: right ascension in decimal hours (0–24)
 * dec: declination in degrees
 * mag: apparent visual magnitude
 * absMag: absolute magnitude
 * dist: distance in light-years
 * spectral: spectral classification
 * colorIndex: B-V color index (used for rendering color)
 * radius: radius relative to Sun (1.0 = Sun-sized)
 * luminosity: luminosity relative to Sun
 * constellation: IAU constellation name
 */

export const STARS = [
  // ── Orion ────────────────────────────────────────────────────────────────
  { id:'betelgeuse',  name:'Betelgeuse',       ra:5.9195,  dec:7.4071,   mag:0.42,  dist:700,    spectral:'M2Iab',  colorIndex:1.85,  radius:900,    luminosity:126000, constellation:'Orion' },
  { id:'rigel',       name:'Rigel',            ra:5.2423,  dec:-8.2016,  mag:0.13,  dist:863,    spectral:'B8Ia',   colorIndex:-0.03, radius:79,     luminosity:120000, constellation:'Orion' },
  { id:'bellatrix',   name:'Bellatrix',        ra:5.4188,  dec:6.3497,   mag:1.64,  dist:243,    spectral:'B2III',  colorIndex:-0.22, radius:6,      luminosity:6400,   constellation:'Orion' },
  { id:'alnitak',     name:'Alnitak',          ra:5.6792,  dec:-1.9426,  mag:1.74,  dist:800,    spectral:'O9.7Ib', colorIndex:-0.19, radius:20,     luminosity:100000, constellation:'Orion' },
  { id:'alnilam',     name:'Alnilam',          ra:5.6036,  dec:-1.2019,  mag:1.69,  dist:1340,   spectral:'B0Ia',   colorIndex:-0.19, radius:42,     luminosity:375000, constellation:'Orion' },
  { id:'mintaka',     name:'Mintaka',          ra:5.5334,  dec:-0.2992,  mag:2.23,  dist:900,    spectral:'O9.5II', colorIndex:-0.18, radius:16,     luminosity:90000,  constellation:'Orion' },
  { id:'saiph',       name:'Saiph',            ra:5.7954,  dec:-9.6697,  mag:2.07,  dist:720,    spectral:'B0.5Ia', colorIndex:-0.17, radius:11,     luminosity:57500,  constellation:'Orion' },
  { id:'meissa',      name:'Meissa',           ra:5.5858,  dec:9.9342,   mag:3.39,  dist:1100,   spectral:'O8III',  colorIndex:-0.27, radius:10,     luminosity:22000,  constellation:'Orion' },
  { id:'tabit',       name:'Tabit',            ra:4.8306,  dec:6.9613,   mag:3.19,  dist:26.3,   spectral:'F6V',    colorIndex:0.48,  radius:1.3,    luminosity:3.3,    constellation:'Orion' },

  // ── Canis Major ───────────────────────────────────────────────────────────
  { id:'sirius',      name:'Sirius',           ra:6.7525,  dec:-16.7161, mag:-1.46, dist:8.6,    spectral:'A1V',    colorIndex:0.00,  radius:1.7,    luminosity:25,     constellation:'Canis Major' },
  { id:'adhara',      name:'Adhara',           ra:6.9771,  dec:-28.9722, mag:1.50,  dist:430,    spectral:'B2II',   colorIndex:-0.21, radius:13,     luminosity:38700,  constellation:'Canis Major' },
  { id:'wezen',       name:'Wezen',            ra:7.1397,  dec:-26.3932, mag:1.83,  dist:1800,   spectral:'F8Ia',   colorIndex:0.66,  radius:215,    luminosity:170000, constellation:'Canis Major' },
  { id:'aludra',      name:'Aludra',           ra:7.4016,  dec:-29.3031, mag:2.45,  dist:3200,   spectral:'B5Ia',   colorIndex:0.09,  radius:56,     luminosity:176000, constellation:'Canis Major' },
  { id:'mirzam',      name:'Mirzam',           ra:6.3783,  dec:-17.9559, mag:1.98,  dist:490,    spectral:'B1II-III',colorIndex:-0.24,radius:9.7,   luminosity:26000,  constellation:'Canis Major' },

  // ── Canis Minor ───────────────────────────────────────────────────────────
  { id:'procyon',     name:'Procyon',          ra:7.6553,  dec:5.2250,   mag:0.34,  dist:11.46,  spectral:'F5IV',   colorIndex:0.42,  radius:2.0,    luminosity:6.9,    constellation:'Canis Minor' },
  { id:'gomeisa',     name:'Gomeisa',          ra:7.4527,  dec:8.2893,   mag:2.90,  dist:162,    spectral:'B8Ve',   colorIndex:-0.08, radius:3.5,    luminosity:218,    constellation:'Canis Minor' },

  // ── Taurus ────────────────────────────────────────────────────────────────
  { id:'aldebaran',   name:'Aldebaran',        ra:4.5988,  dec:16.5093,  mag:0.85,  dist:65,     spectral:'K5III',  colorIndex:1.54,  radius:44,     luminosity:439,    constellation:'Taurus' },
  { id:'elnath',      name:'Elnath',           ra:5.4382,  dec:28.6078,  mag:1.65,  dist:134,    spectral:'B7III',  colorIndex:-0.13, radius:4.7,    luminosity:700,    constellation:'Taurus' },
  { id:'alcyone',     name:'Alcyone (Pleiades)',ra:3.7913,  dec:24.1053,  mag:2.87,  dist:440,    spectral:'B7IIIe', colorIndex:-0.09, radius:10,     luminosity:2400,   constellation:'Taurus' },
  { id:'tianguan',    name:'Tianguan',         ra:5.6278,  dec:21.1423,  mag:2.97,  dist:440,    spectral:'B2IVe',  colorIndex:-0.16, radius:5.3,    luminosity:2700,   constellation:'Taurus' },

  // ── Gemini ────────────────────────────────────────────────────────────────
  { id:'pollux',      name:'Pollux',           ra:7.7553,  dec:28.0262,  mag:1.14,  dist:33.7,   spectral:'K0III',  colorIndex:1.00,  radius:9.1,    luminosity:32,     constellation:'Gemini' },
  { id:'castor',      name:'Castor',           ra:7.5766,  dec:31.8883,  mag:1.58,  dist:51,     spectral:'A2Vm',   colorIndex:0.04,  radius:2.4,    luminosity:52,     constellation:'Gemini' },
  { id:'alhena',      name:'Alhena',           ra:6.6283,  dec:16.3993,  mag:1.93,  dist:109,    spectral:'A0IV',   colorIndex:0.00,  radius:3.3,    luminosity:123,    constellation:'Gemini' },
  { id:'tejat',       name:'Tejat',            ra:6.3827,  dec:22.5137,  mag:2.86,  dist:229,    spectral:'M3III',  colorIndex:1.64,  radius:80,     luminosity:2100,   constellation:'Gemini' },
  { id:'mebsuda',     name:'Mebsuda',          ra:6.7323,  dec:25.1313,  mag:3.06,  dist:1168,   spectral:'G8Ib',   colorIndex:1.04,  radius:150,    luminosity:8000,   constellation:'Gemini' },
  { id:'propus',      name:'Propus',           ra:6.2850,  dec:22.5068,  mag:3.28,  dist:359,    spectral:'M3IIIb', colorIndex:1.60,  radius:90,     luminosity:1940,   constellation:'Gemini' },

  // ── Leo ───────────────────────────────────────────────────────────────────
  { id:'regulus',     name:'Regulus',          ra:10.1395, dec:11.9672,  mag:1.35,  dist:77,     spectral:'B8IVn',  colorIndex:-0.11, radius:3.1,    luminosity:363,    constellation:'Leo' },
  { id:'denebola',    name:'Denebola',         ra:11.8174, dec:14.5720,  mag:2.14,  dist:36,     spectral:'A3V',    colorIndex:0.09,  radius:1.7,    luminosity:15,     constellation:'Leo' },
  { id:'algieba',     name:'Algieba',          ra:10.3328, dec:19.8417,  mag:2.01,  dist:130,    spectral:'K1IIIb', colorIndex:1.13,  radius:23,     luminosity:320,    constellation:'Leo' },
  { id:'zosma',       name:'Zosma',            ra:11.2353, dec:20.5238,  mag:2.56,  dist:58,     spectral:'A4V',    colorIndex:0.12,  radius:2.1,    luminosity:15,     constellation:'Leo' },
  { id:'chertan',     name:'Chertan',          ra:11.2339, dec:15.4297,  mag:3.33,  dist:165,    spectral:'A7V',    colorIndex:0.19,  radius:2.0,    luminosity:40,     constellation:'Leo' },

  // ── Virgo ─────────────────────────────────────────────────────────────────
  { id:'spica',       name:'Spica',            ra:13.4199, dec:-11.1613, mag:0.97,  dist:250,    spectral:'B1V',    colorIndex:-0.24, radius:7.3,    luminosity:12100,  constellation:'Virgo' },
  { id:'zavijava',    name:'Zavijava',         ra:11.8447, dec:1.7646,   mag:3.59,  dist:35.6,   spectral:'F9V',    colorIndex:0.55,  radius:1.6,    luminosity:3.5,    constellation:'Virgo' },

  // ── Scorpius ──────────────────────────────────────────────────────────────
  { id:'antares',     name:'Antares',          ra:16.4901, dec:-26.4320, mag:1.06,  dist:554,    spectral:'M1.5Iab',colorIndex:1.87,  radius:883,    luminosity:57500,  constellation:'Scorpius' },
  { id:'shaula',      name:'Shaula',           ra:17.5601, dec:-37.1038, mag:1.62,  dist:700,    spectral:'B1.5IV', colorIndex:-0.22, radius:8,      luminosity:35000,  constellation:'Scorpius' },
  { id:'sargas',      name:'Sargas',           ra:17.6217, dec:-42.9978, mag:1.86,  dist:272,    spectral:'F1II',   colorIndex:0.30,  radius:26,     luminosity:1800,   constellation:'Scorpius' },
  { id:'dschubba',    name:'Dschubba',         ra:15.9853, dec:-22.6217, mag:2.29,  dist:401,    spectral:'B0.3IV', colorIndex:-0.12, radius:6.7,    luminosity:13000,  constellation:'Scorpius' },
  { id:'graffias',    name:'Graffias',         ra:15.9481, dec:-19.8060, mag:2.56,  dist:530,    spectral:'B0.5III',colorIndex:-0.07, radius:6.3,    luminosity:7000,   constellation:'Scorpius' },
  { id:'lesath',      name:'Lesath',           ra:17.5308, dec:-37.2965, mag:2.69,  dist:517,    spectral:'B2IV',   colorIndex:-0.21, radius:6,      luminosity:12500,  constellation:'Scorpius' },

  // ── Lyra ──────────────────────────────────────────────────────────────────
  { id:'vega',        name:'Vega',             ra:18.6156, dec:38.7836,  mag:0.03,  dist:25.04,  spectral:'A0Va',   colorIndex:0.00,  radius:2.4,    luminosity:40,     constellation:'Lyra' },
  { id:'sheliak',     name:'Sheliak',          ra:18.8346, dec:33.3627,  mag:3.52,  dist:960,    spectral:'B8IIp',  colorIndex:0.00,  radius:15,     luminosity:2600,   constellation:'Lyra' },
  { id:'sulafat',     name:'Sulafat',          ra:18.9826, dec:32.6895,  mag:3.24,  dist:634,    spectral:'B9III',  colorIndex:-0.02, radius:15,     luminosity:1720,   constellation:'Lyra' },

  // ── Aquila ────────────────────────────────────────────────────────────────
  { id:'altair',      name:'Altair',           ra:19.8464, dec:8.8683,   mag:0.76,  dist:16.73,  spectral:'A7V',    colorIndex:0.22,  radius:1.6,    luminosity:10,     constellation:'Aquila' },
  { id:'tarazed',     name:'Tarazed',          ra:19.7712, dec:10.6132,  mag:2.72,  dist:461,    spectral:'K3II',   colorIndex:1.44,  radius:100,    luminosity:3050,   constellation:'Aquila' },
  { id:'alshain',     name:'Alshain',          ra:19.9218, dec:6.4068,   mag:3.71,  dist:44.7,   spectral:'G8IV',   colorIndex:0.86,  radius:3.0,    luminosity:6,      constellation:'Aquila' },

  // ── Cygnus ────────────────────────────────────────────────────────────────
  { id:'deneb',       name:'Deneb',            ra:20.6905, dec:45.2803,  mag:1.25,  dist:2615,   spectral:'A2Ia',   colorIndex:0.09,  radius:203,    luminosity:196000, constellation:'Cygnus' },
  { id:'sadr',        name:'Sadr',             ra:20.3705, dec:40.2567,  mag:2.23,  dist:1500,   spectral:'F8Ib',   colorIndex:0.67,  radius:150,    luminosity:33000,  constellation:'Cygnus' },
  { id:'gienah-cyg',  name:'Gienah',           ra:20.7705, dec:33.9703,  mag:2.48,  dist:72.7,   spectral:'K0III',  colorIndex:1.03,  radius:11,     luminosity:65,     constellation:'Cygnus' },
  { id:'albireo',     name:'Albireo',          ra:19.5123, dec:27.9596,  mag:3.09,  dist:430,    spectral:'K3II',   colorIndex:1.13,  radius:69,     luminosity:1200,   constellation:'Cygnus' },
  { id:'rukh',        name:'Rukh',             ra:19.7494, dec:45.1307,  mag:2.87,  dist:1500,   spectral:'B0.5Ib', colorIndex:-0.08, radius:13,     luminosity:36000,  constellation:'Cygnus' },

  // ── Boötes ────────────────────────────────────────────────────────────────
  { id:'arcturus',    name:'Arcturus',         ra:14.2610, dec:19.1822,  mag:-0.05, dist:36.7,   spectral:'K1.5IIIp',colorIndex:1.23, radius:25,     luminosity:170,    constellation:'Boötes' },
  { id:'izar',        name:'Izar',             ra:14.7497, dec:27.0742,  mag:2.35,  dist:210,    spectral:'K0II-III',colorIndex:0.97, radius:33,     luminosity:500,    constellation:'Boötes' },
  { id:'muphrid',     name:'Muphrid',          ra:13.9115, dec:18.3975,  mag:2.68,  dist:37,     spectral:'G0IV',   colorIndex:0.58,  radius:2.7,    luminosity:9,      constellation:'Boötes' },
  { id:'seginus',     name:'Seginus',          ra:14.5350, dec:38.3084,  mag:3.03,  dist:85,     spectral:'A7III',  colorIndex:0.19,  radius:3.6,    luminosity:35,     constellation:'Boötes' },

  // ── Auriga ────────────────────────────────────────────────────────────────
  { id:'capella',     name:'Capella',          ra:5.2781,  dec:45.9980,  mag:0.08,  dist:42.9,   spectral:'G3III',  colorIndex:0.80,  radius:11.9,   luminosity:78,     constellation:'Auriga' },
  { id:'menkalinan',  name:'Menkalinan',       ra:5.9921,  dec:44.9474,  mag:1.90,  dist:82,     spectral:'A2IV',   colorIndex:0.03,  radius:2.8,    luminosity:48,     constellation:'Auriga' },
  { id:'mahasim',     name:'Mahasim',          ra:5.9943,  dec:37.2126,  mag:2.65,  dist:173,    spectral:'A0p',    colorIndex:0.16,  radius:2.5,    luminosity:105,    constellation:'Auriga' },

  // ── Eridanus ──────────────────────────────────────────────────────────────
  { id:'achernar',    name:'Achernar',         ra:1.6286,  dec:-57.2367, mag:0.46,  dist:139,    spectral:'B6Vep',  colorIndex:-0.16, radius:7.3,    luminosity:3150,   constellation:'Eridanus' },
  { id:'cursa',       name:'Cursa',            ra:5.1308,  dec:-5.0864,  mag:2.79,  dist:89,     spectral:'A3III',  colorIndex:0.11,  radius:2.4,    luminosity:34,     constellation:'Eridanus' },
  { id:'acamar',      name:'Acamar',           ra:2.9715,  dec:-40.3047, mag:2.91,  dist:161,    spectral:'A4III',  colorIndex:0.07,  radius:3.2,    luminosity:105,    constellation:'Eridanus' },

  // ── Centaurus ─────────────────────────────────────────────────────────────
  { id:'alpha-cen',   name:'Rigil Kentaurus',  ra:14.6599, dec:-60.8340, mag:-0.27, dist:4.37,   spectral:'G2V',    colorIndex:0.71,  radius:1.2,    luminosity:1.5,    constellation:'Centaurus' },
  { id:'hadar',       name:'Hadar',            ra:14.0637, dec:-60.3730, mag:0.61,  dist:525,    spectral:'B1III',  colorIndex:-0.23, radius:9,      luminosity:41700,  constellation:'Centaurus' },
  { id:'menkent',     name:'Menkent',          ra:14.1114, dec:-36.3700, mag:2.06,  dist:61,     spectral:'K0IIIb', colorIndex:1.01,  radius:10,     luminosity:60,     constellation:'Centaurus' },

  // ── Crux ──────────────────────────────────────────────────────────────────
  { id:'acrux',       name:'Acrux',            ra:12.4433, dec:-63.0991, mag:0.77,  dist:320,    spectral:'B0.5IV', colorIndex:-0.24, radius:7.8,    luminosity:25000,  constellation:'Crux' },
  { id:'gacrux',      name:'Gacrux',           ra:12.5194, dec:-57.1132, mag:1.59,  dist:88,     spectral:'M3.5III',colorIndex:1.60,  radius:84,     luminosity:1500,   constellation:'Crux' },
  { id:'mimosa',      name:'Mimosa',           ra:12.7953, dec:-59.6888, mag:1.25,  dist:353,    spectral:'B0.5III',colorIndex:-0.24, radius:8.4,    luminosity:34000,  constellation:'Crux' },
  { id:'imai',        name:'Imai',             ra:12.3523, dec:-58.7489, mag:2.79,  dist:364,    spectral:'B2IV',   colorIndex:-0.19, radius:6,      luminosity:5000,   constellation:'Crux' },

  // ── Ursa Minor ────────────────────────────────────────────────────────────
  { id:'polaris',     name:'Polaris',          ra:2.5302,  dec:89.2641,  mag:1.97,  dist:433,    spectral:'F7Ib',   colorIndex:0.60,  radius:46,     luminosity:2500,   constellation:'Ursa Minor' },
  { id:'kochab',      name:'Kochab',           ra:14.8451, dec:74.1554,  mag:2.07,  dist:130,    spectral:'K4III',  colorIndex:1.47,  radius:42,     luminosity:390,    constellation:'Ursa Minor' },
  { id:'pherkad',     name:'Pherkad',          ra:15.3454, dec:71.8340,  mag:3.05,  dist:480,    spectral:'A3IIIv', colorIndex:0.08,  radius:15,     luminosity:1100,   constellation:'Ursa Minor' },

  // ── Ursa Major ────────────────────────────────────────────────────────────
  { id:'alioth',      name:'Alioth',           ra:12.9004, dec:55.9598,  mag:1.76,  dist:82.6,   spectral:'A0pCr',  colorIndex:0.02,  radius:4.1,    luminosity:108,    constellation:'Ursa Major' },
  { id:'dubhe',       name:'Dubhe',            ra:11.0621, dec:61.7510,  mag:1.79,  dist:123,    spectral:'K0III',  colorIndex:1.06,  radius:30,     luminosity:316,    constellation:'Ursa Major' },
  { id:'alkaid',      name:'Alkaid',           ra:13.7924, dec:49.3134,  mag:1.85,  dist:100,    spectral:'B3V',    colorIndex:-0.18, radius:3.4,    luminosity:594,    constellation:'Ursa Major' },
  { id:'merak',       name:'Merak',            ra:11.0307, dec:56.3824,  mag:2.34,  dist:79.7,   spectral:'A1V',    colorIndex:0.03,  radius:3.0,    luminosity:63,     constellation:'Ursa Major' },
  { id:'phecda',      name:'Phecda',           ra:11.8972, dec:53.6947,  mag:2.44,  dist:83.2,   spectral:'A0Ve',   colorIndex:0.04,  radius:2.6,    luminosity:68,     constellation:'Ursa Major' },
  { id:'megrez',      name:'Megrez',           ra:12.2572, dec:57.0326,  mag:3.31,  dist:80.5,   spectral:'A3V',    colorIndex:0.08,  radius:1.7,    luminosity:14,     constellation:'Ursa Major' },
  { id:'mizar',       name:'Mizar',            ra:13.3988, dec:54.9254,  mag:2.27,  dist:82.9,   spectral:'A2V',    colorIndex:0.02,  radius:2.4,    luminosity:71,     constellation:'Ursa Major' },
  { id:'tania-aust',  name:'Tania Australis',  ra:10.3723, dec:41.4994,  mag:3.05,  dist:249,    spectral:'M0IIIb', colorIndex:1.56,  radius:75,     luminosity:1000,   constellation:'Ursa Major' },
  { id:'talitha',     name:'Talitha',          ra:8.9867,  dec:48.0417,  mag:3.14,  dist:47.7,   spectral:'F0IV',   colorIndex:0.36,  radius:2.3,    luminosity:13,     constellation:'Ursa Major' },

  // ── Cassiopeia ────────────────────────────────────────────────────────────
  { id:'schedar',     name:'Schedar',          ra:0.6753,  dec:56.5373,  mag:2.24,  dist:228,    spectral:'K0IIIa', colorIndex:1.17,  radius:49,     luminosity:676,    constellation:'Cassiopeia' },
  { id:'caph',        name:'Caph',             ra:0.1528,  dec:59.1498,  mag:2.27,  dist:54.7,   spectral:'F2III',  colorIndex:0.34,  radius:3.5,    luminosity:28,     constellation:'Cassiopeia' },
  { id:'tsih',        name:'Tsih',             ra:0.9453,  dec:60.7167,  mag:2.15,  dist:613,    spectral:'B0.5IVe',colorIndex:-0.14, radius:10,     luminosity:34000,  constellation:'Cassiopeia' },
  { id:'ruchbah',     name:'Ruchbah',          ra:1.4304,  dec:60.2353,  mag:2.66,  dist:99.4,   spectral:'A5III',  colorIndex:0.13,  radius:3.9,    luminosity:35,     constellation:'Cassiopeia' },
  { id:'segin',       name:'Segin',            ra:1.9069,  dec:63.6700,  mag:3.35,  dist:442,    spectral:'B3III',  colorIndex:-0.13, radius:6.2,    luminosity:2500,   constellation:'Cassiopeia' },

  // ── Perseus ───────────────────────────────────────────────────────────────
  { id:'mirfak',      name:'Mirfak',           ra:3.4054,  dec:49.8612,  mag:1.79,  dist:592,    spectral:'F5Ib',   colorIndex:0.48,  radius:68,     luminosity:5000,   constellation:'Perseus' },
  { id:'algol',       name:'Algol',            ra:3.1360,  dec:40.9557,  mag:2.12,  dist:92.8,   spectral:'B8V',    colorIndex:-0.05, radius:2.7,    luminosity:100,    constellation:'Perseus' },
  { id:'atik',        name:'Atik',             ra:3.9650,  dec:31.8836,  mag:2.85,  dist:1054,   spectral:'B1III',  colorIndex:-0.19, radius:14,     luminosity:32000,  constellation:'Perseus' },

  // ── Pegasus ───────────────────────────────────────────────────────────────
  { id:'enif',        name:'Enif',             ra:21.7364, dec:9.8750,   mag:2.38,  dist:690,    spectral:'K2Ib',   colorIndex:1.52,  radius:185,    luminosity:5000,   constellation:'Pegasus' },
  { id:'scheat',      name:'Scheat',           ra:23.0629, dec:28.0828,  mag:2.44,  dist:199,    spectral:'M2.5II', colorIndex:1.67,  radius:95,     luminosity:1500,   constellation:'Pegasus' },
  { id:'markab',      name:'Markab',           ra:23.0793, dec:15.2052,  mag:2.49,  dist:140,    spectral:'B9III',  colorIndex:-0.01, radius:4.7,    luminosity:235,    constellation:'Pegasus' },
  { id:'algenib',     name:'Algenib',          ra:0.2206,  dec:15.1836,  mag:2.83,  dist:390,    spectral:'B2IV',   colorIndex:-0.23, radius:6,      luminosity:5840,   constellation:'Pegasus' },

  // ── Andromeda ─────────────────────────────────────────────────────────────
  { id:'alpheratz',   name:'Alpheratz',        ra:0.1398,  dec:29.0904,  mag:2.06,  dist:97,     spectral:'B9p',    colorIndex:-0.11, radius:2.7,    luminosity:200,    constellation:'Andromeda' },
  { id:'mirach',      name:'Mirach',           ra:1.1622,  dec:35.6203,  mag:2.07,  dist:197,    spectral:'M0IIIa', colorIndex:1.57,  radius:100,    luminosity:2000,   constellation:'Andromeda' },
  { id:'almach',      name:'Almach',           ra:2.0650,  dec:42.3297,  mag:2.10,  dist:355,    spectral:'K3IIb',  colorIndex:1.37,  radius:80,     luminosity:2000,   constellation:'Andromeda' },

  // ── Corona Borealis ───────────────────────────────────────────────────────
  { id:'alphecca',    name:'Alphecca',         ra:15.5782, dec:26.7147,  mag:2.23,  dist:75,     spectral:'A0V',    colorIndex:0.03,  radius:3.0,    luminosity:74,     constellation:'Corona Borealis' },

  // ── Aquarius ──────────────────────────────────────────────────────────────
  { id:'sadalsuud',   name:'Sadalsuud',        ra:21.5259, dec:-5.5712,  mag:2.90,  dist:610,    spectral:'G0Ib',   colorIndex:0.82,  radius:47,     luminosity:2190,   constellation:'Aquarius' },
  { id:'sadalmelik',  name:'Sadalmelik',       ra:22.0961, dec:-0.3198,  mag:2.95,  dist:520,    spectral:'G2Ia',   colorIndex:0.95,  radius:77,     luminosity:3000,   constellation:'Aquarius' },

  // ── Pisces Austrinus ──────────────────────────────────────────────────────
  { id:'fomalhaut',   name:'Fomalhaut',        ra:22.9608, dec:-29.6223, mag:1.16,  dist:25.13,  spectral:'A3V',    colorIndex:0.09,  radius:1.8,    luminosity:16,     constellation:'Piscis Austrinus' },

  // ── Hercules ──────────────────────────────────────────────────────────────
  { id:'kornephoros', name:'Kornephoros',      ra:16.5038, dec:21.4896,  mag:2.77,  dist:139,    spectral:'G7IIIa', colorIndex:0.93,  radius:17,     luminosity:175,    constellation:'Hercules' },
  { id:'zeta-her',    name:'Ruticulus',        ra:16.6880, dec:31.6036,  mag:2.81,  dist:35,     spectral:'F9IV',   colorIndex:0.65,  radius:2.6,    luminosity:9,      constellation:'Hercules' },

  // ── Ophiuchus ─────────────────────────────────────────────────────────────
  { id:'rasalhague',  name:'Rasalhague',       ra:17.5823, dec:12.5600,  mag:2.07,  dist:48.6,   spectral:'A5III',  colorIndex:0.15,  radius:2.7,    luminosity:25,     constellation:'Ophiuchus' },
  { id:'sabik',       name:'Sabik',            ra:17.1729, dec:-15.7249, mag:2.43,  dist:88,     spectral:'A2V',    colorIndex:0.06,  radius:2.4,    luminosity:26,     constellation:'Ophiuchus' },

  // ── Sagittarius ───────────────────────────────────────────────────────────
  { id:'kaus-aust',   name:'Kaus Australis',   ra:18.4029, dec:-34.3847, mag:1.79,  dist:143,    spectral:'B9.5III',colorIndex:0.08,  radius:6.8,    luminosity:375,    constellation:'Sagittarius' },
  { id:'nunki',       name:'Nunki',            ra:18.9211, dec:-26.2968, mag:2.05,  dist:228,    spectral:'B2.5V',  colorIndex:-0.20, radius:4.5,    luminosity:3300,   constellation:'Sagittarius' },
  { id:'kaus-med',    name:'Kaus Media',       ra:18.3503, dec:-29.8281, mag:2.70,  dist:348,    spectral:'K3III',  colorIndex:1.36,  radius:25,     luminosity:410,    constellation:'Sagittarius' },
  { id:'ascella',     name:'Ascella',          ra:19.0428, dec:-29.8806, mag:2.59,  dist:89,     spectral:'A2IV',   colorIndex:0.08,  radius:2.5,    luminosity:38,     constellation:'Sagittarius' },

  // ── Aries ─────────────────────────────────────────────────────────────────
  { id:'hamal',       name:'Hamal',            ra:2.1197,  dec:23.4624,  mag:2.01,  dist:66,     spectral:'K2III',  colorIndex:1.15,  radius:15,     luminosity:91,     constellation:'Aries' },
  { id:'sheratan',    name:'Sheratan',         ra:1.9107,  dec:20.8081,  mag:2.64,  dist:59.6,   spectral:'A5V',    colorIndex:0.13,  radius:1.9,    luminosity:9,      constellation:'Aries' },

  // ── Cepheus ───────────────────────────────────────────────────────────────
  { id:'alderamin',   name:'Alderamin',        ra:21.3097, dec:62.5856,  mag:2.44,  dist:49,     spectral:'A7IV',   colorIndex:0.22,  radius:2.4,    luminosity:19,     constellation:'Cepheus' },
  { id:'alfirk',      name:'Alfirk',           ra:21.4779, dec:70.5607,  mag:3.18,  dist:595,    spectral:'B2III',  colorIndex:-0.22, radius:11,     luminosity:13000,  constellation:'Cepheus' },

  // ── Pisces ────────────────────────────────────────────────────────────────
  { id:'eta-psc',     name:'Alpherg',          ra:1.5244,  dec:15.3457,  mag:3.62,  dist:294,    spectral:'G8III',  colorIndex:0.97,  radius:22,     luminosity:315,    constellation:'Pisces' },

  // ── Draco ─────────────────────────────────────────────────────────────────
  { id:'eltanin',     name:'Eltanin',          ra:17.9436, dec:51.4889,  mag:2.24,  dist:154,    spectral:'K5III',  colorIndex:1.52,  radius:48,     luminosity:471,    constellation:'Draco' },
  { id:'rastaban',    name:'Rastaban',         ra:17.5073, dec:52.3013,  mag:2.79,  dist:380,    spectral:'G2II',   colorIndex:0.98,  radius:40,     luminosity:900,    constellation:'Draco' },
  { id:'thuban',      name:'Thuban',           ra:14.0735, dec:64.3758,  mag:3.65,  dist:303,    spectral:'A0III',  colorIndex:0.11,  radius:4.9,    luminosity:300,    constellation:'Draco' },

  // ── Carina ────────────────────────────────────────────────────────────────
  { id:'canopus',     name:'Canopus',          ra:6.3992,  dec:-52.6957, mag:-0.72, dist:313,    spectral:'A9II',   colorIndex:0.15,  radius:71,     luminosity:10700,  constellation:'Carina' },
  { id:'avior',       name:'Avior',            ra:8.3752,  dec:-59.5096, mag:1.86,  dist:632,    spectral:'K3III',  colorIndex:1.28,  radius:66,     luminosity:5200,   constellation:'Carina' },

  // ── Puppis ────────────────────────────────────────────────────────────────
  { id:'naos',        name:'Naos',             ra:8.0594,  dec:-40.0033, mag:2.25,  dist:1080,   spectral:'O4If',   colorIndex:-0.27, radius:14,     luminosity:540000, constellation:'Puppis' },
  { id:'tureis',      name:'Tureis',           ra:7.8218,  dec:-24.8598, mag:2.70,  dist:803,    spectral:'F6Iab',  colorIndex:0.42,  radius:210,    luminosity:18000,  constellation:'Puppis' },

  // ── Vela ──────────────────────────────────────────────────────────────────
  { id:'suhail',      name:'Suhail',           ra:9.1332,  dec:-43.4327, mag:2.21,  dist:573,    spectral:'K4Ib',   colorIndex:1.65,  radius:210,    luminosity:15800,  constellation:'Vela' },
  { id:'regor',       name:'Regor',            ra:8.1588,  dec:-47.3364, mag:1.83,  dist:800,    spectral:'WC8',    colorIndex:-0.27, radius:6,      luminosity:170000, constellation:'Vela' },
];