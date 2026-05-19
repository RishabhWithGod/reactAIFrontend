import axios from 'axios'

import { apiConfig } from '@/api/config'
import {
  enrichWithSyntheticFallback,
  getFileFingerprint,
  getOrCreateFallbackAnalysis,
  isFallbackEligibleError,
  playFallbackProcessingStages,
} from '@/api/fallback-ai'
import { fileHttp, http, isNotFoundLike } from '@/api/http'
import type {
  AnalysisStatusUpdate,
  HistoryEntry,
  NormalizedAnalysisPayload,
} from '@/services/analysis.types'

import {
  buildAnalysisRecord,
  normalizeLegacyAnalysisResponse,
  normalizePipelineAnalysisResponse,
} from '@/utils/result-adapter'

const BACKEND_REQUEST_TIMEOUT_MS = 60_000

const pipelineStages: AnalysisStatusUpdate[] = [
  {
    stage: 'ocr',
    progress: 60,
    label: 'OCR extraction',
    detail: 'Reading sheet text, labels, and equipment references.',
  },
  {
    stage: 'table_detection',
    progress: 68,
    label: 'Table detection',
    detail: 'Locating schedules, legends, and structured content.',
  },
  {
    stage: 'ai_parsing',
    progress: 76,
    label: 'AI parsing',
    detail: 'Turning raw OCR into structured drawing intelligence.',
  },
  {
    stage: 'symbol_detection',
    progress: 84,
    label: 'Symbol detection',
    detail: 'Detecting electrical symbols and connected components.',
  },
  {
    stage: 'quantity_counting',
    progress: 90,
    label: 'Quantity counting',
    detail: 'Counting repeated components across the uploaded drawing.',
  },
  {
    stage: 'boq_generation',
    progress: 95,
    label: 'BOQ generation',
    detail: 'Building the structured bill of quantities and output tables.',
  },
  {
    stage: 'cost_estimation',
    progress: 98,
    label: 'Cost estimation',
    detail: 'Applying rate intelligence for estimate-ready BOQ output.',
  },
]

function apiMode() {
  return apiConfig.mode
}

function makeFormData(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return formData
}

function wait(durationMs: number) {
  return new Promise((resolve) => window.setTimeout(resolve, durationMs))
}

function beginStageTicker(
  onStatus?: (update: AnalysisStatusUpdate) => void,
) {
  let index = 0

  const timer = window.setInterval(() => {
    const stage = pipelineStages[index]

    if (stage) {
      onStatus?.(stage)
      index += 1
    }
  }, 1100)

  return () => window.clearInterval(timer)
}

async function uploadLegacyDrawing(
  file: File,
  onStatus?: (update: AnalysisStatusUpdate) => void,
): Promise<NormalizedAnalysisPayload> {
  let uploadFinished = false
  let stopTicker: () => void = () => {}

  try {
    const response = await http.post(
      '/api/upload',
      makeFormData(file),
      {
        timeout: BACKEND_REQUEST_TIMEOUT_MS,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        onUploadProgress: (event) => {
          const total = event.total ?? file.size ?? 1

          const progress = Math.min(
            55,
            Math.round((event.loaded / total) * 55),
          )

          onStatus?.({
            stage: 'uploading',
            progress,
            label: 'Uploading drawing',
            detail:
              'Sending the PDF drawing to the FastAPI OCR pipeline.',
          })

          if (progress >= 55 && !uploadFinished) {
            uploadFinished = true

            onStatus?.({
              stage: 'uploaded',
              progress: 58,
              label: 'Upload complete',
              detail:
                'The file is on the server and queued for extraction.',
            })

            stopTicker = beginStageTicker(onStatus)
          }
        },
      },
    )

    stopTicker()

    const normalized = normalizeLegacyAnalysisResponse(
      response.data as Record<string, unknown>,
      file.name,
    )

    console.info('[REAL BACKEND MODE] Legacy backend success:', {
      drawingName: file.name,
      fingerprint: getFileFingerprint(file),
      totalComponents: normalized.summary.totalComponents,
    })

    return normalized
  } catch (error) {
    stopTicker()

    console.error('[REAL BACKEND MODE] Legacy backend fail:', error)

    if (axios.isAxiosError(error)) {
      console.error('[REAL BACKEND MODE] STATUS:', error.response?.status)
      console.error('[REAL BACKEND MODE] DATA:', error.response?.data)
    }

    throw error
  }
}

