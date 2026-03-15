<template>
  <div class="inspector-panel" :style="{ width: panelWidth + 'px' }">
    <!-- Drag Handle -->
    <div class="inspector-resize-handle" @mousedown="startResize"></div>

    <!-- Combined Header (mirrors lab-header layout) -->
    <div class="inspector-header">
      <div class="inspector-header__row">
        <h3 class="inspector-title">
          Inspector
          <span v-if="sectionTitle" class="inspector-breadcrumb-sep">&rsaquo;</span>
          <span v-if="sectionTitle" class="inspector-breadcrumb-leaf">{{ sectionTitle }}</span>
        </h3>
        <!-- Info icon with tooltip -->
        <span v-if="sectionDesc" class="inspector-info-trigger" @mouseenter="showInfoTooltip = true" @mouseleave="showInfoTooltip = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
          <transition name="tooltip-fade">
            <span v-if="showInfoTooltip" class="inspector-info-tooltip">{{ sectionDesc }}</span>
          </transition>
        </span>
      </div>
      <!-- Component Meta Bar -->
      <div v-if="isComponentSection && currentComponentId !== 'grid'" class="inspector-meta-bar">
        <div class="inspector-meta-bar__left">
          <ComponentLockToggle :componentId="currentComponentId" :componentLabel="sectionTitle" />
        </div>
        <div class="inspector-meta-bar__right">
          <span class="inspector-meta-badge inspector-meta-badge--tier">Level <span class="inspector-meta-badge__value">L3</span></span>
          <span v-if="recipeVersion" class="inspector-meta-badge inspector-meta-badge--version">Version <span class="inspector-meta-badge__value">{{ recipeVersion }}</span></span>
        </div>
      </div>
      <!-- Color Tabs (only for foundation-colors) -->
      <div v-if="activeSection === 'foundation-colors'" class="color-tabs">
        <button
          :class="['color-tab', { active: store.state.colorActiveTab === 'primitives' }]"
          @click="store.state.colorActiveTab = 'primitives'; store.state.semanticCategory = null; store.state.selectedToken = null"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
            <circle cx="7.5" cy="10.5" r="1" fill="currentColor" /><circle cx="12" cy="7.5" r="1" fill="currentColor" /><circle cx="16.5" cy="10.5" r="1" fill="currentColor" />
          </svg>
          <span>Primitive Colors</span>
          <span class="tab-badge tier-1">L1</span>
        </button>
        <button
          :class="['color-tab', { active: store.state.colorActiveTab === 'semantic' }]"
          @click="store.state.colorActiveTab = 'semantic'"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3l4 7h-8z" /><circle cx="17" cy="17" r="3" /><rect x="4" y="14" width="6" height="6" rx="1" />
          </svg>
          <span>Semantic Colors</span>
          <span class="tab-badge tier-2">L2</span>
        </button>
      </div>
    </div>

    <!-- Foundation: Colors -->
    <template v-if="activeSection === 'foundation-colors'">
      <FoundationColors />
    </template>

    <!-- Foundation: Grid -->
    <template v-else-if="activeSection === 'foundation-grid' || activeSection === 'component-grid'">
      <GridInspector />
    </template>

    <!-- Foundation: Surfaces -->
    <template v-else-if="activeSection === 'foundation-surfaces'">
      <SurfaceEditor />
    </template>

    <!-- Foundation: Radius -->
    <template v-else-if="activeSection === 'foundation-radius'">
      <FoundationGeneric category="radius" />
    </template>

    <!-- Foundation: Shadows -->
    <template v-else-if="activeSection === 'foundation-shadows'">
      <ShadowEditor />
    </template>

    <!-- Foundation: Spacing -->
    <template v-else-if="activeSection === 'foundation-spacing'">
      <FoundationGeneric category="spacing" />
    </template>

    <!-- Foundation: Typography -->
    <template v-else-if="activeSection === 'foundation-typography'">
      <TypographyEditor />
    </template>

    <!-- Foundation: Border -->
    <template v-else-if="activeSection === 'foundation-border'">
      <BorderEditor />
    </template>

    <!-- Foundation: Focus Ring -->
    <template v-else-if="activeSection === 'foundation-focus'">
      <FoundationGeneric category="focus" />
    </template>

    <!-- Foundation: Media Ratios -->
    <template v-else-if="activeSection === 'foundation-media'">
      <FoundationGeneric category="media" />
    </template>

    <!-- Foundation: Elements -->
    <template v-else-if="activeSection === 'foundation-elements'">
      <ElementsOverview />
    </template>

    <!-- Foundation: Themes -->
    <template v-else-if="activeSection === 'foundation-themes'">
      <ThemesOverview />
    </template>

    <!-- Foundation: Opacity, Z-Index & Motion -->
    <template v-else-if="activeSection === 'foundation-opacity'">
      <FoundationGeneric category="opacity" sectionLabel="Opacity" />
      <FoundationGeneric category="zindex" sectionLabel="Z-Index" />
      <FoundationGeneric category="motion" sectionLabel="Motion" />
    </template>

    <!-- Foundation: Motion (fallback) -->
    <template v-else-if="activeSection === 'foundation-motion'">
      <FoundationGeneric category="motion" />
    </template>

    <!-- Component sections -->
    <template v-else-if="activeSection.startsWith('component-')">
      <ComponentEditor :componentId="activeSection.replace('component-', '')" />
    </template>

    <!-- Module sections -->
    <template v-else-if="activeSection.startsWith('module-')">
      <ModulePlaceholder :moduleId="activeSection.replace('module-', '')" />
    </template>

    <!-- Template sections -->
    <template v-else-if="activeSection.startsWith('template-')">
      <TemplatePlaceholder :templateId="activeSection.replace('template-', '')" />
    </template>

    <template v-else>
      <div class="empty-state">
        <p>Select a section from the sidebar to begin editing.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups } from '../../data/tokens.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'
