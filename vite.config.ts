import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 로컬 개발 서버에서 /api 요청을 백엔드(data-be)로 넘긴다.
// 도커로 띄우면 docker-compose.yml이 VITE_API_PROXY_TARGET을 넣어 준다.
const apiTarget = process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
    },
    // 도커에서 파일 변경이 감지되지 않으면 .env에 VITE_USE_POLLING=true
    watch: { usePolling: process.env.VITE_USE_POLLING === 'true' },
  },
  build: {
    outDir: 'dist',
  },
})
