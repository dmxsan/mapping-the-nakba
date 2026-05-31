import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { City, Village, HistoricalEvent, LayerConfig, SearchResult } from '@/types'
import { cities } from '@/data/cities'
import { events } from '@/data/events'

export const useMapStore = defineStore('map', () => {
  // State
  const allCities = ref<City[]>(cities)
  const allVillages = ref<Village[]>([])
  const allEvents = ref<HistoricalEvent[]>(events)
  const villagesLoaded = ref(false)
  
  const activeEventId = ref<string | null>(null)
  
  const visibleLayers = ref<LayerConfig>({
    cities: true,
    villages: true,
    events: true
  })
  
  const searchQuery = ref('')
  const searchResults = ref<SearchResult[]>([])
  const isPlaying = ref(false)
  const currentEventIndex = ref(0)
  
  // Getters
  const activeEvent = computed(() => {
    if (!activeEventId.value) return null
    return allEvents.value.find(e => e.id === activeEventId.value) || null
  })
  
  const filteredCities = computed(() => {
    return visibleLayers.value.cities ? allCities.value : []
  })
  
  const filteredVillages = computed(() => {
    return visibleLayers.value.villages ? allVillages.value : []
  })
  
  const filteredEvents = computed(() => {
    return visibleLayers.value.events ? allEvents.value : []
  })
  
  // Actions
  function setActiveEvent(id: string | null) {
    activeEventId.value = id
    if (id) {
      const index = allEvents.value.findIndex(e => e.id === id)
      if (index !== -1) {
        currentEventIndex.value = index
      }
    }
  }
  
  function toggleLayer(layer: 'cities' | 'villages' | 'events') {
    visibleLayers.value[layer] = !visibleLayers.value[layer]
  }
  
  function setSearchResults(results: SearchResult[]) {
    searchResults.value = results
  }
  
  function clearSearch() {
    searchQuery.value = ''
    searchResults.value = []
  }
  
  function playTimeline() {
    isPlaying.value = true
  }
  
  function pauseTimeline() {
    isPlaying.value = false
  }
  
  function nextEvent() {
    if (currentEventIndex.value < allEvents.value.length - 1) {
      currentEventIndex.value++
      activeEventId.value = allEvents.value[currentEventIndex.value].id
    } else {
      pauseTimeline()
    }
  }
  
  function previousEvent() {
    if (currentEventIndex.value > 0) {
      currentEventIndex.value--
      activeEventId.value = allEvents.value[currentEventIndex.value].id
    }
  }
  
  function setCurrentEventIndex(index: number) {
    if (index >= 0 && index < allEvents.value.length) {
      currentEventIndex.value = index
      activeEventId.value = allEvents.value[index].id
    }
  }
  
  async function loadVillages() {
    if (villagesLoaded.value) return
    try {
      const res = await fetch('/data/villages.geojson')
      const geojson = await res.json()
      allVillages.value = geojson.features.map((f: any) => ({
        id: f.properties.id,
        name: f.properties.name,
        coordinates: [f.geometry.coordinates[1], f.geometry.coordinates[0]] as [number, number],
        year: f.properties.year,
        fate: f.properties.fate,
        eventId: f.properties.eventId,
        type: 'village' as const
      }))
      villagesLoaded.value = true
    } catch (e) {
      console.error('Failed to load villages:', e)
    }
  }
  
  return {
    // State
    allCities,
    allVillages,
    allEvents,
    villagesLoaded,
    activeEventId,
    visibleLayers,
    searchQuery,
    searchResults,
    isPlaying,
    currentEventIndex,
    
    // Getters
    activeEvent,
    filteredCities,
    filteredVillages,
    filteredEvents,
    
    // Actions
    setActiveEvent,
    toggleLayer,
    setSearchResults,
    clearSearch,
    playTimeline,
    pauseTimeline,
    nextEvent,
    previousEvent,
    setCurrentEventIndex,
    loadVillages
  }
})
