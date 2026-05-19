import { Activity, LogOut, Server, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { pingBackend } from '@/api/analysis-api'
import { getApiBaseUrl } from '@/api/http'
import { useAuth } from '@/auth/use-auth'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/upload', label: 'Upload' },
  { to: '/history', label: 'History' },
]

export function AppHeader() {
  const location = useLocation()
  const auth = useAuth()

  const [isOnline, setIsOnline] = useState<boolean | null>(null)

  useEffect(() => {
    void pingBackend().then(setIsOnline)
  }, [location.pathname])

  return (
    <Card
      className="
        relative
        top-4
        z-30
        rounded-[32px]
        border
        border-white/10
        bg-[#6d8fd0]/20
        shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        backdrop-blur-md
      "
    >
      <CardContent className="flex flex-col gap-5 p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div>
            <p className="text-xs uppercase tracking-[0.30em] text-cyan-200/70">
              AI ELECTRICAL DRAWING ANALYZER
            </p>

            <h1 className="mt-2 font-display text-3xl font-bold text-white">
              Premium OCR, symbol detection, and BOQ generation workspace
            </h1>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-2">

            <Badge
              className="
                border
                border-white/10
                bg-white/10
                text-white
              "
            >
              <Server className="mr-1.5 h-3.5 w-3.5" />

              {isOnline
                ? 'Backend connected'
                : isOnline === false
                ? 'Backend unavailable'
                : 'Checking backend'}
            </Badge>

            <Badge
              className="
                border
                border-white/10
                bg-white/10
                text-white
              "
            >
              <Activity className="mr-1.5 h-3.5 w-3.5" />
              {getApiBaseUrl()}
            </Badge>

            <Button
              asChild
              className="
                bg-[#38d7ff]
                text-black
                hover:bg-[#58e0ff]
              "
            >
              <NavLink to="/upload">
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze drawing
              </NavLink>
            </Button>

            <Button
              variant="ghost"
              onClick={auth.logout}
              className="
                text-white
                hover:bg-white/10
              "
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3">

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  `
                  rounded-full
                  border
                  px-5
                  py-2
                  text-sm
                  transition-all
                `,
                  isActive
                    ? `
                      border-transparent
                      bg-[#78c7f1]
                      text-[#0a1d35]
                      font-semibold
                    `
                    : `
                      border-white/10
                      bg-white/5
                      text-white/80
                      hover:bg-white/10
                    `,
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