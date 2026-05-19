import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  hint: string
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: StatCardProps) {
  return (
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
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">

          <div className="flex-1">

            <Badge
              className="
                border
                border-white/10
                bg-white/10
                text-white
                font-medium
              "
            >
              {label}
            </Badge>

            <p className="mt-5 font-display text-5xl font-bold text-white">
              {value}
            </p>

            <p className="mt-4 text-sm leading-7 text-white/75">
              {hint}
            </p>

          </div>

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-300/20
              bg-[#7fb4dc]/25
              text-cyan-100
            "
          >
            <Icon className="h-6 w-6" />
          </div>

        </div>
      </CardContent>
    </Card>
  )
}