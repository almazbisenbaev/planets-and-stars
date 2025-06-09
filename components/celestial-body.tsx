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

      {/* Add glow effect for stars */}
      {isStar && (
        <mesh>
          <sphereGeometry args={[displayRadius * 1.1, 32, 32]} />
          <meshBasicMaterial color={body.color} transparent opacity={0.1} />
        </mesh>
      )}

      {/* Add accretion disk glow for black holes */}
      {isBlackHole && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[displayRadius * 1.2, displayRadius * 2, 32]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Add rings for planets that have them */}
      {ringProps && (
        <group>
          {/* Main ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[ringProps.innerRadius, ringProps.outerRadius, ringProps.segments]} />
            <meshBasicMaterial color={ringProps.color} transparent opacity={ringProps.opacity} side={2} />
          </mesh>

          {/* Additional rings */}
          {ringProps.additionalRings.map((ring, index) => (
            <mesh key={index} rotation={[Math.PI / 2, 0, ring.tilt ? Math.PI / 2 : 0]}>
              <ringGeometry args={[ring.innerRadius, ring.outerRadius, ringProps.segments]} />
              <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} side={2} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}
