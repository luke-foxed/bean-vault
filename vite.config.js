import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/scrape': {
        target: 'http://localhost:11235',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/scrape/, '/llm'),
      },
    },
  },
})
