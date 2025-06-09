import { celestialBodies, type CelestialBodyKey } from "../data/celestial-bodies"

export interface RealisticScaling {
  body1DisplayRadius: number
  body2DisplayRadius: number
  spacing: number
  cameraDistance: number
  scaleFactor: number
}

/**
 * Calculate realistic scaling that maintains true proportions
 * while ensuring both objects fit in the viewport
 */
export function calculateRealisticScaling(body1Key: CelestialBodyKey, body2Key: CelestialBodyKey): RealisticScaling {
  const body1 = celestialBodies[body1Key]
  const body2 = celestialBodies[body2Key]

  // Find the larger object to base our scaling on
  const maxRadius = Math.max(body1.radius, body2.radius)

  // Target size for the largest object in the scene
  // This ensures the largest object fits comfortably in viewport
  const targetMaxSize = 8

  // Calculate a single scale factor that applies to both objects
  // This maintains realistic proportions
  const scaleFactor = targetMaxSize / maxRadius

  // Apply the same scale factor to both objects
  const body1DisplayRadius = Math.max(body1.radius * scaleFactor, 0.02) // Minimum visibility
  const body2DisplayRadius = Math.max(body2.radius * scaleFactor, 0.02) // Minimum visibility

  // Calculate spacing based on scaled sizes
  const spacing = (body1DisplayRadius + body2DisplayRadius) * 1.5

  // Calculate camera distance to fit the scene
  const totalSceneWidth = spacing + body1DisplayRadius + body2DisplayRadius
  const fov = 75 * (Math.PI / 180)
  const margin = 1.3
  const cameraDistance = Math.max((totalSceneWidth * margin) / (2 * Math.tan(fov / 2)), 3)

  return {
    body1DisplayRadius,
    body2DisplayRadius,
    spacing,
    cameraDistance,
    scaleFactor,
  }
}
