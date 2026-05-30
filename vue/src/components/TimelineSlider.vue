<template>
  <div class="timeline-slider-container">
    <div class="timeline-header">
      <h3>Historical Timeline</h3>
      <span class="timeline-period">1947 - Present</span>
    </div>

    <div class="timeline-track">
      <div 
        ref="trackRef"
        class="timeline-range"
        @click="onTrackClick"
      >
        <div
          v-for="(event, index) in events"
          :key="event.event_id"
          class="event-marker"
          :class="{ active: selectedIndex === index, above: index % 2 === 0 }"
          :style="{ left: `${getEventPosition(index)}%` }"
          @click.stop="clickEvent(index)"
          @mouseenter="hoveredEvent = index"
          @mouseleave="hoveredEvent = null"
          role="button"
          :aria-label="`${event.title}, ${formatYear(event.start_date)}`"
          tabindex="0"
          @keydown.enter="clickEvent(index)"
          @keydown.space.prevent="clickEvent(index)"
        >
          <div class="event-point"></div>
          <div class="event-label">{{ formatYear(event.start_date) }}</div>
          
          <div v-if="hoveredEvent === index" class="event-tooltip">
            <strong>{{ event.title }}</strong>
            <span>{{ formatDate(event) }}</span>
          </div>
        </div>
        
        <div 
          class="progress-line" 
          :style="{ width: `${getEventPosition(selectedIndex)}%` }"
        ></div>
      </div>
    </div>

    <div v-if="selectedEvent" class="current-event">
      <div class="event-title">{{ selectedEvent.title }}</div>
      <div v-if="selectedEvent.location" class="event-location">{{ selectedEvent.location }}</div>
      <div class="event-date">{{ formatDate(selectedEvent) }}</div>
    </div>

    <div class="timeline-controls">
      <button 
        class="control-btn"
        @click="previousEvent"
        :disabled="selectedIndex === 0"
        aria-label="Previous event"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
        Previous
      </button>
      
      <button 
        class="control-btn play-btn"
        @click="handlePlayClick"
        :aria-label="playButtonLabel"
      >
        <svg v-if="playButtonIcon === 'play'" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <polygon points="5,3 19,12 5,21"></polygon>
        </svg>
        <svg v-else-if="playButtonIcon === 'pause'" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
        {{ playButtonLabel }}
      </button>
      
      <button 
        class="control-btn"
        @click="nextEvent"
        :disabled="selectedIndex === events.length - 1"
        aria-label="Next event"
      >
        Next
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

interface Props {
  events: TimelineEvent[]
  initialIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0
})

const emit = defineEmits<{
  (e: 'change', event: TimelineEvent): void
}>()

const selectedIndex = ref(props.initialIndex)
const hoveredEvent = ref<number | null>(null)
const isPlaying = ref(false)
const hasCompleted = ref(false)
const playInterval = ref<number | null>(null)

const selectedEvent = computed(() => props.events[selectedIndex.value])

const playButtonIcon = computed(() => {
  if (isPlaying.value) return 'pause'
  if (hasCompleted.value) return 'replay'
  return 'play'
})

const playButtonLabel = computed(() => {
  if (isPlaying.value) return 'Pause'
  if (hasCompleted.value) return 'Replay'
  return 'Play'
})

const getEventPosition = (index: number): number => {
  if (props.events.length <= 1) return 0
  return (index / (props.events.length - 1)) * 100
}

const formatYear = (dateString: string): string => {
  return dateString.split('-')[0]
}

const formatDate = (event: TimelineEvent): string => {
  if (event.date_type === 'period' && event.end_date) {
    return `${event.start_date} → ${event.end_date}`
  }
  return event.start_date
}

const selectEvent = (index: number) => {
  selectedIndex.value = index
  hasCompleted.value = false
  emit('change', props.events[index])
}

const clickEvent = (index: number) => {
  if (isPlaying.value) {
    pauseTimeline()
  }
  selectEvent(index)
}

