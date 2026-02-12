import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'playground'),
    },
  },
  server: { host: '0.0.0.0' },
  build: {
    outDir: 'dist-playground',
    emptyOutDir: true,
  },
})
