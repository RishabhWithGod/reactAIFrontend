import { LoaderCircle, MailCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { forgotPasswordRequest } from '@/api/auth-api'
import { Field, TextInput } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await forgotPasswordRequest(email)
      toast.success('Reset instructions sent if the account exists.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-7 font-[Roboto]">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-white">Forgot Password</h1>
        <p className="mt-3 text-base font-medium leading-7 text-white/80">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-card space-y-5 border-white/10 bg-[#6d8fd0]/20">
        <Field label="Email Address" error={error}>
          <TextInput
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
          />
        </Field>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <MailCheck className="mr-2 h-4 w-4" />}
          Send Reset Link
        </Button>

        <p className="text-center text-sm font-medium text-white/85">
          Need help? Contact <a href="mailto:support@breezeelectric.com" className="text-sky-200 hover:text-white">support@breezeelectric.com</a>
        </p>
      </form>

      <div className="grid grid-cols-3 gap-3 text-center text-xs font-medium text-white/80">
        <Link to="/login" className="hover:text-sky-200">Login</Link>
        <Link to="/otp" className="hover:text-sky-200">Two-Factor</Link>
        <span>Reset Password</span>
      </div>
    </section>
  )
}
