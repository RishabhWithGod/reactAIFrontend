import { Search } from 'lucide-react'
import { useDeferredValue, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getHistoryEntries } from '@/api/analysis-api'
import { HistoryList } from '@/components/dashboard/history-list'
import { PageShell } from '@/components/dashboard/page-shell'
import { SectionTitle } from '@/components/dashboard/section-title'
import { Card, CardContent } from '@/components/ui/card'
import { useAnalysisHistory } from '@/hooks/use-analysis-history'
import type { HistoryEntry } from '@/services/analysis.types'

export function HistoryPage() {
  const { history } = useAnalysisHistory()
  const [remoteHistory, setRemoteHistory] = useState<HistoryEntry[]>([])
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    void getHistoryEntries()
      .then(setRemoteHistory)
      .catch(() => {
        toast.message('Backend history endpoint is not available yet. Showing local analysis history.')
      })
  }, [])

  const mergedHistory = [...history, ...remoteHistory.filter((entry) => !history.some((local) => local.id === entry.id))]
  const query = deferredSearch.trim().toLowerCase()
  const filtered = query
    ? mergedHistory.filter((entry) => entry.drawingName.toLowerCase().includes(query))
    : mergedHistory

  return (
    <PageShell
      eyebrow="History Workspace"
      title="Previous analysis history"
      description="Review locally saved analyses and merge in backend history when the `/history` API is available."
    >
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            title="Saved project runs"
            description="Each completed result is stored locally for instant access. Backend history is merged automatically when supported."
          />
          <label className="relative block w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by drawing name..."
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-sky-300/40"
            />
          </label>
        </CardContent>
      </Card>

      <HistoryList items={filtered} />
    </PageShell>
  )
}
