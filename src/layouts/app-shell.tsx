import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'

import { AppHeader } from '@/components/dashboard/app-header'
import { AppSidebar } from '@/components/dashboard/app-sidebar'

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 bg-spotlight opacity-90" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:64px_64px] mask-fade" />

      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 sm:px-6 xl:px-8">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <AppHeader />
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-1"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  )
}
