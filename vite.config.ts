import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],

  base: '/client/design/breeze/ai-frontend/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})