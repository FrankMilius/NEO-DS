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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from './stores/theme.js'
import { useStyleguideSync } from './stores/styleguide-sync.js'
import AppHeader from './components/layout/AppHeader.vue'
import SidebarNav from './components/layout/SidebarNav.vue'
import InspectorPanel from './components/layout/InspectorPanel.vue'
import LaboratoryPanel from './components/laboratory/LaboratoryPanel.vue'
import UpdateDialog from './components/components/UpdateDialog.vue'
import ErrorBoundary from './components/layout/ErrorBoundary.vue'

const store = useThemeStore()
const sync = useStyleguideSync()

// Sidebar collapse state (persisted)
const SIDEBAR_KEY = 'neo-cfg-sidebar-collapsed'
const sidebarCollapsed = ref(localStorage.getItem(SIDEBAR_KEY) === 'true')

function toggleSidebar () {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem(SIDEBAR_KEY, sidebarCollapsed.value)
}

onMounted(() => {
  store.loadFromStorage()
  sync.fetchExistingPalettes()

  // Keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
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
  })
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
