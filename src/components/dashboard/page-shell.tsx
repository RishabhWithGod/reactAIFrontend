import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageShellProps {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
  children: ReactNode
}

export function PageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: PageShellProps) {
  return (
    <div className="space-y-6">

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="
          rounded-[32px]
          border
          border-white/10
          bg-[#6d8fd0]/20
          shadow-[0_8px_40px_rgba(0,0,0,0.12)]
          backdrop-blur-md
          p-6
          sm:p-8
        "
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div className="max-w-3xl">

            <p className="text-xs uppercase tracking-[0.30em] text-cyan-200/70">
              {eyebrow}
            </p>

            <h2 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
              {title}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/85">
              {description}
            </p>
          </div>

          {actions ? (
            <div className="flex flex-wrap items-center gap-3">
              {actions}
            </div>
          ) : null}
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {children}
      </motion.div>

    </div>
  )
}