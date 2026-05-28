import { ref, computed, watch } from 'vue'
import Fuse from 'fuse.js'
import { useMapStore } from '@/stores/mapStore'
import type { City, Village, HistoricalEvent, SearchResult } from '@/types'

// Combined searchable items
interface SearchableItem {
  id: string
  name: string
  description: string
  type: 'city' | 'village' | 'event'
  data: City | Village | HistoricalEvent
  coordinates: [number, number]
}

export function useSearch() {
  const store = useMapStore()
  
  const query = ref('')
  const filters = ref({
    types: ['city', 'village', 'event'] as Array<'city' | 'village' | 'event'>,
    dateFrom: 1947,
    dateTo: 2024
  })
  
  // Create searchable items from all data
  const searchableItems = computed<SearchableItem[]>(() => {
    const items: SearchableItem[] = []
    
    // Add cities
    store.allCities.forEach(city => {
      items.push({
        id: city.id,
        name: city.name,
        description: `${city.type} in Palestine`,
        type: 'city',
        data: city,
        coordinates: city.coordinates
      })
    })
    
    // Add villages
    store.allVillages.forEach(village => {
      items.push({
        id: village.id,
        name: village.name,
        description: `Depopulated village (${village.year}) - ${village.event}`,
        type: 'village',
        data: village,
        coordinates: village.coordinates
      })
    })
    
    // Add events
    store.allEvents.forEach(event => {
      items.push({
        id: event.id,
        name: event.title,
        description: event.description.substring(0, 200),
        type: 'event',
        data: event,
        coordinates: event.coordinates
      })
    })
    
    return items
  })
  
  // Configure Fuse.js for fuzzy search
  const fuse = computed(() => {
    return new Fuse(searchableItems.value, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'description', weight: 1 }
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2
    })
  })
  
  // Filter results
  const results = computed<SearchResult[]>(() => {
    if (query.value.length < 2) {
      return []
    }
    
    let fuseResults = fuse.value.search(query.value)
    
    // Filter by type
    fuseResults = fuseResults.filter(r => filters.value.types.includes(r.item.type))
    
    // Filter by date range for events
    if (filters.value.dateFrom || filters.value.dateTo) {
      fuseResults = fuseResults.filter(r => {
        if (r.item.type !== 'event') return true
        const event = r.item.data as HistoricalEvent
        const year = parseInt(event.startDate.split('-')[0])
        return year >= (filters.value.dateFrom || 0) && year <= (filters.value.dateTo || 9999)
      })
    }
    
    return fuseResults.map(r => ({
      item: r.item.data,
      type: r.item.type,
      matchScore: r.score || 0
    }))
  })
  
  // Watch for changes and update store
  watch(results, (newResults) => {
    store.setSearchResults(newResults)
  })
  
  function setQuery(newQuery: string) {
    query.value = newQuery
  }
  
  function toggleTypeFilter(type: 'city' | 'village' | 'event') {
    const index = filters.value.types.indexOf(type)
    if (index > -1) {
      filters.value.types.splice(index, 1)
    } else {
      filters.value.types.push(type)
    }
  }
  
  function setDateRange(from: number, to: number) {
    filters.value.dateFrom = from
    filters.value.dateTo = to
  }
  
  function clearSearch() {
    query.value = ''
    store.clearSearch()
  }
  
  return {
    query,
    filters,
    results,
    setQuery,
    toggleTypeFilter,
    setDateRange,
    clearSearch
  }
}
