import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      '@/': resolve(__dirname, 'src') + '/'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        ws: true
      },
    }
  },
  build: {
    chunkSizeWarningLimit: 1500
  }
})
