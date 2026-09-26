// Diameters are km (equatorial unless diameterKind says otherwise);
// rotation periods are sidereal hours, never substituted orbital periods.
// Obliquity encodes the spin-vector direction. Animate with ABS(period),
// otherwise retrograde Venus/Uranus would be reversed twice.
export const SOLAR_DIAMETER_KM = 1391400;
// IAU 2015 B3 nominal terrestrial equatorial radius, 6.3781e6 metres.
// https://arxiv.org/abs/1510.07674
export const NOMINAL_EARTH_DIAMETER_KM = 12756.2;
// Schwarzschild reference diameter, 4 GM/c². IAU nominal solar mass parameter
// (1.3271244e20 m³/s²); c = 299792458 m/s. Spin is deliberately not assumed.
export function horizonDiameterKm(solarMasses) {
  return (4 * 1.3271244e20 * solarMasses) / 299792458 ** 2 / 1000;
}

function illustratedStar(data) {
  return {
    type: "star", period: null, tilt: null, flattening: 0,
    texture: "2k_sun.jpg", illustrative: true, uncertain: true,
    ...data,
  };
}

function blackHole(data) {
  return {
    type: "black-hole", period: null, tilt: null, flattening: 0,
    color: "#f6bb7c", illustrative: true, uncertain: true,
    diameterKind: "Schwarzschild horizon", ...data,
    diameter: horizonDiameterKm(data.solarMasses),
  };
}

