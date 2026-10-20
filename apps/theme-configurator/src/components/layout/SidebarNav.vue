<template>
  <aside class="sidebar-nav" :class="{ 'sidebar-nav--collapsed': collapsed }">
    <!-- Collapse Toggle -->
    <button
      type="button"
      class="sidebar-collapse-btn"
      @click="$emit('toggle')"
      :title="collapsed ? 'Seitenleiste einblenden (Strg+B)' : 'Seitenleiste ausblenden (Strg+B)'"
      :aria-label="collapsed ? 'Seitenleiste einblenden' : 'Seitenleiste ausblenden'"
      :aria-expanded="!collapsed"
      aria-keyshortcuts="Control+B"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <template v-if="collapsed">
          <path d="M13 17l5-5-5-5"/><path d="M6 17l5-5-5-5"/>
        </template>
        <template v-else>
          <path d="M11 17l-5-5 5-5"/><path d="M18 17l-5-5 5-5"/>
        </template>
      </svg>
    </button>
    <!-- UX-56: eingeklappt eine Symbolleiste der Ebenen statt einer leeren Leiste;
         die Ebene mit dem aktiven Bereich ist markiert, ein Klick öffnet sie -->
    <nav v-if="collapsed" class="nav-leiste" aria-label="Ebenen" data-test="nav-leiste">
      <button
        v-for="g in navigationTree"
        :key="g.id"
        type="button"
        :class="['nav-leiste__knopf', { aktiv: enthaeltAktiv(g) }]"
        :aria-label="`${g.label} öffnen`"
        :aria-current="enthaeltAktiv(g) ? 'true' : undefined"
        :title="enthaeltAktiv(g) ? `${g.label} (aktueller Bereich: ${aktiverName})` : g.label"
        @click="oeffneEbene(g.id)"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path v-for="d in (EBENEN_SYMBOLE[g.id] || EBENEN_SYMBOLE.standard)" :key="d" :d="d" />
        </svg>
      </button>
    </nav>

    <div v-if="!collapsed" class="sidebar-search">
      <svg aria-hidden="true" class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Bereich oder Token suchen …"
        aria-label="Bereiche und Tokens durchsuchen"
        aria-describedby="cfg-suche-stand"
        class="search-input"
        data-test="sidebar-suche"
        @keydown.escape.prevent="searchQuery = ''"
      />
    </div>
    <!-- UX-12: Ergebnis ansagen; ohne Treffer ein sichtbarer Hinweis -->
    <p v-if="!collapsed" id="cfg-suche-stand" class="cfg-sr-only" aria-live="polite">{{ suchStand }}</p>
    <p v-if="!collapsed && suche && trefferAnzahl === 0" class="sidebar-suche-leer" data-test="sidebar-suche-leer">
      Keine Treffer für „{{ suche }}“. Suche nach Bereichen (z. B. Button, Farbe) oder Token-Namen (z. B. radius, primary).
    </p>

    <nav v-if="!collapsed" class="nav-tree" aria-label="Sektionen">
      <div v-for="group in filteredTree" :key="group.id" class="nav-group">
        <button
          type="button"
          class="nav-group-header"
          @click="toggleGroup(group.id)"
          :aria-expanded="istOffen(group.id)"
          :aria-controls="istOffen(group.id) ? `cfg-nav-gruppe-${group.id}` : undefined"
        >
          <svg aria-hidden="true" class="nav-chevron" :class="{ expanded: istOffen(group.id) }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <span class="nav-group-label">{{ group.label }}</span>
          <span class="nav-group-count">{{ getItemCount(group) }}</span>
        </button>

        <div v-if="istOffen(group.id)" :id="`cfg-nav-gruppe-${group.id}`" class="nav-children">
          <template v-for="child in group.children" :key="child.id">
            <!-- Subgroup -->
            <div v-if="child.isSubgroup" class="nav-subgroup" role="group" :aria-labelledby="`cfg-nav-untergruppe-${group.id}-${child.id}`">
              <span :id="`cfg-nav-untergruppe-${group.id}-${child.id}`" class="nav-subgroup-label">{{ child.label }}</span>
              <div class="nav-subgroup-children">
                <button
                  v-for="item in child.children"
                  :key="item.id"
                  type="button"
                  :class="['nav-item', { active: store.state.activeSection === item.section, 'no-tokens': !hasTokens(item) }]"
                  :aria-current="store.state.activeSection === item.section ? 'page' : undefined"
                  @click="handleSelect(item)"
                >
                  <span class="nav-item-dot" :class="{ modified: isModified(item) }" v-if="hasTokens(item)"></span>
                  <span v-if="hasTokens(item) && isModified(item)" class="cfg-sr-only">(geändert)</span>
                  <span class="nav-item-dot empty" v-else></span>
                  <span class="nav-item-label">{{ item.label }}<span v-if="item.suchGrund" class="nav-item-grund">{{ item.suchGrund }}</span></span>
                  <span v-if="isItemLocked(item)" class="cfg-sr-only">(gesperrt)</span>
                  <svg aria-hidden="true" v-if="isItemLocked(item)" class="nav-lock-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span v-if="item.entwurf" class="nav-entwurf-badge" data-test="entwurf" :title="ENTWURF_HINWEIS">Entwurf</span>
                  <span v-if="getItemVersion(item)" class="nav-version-badge">{{ getItemVersion(item) }}</span>
                </button>
              </div>
            </div>
            <!-- Flat item -->
            <button
              v-else
              type="button"
              :class="['nav-item', { active: store.state.activeSection === child.section, 'no-tokens': !hasTokens(child) }]"
              :aria-current="store.state.activeSection === child.section ? 'page' : undefined"
              @click="handleSelect(child)"
            >
              <span class="nav-item-dot" :class="{ modified: isModified(child) }" v-if="hasTokens(child)"></span>
              <span v-if="hasTokens(child) && isModified(child)" class="cfg-sr-only">(geändert)</span>
              <span class="nav-item-dot empty" v-else></span>
              <span class="nav-item-label">{{ child.label }}<span v-if="child.suchGrund" class="nav-item-grund">{{ child.suchGrund }}</span></span>
              <span v-if="isItemLocked(child)" class="cfg-sr-only">(gesperrt)</span>
              <svg aria-hidden="true" v-if="isItemLocked(child)" class="nav-lock-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span v-if="child.entwurf" class="nav-entwurf-badge" data-test="entwurf" :title="ENTWURF_HINWEIS">Entwurf</span>
              <span v-if="getItemVersion(child)" class="nav-version-badge">{{ getItemVersion(child) }}</span>
            </button>
          </template>
        </div>
      </div>
    </nav>

    <div v-if="!collapsed" class="sidebar-footer">
      <button type="button" class="btn-reset" @click="handleReset">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        Auf NEO-Standard zurücksetzen
      </button>
      <!-- UX-20: Exportieren nur noch in der Kopfleiste (vorher doppelt) -->
    </div>
  </aside>
