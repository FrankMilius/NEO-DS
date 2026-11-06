<template>
  <div class="flaechen-wahl" data-test="flaechen-wahl">
    <select
      class="flaechen-wahl__select"
      :class="{ modified: aktiv !== 'standard' }"
      :aria-label="`${token.label}: Fläche wählen`"
      :value="aktiv"
      @change="waehle($event.target.value)"
    >
      <option v-for="o in token.optionen" :key="o.id" :value="o.id">{{ o.label }}</option>
      <option v-if="aktiv === 'eigene'" value="eigene" disabled>Eigener Wert</option>
    </select>
  </div>
</template>

<script setup>
/**
 * Fläche wählen (I06 Phase 3): feste Liste statt freier Farbe. Jede Fläche
 * setzt Hintergrund, Text, Nebentext, Linie, Hover und Fokus gemeinsam, damit
 * der Kontrast gesichert bleibt. „Standard“ schreibt nichts.
 */
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { aktiveFlaeche, flaechenAenderung } from '../../utils/flaeche.js'

const props = defineProps({
  token: { type: Object, required: true }
})

const store = useThemeStore()
const aktiv = computed(() => aktiveFlaeche(props.token, store.currentComponentOverrides))

function waehle (id) {
  const { setzen, entfernen } = flaechenAenderung(props.token, id)
  for (const t of entfernen) store.resetComponentToken(t)
  for (const [t, wert] of Object.entries(setzen)) store.updateComponentToken(t, wert)
}
</script>

<style scoped>
.flaechen-wahl__select {
  width: 100%;
  min-height: 2rem;
}
</style>
