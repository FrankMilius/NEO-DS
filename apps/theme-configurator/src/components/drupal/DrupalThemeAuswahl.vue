<template>
  <div ref="wurzelRef" class="dt-auswahl">
    <button
      ref="knopfRef"
      type="button"
      class="dt-auswahl-knopf"
      data-test="drupal-theme-auswahl"
      :aria-expanded="offen"
      :aria-controls="offen ? 'cfg-drupal-themes' : undefined"
      :title="titel"
      @click="umschalten"
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      </svg>
      <span class="dt-auswahl-name">{{ beschriftung }}</span>
      <span v-if="aktuell?.aktiv" class="dk-marke dk-marke--aktiv">aktiv</span>
      <svg aria-hidden="true" class="dt-chevron" :class="{ offen }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
    </button>

    <div v-if="offen" id="cfg-drupal-themes" class="dt-panel" role="region" aria-label="Themes in Drupal">
      <div class="dt-panel-kopf">
        <h2 class="dt-panel-titel">Themes in Drupal</h2>
        <button
          v-if="kannBearbeiten"
          type="button"
          class="dk-knopf dk-knopf--primaer dk-knopf--klein"
          data-test="drupal-neu"
          @click="neu"
        >
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Neu anlegen
        </button>
      </div>
      <p v-if="!themes.length" class="dt-leer">
        Noch keine Themes in Drupal.<template v-if="kannBearbeiten"> „Neu anlegen“ startet ein Theme vom NEO-Standard.</template>
      </p>
      <ul v-else class="dt-liste">
        <li
          v-for="t in themes"
          :key="t.id"
          class="dt-eintrag"
          :class="{ 'dt-eintrag--offen': t.id === aktuellId }"
          :data-test="`drupal-theme-${t.id}`"
        >
          <button
            type="button"
            class="dt-oeffnen"
            :aria-current="t.id === aktuellId ? 'true' : undefined"
            :aria-label="`${t.name} öffnen (${statusText(t)})`"
            @click="oeffne(t.id)"
          >
            <span class="dt-name">{{ t.name }}</span>
            <span class="dt-meta">v{{ t.version }}<template v-if="t.updatedAt"> · {{ datum(t.updatedAt) }}</template></span>
          </button>
          <span class="dt-marken">
            <span v-if="t.aktiv" class="dk-marke dk-marke--aktiv">aktiv</span>
            <span class="dk-marke" :class="`dk-marke--${t.status || 'entwurf'}`">{{ statusKurz(t.status) }}</span>
          </span>
          <button
            v-if="kannVeroeffentlichen && !t.aktiv"
            type="button"
            class="dk-knopf dk-knopf--klein"
            :disabled="!istVeroeffentlicht(t)"
            :title="istVeroeffentlicht(t) ? `${t.name} aktivieren` : 'Nur veröffentlichte Themes können aktiviert werden'"
            :aria-label="`${t.name} aktivieren`"
            data-test="drupal-aktivieren"
            @click="aktiviere(t.id)"
          >Aktivieren</button>
          <button
            v-if="kannBearbeiten"
            type="button"
            class="dk-symbol"
            :disabled="t.aktiv"
            :title="t.aktiv ? 'Das aktive Theme kann nicht gelöscht werden' : `${t.name} löschen`"
            :aria-label="`${t.name} löschen`"
            data-test="drupal-loeschen"
            @click="loesche(t.id)"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </li>
      </ul>
      <p v-if="betrieb.zustand.katalogFehler" class="dt-fehler" role="alert">{{ betrieb.zustand.katalogFehler }}</p>
    </div>
  </div>
</template>

