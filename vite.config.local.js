/**
 * Local Development Configuration
 * 
 * This file serves as a reference for local development settings.
 * The main vite.config.js automatically uses these settings when running `npm run dev`
 * 
 * Key differences from production:
 * - base: '/' (root path for localhost)
 * - server: configured for local development
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Root path for localhost
  server: {
    port: 5173,
    open: true,
  },
})

