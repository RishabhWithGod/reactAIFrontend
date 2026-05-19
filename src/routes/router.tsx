import { createHashRouter } from 'react-router-dom'

import { AuthShell } from '@/layouts/auth-shell'
import { AppShell } from '@/layouts/app-shell'
import { ProtectedRoute, PublicRoute } from '@/routes/route-guards'

export const router = createHashRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthShell />,
        children: [
          {
            path: 'login',
            lazy: async () => ({
              Component: (await import('@/pages/auth/login-page')).LoginPage,
            }),
          },
          {
            path: 'otp',
            lazy: async () => ({
              Component: (await import('@/pages/auth/otp-page')).OtpPage,
            }),
          },
          {
            path: 'forgot-password',
            lazy: async () => ({
              Component: (await import('@/pages/auth/forgot-password-page')).ForgotPasswordPage,
            }),
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,

    children: [
      {
        element: <AppShell />,

        children: [
          {
            index: true,

            lazy: async () => ({
              Component: (await import('@/pages/home-page')).HomePage,
            }),
          },

          {
            path: 'upload',

            lazy: async () => ({
              Component: (await import('@/pages/upload-page')).UploadPage,
            }),
          },

          {
            path: 'analysis/:id',

            lazy: async () => ({
              Component: (await import('@/pages/analysis-page')).AnalysisPage,
            }),
          },

          {
            path: 'results/:id',

            lazy: async () => ({
              Component: (await import('@/pages/results-page')).ResultsPage,
            }),
          },

          {
            path: 'history',

            lazy: async () => ({
              Component: (await import('@/pages/history-page')).HistoryPage,
            }),
          },

          {
            path: '*',

            lazy: async () => ({
              Component: (await import('@/pages/not-found-page')).NotFoundPage,
            }),
          },
        ],
      },
    ],
  },
])
