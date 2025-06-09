import { celestialBodies, type CelestialBodyKey } from "../data/celestial-bodies"

export interface ScaledObjectData {
  displayRadius: number
  actualRadius: number
  scaleFactor: number
}

export interface ViewportScaling {
  body1: ScaledObjectData
  body2: ScaledObjectData
  spacing: number
  cameraDistance: number
  globalScaleFactor: number
}

/**
 * Calculate viewport-optimized scaling for two celestial bodies
 * Ensures both objects are clearly visible while maintaining their relative size relationship
 */
export function calculateViewportScaling(body1Key: CelestialBodyKey, body2Key: CelestialBodyKey): ViewportScaling {
  const body1 = celestialBodies[body1Key]
  const body2 = celestialBodies[body2Key]

  // Define viewport constraints
  const MAX_OBJECT_SIZE = 8 // Maximum size any object should be in the scene
  const MIN_OBJECT_SIZE = 0.3 // Minimum size to ensure visibility
  const IDEAL_LARGE_SIZE = 6 // Ideal size for the larger object
  const IDEAL_SMALL_SIZE = 1.5 // Ideal size for the smaller object when size difference is extreme

  // Determine which is larger
  const largerRadius = Math.max(body1.radius, body2.radius)
  const smallerRadius = Math.min(body1.radius, body2.radius)
  const sizeRatio = largerRadius / smallerRadius

  let largerDisplaySize: number
  let smallerDisplaySize: number

  if (sizeRatio <= 10) {
    // Small difference: maintain proportional scaling
    largerDisplaySize = IDEAL_LARGE_SIZE
    smallerDisplaySize = (smallerRadius / largerRadius) * IDEAL_LARGE_SIZE

    // Ensure smaller object isn't too small
    if (smallerDisplaySize < MIN_OBJECT_SIZE) {
      smallerDisplaySize = MIN_OBJECT_SIZE
      largerDisplaySize = (largerRadius / smallerRadius) * MIN_OBJECT_SIZE

      // Cap the larger object if it becomes too big
      if (largerDisplaySize > MAX_OBJECT_SIZE) {
        const scale = MAX_OBJECT_SIZE / largerDisplaySize
        largerDisplaySize = MAX_OBJECT_SIZE
        smallerDisplaySize = smallerDisplaySize * scale
      }
    }
  } else if (sizeRatio <= 100) {
    // Medium difference: compromise between proportion and visibility
    largerDisplaySize = IDEAL_LARGE_SIZE
    smallerDisplaySize = Math.max((smallerRadius / largerRadius) * IDEAL_LARGE_SIZE, MIN_OBJECT_SIZE * 1.5)
  } else {
    // Extreme difference: prioritize visibility over exact proportions
    largerDisplaySize = IDEAL_LARGE_SIZE
    smallerDisplaySize = IDEAL_SMALL_SIZE
  }

  // Calculate individual scale factors
  const largerScaleFactor = largerDisplaySize / largerRadius
  const smallerScaleFactor = smallerDisplaySize / smallerRadius

  // Assign to correct bodies
  const body1Data: ScaledObjectData = {
    displayRadius: body1.radius === largerRadius ? largerDisplaySize : smallerDisplaySize,
    actualRadius: body1.radius,
    scaleFactor: body1.radius === largerRadius ? largerScaleFactor : smallerScaleFactor,
  }

  const body2Data: ScaledObjectData = {
    displayRadius: body2.radius === largerRadius ? largerDisplaySize : smallerDisplaySize,
    actualRadius: body2.radius,
    scaleFactor: body2.radius === largerRadius ? largerScaleFactor : smallerScaleFactor,
  }

  // Calculate optimal spacing
  const spacing = (body1Data.displayRadius + body2Data.displayRadius) * 1.8

  // Calculate camera distance to fit everything comfortably
  const totalSceneWidth = spacing + body1Data.displayRadius + body2Data.displayRadius
  const fov = 75 * (Math.PI / 180) // Convert to radians
  const margin = 1.4
  const cameraDistance = Math.max(
    (totalSceneWidth * margin) / (2 * Math.tan(fov / 2)),
    5, // Minimum distance
  )

  return {
    body1: body1Data,
    body2: body2Data,
    spacing,
    cameraDistance,
    globalScaleFactor: Math.min(largerScaleFactor, smallerScaleFactor), // For reference
  }
}

/**
 * Get size comparison text that accounts for the scaling applied
 */
export function getSizeComparisonText(body1Key: CelestialBodyKey, body2Key: CelestialBodyKey): string {
  const body1 = celestialBodies[body1Key]
  const body2 = celestialBodies[body2Key]

  const ratio = body1.radius / body2.radius

  if (ratio > 1) {
    if (ratio > 1000) {
      return `${body1.name} is ${(ratio / 1000).toFixed(1)}k times larger`
    } else if (ratio > 100) {
      return `${body1.name} is ${Math.round(ratio)} times larger`
    } else {
      return `${body1.name} is ${ratio.toFixed(1)} times larger`
    }
  } else {
    const inverseRatio = 1 / ratio
    if (inverseRatio > 1000) {
      return `${body2.name} is ${(inverseRatio / 1000).toFixed(1)}k times larger`
    } else if (inverseRatio > 100) {
      return `${body2.name} is ${Math.round(inverseRatio)} times larger`
    } else {
      return `${body2.name} is ${inverseRatio.toFixed(1)} times larger`
    }
  }
}
