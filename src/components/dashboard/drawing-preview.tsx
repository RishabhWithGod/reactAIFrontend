import { FileImage, FileText } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { AnalysisPage } from '@/services/analysis.types'

interface DrawingPreviewProps {
  drawingName: string
  previewUrl?: string
  pages?: AnalysisPage[]
}

export function DrawingPreview({
  drawingName,
  previewUrl,
  pages = [],
}: DrawingPreviewProps) {
  return (
    <Card
      className="
        h-auto
        overflow-hidden
        rounded-[30px]
        border
        border-white/10
        bg-[#6d8fd0]/20
        shadow-[0_8px_40px_rgba(0,0,0,0.10)]
        backdrop-blur-md
      "
    >
      <CardHeader className="border-b border-white/10 py-4">
        <CardTitle className="text-lg font-semibold text-white">
          Drawing Preview
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {previewUrl ? (
          <iframe
            title={drawingName}
            src={previewUrl}
            className="
              h-[620px]
              w-full
              bg-[#7394cf]/18
            "
          />
        ) : (
          <div
            className="
              flex
              h-[620px]
              w-full
              flex-col
              items-center
              justify-center
              gap-4
              px-6
              text-center
            "
          >
            <div
              className="
                rounded-[22px]
                bg-[#7fb4dc]/25
                p-4
                text-cyan-100
              "
            >
              <FileImage className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <p className="font-display text-xl font-semibold text-white">
                Preview Available During Active Session
              </p>

              <p className="max-w-md text-sm leading-6 text-white/75">
                The current backend does not return a stored preview URL.
                AI-generated page insights are shown instead.
              </p>
            </div>

            {pages.length > 0 && (
              <div className="grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {pages.slice(0, 4).map((page) => (
                  <div
                    key={page.pageNumber}
                    className="
                      rounded-[18px]
                      border
                      border-white/10
                      bg-[#7394cf]/18
                      p-3
                      text-left
                    "
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        className="
                          border
                          border-white/10
                          bg-white/10
                          text-white
                        "
                      >
                        Page {page.pageNumber}
                      </Badge>

                      <FileText className="h-4 w-4 text-cyan-100" />
                    </div>

                    <p className="mt-2 text-xs text-white/80">
                      {page.ocrCount} OCR tokens
                    </p>

                    <p className="text-xs text-white/65">
                      {page.detectionCount} detections
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-cyan-100/70">
                      {page.dominantComponents.join(' • ') ||
                        'Awaiting insights'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}