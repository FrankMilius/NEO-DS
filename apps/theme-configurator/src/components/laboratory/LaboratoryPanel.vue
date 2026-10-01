<template>
  <main class="laboratory-panel" :class="{ 'laboratory-panel--fullscreen': isFullscreen }">

    <div class="lab-header">
      <div class="lab-header__row">
        <h2 class="lab-title">
          Theme Arena
          <span v-if="activeArenaLabel" class="lab-breadcrumb-sep">/</span>
          <span v-if="activeArenaLabel" class="lab-breadcrumb-leaf">{{ activeArenaLabel }}</span>
        </h2>
        <!-- Theme Segmented Control (nur bei Komponenten-Sektionen) -->
        <div v-if="isComponentSection || isGridSection || hasSemanticCategory" class="theme-segmented" role="radiogroup" aria-label="Theme mode">
          <button
            :class="['seg-btn', { active: store.state.previewMode === 'light' }]"
            @click="store.setPreviewMode('light')"
            aria-label="Light mode"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>
            </svg>
          </button>
          <button
            :class="['seg-btn', { active: store.state.previewMode === 'dark' }]"
            @click="store.setPreviewMode('dark')"
            aria-label="Dark mode"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          </button>
          <button
            :class="['seg-btn', { active: store.state.previewMode === 'split' }]"
            @click="store.setPreviewMode('split')"
            aria-label="Split view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/>
            </svg>
          </button>
          <button
            :class="['seg-btn', { active: store.state.previewMode === 'matrix' }]"
            @click="store.setPreviewMode('matrix')"
            aria-label="4-Theme Matrix"
            title="Alle 4 Themes gleichzeitig"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/><path d="M3 12h18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Recipe Filterbar (nur bei Komponenten-Sektionen mit Filtern) -->
    <ArenaFilterbar v-if="isComponentSection && hasFilterOptions" :filters="filterOptions" />

    <div class="lab-viewport" :style="viewportStyle" :class="viewportClass">

      <div class="lab-viewport-inner" ref="labViewportRef">

        <!-- Sektion → Komponente aus der Registry (src/navigation/sektionen.js) -->
        <component :is="sektion.labor" />

      </div><!-- /.lab-viewport-inner -->
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { sektionAufloesen } from '../../navigation/sektionen.js'
import ArenaFilterbar from './ArenaFilterbar.vue'
import { extractFiltersFromRecipe } from '../../composables/useArenaFilters.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'
import { useSpecimenClick } from '../../composables/useSpecimenClick.js'

const store = useThemeStore()
const labViewportRef = ref(null)

// ---------------------------------------------------------------------------
// Sektion → Labor-Komponente und Breadcrumb-Label (Plan v2, 3.4)
// ---------------------------------------------------------------------------
const sektion = computed(() => sektionAufloesen(store.state.activeSection))
const activeArenaLabel = computed(() => sektion.value.label)

// Kopfzeile: Theme-Umschalter nur bei Komponenten, Grid und Semantic-Farben
const isColorsSection = computed(() => store.state.activeSection === 'foundation-colors')

const isColorSemanticTab = computed(() => isColorsSection.value && store.state.colorActiveTab === 'semantic')

const semanticCategory = computed(() => store.state.semanticCategory)

const hasSemanticCategory = computed(() => isColorSemanticTab.value && semanticCategory.value !== null)

const isGridSection = computed(() =>
  store.state.activeSection === 'foundation-grid' || store.state.activeSection === 'component-grid'
)

const isComponentSection = computed(() => store.state.activeSection.startsWith('component-'))

const activeComponentId = computed(() => store.state.activeSection.replace('component-', ''))

// ---------------------------------------------------------------------------
// Recipe Filterbar — extrahiert Filteroptionen aus Recipe-Daten
// ---------------------------------------------------------------------------
const { recipe: activeRecipe } = useRecipeLoader(activeComponentId)

// Specimen-Click Delegation: Klicks auf .arena-specimen -> Inspector-Filter
useSpecimenClick(labViewportRef, activeComponentId, activeRecipe)

const filterOptions = computed(() => {
  if (!activeRecipe.value) return {}
  return extractFiltersFromRecipe(activeRecipe.value)
})

const hasFilterOptions = computed(() => {
  const f = filterOptions.value
  return Object.values(f).some(arr => arr && arr.length > 0)
})

