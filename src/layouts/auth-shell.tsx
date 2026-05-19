import { CircuitBoard } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

export function AuthShell() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* dark overlay */}
      <div className="fixed inset-0 -z-10 bg-slate-950/20" />

      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10">
        
        <div className="w-full max-w-xl">
          
          <Link
            to="/login"
            className="mx-auto mb-8 flex w-fit items-center gap-3 text-white"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/30 bg-white/10 shadow-2xl backdrop-blur-xl">
              <CircuitBoard className="h-7 w-7 text-sky-200" />
            </span>

            <span>
              <span className="block font-display text-2xl font-bold">
                Breeze
              </span>

              <span className="block text-sm text-sky-100/80">
                Electric AI Takeoff
              </span>
            </span>
          </Link>

          <Outlet />
        </div>
      </main>
    </div>
  )
}