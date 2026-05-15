import type { ReactNode } from 'react'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export function SectionTitle({ eyebrow, title, description, action }: SectionTitleProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-xs uppercase tracking-[0.24em] text-sky-200/70">{eyebrow}</p> : null}
        <h3 className="mt-1 font-display text-xl font-semibold text-white">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