import ComponentLockToggle from '../components/ComponentLockToggle.vue'
import FoundationColors from '../foundation/FoundationColors.vue'
import SurfaceEditor from '../foundation/SurfaceEditor.vue'
import ShadowEditor from '../foundation/ShadowEditor.vue'
import TypographyEditor from '../foundation/TypographyEditor.vue'
import FoundationGeneric from '../foundation/FoundationGeneric.vue'
import GridInspector from '../foundation/GridInspector.vue'
import BorderEditor from '../foundation/BorderEditor.vue'
import ElementsOverview from '../foundation/ElementsOverview.vue'
import ThemesOverview from '../foundation/ThemesOverview.vue'
import ComponentEditor from '../components/ComponentEditor.vue'
import ModulePlaceholder from '../templates/ModulePlaceholder.vue'
import TemplatePlaceholder from '../templates/TemplatePlaceholder.vue'

const store = useThemeStore()
const activeSection = computed(() => store.state.activeSection)

// ---------------------------------------------------------------------------
// Resizable Panel
// ---------------------------------------------------------------------------
const MIN_WIDTH = 360
const DEFAULT_WIDTH = 600
const panelWidth = ref(DEFAULT_WIDTH)
let resizing = false
let startX = 0
let startWidth = 0

function startResize(e) {
  resizing = true
  startX = e.clientX
  startWidth = panelWidth.value
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

function onResize(e) {
  if (!resizing) return
  // Dragging left = larger panel (since panel is on the right)
  const delta = startX - e.clientX
  panelWidth.value = Math.max(MIN_WIDTH, startWidth + delta)
}

function stopResize() {
  resizing = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})

