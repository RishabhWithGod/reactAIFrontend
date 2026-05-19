import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

interface FieldProps {
  label: string
  error?: string
  children: ReactNode
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      {children}
      {error ? <span className="block text-sm text-red-200">{error}</span> : null}
    </label>
  )
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-2xl border border-white/10 bg-white/15 px-4 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-sky-300/50 focus:bg-white/20',
        className,
      )}
      {...props}
    />
  )
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/15 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/45 focus:border-sky-300/50 focus:bg-white/20',
        className,
      )}
      {...props}
    />
  )
}
