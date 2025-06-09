"use client"

import { useRef, useMemo, useEffect } from "react"
import { OrbitControls } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import type { CelestialBodyKey } from "../data/celestial-bodies"
import { calculateOptimalScaling, getDisplayRadius } from "../utils/scaling"
import { Starfield } from "./starfield"
import { CelestialBody } from "./celestial-body"

interface SceneProps {
  body1: CelestialBodyKey
  body2: CelestialBodyKey
}

export function Scene({ body1, body2 }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null!)

  // Calculate optimal scaling factor for the current pair of objects
  const scaleFactor = useMemo(() => {
    return calculateOptimalScaling(body1, body2)
  }, [body1, body2])

  // Calculate display radii using the optimal scaling
  const body1Radius = useMemo(() => getDisplayRadius(body1, scaleFactor), [body1, scaleFactor])
  const body2Radius = useMemo(() => getDisplayRadius(body2, scaleFactor), [body2, scaleFactor])

  const spacing = useMemo(() => {
    // Ensure adequate spacing between objects
    return (body1Radius + body2Radius) * 1.4
  }, [body1Radius, body2Radius])

  // const maxRadius = useMemo(() => {
  //   return Math.max(body1Radius, body2Radius)
  // }, [body1Radius, body2Radius])

  // Auto-zoom effect with proper viewport fitting
  useEffect(() => {
    if (controlsRef.current) {
      // Calculate the total scene width
      const totalSceneWidth = spacing + body1Radius + body2Radius

      // Calculate optimal camera distance
      const fov = 75 // degrees
      const fovRadians = (fov * Math.PI) / 180
      const margin = 1.6 // Comfortable viewing margin
      const requiredDistance = (totalSceneWidth * margin) / (2 * Math.tan(fovRadians / 2))

      // Ensure reasonable distance bounds
      const minDistance = 3
      const maxDistance = 100
      const finalDistance = Math.max(Math.min(requiredDistance, maxDistance), minDistance)

      // Smoothly update camera position
      controlsRef.current.object.position.set(0, 0, finalDistance)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }, [body1, body2, spacing, body1Radius, body2Radius])

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

      <CelestialBody bodyKey={body1} position={[-spacing / 2, 0, 0]} scaleFactor={scaleFactor} />
      <CelestialBody bodyKey={body2} position={[spacing / 2, 0, 0]} scaleFactor={scaleFactor} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        makeDefault
        minDistance={1}
        maxDistance={200}
      />
    </>
  )
}
