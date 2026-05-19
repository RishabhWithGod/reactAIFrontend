import { useMemo, useState, type ReactNode } from 'react'

import { loginRequest, verifyOtpRequest, type AuthUser } from '@/api/auth-api'
import { AuthContext, type AuthContextValue } from '@/auth/auth-state'

interface StoredAuth {
  token: string
  user: AuthUser
  verified: boolean
}

const storageKey = 'breeze-demo-auth'

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = window.localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as StoredAuth) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => readStoredAuth())

  const value = useMemo<AuthContextValue>(() => ({
    user: auth?.user ?? null,
    isAuthenticated: Boolean(auth?.token && auth.verified),
    isOtpPending: Boolean(auth?.token && !auth.verified),
    login: async (payload) => {
      const response = await loginRequest(payload)
      const nextAuth = {
        token: response.token,
        user: response.user,
        verified: !response.requiresOtp,
      }

      setAuth(nextAuth)
      window.localStorage.setItem(storageKey, JSON.stringify(nextAuth))
    },
    verifyOtp: async (code) => {
      await verifyOtpRequest(code)

      setAuth((current) => {
        if (!current) {
          return current
        }

        const nextAuth = { ...current, verified: true }
        window.localStorage.setItem(storageKey, JSON.stringify(nextAuth))
        return nextAuth
      })
    },
    logout: () => {
      setAuth(null)
      window.localStorage.removeItem(storageKey)
    },
  }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
