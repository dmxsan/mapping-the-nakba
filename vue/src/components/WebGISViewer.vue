<template>
  <div class="webgis-container">
    <header class="webgis-header">
      <div class="header-flag">
        <span class="flag-black"></span>
        <span class="flag-white"></span>
        <span class="flag-green"></span>
        <span class="flag-red"></span>
      </div>
      <div class="header-content">
        <h1 class="header-title-ar">توثيق النّكبة المُستمرّة</h1>
        <h1 class="header-title-en">Documenting the Ongoing Nakba</h1>
        <div class="header-divider"></div>
        <p class="header-subtitle">A Cartographic Archive of Dispossession, Occupation &amp; Erasure &middot; 1947–Present</p>
      </div>
      <div class="header-rule"></div>
    </header>

    <div class="webgis-content">
      <aside class="webgis-sidebar">
        <TimelineSlider 
          ref="timelineSliderRef"
          :events="timelineEvents" 
          @change="onTimelineChange"
          class="timeline-section"
        />
        <LayerControl 
          :layers="mapLayers" 
          @toggle="onLayerToggle"
          @opacity="onOpacityChange"
          @yearchange="onYearChange"
          class="layers-section"
        />
      </aside>

      <main class="webgis-map-area">
        <div 
          ref="mapContainer" 
          class="map-container" 
          role="application" 
          aria-label="Interactive map of Palestine"
        ></div>
        
        <div v-if="selectedEvent" class="event-info-panel">
          <button 
            class="close-btn" 
            @click="selectedEvent = null; clearEventRegion()"
            aria-label="Close event details"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="event-content">
            <div class="event-header">
              <h3>{{ selectedEvent.title }}</h3>
              <span v-if="selectedEvent.title_ar" class="arabic-title">{{ selectedEvent.title_ar }}</span>
            </div>
            <p class="event-date">{{ formatEventDate(selectedEvent) }}</p>
            <p class="event-description">{{ selectedEvent.description }}</p>
            <div class="event-meta" v-if="selectedEvent.casualties || selectedEvent.refugees_created">
              <span v-if="selectedEvent.casualties" class="meta-badge danger">
                {{ selectedEvent.casualties }} casualties
              </span>
              <span v-if="selectedEvent.refugees_created" class="meta-badge warning">
                {{ selectedEvent.refugees_created }}
              </span>
            </div>
            <div class="event-sources" v-if="selectedEvent.sources?.length">
              <strong>Verified Sources</strong>
              <ul>
                <li v-for="source in selectedEvent.sources" :key="source.url">
                  <a :href="source.url" target="_blank" rel="noopener" class="source-link">
                    {{ source.name }}
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15,3 21,3 21,9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="legend">
          <div class="legend-title">Legend</div>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-marker city"></span>
              <span>Major Cities</span>
            </div>
            <div class="legend-item">
              <span class="legend-marker village"></span>
              <span>Historical Villages</span>
            </div>
            <div class="legend-item">
              <span class="legend-marker event"></span>
              <span>Historical Events</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import TimelineSlider from './TimelineSlider.vue'
import LayerControl from './LayerControl.vue'
import { cities } from '@/data/cities'
import { villages } from '@/data/villages'
import { events } from '@/data/events'
import { regions, EVENT_REGIONS, PALESTINE_BORDER } from '@/data/regions'

interface Source {
  name: string
  url: string
}

interface TimelineEvent {
  event_id: string
  title: string
  title_ar?: string
  date_type: 'period' | 'specific'
  start_date: string
  end_date?: string
  description: string
  coordinates?: [number, number]
  casualties?: string
  refugees_created?: string
  location?: string
  sources: Source[]
}

interface MapLayer {
  id: string
  name: string
  year: number
  url: string
  visible: boolean
  opacity: number
  years?: number[]
  selectedYear?: number
}

interface Props {
  initialCenter?: [number, number]
  initialZoom?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialCenter: () => [35.2332, 31.9522],
  initialZoom: 8
})

const mapContainer = ref<HTMLDivElement | null>(null)
const timelineSliderRef = ref<InstanceType<typeof TimelineSlider>>()
let map: maplibregl.Map | null = null
const selectedEvent = ref<any>(null)

const timelineEvents = ref<TimelineEvent[]>(events.map(e => ({
  event_id: e.id,
  title: e.title,
  title_ar: e.titleAr,
  date_type: e.dateType,
  start_date: e.startDate,
  end_date: e.endDate,
  description: e.description,
  coordinates: e.coordinates,
  casualties: e.casualties,
  refugees_created: e.refugeesCreated,
  location: e.location,
  sources: e.sources
})))

