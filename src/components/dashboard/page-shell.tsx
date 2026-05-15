import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageShellProps {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
}

export function PageShell({ eyebrow, title, description, actions, children }: PageShellProps) {
  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-sky-200/70">{eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
      </motion.section>
      {children}
    </div>
  )
}
