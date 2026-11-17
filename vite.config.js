import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Mermaid/KaTeX are big; that's fine for a local study site.
  build: { chunkSizeWarningLimit: 4000 },
})
