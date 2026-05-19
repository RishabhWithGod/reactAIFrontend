import { createContext } from 'react'

import type { AuthUser, LoginPayload } from '@/api/auth-api'

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isOtpPending: boolean
  login: (payload: LoginPayload) => Promise<void>
  verifyOtp: (code: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
