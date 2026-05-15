import { ArrowRight, Bot, FileSpreadsheet, Radar, ScanSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageShell } from '@/components/dashboard/page-shell'
import { SectionTitle } from '@/components/dashboard/section-title'
import { StatCard } from '@/components/dashboard/stat-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAnalysisHistory } from '@/hooks/use-analysis-history'

const featureCards = [
  {
    icon: ScanSearch,
    title: 'AI OCR pipeline',
    text: 'Upload drawing PDFs and pass them through OCR, table extraction, AI parsing, and symbol intelligence.',
  },
  {
    icon: Radar,
    title: 'Component counting',
    text: 'Track detected fixtures, devices, and symbols with structured quantity tables ready for review.',
  },
  {
    icon: FileSpreadsheet,
    title: 'BOQ export flow',
    text: 'Generate JSON and Excel-ready BOQ packages with export actions directly from the results workspace.',
  },
]

export function HomePage() {
  const { records } = useAnalysisHistory()
  const totalComponents = records.reduce((sum, record) => sum + record.summary.totalComponents, 0)

  return (
    <PageShell
      eyebrow="AI SaaS Dashboard"
      title="Turn electrical drawings into structured BOQ intelligence"
      description="A premium React frontend for AI-powered electrical drawing analysis. Upload PDFs, monitor OCR processing, inspect detected components, and export deliverables from a responsive dark SaaS workspace."
      actions={
        <>
          <Button asChild>
            <Link to="/upload">
              Start analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/history">View history</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <CardContent className="grid gap-8 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Dark glass UI</Badge>
              <Badge variant="muted">React + Vite + Tailwind</Badge>
              <Badge variant="muted">FastAPI connected</Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {featureCards.map((feature) => (
                <div key={feature.title} className="rounded-[26px] border border-white/10 bg-white/4 p-5">
                  <div className="inline-flex rounded-2xl bg-sky-400/12 p-3 text-sky-100">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{feature.text}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-sky-300/15 bg-sky-400/8 p-6">
              <SectionTitle
                eyebrow="Pipeline"
                title="Upload PDF → OCR → AI parsing → Symbol detection → BOQ generation"
                description="The service layer is wired to your current FastAPI backend today and is ready for the richer async endpoints you specified later."
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <StatCard
            icon={Bot}
            label="Analyses"
            value={String(records.length)}
            hint="Completed drawing analyses stored in the dashboard history."
          />
          <StatCard
            icon={Radar}
            label="Detected components"
            value={String(totalComponents)}
            hint="Sum of AI-counted components across saved analyses."
          />
          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-200/70">What this app includes</p>
              <p className="font-display text-2xl font-semibold text-white">Professional dashboard foundation</p>
              <p className="text-sm leading-6 text-slate-400">
                Upload staging, analysis progress, responsive result tabs, history tracking, toast feedback, and client
                export fallbacks are all built in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
