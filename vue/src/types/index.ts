export interface Source {
  name: string
  url: string
}

export interface HistoricalEvent {
  id: string
  title: string
  titleAr?: string
  dateType: 'period' | 'specific'
  startDate: string
  endDate?: string
  description: string
  coordinates: [number, number] // [lat, lng]
  casualties?: string
  refugeesCreated?: string
  villagesDestroyed?: string
  location?: string
  sources: Source[]
}

export interface City {
  id: string
  name: string
  coordinates: [number, number] // [lat, lng]
  type: 'city'
}

export interface Village {
  id: string
  name: string
  coordinates: [number, number] // [lat, lng]
  year: number
  fate: string
  eventId: string
  type: 'village'
}

export interface LayerConfig {
  cities: boolean
  villages: boolean
  events: boolean
}

export interface SearchResult {
  item: City | Village | HistoricalEvent
  type: 'city' | 'village' | 'event'
  matchScore: number
}

export interface MarkerData {
  id: string
  name: string
  coordinates: [number, number]
  type: 'city' | 'village' | 'event'
}
