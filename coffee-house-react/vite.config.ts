import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,       // 👈 your custom port
        open: true,       // optional: auto open browser
        host: true        // optional: allows LAN access
    },
})
