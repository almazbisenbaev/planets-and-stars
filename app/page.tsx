"use client"

import dynamic from "next/dynamic"

// Dynamically import the component with no SSR to avoid hydration issues
const CelestialComparison = dynamic(() => import("../celestial-comparison"), { ssr: false })

export default function Page() {
  return <CelestialComparison />
}
