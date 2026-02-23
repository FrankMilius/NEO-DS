<template>
  <div class="app-shell">
    <AppHeader />
    <div class="app-body">
      <SidebarNav />
      <ErrorBoundary panelLabel="Inspector">
        <InspectorPanel />
      </ErrorBoundary>
      <ErrorBoundary panelLabel="Laboratory">
        <LaboratoryPanel />
      </ErrorBoundary>
    </div>
    <UpdateDialog />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
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

onMounted(() => {
  store.loadFromStorage()

  // Fetch existing styleguide palettes on startup
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
  })
})
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app-body {
  display: flex;
  flex: 1;
  min-height: 0;
}
</style>
