# Celestial texture assets

Textures by [Solar System Scope](https://www.solarsystemscope.com/textures/) / INOVE, licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Downloaded without modification on 2026-09-26.

The original Solar System Scope sphere maps are 2048 × 1024 JPEGs. Saturn’s ring is a 2048 × 125 RGBA PNG. The JSON manifest records every original URL, byte count and SHA-256 checksum.

These source maps combine NASA imagery/elevation data with tuned colors and some fictional filling of unmapped areas. Colors are deliberately somewhat saturated. Earth uses a composite with abundant vegetation and relatively little snow; the cloud map is static. These are educational visualization assets, not calibrated scientific products.

For Three.js, treat visible colors as sRGB. Earth clouds are a JPEG without alpha: use luminance as `alphaMap` on a white transparent shell. Saturn ring PNG already contains alpha; map U across ring radius and V around azimuth. Use Venus atmosphere for the visible cloud-covered exterior, and surface only in an explicit surface view.

## Expanded catalog maps

NASA/JPL maps are used under the [JPL Image Use Policy](https://www.jpl.nasa.gov/jpl-image-use-policy/). Credits are shown in the application’s Data & help panel. Original URLs, dimensions and checksums are recorded in `catalog-attribution.json`.

- `io_jpl.jpg` — NASA/JPL-Caltech; David Seal. [Source](https://space.jpl.nasa.gov/tmaps/jupiter.html). Voyager mosaic with Galileo color; polar coverage is incomplete. Changes: none.
- `europa_jpl.jpg` — NASA/JPL-Caltech/USGS. [Source](https://space.jpl.nasa.gov/tmaps/jupiter.html). Cleaned Voyager grayscale mosaic. Changes: none.
- `ganymede_jpl.jpg` — NASA/JPL-Caltech/USGS. [Source](https://space.jpl.nasa.gov/tmaps/jupiter.html). Cleaned Voyager grayscale mosaic. Changes: none.
- `callisto_jpl.jpg` — NASA/JPL-Caltech/USGS. [Source](https://space.jpl.nasa.gov/tmaps/jupiter.html). Cleaned Voyager grayscale mosaic. Changes: none.
- `mimas_jpl.jpg` — NASA/JPL-Caltech/USGS. [Source](https://space.jpl.nasa.gov/tmaps/saturn.html). Cleaned Voyager mosaic. Changes: none.
- `enceladus_jpl.jpg` — NASA/JPL-Caltech/USGS. [Source](https://space.jpl.nasa.gov/tmaps/saturn.html). Cleaned Voyager mosaic; predates Cassini. Changes: none.
- `titan_jpl.jpg` — NASA/JPL-Caltech; David Seal. [Source](https://space.jpl.nasa.gov/tmaps/saturn.html). Illustrative haze map by David Seal with Voyager-based color; not a surface map. Changes: none.
- `triton_jpl.jpg` — NASA/JPL-Caltech/USGS. [Source](https://space.jpl.nasa.gov/tmaps/neptune.html). Limited Voyager coverage; unmapped regions remain visible. Changes: none.
- `pluto_nh.jpg` — NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute. [Source](https://www.jpl.nasa.gov/images/pia19858-global-map-of-pluto/). New Horizons July 2015 grayscale mosaic. Resolution varies greatly; the unobserved south polar region is blank. Changes: Resampled to 2048 × 1024; JPEG quality 90.

The three exoplanets use code-generated procedural materials and CSS thumbnails, not downloaded or measured surface maps. Distant stars retain the credited Solar System Scope solar texture as an illustration.