// ---------------------------------------------------------------------------
// (Resize handle removed — Arena now fills available space via flex: 1)
onUnmounted(() => {
  document.removeEventListener('keydown', onEscKey)
})

// ---------------------------------------------------------------------------
// Fullscreen & Breakpoint Steuerung
// ---------------------------------------------------------------------------
const isFullscreen = ref(false)
const activeBreakpoint = ref('lg') // Default: LG breakpoint

// Bei Arena-Wechsel Breakpoint auf LG zuruecksetzen
watch(() => store.state.activeSection, () => {
  activeBreakpoint.value = 'lg'
})

const BREAKPOINTS = [
  { key: 'xs',  label: 'XS',  width: 480 },
  { key: 'sm',  label: 'SM',  width: 768 },
  { key: 'md',  label: 'MD',  width: 960 },
  { key: 'lg',  label: 'LG',  width: 1200 },
  { key: 'xl',  label: 'XL',  width: 1600 },
  { key: 'xxl', label: 'XXL', width: 1920 },
]

function onEscKey(e) {
  if (e.key === 'Escape') isFullscreen.value = false
}

watch(isFullscreen, (val) => {
  if (val) document.addEventListener('keydown', onEscKey)
  else document.removeEventListener('keydown', onEscKey)
})

const viewportStyle = computed(() => {
  // Viewport bleibt immer neutral — Theme-Wechsel nur in den arena-specimen Panels
  const base = { background: 'var(--cfg-bg)', color: 'var(--cfg-text)' }
  base['--arena-label-bg'] = '#555555'
  if (activeBreakpoint.value !== null) {
    const bp = BREAKPOINTS.find(b => b.key === activeBreakpoint.value)
    if (bp) base['--bp-max-width'] = bp.width + 'px'
  }
  return base
})

const viewportClass = computed(() => {
  const classes = []
  if (activeBreakpoint.value !== null) classes.push('lab-viewport--constrained')
  return classes
})
</script>

<style scoped>
.laboratory-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background: var(--cfg-surface);
  overflow-y: auto;
}

/* ── Vollbild-Modus ── */
.laboratory-panel--fullscreen {
  position: fixed;
  inset: 0;
  z-index: var(--cfg-z-modal);
  width: 100vw !important;
  min-width: 0 !important;
  border: none;
  animation: fs-enter var(--fnd-motion-duration-200) ease;
}

@keyframes fs-enter {
  from { opacity: 0.85; transform: scale(0.995); }
  to   { opacity: 1;    transform: scale(1); }
}

/* ── Lab Header ── */
.lab-header {
  display: flex;
  flex-direction: column;
  height: 60px;
  border-bottom: 1px solid var(--cfg-border);
  flex-shrink: 0;
}

.lab-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  gap: 8px;
  min-height: 44px;
}

/* ── Theme Segmented Control ── */
.theme-segmented {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--cfg-surface-elevated);
  border-radius: 10px;
  border: 1px solid var(--cfg-border);
  flex-shrink: 0;
}

.seg-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--cfg-text-muted);
  cursor: pointer;
  transition: all 150ms ease;
}

.seg-btn:hover {
  color: var(--cfg-text);
}

.seg-btn.active {
  background: var(--cfg-surface);
  color: var(--cfg-text);
  box-shadow: var(--cfg-shadow-sm);
}

.lab-title {
  display: flex;
  align-items: center;
  gap: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
  white-space: nowrap;
}

.lab-breadcrumb-sep {
  margin: 0 6px;
  font-weight: 400;
  color: var(--cfg-text-muted);
  opacity: 0.5;
}

.lab-breadcrumb-leaf {
  font-weight: 500;
  color: var(--cfg-text-muted);
}


/* ── Lab Viewport ── */
.lab-viewport {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  transition: background var(--fnd-motion-duration-200), color var(--fnd-motion-duration-200);
  overflow-y: auto;
}


/* ── Viewport Inner Wrapper ── */
.lab-viewport-inner {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.lab-viewport-inner--constrained {
  max-width: var(--bp-max-width, 100%);
  width: 100%;
  margin-inline: auto;
  box-shadow:
    -1px 0 0 var(--cfg-border),
     1px 0 0 var(--cfg-border);
}
</style>
