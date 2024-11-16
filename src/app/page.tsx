'use client'

import { useState, useEffect, useRef } from 'react'
// import { motion } from 'framer-motion'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

import celestialBodies from './bodies';
import celestialGroups from './bodies-groups';

type CelestialBody = keyof typeof celestialBodies

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