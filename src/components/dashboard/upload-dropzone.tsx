import {
  FileText,
  FileUp,
  LoaderCircle,
  UploadCloud,
  X,
} from 'lucide-react'

import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { cn } from '@/utils/cn'

interface UploadDropzoneProps {
  files: File[]
  isBusy?: boolean
  onSelect: (files: File[]) => void
  onRemove?: (name: string) => void
}

const acceptedExtensions = ['pdf', 'cad', 'dwg', 'bim']

const maxFileSize = 50 * 1024 * 1024

function isSupportedFile(file: File) {
  const extension = file.name
    .split('.')
    .pop()
    ?.toLowerCase()

  return (
    Boolean(
      extension &&
        acceptedExtensions.includes(extension),
    ) &&
    file.size <= maxFileSize
  )
}

function formatSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

export function UploadDropzone({
  files,
  isBusy,
  onSelect,
  onRemove,
}: UploadDropzoneProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
  } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/octet-stream': [
        '.cad',
        '.dwg',
        '.bim',
      ],
    },
    multiple: true,
    noClick: true,
    disabled: isBusy,

    onDropAccepted: (files) => {
      const validFiles =
        files.filter(isSupportedFile)

      if (
        validFiles.length !== files.length
      ) {
        toast.error(
          'Only PDF, CAD, DWG and BIM files up to 50 MB are supported.',
        )
      }

      if (validFiles.length) {
        onSelect(validFiles)
      }
    },

    onDropRejected: () => {
      toast.error(
        'Only PDF, CAD, DWG and BIM files up to 50 MB are supported.',
      )
    },
  })

  return (
    <Card
      className="
        h-full
        rounded-[32px]
        border
        border-white/10
        bg-[#6d8fd0]/20
        shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        backdrop-blur-md
      "
    >
      <CardHeader>
        <Badge
          className="
            w-fit
            border
            border-white/10
            bg-white/10
            text-white
          "
        >
          Step 1
        </Badge>

        <CardTitle className="text-white">
          Upload Electrical Takeoff Files
        </CardTitle>

        <CardDescription className="text-white/75">
          Drag project drawings or browse
          files. Supports PDF, CAD, DWG and
          BIM formats.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={cn(
            `
              group
              relative
              rounded-[28px]
              border
              border-dashed
              p-8
              text-center
              transition-all
              duration-300
            `,
            isDragActive
              ? 'border-cyan-300 bg-cyan-300/15'
              : 'border-white/10 bg-white/8 hover:border-cyan-300/40 hover:bg-white/12',
          )}
        >
          <input {...getInputProps()} />

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-[24px]
              bg-[#7fb4dc]/25
              text-cyan-100
            "
          >
            {isBusy ? (
              <LoaderCircle className="h-7 w-7 animate-spin" />
            ) : (
              <UploadCloud className="h-7 w-7" />
            )}
          </div>

          <h4 className="mt-5 font-display text-xl font-semibold text-white">
            {isDragActive
              ? 'Drop files here'
              : 'Drag & Drop Your Drawing'}
          </h4>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/75">
            Upload electrical drawings and
            project files for AI analysis.
          </p>

          <div className="mt-6">
            <Button
              type="button"
              onClick={open}
              disabled={isBusy}
              className="
                bg-[#38d7ff]
                text-black
                hover:bg-[#58e0ff]
              "
            >
              <FileUp className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-cyan-100/70">
            PDF • CAD • DWG • BIM
          </p>
        </div>

        {/* File List */}
        <div
          className="
            rounded-[24px]
            border
            border-white/10
            bg-[#7394cf]/18
            p-4
          "
        >
          <div className="flex items-center justify-between">

            <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/70">
              Selected Files
            </p>

            {files.length ? (
              <Badge className="bg-emerald-500 text-white">
                {files.length} Ready
              </Badge>
            ) : (
              <Badge
                className="
                  bg-white/10
                  text-white
                "
              >
                Waiting
              </Badge>
            )}
          </div>

          <div className="mt-4 space-y-3">

            {files.length ? (
              files.map((file) => (
                <div
                  key={`${file.name}-${file.size}`}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/10
                    p-3
                  "
                >
                  <div className="flex min-w-0 items-center gap-3">

                    <span
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#7fb4dc]/25
                        text-cyan-100
                      "
                    >
                      <FileText className="h-5 w-5" />
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {file.name}
                      </p>

                      <p className="text-xs text-white/65">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </div>

                  {onRemove ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        onRemove(file.name)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-white/70">
                No files selected yet.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}