</template>

<script setup>
import { ENTWURF_HINWEIS } from '../../data/recipe-entwuerfe.js'
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { bestaetigen } from '../../composables/useBestaetigung.js'
import { navigationTree, componentTokenGroups, primitiveColors, semanticDefaults } from '../../data/tokens.js'
import { getDefaultFoundation } from '../../stores/theme/kern.js'
import { suchTreffer } from '../../navigation/sidebar-suche.js'
import { bereichsName } from '../../navigation/namen.js'

defineProps({
  collapsed: { type: Boolean, default: false }
})
const emit = defineEmits(['toggle'])

const SIDEBAR_STORAGE_KEY = 'neo-cfg-sidebar'

const store = useThemeStore()
const searchQuery = ref('')

// Expanded Groups aus localStorage wiederherstellen
const expandedGroups = ref(loadExpandedGroups())

function loadExpandedGroups() {
  try {
    const raw = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.expandedGroups) return new Set(data.expandedGroups)
    }
  } catch {}
  return new Set(['foundation', 'components'])
}

function saveSidebarState() {
  try {
    const navTree = document.querySelector('.nav-tree')
    const data = {
      expandedGroups: [...expandedGroups.value],
      scrollTop: navTree ? navTree.scrollTop : 0
    }
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

// Sicherstellen, dass die Gruppe der aktiven Sektion geoeffnet ist
function ensureActiveSectionGroupExpanded() {
  const section = store.state.activeSection
  for (const group of navigationTree) {
    const found = group.children.some(child => {
      if (child.isSubgroup) return child.children.some(item => item.section === section)
      return child.section === section
    })
    if (found && !expandedGroups.value.has(group.id)) {
      expandedGroups.value.add(group.id)
      expandedGroups.value = new Set(expandedGroups.value)
    }
  }
}

// Scroll-Position wiederherstellen + aktives Item sichtbar machen
onMounted(async () => {
  ensureActiveSectionGroupExpanded()
  await nextTick()
  const navTree = document.querySelector('.nav-tree')
  if (!navTree) return

  try {
    const raw = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (typeof data.scrollTop === 'number') {
        navTree.scrollTop = data.scrollTop
      }
    }
  } catch {}

  // Aktives Item in den sichtbaren Bereich scrollen
  await nextTick()
  const activeItem = navTree.querySelector('.nav-item.active')
  if (activeItem) {
    activeItem.scrollIntoView({ block: 'nearest' })
  }
})

// Sidebar-State bei Aenderungen speichern
watch(expandedGroups, () => saveSidebarState(), { deep: true })
watch(() => store.state.activeSection, () => {
  nextTick(() => saveSidebarState())
})

// Build a set of component IDs that have tokens defined
const _componentIdsWithTokens = new Set(
  componentTokenGroups.map(g => g.id)
)

/**
 * Count all leaf items in a group (including inside subgroups)
 */
function getItemCount(group) {
  let count = 0
  for (const child of group.children) {
    if (child.isSubgroup) {
      count += child.children.length
    } else {
      count++
    }
  }
  return count
}

/**
 * Check if a nav item has tokens defined in componentTokenGroups
 */
function hasTokens(item) {
  if (!item.section) return false
  // Foundation items always "have tokens" (they have editors)
  if (item.section.startsWith('foundation-')) return true
  // Component items: check against componentTokenGroups
  if (item.section.startsWith('component-')) {
    const componentId = item.section.replace('component-', '')
    return _componentIdsWithTokens.has(componentId)
  }
  // Templates, utilities, guides — show as available if they have a section
  return true
}

// UX-12: Namen, Tokens und deutsche Begriffe (navigation/sidebar-suche.js);
// Treffer tragen ihren Grund (suchGrund), Treffergruppen sind aufgeklappt.
const suche = computed(() => searchQuery.value.trim())
function mitGrund (item) {
  const t = suchTreffer(item, suche.value)
  return t ? (t.grund ? { ...item, suchGrund: t.grund } : item) : null
}
const filteredTree = computed(() => {
  if (!suche.value) return navigationTree

  return navigationTree
    .map(group => {
      const filteredChildren = group.children
        .map(child => {
          if (child.isSubgroup) {
            // Filter subgroup children
            const filteredSubChildren = child.children.map(mitGrund).filter(Boolean)
            if (filteredSubChildren.length === 0) return null
            return { ...child, children: filteredSubChildren }
          }
          // Flat child
          return mitGrund(child)
        })
        .filter(Boolean)

      if (filteredChildren.length === 0) return null
      return { ...group, children: filteredChildren }
    })
    .filter(Boolean)
})

const trefferAnzahl = computed(() => filteredTree.value.reduce((n, g) => n + g.children.reduce((m, c) => m + (c.isSubgroup ? c.children.length : 1), 0), 0))
const suchStand = computed(() => (suche.value ? (trefferAnzahl.value ? `${trefferAnzahl.value} Treffer` : 'Keine Treffer') : ''))
function istOffen (id) {
  return !!suche.value || expandedGroups.value.has(id)
}

function toggleGroup(id) {
  if (expandedGroups.value.has(id)) {
    expandedGroups.value.delete(id)
  } else {
    expandedGroups.value.add(id)
  }
  // Force reactivity
  expandedGroups.value = new Set(expandedGroups.value)
}

function handleSelect(child) {
  store.setActiveSection(child.section)
  store.selectToken(null)
}

// UX-29: auch Foundation-Bereiche als „geändert“ markieren (Vergleich mit
// dem Standard des Design Systems)
const FOUNDATION_KATEGORIEN = {
  spacing: ['spacing'], sizes: ['size'], typography: ['typography', 'tracking'], radius: ['radius'],
  border: ['border'], focus: ['focus'], media: ['media'], shadows: ['shadow', 'elevation'],
  'opacity-zindex-motion': ['opacity', 'zindex', 'motion'],
}
const STANDARD_FOUNDATION = getDefaultFoundation()
const gleich = (a, b) => JSON.stringify(a ?? {}) === JSON.stringify(b ?? {})
const farbenGeaendert = computed(() => {
  const set = store.state.activeThemeSet
  const prim = store.state.primitiveOverrides?.[set] || {}
  if (Object.entries(prim).some(([id, wert]) => primitiveColors[id]?.base && String(wert).toLowerCase() !== String(primitiveColors[id].base).toLowerCase())) return true
  return ['light', 'dark'].some(m => {
    const std = semanticDefaults?.[`${set}-${m}`] || {}
    const akt = store.state.themes?.[set]?.[m] || {}
    return Object.keys(std).some(k => akt[k] !== undefined && String(akt[k]).toLowerCase() !== String(std[k]).toLowerCase())
  })
})
function foundationGeaendert (id) {
  if (id === 'colors') return farbenGeaendert.value
  const kats = FOUNDATION_KATEGORIEN[id]
  if (!kats) return false
  const akt = store.currentFoundation || {}
  if (id === 'typography' && Object.keys(store.currentTypeScale || {}).length) return true
  return kats.some(k => !gleich({ ...STANDARD_FOUNDATION[k], ...(akt[k] || {}) }, STANDARD_FOUNDATION[k]))
}

function isModified(child) {
  const overrides = store.currentComponentOverrides
  if (child.section.startsWith('component-')) {
    const componentId = child.section.replace('component-', '')
    return Object.keys(overrides).some(k => k.startsWith(`nc-${componentId}`))
  }
  if (child.section.startsWith('foundation-')) return foundationGeaendert(child.id)
  return false
}

/**
 * Check if a nav item's component is locked
 */
function isItemLocked(item) {
  if (!item.section?.startsWith('component-')) return false
  const componentId = item.section.replace('component-', '')
  return store.isComponentLocked(componentId)
}

/**
 * Get the version string for a nav item's component
 */
function getItemVersion(item) {
  if (!item.section?.startsWith('component-')) return null
  const componentId = item.section.replace('component-', '')
  return store.getComponentVersion(componentId)
}

async function handleReset() {
  const ok = await bestaetigen({
    titel: 'Auf NEO-Standard zurücksetzen?',
    text: 'Alle Abweichungen dieses Themes werden verworfen; es gelten wieder die Werte des NEO-Standards.',
    bestaetigenText: 'Zurücksetzen',
    gefaehrlich: true
  })
  if (ok) store.resetToDefaults()
}

// UX-56: Ebene mit dem aktiven Bereich (für die eingeklappte Leiste)
function enthaeltAktiv (gruppe) {
  const ziel = store.state.activeSection
  const lauf = (k) => (k.children || []).some((c) => c.section === ziel || lauf(c))
  return lauf(gruppe)
}
const aktiverName = computed(() => bereichsName(store.state.activeSection))
function oeffneEbene (id) {
  expandedGroups.value = new Set([...expandedGroups.value, id])
  emit('toggle')
}
// Tabler-Pfade je Ebene
const EBENEN_SYMBOLE = Object.freeze({
  foundation: ['M3 21l18 0', 'M4 21v-15a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v15', 'M9 21v-8a3 3 0 0 1 6 0v8'],
  objects: ['M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5', 'M12 12l8 -4.5', 'M12 12l0 9', 'M12 12l-8 -4.5'],
  atoms: ['M12 12v.01', 'M19.071 4.929c-1.562 -1.562 -6 .337 -9.9 4.243c-3.905 3.905 -5.804 8.337 -4.242 9.9c1.562 1.561 6 -.338 9.9 -4.244c3.905 -3.905 5.804 -8.337 4.242 -9.9', 'M4.929 4.929c-1.562 1.562 .337 6 4.243 9.9c3.905 3.905 8.337 5.804 9.9 4.242c1.561 -1.562 -.338 -6 -4.244 -9.9c-3.905 -3.905 -8.337 -5.804 -9.9 -4.242'],
  molecules: ['M4.5 7.5l3.5 -2l3.5 2v4l-3.5 2l-3.5 -2z', 'M12.5 12.5l3.5 -2l3.5 2v4l-3.5 2l-3.5 -2z', 'M4.5 16.5l3.5 -2l3.5 2'],
  organisms: ['M3 21l18 0', 'M5 21v-14l8 -4v18', 'M19 21v-10l-6 -4', 'M9 9l0 .01', 'M9 12l0 .01', 'M9 15l0 .01', 'M9 18l0 .01'],
  patterns: ['M4 4h6v6h-6z', 'M14 4h6v6h-6z', 'M4 14h6v6h-6z', 'M14 14h6v6h-6z'],
  templates: ['M4 5a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1z', 'M4 13a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z', 'M14 12l6 0', 'M14 16l6 0', 'M14 20l6 0'],
  standard: ['M4 12a8 8 0 1 0 16 0a8 8 0 1 0 -16 0'],
})
</script>

<style scoped>
.sidebar-nav {
  display: flex;
  flex-direction: column;
  background: var(--cfg-surface);
  border-right: 1px solid var(--cfg-border);
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.2s ease, min-width 0.2s ease;
}

.sidebar-nav:not(.sidebar-nav--collapsed) {
  width: 240px;
  min-width: 240px;
}

.sidebar-nav--collapsed {
  width: 44px;
  min-width: 44px;
  align-items: center;
}

/* UX-56: Symbolleiste der Ebenen im eingeklappten Zustand */
.nav-leiste { display: flex; flex-direction: column; align-items: center; gap: 4px; padding-top: 8px; }
.nav-leiste__knopf {
  display: grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: 8px;
  background: transparent; color: var(--cfg-text-secondary); cursor: pointer;
}
.nav-leiste__knopf:hover { background: var(--cfg-surface-elevated); color: var(--cfg-text); }
.nav-leiste__knopf.aktiv { background: var(--cfg-surface-elevated); color: var(--cfg-accent); box-shadow: inset 2px 0 0 var(--cfg-accent); }
.nav-leiste__knopf:focus-visible { outline: 2px solid var(--cfg-accent); outline-offset: 2px; }

.sidebar-collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--cfg-text-muted);
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: color 0.15s;
}
.sidebar-collapse-btn:hover {
  color: var(--cfg-text);
  background: var(--cfg-hover);
}

