import type { AnalysisRecord, HistoryEntry } from '@/services/analysis.types'

const STORAGE_KEY = 'electric-ai-analysis-history'
const HISTORY_UPDATED_EVENT = 'electric-ai-history-updated'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function listAnalysisRecords(): AnalysisRecord[] {
  if (!isBrowser()) {
    return []
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const records = JSON.parse(raw) as AnalysisRecord[]
    return records.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
  } catch {
    return []
  }
}

export function getAnalysisRecord(id: string) {
  return listAnalysisRecords().find((record) => record.id === id) ?? null
}

export function saveAnalysisRecord(record: AnalysisRecord) {
  if (!isBrowser()) {
    return
  }

  const records = listAnalysisRecords().filter((entry) => entry.id !== record.id)
  const next = [record, ...records]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT))
}

export function listHistoryEntries(): HistoryEntry[] {
  return listAnalysisRecords().map((record) => ({
    id: record.id,
    drawingName: record.drawingName,
    createdAt: record.createdAt,
    totalComponents: record.summary.totalComponents,
    detectedTypes: record.summary.detectedTypes,
    status: record.status,
    source: record.source,
    backendDrawingId: record.backendDrawingId,
  }))
}

export function onHistoryUpdated(listener: () => void) {
  if (!isBrowser()) {
    return () => undefined
  }

  window.addEventListener(HISTORY_UPDATED_EVENT, listener)
  return () => window.removeEventListener(HISTORY_UPDATED_EVENT, listener)
}
