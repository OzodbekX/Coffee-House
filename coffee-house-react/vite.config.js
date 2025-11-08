import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic", // enables the new React JSX transform
    }),
  ],

  server: {
    port: 3000, // dev server port
    open: true, // auto-open browser
    host: true, // allow LAN access
    cors: true, // enable CORS during dev
    strictPort: true, // fail if port is already used
  },

  preview: {
    port: 8080,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@context": path.resolve(__dirname, "./src/context"),
    },
  },

  build: {
    target: "esnext", // modern output
    outDir: "dist", // build output folder
    sourcemap: false, // disable source maps (set to true if debugging)
    chunkSizeWarningLimit: 1000, // prevent excessive warnings
  },
});
