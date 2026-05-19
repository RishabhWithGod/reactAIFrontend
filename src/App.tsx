import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AuthProvider } from '@/auth/auth-context'
import { ErrorBoundary } from '@/components/error-boundary'
import AppBackground from '@/layouts/AppBackground'
import { router } from '@/routes/router'

export default function App() {
  return (
    <AppBackground>
      <ErrorBoundary>
        <AuthProvider>
          <RouterProvider router={router} />

          <Toaster
            richColors
            closeButton
            expand
            toastOptions={{
              classNames: {
                toast:
                  'glass-panel border border-white/10 bg-slate-950/90 text-slate-50 backdrop-blur-xl',
                title: 'text-sm font-semibold',
                description: 'text-slate-300',
              },
            }}
          />
        </AuthProvider>
      </ErrorBoundary>
    </AppBackground>
  )
}