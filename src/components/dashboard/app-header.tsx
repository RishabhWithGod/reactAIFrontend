import { Activity, Server, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { pingBackend } from '@/api/analysis-api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getApiBaseUrl } from '@/api/http'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/upload', label: 'Upload' },
  { to: '/history', label: 'History' },
]

export function AppHeader() {
  const location = useLocation()
  const [isOnline, setIsOnline] = useState<boolean | null>(null)

  useEffect(() => {
    void pingBackend().then(setIsOnline)
  }, [location.pathname])

  return (
    <Card className="sticky top-4 z-30">
      <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sky-200/70">AI Electrical Drawing Analyzer</p>
            <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Premium OCR, symbol detection, and BOQ generation workspace
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isOnline ? 'success' : isOnline === false ? 'warning' : 'muted'}>
              <Server className="mr-1.5 h-3.5 w-3.5" />
              {isOnline ? 'Backend connected' : isOnline === false ? 'Backend unavailable' : 'Checking backend'}
            </Badge>
            <Badge variant="muted">
              <Activity className="mr-1.5 h-3.5 w-3.5" />
              {getApiBaseUrl()}
            </Badge>
            <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
              <NavLink to="/upload">
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze drawing
              </NavLink>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full border px-3.5 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'border-sky-300/40 bg-sky-300/15 text-sky-100'
                    : 'border-white/10 bg-white/4 text-slate-300 hover:bg-white/8 hover:text-white',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
