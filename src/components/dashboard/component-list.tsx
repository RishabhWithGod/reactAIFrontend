import { Cpu, Radar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { AnalysisItem } from '@/services/analysis.types'

interface ComponentListProps {
  items: AnalysisItem[]
}

export function ComponentList({
  items,
}: ComponentListProps) {
  return (
    <Card
      className="
        rounded-[32px]
        border
        border-white/10
        bg-[#6d8fd0]/20
        shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        backdrop-blur-md
      "
    >
      <CardHeader>
        <CardTitle className="text-white">
          AI Detected Components
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-2">

        {items.length ? (
          items.map((item) => (
            <div
              key={`${item.symbol}-${item.name}`}
              className="
                rounded-[24px]
                border
                border-white/10
                bg-[#7394cf]/18
                p-5
              "
            >
              <div className="flex items-start justify-between gap-3">

                <div className="space-y-2">

                  <div className="flex items-center gap-2">

                    <Badge
                      className="
                        border
                        border-white/10
                        bg-white/10
                        text-white
                      "
                    >
                      {item.symbol}
                    </Badge>

                    <Badge
                      className="
                        border
                        border-cyan-300/20
                        bg-cyan-400/10
                        text-cyan-100
                      "
                    >
                      {item.category}
                    </Badge>

                  </div>

                  <p className="font-display text-xl font-semibold text-white">
                    {item.name}
                  </p>

                </div>

                <div
                  className="
                    rounded-2xl
                    bg-[#7fb4dc]/25
                    p-3
                    text-cyan-100
                  "
                >
                  <Cpu className="h-5 w-5" />
                </div>

              </div>

              <div className="mt-5 flex items-end justify-between">

                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/50">
                    Quantity
                  </p>

                  <p className="mt-1 text-3xl font-semibold text-white">
                    {item.quantity}
                  </p>
                </div>

                <div className="text-right text-sm text-white/70">

                  <div className="flex items-center justify-end gap-1 text-cyan-100">
                    <Radar className="h-3.5 w-3.5" />
                    AI detected
                  </div>

                  <p>
                    {item.rating ??
                      'No rating metadata detected'}
                  </p>

                </div>

              </div>
            </div>
          ))
        ) : (
          <div
            className="
              rounded-[24px]
              border
              border-white/10
              bg-[#7394cf]/18
              p-6
              text-sm
              text-white/70
            "
          >
            No components were returned by the backend
            for this drawing.
          </div>
        )}

      </CardContent>
    </Card>
  )
}