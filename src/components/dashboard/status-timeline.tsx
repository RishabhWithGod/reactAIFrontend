import { CheckCircle2, CircleDashed, LoaderCircle, Sparkles, XCircle } from 'lucide-react'

import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalysisStage, AnalysisStatusUpdate } from '@/services/analysis.types'
import { stageLabel } from '@/utils/format'

const orderedStages: AnalysisStage[] = [
  'uploading',
  'uploaded',
  'ocr',
  'table_detection',
  'ai_parsing',
  'symbol_detection',
  'quantity_counting',
  'boq_generation',
  'complete',
]

interface StatusTimelineProps {
  status: AnalysisStatusUpdate
}

export function StatusTimeline({ status }: StatusTimelineProps) {
  const activeIndex = orderedStages.indexOf(status.stage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live processing status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-white">{status.label}</p>
              <p className="text-sm text-slate-400">{status.detail}</p>
            </div>
            <p className="text-sm font-semibold text-sky-100">{status.progress}%</p>
          </div>
          <Progress value={status.progress} />
        </div>

        <div className="grid gap-3">
          {orderedStages.map((stage, index) => {
            const isComplete = activeIndex > index || status.stage === 'complete'
            const isActive = activeIndex === index && status.stage !== 'complete' && status.stage !== 'error'

            return (
              <div
                key={stage}
                className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-white/4 p-4"
              >
                <div className="mt-0.5 text-sky-100">
                  {status.stage === 'error' && stage === orderedStages[Math.max(activeIndex, 0)] ? (
                    <XCircle className="h-5 w-5 text-rose-300" />
                  ) : isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  ) : isActive ? (
                    <LoaderCircle className="h-5 w-5 animate-spin text-sky-200" />
                  ) : (
                    <CircleDashed className="h-5 w-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{stageLabel(stage)}</p>
                  <p className="text-sm text-slate-400">
                    {stage === status.stage
                      ? status.detail
                      : isComplete
                        ? 'Completed successfully.'
                        : 'Queued in the AI analysis pipeline.'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-[22px] border border-sky-300/15 bg-sky-400/8 p-4 text-sm text-slate-200">
          <div className="flex items-center gap-2 font-medium text-sky-50">
            <Sparkles className="h-4 w-4" />
            AI pipeline insight
          </div>
          <p className="mt-2 leading-6 text-slate-300">
            The current backend returns a complete result right after upload, so this live timeline simulates the OCR,
            detection, counting, and BOQ stages while the server processes the file.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
