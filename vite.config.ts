import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // TELLS VITE TO IGNORE BACKEND FILES
      ignored: ['**/backend/**', '**/.venv/**', '**/__pycache__/**']
    }
  }
})
