<template>
  <div id="cfg-inspector" tabindex="-1" class="inspector-panel" role="region" aria-label="Einstellungen" :style="{ width: panelWidth + 'px' }">
    <!-- Drag Handle -->
    <div
      class="inspector-resize-handle"
      role="separator"
      aria-orientation="vertical"
      aria-label="Breite der Einstellungen ändern (Pfeiltasten)"
      tabindex="0"
      :aria-valuenow="panelWidth"
      :aria-valuemin="MIN_WIDTH"
      :aria-valuemax="Math.max(MAX_WIDTH, panelWidth)"
      @mousedown="startResize"
      @keydown="resizeMitTastatur"
    ></div>

    <!-- Combined Header (mirrors lab-header layout) -->
    <div class="inspector-header">
      <div class="inspector-header__row">
        <h2 class="inspector-title">
          Einstellungen
          <span v-if="sectionTitle" class="inspector-breadcrumb-sep">&rsaquo;</span>
          <span v-if="sectionTitle" class="inspector-breadcrumb-leaf">{{ sectionTitle }}</span>
        </h2>
        <!-- UX-20: technische Namen (CSS-Variablen, Dateien) für die ganze App -->
        <label class="inspector-technik" title="CSS-Variablen und Dateinamen zeigen oder ausblenden">
          <input v-model="technik" type="checkbox" data-test="technische-namen" />
          Technische Namen zeigen
        </label>
        <!-- Info icon with tooltip -->
        <button
          v-if="sectionDesc"
          type="button"
          class="inspector-info-trigger cfg-knopf-reset"
          aria-label="Beschreibung des Bereichs"
          aria-describedby="cfg-inspector-info"
          @mouseenter="showInfoTooltip = true"
          @mouseleave="showInfoTooltip = false"
          @focus="showInfoTooltip = true"
          @blur="showInfoTooltip = false"
          @keydown.escape.stop="showInfoTooltip = false"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
          <transition name="tooltip-fade">
            <span v-show="showInfoTooltip" id="cfg-inspector-info" role="tooltip" class="inspector-info-tooltip">{{ sectionDesc }}</span>
          </transition>
        </button>
      </div>
      <!-- Component Meta Bar -->
      <div v-if="isComponentSection && currentComponentId !== 'grid'" class="inspector-meta-bar">
        <div class="inspector-meta-bar__left">
          <ComponentLockToggle :componentId="currentComponentId" :componentLabel="sectionTitle" />
        </div>
        <div class="inspector-meta-bar__right">
          <span class="inspector-meta-badge inspector-meta-badge--tier" title="Ebene 3: Werte dieser Komponente; sie verweisen auf Semantik (Ebene 2) und Grundfarben (Ebene 1)">Ebene <span class="inspector-meta-badge__value">L3</span></span>
          <span v-if="recipeVersion" class="inspector-meta-badge inspector-meta-badge--version">Version <span class="inspector-meta-badge__value">{{ recipeVersion }}</span></span>
        </div>
      </div>
      <!-- Variante NEO · Kunde (Begriffsliste E3) — im Drupal-Betrieb ausgeblendet:
           jedes Theme ist eine Abwandlung von NEO (Entscheidung Frank 14.10.2026) -->
      <div v-if="!drupalBetrieb && (isComponentSection || activeSection === 'foundation-colors')" class="theme-set-switcher" role="group" aria-label="Variante" title="Variante innerhalb dieses Themes. Weitere Kunden legen Sie als eigene Themes an.">
        <button
          type="button"
          :class="['tss-btn', { active: store.state.activeThemeSet === 'neo' }]"
          :aria-pressed="store.state.activeThemeSet === 'neo'"
          @click="store.setActiveThemeSet('neo')"
        >NEO</button>
        <button
          type="button"
          :class="['tss-btn', { active: store.state.activeThemeSet === 'customer' }]"
          :aria-pressed="store.state.activeThemeSet === 'customer'"
          @click="store.setActiveThemeSet('customer')"
        >Kunde</button>
        <button type="button" class="tss-copy-btn" @click="handleCopyTheme" :title="copyTitle" :aria-label="copyTitle">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </button>
        <span v-if="themeDiffCount > 0" class="tss-diff-badge" :title="themeDiffCount + ' Tokens unterscheiden sich zwischen NEO und Kunde'">{{ themeDiffCount }}</span>
      </div>

      <!-- Color Tabs (only for foundation-colors) -->
      <div v-if="activeSection === 'foundation-colors'" class="color-tabs" role="tablist" aria-label="Farbebene">
        <button
          type="button"
          :class="['color-tab', { active: store.state.colorActiveTab === 'primitives' }]"
          role="tab"
          :aria-selected="store.state.colorActiveTab === 'primitives' ? 'true' : 'false'"
          @click="zuPrimitive"
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
            <circle cx="7.5" cy="10.5" r="1" fill="currentColor" /><circle cx="12" cy="7.5" r="1" fill="currentColor" /><circle cx="16.5" cy="10.5" r="1" fill="currentColor" />
          </svg>
          <span>Grundfarben</span>
          <span class="tab-badge tier-1" title="Ebene 1: Grundfarben (Primitive)"><span aria-hidden="true">L1</span><span class="cfg-sr-only">, Ebene 1</span></span>
        </button>
        <button
          type="button"
          :class="['color-tab', { active: store.state.colorActiveTab === 'semantic' }]"
          role="tab"
          :aria-selected="store.state.colorActiveTab === 'semantic' ? 'true' : 'false'"
          @click="zuSemantic"
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3l4 7h-8z" /><circle cx="17" cy="17" r="3" /><rect x="4" y="14" width="6" height="6" rx="1" />
          </svg>
          <span>Farbrollen</span>
          <span class="tab-badge tier-2" title="Ebene 2: Bedeutungen wie Text oder Fläche (Semantik), verweisen auf Ebene 1"><span aria-hidden="true">L2</span><span class="cfg-sr-only">, Ebene 2</span></span>
        </button>
      </div>
    </div>

    <!-- Sektion → Inspector-Bloecke aus der Registry (src/navigation/sektionen.js) -->
    <!-- Drupal-Betrieb ohne Recht „bearbeiten“ (Plan v2, 2.6): Editoren gesperrt -->
    <fieldset v-if="inspectorBloecke.length && nurAnsicht" disabled class="inspector-nur-ansicht" data-test="inspector-nur-ansicht">
      <legend class="inspector-nur-ansicht__legende">{{ neoAnsicht ? 'NEO Design System – nur ansehen' : 'Nur Ansicht – Bearbeiten nicht erlaubt' }}</legend>
      <component
        v-for="(block, i) in inspectorBloecke"
        :key="sektion.schluessel + ':' + i"
        :is="block.komponente"
        v-bind="block.props"
      />
    </fieldset>
    <template v-else-if="inspectorBloecke.length">
      <component
        v-for="(block, i) in inspectorBloecke"
        :key="sektion.schluessel + ':' + i"
        :is="block.komponente"
        v-bind="block.props"
      />
    </template>

    <template v-else>
      <div class="empty-state">
        <p data-test="inspector-leer">Für diesen Bereich gibt es hier keine Einstellungen. Bearbeitet wird in der Bühne, oder Sie wählen links einen anderen Bereich.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { bestaetigen } from '../../composables/useBestaetigung.js'
