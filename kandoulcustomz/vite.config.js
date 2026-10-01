import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { previewGatePlugin } from './previewGate.mjs'

const base = process.env.NETLIFY
  ? '/'
  : process.env.NODE_ENV === 'production'
    ? '/you/'
    : '/'

export default defineConfig({
  base,
  plugins: [
    previewGatePlugin(),
    tailwindcss(),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
})
