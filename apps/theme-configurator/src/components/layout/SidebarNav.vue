<template>
  <aside class="sidebar-nav" :class="{ 'sidebar-nav--collapsed': collapsed }">
    <!-- Collapse Toggle -->
    <button class="sidebar-collapse-btn" @click="$emit('toggle')" :title="collapsed ? 'Sidebar einblenden (Ctrl+B)' : 'Sidebar ausblenden (Ctrl+B)'">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <template v-if="collapsed">
          <path d="M13 17l5-5-5-5"/><path d="M6 17l5-5-5-5"/>
        </template>
        <template v-else>
          <path d="M11 17l-5-5 5-5"/><path d="M18 17l-5-5 5-5"/>
        </template>
      </svg>
    </button>
    <div v-if="!collapsed" class="sidebar-search">
      <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search tokens..."
        class="search-input"
      />
    </div>

    <nav v-if="!collapsed" class="nav-tree" role="tree">
      <div v-for="group in filteredTree" :key="group.id" class="nav-group">
        <button
          class="nav-group-header"
          @click="toggleGroup(group.id)"
          :aria-expanded="expandedGroups.has(group.id)"
        >
          <svg class="nav-chevron" :class="{ expanded: expandedGroups.has(group.id) }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <span class="nav-group-label">{{ group.label }}</span>
          <span class="nav-group-count">{{ getItemCount(group) }}</span>
        </button>

        <div v-if="expandedGroups.has(group.id)" class="nav-children">
          <template v-for="child in group.children" :key="child.id">
            <!-- Subgroup -->
            <div v-if="child.isSubgroup" class="nav-subgroup">
              <span class="nav-subgroup-label">{{ child.label }}</span>
              <div class="nav-subgroup-children">
                <button
                  v-for="item in child.children"
                  :key="item.id"
                  :class="['nav-item', { active: store.state.activeSection === item.section, 'no-tokens': !hasTokens(item) }]"
                  @click="handleSelect(item)"
                >
                  <span class="nav-item-dot" :class="{ modified: isModified(item) }" v-if="hasTokens(item)"></span>
                  <span class="nav-item-dot empty" v-else></span>
                  <span class="nav-item-label">{{ item.label }}</span>
                  <svg v-if="isItemLocked(item)" class="nav-lock-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span v-if="getItemVersion(item)" class="nav-version-badge">{{ getItemVersion(item) }}</span>
                </button>
              </div>
            </div>
            <!-- Flat item -->
            <button
              v-else
              :class="['nav-item', { active: store.state.activeSection === child.section, 'no-tokens': !hasTokens(child) }]"
              @click="handleSelect(child)"
            >
              <span class="nav-item-dot" :class="{ modified: isModified(child) }" v-if="hasTokens(child)"></span>
              <span class="nav-item-dot empty" v-else></span>
              <span class="nav-item-label">{{ child.label }}</span>
              <svg v-if="isItemLocked(child)" class="nav-lock-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span v-if="getItemVersion(child)" class="nav-version-badge">{{ getItemVersion(child) }}</span>
            </button>
          </template>
        </div>
      </div>
    </nav>

    <div v-if="!collapsed" class="sidebar-footer">
      <button class="btn-reset" @click="handleReset">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        Reset to Defaults
      </button>
      <button class="btn-export" @click="handleExportJSON">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M5 12V5a2 2 0 0 1 2-2h7l5 5v4"/><path d="m12 18-4 4-4-4"/><path d="M8 22V12"/>
        </svg>
        Export JSON
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { navigationTree, componentTokenGroups } from '../../data/tokens.js'

const props = defineProps({
  collapsed: { type: Boolean, default: false }
})
defineEmits(['toggle'])

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

const filteredTree = computed(() => {
  if (!searchQuery.value.trim()) return navigationTree
  const q = searchQuery.value.toLowerCase()

  return navigationTree
    .map(group => {
      const filteredChildren = group.children
        .map(child => {
          if (child.isSubgroup) {
            // Filter subgroup children
            const filteredSubChildren = child.children.filter(item =>
              item.label.toLowerCase().includes(q)
            )
            if (filteredSubChildren.length === 0) return null
            return { ...child, children: filteredSubChildren }
          }
          // Flat child
          return child.label.toLowerCase().includes(q) ? child : null
        })
        .filter(Boolean)

      if (filteredChildren.length === 0) return null
      return { ...group, children: filteredChildren }
    })
    .filter(Boolean)
})

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

function isModified(child) {
  // Check if any tokens in this section have been modified from defaults
  const overrides = store.currentComponentOverrides.value
  if (child.section.startsWith('component-')) {
    const componentId = child.section.replace('component-', '')
    return Object.keys(overrides).some(k => k.startsWith(`nc-${componentId}`))
  }
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

function handleReset() {
  if (confirm('Reset all tokens to defaults? This cannot be undone.')) {
    store.resetToDefaults()
  }
}

function handleExportJSON() {
  const json = store.exportAsJSON()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${store.state.activeThemeSet}-theme.json`
  a.click()
  URL.revokeObjectURL(url)
}
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
  background: var(--cfg-accent);
}

.nav-item.active .nav-item-dot.empty {
  background: transparent;
  border-color: var(--cfg-accent);
}

/* Lock + Version indicators */
.nav-lock-icon {
  flex-shrink: 0;
  color: #d97706;
  margin-left: auto;
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
