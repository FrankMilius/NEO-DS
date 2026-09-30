<template>
  <div class="app-shell" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <AppHeader @toggle-sidebar="toggleSidebar" :sidebarCollapsed="sidebarCollapsed" />
    <div class="app-body">
      <SidebarNav :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
      <ErrorBoundary panelLabel="Laboratory">
        <LaboratoryPanel />
      </ErrorBoundary>
      <ErrorBoundary panelLabel="Inspector">
        <InspectorPanel />
      </ErrorBoundary>
    </div>
    <UpdateDialog />
    <KonfigBestaetigung />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useThemeStore } from './stores/theme.js'
import { useStyleguideSync } from './stores/styleguide-sync.js'
import AppHeader from './components/layout/AppHeader.vue'
import SidebarNav from './components/layout/SidebarNav.vue'
import InspectorPanel from './components/layout/InspectorPanel.vue'
import LaboratoryPanel from './components/laboratory/LaboratoryPanel.vue'
import UpdateDialog from './components/components/UpdateDialog.vue'
import ErrorBoundary from './components/layout/ErrorBoundary.vue'
import KonfigBestaetigung from './components/ui/KonfigBestaetigung.vue'
import { starteHashRouter } from './navigation/hash-router.js'

const store = useThemeStore()
const sync = useStyleguideSync()

// Sidebar collapse state (persisted)
const SIDEBAR_KEY = 'neo-cfg-sidebar-collapsed'
const sidebarCollapsed = ref(localStorage.getItem(SIDEBAR_KEY) === 'true')

function toggleSidebar () {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem(SIDEBAR_KEY, sidebarCollapsed.value)
}

// In Eingabefeldern gehoert Cmd+Z dem Browser (Text-Undo), nicht dem Theme.
function isTextInput (el) {
  if (!el) return false
  const tag = el.tagName
  if (el.isContentEditable || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (tag !== 'INPUT') return false
  return !['checkbox', 'radio', 'range', 'color', 'button', 'submit'].includes(el.type)
}

function onKeydown (e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !isTextInput(e.target)) {
    e.preventDefault()
    if (e.shiftKey) {
      store.redo()
    } else {
      store.undo()
    }
  }
  // Toggle Sidebar: Ctrl+B (wie VS Code)
  if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
    e.preventDefault()
    toggleSidebar()
  }
}

// Deep-Links: Sektion ↔ URL-Hash (Plan v2, 3.4). Start nach loadFromStorage,
// damit ein Hash in der URL den gespeicherten Stand ueberschreibt.
let stoppeHashRouter = null

onMounted(() => {
  store.loadFromStorage()
  stoppeHashRouter = starteHashRouter(store)
  sync.fetchExistingPalettes()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  stoppeHashRouter?.()
})
</script>

<style scoped>
.app-shell {
  display: grid;
  grid-template-rows: 44px 1fr;
  grid-template-columns: 240px 1fr auto;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  transition: grid-template-columns 0.2s ease;
}

.app-shell.sidebar-collapsed {
  grid-template-columns: 44px 1fr auto;
}

.app-shell > :first-child {
  /* AppHeader: spans full width */
  grid-column: 1 / -1;
}

.app-body {
  display: contents;
}
</style>
