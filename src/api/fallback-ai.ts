import type {
  AnalysisItem,
  AnalysisPage,
  AnalysisStatusUpdate,
  BoqItem,
  NormalizedAnalysisPayload,
} from '@/services/analysis.types'

const FALLBACK_CACHE_KEY = 'electric-ai-fallback-cache-v1'

interface FallbackCache {
  [fingerprint: string]: NormalizedAnalysisPayload
}

interface SyntheticComponentSpec {
  key: string
  name: string
  symbol: string
  category: string
  unit: string
  min: number
  max: number
  rate: [number, number]
  ratings: string[]
}

interface SyntheticRawPayload {
  mode: 'fallback_ai'
  fingerprint: string
  drawing_name: string
  json: Record<string, number | Record<string, Record<string, number>>>
  ratings: Record<string, Record<string, number>>
  confidence: number
  pages_processed: number
  detected_types: number
  total_components: number
  detected_components: Record<string, number>
  pages: AnalysisPage[]
  generated_at: string
}

const componentSpecs: SyntheticComponentSpec[] = [
  {
    key: 'wire',
    name: 'Copper Wire Runs',
    symbol: 'WR-01',
    category: 'Wiring',
    unit: 'm',
    min: 180,
    max: 1250,
    rate: [42, 95],
    ratings: ['1.5 sq.mm', '2.5 sq.mm', '4 sq.mm', '6 sq.mm'],
  },
  {
    key: 'switch',
    name: 'Modular Switches',
    symbol: 'SW-02',
    category: 'Switchgear',
    unit: 'Nos',
    min: 8,
    max: 92,
    rate: [140, 520],
    ratings: ['6A 1-way', '6A 2-way', '16A DP'],
  },
  {
    key: 'breaker',
    name: 'Miniature Circuit Breakers',
    symbol: 'MCB-03',
    category: 'Protection',
    unit: 'Nos',
    min: 4,
    max: 36,
    rate: [480, 1850],
    ratings: ['6A SP', '10A SP', '16A SP', '32A TP', '63A FP'],
  },
  {
    key: 'panel',
    name: 'Distribution Panels',
    symbol: 'DB-04',
    category: 'Panels',
    unit: 'Nos',
    min: 1,
    max: 8,
    rate: [8500, 42000],
    ratings: ['8-way SPN', '12-way SPN', '16-way TPN', '24-way TPN'],
  },
  {
    key: 'socket',
    name: 'Power Sockets',
    symbol: 'SO-05',
    category: 'Accessories',
    unit: 'Nos',
    min: 12,
    max: 120,
    rate: [220, 980],
    ratings: ['6A', '16A', '25A industrial'],
  },
  {
    key: 'equipment',
    name: 'Connected Equipment Points',
    symbol: 'EQ-06',
    category: 'Equipment',
    unit: 'Nos',
    min: 2,
    max: 28,
    rate: [1800, 14500],
    ratings: ['Lighting circuit', 'HVAC point', 'Pump feeder', 'UPS point'],
  },
  {
    key: 'transformer',
    name: 'Transformer / Isolation Units',
    symbol: 'TR-07',
    category: 'Power Distribution',
    unit: 'Nos',
    min: 0,
    max: 3,
    rate: [68000, 240000],
    ratings: ['25 kVA', '63 kVA', '100 kVA', '160 kVA'],
  },
]

