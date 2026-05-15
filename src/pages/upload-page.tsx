import { ArrowRight, CheckCircle2, DatabaseZap, FileImage, Workflow } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DrawingPreview } from '@/components/dashboard/drawing-preview'
import { PageShell } from '@/components/dashboard/page-shell'
import { UploadDropzone } from '@/components/dashboard/upload-dropzone'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function makeAnalysisId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `analysis-${Date.now()}`
}

export function UploadPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>()

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function handleSelect(nextFile: File) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setFile(nextFile)
    setPreviewUrl(URL.createObjectURL(nextFile))
  }

  function handleStart() {
    if (!file) {
      return
    }

    navigate(`/analysis/${makeAnalysisId()}`, {
      state: {
        file,
        previewUrl,
        drawingName: file.name,
      },
    })
  }

  return (
    <PageShell
      eyebrow="Upload Workspace"
      title="Stage a new electrical drawing for AI analysis"
      description="Use the drag-and-drop upload workflow to stage a PDF, preview the sheet, and launch the AI pipeline. No login or auth flow is required."
      actions={
        <>
          <Button onClick={handleStart} disabled={!file}>
            Start AI analysis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => setFile(null)} disabled={!file}>
            Clear selection
          </Button>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <UploadDropzone file={file} onSelect={handleSelect} />
        <DrawingPreview drawingName={file?.name ?? 'Preview'} previewUrl={previewUrl} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="space-y-4 p-6">
            <Badge>Upload</Badge>
            <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-100">
              <FileImage className="h-5 w-5" />
            </div>
            <p className="font-display text-xl font-semibold text-white">PDF drawing ingest</p>
            <p className="text-sm leading-6 text-slate-400">
              Optimized for electrical plans, legends, schedules, and marked-up design deliverables.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <Badge>AI Workflow</Badge>
            <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-100">
              <Workflow className="h-5 w-5" />
            </div>
            <p className="font-display text-xl font-semibold text-white">OCR + AI processing</p>
            <p className="text-sm leading-6 text-slate-400">
              The frontend is ready for OCR extraction, table parsing, symbol detection, quantity counting, and BOQ generation.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <Badge>Delivery</Badge>
            <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-100">
              <DatabaseZap className="h-5 w-5" />
            </div>
            <p className="font-display text-xl font-semibold text-white">Structured exports</p>
            <p className="text-sm leading-6 text-slate-400">
              Results can be exported as JSON immediately, and Excel is downloaded from the backend when available or generated locally as a fallback.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-display text-xl font-semibold text-white">Ready to process</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The current backend performs upload and analysis in one request, so the dashboard simulates each pipeline
              stage while keeping the API layer future-ready for separate async endpoints.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
            No authentication flow required
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
