<template>
  <aside class="sidebar-nav">
    <div class="sidebar-search">
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

    <nav class="nav-tree" role="tree">
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
          <span class="nav-group-count">{{ group.children.length }}</span>
        </button>

        <div v-if="expandedGroups.has(group.id)" class="nav-children">
          <button
            v-for="child in group.children"
            :key="child.id"
            :class="['nav-item', { active: store.state.activeSection === child.section }]"
            @click="handleSelect(child)"
          >
            <span class="nav-item-dot" :class="{ modified: isModified(child) }"></span>
            <span class="nav-item-label">{{ child.label }}</span>
          </button>
        </div>
      </div>
    </nav>

    <div class="sidebar-footer">
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
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { navigationTree } from '../../data/tokens.js'

const store = useThemeStore()
const searchQuery = ref('')
const expandedGroups = ref(new Set(['foundation', 'components']))

const filteredTree = computed(() => {
  if (!searchQuery.value.trim()) return navigationTree
  const q = searchQuery.value.toLowerCase()
  return navigationTree
    .map(group => ({
      ...group,
      children: group.children.filter(child =>
        child.label.toLowerCase().includes(q)
      )
    }))
    .filter(group => group.children.length > 0)
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
  width: 240px;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  background: var(--cfg-surface);
  border-right: 1px solid var(--cfg-border);
  overflow-y: auto;
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

.nav-item.active .nav-item-dot {
  background: var(--cfg-accent);
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
