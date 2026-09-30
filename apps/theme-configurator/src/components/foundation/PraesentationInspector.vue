<template>
  <div class="pi">
    <div class="pi-kopf">
      <p class="pi-desc">
        Folien-Grammatik aus <code>foundation.praesentation</code>: Welten, Grünfamilie, Statusampel,
        Diagrammfarben und Dichtestufen. Änderungen gelten für das aktive Theme-Set und erscheinen sofort in der Bühne.
      </p>
      <button type="button" class="pi-reset" :disabled="!anzahl" @click="store.resetPraesentation()">
        Zurücksetzen<span v-if="anzahl" class="pi-zahl">{{ anzahl }}</span>
      </button>
    </div>

    <!-- Welten -->
    <section class="pi-gruppe">
      <h3 class="pi-titel">Welten</h3>
      <p class="pi-hinweis">Eine Welt je Komposition: hell = Papier, satt = Fläche mit Graphit 950, tief = Fläche mit heller Schrift.</p>
      <div v-for="(welt, name) in p.welten" :key="name" class="pi-block">
        <div class="pi-block-kopf">
          <span class="pi-ebene" :style="{ background: welt.ebene }"></span>
          <span class="pi-block-name">{{ WELT_LABEL[name] || name }}</span>
          <code class="pi-code">{{ welt.ebene }}</code>
        </div>
        <PraesFarbwahl v-for="stufe in ['hell', 'satt', 'tief']" :key="stufe" :label="stufe"
          :model-value="welt[stufe]" @update:model-value="setze(`welten.${name}.${stufe}`, $event)" />
      </div>
    </section>

    <!-- Gruenfamilie -->
    <section class="pi-gruppe">
      <h3 class="pi-titel">Grünfamilie · Rollen</h3>
      <template v-for="(wert, rolle) in p.gruenfamilie.rollen" :key="rolle">
        <template v-if="Array.isArray(wert)">
          <PraesFarbwahl v-for="(eintrag, i) in wert" :key="`${rolle}-${i}`" :label="`${rolleLabel(rolle)} ${i + 1}`"
            :model-value="eintrag" @update:model-value="setzeListe(`gruenfamilie.rollen.${rolle}`, wert, i, $event)" />
        </template>
        <PraesFarbwahl v-else :label="rolleLabel(rolle)" :model-value="wert"
          @update:model-value="setze(`gruenfamilie.rollen.${rolle}`, $event)" />
      </template>
    </section>

    <!-- Status -->
    <section class="pi-gruppe">
      <h3 class="pi-titel">Status</h3>
      <p class="pi-hinweis">Marke ≥ 3,0 : 1 (WCAG 1.4.11), Text ≥ 4,5 : 1 (1.4.3). Das Wort steht immer neben der Farbe.</p>
      <div v-for="grund in ['hell', 'tief']" :key="grund" class="pi-block">
        <div class="pi-block-kopf">
          <span class="pi-ebene" :style="{ background: GRUND_HEX[grund] }"></span>
          <span class="pi-block-name">Grund {{ grund }}</span>
          <code class="pi-code">{{ GRUND_REF[grund] }}</code>
        </div>
        <template v-for="(werte, ampel) in p.status[grund]" :key="ampel">
          <div class="pi-ampel">{{ p.status.bedeutung[ampel] }}</div>
          <PraesFarbwahl v-for="art in ['marke', 'text']" :key="art" :label="art" :model-value="werte[art]"
            @update:model-value="setze(`status.${grund}.${ampel}.${art}`, $event)">
            <span class="pi-kontrast" :class="kontrastKlasse(werte[art], grund, art)" :data-test="`kontrast-${grund}-${ampel}-${art}`">
              {{ kontrastText(werte[art], grund) }}
            </span>
          </PraesFarbwahl>
        </template>
      </div>
    </section>

    <!-- Diagramm -->
    <section class="pi-gruppe">
      <h3 class="pi-titel">Diagramm · Farbfolge</h3>
      <p class="pi-hinweis">Ein Wert trägt den Akzent, alles andere liegt auf der Graphitleiter. Reihenfolge = accent1–6 im PowerPoint-Master.</p>
      <div v-for="(eintrag, i) in p.diagramm.farbfolge" :key="i" class="pi-folge">
        <span class="pi-nr">{{ i + 1 }}</span>
        <PraesFarbwahl :model-value="eintrag" @update:model-value="setzeListe('diagramm.farbfolge', p.diagramm.farbfolge, i, $event)" />
        <button type="button" class="pi-pfeil" :disabled="i === 0" :aria-label="`Reihe ${i + 1} nach oben`" @click="verschiebe(i, -1)">↑</button>
        <button type="button" class="pi-pfeil" :disabled="i === p.diagramm.farbfolge.length - 1" :aria-label="`Reihe ${i + 1} nach unten`" @click="verschiebe(i, 1)">↓</button>
      </div>
      <PraesFarbwahl v-for="rolle in ['hervorhebung', 'achse', 'beschriftung']" :key="rolle" :label="rolle"
        :model-value="p.diagramm[rolle]" @update:model-value="setze(`diagramm.${rolle}`, $event)" />
    </section>

    <!-- Dichtestufen -->
    <section class="pi-gruppe">
      <h3 class="pi-titel">Dichtestufen</h3>
      <p class="pi-hinweis">Punkt bei 1920 px Folienbreite: 1 pt = 2 px.</p>
      <div class="pi-dichte">
        <div class="pi-dichte-kopf"></div>
        <div v-for="(stufe, name) in p.dichtestufen" :key="name" class="pi-dichte-kopf">{{ stufe.label || name }}</div>
        <template v-for="feld in DICHTE_FELDER" :key="feld.key">
          <label class="pi-dichte-label">{{ feld.label }}</label>
          <input v-for="(stufe, name) in p.dichtestufen" :key="`${name}-${feld.key}`" type="number" min="1" step="1"
            class="pi-zahl-input" :value="stufe[feld.key] ?? ''" :placeholder="stufe[feld.key] == null ? 'frei' : ''"
            :aria-label="`${stufe.label || name}: ${feld.label}`"
            @change="setzeZahl(`dichtestufen.${name}.${feld.key}`, $event.target.value)" />
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
// Plan v2, Schritt 2.5: Inspector fuer foundation.praesentation.
// Schreibt ueber store.updatePraesentation (Punkt-Pfade, Undo-faehig).
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { kontrast, loeseAuf } from '../../utils/praes-ref.js'
import PraesFarbwahl from './PraesFarbwahl.vue'

