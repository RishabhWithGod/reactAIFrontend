import { FileImage, FileText } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalysisPage } from '@/services/analysis.types'

interface DrawingPreviewProps {
  drawingName: string
  previewUrl?: string
  pages?: AnalysisPage[]
}

export function DrawingPreview({ drawingName, previewUrl, pages = [] }: DrawingPreviewProps) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="border-b border-white/8">
        <CardTitle>Drawing preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {previewUrl ? (
          <iframe
            title={drawingName}
            src={previewUrl}
            className="h-[560px] w-full bg-slate-950"
          />
        ) : (
          <div className="flex h-[560px] flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%)] px-8 text-center">
            <div className="rounded-[26px] bg-white/6 p-5 text-sky-200">
              <FileImage className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <p className="font-display text-2xl font-semibold text-white">Preview is available during the active session</p>
              <p className="max-w-lg text-sm leading-6 text-slate-400">
                The current backend does not return a stored preview URL, so the dashboard falls back to AI page
                insights once the local preview is no longer available.
              </p>
            </div>
            <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
              {pages.slice(0, 4).map((page) => (
                <div key={page.pageNumber} className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-left">
                  <div className="flex items-center justify-between">
                    <Badge variant="muted">Page {page.pageNumber}</Badge>
                    <FileText className="h-4 w-4 text-sky-200" />
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{page.ocrCount} OCR tokens</p>
                  <p className="text-sm text-slate-400">{page.detectionCount} detections</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-sky-200/70">
                    {page.dominantComponents.join(' • ') || 'Awaiting insights'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
