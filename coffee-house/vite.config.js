import { defineConfig } from 'vite'
import { resolve } from 'path'
import includeHtml from "vite-plugin-include-html";

export default defineConfig({
  root: '.', // your project root
  base: './', // relative paths for deployment (e.g., GitHub Pages)
  plugins: [includeHtml()], // ✅ correct plugin here
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
        additionalData: `@use "@scss/_variables.scss";`, // optional
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
