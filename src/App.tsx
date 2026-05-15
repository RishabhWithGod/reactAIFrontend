import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ErrorBoundary } from '@/components/error-boundary'
import { router } from '@/routes/router'

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster
        richColors
        closeButton
        expand
        toastOptions={{
          classNames: {
            toast: 'glass-panel border-white/10 bg-slate-950/90 text-slate-50',
            title: 'text-sm font-semibold',
            description: 'text-slate-300',
          },
        }}
      />
    </ErrorBoundary>
  )
}
