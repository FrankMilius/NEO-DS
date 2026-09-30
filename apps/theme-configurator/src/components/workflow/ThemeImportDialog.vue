<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="abbrechen">
      <div ref="dialogRef" class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="import-titel" tabindex="-1">
        <div class="modal-header">
          <h2 id="import-titel" class="modal-title">Theme importieren</h2>
          <button type="button" class="modal-close" aria-label="Schließen" @click="abbrechen">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="modal-body">
          <p class="modal-text">
            JSON-Datei aus „Export as JSON“ wählen. Sie wird geprüft und in einer Vorschau gezeigt;
            erst „Übernehmen“ ändert das aktive Theme ({{ themeSetLabel }}) — als ein Schritt, den „Rückgängig“ zurücknimmt.
          </p>

          <input aria-label="Theme-Datei" ref="dateiInput" type="file" accept=".json,application/json" class="visually-hidden" tabindex="-1" aria-hidden="true" data-test="import-datei" @change="dateiGewaehlt" />
          <div>
            <button type="button" class="modal-btn secondary" @click="dateiInput?.click()">Datei wählen …</button>
            <span v-if="dateiname" class="status mono"> {{ dateiname }}</span>
          </div>

          <div v-if="pruefung && !pruefung.ok" class="box error" role="alert" data-test="import-fehler">
            <p class="box-label">Import abgelehnt — {{ pruefung.fehler.length }} {{ pruefung.fehler.length === 1 ? 'Fehler' : 'Fehler' }}</p>
            <ul class="liste">
              <li v-for="(f, i) in pruefung.fehler" :key="i">{{ f }}</li>
            </ul>
          </div>

          <template v-if="pruefung && pruefung.ok">
            <div class="box" data-test="import-vorschau">
              <p class="box-label">Vorschau{{ pruefung.meta?.name ? ` — ${pruefung.meta.name}` : '' }} (Version {{ pruefung.meta?.version }})</p>
              <p v-if="gesamt === 0" class="modal-text">Keine Änderungen — die Datei entspricht dem aktuellen Theme.</p>
              <div v-for="b in pruefung.vorschau" :key="b.schluessel" class="bereich">
                <div class="bereich-kopf">
                  <span>{{ b.label }}</span>
                  <span class="mono">{{ b.anzahl }} {{ b.anzahl === 1 ? 'Änderung' : 'Änderungen' }}</span>
                </div>
                <ul v-if="b.beispiele.length" class="liste beispiele">
                  <li v-for="x in b.beispiele" :key="x.pfad" class="mono">
                    {{ x.pfad }}: {{ x.alt ?? '—' }} → {{ x.neu ?? '(entfernt)' }}
                  </li>
                </ul>
              </div>
            </div>
            <p class="status">Eigene Tokens, Schriften und Icon-Einstellungen sind nicht Teil des Export-Formats und bleiben unverändert.</p>
          </template>
        </div>

        <div class="modal-footer">
          <button type="button" class="modal-btn secondary" @click="abbrechen">Abbrechen</button>
          <button type="button" class="modal-btn primary" :disabled="!pruefung?.ok || gesamt === 0" data-test="import-uebernehmen" @click="uebernehmen">Übernehmen</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// Theme-Import-Dialog (Plan v2, 2.2): Datei waehlen -> Schema-Pruefung ->
// Vorschau je Bereich -> Uebernehmen (eine Store-Aktion, ein Undo-Schritt).
// Abbrechen aendert nichts.
import { computed, ref, watch } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { useFokusFalle } from '../../composables/useFokusFalle.js'

const props = defineProps({ visible: { type: Boolean, default: false } })
const emit = defineEmits(['close', 'imported'])
const store = useThemeStore()
const dialogRef = ref(null)
useFokusFalle(dialogRef, () => props.visible, { beiEscape: () => abbrechen() })

const dateiInput = ref(null)
const dateiname = ref('')
const pruefung = ref(null)

const themeSetLabel = computed(() => (store.state.activeThemeSet === 'customer' ? 'Customer Theme' : 'NEO Theme'))
const gesamt = computed(() => (pruefung.value?.vorschau || []).reduce((s, b) => s + b.anzahl, 0))

watch(() => props.visible, (v) => { if (v) { dateiname.value = ''; pruefung.value = null } })

/** Text pruefen — auch direkt aufrufbar (Tests, Drag & Drop). */
function pruefeText(text, name = '') {
  dateiname.value = name
  pruefung.value = store.pruefeImport(text)
  return pruefung.value
}

async function dateiGewaehlt(e) {
  const datei = e.target.files?.[0]
  if (!datei) return
  const text = await datei.text()
  pruefeText(text, datei.name)
  e.target.value = ''
}

function uebernehmen() {
  if (!pruefung.value?.ok) return
  store.importTheme(pruefung.value.ziel)
  emit('imported', pruefung.value.meta)
  emit('close')
}
function abbrechen() { emit('close') }

defineExpose({ pruefeText })
</script>

<style scoped src="./_dialog.css"></style>
<style scoped>
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.bereich { padding: 8px 0; border-top: 1px solid var(--cfg-border); }
.bereich:first-of-type { border-top: none; }
.bereich-kopf { display: flex; justify-content: space-between; gap: 12px; font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.beispiele { margin-top: 6px; color: var(--cfg-text-secondary); word-break: break-all; }
</style>
