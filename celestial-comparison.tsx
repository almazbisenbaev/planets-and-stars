"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type * as THREE from "three"

// Celestial body data with detailed information
const celestialBodies = {
  sun: {
    name: "Sun",
    radius: 109,
    color: "#FDB813",
    description: "Our star",
    details: {
      type: "G-type main-sequence star",
      mass: "1.989 × 10³⁰ kg",
      temperature: "5,778 K (surface)",
      age: "4.6 billion years",
      composition: "73% hydrogen, 25% helium",
      facts: [
        "Contains 99.86% of the Solar System's mass",
        "Could fit 1.3 million Earths inside it",
        "Surface gravity is 28 times stronger than Earth's",
        "Nuclear fusion converts 600 million tons of hydrogen to helium every second",
      ],
    },
  },
  mercury: {
    name: "Mercury",
    radius: 0.383,
    color: "#8C7853",
    description: "Closest to Sun",
    details: {
      type: "Terrestrial planet",
      mass: "3.301 × 10²³ kg",
      temperature: "427°C (day), -173°C (night)",
      age: "4.5 billion years",
      composition: "Large iron core, thin silicate mantle",
      facts: [
        "Has the most eccentric orbit of all planets",
        "One day on Mercury lasts 176 Earth days",
        "No atmosphere to retain heat",
        "Has water ice in permanently shadowed craters",
      ],
    },
  },
  venus: {
    name: "Venus",
    radius: 0.949,
    color: "#FFC649",
    description: "Hottest planet",
    details: {
      type: "Terrestrial planet",
      mass: "4.867 × 10²⁴ kg",
      temperature: "462°C (surface)",
      age: "4.5 billion years",
      composition: "96.5% CO₂ atmosphere, sulfuric acid clouds",
      facts: [
        "Hottest planet in the solar system",
        "Rotates backwards (retrograde rotation)",
        "Atmospheric pressure 92 times that of Earth",
        "Often called Earth's 'evil twin'",
      ],
    },
  },
  earth: {
    name: "Earth",
    radius: 1,
    color: "#6B93D6",
    description: "Our home planet",
    details: {
      type: "Terrestrial planet",
      mass: "5.972 × 10²⁴ kg",
      temperature: "15°C (average)",
      age: "4.54 billion years",
      composition: "78% nitrogen, 21% oxygen atmosphere",
      facts: [
        "Only known planet with life",
        "71% of surface covered by water",
        "Has one natural satellite (the Moon)",
        "Magnetic field protects from solar radiation",
      ],
    },
  },
  mars: {
    name: "Mars",
    radius: 0.532,
    color: "#CD5C5C",
    description: "The red planet",
    details: {
      type: "Terrestrial planet",
      mass: "6.417 × 10²³ kg",
      temperature: "-65°C (average)",
      age: "4.5 billion years",
      composition: "Iron oxide (rust) gives red color",
      facts: [
        "Has the largest volcano in the solar system (Olympus Mons)",
        "Day length similar to Earth (24h 37m)",
        "Has polar ice caps made of water and CO₂",
        "Evidence suggests it once had liquid water",
      ],
    },
  },
  jupiter: {
    name: "Jupiter",
    radius: 11.21,
    color: "#D8CA9D",
    description: "Largest planet",
    details: {
      type: "Gas giant",
      mass: "1.898 × 10²⁷ kg",
      temperature: "-110°C (cloud tops)",
      age: "4.5 billion years",
      composition: "89% hydrogen, 10% helium",
      facts: [
        "Has over 80 known moons",
        "Great Red Spot is a storm larger than Earth",
        "Acts as a 'cosmic vacuum cleaner' protecting inner planets",
        "Has faint rings discovered in 1979",
      ],
    },
  },
  saturn: {
    name: "Saturn",
    radius: 9.45,
    color: "#FAD5A5",
    description: "Has prominent rings",
    details: {
      type: "Gas giant",
      mass: "5.683 × 10²⁶ kg",
      temperature: "-140°C (cloud tops)",
      age: "4.5 billion years",
      composition: "96% hydrogen, 3% helium",
      facts: [
        "Less dense than water - would float!",
        "Ring system spans 282,000 km but only 10m thick",
        "Has 146 confirmed moons including Titan",
        "Hexagonal storm at north pole",
      ],
    },
  },
  uranus: {
    name: "Uranus",
    radius: 4.01,
    color: "#4FD0E7",
    description: "Ice giant",
    details: {
      type: "Ice giant",
      mass: "8.681 × 10²⁵ kg",
      temperature: "-195°C",
      age: "4.5 billion years",
      composition: "Water, methane, and ammonia ices",
      facts: [
        "Rotates on its side (98° axial tilt)",
        "Has faint rings discovered in 1977",
        "Coldest planetary atmosphere in solar system",
        "Takes 84 Earth years to orbit the Sun",
      ],
    },
  },
  neptune: {
    name: "Neptune",
    radius: 3.88,
    color: "#4B70DD",
    description: "Windiest planet",
    details: {
      type: "Ice giant",
      mass: "1.024 × 10²⁶ kg",
      temperature: "-200°C",
      age: "4.5 billion years",
      composition: "Water, methane, and ammonia ices",
      facts: [
        "Fastest winds in solar system (2,100 km/h)",
        "Takes 165 Earth years to complete one orbit",
        "Has 16 known moons including Triton",
        "Deep blue color from methane in atmosphere",
      ],
    },
  },
  moon: {
    name: "Moon",
    radius: 0.273,
    color: "#C0C0C0",
    description: "Earth's satellite",
    details: {
      type: "Natural satellite",
      mass: "7.342 × 10²² kg",
      temperature: "127°C (day), -173°C (night)",
      age: "4.5 billion years",
      composition: "Rocky body with small iron core",
      facts: [
        "Formed from debris after Mars-sized object hit Earth",
        "Same side always faces Earth (tidally locked)",
        "Causes Earth's tides through gravitational pull",
        "Gradually moving away from Earth (3.8 cm/year)",
      ],
    },
  },
  betelgeuse: {
    name: "Betelgeuse",
    radius: 76700,
    color: "#FF4500",
    description: "Red supergiant star",
    details: {
      type: "Red supergiant star",
      mass: "2.17 × 10³¹ kg (11 solar masses)",
      temperature: "3,500 K",
      age: "10 million years",
      composition: "Hydrogen, helium, heavier elements",
      facts: [
        "One of the largest known stars",
        "Expected to explode as supernova within 100,000 years",
        "If placed at center of solar system, would engulf Mars",
        "Brightness varies dramatically over time",
      ],
    },
  },
  antares: {
    name: "Antares",
    radius: 60200,
    color: "#DC143C",
    description: "Red supergiant star",
    details: {
      type: "Red supergiant star",
      mass: "2.4 × 10³¹ kg (12 solar masses)",
      temperature: "3,400 K",
      age: "11-15 million years",
      composition: "Hydrogen, helium, carbon, oxygen",
      facts: [
        "Name means 'rival of Mars' due to similar red color",
        "If placed at Sun's position, would reach past Jupiter",
        "Will end its life in a spectacular supernova",
        "Has a blue-white companion star",
      ],
    },
  },
  rigel: {
    name: "Rigel",
    radius: 5400,
    color: "#87CEEB",
    description: "Blue supergiant star",
    details: {
      type: "Blue supergiant star",
      mass: "4.2 × 10³¹ kg (21 solar masses)",
      temperature: "12,100 K",
      age: "8 million years",
      composition: "Hydrogen, helium (very hot and massive)",
      facts: [
        "Brightest star in constellation Orion",
        "40,000 times more luminous than the Sun",
        "Despite being younger, will die before Betelgeuse",
        "Actually a multiple star system",
      ],
    },
  },
  aldebaran: {
    name: "Aldebaran",
    radius: 3100,
    color: "#FF8C00",
    description: "Orange giant star",
    details: {
      type: "Orange giant star",
      mass: "3.4 × 10³⁰ kg (1.7 solar masses)",
      temperature: "3,900 K",
      age: "6.4 billion years",
      composition: "Hydrogen, helium, heavier elements",
      facts: [
        "Brightest star in constellation Taurus",
        "Often called 'Eye of the Bull'",
        "Not actually part of Hyades cluster (just appears so)",
        "Will eventually become a white dwarf",
      ],
    },
  },
  ceres: {
    name: "Ceres",
    radius: 0.074,
    color: "#8C7853",
    description: "Largest asteroid",
    details: {
      type: "Dwarf planet",
      mass: "9.1 × 10²⁰ kg",
      temperature: "-105°C",
      age: "4.5 billion years",
      composition: "Rock and ice",
      facts: [
        "Largest object in asteroid belt",
        "Contains about 1/3 of asteroid belt's mass",
        "Has water vapor plumes",
        "First asteroid discovered (1801)",
      ],
    },
  },
  vesta: {
    name: "Vesta",
    radius: 0.041,
    color: "#A0A0A0",
    description: "Bright asteroid",
    details: {
      type: "Asteroid",
      mass: "2.59 × 10²⁰ kg",
      temperature: "-60°C to -270°C",
      age: "4.5 billion years",
      composition: "Rocky (basaltic surface)",
      facts: [
        "Second most massive asteroid",
        "Has a large crater from ancient impact",
        "Brightest asteroid visible from Earth",
        "Differentiated interior like terrestrial planets",
      ],
    },
  },
  eros: {
    name: "Eros",
    radius: 0.0013,
    color: "#696969",
    description: "Near-Earth asteroid",
    details: {
      type: "Near-Earth asteroid",
      mass: "6.69 × 10¹⁵ kg",
      temperature: "-150°C",
      age: "4.5 billion years",
      composition: "Silicate rock",
      facts: [
        "Elongated shape (34 × 11 × 11 km)",
        "First asteroid orbited by spacecraft",
        "Rotates once every 5.27 hours",
        "Could potentially impact Earth in distant future",
      ],
    },
  },
  phobos: {
    name: "Phobos",
    radius: 0.0018,
    color: "#8B4513",
    description: "Mars' largest moon",
    details: {
      type: "Natural satellite",
      mass: "1.08 × 10¹⁶ kg",
      temperature: "-40°C to -112°C",
      age: "4.5 billion years",
      composition: "Carbon-rich rock",
      facts: [
        "Orbits Mars in just 7.6 hours",
        "Getting closer to Mars and will crash in ~50 million years",
        "Potato-shaped with large crater Stickney",
        "May be captured asteroid",
      ],
    },
  },
  deimos: {
    name: "Deimos",
    radius: 0.00098,
    color: "#A0522D",
    description: "Mars' smaller moon",
    details: {
      type: "Natural satellite",
      mass: "1.8 × 10¹⁵ kg",
      temperature: "-40°C to -112°C",
      age: "4.5 billion years",
      composition: "Carbon-rich rock",
      facts: [
        "Smallest known moon in solar system",
        "Orbits Mars in 30.3 hours",
        "Gradually moving away from Mars",
        "Named after Greek god of dread",
      ],
    },
  },
  neutronStar: {
    name: "Neutron Star",
    radius: 0.00094,
    color: "#E6E6FA",
    description: "Ultra-dense stellar remnant",
    details: {
      type: "Neutron star",
      mass: "2.8 × 10³⁰ kg (1.4 solar masses)",
      temperature: "1,000,000 K",
      age: "Varies (stellar remnant)",
      composition: "Neutrons, protons, electrons",
      facts: [
        "Teaspoon of neutron star material weighs 6 billion tons",
        "Magnetic field trillion times stronger than Earth's",
        "Can spin up to 700 times per second",
        "Formed when massive star collapses",
      ],
    },
  },
  blackHole: {
    name: "Black Hole (Sagittarius A*)",
    radius: 1740,
    color: "#000000",
    description: "Supermassive black hole",
    details: {
      type: "Supermassive black hole",
      mass: "8.26 × 10³⁶ kg (4.1 million solar masses)",
      temperature: "Near absolute zero",
      age: "13+ billion years",
      composition: "Singularity (unknown physics)",
      facts: [
        "At center of our Milky Way galaxy",
        "Event horizon shown here (point of no return)",
        "Time dilation extreme near event horizon",
        "First black hole ever photographed (2022)",
      ],
    },
  },
}

