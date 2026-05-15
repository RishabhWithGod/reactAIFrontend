import { FileUp, LoaderCircle, UploadCloud } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utils/cn'

interface UploadDropzoneProps {
  file: File | null
  isBusy?: boolean
  onSelect: (file: File) => void
}

export function UploadDropzone({ file, isBusy, onSelect }: UploadDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    noClick: true,
    disabled: isBusy,
    onDropAccepted: (files) => {
      const selected = files[0]
      if (selected) {
        onSelect(selected)
      }
    },
  })

  return (
    <Card className="h-full">
      <CardHeader>
        <Badge>Step 1</Badge>
        <CardTitle>Upload electrical drawing PDF</CardTitle>
        <CardDescription>
          Drag in a plan set or click browse. The AI pipeline is tuned for electrical layouts, legends, schedules, and
          BOQ extraction workflows.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div
          {...getRootProps()}
          className={cn(
            'group relative rounded-[28px] border border-dashed p-8 text-center transition-all',
            isDragActive ? 'border-sky-300 bg-sky-300/10 shadow-glow' : 'border-white/12 bg-white/4 hover:border-sky-300/30 hover:bg-white/7',
          )}
        >
          <input {...getInputProps()} />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-sky-400/12 text-sky-100 transition-transform group-hover:scale-105">
            {isBusy ? <LoaderCircle className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
          </div>
          <h4 className="mt-5 font-display text-xl font-semibold text-white">
            {isDragActive ? 'Drop the drawing to stage it for analysis' : 'Drag & drop your PDF here'}
          </h4>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            The analyzer will upload the file, extract OCR, detect symbols, count quantities, and generate a BOQ-ready
            result package.
          </p>
          <div className="mt-6">
            <Button type="button" variant="secondary" onClick={open} disabled={isBusy}>
              <FileUp className="mr-2 h-4 w-4" />
              Browse PDF
            </Button>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-sky-200/70">Current selection</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-white">{file?.name ?? 'No file selected yet'}</p>
              <p className="text-sm text-slate-400">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB PDF ready` : 'Choose a single electrical drawing PDF.'}
              </p>
            </div>
            {file ? <Badge variant="success">Ready for AI analysis</Badge> : <Badge variant="muted">Waiting</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
