<template>
  <!--
    Ein Formular „… hinzufügen“ für alle Foundation-Editoren (Befund UX-52,
    19.10.2026). Vorher hatte jeder Editor sein eigenes: Radius mit Enter
    und Escape, Spacing als Aufklapp-Dialog ohne Abbrechen, mal mit, mal ohne
    Fehlermeldung. Jetzt überall gleich: Knopf öffnet, erstes Feld hat den
    Fokus, Enter fügt hinzu, Escape bricht ab, Fehler stehen am Feld.
  -->
  <div class="hf" :data-test="testId">
    <button
      v-if="!offen"
      ref="oeffnenKnopf"
      type="button"
      class="hf-oeffnen"
      :aria-expanded="'false'"
      @click="oeffnen"
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
      {{ knopfText }}
    </button>

    <form v-else class="hf-formular" :aria-label="knopfText" novalidate @submit.prevent="absenden" @keydown.escape.stop.prevent="abbrechen">
      <div class="hf-felder">
        <div v-for="(f, i) in felder" :key="f.name" class="hf-feld">
          <label class="hf-label" :for="`${basis}-${f.name}`">{{ f.label }}</label>
          <div class="hf-eingabe">
            <select
              v-if="f.typ === 'auswahl'"
              :id="`${basis}-${f.name}`"
              v-model="werte[f.name]"
              class="hf-input"
              :aria-invalid="fehlerFeld === f.name ? 'true' : undefined"
              :aria-describedby="fehlerFeld === f.name ? `${basis}-fehler` : undefined"
            >
              <option v-for="o in f.optionen" :key="o.wert" :value="o.wert">{{ o.text }}</option>
            </select>
            <input
              v-else
              :id="`${basis}-${f.name}`"
              :ref="(el) => { if (i === 0) erstesFeld = el }"
              v-model="werte[f.name]"
              :type="f.typ === 'zahl' ? 'number' : 'text'"
              :inputmode="f.typ === 'zahl' ? 'decimal' : undefined"
              class="hf-input"
              :placeholder="f.platzhalter"
              :aria-invalid="fehlerFeld === f.name ? 'true' : undefined"
              :aria-describedby="fehlerFeld === f.name ? `${basis}-fehler` : (f.hilfe ? `${basis}-${f.name}-hilfe` : undefined)"
              autocomplete="off"
            />
            <span v-if="f.einheit" class="hf-einheit">{{ f.einheit }}</span>
          </div>
          <span v-if="f.hilfe" :id="`${basis}-${f.name}-hilfe`" class="hf-hilfe">{{ typeof f.hilfe === 'function' ? f.hilfe(werte) : f.hilfe }}</span>
        </div>
      </div>
      <slot name="vorschau" :werte="werte" />
      <p v-if="fehler" :id="`${basis}-fehler`" class="hf-fehler" role="alert" data-test="hinzufuegen-fehler">{{ fehler }}</p>
      <div class="hf-aktionen">
        <button type="button" class="hf-knopf" @click="abbrechen">Abbrechen</button>
        <button type="submit" class="hf-knopf hf-knopf--primaer">Hinzufügen</button>
      </div>
    </form>
    <p class="cfg-sr-only" aria-live="polite">{{ ansage }}</p>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, useId } from 'vue'

const props = defineProps({
  /** Text des Knopfs, z. B. „Eckenradius hinzufügen“ */
  knopfText: { type: String, required: true },
  /**
   * Felder: { name, label, typ: 'text'|'zahl'|'auswahl', platzhalter?,
   * optionen?: [{ wert, text }], einheit?, hilfe?: string | (werte) => string,
   * start?: Anfangswert }
   */
  felder: { type: Array, required: true },
  /** (werte) => { feld, text } | null — Prüfung vor dem Hinzufügen */
  pruefe: { type: Function, default: () => null },
  testId: { type: String, default: undefined },
})

const emit = defineEmits(['hinzufuegen'])

const basis = `hf-${useId()}`
const offen = ref(false)
const oeffnenKnopf = ref(null)
let erstesFeld = null
const werte = reactive({})
const fehler = ref('')
const fehlerFeld = ref('')
const ansage = ref('')

function zuruecksetzen () {
  for (const f of props.felder) werte[f.name] = f.start ?? (f.typ === 'auswahl' ? f.optionen?.[0]?.wert ?? '' : '')
  fehler.value = ''
  fehlerFeld.value = ''
}

function oeffnen () {
  zuruecksetzen()
  ansage.value = ''
  offen.value = true
  nextTick(() => erstesFeld?.focus())
}

function schliessen () {
  offen.value = false
  nextTick(() => oeffnenKnopf.value?.focus())
}

function abbrechen () {
  zuruecksetzen()
  schliessen()
}

function absenden () {
  const ergebnis = props.pruefe({ ...werte })
  if (ergebnis) {
    fehler.value = ergebnis.text
    fehlerFeld.value = ergebnis.feld || ''
    nextTick(() => document.getElementById(`${basis}-${ergebnis.feld}`)?.focus())
    return
  }
  const kopie = { ...werte }
  emit('hinzufuegen', kopie)
  const erster = props.felder[0]?.name
  ansage.value = `„${String(kopie[erster] ?? '').trim()}“ hinzugefügt.`
  zuruecksetzen()
  schliessen()
}

defineExpose({ oeffnen })
</script>

<style scoped>
.hf { display: grid; gap: 8px; }
.hf-oeffnen {
  justify-self: start; display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border: 1px dashed var(--cfg-border); border-radius: 8px;
  background: transparent; color: var(--cfg-text); font: inherit; font-size: 13px; cursor: pointer;
}
.hf-oeffnen:hover { border-color: var(--cfg-accent); }
.hf-formular { display: grid; gap: 10px; padding: 12px; border: 1px solid var(--cfg-border); border-radius: 8px; background: var(--cfg-surface-elevated); }
.hf-felder { display: flex; flex-wrap: wrap; gap: 10px; }
.hf-feld { display: grid; gap: 4px; flex: 1 1 140px; min-width: 0; }
.hf-label { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.hf-eingabe { display: flex; align-items: center; gap: 6px; }
.hf-input {
  flex: 1; min-width: 0; height: 32px; padding: 0 8px; border: 1px solid var(--cfg-border); border-radius: 6px;
  background: var(--cfg-surface); color: var(--cfg-text); font: inherit; font-size: 13px;
}
.hf-input[aria-invalid='true'] { border-color: var(--fnd-color-border-danger); }
.hf-einheit, .hf-hilfe { font-size: 12px; color: var(--cfg-text-secondary); }
.hf-fehler { margin: 0; font-size: 12px; color: var(--fnd-color-text-danger); }
.hf-aktionen { display: flex; justify-content: flex-end; gap: 8px; }
.hf-knopf {
  padding: 6px 12px; border: 1px solid var(--cfg-border); border-radius: 6px;
  background: var(--cfg-surface); color: var(--cfg-text); font: inherit; font-size: 13px; cursor: pointer;
}
.hf-knopf--primaer { background: var(--cfg-accent); border-color: var(--cfg-accent); color: var(--fnd-color-text-on-interactive); font-weight: 600; }
.hf-oeffnen:focus-visible, .hf-input:focus-visible, .hf-knopf:focus-visible { outline: 2px solid var(--cfg-accent); outline-offset: 2px; }
</style>
