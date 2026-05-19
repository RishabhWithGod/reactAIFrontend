import { LoaderCircle, LogIn } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '@/auth/use-auth'
import { Field, TextInput } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'

interface LoginErrors {
  email?: string
  password?: string
}

function validate(email: string, password: string) {
  const errors: LoginErrors = {}

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return errors
}

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@demo.com')
  const [password, setPassword] = useState('admin123')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(email, password)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      return
    }

    setIsLoading(true)

    try {
      await auth.login({ email, password, remember })
      toast.success('Credentials accepted. Complete OTP verification.')
      navigate('/otp')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-7 font-[Roboto]">
     <div className="text-center">
  <h1 className="font-display text-5xl font-bold text-white">
    Sign In
  </h1>

  <p className="mt-4 text-[26px] font-semibold text-white">
    Enter your credentials to access your account
  </p>
</div>
  <form
  onSubmit={handleSubmit}
  className="
    rounded-2xl
    border
    border-white/10
    bg-[#6d8fd0]/20
    px-8
    py-7
    shadow-[0_8px_40px_rgba(0,0,0,0.12)]
    backdrop-blur-md
    space-y-7">
        <Field label="Email" error={errors.email}>
          <TextInput
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <TextInput
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="*****************"
            autoComplete="current-password"
          />
        </Field>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="inline-flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/10 accent-sky-300"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-sky-200 hover:text-white">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm font-medium text-white/85">
        Demo access: <span className="text-sky-200">admin@demo.com</span> / <span className="text-sky-200">admin123</span>
      </p>
    </section>
  )
}
