import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  hint: string
}

export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="muted">{label}</Badge>
            <p className="mt-4 font-display text-3xl font-semibold text-white">{value}</p>
            <p className="mt-2 text-sm text-slate-400">{hint}</p>
          </div>
          <div className="rounded-[20px] bg-sky-400/12 p-3 text-sky-100">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
