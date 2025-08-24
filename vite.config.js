import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',            // biar bisa diakses dari network luar
    allowedHosts: ['.ngrok-free.app'], // izinkan semua domain ngrok
    port: 5173,                 // sesuaikan port kalau perlu
  },
})
