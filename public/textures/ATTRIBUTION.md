# Celestial texture assets

Textures by [Solar System Scope](https://www.solarsystemscope.com/textures/) / INOVE, licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Downloaded without modification on 2026-09-26.

All sphere maps are 2048 × 1024 JPEGs. Saturn’s ring is a 2048 × 125 RGBA PNG. The JSON manifest records every original URL, byte count and SHA-256 checksum.

These source maps combine NASA imagery/elevation data with tuned colors and some fictional filling of unmapped areas. Colors are deliberately somewhat saturated. Earth uses a composite with abundant vegetation and relatively little snow; the cloud map is static. These are educational visualization assets, not calibrated scientific products.

For Three.js, treat visible colors as sRGB. Earth clouds are a JPEG without alpha: use luminance as `alphaMap` on a white transparent shell. Saturn ring PNG already contains alpha; map U across ring radius and V around azimuth. Use Venus atmosphere for the visible cloud-covered exterior, and surface only in an explicit surface view.