const store = useThemeStore()
const p = computed(() => store.currentPraesentation)
const anzahl = computed(() => Object.keys(store.state.foundationOverrides[store.state.activeThemeSet]?.praesentation || {}).length)

const WELT_LABEL = { menschen: 'Menschen', wissen: 'Wissen', systeme: 'Systeme', daten: 'Daten' }
// Pruefgrund der Statusfarben: Papier (Graphit 100) bzw. Graphit 950
const GRUND_REF = { hell: 'graphit.100', tief: 'graphit.950' }
const GRUND_HEX = { hell: loeseAuf(GRUND_REF.hell), tief: loeseAuf(GRUND_REF.tief) }
const DICHTE_FELDER = [
  { key: 'titel_pt', label: 'Titel (pt)' },
  { key: 'text_pt', label: 'Text (pt)' },
  { key: 'kicker_pt', label: 'Kicker (pt)' },
  { key: 'fuss_pt', label: 'Fuß (pt)' },
  { key: 'titelzone_mm', label: 'Titelzone (mm)' },
  { key: 'woerter_max', label: 'Wörter max.' }
]

const rolleLabel = (r) => r.replace(/_/g, ' ')

function setze(pfad, wert) { store.updatePraesentation(pfad, wert) }
function setzeListe(pfad, liste, i, wert) {
  const neu = [...liste]
  neu[i] = wert
  store.updatePraesentation(pfad, neu)
}
function verschiebe(i, richtung) {
  const neu = [...p.value.diagramm.farbfolge]
  const j = i + richtung
  ;[neu[i], neu[j]] = [neu[j], neu[i]]
  store.updatePraesentation('diagramm.farbfolge', neu)
}
function setzeZahl(pfad, roh) {
  const zahl = roh === '' ? null : Number(roh)
  if (zahl !== null && (!Number.isFinite(zahl) || zahl <= 0)) return
  store.updatePraesentation(pfad, zahl)
}