function Starfield() {
  const starsRef = useRef<THREE.Group>(null!)

  const stars = useMemo(() => {
    const starArray = []
    for (let i = 0; i < 2000; i++) {
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

function CelestialBody({ bodyKey, position }: { bodyKey: string; position: [number, number, number] }) {
  const body = celestialBodies[bodyKey as keyof typeof celestialBodies]

  // Scale down very large bodies for better visualization
  const displayRadius = useMemo(() => {
    if (body.radius > 20) return Math.log(body.radius) * 2
    if (body.radius > 5) return body.radius * 0.8
    return Math.max(body.radius, 0.1) // Minimum size for visibility
  }, [body.radius])

  return (
    <mesh position={position}>
      <sphereGeometry args={[displayRadius, 32, 32]} />
      <meshStandardMaterial color={body.color} />
    </mesh>
  )
}

function Scene({ body1, body2 }: { body1: string; body2: string }) {
  const controlsRef = useRef<any>(null)
  const body1Data = celestialBodies[body1 as keyof typeof celestialBodies]
  const body2Data = celestialBodies[body2 as keyof typeof celestialBodies]

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

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <CelestialBody bodyKey={body1} position={[-spacing / 2, 0, 0]} />
      <CelestialBody bodyKey={body2} position={[spacing / 2, 0, 0]} />

      <OrbitControls ref={controlsRef} enablePan={false} enableZoom={true} enableRotate={true} />
    </>
  )
}

function CelestialBodyModal({ bodyKey }: { bodyKey: string }) {
  const body = celestialBodies[bodyKey as keyof typeof celestialBodies]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
          {body.name}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: body.color }} />
            {body.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Badge variant="secondary" className="bg-gray-800 text-gray-200">
                {body.details.type}
              </Badge>
            </div>
            <div className="text-sm text-gray-300">
              <strong>Radius:</strong> {body.radius.toFixed(3)}x Earth
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-gray-300">Mass:</strong>
              <div className="text-gray-400">{body.details.mass}</div>
            </div>
            <div>
              <strong className="text-gray-300">Temperature:</strong>
              <div className="text-gray-400">{body.details.temperature}</div>
            </div>
            <div>
              <strong className="text-gray-300">Age:</strong>
              <div className="text-gray-400">{body.details.age}</div>
            </div>
            <div>
              <strong className="text-gray-300">Composition:</strong>
              <div className="text-gray-400">{body.details.composition}</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-200 mb-2">Interesting Facts</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {body.details.facts.map((fact, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function Component() {
  const [selectedBody1, setSelectedBody1] = useState<string>("earth")
  const [selectedBody2, setSelectedBody2] = useState<string>("mars")

  const body1Data = celestialBodies[selectedBody1 as keyof typeof celestialBodies]
  const body2Data = celestialBodies[selectedBody2 as keyof typeof celestialBodies]

  return (
    <div className="w-full h-screen bg-black cursor-grab active:cursor-grabbing">
      <div className="absolute top-4 left-4 z-10 space-y-4">
        <Card className="w-80 bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Celestial Body Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">First Body</label>
              <Select value={selectedBody1} onValueChange={setSelectedBody1}>
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
              <Select value={selectedBody2} onValueChange={setSelectedBody2}>
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
          </CardContent>
        </Card>

        <Card className="w-80 bg-gray-900 border-gray-700">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: body1Data.color }} />
              <div>
                <div>
                  <CelestialBodyModal bodyKey={selectedBody1} />
                </div>
                <div className="text-sm text-gray-400">Radius: {body1Data.radius.toFixed(2)}x Earth</div>
                <div className="text-xs text-gray-500">{body1Data.description}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: body2Data.color }} />
              <div>
                <div>
                  <CelestialBodyModal bodyKey={selectedBody2} />
                </div>
                <div className="text-sm text-gray-400">Radius: {body2Data.radius.toFixed(2)}x Earth</div>
                <div className="text-xs text-gray-500">{body2Data.description}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <div className="text-sm text-gray-300">
                <strong>Size Ratio:</strong>{" "}
                {body1Data.radius > body2Data.radius
                  ? `${body1Data.name} is ${(body1Data.radius / body2Data.radius).toFixed(1)}x larger`
                  : `${body2Data.name} is ${(body2Data.radius / body1Data.radius).toFixed(1)}x larger`}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-400">
              <div>🖱️ Drag to rotate</div>
              <div>🔍 Scroll to zoom</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <Scene body1={selectedBody1} body2={selectedBody2} />
      </Canvas>
    </div>
  )
}