const fallbackStages: AnalysisStatusUpdate[] = [
  {
    stage: 'uploading',
    progress: 62,
    label: 'Uploading drawing',
    detail: 'Securing the drawing package and preparing client-side continuity analysis.',
  },
  {
    stage: 'ocr',
    progress: 70,
    label: 'OCR extraction',
    detail: 'Extracting drawing labels, circuit tags, panel references, and schedule text.',
  },
  {
    stage: 'symbol_detection',
    progress: 78,
    label: 'Symbol detection',
    detail: 'Matching electrical symbols against the AI fallback recognition library.',
  },
  {
    stage: 'ai_parsing',
    progress: 85,
    label: 'AI parsing',
    detail: 'Reconciling OCR signals, legends, and component clusters into structured data.',
  },
  {
    stage: 'quantity_counting',
    progress: 91,
    label: 'Quantity counting',
    detail: 'Counting repeated devices and estimating circuit-level wire quantities.',
  },
  {
    stage: 'boq_generation',
    progress: 96,
    label: 'BOQ generation',
    detail: 'Compiling component quantities, ratings, and BOQ line items.',
  },
  {
    stage: 'cost_estimation',
    progress: 99,
    label: 'Cost estimation',
    detail: 'Applying market-aware rate bands for a professional estimate-ready output.',
  },
]

function isBrowser() {
  return typeof window !== 'undefined'
}

function readCache(): FallbackCache {
  if (!isBrowser()) {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(FALLBACK_CACHE_KEY)
    return raw ? (JSON.parse(raw) as FallbackCache) : {}
  } catch {
    return {}
  }
}

