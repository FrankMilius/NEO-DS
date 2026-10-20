<template>
  <div class="dw">
    <DrupalThemeAuswahl />

    <div class="dw-trenner" aria-hidden="true"></div>

    <button
      type="button"
      class="dk-knopf"
      data-test="drupal-speichern"
      :disabled="!kannBearbeiten"
      :aria-disabled="zustand.status === 'speichert' ? 'true' : undefined"
      :title="kannBearbeiten ? 'In Drupal speichern (Strg+S)' : 'Nur Ansicht — Ihnen fehlt das Recht „bearbeiten“'"
      aria-keyshortcuts="Control+S"
      @click="betrieb.speichern()"
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      <span class="kopf-text-schmal">Speichern</span>
    </button>
    <!-- R05: der Text wird in schmalen Fenstern nur vorgelesen, der Punkt bleibt -->
    <span class="dw-status" :class="`dw-status--${zustand.status}`" role="status" data-test="drupal-status" :data-status="zustand.status" :title="statusText">
      <span class="dw-punkt" aria-hidden="true"></span><span class="dw-status-text">{{ statusText }}</span>
    </span>

    <!-- R05: seltene Aktionen wandern bei Platzmangel ins Menü „Mehr …“ -->
    <KopfPlatz name="veroeffentlichen">
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
    </KopfPlatz>

    <!-- Website-Vorschau (Vertrag 1.1.0): nur für die angemeldete Person -->
    <KopfPlatz v-if="kannBearbeiten" name="vorschau">
    <div class="dw-trenner" aria-hidden="true"></div>
    <button
      type="button"
      class="dk-knopf"
      data-test="drupal-vorschau"
      :aria-pressed="zustand.vorschauAn ? 'true' : 'false'"
      :aria-label="vorschauAnderes ? `Website-Vorschau, zeigt „${zustand.vorschauName}“` : `Vorschau von „${themeName}“ auf der Website`"
      :title="vorschauTitel"
      @click="betrieb.vorschauUmschalten()"
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path v-if="!zustand.vorschauAn" d="M3 3l18 18"/></svg>
      Website-Vorschau {{ zustand.vorschauAn ? 'an' : 'aus' }}<span v-if="vorschauAnderes" class="dw-vorschau-anderes" data-test="vorschau-anderes"> · zeigt „{{ zustand.vorschauName }}“</span>
    </button>
    </KopfPlatz>
    <KopfPlatz name="website">
    <a
      class="dk-knopf"
      data-test="drupal-website"
      :href="websiteUrl"
      target="_blank"
      rel="noopener"
      title="Website in neuem Tab öffnen"
    >
      Website öffnen
      <span class="u-sr-only">(neuer Tab)</span>
    </a>
    </KopfPlatz>
    <span v-if="zustand.vorschauFehler" class="dw-vorschau-fehler" role="alert">{{ zustand.vorschauFehler }}</span>

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
import KopfPlatz from '../layout/KopfPlatz.vue'
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
  'ohne-theme': 'Noch nicht in Drupal gespeichert',
  gespeichert: 'Gespeichert',
  ungespeichert: 'Ungespeicherte Änderungen',
  speichert: 'Wird gespeichert …',
  laedt: 'Lädt …',
  fehler: 'Fehler beim Speichern',
}
// UX-25: Ohne Recht „bearbeiten“ ist der Status „Nur Ansicht“ — vorher stand
// dort „Nicht in Drupal gespeichert“, als hätte man etwas versäumt
const statusText = computed(() => (!kannBearbeiten && zustand.status !== 'laedt' ? 'Nur Ansicht' : (zustand.status === 'fehler' && zustand.fehlerText) || STATUS[zustand.status] || ''))
const themeName = computed(() => store.state.currentThemeMeta?.name || 'NEO-Standard')

const websiteUrl = (typeof window !== 'undefined' && window.NEO_KONFIGURATOR?.websiteUrl) || '/'
// UX-25: Die Vorschau (Stand vom Server) zeigt ein anderes Theme als das geöffnete
const vorschauAnderes = computed(() => !!(zustand.vorschauAn && zustand.vorschauId && zustand.vorschauName && zustand.vorschauId !== store.state.currentThemeMeta?.id))
const vorschauTitel = computed(() => vorschauAnderes.value
  ? `Ihre Website-Vorschau zeigt „${zustand.vorschauName}“, nicht das geöffnete Theme. Beim nächsten Speichern wechselt sie zu „${themeName.value}“. Klicken schaltet sie aus.`
  : zustand.vorschauAn
  ? `Vorschau von „${themeName.value}“ ist an: Sie sehen den gespeicherten Stand dieses Themes auf der Website, Besucher nicht. Klicken schaltet sie aus.`
  : `Vorschau von „${themeName.value}“ ist aus: Sie sehen auf der Website dasselbe wie Besucher. Klicken schaltet sie ein.`)

const veroeffentlichenTitel = computed(() => {
  if (!kannVeroeffentlichen) return 'Ihnen fehlt das Recht „veröffentlichen“'
  if (!store.state.currentThemeMeta?.id) return 'Erst in Drupal speichern'
  return 'Kontrast prüfen und veröffentlichen'
})
</script>

<style scoped src="./_drupal.css"></style>
<style scoped>
.dw-vorschau-anderes { font-weight: 400; color: var(--cfg-text-secondary); }
.dw { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }   /* R05: einzeilig, Seltenes wandert ins Menü „Mehr …“ */
/* Status nur als Punkt, wenn es eng wird; der Text bleibt für Screenreader */
@media (max-width: 1023px) {
  .dw-status-text { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
}
.dw-trenner { width: 1px; height: 20px; background: var(--cfg-border); margin: 0 2px; }
.dw-status { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: var(--cfg-text-secondary); white-space: nowrap; }
.dw-punkt { width: 8px; height: 8px; border-radius: 50%; background: var(--cfg-border); flex-shrink: 0; }
.dw-status--gespeichert .dw-punkt { background: var(--cfg-success); }
.dw-status--ungespeichert .dw-punkt { background: var(--cfg-warning); }
.dw-status--speichert .dw-punkt, .dw-status--laedt .dw-punkt { background: var(--cfg-processing); }
.dw-status--fehler .dw-punkt { background: var(--cfg-danger); }
.dw-vorschau-fehler { font-size: 11px; color: var(--cfg-danger); white-space: nowrap; }
a.dk-knopf { text-decoration: none; }
.u-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
</style>
