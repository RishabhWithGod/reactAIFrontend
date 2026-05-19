import { Download, FileJson, FileSpreadsheet, Layers3, ScanLine, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { getDrawingResultById } from '@/api/analysis-api'
import { BoqTable } from '@/components/dashboard/boq-table'
import { ComponentList } from '@/components/dashboard/component-list'
import { DrawingPreview } from '@/components/dashboard/drawing-preview'
import { PageShell } from '@/components/dashboard/page-shell'
import { QuantityTable } from '@/components/dashboard/quantity-table'
import { SectionTitle } from '@/components/dashboard/section-title'
import { StatCard } from '@/components/dashboard/stat-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAnalysisHistory } from '@/hooks/use-analysis-history'
import { saveAnalysisRecord } from '@/services/analysis-storage'
import type { AnalysisRecord } from '@/services/analysis.types'
import { downloadOrGenerateExcel, exportResultAsJson } from '@/services/export-service'
import { formatDate, formatNumber } from '@/utils/format'
import { buildAnalysisRecord } from '@/utils/result-adapter'

export function ResultsPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const previewUrl = (location.state as { previewUrl?: string } | null)?.previewUrl
  const { getRecord } = useAnalysisHistory()
  const localRecord = getRecord(id)
  const [record, setRecord] = useState<AnalysisRecord | null>(localRecord)
  const [isLoading, setIsLoading] = useState(!localRecord)

  useEffect(() => {
    if (localRecord) {
      return
    }

    let active = true
    setIsLoading(true)

    void getDrawingResultById(id).then((payload) => {
      if (!active) {
        return
      }

      if (!payload) {
        setRecord(null)
        setIsLoading(false)
        return
      }

      const nextRecord = buildAnalysisRecord(payload, id, 'backend')
      saveAnalysisRecord(nextRecord)
      setRecord(nextRecord)
      setIsLoading(false)
    })

    return () => {
      active = false
    }
  }, [id, localRecord])

  if (isLoading) {
    return (
      <PageShell
        eyebrow="Result Workspace"
        title="Loading drawing result"
        description="Fetching the saved analysis package from local history or the backend result endpoint."
      >
        <Card>
          <CardContent className="p-6 text-sm text-slate-400">Loading result data...</CardContent>
        </Card>
      </PageShell>
    )
  }

  if (!record) {
    return (
      <PageShell
        eyebrow="Result Workspace"
        title="No result data was found for this analysis"
        description="The selected result id is not present in local history, and the current backend did not return a matching saved result."
        actions={
          <Button asChild>
            <Link to="/upload">Start new analysis</Link>
          </Button>
        }
      >
        <Card>
          <CardContent className="p-6 text-sm text-slate-400">
            Try launching a new analysis from the upload page or opening a previous run from History.
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  const activeRecord = record

  async function handleExcelExport() {
    const source = await downloadOrGenerateExcel(activeRecord)
    toast.success(source === 'backend' ? 'Excel downloaded from backend.' : 'Excel generated locally.')
  }

  function handleJsonExport() {
    exportResultAsJson(activeRecord)
    toast.success('JSON export downloaded.')
  }

  return (
    <PageShell
      eyebrow="Result Workspace"
      title={activeRecord.drawingName}
      description={activeRecord.summary.humanReadable}
      actions={
        <>
          <Button variant="secondary" onClick={handleJsonExport}>
            <FileJson className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          <Button onClick={handleExcelExport}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-3 mb-5">
        <StatCard 
          icon={Layers3}
          label="Total components"
          value={formatNumber(activeRecord.summary.totalComponents)}
          hint={`Saved ${formatDate(activeRecord.createdAt)}.`}
        />
        <StatCard
          icon={Sparkles}
          label="Detected types"
          value={formatNumber(activeRecord.summary.detectedTypes)}
          hint="Distinct component categories extracted from the drawing."
        />
        <StatCard
          icon={ScanLine}
          label="Pages processed"
          value={formatNumber(activeRecord.summary.pageCount)}
          hint="Total sheets analyzed in the OCR and detection pipeline."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr] mb-5">
        <DrawingPreview drawingName={activeRecord.drawingName} previewUrl={previewUrl} pages={activeRecord.pages} />
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
  <CardContent className="p-8">
    <SectionTitle
      eyebrow="Session Metadata"
      title="Analysis Summary"
      description="Use the exports for downstream estimation workflows, audit the detected components, or revisit page-level AI signals."
    />

    <div className="mt-6 grid gap-4 sm:grid-cols-2">

      <div
        className="
          rounded-[24px]
          border
          border-white/10
          bg-[#7394cf]/18
          p-5
        "
      >
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">
          Source Mode
        </p>

        <p className="mt-2 font-medium text-white">
          {activeRecord.source === 'backend'
            ? 'Backend-synced result'
            : 'Local upload result'}
        </p>
      </div>

      <div
        className="
          rounded-[24px]
          border
          border-white/10
          bg-[#7394cf]/18
          p-5
        "
      >
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">
          Backend Drawing ID
        </p>

        <p className="mt-2 font-medium text-white">
          {activeRecord.backendDrawingId ??
            'Legacy upload flow'}
        </p>
      </div>

      <div
        className="
          rounded-[24px]
          border
          border-white/10
          bg-[#7394cf]/18
          p-5
          sm:col-span-2
        "
      >
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">
          Generated Summary
        </p>

        <p className="mt-2 text-sm leading-7 text-white/75">
          {activeRecord.summary.humanReadable}
        </p>
      </div>

    </div>
  </CardContent>
</Card>
      </div>

      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="boq">BOQ</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-6">
          <ComponentList items={activeRecord.items} />
          <QuantityTable items={activeRecord.items} />
        </TabsContent>

        <TabsContent value="boq">
          <BoqTable items={activeRecord.boqItems} />
        </TabsContent>

        <TabsContent value="pages">
          <Card className="
              rounded-[32px]
              border
              border-white/10
              bg-[#6d8fd0]/20
              shadow-[0_8px_40px_rgba(0,0,0,0.12)]
              backdrop-blur-md
            ">
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              {activeRecord.pages.map((page) => (
                <div key={page.pageNumber} className="rounded-[24px] border border-white/10 bg-white/4 p-5">
                  <p className="font-display text-xl font-semibold text-white">Page {page.pageNumber}</p>
                  <p className="mt-3 text-sm text-slate-300">{page.ocrCount} OCR tokens extracted</p>
                  <p className="text-sm text-slate-400">{page.detectionCount} detections registered</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-sky-200/70">
                    {page.dominantComponents.join(' • ') || 'No dominant detections'}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json">
          <Card
          className="
            rounded-[32px]
            border
            border-white/10
            bg-[#6d8fd0]/20
            shadow-[0_8px_40px_rgba(0,0,0,0.12)]
            backdrop-blur-md
          ">
            <CardContent className="p-0">
              <ScrollArea className="h-[520px]">
                <pre className="p-6 text-sm leading-7 text-slate-300">{JSON.stringify(activeRecord.raw, null, 2)}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-3 mt-5 mb-5">
        <Button asChild variant="secondary">
          <Link to="/history">
            <Download className="mr-2 h-4 w-4" />
            Open analysis history
          </Link>
        </Button>
        <Button asChild>
          <Link to="/upload">Analyze another drawing</Link>
        </Button>
      </div>
    </PageShell>
  )
}
