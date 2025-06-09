import type { CelestialBodyKey } from "../data/celestial-bodies"

export interface RingProperties {
  innerRadius: number
  outerRadius: number
  color: string
  opacity: number
  segments: number
}

// Get ring properties based on the body
export function getRingProperties(bodyKey: CelestialBodyKey, displayRadius: number): RingProperties | null {
  switch (bodyKey) {
    case "saturn":
      return {
        innerRadius: displayRadius * 1.2,
        outerRadius: displayRadius * 2.2,
        color: "#D4AF37",
        opacity: 0.4,
        segments: 64,
      }
    case "jupiter":
      return {
        innerRadius: displayRadius * 1.1,
        outerRadius: displayRadius * 1.3,
        color: "#8B4513",
        opacity: 0.15,
        segments: 32,
      }
    case "uranus":
      return {
        innerRadius: displayRadius * 1.2,
        outerRadius: displayRadius * 1.6,
        color: "#4FD0E7",
        opacity: 0.25,
        segments: 32,
      }
    case "neptune":
      return {
        innerRadius: displayRadius * 1.15,
        outerRadius: displayRadius * 1.4,
        color: "#4B70DD",
        opacity: 0.2,
        segments: 32,
      }
    default:
      return null
  }
}

// Check if a celestial body has rings
export function hasRings(bodyKey: CelestialBodyKey): boolean {
  return bodyKey === "saturn" || bodyKey === "jupiter" || bodyKey === "uranus" || bodyKey === "neptune"
}
