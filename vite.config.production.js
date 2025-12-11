/**
 * Production Configuration for GitHub Pages
 * 
 * This file serves as a reference for production build settings.
 * The main vite.config.js automatically uses these settings when running `npm run build`
 * 
 * Key differences from local:
 * - base: '/CursorTest/' (GitHub Pages repository path)
 * - build: optimized production build settings
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/CursorTest/', // GitHub Pages base path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})

