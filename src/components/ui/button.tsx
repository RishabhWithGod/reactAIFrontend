import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60',
  {
    variants: {
      variant: {
        default: 'bg-sky-400 text-slate-950 shadow-glow hover:bg-sky-300',
        secondary: 'border border-white/12 bg-white/6 text-slate-100 hover:bg-white/10',
        ghost: 'text-slate-300 hover:bg-white/6 hover:text-white',
        outline: 'border border-sky-300/25 bg-sky-400/6 text-sky-100 hover:bg-sky-400/10',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-xl px-3.5',
        lg: 'h-12 rounded-2xl px-6',
        icon: 'h-10 w-10 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