.sidebar-search {
  padding: 12px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--cfg-text-muted);
  pointer-events: none;
}

.sidebar-suche-leer { margin: 0 12px 8px; font-size: 12px; line-height: 1.4; color: var(--cfg-text-muted); }
.nav-item-grund { display: block; font-size: 10px; font-family: var(--cfg-font-mono, monospace); color: var(--cfg-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.search-input {
  width: 100%;
  height: 32px;
  padding: 0 10px 0 30px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;
}

.search-input:focus {
  border-color: var(--cfg-accent);
}

.search-input::placeholder {
  color: var(--cfg-text-muted);
}

.nav-tree {
  flex: 1;
  padding: 0 8px;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 2px;
}

.nav-group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.1s;
}

.nav-group-header:hover {
  background: var(--cfg-surface-elevated);
}

.nav-chevron {
  transition: transform 0.15s ease;
  color: var(--cfg-text-muted);
  flex-shrink: 0;
}

.nav-chevron.expanded {
  transform: rotate(90deg);
}

.nav-group-label {
  flex: 1;
  text-align: left;
}

.nav-group-count {
  font-size: 10px;
  font-weight: 500;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 1px 5px;
  border-radius: 4px;
}

.nav-children {
  padding: 2px 0 6px 12px;
}

/* Subgroup styling */
.nav-subgroup {
  margin-top: 4px;
}

.nav-subgroup-label {
  display: block;
  padding: 4px 10px 2px;
  font-size: 10px;
  font-weight: 600;
  color: var(--cfg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.nav-subgroup-children {
  padding-left: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s;
  text-align: left;
}

.nav-item:hover {
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
}

.nav-item.active {
  background: var(--cfg-accent-subtle);
  color: var(--cfg-accent);
  font-weight: 600;
}

/* Items without tokens */
.nav-item.no-tokens {
  opacity: 0.55;
}

.nav-item.no-tokens:hover {
  opacity: 0.8;
}

.nav-item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--cfg-border);
  flex-shrink: 0;
}

.nav-item-dot.modified {
  background: var(--cfg-accent);
}

.nav-item-dot.empty {
  background: transparent;
  border: 1px dashed var(--cfg-border);
}

.nav-item.active .nav-item-dot {
  /* UX-29: aktiv = Ring, geändert = gefüllter Punkt — vorher gleich gefärbt */
  background: transparent;
  box-shadow: 0 0 0 1.5px var(--cfg-text);
}
.nav-item.active .nav-item-dot.modified {
  background: var(--cfg-accent);
}

.nav-item.active .nav-item-dot.empty {
  background: transparent;
  border-color: var(--cfg-accent);
}

/* Lock + Version indicators */
.nav-lock-icon {
  flex-shrink: 0;
  color: var(--cfg-warning-text);
  margin-left: auto;
}

/* Recipe-Status draft (Plan v3, Phase 4) */
.nav-entwurf-badge {
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px dashed currentColor;
  color: var(--cfg-text-muted);
}

.nav-version-badge {
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 600;
  font-family: monospace;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text-muted);
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--cfg-border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn-reset,
.btn-export {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 7px 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text-secondary);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-reset:hover,
.btn-export:hover {
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
  border-color: var(--cfg-text-muted);
}
</style>