const POM_YEAR_URLS: Record<number, string> = {
  1875: 'https://palopenmaps.org/tiles/pal63k-1880/{z}/{x}/{y}@2x.jpg',
  1940: 'https://cdn.jsdelivr.net/gh/bothness/pom-tiles@2d154a81c81c2647f74dd4ceee4b1bee66119e79/aerial1940s/{z}/{x}/{y}.png',
  1945: 'https://palopenmaps.org/tiles/pal-1940s/{z}/{x}/{y}.jpg',
  1946: 'https://palopenmaps.org/tiles/pal250k-1946/{z}/{x}/{y}.jpg',
  1950: 'https://palopenmaps.org/tiles/pal100k-1950s/{z}/{x}/{y}.jpg',
  1951: 'https://palopenmaps.org/tiles/isr250k-1951/{z}/{x}/{y}@2x.jpg'
}

const POM_YEARS = Object.keys(POM_YEAR_URLS).map(Number).sort((a, b) => a - b)
const DEFAULT_POM_YEAR = 1945

const mapLayers = ref<MapLayer[]>([
  {
    id: 'pom-historical',
    name: 'Historical Map',
    year: 1945,
    url: POM_YEAR_URLS[DEFAULT_POM_YEAR],
    visible: false,
    opacity: 80,
    years: POM_YEARS,
    selectedYear: DEFAULT_POM_YEAR
  },
  {
    id: 'esri-satellite',
    name: 'Satellite Imagery',
    year: 2025,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    visible: false,
    opacity: 100
  }
])

const MARKER_SIZES = {
  city: { w: 12, h: 12 },
  village: { w: 10, h: 10 },
  event: { w: 14, h: 14 },
  eventHighlight: { w: 20, h: 20 }
}

let currentZoom = 8

function getMarkerScale(zoom: number): number {
  if (zoom <= 5) return 0.5
  if (zoom <= 7) return 0.7
  if (zoom <= 9) return 0.85
  return 1
}

const formatEventDate = (event: TimelineEvent): string => {
  if (event.date_type === 'period' && event.end_date) {
    return `${event.start_date} → ${event.end_date}`
  }
  return event.start_date
}

const updateMarkerHighlight = (activeEventId: string) => {
  markersRef.events.forEach((marker, eventId) => {
    const el = marker.getElement()
    if (!el) return
    const svg = el.querySelector('svg')
    const circle = el.querySelector('circle') as SVGElement | null
    if (!svg) return

    const isSelected = eventId === activeEventId
    const scale = getMarkerScale(currentZoom)

    if (isSelected) {
      const { w, h } = MARKER_SIZES.eventHighlight
      const sw = Math.round(w * scale)
      const sh = Math.round(h * scale)

      svg.setAttribute('width', `${sw}`)
      svg.setAttribute('height', `${sh}`)
      el.style.zIndex = '10'
      el.classList.add('pulse-active')

      if (circle) {
        circle.setAttribute('fill', '#FF6D00')
      }
    } else {
      const { w, h } = MARKER_SIZES.event
      const sw = Math.round(w * scale)
      const sh = Math.round(h * scale)

      svg.setAttribute('width', `${sw}`)
      svg.setAttribute('height', `${sh}`)
      el.style.zIndex = '1'
      el.classList.remove('pulse-active')

      if (circle) {
        circle.setAttribute('fill', '#1976D2')
      }
    }
  })
}

const updateAllMarkerSizes = () => {
  const scale = getMarkerScale(currentZoom)

  const updateSvg = (el: HTMLDivElement | null, size: { w: number; h: number }) => {
    if (!el) return
    const sw = Math.round(size.w * scale)
    const sh = Math.round(size.h * scale)
    const svg = el.querySelector('svg')
    if (svg) {
      svg.setAttribute('width', `${sw}`)
      svg.setAttribute('height', `${sh}`)
    }
  }

  markersRef.cities.forEach(marker => {
    updateSvg(marker.getElement() as HTMLDivElement, MARKER_SIZES.city)
  })

  markersRef.villages.forEach(marker => {
    updateSvg(marker.getElement() as HTMLDivElement, MARKER_SIZES.village)
  })

  if (selectedEvent.value) {
    updateMarkerHighlight(selectedEvent.value.event_id)
  } else {
    markersRef.events.forEach((marker) => {
      updateSvg(marker.getElement() as HTMLDivElement, MARKER_SIZES.event)
    })
  }
}

