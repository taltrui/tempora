import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      include: ['src'],
      exclude: ['playground', 'src/**/*.test.{ts,tsx}', 'src/test/**'],
    }),
  ],
  server: { host: '0.0.0.0' },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^date-fns/,
        /^@dnd-kit/,
      ],
    },
  },
})