import { useRecipeLoader } from '../../composables/useRecipeLoader.js'
import ComponentLockToggle from '../components/ComponentLockToggle.vue'
import { sektionAufloesen } from '../../navigation/sektionen.js'
import { BEREICHE, bereichsName } from '../../navigation/namen.js'
import { useTechnischeNamen } from '../../composables/useTechnischeNamen.js'
import { darf, speicher } from '../../speicher/index.js'
import { neoAnsicht } from '../../composables/neoAnsicht.js'

// Drupal-Betrieb ohne Recht „bearbeiten“: Editoren per <fieldset disabled> sperren
// Gesperrt ohne Recht „bearbeiten“ und beim Ansehen des NEO-Standards (15.10.2026)
const nurAnsicht = computed(() => speicher().art === 'drupal' && (!darf('bearbeiten') || neoAnsicht.value))

const store = useThemeStore()

// UX-48: Kategorie und offenes Token der Semantic-Ansicht beim Wechsel zu
// „Primitive“ merken und beim Zurückwechseln wiederherstellen
let semanticMerk = null
function zuPrimitive () {
  if (store.state.colorActiveTab === 'semantic') semanticMerk = { kategorie: store.state.semanticCategory, token: store.state.selectedToken }
  store.state.colorActiveTab = 'primitives'
  store.state.semanticCategory = null
  store.state.selectedToken = null
}
function zuSemantic () {
  if (store.state.colorActiveTab === 'semantic') return
  store.state.colorActiveTab = 'semantic'
  if (semanticMerk) {
    store.state.semanticCategory = semanticMerk.kategorie
    store.selectToken(semanticMerk.token)
  }
}
const activeSection = computed(() => store.state.activeSection)

// Sektion → Inspector-Bloecke (Plan v2, 3.4); leer = Hinweis im v-else-Zweig
const sektion = computed(() => sektionAufloesen(activeSection.value))
const technik = useTechnischeNamen()
const inspectorBloecke = computed(() => sektion.value.inspector)

// ---------------------------------------------------------------------------
// Theme-Set Switcher
// ---------------------------------------------------------------------------
const copyTitle = computed(() =>
  store.state.activeThemeSet === 'neo'
    ? 'Werte von NEO nach Kunde kopieren'
    : 'Werte von Kunde nach NEO kopieren'
)

const themeDiffCount = computed(() => {
  const diff = store.diffThemeSets('neo', 'customer')
  return diff.semantic.length + diff.component.length + diff.foundation.length
})