const markersRef = {
  cities: new Map<string, maplibregl.Marker>(),
  villages: [] as maplibregl.Marker[],
  events: new Map<string, maplibregl.Marker>()
}

const regionLabelMarkers = ref<any[]>([])
const regionPointMarkers = ref<any[]>([])

const calculateCentroid = (coords: number[][][]): [number, number] => {
  const ring = coords[0]
  let cx = 0, cy = 0
  for (const pt of ring) {
    cx += pt[0]
    cy += pt[1]
  }
  return [cx / ring.length, cy / ring.length]
}

const clearEventRegion = () => {
  const source = map?.getSource('event-region') as maplibregl.GeoJSONSource | undefined
  if (source) {
    source.setData({ type: 'FeatureCollection', features: [] })
  }
  regionLabelMarkers.value.forEach(m => m.remove())
  regionLabelMarkers.value = []
  regionPointMarkers.value.forEach(m => m.remove())
  regionPointMarkers.value = []
}

const showEventRegion = (eventId: string) => {
  const regionIds = EVENT_REGIONS[eventId] || []
  const features = regionIds.map(id => {
    const r = regions[id]
    return r ? {
      type: 'Feature' as const,
      properties: { name: r.name },
      geometry: r.geometry
    } : null
  }).filter(Boolean)

  const source = map?.getSource('event-region') as maplibregl.GeoJSONSource | undefined
  if (source) {
    source.setData({
      type: 'FeatureCollection',
      features: features as GeoJSON.Feature[]
    })
  }

  regionLabelMarkers.value.forEach(m => m.remove())
  regionLabelMarkers.value = []
  regionPointMarkers.value.forEach(m => m.remove())
  regionPointMarkers.value = []

  if (!map) return

  const REGION_TO_CITY: Record<string, string> = {
    'gaza': 'Gaza City',
    'gaza-city': 'Gaza City',
    'ramallah-area': 'Ramallah',
    'jericho-area': 'Jericho',
    'jenin-area': 'Jenin',
    'nablus-area': 'Nablus',
    'jerusalem-area': 'Jerusalem'
  }

  const hasMultiple = regionIds.length > 1

  regionIds.forEach((id, index) => {
    const r = regions[id]
    if (!r) return
    const center = calculateCentroid(r.geometry.coordinates)

    const cityName = REGION_TO_CITY[id]

    const el = document.createElement('div')
    el.className = 'region-label'
    el.style.cssText = `
      font-size: 11px;
      font-weight: 600;
      color: #0D47A1;
      background: rgba(255,255,255,0.85);
      padding: 3px 8px;
      line-height: 1;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    `
    el.textContent = r.name
    const marker = new maplibregl.Marker({ element: el, anchor: 'center', offset: [0, -24] })
      .setLngLat(center)
      .addTo(map!)
    regionLabelMarkers.value.push(marker)

    if (hasMultiple && index > 0 && !cityName) {
      const dot = document.createElement('div')
      dot.style.cssText = `
        width: 8px;
        height: 8px;
        background: #1976D2;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        cursor: pointer;
      `
      const pointMarker = new maplibregl.Marker({ element: dot, anchor: 'center' })
        .setLngLat(center)
        .setPopup(
          new maplibregl.Popup({ offset: 14 }).setHTML(`
            <div style="font-family: system-ui, sans-serif; padding: 4px 6px; font-size: 12px;">
              <strong style="color: #1976D2;">${r.name}</strong>
            </div>
          `)
        )
        .addTo(map!)
      regionPointMarkers.value.push(pointMarker)
    }
  })
}

const fitMapToRegions = (eventId: string) => {
  const regionIds = EVENT_REGIONS[eventId] || []
  if (regionIds.length === 0 || !map) return

  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity

  regionIds.forEach(id => {
    const r = regions[id]
    if (!r) return
    const ring = r.geometry.coordinates[0]
    ring.forEach(pt => {
      if (pt[0] < minLng) minLng = pt[0]
      if (pt[0] > maxLng) maxLng = pt[0]
      if (pt[1] < minLat) minLat = pt[1]
      if (pt[1] > maxLat) maxLat = pt[1]
    })
  })

  map.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
    padding: { top: 40, bottom: 140, left: 80, right: 380 },
    duration: 1500,
    essential: true
  })
}

