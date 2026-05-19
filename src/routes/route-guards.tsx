import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/auth/use-auth'

export function ProtectedRoute() {
  const auth = useAuth()
  const location = useLocation()

  if (auth.isAuthenticated) {
    return <Outlet />
  }

  if (auth.isOtpPending) {
    return <Navigate to="/otp" replace state={{ from: location }} />
  }

  return <Navigate to="/login" replace state={{ from: location }} />
}

export function PublicRoute() {
  const auth = useAuth()

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