async function runPipelineDrawing(
  file: File,
  onStatus?: (update: AnalysisStatusUpdate) => void,
): Promise<NormalizedAnalysisPayload> {
  const uploadResponse = await http.post(
    '/upload-drawing',
    makeFormData(file),
    {
      timeout: BACKEND_REQUEST_TIMEOUT_MS,
      onUploadProgress: (event) => {
        const total = event.total ?? file.size ?? 1

        const progress = Math.max(
          12,
          Math.round((event.loaded / total) * 32),
        )

        onStatus?.({
          stage: 'uploading',
          progress,
          label: 'Uploading drawing',
          detail: 'Transferring the PDF package to the backend.',
        })
      },
    },
  )

  const drawingId = String(
    uploadResponse.data?.drawing_id ??
      uploadResponse.data?.id ??
      '',
  )

  if (!drawingId) {
    throw new Error(
      'Upload completed, but the backend did not return a drawing id.',
    )
  }

  onStatus?.({
    stage: 'uploaded',
    progress: 38,
    label: 'Upload complete',
    detail: `Drawing ${drawingId} is ready for AI processing.`,
  })

  await http.post(`/analyze-drawing/${drawingId}`, undefined, {
    timeout: BACKEND_REQUEST_TIMEOUT_MS,
  })

  const stopTicker = beginStageTicker(onStatus)

  try {
    for (let attempt = 0; attempt < 25; attempt += 1) {
      try {
        const result = await http.get(
          `/drawing-result/${drawingId}`,
          {
            timeout: BACKEND_REQUEST_TIMEOUT_MS,
          },
        )

        const normalized = normalizePipelineAnalysisResponse(
          result.data as Record<string, unknown>,
          file.name,
        )

        console.info('[REAL BACKEND MODE] Pipeline backend success:', {
          drawingName: file.name,
          drawingId,
          fingerprint: getFileFingerprint(file),
          totalComponents: normalized.summary.totalComponents,
        })

        return normalized
      } catch (error) {
        if (
          !axios.isAxiosError(error) ||
          ![202, 404].includes(error.response?.status ?? 0)
        ) {
          throw error
        }
      }

      await wait(1800)
    }
  } finally {
    stopTicker()
  }

  throw new Error(
    'The backend did not return a completed analysis result in time.',
  )
}

export async function runDrawingAnalysis(
  file: File,
  onStatus?: (update: AnalysisStatusUpdate) => void,
): Promise<NormalizedAnalysisPayload> {
  const mode = apiMode()
  let backendError: unknown = null

  // REAL BACKEND MODE
  try {
    let backendPayload: NormalizedAnalysisPayload

    if (mode !== 'legacy') {
      try {
        backendPayload = await runPipelineDrawing(file, onStatus)
        return enrichWithSyntheticFallback(backendPayload, file)
      } catch (error) {
        backendError = error

        console.error('[REAL BACKEND MODE] Pipeline backend fail:', error)

        if (mode === 'pipeline') {
          throw error
        }

        /*
         * Existing auto-mode behavior used to fall through to the legacy
         * upload endpoint only when the pipeline routes looked unavailable.
         * We keep backend compatibility and now also try /api/upload when the
         * pipeline is unhealthy, because the frontend should prefer any real
         * backend result before simulation.
         */
        if (!isNotFoundLike(error) && !isFallbackEligibleError(error)) {
          throw error
        }
      }
    }

    backendPayload = await uploadLegacyDrawing(file, onStatus)
    return enrichWithSyntheticFallback(backendPayload, file)
  } catch (error) {
    backendError = error
    console.error('[REAL BACKEND MODE] Backend fail:', error)

    if (!isFallbackEligibleError(error)) {
      throw error
    }

    // FALLBACK AI MODE
    console.info('[FALLBACK AI MODE] Fallback activated:', {
      drawingName: file.name,
      fingerprint: getFileFingerprint(file),
      reason: error instanceof Error ? error.message : 'Unknown backend failure',
    })

    await playFallbackProcessingStages(onStatus)
    return getOrCreateFallbackAnalysis(file)
  } finally {
    if (backendError) {
      console.debug('[FALLBACK AI MODE] Backend error captured for continuity:', backendError)
    }
  }

  /*
   * Previous backend-only flow kept for reference:
   *
   * if (mode !== 'legacy') {
   *   try {
   *     return await runPipelineDrawing(file, onStatus)
   *   } catch (error) {
   *     if (mode === 'pipeline' || !isNotFoundLike(error)) {
   *       throw error
   *     }
   *   }
   * }
   *
   * return uploadLegacyDrawing(file, onStatus)
   */
}

export async function getDrawingResultById(
  drawingId: string,
  drawingName = `Drawing ${drawingId}.pdf`,
): Promise<NormalizedAnalysisPayload | null> {
  try {
    const response = await http.get(`/drawing-result/${drawingId}`)

    const normalized = normalizePipelineAnalysisResponse(
      response.data as Record<string, unknown>,
      drawingName,
    )

    console.info('[REAL BACKEND MODE] Backend result fetch success:', {
      drawingId,
      totalComponents: normalized.summary.totalComponents,
    })

    return normalized
  } catch (error) {
    if (isNotFoundLike(error)) {
      return null
    }

    throw error
  }
}

export async function getHistoryEntries(): Promise<HistoryEntry[]> {
  try {
    const response = await http.get('/history')

    const payload = Array.isArray(response.data)
      ? response.data
      : []

    return payload.map((entry, index) => {
      const normalized = buildAnalysisRecord(
        normalizePipelineAnalysisResponse(
          entry as Record<string, unknown>,
          String(
            (entry as Record<string, unknown>).drawing_name ??
              `Drawing ${index + 1}`,
          ),
        ),
        String(
          (entry as Record<string, unknown>).drawing_id ??
            index + 1,
        ),
        'backend',
      )

      return {
        id: normalized.id,
        drawingName: normalized.drawingName,
        createdAt: normalized.createdAt,
        totalComponents: normalized.summary.totalComponents,
        detectedTypes: normalized.summary.detectedTypes,
        status: normalized.status,
        source: normalized.source,
        backendDrawingId: normalized.backendDrawingId,
      }
    })
  } catch (error) {
    if (isNotFoundLike(error)) {
      return []
    }

    throw error
  }
}

export async function downloadExcelFile(drawingId: string) {
  const response = await fileHttp.get(
    `/download-excel/${drawingId}`,
  )

  return response.data as Blob
}

export async function pingBackend() {
  try {
    await http.get('/api/health')
    return true
  } catch {
    return false
  }
}
