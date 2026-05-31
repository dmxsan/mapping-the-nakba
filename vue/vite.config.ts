import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { watch } from 'fs'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function syncData() {
  const src = join(__dirname, '../data')
  const dest = join(__dirname, 'public/data')
  mkdirSync(dest, { recursive: true })
  mkdirSync(join(dest, 'regions'), { recursive: true })
  readdirSync(src).forEach(f => {
    if (f.endsWith('.geojson')) {
      try { copyFileSync(join(src, f), join(dest, f)) } catch {}
    }
  })
  readdirSync(join(src, 'regions')).forEach(f => {
    if (f.endsWith('.geojson')) {
      try { copyFileSync(join(src, 'regions', f), join(dest, 'regions', f)) } catch {}
    }
  })
  console.log('[sync-data] GeoJSON files synced')
}

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'sync-geojson',
      configureServer(server) {
        syncData()
        watch(join(__dirname, '../data'), { recursive: true }, () => {
          syncData()
          server.ws.send({ type: 'full-reload' })
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
