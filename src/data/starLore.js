/**
 * Star lore — mythology, history, science
 * Keyed by star id matching starCatalogHD.js
 *
 * Each entry:
 *   myth:    cultural / mythological background
 *   science: physical facts in plain language
 *   history: discovery, naming, astronomical significance
 *   fact:    one striking single-sentence fact
 */

export const STAR_LORE = {
  sirius: {
    myth: `Ancient Egyptians called Sirius "Sopdet" and watched its annual heliacal rising — the moment it first reappears in the dawn sky — as a precise herald of the Nile flood and the start of their new year. The Greek name Sirius derives from Σείριος (Seirios), meaning "scorching" or "glowing." Romans called it Canicula, the "little dog," giving us the term "Dog Days" for the hot, oppressive weeks when Sirius rises with the Sun each July and August.`,
    science: `Sirius A is an A-type main-sequence star burning roughly twice as hot as the Sun, with a surface temperature around 9,940 K. Its brilliant appearance (magnitude −1.46) is partly due to proximity: at just 8.6 light-years, it is the fifth closest stellar system to Earth. Its companion, Sirius B — the "Pup" — is a white dwarf, the burned-out remnant of a star that was once much larger than Sirius A, now compressed to roughly Earth's size.`,
    history: `Edmond Halley discovered in 1718 that Sirius had shifted measurably from its ancient catalog position, proving for the first time that stars have their own proper motions across the sky. In 1844 Friedrich Bessel deduced from Sirius's wobbling path that it had an unseen companion; the white dwarf Sirius B was directly observed by Alvan Graham Clark in 1862.`,
    fact: `If you replaced the Sun with Sirius A, Earth would receive about 25 times more radiation and the oceans would boil away.`,
  },

  betelgeuse: {
    myth: `The Arabic name Betelgeuse (originally Ibt al-Jauzah) means "the armpit of the central one," referring to Orion the Hunter. In medieval star charts it was sometimes rendered as "Beit Algueze" — the house of the twins — through a mistranslation. Across cultures, Orion was one of humanity's oldest recognized asterisms: in ancient Mesopotamia the stars were the great hunter Gilgamesh or the shepherd Anu; for the Aztecs, they were the fire-drilling stars used to light the new fire ceremony.`,
    science: `Betelgeuse is a red supergiant of staggering proportions: if placed at the center of our Solar System, its surface would extend past the orbit of Jupiter. It is a pulsating variable star, expanding and contracting over periods of hundreds to thousands of days, which explains its famous "Great Dimming" in 2019–2020 when it faded dramatically, triggering speculation about imminent supernova. Analysis later attributed the dimming to a massive surface ejection that created a dust cloud.`,
    history: `Betelgeuse is nearing the end of its life and will explode as a supernova — likely within the next 100,000 years. When it does, it will be visible in daylight for weeks and bright enough to cast shadows at night. Astronomers John Martin and others used infrared imaging to detect the enormous convective cells on its surface, making Betelgeuse one of the first stars beyond the Sun to be directly resolved as a disk.`,
    fact: `Betelgeuse is so large that light takes more than six hours to travel from one side of the star to the other.`,
  },

  rigel: {
    myth: `Rigel's name comes from the Arabic Rijl Jauzah al-Yusrā — "the left foot of the central one" — referring to Orion. In Egyptian mythology, the star was associated with Sah, the god of the stars and a manifestation of Osiris, with Orion's belt pointing toward the Nile. Medieval Islamic astronomers charted Rigel with great precision and used it as a key navigation star.`,
    science: `Rigel is a blue-white supergiant approximately 860 light-years away, yet it appears as one of the brightest stars in the sky — testament to its extraordinary luminosity of around 120,000 Suns. Its surface blazes at roughly 12,100 K. Rigel is a multiple star system; its primary has at least two companions, with Rigel B itself being a close spectroscopic binary.`,
    history: `Rigel's intense ultraviolet output illuminates the Witch Head Nebula (IC 2118), a reflection nebula several degrees west of the star. The star is moving through space at high velocity and will eventually leave the Orion OB1 stellar association where it was born roughly 8 million years ago.`,
    fact: `Rigel is so luminous that if it were as close as Sirius, it would cast shadows as sharp as the Moon's and be bright enough to read by.`,
  },

  vega: {
    myth: `Vega forms one corner of the Summer Triangle alongside Deneb and Altair. In Chinese legend, Vega is Zhī Nǚ — the Weaving Girl — a celestial princess separated from her cowherd lover Niú Láng (Altair) by the Milky Way. Once a year on the seventh day of the seventh lunar month, magpies form a bridge across the galaxy so the lovers can briefly reunite — still celebrated as the Qixi Festival. In Arabic tradition, Vega was al-Nasr al-Wāqi', "the swooping eagle."`,
    science: `Vega is an A0-type main-sequence star 25 light-years away, about twice the Sun's mass and 40 times its luminosity. It rotates so rapidly — completing a full rotation in about 12.5 hours compared to the Sun's 25 days — that centrifugal force flattens its poles and makes the equator noticeably cooler and dimmer than the polar regions. Vega's gravity-darkened equator is a landmark discovery in stellar physics.`,
    history: `Vega was the first star to be photographed, captured by John Adams Whipple and William Cranch Bond on July 16–17, 1850. Because of Earth's axial precession, Vega was the pole star around 12,000 BCE and will serve as pole star again around the year 13,727 CE. It served as the primary calibration standard for the magnitude system for over a century.`,
    fact: `Vega's disk of debris — the first ever detected around a normal star (in 1983 by the IRAS satellite) — may harbor the building blocks of a planetary system.`,
  },

  arcturus: {
    myth: `Arcturus means "guardian of the bear" in Greek — a reference to its proximity to Ursa Major and Ursa Minor, the great and little bears, which it follows across the sky. In Polynesian navigation, Arcturus (Hokule'a, "star of joy") was the zenith star for Hawaii, used to navigate from Tahiti across 2,500 miles of open ocean. The traditional Polynesian voyaging canoe Hōkūle'a takes its name from this star.`,
    science: `Arcturus is an orange giant 36.7 light-years away and the brightest star in the northern celestial hemisphere. At roughly 25 times the Sun's diameter, it is in the red-giant phase of stellar evolution, having exhausted the hydrogen in its core. Its surface temperature is about 4,300 K — cooler and more orange than the Sun — yet it outshines our star by 170 times due to its size.`,
    history: `Arcturus was the first star (other than the Sun) to be observed in daylight with a telescope, by astronomer Jean-Baptiste Morin in 1635. The star moves across the sky at an unusually high proper motion, about 2.3 arcseconds per year — reflecting its origin in a population of old halo stars that passed through the galactic disk on a different orbit from most of our neighborhood.`,
    fact: `In 1933, Arcturus's light — arriving after a journey of 37 years — was focused onto a photoelectric cell to switch on the lights at the Chicago World's Fair, chosen because its light had last left the star during the previous World's Fair in 1893.`,
  },

  capella: {
    myth: `Capella means "little she-goat" in Latin, and the star is associated with Amalthea, the goat that suckled the infant Zeus (Jupiter) in Cretan mythology. One of her horns, accidentally broken, became the Cornucopia — the horn of plenty. The Inuit called it Sivulliit ("the first ones"), part of a group of stars representing hunters pursuing a polar bear.`,
    science: `Capella is actually a spectroscopic binary — two giant stars so close together that no telescope can visually separate them, revealed only by the Doppler shifts in their combined spectrum. Both are G-type giants, similar in spectral class to the Sun but vastly larger: Capella Aa is 78 times the Sun's luminosity, Capella Ab about 78 times as well. They orbit each other every 104 days at a separation less than the distance from Earth to the Sun.`,
    history: `Capella's binary nature was discovered by William Wallace Campbell and W. H. Wright at Lick Observatory in 1899 using the Doppler shift method. It is one of the brightest X-ray sources in the sky (because of the violent magnetic activity in the two interacting giants) and was one of the first stellar X-ray sources detected by rocket-borne instruments in the 1970s.`,
    fact: `Despite appearing as a single golden star, Capella is actually two stars orbiting so close that if you could shrink the Solar System down to fit both of them, there would still be room for Jupiter's orbit between them.`,
  },

  aldebaran: {
    myth: `Aldebaran is Arabic for "the follower," named because it appears to follow the Pleiades cluster across the sky each night. It has been called the "Eye of Taurus" since antiquity and was one of the four Royal Stars of ancient Persia (around 3000 BCE), believed to hold power over the four cardinal directions. As Tascheter, it was the watcher of the East.`,
    science: `Aldebaran is an orange giant 65 light-years away, about 44 times the Sun's diameter, with a ruddy surface temperature of about 3,900 K. Although it lies in the direction of the Hyades cluster — the V-shaped asterism that forms the Bull's face — Aldebaran is not a member; it is roughly half the cluster's distance from us and merely appears projected against it from our vantage point.`,
    history: `On January 19, 1997, Aldebaran was occulted by the Moon — one of a series of such events useful for measuring the star's angular diameter. The star's diameter was first accurately measured interferometrically in the 20th century. Voyager 1, launched in 1977, is heading in the general direction of Aldebaran and will pass within 2 light-years of it in about 1.5 million years.`,
    fact: `In about 5 billion years, when the Sun swells into a red giant, it will roughly resemble Aldebaran — but by then, Aldebaran itself will have long since shed its outer layers and become a white dwarf.`,
  },

  polaris: {
    myth: `Polaris's role as pole star gave it special status across cultures: the Norse called it Leiðarstjarna — "the leading star" — while it was the "pivot star" in China, around which all other stars revolved like a royal court around the emperor. Native American nations used it as a fixed point for navigation and in stories: the Pawnee, for example, associated it with a chief whose authority was eternal and unchanging, just as the star never moves.`,
    science: `Polaris currently sits within 0.7° of the true north celestial pole — close enough for naked-eye navigation but not perfectly aligned. It is a Cepheid variable, pulsating over a period of about 3.97 days, though this variation has been shrinking and may have briefly stopped in recent years. Polaris is itself a triple star system: the supergiant primary (Polaris Aa) has a close companion (Ab) and a more distant third star.`,
    history: `Polaris became the North Star around 500 CE as Earth's axis slowly precessed; before that, Thuban in Draco held the role. Ancient Egyptian pyramids were aligned not to Polaris but to Thuban. Polaris will be closest to the pole around 2102, then drift away, and the role will eventually pass to Gamma Cephei in about 3,000 years and Vega in about 14,000 years.`,
    fact: `Polaris is approximately 2,500 times more luminous than the Sun — the dim, steady appearance that makes it so useful for navigation is purely a consequence of its distance of 433 light-years.`,
  },

  deneb: {
    myth: `Deneb means "tail" in Arabic (short for Dhanab al-Dajajah, "the tail of the hen"), as Cygnus the Swan flies south along the Milky Way with Deneb at its tail. In Chinese astronomy, Deneb was part of the "Celestial Ford" (Tiānjīn) crossing the Silver River — the Milky Way — where the Weaving Girl and Cowherd meet. Japanese tradition places Deneb at the tip of the annual celestial bridge of Tanabata.`,
    science: `Deneb is one of the most luminous stars known, estimated to shine with the power of roughly 196,000 Suns. Its distance — around 2,600 light-years — is surprisingly uncertain even today, because the star is too far for direct parallax measurement with pre-Gaia precision. Despite that enormous distance, it ranks among the brightest stars in the sky, which speaks to its almost incomprehensible intrinsic power. Its surface temperature is about 8,500 K.`,
    history: `Deneb anchors the North America Nebula (NGC 7000), a spectacular emission nebula just 3° east of the star that is actually illuminated by Deneb's ultraviolet radiation. Deneb also lies near the "Cygnus Rift," a dark lane of interstellar dust that splits the Milky Way into two apparent streams as seen from Earth.`,
    fact: `If Deneb were placed at the distance of Sirius (8.6 light-years), it would appear roughly 500 times brighter than Venus and cast distinct shadows at night.`,
  },

  antares: {
    myth: `The name Antares comes from the Greek Ἀντάρης — "rival of Ares (Mars)" — because its red color and brightness so closely mimic the planet Mars that ancient observers often confused the two when Mars passed through Scorpius. In Mesopotamian astronomy, Antares was the star of the god Lisi, the guardian deity of battle. It was another of the four Royal Stars of ancient Persia, Satevis, the watcher of the West.`,
    science: `Antares is one of the largest stars visible to the naked eye: a red supergiant some 700–800 times the Sun's diameter. Placed at our Sun's position, it would swallow Mercury, Venus, Earth, and Mars and extend halfway to Jupiter. Its surface temperature is about 3,500 K — cool enough for titanium oxide molecules to form, giving it a deep reddish-amber color. Antares is in a late stage of stellar evolution and, like Betelgeuse, will eventually end in a supernova.`,
    history: `Antares has a faint blue-green companion star, Antares B, about 5 arcseconds distant, normally invisible in the red giant's glare but sometimes revealed during lunar occultations. In 2017, VLTI interferometry produced the first detailed images of Antares's surface, revealing enormous convective plumes unlike anything seen on the Sun.`,
    fact: `Antares is losing mass so fast that if you could gather all the gas streaming off it in a single year, it would weigh more than half the Moon.`,
  },

  altair: {
    myth: `Altair (from Arabic al-Nasr al-Ṭā'ir, "the soaring eagle") is one corner of the Summer Triangle. In Chinese legend, Altair is Niú Láng — the Cowherd — whose love affair with the Weaving Girl (Vega) across the Milky Way inspired the Qixi (Tanabata) Festival. In ancient Mesopotamia, the star was associated with the eagle of the god Marduk. Medieval Arab sailors used the three stars that form Altair's "shoulders" and "body" as a navigation triplet.`,
    science: `Altair is an A-type main-sequence star 16.7 light-years away — one of our nearest neighbors. Like Vega, it rotates extraordinarily fast: one full rotation in under nine hours. This spin distorts it into an oblate shape, making its equatorial diameter about 20% wider than its polar diameter. Space interferometry has directly imaged this flattening, making Altair one of the few stars besides the Sun to be seen as an actual resolved, non-circular disk.`,
    history: `In 2007, astronomers using CHARA array interferometry produced the first image revealing Altair's oblate shape and the gravity-darkening of its equatorial belt. Altair is one of the 58 stars selected for use in celestial navigation and appears on the list of navigational stars used by the US Navy.`,
    fact: `Altair spins so fast that its equatorial surface moves at about 286 km/s — nearly 200 times faster than the Sun's equatorial rotation — meaning a day on Altair lasts less than nine hours.`,
  },

  procyon: {
    myth: `Procyon is Greek for "before the dog" — it rises in temperate northern latitudes shortly before Sirius, the Dog Star. The ancient Egyptians saw it as part of the celestial jackal Anubis, god of the dead. In some Arabic traditions it was known as al-Shi'ra al-Shamiyya, "the Syrian Shi'ra," to distinguish it from Sirius (al-Shi'ra al-Yamaniyya, the "Yemenite Shi'ra").`,
    science: `Procyon A is an F-type subgiant 11.46 light-years from Earth, in the process of expanding as it exhausts its core hydrogen. Like Sirius, it has a white dwarf companion — Procyon B — discovered in 1896. Procyon B is extraordinarily dim: about 10.7 magnitude, packed into a sphere roughly twice Earth's diameter but with roughly 60% the mass of the Sun.`,
    history: `Friedrich Bessel predicted Procyon's unseen companion in 1844 — the same year he predicted Sirius B — based on the wobble in Procyon's proper motion. It took another 52 years before John Martin Schaeberle actually saw Procyon B through the 36-inch refractor at Lick Observatory in 1896.`,
    fact: `Procyon B is one of the hottest known white dwarfs, with a surface temperature of around 7,740 K — but because it is so tiny, it glows no brighter than a 100-watt bulb seen from across a large city.`,
  },

  spica: {
    myth: `Spica represents the sheaf of wheat held in the left hand of Virgo the Maiden. In ancient Greek mythology, Virgo was often identified with Demeter (Ceres), goddess of the harvest. Spica was sometimes seen as the "ear of grain" — the bounty of the harvest season. Hipparchus used Spica to measure the precession of the equinoxes around 127 BCE, one of the greatest observational achievements in ancient astronomy.`,
    science: `Spica is a spectroscopic binary: two massive blue-white stars orbiting each other every 4.01 days, so close that tidal forces distort them both into ellipsoidal shapes. The primary is a B1-type giant about 7 times the Sun's radius and over 12,000 times its luminosity; the secondary is slightly smaller. Because of their rapid orbit and tidal distortion, Spica is also one of the few binary systems that generates detectable gravitational radiation.`,
    history: `Hipparchus's comparison of Spica's position to older Babylonian records in 127 BCE led to his discovery that the equinoxes slowly shift against the background stars — the phenomenon of axial precession. Without this observation, our understanding of Earth's long-term climate cycles and calendar history would have been set back by centuries.`,
    fact: `The two stars in the Spica binary are close enough that each one would appear larger than our Moon does in the sky if seen from the surface of the other.`,
  },

  fomalhaut: {
    myth: `Fomalhaut (from Arabic فم الحوت Fum al-Ḥūt — "mouth of the whale" or "mouth of the southern fish") has been known since antiquity as a lone, brilliant star in an otherwise dim region of sky. It was one of the four Royal Stars of ancient Persia, known as Hastorang, the watcher of the South. Arab sailors of the Persian Gulf used it as a key navigational star for southern voyages.`,
    science: `Fomalhaut is a young A-type main-sequence star 25 light-years away, only about 200–300 million years old. Its most striking feature is a vast ring of dusty debris encircling the star at a distance of about 140 AU, sculpted into a remarkably sharp-edged, narrow belt. The ring's structure is consistent with the gravitational influence of at least one large planet, making Fomalhaut one of the most studied debris disk systems.`,
    history: `In 2008, a Hubble Space Telescope team led by Paul Kalas announced the first direct optical image of a candidate exoplanet, called Fomalhaut b (later nicknamed "Fomalhaut b" in popular culture). Subsequent analysis showed the object may have been a disrupted comet cloud rather than a planet, but the discovery launched a decade of intensive study and remains controversial. The debris ring itself is one of the most beautiful structures in stellar astronomy.`,
    fact: `Fomalhaut's debris ring is so precisely circular and narrow that it would stretch from the Sun out past Pluto three times over, yet it is only as wide as the distance between the Sun and Uranus.`,
  },

  canopus: {
    myth: `Canopus was named after the chief helmsman of the Greek king Menelaus, who supposedly died near the Egyptian city of Canopus (modern Abu Qir) after the Trojan War. The city itself was named after the star, or vice versa — the etymology is disputed. Ancient Egyptians associated the star with the south and used its night-sky path to orient their maps of the underworld. In Arabic, it was Suhayl — a name that became a general word for "bright southern star" across the Middle East.`,
    science: `Canopus is an F-type bright giant 313 light-years away — the second brightest star in the entire sky. Its distance means its true luminosity is extraordinary: roughly 10,700 times the Sun. At 71 solar radii across, it dwarfs our star but is not in the same class as red supergiants; its yellow-white color hints at a surface temperature around 7,400 K.`,
    history: `Too far south to be seen from most of Europe and the Middle East, Canopus was well known to navigators throughout the Indian Ocean, Pacific, and Southern Hemisphere. NASA's star trackers and spacecraft attitude-control systems have used Canopus as a reference star for decades, because it is the brightest star easily visible from spacecraft that orbit in the ecliptic plane — it is almost perpendicular to the ecliptic. The Canopus star tracker was used aboard Cassini, Voyager, and many other deep-space probes.`,
    fact: `Space agencies chose Canopus as a navigation reference for interplanetary probes because its extreme brightness and unique sky position make it unmistakable — it has guided humanity's robots to Mars, Jupiter, Saturn, and beyond.`,
  },

  algol: {
    myth: `Algol's name comes from Arabic ra's al-ghūl — "the head of the ghoul" — and it was known in antiquity as "the Demon Star." Its reputation for malevolence comes from its eerie, regular fading: even without a telescope, patient observers noticed that Algol dims and brightens like a slow pulse. Ancient Egyptians may have recorded its cycle in the Cairo Calendar (c. 1200 BCE), using it to identify unlucky days — making it possibly the oldest known record of a variable star.`,
    science: `Algol is the prototype of an entire class of variable stars: eclipsing binaries. A larger but dimmer orange subgiant eclipses the brighter blue-white primary every 2 days, 20 hours, and 49 minutes with clock-like regularity, dropping the system's combined light from magnitude 2.1 to 3.4. Paradoxically, the dimmer star is actually larger — a phenomenon called the "Algol Paradox" that puzzled astronomers until stellar evolution theory explained it: the larger star evolved faster, became a giant, and transferred mass to the now-brighter companion.`,
    history: `The periodic nature of Algol's variability was first documented scientifically by the Italian astronomer Geminiano Montanari in 1667, and its eclipsing mechanism was correctly deduced by the deaf-mute amateur astronomer John Goodricke in 1783 — a remarkable feat of reasoning that earned him the Copley Medal. Goodricke died at 21 from pneumonia possibly contracted during his nocturnal observations, but his short career transformed variable star astronomy.`,
    fact: `Algol's eclipses are so regular that you can set an alarm for them: they repeat to within seconds every 2 days, 20 hours, 48 minutes, and 56 seconds — nature's own astronomical clock.`,
  },
};