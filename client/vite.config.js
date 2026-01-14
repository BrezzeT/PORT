import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Используем современные возможности JS (быстрее)
    minify: 'esbuild', // Самый быстрый минификатор
    cssCodeSplit: true, // Разбиваем CSS
    rollupOptions: {
      output: {
        manualChunks: {
          // Разделяем тяжелые библиотеки на отдельные чанки
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-animation': ['framer-motion'],
          'vendor-utils': ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Увеличиваем лимит предупреждения
  },
  server: {
    host: true // Чтобы можно было открывать в локальной сети
  }
})