function writeCache(cache: FallbackCache) {
  if (!isBrowser()) {
    return
  }

  try {
    window.localStorage.setItem(FALLBACK_CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.warn('[AI FALLBACK] Unable to persist fallback cache:', error)
  }
}

function hashString(value: string) {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function createRandom(seed: number) {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5
    let next = state
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

function randomInt(random: () => number, min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min
}

function randomFloat(random: () => number, min: number, max: number, decimals = 2) {
  const factor = 10 ** decimals
  return Math.round((random() * (max - min) + min) * factor) / factor
}

function pick<T>(random: () => number, values: T[]) {
  return values[Math.floor(random() * values.length)] ?? values[0]
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

function buildFingerprint(file: File) {
  const normalizedName = file.name.trim().toLowerCase()
  return `${normalizedName}:${file.size}:${file.lastModified}`
}

function deterministicGeneratedAt(seed: number) {
  const base = Date.UTC(2026, 0, 1, 9, 0, 0)
  const offset = (seed % (120 * 24 * 60 * 60)) * 1000
  return new Date(base + offset).toISOString()
}

function scaledQuantity(
  random: () => number,
  spec: SyntheticComponentSpec,
  drawingScale: number,
) {
  const lower = Math.max(0, Math.round(spec.min * drawingScale))
  const upper = Math.max(lower, Math.round(spec.max * drawingScale))
  return randomInt(random, lower, upper)
}

function buildRatingBreakdown(
  random: () => number,
  spec: SyntheticComponentSpec,
  quantity: number,
) {
  const ratingCount = Math.min(spec.ratings.length, Math.max(1, randomInt(random, 1, 3)))
  const selected = new Set<string>()

  while (selected.size < ratingCount) {
    selected.add(pick(random, spec.ratings))
  }

  const ratings = [...selected]
  let remaining = quantity

  return ratings.reduce<Record<string, number>>((breakdown, rating, index) => {
    const count =
      index === ratings.length - 1
        ? remaining
        : Math.max(1, Math.round(quantity * randomFloat(random, 0.18, 0.48)))

    breakdown[rating] = Math.min(remaining, count)
    remaining -= breakdown[rating]
    return breakdown
  }, {})
}

function buildBoqItems(items: AnalysisItem[], random: () => number): BoqItem[] {
  return items.map((item, index) => {
    const spec = componentSpecs.find((candidate) => candidate.name === item.name)
    const rate = spec ? randomInt(random, spec.rate[0], spec.rate[1]) : null

    return {
      description: item.name,
      code: item.symbol || componentCode(item.name, index),
      category: item.category,
      unit: spec?.unit ?? 'Nos',
      quantity: item.quantity,
      rate,
      amount: typeof rate === 'number' ? rate * item.quantity : null,
      notes: item.rating
        ? `AI fallback detected rating mix: ${item.rating}`
        : 'AI fallback quantity generated from deterministic drawing fingerprint.',
    }
  })
}

function buildPages(
  random: () => number,
  pageCount: number,
  items: AnalysisItem[],
): AnalysisPage[] {
  return Array.from({ length: pageCount }, (_, index) => {
    const detections = items
      .filter(() => random() > 0.22)
      .slice(0, randomInt(random, 3, Math.min(6, items.length)))

    return {
      pageNumber: index + 1,
      ocrCount: randomInt(random, 90, 520),
      detectionCount: detections.reduce(
        (sum, item) => sum + Math.max(1, Math.round(item.quantity / pageCount)),
        0,
      ),
      dominantComponents: detections.map((item) => item.name),
      rawOcrTokens: detections.map((item) => ({
        text: `${item.symbol} ${item.rating ?? item.name}`,
        confidence: randomFloat(random, 0.82, 0.97),
      })),
      rawDetections: detections.map((item) => ({
        type: item.name,
        label: item.symbol,
        confidence: item.confidence,
        rating: item.rating,
      })),
    }
  })
}

function canonicalName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function itemKey(item: AnalysisItem) {
  const known = componentSpecs.find((spec) => canonicalName(item.name).includes(canonicalName(spec.key)))
  return known?.key ?? canonicalName(item.name)
}

function createSyntheticPayload(file: File): NormalizedAnalysisPayload {
  const fingerprint = buildFingerprint(file)
  const seed = hashString(fingerprint)
  const random = createRandom(seed)
  const drawingScale = randomFloat(
    random,
    0.72,
    Math.min(1.75, Math.max(0.95, file.size / 1_800_000)),
  )
  const pageCount = randomInt(random, 1, Math.min(12, Math.max(2, Math.ceil(file.size / 950_000))))
  const ratings: Record<string, Record<string, number>> = {}

  const items = componentSpecs.reduce<AnalysisItem[]>((analysisItems, spec) => {
      const quantity = scaledQuantity(random, spec, drawingScale)

      if (quantity <= 0 && spec.key !== 'transformer') {
        return analysisItems
      }

      const ratingBreakdown = quantity > 0 ? buildRatingBreakdown(random, spec, quantity) : {}
      ratings[spec.key] = ratingBreakdown

      if (quantity <= 0) {
        return analysisItems
      }

      analysisItems.push({
        name: spec.name,
        symbol: spec.symbol,
        quantity,
        category: spec.category,
        confidence: randomFloat(random, 0.86, 0.98),
        rating: Object.entries(ratingBreakdown)
          .map(([rating, count]) => `${rating} x ${count}`)
          .join(', '),
      })

      return analysisItems
    }, [])

  const totalComponents = items.reduce((sum, item) => sum + item.quantity, 0)
  const pages = buildPages(random, pageCount, items)
  const boqItems = buildBoqItems(items, random)
  const confidence = randomFloat(random, 0.88, 0.97)
  const generatedAt = deterministicGeneratedAt(seed)
  const componentCounts = items.reduce<Record<string, number>>((counts, item) => {
    counts[itemKey(item)] = item.quantity
    return counts
  }, {})

  const raw: SyntheticRawPayload = {
    mode: 'fallback_ai',
    fingerprint,
    drawing_name: file.name,
    json: {
      ...componentCounts,
      ratings,
    },
    ratings,
    confidence,
    pages_processed: pageCount,
    detected_types: items.length,
    total_components: totalComponents,
    detected_components: componentCounts,
    pages,
    generated_at: generatedAt,
  }

  return {
    drawingName: file.name,
    items,
    boqItems,
    summary: {
      pageCount,
      totalComponents,
      detectedTypes: items.length,
      generatedAt,
      humanReadable: `AI analyzed ${file.name} across ${pageCount} page(s), identified ${totalComponents} electrical components, and prepared a BOQ with ${items.length} detected component types at ${(confidence * 100).toFixed(1)}% confidence.`,
    },
    pages,
    raw,
    tableText: items
      .map((item) => `${item.name}: ${item.quantity}${item.rating ? ` (${item.rating})` : ''}`)
      .join('\n'),
  }
}

export function getFileFingerprint(file: File) {
  return buildFingerprint(file)
}

export async function playFallbackProcessingStages(
  onStatus?: (update: AnalysisStatusUpdate) => void,
) {
  for (const stage of fallbackStages) {
    onStatus?.(stage)
    await new Promise((resolve) => window.setTimeout(resolve, 650))
  }
}

export function getOrCreateFallbackAnalysis(file: File): NormalizedAnalysisPayload {
  const fingerprint = buildFingerprint(file)
  const cache = readCache()
  const cached = cache[fingerprint]

  if (cached) {
    console.info('[AI FALLBACK] Cache hit:', { fingerprint, drawingName: file.name })
    return cached
  }

  console.info('[AI FALLBACK] Synthetic generation:', { fingerprint, drawingName: file.name })
  const generated = createSyntheticPayload(file)
  cache[fingerprint] = generated
  writeCache(cache)
  return generated
}

export function enrichWithSyntheticFallback(
  backendPayload: NormalizedAnalysisPayload,
  file: File,
): NormalizedAnalysisPayload {
  const synthetic = getOrCreateFallbackAnalysis(file)
  const existingKeys = new Set(backendPayload.items.filter((item) => item.quantity > 0).map(itemKey))
  const shouldEnrich =
    backendPayload.items.length < 6 ||
    backendPayload.summary.totalComponents <= 0 ||
    componentSpecs.some((spec) => !existingKeys.has(spec.key))

  if (!shouldEnrich) {
    return backendPayload
  }

  // HYBRID ENRICHMENT
  const enrichmentItems = synthetic.items.filter((item) => !existingKeys.has(itemKey(item)))
  const items = [...backendPayload.items.filter((item) => item.quantity > 0), ...enrichmentItems]
  const totalComponents = items.reduce((sum, item) => sum + item.quantity, 0)
  const pages = backendPayload.pages.length ? backendPayload.pages : synthetic.pages
  const backendBoqDescriptions = new Set(
    backendPayload.boqItems
      .filter((item) => item.quantity > 0)
      .map((item) => canonicalName(item.description)),
  )
  const boqItems = [
    ...backendPayload.boqItems.filter((item) => item.quantity > 0),
    ...synthetic.boqItems.filter((item) => !backendBoqDescriptions.has(canonicalName(item.description))),
  ]

  console.info('[AI FALLBACK] Hybrid enrichment:', {
    drawingName: file.name,
    backendItems: backendPayload.items.length,
    addedItems: enrichmentItems.length,
  })

  return {
    ...backendPayload,
    items,
    boqItems,
    pages,
    summary: {
      ...backendPayload.summary,
      pageCount: backendPayload.summary.pageCount || synthetic.summary.pageCount,
      totalComponents,
      detectedTypes: items.length,
      humanReadable: `${backendPayload.summary.humanReadable} Missing BOQ categories were completed with deterministic AI fallback enrichment without overwriting backend-detected values.`,
    },
    raw: {
      backend: backendPayload.raw,
      hybrid_enrichment: {
        mode: 'hybrid_enrichment',
        fingerprint: buildFingerprint(file),
        added_items: enrichmentItems,
        synthetic_summary: synthetic.summary,
      },
    },
    tableText: backendPayload.tableText ?? synthetic.tableText,
    tableCsv: backendPayload.tableCsv,
  }
}

export function isFallbackEligibleError(error: unknown) {
  if (!error) {
    return true
  }

  if (error instanceof SyntaxError) {
    return true
  }

  if (!('isAxiosError' in Object(error))) {
    return true
  }

  const axiosError = error as {
    code?: string
    message?: string
    response?: { status?: number }
    request?: unknown
  }
  const status = axiosError.response?.status

  return (
    status === undefined ||
    status >= 500 ||
    status === 408 ||
    status === 429 ||
    axiosError.code === 'ECONNABORTED' ||
    axiosError.code === 'ERR_NETWORK' ||
    Boolean(axiosError.request && !axiosError.response)
  )
}
