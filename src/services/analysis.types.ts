export type AnalysisStage =
  | 'idle'
  | 'uploading'
  | 'uploaded'
  | 'ocr'
  | 'table_detection'
  | 'ai_parsing'
  | 'symbol_detection'
  | 'quantity_counting'
  | 'boq_generation'
  | 'complete'
  | 'error'

export interface AnalysisStatusUpdate {
  stage: AnalysisStage
  progress: number
  label: string
  detail: string
}

export interface AnalysisItem {
  name: string
  symbol: string
  quantity: number
  category: string
  confidence?: number
  rating?: string
}

export interface BoqItem {
  description: string
  code: string
  category: string
  unit: string
  quantity: number
  rate?: number | null
  amount?: number | null
  notes?: string
}

export interface AnalysisSummary {
  pageCount: number
  totalComponents: number
  detectedTypes: number
  generatedAt: string
  humanReadable: string
}

export interface AnalysisPage {
  pageNumber: number
  ocrCount: number
  detectionCount: number
  dominantComponents: string[]
  rawOcrTokens?: Array<{ text: string; confidence?: number }>
  rawDetections?: Array<{
    type: string
    label?: string
    confidence?: number
    rating?: string
  }>
}

export interface NormalizedAnalysisPayload {
  backendDrawingId?: string
  drawingName: string
  items: AnalysisItem[]
  boqItems: BoqItem[]
  summary: AnalysisSummary
  pages: AnalysisPage[]
  raw: unknown
  tableCsv?: string
  tableText?: string
}

export interface AnalysisRecord extends NormalizedAnalysisPayload {
  id: string
  createdAt: string
  status: 'processing' | 'completed' | 'failed'
  source: 'local' | 'backend'
}

export interface HistoryEntry {
  id: string
  drawingName: string
  createdAt: string
  totalComponents: number
  detectedTypes: number
  status: AnalysisRecord['status']
  source: AnalysisRecord['source']
  backendDrawingId?: string
}

export interface UploadRouteState {
  file?: File
  previewUrl?: string
  drawingName?: string
}