const smallWorldsSource = { label: "NASA small-world rotation data", url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/galileanfact_table.html" };
const satelliteSizesSource = { label: "JPL satellite sizes", url: "https://ssd.jpl.nasa.gov/sats/phys_par/" };
const saturnMoonsSource = { label: "NASA Saturnian satellite data", url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturniansatfact.html" };

function satellite(data) {
  return {
    type: "moon", tilt: null, flattening: 0, diameterKind: "Mean diameter",
    source: satelliteSizesSource, rotationSource: smallWorldsSource,
    texture: `${data.id}_jpl.jpg`, ...data,
  };
}

function exoplanet(data) {
  return {
    type: "exoplanet", period: null, tilt: null, flattening: 0,
    diameterKind: "Estimated diameter", illustrative: true, uncertain: true,
    ...data, diameter: data.earthRadii * NOMINAL_EARTH_DIAMETER_KM,
  };
}

export const BODIES = [
  {
    id: "mercury",
    name: "Mercury",
    type: "planet",
    kind: "Terrestrial planet",
    diameter: 4879,
    period: 1407.6,
    tilt: 0.034,
    flattening: 0,
    color: "#b8afa3",
    texture: "2k_mercury.jpg",
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    kind: "Terrestrial planet",
    diameter: 12104,
    period: -5832.5,
    tilt: 177.4,
    flattening: 0,
    color: "#e6c488",
    texture: "2k_venus_atmosphere.jpg",
  },
  {
    id: "earth",
    name: "Earth",
    type: "planet",
    kind: "Terrestrial planet",
    diameter: 12756.274,
    period: 23.9345,
    tilt: 23.44,
    flattening: 0.003353,
    color: "#76ace1",
    texture: "2k_earth_daymap.jpg",
  },
  {
    id: "moon",
    name: "Moon",
    type: "moon",
    kind: "Natural satellite",
    diameter: 3475,
    period: 655.7,
    tilt: 6.7,
    flattening: 0,
    color: "#c4c3bb",
    texture: "2k_moon.jpg",
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    kind: "Terrestrial planet",
    diameter: 6792,
    period: 24.6229,
    tilt: 25.19,
    flattening: 0.00589,
    color: "#d79272",
    texture: "2k_mars.jpg",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    kind: "Gas giant",
    diameter: 142984,
    period: 9.925,
    tilt: 3.13,
    flattening: 0.06487,
    color: "#dfbc95",
    texture: "2k_jupiter.jpg",
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    kind: "Gas giant",
    diameter: 120536,
    period: 10.656,
    tilt: 26.73,
    flattening: 0.09796,
    color: "#e2c99a",
    texture: "2k_saturn.jpg",
    rings: true,
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    kind: "Ice giant",
    diameter: 51118,
    period: -17.24,
    tilt: 97.77,
    flattening: 0.02293,
    color: "#afe0e4",
    texture: "2k_uranus.jpg",
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "planet",
    kind: "Ice giant",
    diameter: 49528,
    period: 16.11,
    tilt: 28.32,
    flattening: 0.01708,
    color: "#779cdf",
    texture: "2k_neptune.jpg",
  },
  {
    id: "sun",
    name: "Sun",
    type: "star",
    kind: "G-type main sequence",
    diameter: 1391400,
    period: 609.12,
    tilt: 7.25,
    flattening: 0,
    color: "#ffd48b",
    texture: "2k_sun.jpg",
  },
  {
    id: "sirius",
    name: "Sirius A",
    type: "star",
    kind: "A-type main sequence",
    diameter: 1391400 * 1.713,
    period: null,
    tilt: 0,
    flattening: 0,
    color: "#bddcff",
    texture: "2k_sun.jpg",
    illustrative: true,
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse",
    type: "star",
    kind: "Red supergiant",
    diameter: 1391400 * 764,
    period: null,
    tilt: 0,
    flattening: 0,
    color: "#ff986e",
    texture: "2k_sun.jpg",
    illustrative: true,
    uncertain: true,
  },
  illustratedStar({
    id: "proxima", name: "Proxima Centauri", kind: "Red dwarf",
    diameter: SOLAR_DIAMETER_KM * 0.1542, color: "#ffac7e",
    highlight: "Our nearest stellar neighbor",
    note: "A tiny red dwarf. Uses a radius estimate of 0.1542 ± 0.0045 solar radii; surface detail is illustrative.",
    source: { label: "Kervella et al., 2017", url: "https://www.aanda.org/articles/aa/pdf/2017/02/aa29930-16.pdf" },
  }),
  illustratedStar({
    id: "sirius-b", name: "Sirius B", kind: "White dwarf",
    diameter: 12000, color: "#d2e7ff",
    highlight: "A stellar remnant the size of Earth",
    note: "Sirius A’s dense companion: approximately 12,000 km across, slightly smaller than Earth. A rounded ESA/Hubble estimate; surface detail is illustrative.",
    source: { label: "ESA / Hubble", url: "https://esahubble.org/images/heic0516a/" },
  }),
  illustratedStar({
    id: "uy-scuti", name: "UY Scuti", kind: "Red supergiant",
    diameter: SOLAR_DIAMETER_KM * 1708, color: "#ff9361",
    highlight: "One of the largest star candidates",
    note: "Uses the 2013 radius estimate of 1,708 ± 192 solar radii. Distance and atmospheric modeling affect the result; this variable star has no settled size record.",
    source: { label: "Arroyo-Torres et al., 2013", url: "https://eso.org/~mwittkow/publications/refereed/Arroyoetal2013.pdf" },
  }),
  illustratedStar({
    id: "stephenson-2-18", name: "Stephenson 2-18", kind: "Red supergiant candidate",
    diameter: SOLAR_DIAMETER_KM * 2150, color: "#ff8050",
    highlight: "Largest-star contender · disputed",
    note: "Shown at an inferred radius of about 2,150 Suns, using the 2012 luminosity and temperature estimate. Its distance and cluster membership are disputed, so this is not a confirmed largest star.",
    source: { label: "Fok et al., 2012", url: "https://arxiv.org/abs/1209.6427" },
    caveatSource: { label: "Membership uncertainty", url: "https://arxiv.org/abs/1203.4727" },
  }),
  blackHole({
    id: "gw190814", name: "GW190814 companion", kind: "Black hole candidate",
    solarMasses: 2.6, color: "#c5b8ff",
    highlight: "Smallest-black-hole contender",
    note: "The 2.6-solar-mass companion before merger could be a light black hole or a heavy neutron star. This horizon size applies only if it was a black hole; its identity remains unresolved.",
    source: { label: "LIGO / Virgo", url: "https://ligo.org/detections/gw190814/" },
  }),
  blackHole({
    id: "sagittarius-a", name: "Sagittarius A*", kind: "Supermassive black hole",
    solarMasses: 4e6, color: "#ffd39a",
    highlight: "At the heart of the Milky Way",
    note: "Our galaxy’s central black hole. Uses the rounded EHT/ESO mass of 4 million Suns. The modeled horizon is smaller than the dark shadow in telescope images.",
    source: { label: "ESO / EHT, 2022", url: "https://www.eso.org/public/news/eso2208-eht-mw/" },
  }),
  blackHole({
    id: "m87", name: "M87*", kind: "Supermassive black hole",
    solarMasses: 6.5e9, color: "#ffab72",
    highlight: "The first black hole ever imaged",
    note: "Uses the EHT estimate of 6.5 billion solar masses. This comparison shows a nonrotating reference horizon, not the larger shadow or glowing gas seen in the EHT image.",
    source: { label: "ESO / EHT, 2019", url: "https://www.eso.org/public/news/eso1907/" },
  }),
  blackHole({
    id: "ton-618", name: "TON 618", kind: "Ultramassive black hole",
    solarMasses: 66e9, color: "#ffbf80",
    highlight: "Among the largest black holes known",
    note: "Uses NASA’s quoted estimate of 66 billion solar masses. Quasar mass estimates carry large uncertainties; this is a largest-known contender, not a definitive cosmic record.",
    source: { label: "NASA black hole overview", url: "https://science.nasa.gov/universe/black-holes/" },
  }),
  {
    id: "pluto", name: "Pluto", type: "dwarf-planet", kind: "Dwarf planet",
    diameter: 2376, period: -153.2928, tilt: 119.51, flattening: 0,
    color: "#d4bda9", texture: "pluto_nh.jpg",
    highlight: "The icy world with a heart",
    note: "New Horizons revealed Pluto’s heart-shaped ice plain. Uses NASA’s 1,188 km radius and retrograde rotation. The grayscale spacecraft map has uneven resolution and an unobserved south polar region.",
    source: { label: "NASA Pluto fact sheet", url: "https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html" },
  },
  satellite({
    id: "io", name: "Io", kind: "Volcanic moon of Jupiter",
    diameter: 3642.98, period: 42.5, color: "#e4ce73",
    highlight: "The most volcanically active world",
    note: "Tidal heating powers Io’s volcanoes. Shown as a sphere at its mean diameter; rotation is synchronous with Jupiter. Uses a Voyager mosaic with Galileo color.",
  }),
  satellite({
    id: "europa", name: "Europa", kind: "Ocean moon of Jupiter",
    diameter: 3121.6, period: 85.2, color: "#d8c9ac",
    highlight: "An ocean beneath the ice",
    note: "An icy crust conceals a global ocean, making Europa a key target in the search for habitable environments. Uses mean diameter, synchronous rotation and a grayscale Voyager mosaic.",
  }),
  satellite({
    id: "ganymede", name: "Ganymede", kind: "Largest moon of Jupiter",
    diameter: 5262.4, period: 171.7, color: "#aca99f",
    highlight: "Largest moon in the Solar System",
    note: "Larger than Mercury, Ganymede has its own magnetic field. Uses mean diameter, synchronous rotation and a grayscale Voyager mosaic.",
  }),
  satellite({
    id: "callisto", name: "Callisto", kind: "Cratered moon of Jupiter",
    diameter: 4820.6, period: 400.5, color: "#a8a299",
    highlight: "An ancient crater-covered world",
    note: "Jupiter’s heavily cratered outer Galilean moon. Uses mean diameter, synchronous rotation and a grayscale Voyager mosaic.",
  }),
  satellite({
    id: "titan", name: "Titan", kind: "Hazy moon of Saturn",
    diameter: 5149.52, period: 382.7, color: "#dca658", illustrative: true,
    highlight: "Methane lakes and a thick atmosphere",
    note: "Saturn’s largest moon has lakes and seas of liquid hydrocarbons. Size refers to the solid body. The JPL haze illustration uses Voyager-based color; it is carried at the synchronous solid-body rotation rate, not the atmospheric wind speed.",
  }),
  satellite({
    id: "enceladus", name: "Enceladus", kind: "Ocean moon of Saturn",
    diameter: 504.2, period: 1.37 * 24, color: "#e1e6e7", rotationSource: saturnMoonsSource,
    highlight: "Icy geysers above a hidden ocean",
    note: "This small moon ejects water-rich plumes from its south pole. Uses a spherical mean diameter and a rounded 1.37-day synchronous rotation. The Voyager mosaic predates Cassini; plumes and small shape irregularities are not modeled.",
  }),
  satellite({
    id: "mimas", name: "Mimas", kind: "Icy moon of Saturn",
    diameter: 396.4, period: 0.942 * 24, color: "#c3c4bf", rotationSource: saturnMoonsSource,
    highlight: "The Death Star moon",
    note: "Its huge Herschel crater earned Mimas the nickname Death Star moon. Uses a spherical mean diameter and rounded synchronous rotation. The real body is slightly elongated; its shape here is simplified.",
  }),
  satellite({
    id: "triton", name: "Triton", kind: "Retrograde moon of Neptune",
    diameter: 2705.2, period: -141, color: "#d0c2bc",
    highlight: "A captured world orbiting backwards",
    note: "Neptune’s largest moon travels on a retrograde orbit and rotates synchronously. Uses mean diameter and a 141-hour period. The axis direction is a schematic retrograde orientation, not a measured tilt; Voyager mapped only part of the surface.",
  }),
  exoplanet({
    id: "trappist-1-e", name: "TRAPPIST-1 e", kind: "Terrestrial exoplanet",
    earthRadii: 0.92, color: "#b2a194", appearance: "rocky",
    highlight: "An Earth-sized habitable-zone world",
    note: "Uses NASA’s catalog radius of 0.92 Earth radii. Its habitable-zone location does not establish oceans or life. The rocky appearance is illustrative; no surface map or measured spin is available here.",
    source: { label: "NASA exoplanet catalog", url: "https://science.nasa.gov/exoplanet-catalog/trappist-1-e/" },
  }),
  exoplanet({
    id: "55-cancri-e", name: "55 Cancri e", kind: "Hot super-Earth exoplanet",
    earthRadii: 1.875, color: "#e3864c", appearance: "lava",
    highlight: "Janssen · a scorching lava world",
    note: "Also called Janssen. Uses NASA’s catalog radius of 1.875 Earth radii. Its intensely heated surface may be molten; the lava pattern is illustrative, not a photograph. No rotation period is adopted.",
    source: { label: "NASA exoplanet catalog", url: "https://science.nasa.gov/exoplanet-catalog/55-cancri-e/" },
  }),
  exoplanet({
    id: "kepler-22-b", name: "Kepler-22 b", kind: "Super-Earth exoplanet",
    earthRadii: 2.1, color: "#7da8ba", appearance: "cloudy",
    highlight: "A famous habitable-zone discovery",
    note: "Uses NASA’s catalog radius of 2.1 Earth radii. Its composition and surface conditions are uncertain. The blue, cloud-like appearance is an illustration and does not claim a confirmed ocean; rotation is not modeled.",
    source: { label: "NASA exoplanet catalog", url: "https://science.nasa.gov/exoplanet-catalog/kepler-22b/" },
  }),
  illustratedStar({
    id: "trappist-1", name: "TRAPPIST-1", kind: "Ultracool red dwarf",
    diameter: SOLAR_DIAMETER_KM * 0.12, color: "#ff9b73",
    highlight: "A tiny star with seven Earth-sized planets",
    note: "Uses NASA’s rounded radius of 12% of the Sun’s. This planet-hosting star is only a little wider than Jupiter. Surface detail is illustrative; no spin period is adopted.",
    source: { label: "NASA TRAPPIST-1 overview", url: "https://science.nasa.gov/mission/webb/science-overview/science-explainers/what-is-webb-revealing-about-the-trappist-1-system/" },
  }),
  illustratedStar({
    id: "rigel", name: "Rigel", kind: "Blue supergiant",
    diameter: SOLAR_DIAMETER_KM * 75, color: "#a9ceff",
    highlight: "Orion’s brilliant blue supergiant",
    note: "Uses the 75-solar-radius reference model in de Almeida et al. (2022), table 5. Stellar size estimates depend on the adopted model and distance. Surface detail is illustrative; no spin period is adopted.",
    source: { label: "de Almeida et al., 2022", url: "https://arxiv.org/abs/2204.00372" },
  }),
  illustratedStar({
    id: "antares", name: "Antares", kind: "Red supergiant",
    diameter: SOLAR_DIAMETER_KM * 700, color: "#ff9269",
    highlight: "The red heart of Scorpius",
    note: "Uses ESO’s rounded diameter estimate of 700 Suns. Antares has an extended, dynamic atmosphere, so its edge and size are not perfectly fixed. Surface detail is illustrative; no spin period is adopted.",
    source: { label: "ESO / VLTI, 2017", url: "https://www.eso.org/public/news/eso1726/" },
  }),
  blackHole({
    id: "cygnus-x-1", name: "Cygnus X-1", kind: "Stellar-mass black hole",
    solarMasses: 21.2, color: "#aebfff",
    highlight: "The famous X-ray binary black hole",
    note: "Uses the 21.2 ± 2.2 solar-mass estimate of Miller-Jones et al. (2021). Shown as a nonrotating reference horizon; the companion star, accretion disk and actual black-hole spin are omitted.",
    source: { label: "Miller-Jones et al., 2021", url: "https://arxiv.org/abs/2102.09091" },
  }),
];
export const byId = Object.fromEntries(BODIES.map((body) => [body.id, body]));
export const speeds = [1, 60, 600, 3600, 21600, 86400];
export const speedNames = [
  "1 sec/s",
  "1 min/s",
  "10 min/s",
  "1 hr/s",
  "6 hr/s",
  "1 day/s",
];
export function diameterText(n) {
  return n >= 1e12
    ? (n / 1e12).toFixed(2) + " trillion km"
    : n >= 1e9
    ? (n / 1e9).toFixed(2) + " billion km"
    : n >= 1e6
      ? (n / 1e6).toFixed(2) + " million km"
      : n.toLocaleString("en-US", {
          maximumFractionDigits: n < 100 ? 2 : 0,
          ...(n > 0 && n < 0.01 ? { maximumSignificantDigits: 2 } : {}),
        }) + " km";
}

export function bodyDetails(body) {
  return body.type === "black-hole"
    ? `≈ ${body.solarMasses.toLocaleString("en-US")} solar masses · Reference horizon: ${diameterText(body.diameter)}`
    : `Spin: ${periodText(body.period)}${body.period < 0 ? " (retrograde)" : ""} · Tilt: ${body.tilt == null ? "Not modeled" : `${body.tilt}°`}`;
}
export function periodText(n) {
  return n == null
    ? "Not modeled"
    : Math.abs(n) >= 48
      ? (Math.abs(n) / 24).toFixed(1) + " days"
      : Math.abs(n).toFixed(2) + " hours";
}
export function radiusFor(body, selected) {
  return (body.diameter / Math.max(...selected.map((b) => b.diameter))) * 2;
}

export function spinTiltDegrees(body, showTilt) {
  const direction = body.period < 0 ? 180 : 0;
  return showTilt ? (body.tilt ?? direction) : direction;
}

export function matchesBodyFilter(body, filter) {
  return filter === "all" || body.type === filter ||
    (filter === "planet" && body.type === "dwarf-planet");
}
