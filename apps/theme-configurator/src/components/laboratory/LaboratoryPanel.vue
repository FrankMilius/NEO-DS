<template>
  <main class="laboratory-panel" :class="{ 'laboratory-panel--fullscreen': isFullscreen }">

    <div class="lab-header">
      <div class="lab-header__row">
        <h2 class="lab-title">
          Theme Arena
          <span v-if="activeArenaLabel" class="lab-breadcrumb-sep">/</span>
          <span v-if="activeArenaLabel" class="lab-breadcrumb-leaf">{{ activeArenaLabel }}</span>
          <span v-if="istEntwurfAktiv" class="lab-entwurf" data-test="entwurf" :title="ENTWURF_HINWEIS">Entwurf</span>
        </h2>
        <!-- Theme Segmented Control (nur bei Komponenten-Sektionen) -->
        <div v-if="isComponentSection || isGridSection || hasSemanticCategory" class="theme-segmented" role="radiogroup" aria-label="Vorschaumodus">
          <button
            :class="['seg-btn', { active: store.state.previewMode === 'light' }]"
            type="button"
            role="radio"
            :aria-checked="store.state.previewMode === 'light' ? 'true' : 'false'"
            @click="store.setPreviewMode('light')"
            aria-label="Hell"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>
            </svg>
          </button>
          <button
            :class="['seg-btn', { active: store.state.previewMode === 'dark' }]"
            type="button"
            role="radio"
            :aria-checked="store.state.previewMode === 'dark' ? 'true' : 'false'"
            @click="store.setPreviewMode('dark')"
            aria-label="Dunkel"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          </button>
          <button
            :class="['seg-btn', { active: store.state.previewMode === 'split' }]"
            type="button"
            role="radio"
            :aria-checked="store.state.previewMode === 'split' ? 'true' : 'false'"
            @click="store.setPreviewMode('split')"
            aria-label="Hell und Dunkel nebeneinander"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/>
            </svg>
          </button>
          <button
            :class="['seg-btn', { active: store.state.previewMode === 'matrix' }]"
            type="button"
            role="radio"
            :aria-checked="store.state.previewMode === 'matrix' ? 'true' : 'false'"
            @click="store.setPreviewMode('matrix')"
            aria-label="4-Theme Matrix"
            title="Alle 4 Themes gleichzeitig"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/><path d="M3 12h18"/>
            </svg>
          </button>
        </div>
        <!-- Roadmap V01: Fensterbreite der Vorschau und Vollbild -->
        <div class="lab-werkzeuge">
          <div v-if="isComponentSection" class="theme-segmented" role="radiogroup" aria-label="Breite der Vorschau" data-test="breiten-wahl">
            <button
              v-for="b in BREITEN"
              :key="b.key"
              :class="['seg-btn', 'seg-btn--text', { active: aktiveBreite === b.key }]"
              type="button"
              role="radio"
              :aria-checked="aktiveBreite === b.key ? 'true' : 'false'"
              :title="b.breite ? `${b.label}: ${b.breite} × ${b.hoehe} px` : 'Volle Breite der Bühne'"
              :data-test="`breite-${b.key}`"
              @click="aktiveBreite = b.key"
            >{{ b.label }}</button>
          </div>
          <button
            ref="vollbildKnopf"
            type="button"
            class="lab-vollbild"
            :aria-pressed="isFullscreen ? 'true' : 'false'"
            data-test="vollbild"
            @click="isFullscreen = !isFullscreen"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="!isFullscreen"><path d="M4 9V4h5"/><path d="M20 9V4h-5"/><path d="M4 15v5h5"/><path d="M20 15v5h-5"/></template>
              <template v-else><path d="M9 4v5H4"/><path d="M15 4v5h5"/><path d="M9 20v-5H4"/><path d="M15 20v-5h5"/></template>
            </svg>
            <span>{{ isFullscreen ? 'Vollbild beenden' : 'Vollbild' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Recipe Filterbar (nur bei Komponenten-Sektionen mit Filtern) -->
    <ArenaFilterbar v-if="isComponentSection && hasFilterOptions" :filters="filterOptions" />

    <!-- UX-46/UX-42: per Tastatur erreichbar und scrollbar (axe scrollable-region-focusable) -->
    <div id="cfg-buehne" class="lab-viewport" tabindex="0" role="region" aria-label="Bühne (Vorschau)" :style="viewportStyle">

      <div class="lab-viewport-inner" ref="labViewportRef">

        <!-- Sektion → Komponente aus der Registry (src/navigation/sektionen.js) -->
        <BreitenRahmen :breite="isComponentSection ? aktivesGeraet.breite : null" :hoehe="aktivesGeraet.hoehe || 800">
          <component :is="sektion.labor" />
        </BreitenRahmen>

      </div><!-- /.lab-viewport-inner -->
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { sektionAufloesen } from '../../navigation/sektionen.js'
import ArenaFilterbar from './ArenaFilterbar.vue'
import BreitenRahmen from './BreitenRahmen.vue'
import { extractFiltersFromRecipe } from '../../composables/useArenaFilters.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'
import { useSpecimenClick } from '../../composables/useSpecimenClick.js'
import { istEntwurf, ENTWURF_HINWEIS } from '../../data/recipe-entwuerfe.js'

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

// Nur Komponenten-Sektionen haben eine ID. Vorher lieferte replace() auf der
// Farbseite „foundation-colors“: Ein Klick auf ein Specimen markierte es dann,
// ohne dass der Inspector etwas damit anfing (Befund UX-31, 19.10.2026).
const activeComponentId = computed(() => {
  const s = store.state.activeSection || ''
  return s.startsWith('component-') ? s.slice('component-'.length) : ''
})

// ---------------------------------------------------------------------------
// Recipe Filterbar — extrahiert Filteroptionen aus Recipe-Daten
// ---------------------------------------------------------------------------
const { recipe: activeRecipe } = useRecipeLoader(activeComponentId)

// Specimen-Click Delegation: Klicks auf .arena-specimen -> Inspector-Filter
useSpecimenClick(labViewportRef, activeComponentId, activeRecipe)

// Kennzeichen „Entwurf" (Plan v3, Phase 4): Status aus dem geladenen Recipe,
// solange es laedt aus der Liste der Navigation
const istEntwurfAktiv = computed(() => {
  if (!isComponentSection.value) return false
  const status = activeRecipe.value?.meta?.status
  return status ? status === 'draft' : istEntwurf(activeComponentId.value)
})

const filterOptions = computed(() => {
  if (!activeRecipe.value) return {}
  return extractFiltersFromRecipe(activeRecipe.value)
})

const hasFilterOptions = computed(() => {
  const f = filterOptions.value
  return Object.values(f).some(arr => arr && arr.length > 0)
})

// ---------------------------------------------------------------------------
// Vollbild und Breite der Vorschau (Roadmap V01, 19.10.2026)
// ---------------------------------------------------------------------------
// Vorher standen hier ein Zustand fuer Vollbild und sechs Breakpoints ohne
// Bedienelement. Jetzt: Volle Breite · Desktop · Tablet · Handy; die festen
// Breiten rendert BreitenRahmen in einem eigenen Frame, damit die
// Medienabfragen des Design Systems greifen.
const BREITEN = Object.freeze([
  { key: 'voll', label: 'Voll', breite: null, hoehe: null },
  { key: 'desktop', label: 'Desktop', breite: 1280, hoehe: 800 },
  { key: 'tablet', label: 'Tablet', breite: 768, hoehe: 1024 },
  { key: 'handy', label: 'Handy', breite: 390, hoehe: 844 },
])
const aktiveBreite = ref('voll')
const aktivesGeraet = computed(() => BREITEN.find((b) => b.key === aktiveBreite.value) || BREITEN[0])

const isFullscreen = ref(false)
const vollbildKnopf = ref(null)

function onEscKey(e) {
  // Escape gehoert zuerst offenen Popups und Dialogen
  if (e.key !== 'Escape' || e.defaultPrevented) return
  if (document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]')) return
  isFullscreen.value = false
}

watch(isFullscreen, (val, alt) => {
  if (val) document.addEventListener('keydown', onEscKey)
  else document.removeEventListener('keydown', onEscKey)
  // Fokus bleibt am Knopf (er wandert mit dem Panel)
  if (val !== alt) nextTick(() => vollbildKnopf.value?.focus())
})

onUnmounted(() => {
  document.removeEventListener('keydown', onEscKey)
})

const viewportStyle = computed(() => ({
  // Viewport bleibt immer neutral — Theme-Wechsel nur in den arena-specimen Panels
  background: 'var(--cfg-bg)',
  color: 'var(--cfg-text)',
  '--arena-label-bg': 'color-mix(in srgb, var(--cfg-text) 7%, transparent)',
}))
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
  min-height: 60px;
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
  flex-wrap: wrap;
}

/* ── Breite und Vollbild (V01) ── */
.lab-werkzeuge {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.seg-btn.seg-btn--text {
  width: auto;
  padding-inline: 10px;
  font-size: 12px;
  font-weight: 600;
  /* Text statt Symbol: lesbarer Kontrast auch inaktiv */
  color: var(--cfg-text-secondary);
}

.seg-btn.seg-btn--text.active { color: var(--cfg-text); }

.lab-vollbild {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 4px 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.lab-vollbild:hover { border-color: var(--cfg-accent); }
.lab-vollbild[aria-pressed='true'] { border-color: var(--cfg-accent); color: var(--cfg-accent); }
.lab-vollbild:focus-visible { outline: 2px solid var(--cfg-accent); outline-offset: 2px; }

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

/* Recipe-Status draft (Plan v3, Phase 4) */
.lab-entwurf {
  margin-left: 8px;
  padding: 1px 8px;
  border: 1px dashed currentColor;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  vertical-align: middle;
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

</style>
