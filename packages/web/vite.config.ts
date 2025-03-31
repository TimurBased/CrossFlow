import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import netlifyPlugin from '@netlify/vite-plugin-react-router'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), netlifyPlugin()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 3000,
  },
})