async function handleCopyTheme () {
  const from = store.state.activeThemeSet
  const to = from === 'neo' ? 'customer' : 'neo'
  const ok = await bestaetigen({
    titel: 'Token-Overrides kopieren?',
    text: `Alle Token-Overrides von „${from}“ nach „${to}“ kopieren?`,
    bestaetigenText: 'Kopieren'
  })
  if (ok) store.copyThemeOverrides(from, to)
}

// ---------------------------------------------------------------------------
// Resizable Panel
// ---------------------------------------------------------------------------
const MIN_WIDTH = 360
const DEFAULT_WIDTH = 600
const MAX_WIDTH = 1200
const panelWidth = ref(DEFAULT_WIDTH)

// Tastatur: Pfeil links = breiter, rechts = schmaler (Umschalt: 80 px), Pos1 = Standard
function resizeMitTastatur (e) {
  const schritt = e.shiftKey ? 80 : 20
  let neu = null
  if (e.key === 'ArrowLeft') neu = panelWidth.value + schritt
  else if (e.key === 'ArrowRight') neu = panelWidth.value - schritt
  else if (e.key === 'Home') neu = DEFAULT_WIDTH
  if (neu === null) return
  e.preventDefault()
  panelWidth.value = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, neu))
}
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

// Block 5e: Name und Kurzbeschreibung aus navigation/namen.js (eine Quelle)
const sectionMeta = Object.fromEntries(Object.entries(BEREICHE).map(([id, b]) => [id, { title: b.name, desc: b.info }]))

const sectionTitle = computed(() => {
  const meta = sectionMeta[activeSection.value]
  if (meta) return meta.title
  // Komponenten: ausgeschriebener Name (E5), sonst Label der Registry
  return bereichsName(activeSection.value) || sektion.value?.label || 'Einstellungen'
})
const sectionDesc = computed(() => sectionMeta[activeSection.value]?.desc || '')
const showInfoTooltip = ref(false)

// ---------------------------------------------------------------------------
// Component-specific meta (recipe version, tier, lock)
// ---------------------------------------------------------------------------
const isComponentSection = computed(() => activeSection.value.startsWith('component-'))
const drupalBetrieb = speicher().art === 'drupal'
const currentComponentId = computed(() => activeSection.value.replace('component-', ''))
const { recipe } = useRecipeLoader(currentComponentId)
const recipeVersion = computed(() => recipe.value?.meta?.version || null)
</script>

<style scoped>
.inspector-technik { display: inline-flex; align-items: center; gap: 6px; margin-left: auto; font-size: 12px; font-weight: 400; color: var(--cfg-text-secondary); cursor: pointer; white-space: nowrap; }

/* Plan v2, 2.6: Schreibschutz ohne eigenes Layout — die Bloecke bleiben
   direkte Kinder des Panels; die Legende ist nur fuer Screenreader. */
.inspector-nur-ansicht { display: contents; border: 0; margin: 0; padding: 0; min-width: 0; }
.inspector-nur-ansicht__legende {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
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
.inspector-resize-handle:active,
.inspector-resize-handle:focus-visible {
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
  box-shadow: var(--cfg-shadow-popover);
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
  background: var(--cfg-info-bg);
  color: var(--cfg-info-text);
}

.inspector-meta-badge--version .inspector-meta-badge__value {
  background: var(--cfg-info-bg);
  color: var(--cfg-info-text);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--cfg-text-muted);
  font-size: 14px;
}

/* ── Theme-Set Switcher ── */
.theme-set-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0 4px;
}
.tss-btn {
  padding: 4px 12px;
  border: 1px solid var(--cfg-border);
  background: transparent;
  color: var(--cfg-text-muted);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}
.tss-btn:first-child { border-radius: 4px 0 0 4px; border-right: none; }
.tss-btn:nth-child(2) { border-radius: 0 4px 4px 0; }
.tss-btn.active {
  background: var(--cfg-accent);
  color: var(--cfg-on-accent);
  border-color: var(--cfg-accent);
}
.tss-copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--cfg-border);
  background: transparent;
  color: var(--cfg-text-muted);
  border-radius: 4px;
  cursor: pointer;
  margin-left: 4px;
  transition: all 0.15s;
}
.tss-copy-btn:hover { color: var(--cfg-text); background: var(--cfg-hover); }
.tss-diff-badge {
  font-size: 9px;
  font-weight: 700;
  background: var(--cfg-warning, #f59e0b);
  /* dunkle Schrift: Weiss auf Warn-Gelb hatte 2,3:1 (Plan v2, 4.4) */
  color: #161816;
  padding: 1px 6px;
  border-radius: 8px;
  margin-left: 4px;
}

/* ── Color Tabs ── */
.color-tabs {
  display: flex;
  gap: 0;
  background: var(--cfg-surface-elevated);
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
  background: var(--cfg-processing-bg);
  color: var(--cfg-processing-text);
}

.tab-badge.tier-2 {
  background: var(--cfg-info-bg);
  color: var(--cfg-info-text); /* 5,9:1 statt 4,2:1 */
}
</style>
