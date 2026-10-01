<template>
  <div class="dw">
    <DrupalThemeAuswahl />

    <div class="dw-trenner" aria-hidden="true"></div>

    <button
      type="button"
      class="dk-knopf"
      data-test="drupal-speichern"
      :disabled="!kannBearbeiten || zustand.status === 'speichert'"
      :title="kannBearbeiten ? 'In Drupal speichern (Strg+S)' : 'Nur Ansicht — dir fehlt das Recht „bearbeiten“'"
      aria-keyshortcuts="Control+S"
      @click="betrieb.speichern()"
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      Speichern
    </button>
    <span class="dw-status" :class="`dw-status--${zustand.status}`" role="status" data-test="drupal-status" :data-status="zustand.status">
      <span class="dw-punkt" aria-hidden="true"></span>{{ statusText }}
    </span>

    <div class="dw-trenner" aria-hidden="true"></div>

    <button
      type="button"
      class="dk-knopf"
      data-test="drupal-veroeffentlichen"
      :disabled="!kannVeroeffentlichen || !store.state.currentThemeMeta?.id"
      :title="veroeffentlichenTitel"
      @click="zustand.veroeffentlichenOffen = true"
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
      Veröffentlichen
    </button>

    <DrupalAnlegenDialog />
    <DrupalKonfliktDialog />
    <DrupalVeroeffentlichenDialog />
  </div>
</template>

<script setup>
/**
 * DrupalWerkzeuge — Header-Werkzeuge im Drupal-Betrieb (Plan v2, 2.6, Teil 2)
 * Ersetzt im Header Neu/Theme-Auswahl/Branches/Speichern/Löschen des
 * lokalen Betriebs. Strg+S löst AppHeader über useDrupalBetrieb aus.
 */
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { darf } from '../../speicher/index.js'
import { useDrupalBetrieb } from '../../composables/useDrupalBetrieb.js'
import DrupalThemeAuswahl from './DrupalThemeAuswahl.vue'
import DrupalAnlegenDialog from './DrupalAnlegenDialog.vue'
import DrupalKonfliktDialog from './DrupalKonfliktDialog.vue'
import DrupalVeroeffentlichenDialog from './DrupalVeroeffentlichenDialog.vue'

const store = useThemeStore()
const betrieb = useDrupalBetrieb()
const zustand = betrieb.zustand
const kannBearbeiten = darf('bearbeiten')
const kannVeroeffentlichen = darf('veroeffentlichen')

const STATUS = {
  'ohne-theme': 'Nicht in Drupal gespeichert',
  gespeichert: 'Gespeichert',
  ungespeichert: 'Ungespeicherte Änderungen',
  speichert: 'Speichert …',
  fehler: 'Fehler beim Speichern',
}
const statusText = computed(() => (zustand.status === 'fehler' && zustand.fehlerText) || STATUS[zustand.status] || '')

const veroeffentlichenTitel = computed(() => {
  if (!kannVeroeffentlichen) return 'Dir fehlt das Recht „veröffentlichen“'
  if (!store.state.currentThemeMeta?.id) return 'Erst in Drupal speichern'
  return 'Kontrast prüfen und veröffentlichen'
})
</script>

<style scoped src="./_drupal.css"></style>
<style scoped>
.dw { display: flex; align-items: center; gap: 8px; }
.dw-trenner { width: 1px; height: 20px; background: var(--cfg-border); margin: 0 2px; }
.dw-status { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: var(--cfg-text-secondary); white-space: nowrap; }
.dw-punkt { width: 8px; height: 8px; border-radius: 50%; background: var(--cfg-border); flex-shrink: 0; }
.dw-status--gespeichert .dw-punkt { background: var(--cfg-success); }
.dw-status--ungespeichert .dw-punkt { background: var(--cfg-warning); }
.dw-status--speichert .dw-punkt { background: var(--cfg-processing); }
.dw-status--fehler .dw-punkt { background: var(--cfg-danger); }
</style>
