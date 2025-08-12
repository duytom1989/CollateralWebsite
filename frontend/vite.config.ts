import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@shared': path.resolve('./src/shared'),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
})
