import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/hotels': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/rooms': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/reservations': {
        target: 'http://localhost:8082/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/reservations/, '')
      }
    }
  }
})