"use client"

import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "react-error-boundary"
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react"
import { Scene } from "./components/scene"
import { CelestialBodyModal } from "./components/celestial-body-modal"
import { celestialBodies, type CelestialBodyKey } from "./data/celestial-bodies"
import { useMobile } from "./hooks/use-mobile"

// Fallback component for error boundary
function FallbackComponent() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h2 className="text-xl mb-4">Something went wrong with the 3D rendering</h2>
        <p>Please refresh the page to try again</p>
      </div>
    </div>
  )
}

export default function Component() {
  const [selectedBody1, setSelectedBody1] = useState<CelestialBodyKey>("earth")
  const [selectedBody2, setSelectedBody2] = useState<CelestialBodyKey>("mars")
  const [mounted, setMounted] = useState(false)
  const [isControlsExpanded, setIsControlsExpanded] = useState(false)
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)
  const isMobile = useMobile()

  // Only mount the Canvas after the component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-collapse on mobile when selection changes
  useEffect(() => {
    if (isMobile) {
      setIsControlsExpanded(false)
      setIsInfoExpanded(false)
    }
  }, [selectedBody1, selectedBody2, isMobile])

  // Auto-expand on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsControlsExpanded(true)
      setIsInfoExpanded(true)
    }
  }, [isMobile])

  const body1Data = celestialBodies[selectedBody1]
  const body2Data = celestialBodies[selectedBody2]

  const handleBody1Change = (value: string) => {
    setSelectedBody1(value as CelestialBodyKey)
  }

  const handleBody2Change = (value: string) => {
    setSelectedBody2(value as CelestialBodyKey)
  }

  return (
    <div className="w-full h-screen bg-black cursor-grab active:cursor-grabbing">
      <div className="absolute top-4 left-4 z-10 space-y-4 w-80 max-w-[calc(100vw-2rem)]">
        {/* Controls Card */}
        <Card className="bg-black/20 backdrop-blur-md border-white/10">
          <CardHeader
            className={`${isMobile ? "cursor-pointer" : ""} pb-2`}
            onClick={() => isMobile && setIsControlsExpanded(!isControlsExpanded)}
          >
            <CardTitle className="text-white flex items-center justify-between">
              <span>Celestial Body Comparison</span>
              {isMobile && (
                <Button variant="ghost" size="sm" className="text-white p-1 h-auto">
                  {isControlsExpanded ? <ChevronUp size={16} /> : <Menu size={16} />}
                </Button>
              )}
            </CardTitle>
          </CardHeader>

          {(!isMobile || isControlsExpanded) && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">First Body</label>
                <Select value={selectedBody1} onValueChange={handleBody1Change}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {Object.entries(celestialBodies).map(([key, body]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                        {body.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Second Body</label>
                <Select value={selectedBody2} onValueChange={handleBody2Change}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {Object.entries(celestialBodies).map(([key, body]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                        {body.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 w-full mt-2"
                  onClick={() => setIsControlsExpanded(false)}
                >
                  <X size={14} className="mr-1" />
                  Close
                </Button>
              )}
            </CardContent>
          )}
        </Card>

        {/* Info Card */}
        <Card className="bg-black/20 backdrop-blur-md border-white/10">
          <CardHeader
            className={`${isMobile ? "cursor-pointer" : ""} pb-2`}
            onClick={() => isMobile && setIsInfoExpanded(!isInfoExpanded)}
          >
            <CardTitle className="text-white flex items-center justify-between text-base">
              <span>Comparison Details</span>
              {isMobile && (
                <Button variant="ghost" size="sm" className="text-white p-1 h-auto">
                  {isInfoExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              )}
            </CardTitle>
          </CardHeader>

          {(!isMobile || isInfoExpanded) && (
            <CardContent className="pt-2 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: body1Data.color }} />
                <div className="min-w-0 flex-1">
                  <div>
                    <CelestialBodyModal bodyKey={selectedBody1} />
                  </div>
                  <div className="text-sm text-gray-400">Radius: {body1Data.radius.toFixed(2)}x Earth</div>
                  <div className="text-xs text-gray-500 truncate">{body1Data.description}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: body2Data.color }} />
                <div className="min-w-0 flex-1">
                  <div>
                    <CelestialBodyModal bodyKey={selectedBody2} />
                  </div>
                  <div className="text-sm text-gray-400">Radius: {body2Data.radius.toFixed(2)}x Earth</div>
                  <div className="text-xs text-gray-500 truncate">{body2Data.description}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-700">
                <div className="text-sm text-gray-300">
                  <strong>Size Ratio:</strong>{" "}
                  <span className="block sm:inline mt-1 sm:mt-0">
                    {body1Data.radius > body2Data.radius
                      ? `${body1Data.name} is ${(body1Data.radius / body2Data.radius).toFixed(1)}x larger`
                      : `${body2Data.name} is ${(body2Data.radius / body1Data.radius).toFixed(1)}x larger`}
                  </span>
                </div>
              </div>

              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 w-full mt-2"
                  onClick={() => setIsInfoExpanded(false)}
                >
                  <X size={14} className="mr-1" />
                  Close
                </Button>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      {mounted && (
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <Canvas
            camera={{ position: [0, 0, 15], fov: 75 }}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            frameloop="demand"
            shadows
          >
            <Suspense fallback={null}>
              <Scene body1={selectedBody1} body2={selectedBody2} />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      )}
    </div>
  )
}
