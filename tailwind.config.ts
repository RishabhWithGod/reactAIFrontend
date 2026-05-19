import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      borderRadius: {
        xl: '1rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56, 189, 248, 0.18), 0 18px 80px rgba(2, 132, 199, 0.18)',
        glass: '0 20px 60px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        spotlight:
          'radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 36%), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.16), transparent 26%)',
        'auth-radial':
          'radial-gradient(circle at 70% 10%, rgba(51, 227, 255, 0.22), transparent 28%), radial-gradient(circle at 22% 88%, rgba(13, 87, 161, 0.38), transparent 32%), linear-gradient(135deg, #06070f 0%, #0d57a1 54%, #070f51 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseLine: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseLine: 'pulseLine 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
} satisfies Config
