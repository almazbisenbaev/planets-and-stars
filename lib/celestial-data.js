// Diameters are equatorial (km); periods are sidereal (hours).
// Obliquity encodes the spin-vector direction. Animate with ABS(period),
// otherwise retrograde Venus/Uranus would be reversed twice.
export const SOLAR_DIAMETER_KM = 1391400;
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
