<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="schliessen" @keydown.escape="schliessen">
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="dtcg-titel">
        <div class="modal-header">
          <h3 id="dtcg-titel" class="modal-title">DTCG-Export (W3C Design Tokens)</h3>
          <button class="modal-close" aria-label="Schließen" @click="schliessen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="modal-text">
            Die Änderungen des aktiven Themes werden auf die Token-Quelle angewendet und mit demselben
            Exporter wie <span class="mono">npm run tokens:dtcg</span> ausgegeben.
          </p>

          <p v-if="laedt" class="status">Export wird erstellt …</p>
          <div v-else-if="fehler" class="box error" data-test="dtcg-fehler">
            <p class="box-label">Export fehlgeschlagen</p>
            <p class="modal-text">{{ fehler }}</p>
          </div>
          <template v-else-if="ergebnis">
            <div class="box">
              <p class="box-label">Übernommene Änderungen</p>
              <p v-if="summe === 0" class="modal-text">Keine — der Export entspricht dem NEO-Standard (data/design-tokens.dtcg.json).</p>
              <ul v-else class="liste">
                <li v-for="z in zeilen" :key="z.label">{{ z.label }}: {{ z.anzahl }}</li>
              </ul>
              <p class="status mono">{{ ergebnis.zusammenfassung }}</p>
            </div>
            <div v-if="ergebnis.hinweise.length" class="box warn" data-test="dtcg-hinweise">
              <p class="box-label">Nicht (vollständig) im DTCG abgebildet</p>
              <ul class="liste">
                <li v-for="h in ergebnis.hinweise" :key="h">{{ h }}</li>
              </ul>
              <p class="status">Die Liste steht auch in der Datei unter $extensions["de.neocosmo"].themeExport.</p>
            </div>
          </template>
        </div>

        <div class="modal-footer">
          <button class="modal-btn secondary" @click="schliessen">Abbrechen</button>
          <button class="modal-btn primary" :disabled="!ergebnis || laedt" @click="herunterladen">Herunterladen</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// DTCG-Export-Dialog (Plan v2, 2.2): zeigt vor dem Download, was aus dem
// Theme in die Quelle uebernommen wurde und was sich nicht abbilden laesst.
import { computed, ref, watch } from 'vue'
import { useThemeStore } from '../../stores/theme.js'

const props = defineProps({ visible: { type: Boolean, default: false } })
const emit = defineEmits(['close'])
const store = useThemeStore()

const laedt = ref(false)
const fehler = ref('')
const ergebnis = ref(null)

const LABELS = { semantik: 'Semantische Farben', foundation: 'Foundation', komponenten: 'Komponenten-Tokens', primitives: 'Markenfarben', schriftskala: 'Schriftskala' }
const zeilen = computed(() => Object.entries(ergebnis.value?.uebernommen || {}).filter(([, n]) => n).map(([k, n]) => ({ label: LABELS[k] || k, anzahl: n })))
const summe = computed(() => zeilen.value.reduce((s, z) => s + z.anzahl, 0))

async function erstellen() {
  laedt.value = true
  fehler.value = ''
  ergebnis.value = null
  try {
    ergebnis.value = await store.exportAsDTCG()
  } catch (e) {
    fehler.value = e?.message || String(e)
  } finally {
    laedt.value = false
  }
}

watch(() => props.visible, (v) => { if (v) erstellen() }, { immediate: true })

function herunterladen() {
  if (!ergebnis.value) return
  store.downloadThemeDTCG(ergebnis.value.text, ergebnis.value.dateiname)
  emit('close')
}
function schliessen() { emit('close') }
</script>

<style scoped src="./_dialog.css"></style>
