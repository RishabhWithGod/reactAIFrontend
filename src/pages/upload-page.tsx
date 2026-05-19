import { ArrowRight, BookOpen, CheckCircle2, DatabaseZap, FileImage, Headphones, Info, Trash2, Video, Workflow } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { DrawingPreview } from '@/components/dashboard/drawing-preview'
import { PageShell } from '@/components/dashboard/page-shell'
import { UploadDropzone } from '@/components/dashboard/upload-dropzone'
import { TextArea } from '@/components/forms/form-field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function makeAnalysisId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `analysis-${Date.now()}`
}

export function UploadPage() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<File[]>([])
  const [notes, setNotes] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string>()
  const primaryFile = files[0] ?? null

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    if (!files.length) {
      setUploadProgress(0)
      return
    }

    setUploadProgress(12)
    const timer = window.setInterval(() => {
      setUploadProgress((current) => Math.min(100, current + 14))
    }, 180)

    return () => window.clearInterval(timer)
  }, [files.length])

  function handleSelect(nextFiles: File[]) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const merged = [...files, ...nextFiles].filter((file, index, allFiles) => (
      allFiles.findIndex((candidate) => candidate.name === file.name && candidate.size === file.size) === index
    ))

    setFiles(merged)
    setPreviewUrl(URL.createObjectURL(merged[0]))
  }

  function handleRemove(name: string) {
    const remaining = files.filter((file) => file.name !== name)
    setFiles(remaining)

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl(remaining[0] ? URL.createObjectURL(remaining[0]) : undefined)
  }

  function handleStart() {
    if (!primaryFile) {
      toast.error('Select at least one supported project file.')
      return
    }

    navigate(`/analysis/${makeAnalysisId()}`, {
      state: {
        file: primaryFile,
        previewUrl,
        drawingName: primaryFile.name,
        notes,
      },
    })
  }

  return (
    <PageShell
      eyebrow="Upload Workspace"
      title="AI Takeoff Upload"
      description="Upload your project files for AI-powered electrical takeoff analysis."
      actions={
        <>
          <Button onClick={handleStart} disabled={!primaryFile}>
            Run AI Takeoff
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => setFiles([])} disabled={!files.length}>
            Clear selection
          </Button>
        </>
      }
    >
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <UploadDropzone files={files} onSelect={handleSelect} onRemove={handleRemove} />
        <div className="space-y-6">
          <Card
  className="
    rounded-[32px]
    border
    border-white/10
    bg-[#6d8fd0]/20
    shadow-[0_8px_40px_rgba(0,0,0,0.12)]
    backdrop-blur-md
  "
>
  <CardContent className="space-y-6 p-8">

    <div className="flex items-center justify-between gap-4">

      <h3
        className="
          font-display
          text-xl
          font-semibold
          text-white
        "
      >
        Project Notes
      </h3>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => setNotes('')}
        disabled={!notes}
        className="
          border
          border-white/10
          bg-white/10
          text-white
          hover:bg-white/20
        "
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Clear
      </Button>

    </div>

    <TextArea
    rows={7}
    className="
    min-h-[180px]
    resize-none
    rounded-2xl
    border-white/10
    bg-white/10
    text-white
    placeholder:text-white/50"
      value={notes} 
      onChange={(event) => setNotes(event.target.value)}
      placeholder="Add any specific instructions or details about the project..."
    />
    <div
      className="
        flex
        gap-3
        rounded-2xl
        border
        border-white/10
        bg-[#7394cf]/18
        p-4
        text-sm
        text-white/75
      "
    >
          <Info
            className="
              mt-0.5
              h-4
              w-4
              shrink-0
              text-cyan-100
            "
           />
                  <span>
                    Notes help the AI understand project context
                    when backend support is added.
                  </span>
                </div>

            </CardContent>
          </Card>
          <DrawingPreview drawingName={primaryFile?.name ?? 'Preview'} previewUrl={previewUrl} />
        </div>    
      </div>

      <div className="mt-10 mb-5 grid gap-8 lg:grid-cols-3">
        <Card
              className="
                h-full
                rounded-[32px]
                border
                border-white/10
                bg-[#6d8fd0]/20
                backdrop-blur-md
              "
            >
          <CardContent className="space-y-5 p-8">
            <Badge>Upload</Badge>
            <div className="rounded-2xl bg-[#7fb4dc]/25 p-4 text-sky-100">
              <FileImage className="h-5 w-5" />
            </div>
            <p className="font-display text-xl font-semibold text-white">PDF drawing ingest</p>
            <p className="text-sm leading-6 text-slate-400">
              Optimized for electrical plans, legends, schedules, and marked-up design deliverables.
            </p>
          </CardContent>
        </Card>
        <Card
              className="
                h-full
                rounded-[32px]
                border
                border-white/10
                bg-[#6d8fd0]/20
                backdrop-blur-md
              "
            >
          <CardContent className="space-y-5 p-8">
            <Badge>AI Workflow</Badge>
            <div className="rounded-2xl bg-[#7fb4dc]/25 p-4 text-sky-100">
              <Workflow className="h-5 w-5" />
            </div>
            <p className="font-display text-xl font-semibold text-white">OCR + AI processing</p>
            <p className="text-sm leading-6 text-slate-400">
              The frontend is ready for OCR extraction, table parsing, symbol detection, quantity counting, and BOQ generation.
            </p>
          </CardContent>
        </Card>
        <Card
  className="
    h-full
    rounded-[32px]
    border
    border-white/10
    bg-[#6d8fd0]/20
    backdrop-blur-md
  "
>
          <CardContent className="space-y-5 p-8">
            <Badge>Delivery</Badge>
            <div className="rounded-2xl bg-[#7fb4dc]/25 p-4 text-sky-100">
              <DatabaseZap className="h-5 w-5" />
            </div>
            <p className="font-display text-xl font-semibold text-white">Structured exports</p>
            <p className="text-sm leading-6 text-slate-400">
              Results can be exported as JSON immediately, and Excel is downloaded from the backend when available or generated locally as a fallback.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card
            className="
              h-full
              mb-5
              rounded-[32px]
              border
              border-white/10
              bg-[#6d8fd0]/20
              backdrop-blur-md
            "
          >
        <CardContent className="space-y-6 p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-display text-xl font-semibold text-white">Upload progress</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Selected files are validated locally before the current backend analysis call starts.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              Demo auth enabled
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-200 transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card
          className="
            h-full
            mb-5
            rounded-[32px]
            border
            border-white/10
            bg-[#6d8fd0]/20
            backdrop-blur-md
          "
        >
        <CardContent className="space-y-6 p-8">
          <div>
            <h3 className="font-display text-xl font-semibold text-white">Recent Activity</h3>
            <p className="mt-2 text-sm text-slate-400">Your 3 most recent uploads</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {['Office_Building_Plans.pdf', 'Commercial_Specs.dwg', 'Residential_Model.bim'].map((name) => (
              <div key={name} className="
  rounded-[24px]
  border
  border-white/10
  bg-[#7394cf]/18
  p-6
  text-center
">
                <FileImage className="mx-auto h-10 w-10 text-sky-200" />
                <p className="mt-4 truncate font-semibold text-white">{name}</p>
                <p className="mt-1 text-xs text-slate-400">Uploaded 2 hours ago</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: BookOpen, title: 'Documentation', text: 'View comprehensive guides on using AI Takeoff.' },
          { icon: Video, title: 'Tutorial Videos', text: 'Watch step-by-step tutorials on file preparation.' },
          { icon: Headphones, title: 'Support Team', text: 'Contact experts for personalized assistance.' },
        ].map((item) => (
         <Card
              key={item.title}
              className="
                h-full
                rounded-[28px]
                border
                border-white/10
                bg-[#6d8fd0]/20
                backdrop-blur-md
              "
            >
            <CardContent className="flex gap-5 p-6">
              <item.icon className="mt-1 h-8 w-8 shrink-0 text-sky-200" />
              <div>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-400">{item.text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
