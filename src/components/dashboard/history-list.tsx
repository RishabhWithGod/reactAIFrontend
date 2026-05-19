import { ArrowUpRight, Clock3, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'

import type { HistoryEntry } from '@/services/analysis.types'
import { formatDate } from '@/utils/format'

interface HistoryListProps {
  items: HistoryEntry[]
}

export function HistoryList({
  items,
}: HistoryListProps) {
  return (
    <div className="grid gap-4">

      {items.length ? (
        items.map((entry) => (
          <Card
            key={`${entry.source}-${entry.id}`}
            className="
              rounded-[32px]
              border
              border-white/10
              bg-[#6d8fd0]/20
              shadow-[0_8px_40px_rgba(0,0,0,0.12)]
              backdrop-blur-md
            "
          >
            <CardContent
              className="
                flex
                flex-col
                gap-4
                p-6
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Left Section */}
              <div className="space-y-3">

                <div className="flex flex-wrap items-center gap-2">

                  <Badge
                    className="
                      border
                      border-white/10
                      bg-white/10
                      text-white
                    "
                  >
                    {entry.source === 'backend'
                      ? 'Backend History'
                      : 'Local Session'}
                  </Badge>

                  <Badge
                    className="
                      border
                      border-cyan-300/20
                      bg-cyan-400/10
                      text-cyan-100
                    "
                  >
                    {entry.status}
                  </Badge>

                </div>

                <div>

                  <p className="font-display text-2xl font-semibold text-white">
                    {entry.drawingName}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/70">

                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-cyan-100" />
                      {formatDate(entry.createdAt)}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Layers3 className="h-4 w-4 text-cyan-100" />
                      {entry.totalComponents} Components •{' '}
                      {entry.detectedTypes} Types
                    </span>

                  </div>

                </div>

              </div>

              {/* Right Section */}
              <Button
                asChild
                className="
                  bg-[#38d7ff]
                  text-black
                  hover:bg-[#58e0ff]
                "
              >
                <Link to={`/results/${entry.id}`}>
                  Open Result
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

            </CardContent>
          </Card>
        ))
      ) : (
        <Card
          className="
            rounded-[32px]
            border
            border-white/10
            bg-[#6d8fd0]/20
            backdrop-blur-md
          "
        >
          <CardContent className="p-6 text-white/70">
            No analyses yet. Upload a drawing to start
            building the project history.
          </CardContent>
        </Card>
      )}

    </div>
  )
}