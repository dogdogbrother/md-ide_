import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { prismjsPlugin } from 'vite-plugin-prismjs'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    react(),
    prismjsPlugin({
      theme: "dark", //主题名称
      languages: 'all',
      css: true,
      // plugins: ["line-numbers", "show-language"]
      plugins: ["show-language"]
    }),
  ],
  build: {
    outDir: '_dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        edit: path.resolve(__dirname, 'pages/edit/index.html'),
        catalog: path.resolve(__dirname, 'pages/catalog/index.html'),
        preview: path.resolve(__dirname, 'pages/preview/index.html'),
      }
    }
  }
})
