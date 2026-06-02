<template>
  <div class="layer-control-container">
    <div class="layer-header">
      <h3>Map Layers</h3>
      <span class="layer-count">{{ totalVisible }} of {{ totalLayers }}</span>
    </div>

    <div class="layers-list">
      <!-- Historical Borders group — collapse / expand -->
      <div v-if="borders && borders.length" class="layer-item border-group-item" :class="{ expanded: bordersExpanded }">
        <div
          class="layer-toggle border-group-header"
          @click="toggleBordersExpanded"
          role="button"
          tabindex="0"
          @keydown.enter="toggleBordersExpanded"
        >
          <span class="collapse-arrow" :class="{ expanded: bordersExpanded }"></span>
          <div class="layer-info">
            <div class="layer-name">Historical Borders</div>
            <div class="layer-meta">
              <span class="layer-year">{{ visibleBorders }} active</span>
            </div>
          </div>
        </div>

        <!-- Border sub-items — only when expanded -->
        <div v-if="bordersExpanded" class="border-sub-items">
          <div
            v-for="entry in groupedBorderEntries"
            :key="entry.id"
          >
            <div
              v-if="entry._isGroupLabel"
              class="border-sub-item border-group-label"
              :class="{ active: allAnnexationsActive }"
              @click="toggleAnnexations"
              role="button"
              tabindex="0"
              @keydown.enter="toggleAnnexations"
            >
              <label class="border-checkbox" @click.stop>
                <input
                  type="checkbox"
                  :checked="allAnnexationsActive"
                  tabindex="-1"
                />
                <span class="border-checkmark"></span>
              </label>
              <span class="border-sub-name">{{ entry.groupLabel }}</span>
            </div>
            <div
              v-else
              class="border-sub-item"
              :class="{ active: entry.visible, 'border-sub-item--nested': entry.group }"
              @click="toggleBorderLayer(entry)"
              role="button"
              tabindex="0"
              @keydown.enter="toggleBorderLayer(entry)"
            >
              <label class="border-checkbox" @click.stop>
                <input
                  type="checkbox"
                  :checked="entry.visible"
                  tabindex="-1"
                />
                <span class="border-checkmark"></span>
              </label>
              <span class="border-sub-name">{{ entry.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Raster layers -->
      <div
        v-for="layer in layers"
        :key="layer.id"
        class="layer-item"
        :class="{ active: layer.visible }"
      >
        <label class="layer-toggle">
          <input
            type="checkbox"
            :checked="layer.visible"
            @change="toggleLayer(layer)"
            :aria-checked="layer.visible"
            tabindex="0"
            @keydown.space.prevent="toggleLayer(layer)"
          />
          <span class="checkmark"></span>
        </label>

        <div class="layer-info">
          <div class="layer-name">{{ layer.name }}</div>
          <div class="layer-meta">
            <span class="layer-year">{{ layer.selectedYear || layer.year }}</span>
            <span class="layer-source" v-if="getSourceName(layer)">
              {{ getSourceName(layer) }}
            </span>
          </div>
        </div>

        <div v-if="layer.visible" class="layer-controls">
          <div v-if="isHistorical && layer.years" class="year-control">
            <div class="control-header">
              <span>Year</span>
            </div>
            <div class="year-segmented">
              <button
                v-for="y in layer.years"
                :key="y"
                class="year-segment"
                :class="{ selected: layer.selectedYear === y }"
                @click="selectYear(layer, y)"
              >{{ y }}</button>
            </div>
          </div>

          <div class="opacity-control">
            <div class="control-header">
              <span>Opacity</span>
              <span class="control-value">{{ layer.opacity }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              v-model="layer.opacity"
              @input="updateOpacity(layer)"
              class="opacity-slider"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="layer-actions">
      <button class="action-btn" @click="showAllLayers">
        Show All
      </button>
      <button class="action-btn" @click="hideAllLayers">
        Hide All
      </button>
      <button class="action-btn" @click="resetLayers">
        Reset
      </button>
    </div>

    <div class="source-info">
      <h4>Historical Maps</h4>
      <ul>
        <li>
          <a href="https://palopenmaps.org" target="_blank" rel="noopener">
            Palestine Open Maps
          </a>
          - 1870s-1950s
        </li>
      </ul>
      <h4>Tile Sources</h4>
      <ul>
        <li>
          <a href="https://www.esri.com" target="_blank" rel="noopener">
            Esri World Imagery
          </a>
        </li>
      </ul>
      <h4>Contribute</h4>
      <ul>
        <li class="contribute-note">
          This project is open source and welcomes contributors of all kinds.
        </li>
        <li>
          <a href="https://github.com/dmxsan/mapping-the-nakba" target="_blank" rel="noopener">
            GitHub Repository
          </a>
          — report issues, suggest features, submit PRs
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface MapLayer {
  id: string
  name: string
  year: number
  url: string
  visible: boolean
  opacity: number
  years?: number[]
  selectedYear?: number
  fillColor?: string
  group?: string
  groupLabel?: string
  colorMatch?: Record<string, string>
}

interface Props {
  layers: MapLayer[]
  borders?: MapLayer[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'toggle', layer: MapLayer): void
  (e: 'opacity', layer: MapLayer): void
  (e: 'yearchange', layerId: string, year: number): void
  (e: 'toggleBorder', layer: MapLayer): void
  (e: 'reset'): void
}>()

const defaultLayers = ref<MapLayer[]>(JSON.parse(JSON.stringify(props.layers)))
const defaultBorders = ref<MapLayer[]>(JSON.parse(JSON.stringify(props.borders || [])))
const isHistorical = computed(() => props.layers.some(l => l.id === 'pom-historical'))

const visibleLayers = computed(() => {
  return props.layers.filter(l => l.visible).length
})

const visibleBorders = computed(() => {
  return (props.borders || []).filter(b => b.visible).length
})

const bordersExpanded = ref(true)

const totalVisible = computed(() => {
  return visibleLayers.value + visibleBorders.value
})

const totalLayers = computed(() => {
  return props.layers.length + (props.borders ? props.borders.length : 0)
})

const groupedBorderEntries = computed(() => {
  const items = props.borders || []
  const result: (MapLayer & { _isGroupLabel?: boolean })[] = []
  const annexationItems = items.filter(b => b.group === 'israel-annexations')
  const otherItems = items.filter(b => !b.group)

  // Palestine Border (current) always first
  const currentBorder = otherItems.find(b => b.id === 'border-palestine-current')
  const remainingOthers = otherItems.filter(b => b.id !== 'border-palestine-current')

  if (currentBorder) {
    result.push({ ...currentBorder, _isGroupLabel: false })
  }

  if (annexationItems.length) {
    result.push({
      id: 'group-annexations-label',
      name: '',
      year: 0,
      url: '',
      visible: true,
      opacity: 0,
      fillColor: '#AD1457',
      groupLabel: 'Israel Occupations',
      _isGroupLabel: true
    })
    annexationItems.forEach(b => result.push({ ...b, _isGroupLabel: false }))
  }
  remainingOthers.forEach(b => result.push({ ...b, _isGroupLabel: false }))
  return result
})

const getSourceName = (layer: MapLayer): string => {
  if (layer.id.includes('pom')) return 'POM'
  if (layer.id.includes('carto')) return 'CARTO'
  if (layer.id.includes('esri')) return 'Esri'
  return ''
}

const toggleLayer = (layer: MapLayer) => {
  layer.visible = !layer.visible
  emit('toggle', layer)
}

const updateOpacity = (layer: MapLayer) => {
  emit('opacity', layer)
}

const selectYear = (layer: MapLayer, year: number) => {
  layer.selectedYear = year
  emit('yearchange', layer.id, year)
}

const showAllLayers = () => {
  props.layers.forEach(layer => {
    if (!layer.visible) {
      layer.visible = true
      emit('toggle', layer)
    }
  })
  ;(props.borders || []).forEach(b => {
    if (!b.visible) {
      b.visible = true
      emit('toggleBorder', b)
    }
  })
}

const hideAllLayers = () => {
  props.layers.forEach(layer => {
    if (layer.visible) {
      layer.visible = false
      emit('toggle', layer)
    }
  })
  ;(props.borders || []).forEach(b => {
    if (b.visible) {
      b.visible = false
      emit('toggleBorder', b)
    }
  })
}

const resetLayers = () => {
  props.layers.forEach((layer, index) => {
    if (defaultLayers.value[index]) {
      layer.visible = defaultLayers.value[index].visible
      layer.opacity = defaultLayers.value[index].opacity
      layer.selectedYear = defaultLayers.value[index].selectedYear
      emit('toggle', layer)
    }
  })
  ;(props.borders || []).forEach((b, index) => {
    if (defaultBorders.value[index]) {
      b.visible = defaultBorders.value[index].visible
      emit('toggleBorder', b)
    }
  })
  emit('reset')
}

const annexationItems = computed(() => {
  return (props.borders || []).filter(b => b.group === 'israel-annexations')
})

const allAnnexationsActive = computed(() => {
  const items = annexationItems.value
  return items.length > 0 && items.every(b => b.visible)
})

const toggleBorderLayer = (border: MapLayer) => {
  border.visible = !border.visible
  emit('toggleBorder', border)
}

const toggleAnnexations = () => {
  const newState = !allAnnexationsActive.value
  annexationItems.value.forEach(b => {
    if (b.visible !== newState) {
      b.visible = newState
      emit('toggleBorder', b)
    }
  })
}

const toggleBordersExpanded = () => {
  bordersExpanded.value = !bordersExpanded.value
}
</script>

<style scoped>
.layer-control-container {
  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  font-family: system-ui, -apple-system, sans-serif;
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.layer-header h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
}

.layer-count {
  font-size: 0.75rem;
  color: #888;
  background: #f5f5f5;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.layers-list {
  flex: 1;
  overflow-y: auto;
}

.layer-item {
  padding: 14px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  margin-bottom: 10px;
  transition: all 0.2s ease;
}

.layer-item:hover {
  border-color: #1976D2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}

.layer-item.active {
  background: #f8f9fa;
  border-color: #1976D2;
}

.layer-toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 8px;
}

.layer-toggle input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.layer-toggle input:checked + .checkmark {
  background: #1976D2;
  border-color: #1976D2;
}

.layer-toggle input:checked + .checkmark::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.layer-info {
  margin-bottom: 4px;
}

.layer-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.layer-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.layer-year {
  font-size: 0.7rem;
  color: #1976D2;
  background: #E3F2FD;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.layer-source {
  font-size: 0.75rem;
  color: #999;
}

.layer-controls {
  margin-top: 8px;
}

.control-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.8rem;
  color: #666;
}

.control-value {
  font-weight: 600;
  color: #1976D2;
  font-size: 0.75rem;
}

.year-control {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e8e8e8;
}

.year-segmented {
  display: flex;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  overflow: hidden;
}

.year-segment {
  flex: 1;
  padding: 5px 0;
  text-align: center;
  border: none;
  background: white;
  color: #666;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border-right: 1px solid #e0e0e0;
  font-family: inherit;
}

.year-segment:last-child {
  border-right: none;
}

.year-segment:hover {
  background: #E3F2FD;
  color: #1976D2;
}

.year-segment.selected {
  background: #1976D2;
  color: white;
}

.opacity-control {
  padding-top: 0;
}

.opacity-slider {
  width: 100%;
  height: 4px;
  background: #e8e8e8;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.opacity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: #1976D2;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

.opacity-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.layer-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

.action-btn {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f5f5f5;
  border-color: #1976D2;
  color: #1976D2;
}

.source-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

.source-info h4 {
  margin: 0 0 6px 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  font-weight: 600;
}

.source-info ul {
  margin: 0 0 10px 0;
  padding: 0;
  list-style: none;
}

.source-info li {
  margin-bottom: 4px;
  font-size: 0.8rem;
  color: #666;
}

.source-info .contribute-note {
  font-style: italic;
  color: #888;
  font-size: 0.75rem;
  margin-bottom: 6px;
  line-height: 1.4;
}

.source-info a {
  color: #1976D2;
  text-decoration: none;
  transition: color 0.2s ease;
}

.source-info a:hover {
  color: #1565C0;
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .layer-control-container {
    padding: 6px 8px;
  }
  .border-section {
    padding: 20px;
    border-top: 1px solid #e0e0e0;
  }
}

/* Border group items — inside scoped to ensure Vite picks them up */
.border-group-item .layer-info {
  cursor: pointer;
}

.border-group-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.collapse-arrow {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 8px;
  position: relative;
  transition: transform 0.2s ease;
}

.collapse-arrow::before {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  border: solid #999;
  border-width: 2px 2px 0 0;
  transform: rotate(45deg);
  transition: transform 0.2s ease;
  position: relative;
  top: -1px;
}

.collapse-arrow.expanded::before {
  transform: rotate(135deg);
  top: 2px;
}

.border-group-item.expanded {
  background: #f8f9fa;
  border-color: #1976D2;
}

.border-sub-items {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #e0e0e0;
}

.border-group-label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.82rem;
}

.border-sub-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  background: #ffffff;
}

.border-sub-item:hover {
  border-color: #1976D2;
  background: #f8faff;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.08);
}

.border-sub-item:last-child {
  margin-bottom: 0;
}

.border-sub-item.active {
  background: #EFF6FF;
  border-color: #1976D2;
  box-shadow: 0 1px 4px rgba(25, 118, 210, 0.12);
}

.border-sub-item--nested {
  margin-left: 28px;
}

.border-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 24px;
  flex-shrink: 0;
}

.border-checkbox input {
  display: none;
}

.border-checkmark {
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-radius: 3px;
  position: relative;
  transition: all 0.2s ease;
  display: block;
}

.border-checkbox input:checked + .border-checkmark {
  background: #1976D2;
  border-color: #1976D2;
}

.border-checkbox input:checked + .border-checkmark::after {
  content: '';
  position: absolute;
  top: 1px;
  left: 4px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.border-sub-item.active .border-checkmark {
  border-color: #1976D2;
}

.border-sub-name {
  flex: 1;
  font-size: 0.82rem;
  color: #333;
  font-weight: 500;
}

.border-sub-item.active .border-sub-name {
  color: #1a1a1a;
  font-weight: 600;
}
</style>

