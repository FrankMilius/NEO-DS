<template>
  <KonfigDialog
    :offen="!!konflikt"
    titel="Das Theme wurde inzwischen geändert"
    :beschreibung="text"
    rolle="alertdialog"
    groesse="lg"
    start-fokus="[data-start-fokus]"
    :hintergrund-schliesst="false"
    @schliessen="betrieb.konfliktAbbrechen()"
  >
    <p v-if="ueberschreibenFrage" class="dkf-warnung" role="alert" data-test="konflikt-warnung">
      „Meine Fassung speichern“ ersetzt die Änderung{{ wer ? ` von ${wer}` : '' }} vollständig. Sie lässt sich danach nicht wiederherstellen — Drupal führt keinen Verlauf.
    </p>
    <ul class="dkf-liste">
      <li><strong>Als neues Theme speichern</strong> legt deinen Stand als eigenes Theme „{{ name }} (meine Fassung)“ an. Das andere bleibt, wie es ist.</li>
      <li><strong>Meine Fassung speichern</strong> überschreibt den Stand in Drupal mit deinem.</li>
      <li><strong>Neu laden</strong> holt den Stand aus Drupal. Deine ungespeicherten Änderungen gehen dabei verloren.</li>
      <li><strong>Abbrechen</strong> lässt alles, wie es ist: Du arbeitest weiter, gespeichert wird nichts.</li>
    </ul>
    <template #fuss>
      <button type="button" class="dk-knopf" data-start-fokus data-test="konflikt-abbrechen" @click="betrieb.konfliktAbbrechen()">Abbrechen</button>
      <button type="button" class="dk-knopf" data-test="konflikt-neu-laden" @click="betrieb.neuLaden()">Neu laden</button>
      <button
        type="button"
        class="dk-knopf"
        :class="{ 'dk-knopf--gefahr': ueberschreibenFrage }"
        data-test="konflikt-ueberschreiben"
        @click="ueberschreiben"
      >{{ ueberschreibenFrage ? 'Ja, überschreiben' : 'Meine Fassung speichern' }}</button>
      <button type="button" class="dk-knopf dk-knopf--primaer" data-test="konflikt-als-neu" @click="betrieb.konfliktAlsNeuesTheme()">Als neues Theme speichern</button>
    </template>
  </KonfigDialog>
</template>

<script setup>
/**
 * DrupalKonfliktDialog — 412 beim Speichern/Veröffentlichen (Plan v2, 2.6,
 * Teil 2; ADR-002 Beschluss 7: keine Sperre, „neu laden und entscheiden“).
 * Seit 15.10.2026 (UX-07): nennt Zeit und Person der anderen Änderung und
 * lässt die eigenen Änderungen retten — als neues Theme oder, nach einem
 * zweiten Klick, über den Stand in Drupal.
 */
import { computed, ref, watch } from 'vue'
import KonfigDialog from '../ui/KonfigDialog.vue'
import { useThemeStore } from '../../stores/theme.js'
import { useDrupalBetrieb } from '../../composables/useDrupalBetrieb.js'

const store = useThemeStore()
const betrieb = useDrupalBetrieb()
const konflikt = computed(() => betrieb.zustand.konflikt)
const fremd = computed(() => betrieb.zustand.konfliktFremd)
const name = computed(() => store.state.currentThemeMeta?.name || 'Theme')
const wer = computed(() => fremd.value?.geaendertVon || '')
const ueberschreibenFrage = ref(false)
watch(konflikt, () => { ueberschreibenFrage.value = false })

function zeit (iso) {
  try { return new Date(iso).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) } catch { return '' }
}
const text = computed(() => {
  const f = fremd.value
  const wann = f?.updatedAt ? ` am ${zeit(f.updatedAt)}` : ''
  const von = f?.geaendertVon ? ` von ${f.geaendertVon}` : ''
  return `„${name.value}“ wurde${wann}${von} in Drupal gespeichert, nachdem du es geöffnet hast. Deine Änderungen sind noch nicht gespeichert.`
})

function ueberschreiben () {
  if (!ueberschreibenFrage.value) { ueberschreibenFrage.value = true; return }
  betrieb.konfliktUeberschreiben()
}
</script>

<style scoped src="./_drupal.css"></style>
<style scoped>
.dkf-liste { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 12px; line-height: 1.5; color: var(--cfg-text); }
.dkf-warnung { margin: 0 0 10px; padding: 8px 10px; border-radius: 6px; background: var(--cfg-danger-subtle); color: var(--cfg-text); font-size: 12px; line-height: 1.5; }
</style>
