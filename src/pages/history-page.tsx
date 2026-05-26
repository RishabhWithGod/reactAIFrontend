import { ArrowUpRight, Copy, FileText,  Search, Trash2 } from 'lucide-react'
// import { ArrowUpRight, Copy, FileText, MoreHorizontal, Search, Trash2 } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { getHistoryEntries } from '@/api/analysis-api'
import { PageShell } from '@/components/dashboard/page-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAnalysisHistory } from '@/hooks/use-analysis-history'
import type { HistoryEntry } from '@/services/analysis.types'
import { formatDate } from '@/utils/format'

type StatusFilter = 'all' | 'draft' | 'completed' | 'converted'

const demoEntries: HistoryEntry[] = [
  {
    id: 'demo-westside',
    drawingName: 'Westside Commercial Complex',
    createdAt: new Date('2026-05-14T10:23:00').toISOString(),
    totalComponents: 128,
    detectedTypes: 14,
    status: 'completed',
    source: 'local',
  },
  {
    id: 'demo-maplewood',
    drawingName: 'Maplewood Apartments',
    createdAt: new Date('2026-05-12T09:00:00').toISOString(),
    totalComponents: 94,
    detectedTypes: 11,
    status: 'processing',
    source: 'local',
  },
  {
    id: 'demo-birchwood',
    drawingName: 'Birchwood Office Complex',
    createdAt: new Date('2026-05-10T16:45:00').toISOString(),
    totalComponents: 156,
    detectedTypes: 17,
    status: 'completed',
    source: 'backend',
  },
]

function statusLabel(entry: HistoryEntry) {
  if (entry.source === 'backend') {
    return 'converted'
  }

  if (entry.status === 'processing') {
    return 'draft'
  }

  return entry.status
}

function statusVariant(label: string) {
  if (label === 'completed') {
    return 'success' as const
  }

  if (label === 'draft') {
    return 'warning' as const
  }

  return 'default' as const
}

export function HistoryPage() {
  const { history } = useAnalysisHistory()
  const [remoteHistory, setRemoteHistory] = useState<HistoryEntry[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const deferredSearch = useDeferredValue(search)
  const pageSize = 5

  useEffect(() => {
    void getHistoryEntries()
      .then(setRemoteHistory)
      .catch(() => {
        toast.message('Backend history endpoint is not available yet. Showing local analysis history.')
      })
  }, [])

  const mergedHistory = useMemo(() => [
    ...history,
    ...remoteHistory.filter((entry) => !history.some((local) => local.id === entry.id)),
    ...demoEntries.filter((entry) => !history.some((local) => local.id === entry.id)),
  ], [history, remoteHistory])
  const query = deferredSearch.trim().toLowerCase()
  const filtered = useMemo(() => {
    const nextItems = mergedHistory.filter((entry) => {
      const matchesSearch = query ? entry.drawingName.toLowerCase().includes(query) : true
      const matchesFilter = filter === 'all' ? true : statusLabel(entry) === filter
      return matchesSearch && matchesFilter
    })

    return nextItems.sort((a, b) => {
      const delta = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sort === 'oldest' ? delta : -delta
    })
  }, [filter, mergedHistory, query, sort])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <PageShell
      eyebrow="History Workspace"
      title="AI Takeoff History"
      description="View and manage your previous takeoff projects."
      actions={
        <Button asChild>
          <Link to="/upload">New Takeoff</Link>
        </Button>
      }
    >
      <Card  className="
            rounded-[32px]
            border
            mb-5
            border-white/10
            bg-[#6d8fd0]/20
            shadow-[0_8px_40px_rgba(0,0,0,0.12)]
            backdrop-blur-md
          ">
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">Previous takeoff projects</h2>
              <p className="mt-2 text-sm text-slate-400">Local analyses and backend history are merged into one workspace.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <label className="relative block w-full lg:w-80">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search projects..."
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/10 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-sky-300/40"
                />
              </label>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/10 px-4 pr-4 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-sky-300/40"
              >
                <option value="newest">Date (Newest)</option>
                <option value="oldest">Date (Oldest)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ['all', 'All Projects'],
              ['draft', 'Drafts'],
              ['completed', 'Completed'],
              ['converted', 'Converted'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setFilter(value as StatusFilter)
                  setPage(1)
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  filter === value
                    ? 'border-sky-300/40 bg-sky-300/15 text-sky-100'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card 
            className="
            overflow-hidden
            rounded-[32px]
            mb-8
            border
            border-white/10
            bg-[#6d8fd0]/20
            shadow-[0_8px_40px_rgba(0,0,0,0.12)]
            backdrop-blur-md
          ">
        <CardContent className="p-0">
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-white/10 bg-white/6 text-xs uppercase tracking-[0.16em] text-slate-400">
                <tr>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((entry) => {
                  const label = statusLabel(entry)

                  return (
                    <tr key={`${entry.source}-${entry.id}`} className="border-b border-white/8 last:border-0">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400 text-slate-950">
                            <FileText className="h-5 w-5" />
                          </span>
                          <span className="font-semibold text-white">{entry.drawingName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">{formatDate(entry.createdAt)}</td>
                      <td className="px-6 py-5">Horizon Builders Inc.</td>
                      <td className="px-6 py-5"><Badge variant={statusVariant(label)}>{label}</Badge></td>
                      <td className="px-6 py-5">{entry.totalComponents}</td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <Button asChild size="sm"><Link to={`/results/${entry.id}`}>View</Link></Button>
                          <Button size="sm" variant="secondary" onClick={() => toast.message('Duplicate is ready for backend support.')}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toast.message('Delete will be enabled when backend history supports it.')}>
                            <Trash2 className="h-4 w-4 text-red-200" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 p-4 lg:hidden">
            {visibleItems.map((entry) => {
              const label = statusLabel(entry)

              return (
                <div key={`${entry.source}-${entry.id}`} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{entry.drawingName}</p>
                      <p className="mt-1 text-sm text-slate-400">{formatDate(entry.createdAt)}</p>
                    </div>
                    <Badge variant={statusVariant(label)}>{label}</Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                    <span>{entry.totalComponents} items</span>
                    <Button asChild size="sm" variant="secondary">
                      <Link to={`/results/${entry.id}`}>
                        Open
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {!visibleItems.length ? (
            <div className="p-8 text-center text-sm text-slate-400">No projects match the selected search and filters.</div>
          ) : null}
        </CardContent>
      </Card>

      <div className="mb-5 flex flex-col gap-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <span>Showing {visibleItems.length} of {filtered.length} projects</span>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={pageNumber === currentPage ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}
          <Button variant="secondary" size="sm" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
            Next
          </Button>
        </div>
      </div>

      {/* <Card   
      className="
            rounded-[32px]
            border
            border-white/10
            bg-[#6d8fd0]/20
            shadow-[0_8px_40px_rgba(0,0,0,0.12)]
            backdrop-blur-md
          ">
        <CardContent className="space-y-4 p-6">
          <h2 className="font-display text-2xl font-semibold text-white">Recent Activity</h2>
          {[
            'AI Takeoff completed for Birchwood Office Complex',
            'Maplewood Apartments estimate was approved',
            'AI Takeoff completed for Westside Commercial Complex',
          ].map((item) => (
            <div key={item} className="flex gap-4 rounded-2xl border border-white/10 bg-white/6 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400/12 text-sky-100">
                <MoreHorizontal className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-white">{item}</p>
                <p className="mt-1 text-xs text-slate-400">Today, 10:23 AM</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card> */}
    </PageShell>
  )
}
