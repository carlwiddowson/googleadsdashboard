import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  define: {
    // Make environment variables available at build time
    'process.env': {}
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor'
            }
            // Chart library (large)
            if (id.includes('recharts')) {
              return 'charts'
            }
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons'
            }
            // HTTP client
            if (id.includes('axios')) {
              return 'http'
            }
            // Google APIs (browser compatibility issues)
            if (id.includes('googleapis') || id.includes('google-auth-library')) {
              return 'google-apis'
            }
            // Other vendor libraries
            return 'vendor-misc'
          }
        }
      }
    },
    // Increase chunk size warning limit to reduce noise
    chunkSizeWarningLimit: 500
  }
})
