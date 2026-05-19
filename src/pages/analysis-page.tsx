import { AlertTriangle, ArrowRight, Bot, Check, FileDigit, LoaderCircle, ScanLine, XCircle } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { DrawingPreview } from '@/components/dashboard/drawing-preview'
import { PageShell } from '@/components/dashboard/page-shell'
import { StatCard } from '@/components/dashboard/stat-card'
import { StatusTimeline } from '@/components/dashboard/status-timeline'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
  const notes = state.notes
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
      eyebrow="AI Takeoff Processing"
      title={`Processing ${drawingName}`}
      description="Our AI is processing your electrical plans. This workflow is polling-ready for future async backend integration."
      actions={
        <>
          <Button variant="secondary" onClick={analysis.cancel} disabled={!analysis.isRunning}>
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button asChild disabled={analysis.isRunning || analysis.isCancelled}>
            <Link to={`/results/${id}`}>
              Continue to Review
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </>
      }
    >
     <Card
  className="
    overflow-hidden
    rounded-[32px]
    border
    mb-5
    border-white/10
    bg-[#7b9fe0]/25
    shadow-[0_8px_40px_rgba(0,0,0,0.10)]
    backdrop-blur-md
  "
>
  <CardContent className="space-y-8 p-8 text-center sm:p-10">

    <div
      className="
        mx-auto
        flex
        h-20
        w-20
        
        items-center
        justify-center
        rounded-[28px]
        bg-[#7fb4dc]/25
        text-cyan-100
      "
    >
      {analysis.isRunning ? (
        <LoaderCircle className="h-10 w-10 animate-spin" />
      ) : (
        <Bot className="h-10 w-10" />
      )}
    </div>

    <div>
      <h2 className="font-display text-3xl font-semibold text-white">
        AI Takeoff Processing
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/80">
        {analysis.status.detail}
      </p>
    </div>

    <Progress value={analysis.status.progress} />

    <div className="text-2xl font-semibold text-cyan-100">
      {analysis.status.label}
    </div>

    <p className="text-sm font-medium text-white/75">
      You may navigate away. Completed analyses are saved
      into local history automatically.
    </p>

  </CardContent>
</Card>

      <div className="grid gap-6 md:grid-cols-3 mb-5">
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

     <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr] mb-5 items-start">

  {/* LEFT COLUMN */}
  <div>
    <StatusTimeline status={analysis.status} />
  </div>

  {/* RIGHT COLUMN */}
  <div className="space-y-3">

    <Card
      className="
        rounded-[32px]
        h-fit
        border
        border-white/10
        bg-[#6d8fd0]/20
        shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        backdrop-blur-md
      "
    >
      <CardContent className="space-y-4 p-5">

        <h3 className="font-display text-xl font-semibold text-white">
          Processing Steps
        </h3>

        {[
          { label: 'Uploading files', threshold: 10 },
          { label: 'Validating file format', threshold: 35 },
          { label: 'Analyzing electrical symbols', threshold: 70 },
          { label: 'Calculating materials', threshold: 88 },
          { label: 'Generating takeoff report', threshold: 98 },
        ].map((step, index) => {
          const isDone = analysis.status.progress >= step.threshold
          const isActive = !isDone && analysis.isRunning

          return (
            <div
              key={step.label}
              className="flex items-center gap-3 text-sm text-slate-200"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/8 text-sky-100">
                {isDone ? (
                  <Check className="h-4 w-4" />
                ) : isActive ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  index + 1
                )}
              </span>

              <span className={isDone ? 'text-white' : 'text-slate-400'}>
                {step.label}
              </span>
            </div>
          )
        })}

        {notes ? (
          <div className="rounded-2xl border border-white/10 bg-[#7394cf]/18 p-3 text-sm text-slate-300">
            <p className="mb-1 font-semibold text-white">
              Project Notes
            </p>
            {notes}
          </div>
        ) : null}

      </CardContent>
    </Card>

    <DrawingPreview
      drawingName={drawingName}
      previewUrl={previewUrl}
    />

  </div>
</div>
    </PageShell>
  )
}