const onTrackClick = (event: MouseEvent) => {
  const track = event.currentTarget as HTMLElement
  const rect = track.getBoundingClientRect()
  const clickPosition = (event.clientX - rect.left) / rect.width
  const newIndex = Math.round(clickPosition * (props.events.length - 1))
  clickEvent(Math.max(0, Math.min(newIndex, props.events.length - 1)))
}

const previousEvent = () => {
  if (selectedIndex.value > 0) {
    selectEvent(selectedIndex.value - 1)
  }
}

const nextEvent = () => {
  if (selectedIndex.value < props.events.length - 1) {
    selectEvent(selectedIndex.value + 1)
  }
}

const handlePlayClick = () => {
  if (isPlaying.value) {
    pauseTimeline()
  } else if (hasCompleted.value) {
    selectEvent(0)
    playTimeline()
  } else {
    playTimeline()
  }
}

const playTimeline = () => {
  isPlaying.value = true
  hasCompleted.value = false
  playInterval.value = window.setInterval(() => {
    if (selectedIndex.value < props.events.length - 1) {
      nextEvent()
    } else {
      pauseTimeline()
      hasCompleted.value = true
    }
  }, 4000)
}

const pauseTimeline = () => {
  isPlaying.value = false
  if (playInterval.value) {
    clearInterval(playInterval.value)
    playInterval.value = null
  }
}

defineExpose({
  syncIndex(eventId: string) {
    const idx = props.events.findIndex(e => e.event_id === eventId)
    if (idx !== -1 && idx !== selectedIndex.value) {
      selectedIndex.value = idx
      hasCompleted.value = false
    }
  }
})
</script>

<style scoped>
.timeline-slider-container {
  background: white;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: system-ui, -apple-system, sans-serif;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.timeline-header h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
}

.timeline-period {
  font-size: 0.75rem;
  color: #888;
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.timeline-track {
  position: relative;
  height: 64px;
  margin-bottom: 16px;
}

.timeline-range {
  position: relative;
  height: 3px;
  background: #e8e8e8;
  border-radius: 2px;
  top: 28px;
  cursor: pointer;
}

.progress-line {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #1976D2, #42A5F5);
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
}

.event-point {
  width: 12px;
  height: 12px;
  background: #ccc;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-marker.active .event-point {
  background: #1976D2;
  transform: scale(1.4);
  box-shadow: 0 0 0 5px rgba(25, 118, 210, 0.2);
}

.event-marker:hover .event-point {
  background: #1976D2;
  transform: scale(1.2);
}

.event-label {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: #888;
  white-space: nowrap;
  font-weight: 500;
  transition: color 0.2s ease;
}

.event-marker.active .event-label {
  color: #1976D2;
  font-weight: 600;
}

.event-marker.above .event-label {
  top: auto;
  bottom: 22px;
}

.event-label::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 1.5px;
  height: 8px;
  background: #d0d0d0;
  top: -9px;
}

.event-marker.above .event-label::before {
  top: auto;
  bottom: -9px;
}

.event-marker.active .event-label::before {
  background: #1976D2;
  width: 2px;
}

.event-tooltip {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  pointer-events: none;
}

.event-tooltip::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #1a1a1a;
}

.event-tooltip strong {
  display: block;
  margin-bottom: 2px;
}

.event-tooltip span {
  color: #aaa;
  font-size: 0.75rem;
}

.current-event {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.current-event .event-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.current-event .event-location {
  font-size: 0.75rem;
  color: #555;
  margin-bottom: 2px;
}

.current-event .event-date {
  font-size: 0.75rem;
  color: #888;
}

.timeline-controls {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
}

.control-btn {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  color: #555;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.control-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #1976D2;
  color: #1976D2;
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.play-btn {
  background: #1976D2;
  color: white;
  border-color: #1976D2;
}

.play-btn:hover:not(:disabled) {
  background: #1565C0;
  border-color: #1565C0;
  color: white;
}
</style>
