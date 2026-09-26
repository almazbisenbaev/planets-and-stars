# Planets and Stars

A Next.js App Router application for comparing 36 planets, dwarf planets, exoplanets, moons, stars, and black holes in 3D. The application now lives in the `planets-and-stars/` subfolder of the workspace. Run all npm commands from this directory, where `package.json` lives.

## Stack

- Next.js 16.3.6 and React 19.3.0
- Three.js 0.180.0 with OrbitControls
- JavaScript / JSX and plain CSS
- Local spacecraft-based surface maps with source attribution; procedural exoplanet illustrations

React manages the library, selection, controls, dialogs, and optional WebMCP tools. A browser-only Three.js module owns the canvas and projected labels. It is loaded after mounting and disposes its GPU resources, event listeners, resize observer, and animation loop on unmount, including during React Strict Mode and hot reload.

## Run

Use Node.js 20.9 or newer (Node 22 is recommended; `.nvmrc` is included).

```sh
npm install
npm run dev
```

Open http://localhost:3000. To use the preview port instead:

```sh
npm run dev -- --port 4173
```

For a production server:

```sh
npm run build
npm start
```

No API keys, external service setup, database, or environment variables are required. Fonts load from Google Fonts with system-font fallbacks. All textures are served locally.

## Structure

```text
app/
  layout.jsx                # Site metadata and root layout
  page.jsx                  # App Router entry point
  globals.css               # Original responsive visual design
components/
  PlanetsAndStarsExplorer.jsx # React state, controls, keyboard shortcuts, WebMCP
  CelestialScene.jsx        # Browser-only renderer lifecycle
  ComparisonControls.jsx    # Body library, selected cards, comparison insights
  AboutDialog.jsx           # Data sources and scientific limitations
lib/
  celestial-data.js         # Physical parameters and size calculations
  celestial-scene.js        # Three.js scene, materials, camera, rotation, labels
  comparison.js             # State snapshots and input validation
public/
  textures/                 # Original maps, attribution manifest and credits
  favicon.svg
tests/
  comparison.test.js        # Size, rotation, validation and asset regression checks
```

## Checks

```sh
npm test
npm run build
```

The tests cover every pairwise size ratio, reference horizon calculations, retrograde conventions, unknown stellar spin, invalid comparison requests, catalog filtering, exoplanet unit conversions, and texture assets, licensing and checksums. Browser checks cover React hydration, a single live canvas, control interactions and a mobile viewport.

## Scientific conventions

True scale uses equatorial diameters for the original Solar System planets and Pluto, mean diameters for the added moons, and spherical diameters for stars. Added moons are modeled as spheres, with no adopted axial tilt. Exoplanet catalog radii are converted using the IAU nominal 6,378.1 km equatorial Earth radius; their appearance, composition and spin are not inferred from their orbital periods. Model flattening approximates planetary oblateness. Saturn's main ring spans 1.239–2.27 equatorial radii; it does not simulate each particle or faint outer rings. Sizes are accurate to the adopted data; placement, starting longitude, and tilt azimuth are illustrative. The orthographic camera avoids perspective size distortion.

Axial obliquities greater than 90° already encode retrograde rotation. The animation uses the absolute sidereal period so Venus, Uranus and Pluto are not reversed twice. Triton has no adopted tilt and uses a schematic inverted axis to preserve its retrograde spin direction. A shared time multiplier applies to every modeled rotation. Pausing, hiding the tab, or returning after suspension does not advance the simulation using real wall-clock time. Atmospheric winds and latitude-dependent differential rotation are omitted. The Sun uses the NASA reference period at 16° latitude.

The latest expansion adds Pluto; Io, Europa, Ganymede, Callisto, Titan, Enceladus, Mimas and Triton; TRAPPIST-1 e, 55 Cancri e and Kepler-22 b; TRAPPIST-1, Rigel and Antares; and Cygnus X-1. Exoplanets have their own filter; Pluto appears under Planets with its dwarf-planet classification in Details. Every new entry includes source links, measurement conventions and appearance caveats.

New local maps use NASA/JPL/USGS Voyager mosaics, with Galileo color for Io, an explicitly illustrative Titan haze map, and the July 2015 New Horizons Pluto mosaic. Coverage gaps and grayscale are preserved. Pluto is resampled to 2K for rendering; the other maps are unchanged. See `public/textures/catalog-attribution.json` and `ATTRIBUTION.md`. `node scripts/fetch-catalog-textures.mjs` reproduces these downloads (uses curl and Next’s installed sharp dependency).

All distant stars use tinted solar surface maps as illustrations. They are stationary because no reliable rotation period is adopted. Giant-star radii are uncertain, variable estimates, not precisely known or current instantaneous sizes. Texture colors and lighting are chosen for legibility rather than photometric accuracy.

The extreme-object catalog includes Proxima Centauri, Sirius B, UY Scuti, Stephenson 2-18, the GW190814 companion, Sagittarius A*, M87*, and TON 618. Record contenders carry explicit caveats. Stephenson 2-18's illustrative 2,150-solar-radius estimate is inferred from Fok et al. (2012), table 8 (log L/Lsun = 5.64, Teff = 3200 K), with disputed distance/membership. GW190814's 2.6-solar-mass companion could be a neutron star; its modeled horizon applies only if it was a black hole. TON 618 uses NASA's quoted 66-billion-solar-mass estimate, without claiming a settled record.

Black hole sizes are Schwarzschild reference horizon diameters, D = 4GM/c², using the IAU nominal solar mass parameter 1.3271244e20 m³/s² and c = 299792458 m/s. These are nonrotating reference spheres, not the larger shadow diameter. Their faint edge is only a visibility guide. Accretion, lensing, and black hole spin are not simulated. Every new object includes its measurement source and interpretation in `lib/celestial-data.js`, the Details panel, and Data & help.

At extreme ratios, small bodies can be smaller than one pixel. They retain their true size; use their card to focus. Focus translates and rescales the entire comparison in double precision before rendering, keeping the selected object inspectable even across the roughly 25-billion-fold diameter range. The ruler uses the same conversion. All comparisons use true scale.

## Sources

- NASA planetary data: https://nssdc.gsfc.nasa.gov/planetary/factsheet/
- Individual NASA fact sheets: https://nssdc.gsfc.nasa.gov/planetary/planetfact.html
- Sun: https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
- Sirius A (Davis et al., 2011): https://arxiv.org/abs/1010.3790
- Betelgeuse (Joyce et al., 2020): https://arxiv.org/abs/2006.09837
- Solar System Scope textures, CC BY 4.0: https://www.solarsystemscope.com/textures/

## Controls

Drag to orbit; wheel/pinch to zoom; right-drag or two fingers to pan. Click a body or card to focus. Body labels are hidden by default and can be enabled in Display settings. F fits all objects; Space pauses rotation; / focuses search. Select a card, then Details, for rotation data, full-size measurements and sources; Data & help contains expandable scientific notes and controls. Native controls are keyboard accessible; prefers-reduced-motion starts with rotation paused.

Optional browser WebMCP tools: `read_comparison` and `compare_bodies`. Unsupported browsers continue normally.
