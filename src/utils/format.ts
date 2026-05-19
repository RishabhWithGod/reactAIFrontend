import type { AnalysisStage } from '@/services/analysis.types'

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatCurrency(value?: number | null) {
  if (value == null) {
    return 'Pending'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function stageLabel(stage: AnalysisStage) {
  switch (stage) {
    case 'uploading':
      return 'Uploading drawing'
    case 'uploaded':
      return 'Upload complete'
    case 'ocr':
      return 'Running OCR extraction'
    case 'table_detection':
      return 'Detecting schedules & tables'
    case 'ai_parsing':
      return 'Parsing drawing intelligence'
    case 'symbol_detection':
      return 'Detecting electrical symbols'
    case 'quantity_counting':
      return 'Counting quantities'
    case 'boq_generation':
      return 'Generating BOQ'
    case 'cost_estimation':
      return 'Estimating costs'
    case 'complete':
      return 'Analysis complete'
    case 'error':
      return 'Analysis failed'
    default:
      return 'Ready'
  }
}

export function slugifyFileName(value: string) {
  return value.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}
