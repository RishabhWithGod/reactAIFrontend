import { isMockApiMode } from '@/api/config'
import { http } from '@/api/http'

export interface AuthUser {
  email: string
  name: string
  role: string
}

export interface LoginPayload {
  email: string
  password: string
  remember: boolean
}

const demoUser: AuthUser = {
  email: 'admin@demo.com',
  name: 'Breeze Admin',
  role: 'Estimator',
}

function wait(durationMs = 450) {
  return new Promise((resolve) => window.setTimeout(resolve, durationMs))
}

export async function loginRequest({ email, password }: LoginPayload) {
  if (isMockApiMode()) {
    await wait()
  }

  if (email.toLowerCase() === 'admin@demo.com' && password === 'admin123') {
    return {
      user: demoUser,
      token: `demo-token-${Date.now()}`,
      requiresOtp: true,
    }
  }

  throw new Error('Use admin@demo.com and admin123 for demo access.')
}

export async function verifyOtpRequest(code: string) {
  if (isMockApiMode()) {
    await wait(350)
  }

  if (/^\d{6}$/.test(code)) {
    return true
  }

  throw new Error('Enter the 6-digit verification code.')
}

export async function forgotPasswordRequest(email: string) {
  if (!isMockApiMode()) {
    try {
      await http.post('/auth/forgot-password', { email })
      return
    } catch {
      // Backend auth is not ready yet; fall back to the demo flow.
    }
  }

  await wait(350)
}
