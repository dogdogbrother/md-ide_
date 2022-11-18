import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [preact()],
  build: {
    outDir: '_dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        nested: path.resolve(__dirname, 'pages/edit/index.html')
      }
    }
  }
})
