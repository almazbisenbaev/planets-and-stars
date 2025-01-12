'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import celestialBodies from './bodies'
import celestialGroups from './bodies-groups'
import celestialImages from './celestialImages'

type CelestialBody = keyof typeof celestialBodies

// Create an image loading utility
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const useCanvas = (draw: (ctx: CanvasRenderingContext2D, images: Record<string, HTMLImageElement>) => void, body1: string, body2: string) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({})
  const imageCache = useRef<Record<string, HTMLImageElement>>({})

  useEffect(() => {
    const loadRequiredImages = async () => {
      const requiredBodies = [body1, body2]
      const newImages: Record<string, HTMLImageElement> = {}
      
      try {
        for (const body of requiredBodies) {
          if (!celestialImages[body]) {
            console.error(`No image URL found for body: ${body}`)
            return
          }

          if (!imageCache.current[body]) {
            try {
              console.log(`Loading image for ${body}: ${celestialImages[body]}`)
              const img = await loadImage(celestialImages[body])
              console.log(`Successfully loaded image for ${body}`)
              imageCache.current[body] = img
            } catch (error) {
              console.error(`Failed to load image for ${body}:`, error)
              return
            }
          }
          newImages[body] = imageCache.current[body]
        }
        
        // Verify we have both images before updating state
        if (newImages[body1] && newImages[body2]) {
          console.log('Setting images:', Object.keys(newImages))
          setImages(newImages)
        }
      } catch (error) {
        console.error('Error in loadRequiredImages:', error)
      }
    }

    loadRequiredImages()
  }, [body1, body2])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    
    if (!canvas || !context) return
    
    // Debug logging
    console.log('Current images:', Object.keys(images))
    console.log('Required bodies:', body1, body2)
    console.log('Image checks:', {
      hasBody1: !!images[body1],
      hasBody2: !!images[body2],
      isBody1HTMLImage: images[body1] instanceof HTMLImageElement,
      isBody2HTMLImage: images[body2] instanceof HTMLImageElement
    })

    // Only draw if we have valid images for both bodies
    if (images[body1] instanceof HTMLImageElement && 
        images[body2] instanceof HTMLImageElement) {
      draw(context, images)
    } else {
      console.error('Missing or invalid images for drawing')
    }
  }, [draw, images, body1, body2])

  return canvasRef
}

export default function Component() {
  const [body1, setBody1] = useState<CelestialBody>('Earth')
  const [body2, setBody2] = useState<CelestialBody>('Moon')

  const draw = useCallback((ctx: CanvasRenderingContext2D, images: Record<string, HTMLImageElement>) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    const maxRadius = Math.min(ctx.canvas.width, ctx.canvas.height) / 4
    const scale = maxRadius / Math.max(celestialBodies[body1], celestialBodies[body2])
    
    // Draw first body
    const size1 = celestialBodies[body1] * scale * 2
    ctx.drawImage(
      images[body1],
      ctx.canvas.width / 4 - size1 / 2,
      ctx.canvas.height / 2 - size1 / 2,
      size1,
      size1
    )
    
    // Draw second body
    const size2 = celestialBodies[body2] * scale * 2
    ctx.drawImage(
      images[body2],
      ctx.canvas.width * 3 / 4 - size2 / 2,
      ctx.canvas.height / 2 - size2 / 2,
      size2,
      size2
    )
  }, [body1, body2])

  const canvasRef = useCanvas(draw, body1, body2)

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