<script setup>
/**
 * DrupalThemeAuswahl — Themes des Kunden in Drupal (Plan v2, 2.6, Teil 2)
 * Liste mit aktiv-Kennzeichen und Status (Entwurf / veröffentlicht /
 * geändert), Öffnen, Neu anlegen (vom NEO-Standard), Aktivieren (nur
 * veröffentlichte, Recht „veröffentlichen“), Löschen (Bestätigung; das
 * aktive nicht). Bedienelemente nach darf().
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { darf } from '../../speicher/index.js'
import { useDrupalBetrieb } from '../../composables/useDrupalBetrieb.js'

const store = useThemeStore()
const betrieb = useDrupalBetrieb()
const kannBearbeiten = darf('bearbeiten')
const kannVeroeffentlichen = darf('veroeffentlichen')

const offen = ref(false)
const wurzelRef = ref(null)
const knopfRef = ref(null)

const themes = computed(() => store.state.savedThemes || [])
const aktuellId = computed(() => store.state.currentThemeMeta?.id || null)
const aktuell = computed(() => themes.value.find(t => t.id === aktuellId.value) || null)
const beschriftung = computed(() => store.state.currentThemeMeta?.name || 'NEO-Standard (nicht gespeichert)')
const titel = computed(() => `Theme wählen — geöffnet: ${beschriftung.value}`)

const STATUS = { entwurf: 'Entwurf', veroeffentlicht: 'Veröffentlicht', 'geaendert-seit-veroeffentlichung': 'Geändert' }
const statusKurz = (s) => STATUS[s] || 'Entwurf'
const istVeroeffentlicht = (t) => t.status === 'veroeffentlicht' || t.status === 'geaendert-seit-veroeffentlichung'
function statusText (t) {
  const teile = [t.status === 'geaendert-seit-veroeffentlichung' ? 'geändert seit Veröffentlichung' : statusKurz(t.status).toLowerCase()]
  if (t.aktiv) teile.unshift('aktiv')
  return teile.join(', ')
}
function datum (iso) {
  try { return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) } catch { return '' }
}

function umschalten () { offen.value = !offen.value }
function schliessen (fokus = false) {
  offen.value = false
  if (fokus) knopfRef.value?.focus()
}

async function oeffne (id) {
  schliessen(true)
  await betrieb.oeffnen(id)
}
function neu () {
  schliessen(true)
  betrieb.zustand.anlegen = { vomStandard: true }
}
async function aktiviere (id) { await betrieb.aktivieren(id) }
async function loesche (id) {
  schliessen(true)
  await betrieb.loeschen(id)
}

function beiKlick (e) {
  if (offen.value && wurzelRef.value && !wurzelRef.value.contains(e.target)) offen.value = false
}
function beiTaste (e) {
  if (e.key !== 'Escape' || !offen.value) return
  const drin = wurzelRef.value?.contains(document.activeElement)
  schliessen(drin)
}
onMounted(() => {
  document.addEventListener('click', beiKlick, true)
  document.addEventListener('keydown', beiTaste)
})
onUnmounted(() => {
  document.removeEventListener('click', beiKlick, true)
  document.removeEventListener('keydown', beiTaste)
})
</script>

<style scoped src="./_drupal.css"></style>
<style scoped>
.dt-auswahl { position: relative; }
.dt-auswahl-knopf {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  max-width: 280px;
  padding: 0 10px;
  border: 1px solid var(--cfg-border);
  border-radius: 6px;
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.dt-auswahl-knopf:hover { background: var(--cfg-surface-elevated); }
.dt-auswahl-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dt-chevron { flex-shrink: 0; transition: transform 0.15s; }
.dt-chevron.offen { transform: rotate(180deg); }
.dt-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 440px;
  max-height: 70vh;
  overflow-y: auto;
  background: var(--cfg-surface);
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  box-shadow: var(--cfg-shadow-lg);
  z-index: var(--cfg-z-dropdown);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dt-panel-kopf { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 4px 4px 8px; border-bottom: 1px solid var(--cfg-border); }
.dt-panel-titel { margin: 0; font-size: 12px; font-weight: 700; color: var(--cfg-text); font-family: var(--cfg-font-heading); }
.dt-leer { margin: 4px; font-size: 12px; line-height: 1.5; color: var(--cfg-text-secondary); }
.dt-fehler { margin: 4px; font-size: 12px; color: var(--cfg-text); }
.dt-liste { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.dt-eintrag { display: flex; align-items: center; gap: 6px; padding: 2px 4px; border-radius: 6px; }
.dt-eintrag--offen { background: var(--cfg-accent-subtle); }
.dt-oeffnen {
  flex: 1;
  min-width: 0;
  min-height: 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1px;
  padding: 2px 6px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--cfg-text);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}
.dt-oeffnen:hover { background: var(--cfg-surface-elevated); }
.dt-name { font-size: 12px; font-weight: 600; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dt-meta { font-size: 11px; color: var(--cfg-text-secondary); }
.dt-marken { display: flex; gap: 4px; flex-shrink: 0; }
</style>
