import { AlertTriangle, ArrowRight, Bot, FileDigit, ScanLine } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { DrawingPreview } from '@/components/dashboard/drawing-preview'
import { PageShell } from '@/components/dashboard/page-shell'
import { StatCard } from '@/components/dashboard/stat-card'
import { StatusTimeline } from '@/components/dashboard/status-timeline'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAnalysisHistory } from '@/hooks/use-analysis-history'
import { useAnalysisPolling } from '@/hooks/use-analysis-polling'
import type { UploadRouteState } from '@/services/analysis.types'

export function AnalysisPage() {
  const { id = 'current' } = useParams()
  const location = useLocation()
  const state = (location.state ?? {}) as UploadRouteState
  const { getRecord } = useAnalysisHistory()
  const existingRecord = getRecord(id)
  const previewUrl = state.previewUrl
  const file = state.file
  const drawingName = state.drawingName ?? file?.name ?? existingRecord?.drawingName ?? `Drawing ${id}.pdf`
  const analysis = useAnalysisPolling({
    analysisId: id,
    file: existingRecord ? undefined : file,
    previewUrl,
  })

  if (existingRecord) {
    return (
      <PageShell
        eyebrow="Analysis Session"
        title={`${existingRecord.drawingName} is already complete`}
        description="This analysis already exists in the dashboard history. Jump straight to the result workspace or start a fresh upload."
        actions={
          <>
            <Button asChild>
              <Link to={`/results/${existingRecord.id}`}>
                Open results
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/upload">Analyze another drawing</Link>
            </Button>
          </>
        }
      >
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard
            icon={Bot}
            label="Components"
            value={String(existingRecord.summary.totalComponents)}
            hint="Detected components already saved for this drawing."
          />
          <StatCard
            icon={FileDigit}
            label="Detected types"
            value={String(existingRecord.summary.detectedTypes)}
            hint="Distinct component classes found by the analyzer."
          />
          <StatCard
            icon={ScanLine}
            label="Pages"
            value={String(existingRecord.summary.pageCount)}
            hint="Pages processed in the original analysis run."
          />
        </div>
      </PageShell>
    )
  }

  if (!file) {
    return (
      <PageShell
        eyebrow="Analysis Session"
        title="No active drawing was staged for analysis"
        description="The live analysis screen needs a staged PDF from the Upload page. Return there, select a drawing, and start the AI pipeline."
        actions={
          <Button asChild>
            <Link to="/upload">Return to upload</Link>
          </Button>
        }
      >
        <Card>
          <CardContent className="flex items-start gap-4 p-6 text-slate-300">
            <div className="rounded-2xl bg-amber-300/10 p-3 text-amber-100">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <p className="text-sm leading-6">
              The current backend does not support reconnecting to an in-flight local upload, so the analysis page only
              works when launched from the upload workflow.
            </p>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  return (
    <PageShell
      eyebrow="Live Analysis"
      title={`Processing ${drawingName}`}
      description="Monitor upload progress and follow the live AI pipeline while the backend extracts OCR, detects symbols, counts quantities, and compiles the BOQ output."
    >
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <StatusTimeline status={analysis.status} />
        <DrawingPreview drawingName={drawingName} previewUrl={previewUrl} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={Bot}
          label="Pipeline stage"
          value={analysis.status.label}
          hint={analysis.status.detail}
        />
        <StatCard
          icon={ScanLine}
          label="Upload progress"
          value={`${analysis.status.progress}%`}
          hint="Live upload progress and simulated server-side analysis stages."
        />
        <StatCard
          icon={FileDigit}
          label="Drawing"
          value={drawingName}
          hint="This job will be saved into the history page after completion."
        />
      </div>
    </PageShell>
  )
}
