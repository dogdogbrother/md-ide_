import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
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
    preact(),
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
        nested: path.resolve(__dirname, 'pages/edit/index.html')
      }
    }
  }
})