const onTimelineChange = (event: TimelineEvent) => {
  selectedEvent.value = event
  timelineSliderRef.value?.syncIndex(event.event_id)
  
  if (map && event.coordinates) {
    fitMapToRegions(event.event_id)
    updateMarkerHighlight(event.event_id)
    showEventRegion(event.event_id)
  }
}

const onLayerToggle = (layer: MapLayer) => {
  const layerIndex = mapLayers.value.findIndex(l => l.id === layer.id)
  if (layerIndex !== -1) {
    mapLayers.value[layerIndex].visible = layer.visible
    if (map) {
      try {
        const mapLayer = map.getLayer(layer.id)
        if (mapLayer) {
          map.setLayoutProperty(layer.id, 'visibility', layer.visible ? 'visible' : 'none')
        }
      } catch (e) {
        // Layer not yet added
      }
    }
  }
}

const onOpacityChange = (layer: MapLayer) => {
  const layerIndex = mapLayers.value.findIndex(l => l.id === layer.id)
  if (layerIndex !== -1) {
    mapLayers.value[layerIndex].opacity = layer.opacity
    if (map) {
      try {
        map.setPaintProperty(layer.id, 'raster-opacity', layer.opacity / 100)
      } catch (e) {
        // Layer not yet added
      }
    }
  }
}

const onYearChange = (layerId: string, year: number) => {
  if (layerId === 'pom-historical') {
    swapHistoricalTiles(year)
  }
}

const createCityMarker = (_city: { name: string; coordinates: [number, number] }) => {
  const { w, h } = MARKER_SIZES.city
  const scale = getMarkerScale(currentZoom)
  const sw = Math.round(w * scale)
  const sh = Math.round(h * scale)
  const el = document.createElement('div')
  el.className = 'marker-icon marker-city'
  el.dataset.type = 'city'
  el.style.cssText = `
    cursor: pointer;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
    line-height: 0;
  `
  el.innerHTML = `
    <svg viewBox="0 0 24 24" width="${sw}" height="${sh}">
      <circle cx="12" cy="12" r="10" fill="#2E7D32" stroke="#fff" stroke-width="2"/>
    </svg>
  `
  return el
}

const createVillageMarker = (_village: { name: string; coordinates: [number, number] }) => {
  const { w, h } = MARKER_SIZES.village
  const scale = getMarkerScale(currentZoom)
  const sw = Math.round(w * scale)
  const sh = Math.round(h * scale)
  const el = document.createElement('div')
  el.className = 'marker-icon marker-village'
  el.dataset.type = 'village'
  el.style.cssText = `
    cursor: pointer;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
    line-height: 0;
  `
  el.innerHTML = `
    <svg viewBox="0 0 24 24" width="${sw}" height="${sh}">
      <rect x="4" y="4" width="16" height="16" fill="#D32F2F" stroke="#fff" stroke-width="2" transform="rotate(45 12 12)"/>
    </svg>
  `
  return el
}

const createEventMarker = (event: TimelineEvent, isSelected: boolean = false) => {
  const sizeKey = isSelected ? 'eventHighlight' : 'event'
  const { w, h } = MARKER_SIZES[sizeKey]
  const scale = getMarkerScale(currentZoom)
  const sw = Math.round(w * scale)
  const sh = Math.round(h * scale)
  const color = isSelected ? '#FF6D00' : '#1976D2'

  const el = document.createElement('div')
  el.className = `marker-icon marker-event${isSelected ? ' pulse-active' : ''}`
  el.dataset.type = 'event'
  el.dataset.eventId = event.event_id
  el.style.cssText = `
    cursor: pointer;
    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.3));
    z-index: ${isSelected ? 10 : 1};
    line-height: 0;
  `
  el.innerHTML = `
    <svg viewBox="0 0 24 24" width="${sw}" height="${sh}">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#fff"/>
    </svg>
  `
  return el
}

