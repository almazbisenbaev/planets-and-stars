"use client"

import { useRef, useMemo, useEffect } from "react"
import { OrbitControls } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { type CelestialBodyKey, celestialBodies } from "../data/celestial-bodies"
import { Starfield } from "./starfield"
import { CelestialBody } from "./celestial-body"

interface SceneProps {
  body1: CelestialBodyKey
  body2: CelestialBodyKey
}

export function Scene({ body1, body2 }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null!)
  const body1Data = celestialBodies[body1]
  const body2Data = celestialBodies[body2]

  // Calculate positions to center both bodies
  const body1Radius = useMemo(() => {
    if (body1Data.radius > 20) return Math.log(body1Data.radius) * 2
    if (body1Data.radius > 5) return body1Data.radius * 0.8
    return Math.max(body1Data.radius, 0.1)
  }, [body1Data.radius])

  const body2Radius = useMemo(() => {
    if (body2Data.radius > 20) return Math.log(body2Data.radius) * 2
    if (body2Data.radius > 5) return body2Data.radius * 0.8
    return Math.max(body2Data.radius, 0.1)
  }, [body2Data.radius])

  const spacing = (body1Radius + body2Radius) * 1.5
  const maxRadius = Math.max(body1Radius, body2Radius)

  // Auto-zoom effect
  useEffect(() => {
    if (controlsRef.current) {
      const distance = Math.max(spacing + maxRadius * 2, 10)
      controlsRef.current.object.position.set(0, 0, distance)
      controlsRef.current.update()
    }
  }, [body1, body2, spacing, maxRadius])

  return (
    <>
      <Starfield />

      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.2} />

      {/* Main directional light (like sunlight) */}
      <directionalLight
        position={[10, 10, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Secondary fill light */}
      <pointLight position={[-10, 5, 5]} intensity={0.5} color="#4080ff" />

      {/* Rim light for dramatic effect */}
      <pointLight position={[0, 0, -15]} intensity={0.3} color="#ffffff" />

      <CelestialBody bodyKey={body1} position={[-spacing / 2, 0, 0]} />
      <CelestialBody bodyKey={body2} position={[spacing / 2, 0, 0]} />

      <OrbitControls ref={controlsRef} enablePan={false} enableZoom={true} enableRotate={true} makeDefault />
    </>
  )
}
