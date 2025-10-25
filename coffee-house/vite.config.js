import { defineConfig } from 'vite'
import includeHtml from "vite-plugin-include-html";
import eslint from 'vite-plugin-eslint';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  root: '.', // your project root
  base: './', // relative paths for deployment (e.g., GitHub Pages)
  plugins: [includeHtml(), eslint()], // ✅ correct plugin here
  server: {
    port: 3000,
    host: true,
    open: '/index.html'

  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        registration: resolve(__dirname, 'registration.html'),
        login: resolve(__dirname, 'login.html'),
        shoppingCart: resolve(__dirname, 'shoppingCart.html'),
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
