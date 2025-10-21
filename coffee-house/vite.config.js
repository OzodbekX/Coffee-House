import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.', // your project root
  base: './', // relative paths for deployment (e.g., GitHub Pages)
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        // add other html pages here if needed
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./scss/_variables.scss";`, // optional
      },
    },
  },
  resolve: {
    alias: {
      '@scss': '/scss',
      '@ts': '/ts',
      '@assets': '/assets',
    },
  },
})