const sectionMeta = {
  'foundation-colors': { title: 'Colors', desc: 'Define primitive color palettes, then map them to semantic tokens across all themes.' },
  'foundation-grid': { title: 'Grid Tokens', desc: '12-Column Grid: Spaltenanzahl, Gap-Varianten und responsive Breakpoints.' },
  'foundation-surfaces': { title: 'Surfaces', desc: 'Define Surface 01 through Surface 03 for light and dark modes (Carbon layer model).' },
  'foundation-radius': { title: 'Border Radius', desc: 'Corner radius scale from sharp to pill.' },
  'foundation-shadows': { title: 'Shadows & Elevation', desc: 'Box shadow levels and semantic elevation mapping.' },
  'foundation-spacing': { title: 'Spacing', desc: 'Spacing scale based on 4px base unit. Steps 06+ are fluid.' },
  'foundation-typography': { title: 'Typography', desc: 'Font families, weight scale, and size system.' },
  'foundation-border': { title: 'Border', desc: 'Border-Width-Skala und Border-Styles.' },
  'foundation-focus': { title: 'Focus Ring', desc: 'Focus-Ring-Tokens: Farbe, Breite, Offset (aussen), Inset (innen) und Style.' },
  'foundation-media': { title: 'Media Ratios', desc: 'Seitenverhaeltnisse fuer Bilder, Videos und Embeds: 1:1, 4:3, 16:9, Auto und weitere.' },
  'foundation-elements': { title: 'Elements', desc: 'HTML-Element-Defaults: Body, Headings, Links, Buttons, Forms.' },
  'foundation-themes': { title: 'Themes', desc: '4-Theme-System: Neo Light/Dark + Customer Light/Dark.' },
  'foundation-opacity': { title: 'Opacity, Z-Index & Motion', desc: 'Opacity-Werte, Z-Index-Schichten und Motion-Tokens.' },
  'foundation-motion': { title: 'Motion', desc: 'Easing curves and duration tokens.' },
  'component-button': { title: 'Button Tokens', desc: 'Button geometry, colors, and variant tokens.' },
  'component-input': { title: 'Input Tokens', desc: 'Input field geometry, colors, and state tokens.' },
  'component-badge': { title: 'Badge Tokens', desc: 'Badge size, color, and variant tokens.' },
  'component-card': { title: 'Card Tokens', desc: 'Card container tokens and states.' },
  'component-switch': { title: 'Switch Tokens', desc: 'Toggle switch geometry and color tokens.' },
  'component-avatar': { title: 'Avatar Tokens', desc: 'Avatar size scale and color tokens.' },
  'component-code-snippet': { title: 'Code Snippet Tokens', desc: 'Inline and block code display with syntax highlighting tokens.' },
  'component-fieldset': { title: 'Fieldset Tokens', desc: 'Fieldset v2.0.0: Formular-Gruppenrahmen mit Legend, Helper-Text, Card-Variante, Density-Achse (Compact/Default/Loose) und Required-Indikator.' },
  'component-pagination': { title: 'Pagination Tokens', desc: 'Pagination v2.0.0: Seitennavigation mit Item-Stil (Raised/Outline), Active-Indikator, Minimal-Variante, Jumper (Go-to-Page) und Touch-Target-Konfiguration.' },
  'component-metric': { title: 'Metric Tokens', desc: 'Metric v2.0.0: KPI Big-Number Anzeige. 2 Emphasis (Solid/Subtle), 3 Sizes (MD/LG/XL), Trend-Indikator (Up/Down/Neutral mit Success/Danger-Farben), Label-Slot, Unit-Slot, Footer (Vergleichszeitraum). Dashboard- und Hero-Varianten.' },
  'component-shell': { title: 'Shell Tokens', desc: 'Shell-Layout: Linkbar, Sidebars, Footerbar und Content-Bereich.' },
  'component-dialog': { title: 'Dialog Tokens', desc: 'Modal dialog tokens.' },
  'component-tooltip': { title: 'Tooltip Tokens', desc: 'Tooltip appearance tokens.' },
  'module-header': { title: 'Header Module', desc: 'Navigation header layout and tokens.' },
  'module-sidebar': { title: 'Sidebar Module', desc: 'Sidebar navigation tokens.' },
  'module-card-group': { title: 'Card Groups', desc: 'Card group layout and grid tokens.' },
  'template-hero': { title: 'Hero Template', desc: 'Full-width hero landing page template.' },
  'template-dashboard': { title: 'Dashboard Template', desc: 'Multi-panel dashboard layout template.' },
  'template-content': { title: 'Content Page Template', desc: 'Article/content layout with sidebar.' },
  'template-form': { title: 'Form Page Template', desc: 'Multi-section form layout template.' },
  'template-settings': { title: 'Settings Page Template', desc: 'Settings page with navigation template.' },
  'template-error': { title: 'Error Page Template', desc: 'Error state page template.' }
}

const sectionTitle = computed(() => {
  const meta = sectionMeta[activeSection.value]
  if (meta) return meta.title
  // Fallback fuer Komponenten ohne expliziten Eintrag: Label aus Token-Registry + "Tokens"
  if (activeSection.value.startsWith('component-')) {
    const id = activeSection.value.replace('component-', '')
    const group = componentTokenGroups.find(g => g.id === id)
    if (group) return `${group.label} Tokens`
    // Capitalize component id as last resort
    return `${id.charAt(0).toUpperCase() + id.slice(1)} Tokens`
  }
  return 'Inspector'
})
const sectionDesc = computed(() => sectionMeta[activeSection.value]?.desc || '')
const showInfoTooltip = ref(false)

