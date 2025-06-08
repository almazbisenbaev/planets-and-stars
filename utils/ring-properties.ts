import type { CelestialBodyKey } from "../data/celestial-bodies"

export interface AdditionalRing {
  innerRadius: number
  outerRadius: number
  color: string
  opacity: number
  tilt?: boolean
}

export interface RingProperties {
  innerRadius: number
  outerRadius: number
  color: string
  opacity: number
  segments: number
  additionalRings: AdditionalRing[]
}

// Get ring properties based on the body
export function getRingProperties(bodyKey: CelestialBodyKey, displayRadius: number): RingProperties | null {
  switch (bodyKey) {
    case "saturn":
      return {
        innerRadius: displayRadius * 1.2,
        outerRadius: displayRadius * 2.3,
        color: "#D4AF37",
        opacity: 0.6,
        segments: 64,
        additionalRings: [
          {
            innerRadius: displayRadius * 1.4,
            outerRadius: displayRadius * 1.6,
            color: "#F5DEB3",
            opacity: 0.4,
          },
          {
            innerRadius: displayRadius * 1.7,
            outerRadius: displayRadius * 1.9,
            color: "#DDD",
            opacity: 0.3,
          },
          {
            innerRadius: displayRadius * 2.0,
            outerRadius: displayRadius * 2.2,
            color: "#C0C0C0",
            opacity: 0.2,
          },
        ],
      }
    case "jupiter":
      return {
        innerRadius: displayRadius * 1.1,
        outerRadius: displayRadius * 1.4,
        color: "#8B4513",
        opacity: 0.2,
        segments: 32,
        additionalRings: [],
      }
    case "uranus":
      return {
        innerRadius: displayRadius * 1.3,
        outerRadius: displayRadius * 1.8,
        color: "#4FD0E7",
        opacity: 0.3,
        segments: 32,
        additionalRings: [
          {
            innerRadius: displayRadius * 1.15,
            outerRadius: displayRadius * 1.25,
            color: "#87CEEB",
            opacity: 0.15,
            tilt: true,
          },
          {
            innerRadius: displayRadius * 1.35,
            outerRadius: displayRadius * 1.45,
            color: "#B0E0E6",
            opacity: 0.1,
            tilt: true,
          },
        ],
      }
    case "neptune":
      return {
        innerRadius: displayRadius * 1.2,
        outerRadius: displayRadius * 1.6,
        color: "#4B70DD",
        opacity: 0.25,
        segments: 32,
        additionalRings: [],
      }
    default:
      return null
  }
}

// Check if a celestial body has rings
export function hasRings(bodyKey: CelestialBodyKey): boolean {
  return bodyKey === "saturn" || bodyKey === "jupiter" || bodyKey === "uranus" || bodyKey === "neptune"
}
