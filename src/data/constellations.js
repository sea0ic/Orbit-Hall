/**
 * Constellation line data — 28 constellations
 * Lines reference star IDs from starCatalogHD.js
 */

export const CONSTELLATIONS = [
  {
    id: 'orion', name: 'Orion',
    labelStar: 'alnilam',
    lines: [
      ['betelgeuse','bellatrix'],
      ['betelgeuse','alnitak'],
      ['bellatrix','mintaka'],
      ['mintaka','alnilam'],['alnilam','alnitak'],
      ['alnitak','saiph'],
      ['mintaka','rigel'],
      ['rigel','saiph'],
      ['bellatrix','meissa'],['betelgeuse','meissa'],
    ],
  },
  {
    id: 'ursa-major', name: 'Ursa Major',
    labelStar: 'alioth',
    lines: [
      ['dubhe','merak'],['merak','phecda'],['phecda','megrez'],['megrez','dubhe'],
      ['megrez','alioth'],['alioth','mizar'],['mizar','alkaid'],
      ['dubhe','talitha'],['merak','talitha'],
      ['phecda','tania-aust'],
    ],
  },
  {
    id: 'ursa-minor', name: 'Ursa Minor',
    labelStar: 'polaris',
    lines: [
      ['polaris','kochab'],['kochab','pherkad'],
    ],
  },
  {
    id: 'canis-major', name: 'Canis Major',
    labelStar: 'sirius',
    lines: [
      ['sirius','mirzam'],
      ['sirius','wezen'],['wezen','adhara'],['adhara','aludra'],
      ['sirius','adhara'],
    ],
  },
  {
    id: 'canis-minor', name: 'Canis Minor',
    labelStar: 'procyon',
    lines: [
      ['procyon','gomeisa'],
    ],
  },
  {
    id: 'taurus', name: 'Taurus',
    labelStar: 'aldebaran',
    lines: [
      ['aldebaran','elnath'],
      ['aldebaran','tianguan'],
    ],
  },
  {
    id: 'gemini', name: 'Gemini',
    labelStar: 'pollux',
    lines: [
      ['pollux','castor'],
      ['pollux','tejat'],
      ['castor','tejat'],
      ['castor','propus'],
      ['pollux','alhena'],
      ['tejat','mebsuda'],['mebsuda','propus'],
    ],
  },
  {
    id: 'leo', name: 'Leo',
    labelStar: 'regulus',
    lines: [
      ['regulus','algieba'],['algieba','zosma'],['zosma','denebola'],
      ['regulus','chertan'],['chertan','zosma'],
      ['algieba','chertan'],
    ],
  },
  {
    id: 'virgo', name: 'Virgo',
    labelStar: 'spica',
    lines: [
      ['spica','zavijava'],
    ],
  },
  {
    id: 'scorpius', name: 'Scorpius',
    labelStar: 'antares',
    lines: [
      ['antares','graffias'],['graffias','dschubba'],
      ['antares','sargas'],['sargas','shaula'],['shaula','lesath'],
    ],
  },
  {
    id: 'lyra', name: 'Lyra',
    labelStar: 'vega',
    lines: [
      ['vega','sheliak'],['sheliak','sulafat'],['sulafat','vega'],
    ],
  },
  {
    id: 'aquila', name: 'Aquila',
    labelStar: 'altair',
    lines: [
      ['altair','tarazed'],['altair','alshain'],
    ],
  },
  {
    id: 'cygnus', name: 'Cygnus',
    labelStar: 'deneb',
    lines: [
      ['deneb','sadr'],['sadr','albireo'],
      ['sadr','gienah-cyg'],['sadr','rukh'],
    ],
  },
  {
    id: 'bootes', name: 'Boötes',
    labelStar: 'arcturus',
    lines: [
      ['arcturus','izar'],['arcturus','muphrid'],
      ['izar','seginus'],
    ],
  },
  {
    id: 'auriga', name: 'Auriga',
    labelStar: 'capella',
    lines: [
      ['capella','menkalinan'],['menkalinan','mahasim'],
      ['capella','elnath'],['elnath','mahasim'],
    ],
  },
  {
    id: 'eridanus', name: 'Eridanus',
    labelStar: 'achernar',
    lines: [
      ['achernar','acamar'],['acamar','cursa'],
    ],
  },
  {
    id: 'centaurus', name: 'Centaurus',
    labelStar: 'alpha-cen',
    lines: [
      ['alpha-cen','hadar'],['hadar','menkent'],
    ],
  },
  {
    id: 'crux', name: 'Crux',
    labelStar: 'acrux',
    lines: [
      ['acrux','gacrux'],
      ['mimosa','imai'],
    ],
  },
  {
    id: 'cassiopeia', name: 'Cassiopeia',
    labelStar: 'schedar',
    lines: [
      ['caph','schedar'],['schedar','tsih'],['tsih','ruchbah'],['ruchbah','segin'],
    ],
  },
  {
    id: 'perseus', name: 'Perseus',
    labelStar: 'mirfak',
    lines: [
      ['mirfak','algol'],['mirfak','atik'],
    ],
  },
  {
    id: 'pegasus', name: 'Pegasus',
    labelStar: 'enif',
    lines: [
      ['markab','scheat'],['scheat','alpheratz'],['alpheratz','algenib'],['algenib','markab'],
      ['markab','enif'],
    ],
  },
  {
    id: 'andromeda', name: 'Andromeda',
    labelStar: 'alpheratz',
    lines: [
      ['alpheratz','mirach'],['mirach','almach'],
    ],
  },
  {
    id: 'corona-bor', name: 'Corona Borealis',
    labelStar: 'alphecca',
    lines: [],
  },
  {
    id: 'hercules', name: 'Hercules',
    labelStar: 'kornephoros',
    lines: [
      ['kornephoros','zeta-her'],
    ],
  },
  {
    id: 'ophiuchus', name: 'Ophiuchus',
    labelStar: 'rasalhague',
    lines: [
      ['rasalhague','sabik'],
    ],
  },
  {
    id: 'sagittarius', name: 'Sagittarius',
    labelStar: 'kaus-aust',
    lines: [
      ['kaus-aust','kaus-med'],['kaus-med','nunki'],
      ['kaus-aust','ascella'],['ascella','nunki'],
    ],
  },
  {
    id: 'draco', name: 'Draco',
    labelStar: 'eltanin',
    lines: [
      ['eltanin','rastaban'],['rastaban','thuban'],
    ],
  },
  {
    id: 'carina', name: 'Carina',
    labelStar: 'canopus',
    lines: [
      ['canopus','avior'],
    ],
  },
];