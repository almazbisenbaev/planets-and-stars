'use client'

import { useState, useEffect, useRef } from 'react'
// import { motion } from 'framer-motion'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

const celestialBodies = {
  // Solar System Planets
  Mercury: 2439,
  Venus: 6052,
  Earth: 6371,
  Mars: 3389,
  Jupiter: 69911,
  Saturn: 58232,
  Uranus: 25362,
  Neptune: 24622,
  // Dwarf Planets
  Pluto: 1188,
  Ceres: 473,
  Eris: 1163,
  Haumea: 816,
  Makemake: 715,
  // Moons
  Moon: 1737,
  Io: 1821,
  Europa: 1560,
  Ganymede: 2634,
  Titan: 2576,
  Phobos: 11,
  Deimos: 6,
  // Asteroids
  Vesta: 263,
  Pallas: 256,
  Hygiea: 217,
  "433 Eros": 8,
  // Stars
  Sun: 696340,
  Sirius: 1190000,
  Betelgeuse: 617100000,
  "VY Canis Majoris": 980000000,
  "UY Scuti": 1188000000,
  // Black Holes
  "Sagittarius A*": 22000000,
  "TON 618": 40000000000,
  // Galaxies (using approximate radius)
  "Milky Way": 52850000000000,
  Andromeda: 110000000000000,
}

type CelestialBody = keyof typeof celestialBodies

const celestialGroups = {
  "Solar System Planets": ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
  "Dwarf Planets": ["Pluto", "Ceres", "Eris", "Haumea", "Makemake"],
  "Moons": ["Moon", "Io", "Europa", "Ganymede", "Titan", "Phobos", "Deimos"],
  "Asteroids": ["Vesta", "Pallas", "Hygiea", "433 Eros"],
  "Stars": ["Sun", "Sirius", "Betelgeuse", "VY Canis Majoris", "UY Scuti"],
  "Black Holes": ["Sagittarius A*", "TON 618"],
  "Galaxies": ["Milky Way", "Andromeda"],
}

const useCanvas = (draw: (ctx: CanvasRenderingContext2D) => void) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const render = () => {
      draw(context)
    }

    render()

    return () => {
      // Cleanup if needed
    }
  }, [draw])

  return canvasRef
}

export default function Component() {
  const [body1, setBody1] = useState<CelestialBody>('Earth')
  const [body2, setBody2] = useState<CelestialBody>('Moon')

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    const maxRadius = Math.min(ctx.canvas.width, ctx.canvas.height) / 4
    const scale = maxRadius / Math.max(celestialBodies[body1], celestialBodies[body2])
    
    ctx.fillStyle = 'white'
    
    // Draw first body
    ctx.beginPath()
    ctx.arc(ctx.canvas.width / 4, ctx.canvas.height / 2, celestialBodies[body1] * scale, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw second body
    ctx.beginPath()
    ctx.arc(ctx.canvas.width * 3 / 4, ctx.canvas.height / 2, celestialBodies[body2] * scale, 0, Math.PI * 2)
    ctx.fill()
  }

  const canvasRef = useCanvas(draw)

  return (
    <div className="pt-10 pb-1 relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-3xl text-center font-bold mb-8">How big is this planet?</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-8">

        <Select onValueChange={(value) => setBody1(value as CelestialBody)} defaultValue={body1}>
          <SelectTrigger className="w-[220px] bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Select body 1" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            {Object.entries(celestialGroups).map(([group, bodies]) => (
              <SelectGroup key={group}>
                <SelectLabel className="text-gray-400">{group}</SelectLabel>
                {bodies.map((body) => (
                  <SelectItem key={body} value={body} className="focus:bg-gray-700">{body}</SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setBody2(value as CelestialBody)} defaultValue={body2}>
          <SelectTrigger className="w-[220px] bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Select body 2" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            {Object.entries(celestialGroups).map(([group, bodies]) => (
              <SelectGroup key={group}>
                <SelectLabel className="text-gray-400">{group}</SelectLabel>
                {bodies.map((body) => (
                  <SelectItem key={body} value={body} className="focus:bg-gray-700">{body}</SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

      </div>

      <div className="planets-box">
        <canvas ref={canvasRef} width={1200} height={500} className="planets-box-canvas" />
      </div>
      
      <div className="mt-4 flex justify-evenly gap-10 w-full">
        <p className="text-xs text-center">{body1}: {celestialBodies[body1].toLocaleString()} km</p>
        <p className="text-xs text-center">{body2}: {celestialBodies[body2].toLocaleString()} km</p>
      </div>
      <p className="mt-20 lg:mt-10 text-sm text-gray-400 max-w-2xl text-center">
        Author: <a className="underline" target="_blank" href="https://x.com/almazbisenbaev">Almaz Bisenbaev</a>
      </p>
    </div>
  )
}