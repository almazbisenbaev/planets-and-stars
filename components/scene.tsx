"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import type { CelestialBodyKey } from "../data/celestial-bodies"
import { calculateRealisticScaling } from "../utils/realistic-scaling"
import { Starfield } from "./starfield"
import { CelestialBody } from "./celestial-body"

interface SceneProps {
  body1: CelestialBodyKey
  body2: CelestialBodyKey
}

export function Scene({ body1, body2 }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null!)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [autoRotationEnabled, setAutoRotationEnabled] = useState(true)

  // Calculate realistic scaling that maintains proportions
  const scalingData = useMemo(() => {
    return calculateRealisticScaling(body1, body2)
  }, [body1, body2])

  // Auto-zoom effect with calculated optimal distance
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 0, scalingData.cameraDistance)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }, [scalingData])

  // Set up event listeners for user interaction detection
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const handleStart = () => {
      if (!hasUserInteracted) {
        setHasUserInteracted(true)
        setAutoRotationEnabled(false)
      }
    }

    // Listen for any control interaction
    controls.addEventListener("start", handleStart)

    return () => {
      controls.removeEventListener("start", handleStart)
    }
  }, [hasUserInteracted])

  // Reset auto-rotation when celestial bodies change
  useEffect(() => {
    setHasUserInteracted(false)
    setAutoRotationEnabled(true)
  }, [body1, body2])

  // Auto-rotation animation
  useFrame((state, delta) => {
    console.log(delta);
    if (autoRotationEnabled && controlsRef.current && !hasUserInteracted) {
      // Slow, gentle rotation around Y-axis
      controlsRef.current.object.position.x = Math.cos(state.clock.elapsedTime * 0.2) * scalingData.cameraDistance
      controlsRef.current.object.position.z = Math.sin(state.clock.elapsedTime * 0.2) * scalingData.cameraDistance
      controlsRef.current.update()
    }
  })

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

      <CelestialBody
        bodyKey={body1}
        position={[-scalingData.spacing / 2, 0, 0]}
        displayRadius={scalingData.body1DisplayRadius}
      />
      <CelestialBody
        bodyKey={body2}
        position={[scalingData.spacing / 2, 0, 0]}
        displayRadius={scalingData.body2DisplayRadius}
      />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        makeDefault
        minDistance={1}
        maxDistance={scalingData.cameraDistance * 4}
      />
    </>
  )
}
