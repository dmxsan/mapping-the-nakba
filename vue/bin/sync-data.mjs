import { copyFileSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const src = join(__dirname, '../../data')
const dest = join(__dirname, '../public/data')

// Ensure directories exist
;['', 'regions', 'borders'].forEach(dir => {
  mkdirSync(join(dest, dir), { recursive: true })
})

// Copy root geojson files
readdirSync(src).forEach(f => {
  if (f.endsWith('.geojson')) {
    try { copyFileSync(join(src, f), join(dest, f)) } catch {}
  }
})

// Copy regions
readdirSync(join(src, 'regions')).forEach(f => {
  if (f.endsWith('.geojson')) {
    try { copyFileSync(join(src, 'regions', f), join(dest, 'regions', f)) } catch {}
  }
})

// Copy borders
readdirSync(join(src, 'borders')).forEach(f => {
  if (f.endsWith('.geojson')) {
    try { copyFileSync(join(src, 'borders', f), join(dest, 'borders', f)) } catch {}
  }
})

console.log('[sync-data] GeoJSON files synced')
