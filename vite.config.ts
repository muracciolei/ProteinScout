import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Protein Scout',
        short_name: 'ProteinScout',
        description:
          'Search the Protein Data Bank and explore 3D molecular structures in your browser.',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#0a0a0b',
        theme_color: '#0a0a0b',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        // Mol*'s viewer chunk is ~5 MB; raise the limit so the PWA can serve it offline.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,svg,woff2,jpg,png,ico}'],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 6000,
  },
})