const addMarkers = () => {
  if (!map) return

  markersRef.cities.forEach(m => m.remove())
  markersRef.villages.forEach(m => m.remove())
  markersRef.events.forEach(m => m.remove())
  markersRef.cities.clear()
  markersRef.villages = []
  markersRef.events.clear()

  cities.forEach(city => {
    const el = createCityMarker(city)
    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([city.coordinates[1], city.coordinates[0]])
      .setPopup(
        new maplibregl.Popup({ offset: 25, className: 'custom-popup' }).setHTML(`
          <div style="font-family: system-ui, sans-serif; padding: 8px;">
            <strong style="color: #1B5E20; font-size: 14px;">${city.name}</strong><br/>
            <span style="font-size: 12px; color: #666;">Major City</span>
          </div>
        `)
      )
      .addTo(map!)
    markersRef.cities.set(city.name, marker)
  })

  villages.forEach(village => {
    const el = createVillageMarker(village)
    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([village.coordinates[1], village.coordinates[0]])
      .setPopup(
        new maplibregl.Popup({ offset: 25, className: 'custom-popup' }).setHTML(`
          <div style="font-family: system-ui, sans-serif; padding: 8px;">
            <strong style="color: #D32F2F; font-size: 14px;">${village.name}</strong><br/>
            <span style="font-size: 12px; color: #666;">Depopulated Village (${village.year})</span>
          </div>
        `)
      )
      .addTo(map!)
    markersRef.villages.push(marker)
  })

  timelineEvents.value.forEach(event => {
    if (event.coordinates) {
      const isSelected = selectedEvent.value?.event_id === event.event_id
      const el = createEventMarker(event, isSelected)
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([event.coordinates[1], event.coordinates[0]])
        .addTo(map!)
      el.addEventListener('click', () => {
        onTimelineChange(event)
      })
      markersRef.events.set(event.event_id, marker)
    }
  })
}

const addRasterLayers = () => {
  if (!map) return

  const sourceAttribution: Record<string, string> = {
    'pom-historical': 'Survey of Palestine, 1929-48 | Palestine Open Maps',
    'esri-satellite': 'Esri, Maxar, Earthstar Geographics, GIS User Community'
  }

  // Reverse iteration: first sidebar item renders on top
  for (let i = mapLayers.value.length - 1; i >= 0; i--) {
    const layer = mapLayers.value[i]
    if (!layer.url || map!.getSource(layer.id)) continue

    map!.addSource(layer.id, {
      type: 'raster',
      tiles: [layer.url],
      tileSize: 256,
      attribution: sourceAttribution[layer.id] || layer.name
    })

    map!.addLayer({
      id: layer.id,
      type: 'raster',
      source: layer.id,
      layout: {
        visibility: layer.visible ? 'visible' : 'none'
      },
      paint: {
        'raster-opacity': layer.opacity / 100
      }
    })
  }
}

const swapHistoricalTiles = (year: number) => {
  const url = POM_YEAR_URLS[year]
  if (!url) return

  const layer = mapLayers.value.find(l => l.id === 'pom-historical')
  if (layer) {
    layer.url = url
    layer.selectedYear = year
  }

  if (!map) return
  const source = map.getSource('pom-historical') as maplibregl.RasterTileSource | undefined
  if (source) {
    source.setTiles([url])
  }
}

onMounted(() => {
  if (!mapContainer.value) return

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'carto-light': {
          type: 'raster',
          tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© CARTO © OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'carto-light',
          type: 'raster',
          source: 'carto-light'
        }
      ]
    },
    center: props.initialCenter,
    zoom: props.initialZoom
  })

  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left')

  map.on('load', () => {
    try { addRasterLayers() } catch (e) { console.warn('Raster layer setup failed:', e) }

    map!.addSource('palestine-border', {
      type: 'geojson',
      data: PALESTINE_BORDER
    })

    map!.addLayer({
      id: 'palestine-border-line',
      type: 'line',
      source: 'palestine-border',
      layout: {},
      paint: {
        'line-color': '#8B6914',
        'line-width': 3,
        'line-opacity': 0.7
      }
    })

    map!.addSource('event-region', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] }
    })

    map!.addLayer({
      id: 'event-region-fill',
      type: 'fill',
      source: 'event-region',
      layout: {},
      paint: {
        'fill-color': '#1565C0',
        'fill-opacity': 0.25,
        'fill-outline-color': '#0D47A1'
      }
    })

    addMarkers()

    if (timelineEvents.value.length > 0) {
      const first = timelineEvents.value[0]
      selectedEvent.value = first
      showEventRegion(first.event_id)
      fitMapToRegions(first.event_id)
    }
  })

  map.on('zoomend', () => {
    currentZoom = map!.getZoom()
    updateAllMarkerSizes()
  })
})

onUnmounted(() => {
  map?.remove()
})
</script>

<style scoped>
.webgis-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f9fa;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.webgis-header {
  background: linear-gradient(
    180deg,
    #f5efe0 0%,
    #faf6ed 15%,
    #fdfaf4 40%,
    #faf6ed 85%,
    #f5efe0 100%
  );
  color: #2c1810;
  padding: 0;
  text-align: center;
  box-shadow: 0 1px 6px rgba(0,0,0,0.08);
}

