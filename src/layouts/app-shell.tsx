import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'

import { AppHeader } from '@/components/dashboard/app-header'
import { AppSidebar } from '@/components/dashboard/app-sidebar'

export function AppShell() {
  return (
    <div className="min-h-screen text-foreground">

      {/* light transparent overlay */}
      {/* <div className="fixed inset-0 -z-10 bg-slate-950/10" /> */}

      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 sm:px-6 xl:px-8">

        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">

          {/* Header */}
          <AppHeader />

          {/* Page Content */}
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: 'easeOut',
            }}
            className="flex-1"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  )
}