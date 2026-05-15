import { useEffect, useState } from 'react'

import type { AnalysisRecord, HistoryEntry } from '@/services/analysis.types'
import { getAnalysisRecord, listAnalysisRecords, listHistoryEntries, onHistoryUpdated } from '@/services/analysis-storage'

export function useAnalysisHistory() {
  const [records, setRecords] = useState<AnalysisRecord[]>(() => listAnalysisRecords())
  const [history, setHistory] = useState<HistoryEntry[]>(() => listHistoryEntries())

  useEffect(() => {
    const refresh = () => {
      setRecords(listAnalysisRecords())
      setHistory(listHistoryEntries())
    }

    refresh()
    return onHistoryUpdated(refresh)
  }, [])

  return {
    records,
    history,
    getRecord: (id: string) => getAnalysisRecord(id),
  }
}
