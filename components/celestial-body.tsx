"use client"

import { useMemo } from "react"
import { type CelestialBodyKey, celestialBodies } from "../data/celestial-bodies"
import { hasRings, getRingProperties } from "../utils/ring-properties"

interface CelestialBodyProps {
  bodyKey: CelestialBodyKey
  position: [number, number, number]
  displayRadius: number
}

export function CelestialBody({ bodyKey, position, displayRadius }: CelestialBodyProps) {
  const body = celestialBodies[bodyKey]

  // Determine if this is a star (self-luminous)
  const isStar = body.details.type.toLowerCase().includes("star") || bodyKey === "sun"

  // Determine if this is a black hole
  const isBlackHole = bodyKey === "blackHole"

  // Determine if this is a planet (reflects light)
  const isPlanet =
    body.details.type.toLowerCase().includes("planet") ||
    body.details.type.toLowerCase().includes("satellite") ||
    bodyKey === "moon"

  // Get ring properties if the body has rings
  const ringProps = useMemo(() => {
    if (hasRings(bodyKey)) {
      return getRingProperties(bodyKey, displayRadius)
    }
    return null
  }, [bodyKey, displayRadius])

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[displayRadius, 64, 64]} />
        {isStar ? (
          // Stars glow and emit light - use basic material for self-luminous objects
          <meshBasicMaterial color={body.color} />
        ) : isBlackHole ? (
          // Black holes are completely dark with no reflection
          <meshBasicMaterial color="#000000" transparent opacity={0.9} />
        ) : (
          // Planets and other bodies reflect light realistically
          <meshStandardMaterial color={body.color} metalness={0.1} roughness={0.8} />
        )}
      </mesh>

      {/* Add strong glow effect for stars */}
      {isStar && (
        <>
          <mesh>
            <sphereGeometry args={[displayRadius * 1.1, 32, 32]} />
            <meshBasicMaterial color={body.color} transparent opacity={0.2} />
          </mesh>
          <mesh>
            <sphereGeometry args={[displayRadius * 1.2, 24, 24]} />
            <meshBasicMaterial color={body.color} transparent opacity={0.1} />
          </mesh>
        </>
      )}

      {/* Add subtle atmospheric glow for planets */}
      {isPlanet && !isBlackHole && (
        <mesh>
          <sphereGeometry args={[displayRadius * 1.05, 32, 32]} />
          <meshBasicMaterial
            color={body.color}
            transparent
            opacity={0.08}
            side={2} // DoubleSide to ensure visibility from all angles
          />
        </mesh>
      )}

      {/* Add accretion disk glow for black holes */}
      {isBlackHole && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[displayRadius * 1.2, displayRadius * 2, 32]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Simple planetary rings */}
      {ringProps && (
        <mesh rotation={[Math.PI / 2, 0, bodyKey === "uranus" ? Math.PI / 2 : 0]}>
          <ringGeometry args={[ringProps.innerRadius, ringProps.outerRadius, ringProps.segments]} />
          <meshBasicMaterial color={ringProps.color} transparent opacity={ringProps.opacity} side={2} />
        </mesh>
      )}
    </group>
  )
}
