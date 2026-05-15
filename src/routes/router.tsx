import { createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/layouts/app-shell'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('@/pages/home-page')).HomePage }),
      },
      {
        path: 'upload',
        lazy: async () => ({ Component: (await import('@/pages/upload-page')).UploadPage }),
      },
      {
        path: 'analysis/:id',
        lazy: async () => ({ Component: (await import('@/pages/analysis-page')).AnalysisPage }),
      },
      {
        path: 'results/:id',
        lazy: async () => ({ Component: (await import('@/pages/results-page')).ResultsPage }),
      },
      {
        path: 'history',
        lazy: async () => ({ Component: (await import('@/pages/history-page')).HistoryPage }),
      },
      {
        path: '*',
        lazy: async () => ({ Component: (await import('@/pages/not-found-page')).NotFoundPage }),
      },
    ],
  },
])
