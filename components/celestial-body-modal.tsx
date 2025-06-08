"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type CelestialBodyKey, celestialBodies } from "../data/celestial-bodies"

interface CelestialBodyModalProps {
  bodyKey: CelestialBodyKey
}

export function CelestialBodyModal({ bodyKey }: CelestialBodyModalProps) {
  const body = celestialBodies[bodyKey]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
          {body.name}
        </button>
      </DialogTrigger>
      <DialogContent className="bg-black/20 backdrop-blur-md border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
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
