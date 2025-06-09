import { celestialBodies, type CelestialBodyKey } from "../data/celestial-bodies"

// Calculate optimal scaling factor based on the two selected bodies
export function calculateOptimalScaling(body1Key: CelestialBodyKey, body2Key: CelestialBodyKey) {
  const body1 = celestialBodies[body1Key]
  const body2 = celestialBodies[body2Key]

  const maxRadius = Math.max(body1.radius, body2.radius)
  const minRadius = Math.min(body1.radius, body2.radius)

  // Target: largest object should be around 8-12 units max for good viewport fit
  const targetMaxSize = 10

  // Calculate base scale factor
  let scaleFactor = targetMaxSize / maxRadius

  // Ensure minimum object is still visible (at least 0.1 units)
  const minDisplaySize = 0.1
  const minScaledSize = minRadius * scaleFactor

  if (minScaledSize < minDisplaySize) {
    // If the smaller object would be too small, adjust scaling
    scaleFactor = Math.max(scaleFactor, minDisplaySize / minRadius)
  }

  return scaleFactor
}

// Get display radius for a celestial body with dynamic scaling
export function getDisplayRadius(bodyKey: CelestialBodyKey, scaleFactor: number) {
  const body = celestialBodies[bodyKey]
  const scaledRadius = body.radius * scaleFactor

  // Ensure minimum visibility
  return Math.max(scaledRadius, 0.05)
}
