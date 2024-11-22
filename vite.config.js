import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permet l'accès depuis d'autres appareils
    port: 5173, // Port par défaut de Vite
  },
})