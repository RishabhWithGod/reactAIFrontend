import { ArrowUpRight, Clock3, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { HistoryEntry } from '@/services/analysis.types'
import { formatDate } from '@/utils/format'

interface HistoryListProps {
  items: HistoryEntry[]
}

export function HistoryList({ items }: HistoryListProps) {
  return (
    <div className="grid gap-4">
      {items.length ? (
        items.map((entry) => (
          <Card key={`${entry.source}-${entry.id}`}>
            <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{entry.source === 'backend' ? 'Backend history' : 'Local session'}</Badge>
                  <Badge variant="muted">{entry.status}</Badge>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-white">{entry.drawingName}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-sky-200" />
                      {formatDate(entry.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Layers3 className="h-4 w-4 text-sky-200" />
                      {entry.totalComponents} components • {entry.detectedTypes} types
                    </span>
                  </div>
                </div>
              </div>
              <Button asChild variant="secondary">
                <Link to={`/results/${entry.id}`}>
                  Open result
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-6 text-sm text-slate-400">
            No analyses yet. Upload a drawing to start building the project history.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
