<template>
  <!-- Matrix-Modus: 2×2 Grid mit allen 4 Themes -->
  <div v-if="resolvedArena && store.state.previewMode === 'matrix'" class="theme-matrix">
    <div class="theme-matrix__quadrant neo-light-theme" @click="store.setActiveThemeSet('neo'); store.setPreviewMode('light')">
      <span class="theme-matrix__label">Neo Light</span>
      <component :is="resolvedArena" />
    </div>
    <div class="theme-matrix__quadrant neo-dark-theme" @click="store.setActiveThemeSet('neo'); store.setPreviewMode('dark')">
      <span class="theme-matrix__label">Neo Dark</span>
      <component :is="resolvedArena" />
    </div>
    <div class="theme-matrix__quadrant customer-light-theme" @click="store.setActiveThemeSet('customer'); store.setPreviewMode('light')">
      <span class="theme-matrix__label">Customer Light</span>
      <component :is="resolvedArena" />
    </div>
    <div class="theme-matrix__quadrant customer-dark-theme" @click="store.setActiveThemeSet('customer'); store.setPreviewMode('dark')">
      <span class="theme-matrix__label">Customer Dark</span>
      <component :is="resolvedArena" />
    </div>
  </div>
  <!-- Normal: Single/Split Arena -->
  <component v-else-if="resolvedArena" :is="resolvedArena" />
  <!-- Ohne Arena: Standard-Vorschau (wie der fruehere v-else-Zweig) -->
  <MagazinVorschau v-else />
</template>

<script setup>
// Komponenten-Sektionen (component-*): Arena ueber useArenaResolver,
// im Vorschaumodus „matrix" in allen vier Themes. Ausgelagert aus
// LaboratoryPanel.vue (Plan v2, 3.4).
import { computed, defineAsyncComponent } from 'vue'
import { useThemeStore } from '../../../stores/theme.js'
import { useArenaResolver } from '../../../composables/useArenaResolver.js'

const MagazinVorschau = defineAsyncComponent(() => import('../vorschau/MagazinVorschau.vue'))

const store = useThemeStore()
const activeComponentId = computed(() => store.state.activeSection.replace('component-', ''))
const { resolvedArena } = useArenaResolver(activeComponentId)
</script>

<style scoped>
/* ── Theme Matrix (2×2 Grid) ── */
.theme-matrix {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
  flex: 1;
  background: var(--cfg-border);
  border-radius: 8px;
  overflow: hidden;
}

.theme-matrix__quadrant {
  position: relative;
  padding: 12px;
  overflow-y: auto;
  cursor: pointer;
  transition: box-shadow 0.15s;
}

.theme-matrix__quadrant:hover {
  box-shadow: inset 0 0 0 2px var(--cfg-accent);
}

.theme-matrix__label {
  position: sticky;
  top: 0;
  display: block;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 8px;
  margin: -12px -12px 8px;
  background: color-mix(in srgb, var(--fnd-color-background-base, #fff) 90%, transparent);
  backdrop-filter: blur(8px);
  z-index: 1;
  color: var(--fnd-color-text-secondary, #64748b);
}
</style>
