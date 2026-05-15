import type {
  AnalysisItem,
  AnalysisPage,
  AnalysisRecord,
  AnalysisSummary,
  BoqItem,
  NormalizedAnalysisPayload,
} from '@/services/analysis.types'

function humanizeToken(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function componentCode(name: string, index: number) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return `${initials || 'EC'}-${String(index + 1).padStart(2, '0')}`
}

function buildBoqItems(items: AnalysisItem[]): BoqItem[] {
  return items.map((item, index) => ({
    description: item.name,
    code: item.symbol || componentCode(item.name, index),
    category: item.category,
    unit: 'Nos',
    quantity: item.quantity,
    rate: null,
    amount: null,
    notes: item.rating ? `Detected rating: ${item.rating}` : 'Auto-generated from AI quantity analysis',
  }))
}

function buildSummary(
  itemCount: number,
  pageCount: number,
  drawingName: string,
  detectedTypes: number,
  override?: Partial<AnalysisSummary>,
): AnalysisSummary {
  return {
    pageCount,
    totalComponents: itemCount,
    detectedTypes,
    generatedAt: new Date().toISOString(),
    humanReadable:
      override?.humanReadable ??
      `Analyzed ${drawingName} across ${pageCount} page(s) and identified ${itemCount} component(s).`,
    ...override,
  }
}

function normalizePages(rawPages: Array<Record<string, unknown>> | undefined): AnalysisPage[] {
  if (!rawPages?.length) {
    return []
  }

  return rawPages.map((page, index) => {
    const rawDetections = Array.isArray(page.detections)
      ? page.detections.map((detection) => {
          const typed = detection as Record<string, unknown>

          return {
            type: String(typed.type ?? typed.label ?? 'component'),
            label: typed.label ? String(typed.label) : undefined,
            confidence: typeof typed.confidence === 'number' ? typed.confidence : undefined,
            rating: typed.rating ? String(typed.rating) : undefined,
          }
        })
      : []

    const rawOcrTokens = Array.isArray(page.ocr_tokens)
      ? page.ocr_tokens.map((token) => {
          const typed = token as Record<string, unknown>

          return {
            text: String(typed.text ?? typed.word ?? typed.label ?? ''),
            confidence: typeof typed.confidence === 'number' ? typed.confidence : undefined,
          }
        })
      : []

    const dominantComponents = [...new Set(rawDetections.map((detection) => humanizeToken(detection.type)).slice(0, 4))]

    return {
      pageNumber: Number(page.page_number ?? index + 1),
      ocrCount: rawOcrTokens.length,
      detectionCount: rawDetections.length,
      dominantComponents,
      rawDetections,
      rawOcrTokens,
    }
  })
}

export function normalizeLegacyAnalysisResponse(
  payload: Record<string, unknown>,
  drawingName: string,
): NormalizedAnalysisPayload {
  const boq = (payload.json ?? payload.boq_json ?? {}) as Record<string, unknown>
  const ratings = (boq.ratings ?? {}) as Record<string, Record<string, number>>
  const componentEntries = Object.entries(boq).filter(([key, value]) => key !== 'ratings' && typeof value === 'number')

  const items: AnalysisItem[] = componentEntries
    .filter(([, value]) => Number(value) > 0)
    .map(([key, value], index) => {
      const name = humanizeToken(key)
      const ratingDetails = ratings[key]
        ? Object.entries(ratings[key])
            .map(([rating, count]) => `${rating} x ${count}`)
            .join(', ')
        : undefined

      return {
        name,
        symbol: componentCode(name, index),
        quantity: Number(value),
        category: 'Electrical Component',
        rating: ratingDetails,
      }
    })

  const pages = normalizePages(payload.pages as Array<Record<string, unknown>> | undefined)
  const summaryPayload = (payload.summary ?? {}) as Partial<AnalysisSummary> & {
    pages_processed?: number
    total_components?: number
    detected_types?: number
  }

  return {
    drawingName,
    items,
    boqItems: buildBoqItems(items),
    summary: buildSummary(
      Number(summaryPayload.total_components ?? items.reduce((sum, item) => sum + item.quantity, 0)),
      Number(summaryPayload.pages_processed ?? (pages.length || 1)),
      drawingName,
      Number(summaryPayload.detected_types ?? items.length),
      {
        humanReadable: summaryPayload.humanReadable,
      },
    ),
    pages,
    raw: payload,
    tableCsv: typeof payload.csv === 'string' ? payload.csv : undefined,
    tableText: typeof payload.table === 'string' ? payload.table : undefined,
  }
}

export function normalizePipelineAnalysisResponse(
  payload: Record<string, unknown>,
  drawingName: string,
): NormalizedAnalysisPayload {
  const rawItems = Array.isArray(payload.items) ? payload.items : []

  const items: AnalysisItem[] = rawItems.map((entry, index) => {
    const item = entry as Record<string, unknown>
    const name = String(item.name ?? `Detected Component ${index + 1}`)

    return {
      name,
      symbol: String(item.symbol ?? componentCode(name, index)),
      quantity: Number(item.quantity ?? 0),
      category: String(item.category ?? 'Electrical Component'),
      confidence: typeof item.confidence === 'number' ? item.confidence : undefined,
      rating: item.rating ? String(item.rating) : undefined,
    }
  })

  const rawBoqItems = Array.isArray(payload.boq_items) ? payload.boq_items : []
  const boqItems: BoqItem[] = rawBoqItems.length
    ? rawBoqItems.map((entry, index) => {
        const item = entry as Record<string, unknown>
        const description = String(item.description ?? item.name ?? `Material ${index + 1}`)

        return {
          description,
          code: String(item.code ?? componentCode(description, index)),
          category: String(item.category ?? 'Electrical Component'),
          unit: String(item.unit ?? 'Nos'),
          quantity: Number(item.quantity ?? 0),
          rate: typeof item.rate === 'number' ? item.rate : null,
          amount: typeof item.amount === 'number' ? item.amount : null,
          notes: item.notes ? String(item.notes) : undefined,
        }
      })
    : buildBoqItems(items)

  const pages = normalizePages(payload.pages as Array<Record<string, unknown>> | undefined)
  const summaryPayload = (payload.summary ?? {}) as Partial<AnalysisSummary>

  return {
    backendDrawingId: payload.drawing_id ? String(payload.drawing_id) : undefined,
    drawingName: String(payload.drawing_name ?? drawingName),
    items,
    boqItems,
    summary: buildSummary(
      items.reduce((sum, item) => sum + item.quantity, 0),
      pages.length || 1,
      drawingName,
      items.length,
      summaryPayload,
    ),
    pages,
    raw: payload,
  }
}

export function buildAnalysisRecord(
  payload: NormalizedAnalysisPayload,
  id: string,
  source: AnalysisRecord['source'],
): AnalysisRecord {
  return {
    ...payload,
    id,
    status: 'completed',
    createdAt: new Date().toISOString(),
    source,
  }
}
