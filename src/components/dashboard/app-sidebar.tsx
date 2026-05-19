import {
  BarChart3,
  FileClock,
  FileScan,
  Home,
  Sparkles,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '@/auth/use-auth'
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
  const auth = useAuth()

  return (
    <aside className="hidden w-[300px] shrink-0 xl:block">
      <div className="sticky top-4 flex flex-col gap-5">

        {/* Main Sidebar Card */}
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
          <CardContent className="space-y-6 p-6">

            {/* Logo */}
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-3xl
                  bg-[#7fb4dc]/25
                  text-cyan-100
                "
              >
                <Sparkles className="h-7 w-7" />
              </div>

              <div>
                <p className="font-display text-xl font-semibold text-white">
                  ElectricAI
                </p>

                <p className="text-sm text-white/70">
                  {auth.user?.name ?? 'Drawing Analyzer'}
                </p>
              </div>
            </div>

            {/* Pipeline Box */}
            <div
              className="
                rounded-[24px]
                border
                border-white/10
                bg-[#7394cf]/18
                p-4
              "
            >
              <Badge
                className="
                  border
                  border-white/10
                  bg-white/10
                  text-white
                "
              >
                AI Pipeline
              </Badge>

              <p className="mt-3 text-sm leading-7 text-white/85">
                Upload electrical PDFs, trigger OCR + AI extraction,
                inspect component counts, and export BOQ outputs.
              </p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      `
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      transition-all
                      duration-200
                    `,
                      isActive
                        ? `
                          bg-[#78c7f1]
                          text-[#0a1d35]
                          font-semibold
                        `
                        : `
                          text-white/80
                          hover:bg-white/8
                          hover:text-white
                        `,
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

        {/* Bottom Card */}
        <Card
          className="
            rounded-[32px]
            border
            border-white/10
            bg-[#6d8fd0]/20
            backdrop-blur-md
          "
        >
          <CardContent className="space-y-5 p-6">

            <div className="flex items-center gap-3">

              <div
                className="
                  rounded-2xl
                  bg-[#7fb4dc]/25
                  p-3
                  text-cyan-100
                "
              >
                <BarChart3 className="h-5 w-5" />
              </div>

              <div>
                <p className="font-medium text-white">
                  Results workspace
                </p>

                <p className="text-sm text-white/70">
                  Open the analyzer and process a new project.
                </p>
              </div>
            </div>

            <Button
              asChild
              className="
                h-12
                w-full
                bg-[#38d7ff]
                font-semibold
                text-black
                hover:bg-[#58e0ff]
              "
            >
              <NavLink to="/upload">
                Start new analysis
              </NavLink>
            </Button>
          </CardContent>
        </Card>

      </div>
    </aside>
  )
}