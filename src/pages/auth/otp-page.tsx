import { LoaderCircle, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '@/auth/use-auth'
import { Field, TextInput } from '@/components/forms/form-field'
import { Button } from '@/components/ui/button'

export function OtpPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('123456')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await auth.verifyOtp(code)
      toast.success('Verification complete.')
      navigate('/')
    } catch (otpError) {
      toast.error(otpError instanceof Error ? otpError.message : 'Verification failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-7 font-[Roboto]">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-white">Verification Required</h1>
        <p className="mt-3 text-base font-medium leading-7 text-white/80">
          We sent a verification code to your registered email address. Enter it below to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-card space-y-5  border-white/10 bg-[#6d8fd0]/20">
        <Field label="Verification Code" error={error}>
          <TextInput
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            className="text-center text-xl tracking-[0.55em]"
            placeholder="******"
          />
        </Field>

        <p className="text-sm text-white/80">Enter the 6-digit code sent to j***@breeze-electric.com</p>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
          Verify Code
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full bg-white text-slate-950 hover:bg-sky-100"
          onClick={() => toast.message('A demo code was resent. Use 123456.')}
        >
          Resend Code
        </Button>
      </form>

      <div className="space-y-4 text-center text-sm font-medium text-white/85">
        <Link to="/forgot-password" className="text-sky-200 hover:text-white">Having trouble? Get help</Link>
        <p>Secure authentication powered by Breeze Electric</p>
      </div>
    </section>
  )
}