function kontrastWert(ref, grund) { return kontrast(loeseAuf(ref, { still: true }), GRUND_HEX[grund]) }
function kontrastText(ref, grund) {
  const k = kontrastWert(ref, grund)
  return k ? `${k.toFixed(2).replace('.', ',')} : 1` : '–'
}
function kontrastKlasse(ref, grund, art) {
  const k = kontrastWert(ref, grund)
  if (!k) return ''
  return k >= (art === 'text' ? 4.5 : 3) ? 'pi-kontrast--ok' : 'pi-kontrast--fehl'
}
</script>

<style scoped>
.pi { display: flex; flex-direction: column; gap: 20px; }
.pi-kopf { display: flex; flex-direction: column; gap: 10px; }
.pi-desc, .pi-hinweis { font-size: 12px; color: var(--cfg-text-muted); margin: 0; line-height: 1.5; }
.pi-hinweis { font-size: 11px; }
.pi-reset {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 6px;
  height: 28px; padding: 0 10px; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--cfg-border); background: var(--cfg-surface); color: var(--cfg-text);
  font-size: 12px; font-family: var(--cfg-font-body);
}
.pi-reset:hover:not(:disabled) { border-color: var(--cfg-accent); color: var(--cfg-accent); }
.pi-reset:disabled { opacity: 0.5; cursor: default; }
.pi-zahl {
  font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 8px;
  background: var(--cfg-accent-subtle); color: var(--cfg-accent);
}
.pi-gruppe { display: flex; flex-direction: column; gap: 8px; }
.pi-titel { font-size: 13px; font-weight: 700; color: var(--cfg-text); margin: 0; font-family: var(--cfg-font-heading); }
.pi-block {
  display: flex; flex-direction: column; gap: 6px; padding: 8px;
  border: 1px solid var(--cfg-border); border-radius: 6px; background: var(--cfg-surface);
}
.pi-block-kopf { display: flex; align-items: center; gap: 6px; }
.pi-block-name { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.pi-ebene { width: 10px; height: 10px; border-radius: 50%; border: 1px solid var(--cfg-border); }
.pi-code { margin-left: auto; font-size: 10px; color: var(--cfg-text-muted); font-family: var(--cfg-font-mono); }
.pi-ampel { font-size: 11px; font-weight: 600; color: var(--cfg-text-secondary); margin-top: 4px; }
.pi-kontrast { font-size: 10px; font-family: var(--cfg-font-mono); padding: 1px 4px; border-radius: 3px; white-space: nowrap; }
.pi-kontrast--ok { background: var(--cfg-indicator-pass-bg); color: var(--cfg-text); }
.pi-kontrast--fehl { background: var(--cfg-indicator-fail-bg); color: var(--cfg-danger); }
.pi-folge { display: flex; align-items: center; gap: 4px; }
.pi-folge > .pf { flex: 1; }
.pi-nr { width: 14px; font-size: 10px; color: var(--cfg-text-muted); font-family: var(--cfg-font-mono); text-align: right; }
.pi-pfeil {
  width: 22px; height: 22px; padding: 0; border-radius: 4px; cursor: pointer;
  border: 1px solid var(--cfg-border); background: var(--cfg-surface); color: var(--cfg-text-secondary); font-size: 11px;
}
.pi-pfeil:disabled { opacity: 0.35; cursor: default; }
.pi-pfeil:hover:not(:disabled) { border-color: var(--cfg-accent); color: var(--cfg-accent); }
.pi-dichte { display: grid; grid-template-columns: 1fr 72px 72px; gap: 4px 8px; align-items: center; }
.pi-dichte-kopf { font-size: 11px; font-weight: 600; color: var(--cfg-text-secondary); }
.pi-dichte-label { font-size: 11px; color: var(--cfg-text-secondary); }
.pi-zahl-input {
  height: 24px; width: 100%; padding: 0 6px; box-sizing: border-box;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 11px; font-family: var(--cfg-font-mono); text-align: right;
}
.pi-zahl-input:focus { outline: none; border-color: var(--cfg-accent); }
</style>
