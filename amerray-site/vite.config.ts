import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173, allowedHosts: ['.trycloudflare.com'] },
  preview: { host: true, port: 4173, allowedHosts: ['.trycloudflare.com'] },
  build: { chunkSizeWarningLimit: 1500 },
})
