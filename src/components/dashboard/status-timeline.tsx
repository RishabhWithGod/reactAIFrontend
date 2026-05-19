import {
  CheckCircle2,
  CircleDashed,
  LoaderCircle,
  Sparkles,
  XCircle,
} from 'lucide-react'

import { Progress } from '@/components/ui/progress'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type {
  AnalysisStage,
  AnalysisStatusUpdate,
} from '@/services/analysis.types'

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
  'cost_estimation',
  'complete',
]

interface StatusTimelineProps {
  status: AnalysisStatusUpdate
}

export function StatusTimeline({
  status,
}: StatusTimelineProps) {
  const activeIndex = orderedStages.indexOf(status.stage)

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
          Live Processing Status
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Progress */}
        <div className="space-y-3">

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-white">
                {status.label}
              </p>

              <p className="text-sm text-white/70">
                {status.detail}
              </p>
            </div>

            <p className="font-semibold text-cyan-100">
              {status.progress}%
            </p>
          </div>

          <Progress value={status.progress} />
        </div>

        {/* Timeline */}
        <div className="grid gap-3">
          {orderedStages.map((stage, index) => {
            const isComplete =
              activeIndex > index ||
              status.stage === 'complete'

            const isActive =
              activeIndex === index &&
              status.stage !== 'complete' &&
              status.stage !== 'error'

            return (
              <div
                key={stage}
                className="
                  flex
                  items-start
                  gap-3
                  rounded-[22px]
                  border
                  border-white/10
                  bg-white/8
                  p-4
                "
              >
                <div className="mt-0.5">
                  {status.stage === 'error' &&
                  stage ===
                    orderedStages[
                      Math.max(activeIndex, 0)
                    ] ? (
                    <XCircle className="h-5 w-5 text-red-300" />
                  ) : isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  ) : isActive ? (
                    <LoaderCircle className="h-5 w-5 animate-spin text-cyan-200" />
                  ) : (
                    <CircleDashed className="h-5 w-5 text-white/40" />
                  )}
                </div>

                <div>
                  <p className="font-medium text-white">
                    {stageLabel(stage)}
                  </p>

                  <p className="text-sm text-white/65">
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

        {/* AI Insight */}
        <div
          className="
            rounded-[22px]
            border
            border-white/10
            bg-[#7394cf]/18
            p-4
          "
        >
          <div className="flex items-center gap-2 font-medium text-white">
            <Sparkles className="h-4 w-4 text-cyan-200" />
            AI Pipeline Insight
          </div>

          <p className="mt-2 text-sm leading-6 text-white/75">
            The app runs the real backend first, then maintains
            a premium AI continuity layer if the service is slow
            or unavailable, ensuring every drawing receives a
            complete analysis package.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 