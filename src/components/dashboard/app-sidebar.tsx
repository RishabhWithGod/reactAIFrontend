import { BarChart3, FileClock, FileScan, Home, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'

const navigation = [
  { to: '/', label: 'Overview', icon: Home },
  { to: '/upload', label: 'Upload', icon: FileScan },
  { to: '/history', label: 'History', icon: FileClock },
]

export function AppSidebar() {
  return (
    <aside className="hidden w-[300px] shrink-0 xl:block">
      <div className="sticky top-4 flex flex-col gap-5">
        <Card className="overflow-hidden">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-400/15 text-sky-200 shadow-glow">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-white">ElectricAI</p>
                <p className="text-sm text-slate-400">Drawing Analyzer</p>
              </div>
            </div>

            <div className="rounded-[24px] border border-sky-300/15 bg-sky-400/8 p-4">
              <Badge>AI Pipeline</Badge>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                Upload electrical PDFs, trigger OCR + AI extraction, inspect component counts, and export BOQ outputs.
              </p>
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                      isActive ? 'bg-sky-300 text-slate-950 shadow-glow' : 'text-slate-300 hover:bg-white/6 hover:text-white',
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/6 p-3 text-sky-200">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">Results workspace</p>
                <p className="text-sm text-slate-400">Open the analyzer and process a new project.</p>
              </div>
            </div>
            <Button asChild className="w-full">
              <NavLink to="/upload">Start new analysis</NavLink>
            </Button>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
