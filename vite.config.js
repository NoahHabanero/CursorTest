import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Automatically use the correct config based on environment
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    base: isProduction ? '/CursorTest/' : '/', // Production uses GitHub Pages path, local uses root
    server: isProduction ? undefined : {
      port: 5173,
      open: true,
    },
    build: isProduction ? {
      outDir: 'dist',
      assetsDir: 'assets',
    } : undefined,
  }
})