// ---------------------------------------------------------------------------
// Component-specific meta (recipe version, tier, lock)
// ---------------------------------------------------------------------------
const isComponentSection = computed(() => activeSection.value.startsWith('component-'))
const currentComponentId = computed(() => activeSection.value.replace('component-', ''))
const { recipe } = useRecipeLoader(currentComponentId)
const recipeVersion = computed(() => recipe.value?.meta?.version || null)
</script>

<style scoped>
.inspector-panel {
  position: relative;
  min-width: 360px;
  flex-shrink: 0;
  padding: 0 24px 24px;
  overflow-y: auto;
  background: var(--fnd-color-background-base, #fff);
  border-left: 1px solid var(--cfg-border);
}

.inspector-resize-handle {
  position: absolute;
  top: 0;
  left: -3px;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
}

.inspector-resize-handle:hover,
.inspector-resize-handle:active {
  background: var(--cfg-accent, #7c3aed);
  opacity: 0.3;
}

/* ── Combined Header (mirrors lab-header) ── */
.inspector-header {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--cfg-border);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--fnd-color-background-base, #fff);
  height: auto;
  margin: 0 -24px 20px;
  padding: 0;
}

.inspector-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 16px;
  gap: 8px;
  border-bottom: 1px solid var(--cfg-border);
}

.inspector-title {
  display: flex;
  align-items: center;
  gap: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
  white-space: nowrap;
}

.inspector-breadcrumb-sep {
  margin: 0 6px;
  font-weight: 400;
  color: var(--cfg-text-muted);
  opacity: 0.5;
}

.inspector-breadcrumb-leaf {
  font-weight: 500;
  color: var(--cfg-text-muted);
}

/* ── Info Icon & Tooltip ── */
.inspector-info-trigger {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--cfg-text-muted);
  cursor: default;
  margin-left: 4px;
  flex-shrink: 0;
}

.inspector-info-trigger:hover {
  color: var(--cfg-text);
}

.inspector-info-tooltip {
  position: absolute;
  top: calc(100% + 8px);
  right: -8px;
  background: var(--cfg-surface-elevated, #1a1a2e);
  color: var(--cfg-text, #fff);
  font-size: 11px;
  font-weight: 400;
  line-height: 1.4;
  padding: 6px 10px;
  border-radius: 6px;
  white-space: normal;
  max-width: 280px;
  min-width: 160px;
  z-index: 20;
  pointer-events: none;
  box-shadow: 0 4px 12px color-mix(in srgb, #000 15%, transparent);
  border: 1px solid var(--cfg-border);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.15s;
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}

/* ── Component Meta Bar ── */
.inspector-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 24px;
  gap: 8px;
  border-top: 1px solid var(--cfg-border);
}

.inspector-meta-bar__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inspector-meta-bar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.inspector-meta-badge {
  font-size: 11px;
  font-weight: 500;
  color: var(--cfg-text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}

.inspector-meta-badge__value {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.inspector-meta-badge--tier .inspector-meta-badge__value {
  background: #dbeafe;
  color: #1d4ed8;
}

.inspector-meta-badge--version .inspector-meta-badge__value {
  background: #dbeafe;
  color: #1d4ed8;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--cfg-text-muted);
  font-size: 14px;
}

/* ── Color Tabs ── */
.color-tabs {
  display: flex;
  gap: 0;
  background: #ffffff;
  padding: 0 16px;
  border-bottom: 0;
}

.color-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: none;
  background: none;
  color: var(--cfg-text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: color var(--fnd-motion-duration-150);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.color-tab:hover {
  color: var(--cfg-text);
}

.color-tab.active {
  color: var(--cfg-accent);
  border-bottom-color: var(--cfg-accent);
}

.color-tab svg {
  opacity: 0.6;
}

.color-tab.active svg {
  opacity: 1;
}

.tab-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  letter-spacing: 0.5px;
}

.tab-badge.tier-1 {
  background: #ede9fe;
  color: #7c3aed;
}

.tab-badge.tier-2 {
  background: #dbeafe;
  color: #2563eb;
}
</style>
