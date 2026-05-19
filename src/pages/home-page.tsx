import {
  ArrowRight,
  Bot,
  FileSpreadsheet,
  Radar,
  ScanSearch,
} from 'lucide-react'

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
    title: 'AI OCR Pipeline',
    text: 'Upload drawing PDFs and pass them through OCR, table extraction, AI parsing, and symbol intelligence.',
  },
  {
    icon: Radar,
    title: 'Component Counting',
    text: 'Track detected fixtures, devices, and symbols with structured quantity tables ready for review.',
  },
  {
    icon: FileSpreadsheet,
    title: 'BOQ Export Flow',
    text: 'Generate JSON and Excel-ready BOQ packages with export actions directly from the results workspace.',
  },
]

export function HomePage() {
  const { records } = useAnalysisHistory()

  const totalComponents = records.reduce(
    (sum, record) => sum + record.summary.totalComponents,
    0,
  )

  return (
    <PageShell
      eyebrow="AI SaaS Dashboard"
      title="Turn electrical drawings into structured BOQ intelligence"
      description="A premium React frontend for AI-powered electrical drawing analysis. Upload PDFs, monitor OCR processing, inspect detected components, and export deliverables from a responsive AI workspace."
      actions={
        <>
          <Button
            asChild
            className="
              h-12
              rounded-xl
              bg-[#38d7ff]
              px-6
              font-semibold
              text-black
              hover:bg-[#58e0ff]
            "
          >
            <Link to="/upload">
              Start Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="secondary"
            className="
              h-12
              rounded-xl
              border
              border-white/10
              bg-white/10
              text-white
              backdrop-blur-md
              hover:bg-white/20
            "
          >
            <Link to="/history">
              View History
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

        {/* LEFT SIDE */}
        <Card
          className="
            overflow-hidden
            rounded-[32px]
            border
            border-white/10
            bg-[#6d8fd0]/20
            shadow-[0_8px_40px_rgba(0,0,0,0.12)]
            backdrop-blur-md
          "
        >
          <CardContent className="grid gap-8 p-6 sm:p-8">

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">

              <Badge
                className="
                  border
                  border-cyan-300/20
                  bg-cyan-400/10
                  text-cyan-100
                "
              >
                AI Powered
              </Badge>

              <Badge
                className="
                  border
                  border-white/10
                  bg-white/10
                  text-white
                "
              >
                React + Vite + Tailwind
              </Badge>

              <Badge
                className="
                  border
                  border-white/10
                  bg-white/10
                  text-white
                "
              >
                FastAPI Connected
              </Badge>

            </div>

            {/* Feature Cards */}
            <div className="grid gap-5 lg:grid-cols-3">

              {featureCards.map((feature) => (
                <div
                  key={feature.title}
                  className="
                    rounded-[28px]
                    border
                    border-white/10
                    bg-[#7394cf]/18
                    p-5
                    transition-all
                    duration-300
                    hover:bg-[#7b9fe0]/25
                  "
                >
                  <div
                    className="
                      inline-flex
                      rounded-2xl
                      bg-[#7fb4dc]/25
                      p-3
                      text-cyan-100
                    "
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-display text-xl font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/75">
                    {feature.text}
                  </p>
                </div>
              ))}

            </div>

            {/* Pipeline */}
            <div
              className="
                rounded-[30px]
                border
                border-white/10
                bg-[#7394cf]/18
                p-6
              "
            >
              <SectionTitle
                eyebrow="Pipeline"
                title="Upload PDF → OCR → AI Parsing → Symbol Detection → BOQ Generation"
                description="The service layer is wired to your current FastAPI backend and is ready for async AI workflows and scalable BOQ generation."
              />
            </div>

          </CardContent>
        </Card>

        {/* RIGHT SIDE */}
        <div className="grid gap-6">

          <StatCard
            icon={Bot}
            label="Analyses"
            value={String(records.length)}
            hint="Completed drawing analyses stored in dashboard history."
          />

          <StatCard
            icon={Radar}
            label="Detected Components"
            value={String(totalComponents)}
            hint="AI-detected components counted across all projects."
          />

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
            <CardContent className="space-y-4 p-6">

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.30em]
                  text-cyan-200/70
                "
              >
                What This App Includes
              </p>

              <p
                className="
                  font-display
                  text-2xl
                  font-semibold
                  text-white
                "
              >
                Professional Dashboard Foundation
              </p>

              <p
                className="
                  text-sm
                  leading-7
                  text-white/75
                "
              >
                Upload staging, analysis progress,
                responsive result tabs, history tracking,
                export flows, and AI-ready workflows are
                fully integrated.
              </p>

            </CardContent>
          </Card>

        </div>
      </div>
    </PageShell>
  )
}