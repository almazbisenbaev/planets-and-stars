"use client"

import type * as THREE from "three"
import { useMemo, useRef } from "react"

export function Starfield() {
  const starsRef = useRef<THREE.Group>(null!)

  const stars = useMemo(() => {
    const starArray = []
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      const z = (Math.random() - 0.5) * 2000
      starArray.push([x, y, z])
    }
    return starArray
  }, [])

  return (
    <group ref={starsRef}>
      {stars.map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <sphereGeometry args={[0.5, 4, 4]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      ))}
    </group>
  )
}
