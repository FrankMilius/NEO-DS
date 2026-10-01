<template>
  <KonfigDialog
    :offen="!!konflikt"
    titel="Das Theme wurde inzwischen geändert"
    :beschreibung="text"
    rolle="alertdialog"
    groesse="md"
    start-fokus="[data-start-fokus]"
    :hintergrund-schliesst="false"
    @schliessen="betrieb.konfliktAbbrechen()"
  >
    <ul class="dkf-liste">
      <li><strong>Neu laden</strong> holt den aktuellen Stand aus Drupal. Deine ungespeicherten Änderungen gehen dabei verloren.</li>
      <li><strong>Abbrechen</strong> lässt alles, wie es ist: Du arbeitest weiter, gespeichert wird nichts.</li>
    </ul>
    <template #fuss>
      <button type="button" class="dk-knopf" data-start-fokus data-test="konflikt-abbrechen" @click="betrieb.konfliktAbbrechen()">Abbrechen</button>
      <button type="button" class="dk-knopf dk-knopf--primaer" data-test="konflikt-neu-laden" @click="betrieb.neuLaden()">Neu laden</button>
    </template>
  </KonfigDialog>
</template>

<script setup>
/**
 * DrupalKonfliktDialog — 412 beim Speichern/Veröffentlichen (Plan v2, 2.6,
 * Teil 2; ADR-002 Beschluss 7: keine Sperre, „neu laden und entscheiden“).
 */
import { computed } from 'vue'
import KonfigDialog from '../ui/KonfigDialog.vue'
import { useThemeStore } from '../../stores/theme.js'
import { useDrupalBetrieb } from '../../composables/useDrupalBetrieb.js'

const store = useThemeStore()
const betrieb = useDrupalBetrieb()
const konflikt = computed(() => betrieb.zustand.konflikt)
const text = computed(() => {
  const name = store.state.currentThemeMeta?.name
  return `Jemand anderes hat ${name ? `„${name}“` : 'dieses Theme'} in Drupal gespeichert, nachdem du es geöffnet hast. Deine Änderungen wurden nicht gespeichert.`
})
</script>

<style scoped src="./_drupal.css"></style>
<style scoped>
.dkf-liste { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 12px; line-height: 1.5; color: var(--cfg-text); }
</style>
