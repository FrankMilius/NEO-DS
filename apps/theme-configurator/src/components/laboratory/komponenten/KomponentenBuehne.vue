<template>
  <!-- Matrix-Modus: 2×2 Grid mit allen 4 Themes -->
  <div v-if="resolvedArena && store.state.previewMode === 'matrix' && variantenSichtbar" class="theme-matrix">
    <!-- Klick in den Quadranten waehlt Theme + Modus (Maus); per Tastatur ueber
         den Knopf im Quadranten-Kopf (Plan v2, 4.4) -->
    <div
      v-for="q in alle"
      :key="q.klasse"
      :class="['theme-matrix__quadrant', q.klasse]"
      @click="waehle(q)"
    >
      <button
        type="button"
        class="theme-matrix__label cfg-knopf-reset"
        :aria-label="`${q.label} als Variante und Modus wählen`"
        @click.stop="waehle(q)"
      >{{ q.label }}</button>
      <MatrixQuadrant :quadrant="q"><component :is="resolvedArena" /></MatrixQuadrant>
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
import { computed, defineAsyncComponent, defineComponent, provide } from 'vue'
import { useThemeStore } from '../../../stores/theme.js'
import { useArenaResolver } from '../../../composables/useArenaResolver.js'
import { useVorschauKombinationen } from '../../../composables/useVorschauKombinationen.js'

const MagazinVorschau = defineAsyncComponent(() => import('../vorschau/MagazinVorschau.vue'))

const store = useThemeStore()
const activeComponentId = computed(() => store.state.activeSection.replace('component-', ''))
const { resolvedArena } = useArenaResolver(activeComponentId)

// Immer nur das geöffnete Theme (19.10.2026); „Alle vier“ = seine Varianten
const { alle, variantenSichtbar } = useVorschauKombinationen()

// Gibt der Arena im Quadranten Set und Modus mit (UX-09) — die RecipeArena
// liest sie per inject('vorschauQuadrant') statt aus previewMode.
const MatrixQuadrant = defineComponent({
  name: 'MatrixQuadrant',
  props: { quadrant: { type: Object, required: true } },
  setup (props, { slots }) {
    provide('vorschauQuadrant', props.quadrant)
    return () => slots.default?.()
  }
})

function waehle (q) {
  store.setActiveThemeSet(q.set)
  store.setPreviewMode(q.modus)
}
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
  width: calc(100% + 24px);
  text-align: left;
  cursor: pointer;
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
