import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Asegurar que las variables de entorno se carguen correctamente
  envDir: '.',
  server: {
    port: 5174,
    host: 'localhost', // Solo exponer en localhost para evitar URL de red
  },
})
