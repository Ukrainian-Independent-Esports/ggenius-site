import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],
  server: {
    allowedHosts: [
      '2c1baceb6325.ngrok-free.app'
    ],
    proxy: {
      '/api': {
        target: 'https://ggenius-api.onrender.com/bots/auth.php',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist'
  },
  base: '/',

})
