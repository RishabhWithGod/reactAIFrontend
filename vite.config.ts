import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],

  // IMPORTANT
  // keep root routing stable
  // base: '/',
    base: '/client/design/breeze/ai-frontend/',

  resolve: {
    alias: {
      '@': path.resolve(
        __dirname,
        './src',
      ),
    },
  },

  server: {
    proxy: {
      '/api': {
        target:
          'https://electricai-production-5b6a.up.railway.app',

        changeOrigin: true,
        secure: true,
      },
    },
  },
})