.header-flag {
  display: flex;
  height: 3px;
}

.flag-black {
  flex: 1;
  background: #000000;
}

.flag-white {
  flex: 1;
  background: #ffffff;
}

.flag-green {
  flex: 1;
  background: #007a3d;
}

.flag-red {
  flex: 1;
  background: #ce1126;
}

.header-rule {
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #c4a44a 20%, #d4b84a 50%, #c4a44a 80%, transparent 100%);
}

.header-content {
  padding: 0.75rem 2rem 0.6rem 2rem;
}

.header-title-ar {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #5a7247;
  margin: 0 0 3px 0;
  letter-spacing: 0.02em;
  direction: rtl;
}

.header-title-en {
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: #2c1810;
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.header-divider {
  width: 120px;
  height: 1px;
  background: #c4a44a;
  margin: 6px auto;
}

.header-subtitle {
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  font-size: 0.8rem;
  font-weight: 400;
  font-style: italic;
  color: #6b5b4f;
  margin: 0;
  letter-spacing: 0.03em;
}

.webgis-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.webgis-sidebar {
  width: 340px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0,0,0,0.03);
}

.timeline-section {
  border-bottom: 1px solid #e8e8e8;
}

.layers-section {
  flex: 1;
}

.webgis-map-area {
  flex: 1;
  position: relative;
  background: #e8e8e8;
}

.map-container {
  width: 100%;
  height: 100%;
}

.event-info-panel {
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 360px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  overflow: hidden;
  z-index: 1000;
}

.event-info-panel .close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1;
}

.event-info-panel .close-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.event-content {
  padding: 20px;
}

.event-header {
  margin-bottom: 8px;
}

.event-info-panel h3 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.1rem;
  font-weight: 600;
  padding-right: 40px;
}

.arabic-title {
  font-size: 0.95rem;
  color: #666;
  margin-top: 2px;
}

.event-date {
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.event-description {
  color: #444;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.event-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.meta-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.meta-badge.danger {
  background: #fef2f2;
  color: #dc2626;
}

.meta-badge.warning {
  background: #fffbeb;
  color: #d97706;
}

.event-sources {
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.event-sources strong {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 8px;
}

.event-sources ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.event-sources li {
  margin-bottom: 6px;
}

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #1976D2;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.source-link:hover {
  color: #1565C0;
  text-decoration: underline;
}

.legend {
  position: absolute;
  bottom: 24px;
  left: 24px;
  background: white;
  border-radius: 10px;
  padding: 14px 18px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  z-index: 1000;
}

.legend-title {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #888;
  margin-bottom: 10px;
  font-weight: 600;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #555;
}

.legend-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.legend-marker.city {
  background: #2E7D32;
}

.legend-marker.village {
  background: #D32F2F;
  border-radius: 2px;
  transform: rotate(45deg);
}

.legend-marker.event {
  background: #1976D2;
}

:deep(.marker-icon) {
  display: inline-block;
}

:deep(.marker-icon svg) {
  display: block;
}

:deep(.marker-icon.pulse-active) {
  animation: eventPulse 2s ease-in-out infinite;
}

@keyframes eventPulse {
  0%, 100% {
    filter: drop-shadow(0 0 6px rgba(255, 109, 0, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 14px rgba(255, 109, 0, 0.95));
  }
}

:deep(.custom-popup .maplibregl-popup-content) {
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0;
  font-family: system-ui, sans-serif;
}

:deep(.custom-popup .maplibregl-popup-close-button) {
  font-size: 18px;
  padding: 8px;
  color: #666;
  border-radius: 0 10px 0 0;
}

:deep(.custom-popup .maplibregl-popup-close-button:hover) {
  background: #f5f5f5;
}

:deep(.maplibregl-popup-anchor-bottom) {
  padding-bottom: 10px;
}

@media (max-width: 768px) {
  .webgis-sidebar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 45%;
    z-index: 100;
    border-right: none;
    border-top: 1px solid #e8e8e8;
  }
  
  .webgis-content {
    position: relative;
  }
  
  .event-info-panel {
    width: calc(100% - 48px);
    left: 24px;
    right: 24px;
    bottom: 50%;
    margin-bottom: 16px;
  }
  
  .legend {
    bottom: auto;
    top: 16px;
    left: 16px;
    padding: 10px 14px;
  }
}
</style>
