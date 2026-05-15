import { startTransition, useEffect, useEffectEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { runDrawingAnalysis } from '@/api/analysis-api'
import { saveAnalysisRecord } from '@/services/analysis-storage'
import type { AnalysisRecord, AnalysisStatusUpdate } from '@/services/analysis.types'
import { buildAnalysisRecord } from '@/utils/result-adapter'

interface UseAnalysisPollingArgs {
  analysisId: string
  file?: File
  previewUrl?: string
}

interface UseAnalysisPollingState {
  isRunning: boolean
  status: AnalysisStatusUpdate
  record: AnalysisRecord | null
  error: string | null
}

const initialStatus: AnalysisStatusUpdate = {
  stage: 'idle',
  progress: 0,
  label: 'Waiting to start',
  detail: 'Choose a PDF drawing to begin the AI analysis pipeline.',
}

export function useAnalysisPolling({ analysisId, file, previewUrl }: UseAnalysisPollingArgs) {
  const navigate = useNavigate()
  const [state, setState] = useState<UseAnalysisPollingState>({
    isRunning: Boolean(file),
    status: initialStatus,
    record: null,
    error: null,
  })

  const applyStatus = useEffectEvent((status: AnalysisStatusUpdate) => {
    setState((current) => ({
      ...current,
      status,
      isRunning: status.stage !== 'complete' && status.stage !== 'error',
    }))
  })

  useEffect(() => {
    if (!file) {
      return
    }

    let active = true

    const run = async () => {
      toast.info(`Starting AI analysis for ${file.name}`)

      try {
        const payload = await runDrawingAnalysis(file, (status) => {
          if (active) {
            applyStatus(status)
          }
        })

        if (!active) {
          return
        }

        const record = buildAnalysisRecord(payload, analysisId, payload.backendDrawingId ? 'backend' : 'local')
        saveAnalysisRecord(record)

        setState({
          isRunning: false,
          status: {
            stage: 'complete',
            progress: 100,
            label: 'Analysis complete',
            detail: 'The drawing analysis is ready to review and export.',
          },
          record,
          error: null,
        })

        toast.success('AI analysis completed successfully.')
        startTransition(() => {
          navigate(`/results/${analysisId}`, {
            replace: true,
            state: { previewUrl },
          })
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Analysis failed unexpectedly.'

        if (!active) {
          return
        }

        setState({
          isRunning: false,
          status: {
            stage: 'error',
            progress: 100,
            label: 'Analysis failed',
            detail: message,
          },
          record: null,
          error: message,
        })

        toast.error(message)
      }
    }

    void run()

    return () => {
      active = false
    }
  }, [analysisId, file, navigate, previewUrl])

  return state
}
