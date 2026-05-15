import type { AnalysisRecord } from '@/services/analysis.types'
import { downloadExcelFile } from '@/api/analysis-api'
import { downloadBlob, slugifyFileName } from '@/utils/format'

export function exportResultAsJson(record: AnalysisRecord) {
  const blob = new Blob([JSON.stringify(record.raw, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `${slugifyFileName(record.drawingName)}-analysis.json`)
}

async function buildWorkbook(record: AnalysisRecord) {
  const XLSX = await import('xlsx')
  const workbook = XLSX.utils.book_new()
  const quantitySheet = XLSX.utils.json_to_sheet(
    record.items.map((item) => ({
      component: item.name,
      symbol: item.symbol,
      quantity: item.quantity,
      category: item.category,
      rating: item.rating ?? '',
    })),
  )
  const boqSheet = XLSX.utils.json_to_sheet(
    record.boqItems.map((item) => ({
      description: item.description,
      code: item.code,
      category: item.category,
      unit: item.unit,
      quantity: item.quantity,
      rate: item.rate ?? '',
      amount: item.amount ?? '',
      notes: item.notes ?? '',
    })),
  )

  XLSX.utils.book_append_sheet(workbook, quantitySheet, 'Quantities')
  XLSX.utils.book_append_sheet(workbook, boqSheet, 'BOQ')

  return { XLSX, workbook }
}

export function exportResultAsExcel(record: AnalysisRecord) {
  void buildWorkbook(record).then(({ XLSX, workbook }) => {
    XLSX.writeFile(workbook, `${slugifyFileName(record.drawingName)}-boq.xlsx`)
  })
}

export async function downloadOrGenerateExcel(record: AnalysisRecord) {
  if (record.backendDrawingId) {
    try {
      const blob = await downloadExcelFile(record.backendDrawingId)
      downloadBlob(blob, `${slugifyFileName(record.drawingName)}-boq.xlsx`)
      return 'backend'
    } catch {
      // Fall back to client-side export.
    }
  }

  exportResultAsExcel(record)
  return 'local'
}
