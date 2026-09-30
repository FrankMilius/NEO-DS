<template>
  <div class="pl">
    <!-- Steuerung -->
    <div class="pl-leiste" role="toolbar" aria-label="Bühne einstellen">
      <div class="pl-schalter" role="group" aria-label="Folie">
        <button v-for="f in FOLIEN" :key="f.id" type="button" class="pl-knopf" :class="{ 'is-aktiv': folie === f.id }"
          :aria-pressed="folie === f.id" @click="folie = f.id">{{ f.label }}</button>
      </div>
      <label class="pl-feld">Welt
        <select v-model="welt" class="pl-select" :disabled="grundIstGruen">
          <option v-for="(w, name) in p.welten" :key="name" :value="name">{{ WELT_LABEL[name] || name }}</option>
        </select>
      </label>
      <div class="pl-schalter" role="group" aria-label="Grund">
        <button v-for="g in GRUENDE" :key="g.id" type="button" class="pl-knopf" :class="{ 'is-aktiv': grund === g.id }"
          :aria-pressed="grund === g.id" @click="grund = g.id">{{ g.label }}</button>
      </div>
      <div class="pl-schalter" role="group" aria-label="Dichtestufe">
        <button v-for="(d, name) in p.dichtestufen" :key="name" type="button" class="pl-knopf" :class="{ 'is-aktiv': dichte === name }"
          :aria-pressed="dichte === name" @click="dichte = name">{{ d.label || name }}</button>
      </div>
      <label class="pl-check"><input v-model="zeigeRaster" type="checkbox" /> Raster</label>
      <label class="pl-check"><input v-model="zeigeZonen" type="checkbox" /> Zonen</label>
    </div>

    <!-- Buehne 1920 x 1080, per scale() eingepasst -->
    <div ref="rahmen" class="pl-rahmen" :style="{ height: `${HOEHE * massstab}px` }">
      <div class="pl-buehne" data-test="buehne" :style="buehnenStil">
        <!-- Titelfolie -->
        <template v-if="folie === 'titel'">
          <div class="pl-kicker" :style="{ top: z.kicker_y }">NEO Workplace · {{ WELT_LABEL[welt] }}</div>
          <h2 class="pl-titel pl-titel--gross" :style="{ top: z.titel_y }">Digital Workplace, der mitwächst</h2>
          <div class="pl-haarlinie" :style="{ top: z.haarlinie_y }"></div>
          <p class="pl-text" :style="{ top: z.inhalt_von_y }">Quartalsauftakt für Kundinnen und Kunden aus dem öffentlichen Sektor – Stand, Ausblick und nächste Schritte.</p>
          <div class="pl-marke-flaeche"></div>
        </template>

        <!-- Statusbericht mit Ampel -->
        <template v-else-if="folie === 'status'">
          <div class="pl-kicker" :style="{ top: z.kicker_y }">Statusbericht · KW 40</div>
          <h2 class="pl-titel" :style="{ top: z.titel_y }">Drei Arbeitspakete, eine Entscheidung offen</h2>
          <div class="pl-haarlinie" :style="{ top: z.haarlinie_y }"></div>
          <div class="pl-status" :style="{ top: z.inhalt_von_y }">
            <div v-for="zeile in STATUSZEILEN" :key="zeile.ampel" class="pl-status-zeile">
              <span class="pl-punkt" :style="{ background: `var(--p-status-${zeile.ampel}-marke)` }"></span>
              <span class="pl-status-wort" :style="{ color: `var(--p-status-${zeile.ampel}-text)` }">{{ p.status.bedeutung[zeile.ampel] }}</span>
              <span class="pl-status-inhalt">{{ zeile.text }}</span>
            </div>
          </div>
        </template>

        <!-- Balkendiagramm aus der Farbfolge -->
        <template v-else>
          <div class="pl-kicker" :style="{ top: z.kicker_y }">Nutzung · Module</div>
          <h2 class="pl-titel" :style="{ top: z.titel_y }">Wissen wächst am stärksten</h2>
          <div class="pl-haarlinie" :style="{ top: z.haarlinie_y }"></div>
          <div class="pl-diagramm" :style="{ top: z.inhalt_von_y, height: inhaltHoehe }">
            <div class="pl-balken-feld">
              <div v-for="(b, i) in BALKEN" :key="b.label" class="pl-balken-spalte">
                <span class="pl-balken-wert">{{ b.wert }} %</span>
                <div class="pl-balken" :data-test="`balken-${i}`" :style="{ height: `${b.wert}%`, background: `var(--p-reihe-${i + 1})` }"></div>
              </div>
            </div>
            <div class="pl-achse"></div>
            <div class="pl-balken-labels">
              <span v-for="b in BALKEN" :key="b.label">{{ b.label }}</span>
            </div>
          </div>
        </template>

        <div class="pl-fuss" :style="{ top: z.fuss_y }">
          <span>neocosmo</span><span>{{ p.dichtestufen[dichte]?.label }} · {{ grundLabel }}</span>
        </div>

        <!-- Ueberlagerungen -->
        <div v-if="zeigeRaster" class="pl-raster" data-test="raster" aria-hidden="true">
          <div v-for="n in felder" :key="n" class="pl-raster-feld" :style="{ left: `${rand + (n - 1) * (feld + steg)}px`, width: `${feld}px` }"></div>
        </div>
        <div v-if="zeigeZonen" class="pl-zonen" data-test="zonen" aria-hidden="true">
          <div v-for="(y, name) in p.figma.zonen" :key="name" class="pl-zone" :style="{ top: y }"><span>{{ name }} · {{ y }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Plan v2, Schritt 2.5: Buehne fuer die Folien-Grammatik. Masse aus
// foundation.praesentation.figma (1920 x 1080), Schriftgroessen aus der
// Dichtestufe (px = pt x 2), Farben ueber lokale Custom Properties aus
// store.currentPraesentation — jede Aenderung im Inspector wirkt sofort.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { loeseAuf } from '../../utils/praes-ref.js'

const store = useThemeStore()
const p = computed(() => store.currentPraesentation)

const FOLIEN = [
  { id: 'titel', label: 'Titelfolie' },
  { id: 'status', label: 'Statusbericht' },
  { id: 'diagramm', label: 'Balkendiagramm' }
]
const GRUENDE = [
  { id: 'hell', label: 'Hell' }, { id: 'satt', label: 'Satt' }, { id: 'tief', label: 'Tief' },
  { id: 'forest', label: 'Forest' }, { id: 'mint', label: 'Mint' }
]
const WELT_LABEL = { menschen: 'Menschen', wissen: 'Wissen', systeme: 'Systeme', daten: 'Daten' }
const STATUSZEILEN = [
  { ampel: 'gruen', text: 'Intranet-Relaunch: Inhalte migriert, Abnahme am 14.10.' },
  { ampel: 'gelb', text: 'Schnittstelle Personalverwaltung: Lasttest wird wiederholt.' },
  { ampel: 'rot', text: 'Single Sign-on: Budget für den zweiten Mandanten freigeben.' }
]
const BALKEN = [
  { label: 'Menschen', wert: 42 }, { label: 'Systeme', wert: 55 }, { label: 'Daten', wert: 61 },
  { label: 'Wissen', wert: 88 }, { label: 'Dokumente', wert: 47 }, { label: 'Termine', wert: 36 }
]

const folie = ref('titel')
const welt = ref('wissen')
const grund = ref('hell')
const dichte = ref('vortrag')
const zeigeRaster = ref(false)
const zeigeZonen = ref(false)

const BREITE = 1920
const HOEHE = 1080
const px = (v) => parseFloat(v) || 0
const z = computed(() => p.value.figma.zonen)
const rand = computed(() => px(p.value.figma.raster.rand))
const feld = computed(() => px(p.value.figma.raster.feld))
const steg = computed(() => px(p.value.figma.raster.steg))
const felder = computed(() => Number(p.value.figma.raster.felder) || 6)
const inhaltHoehe = computed(() => `${px(z.value.inhalt_bis_y) - px(z.value.inhalt_von_y)}px`)
const grundIstGruen = computed(() => grund.value === 'forest' || grund.value === 'mint')
const grundLabel = computed(() => (grundIstGruen.value ? GRUENDE.find((g) => g.id === grund.value).label : `${WELT_LABEL[welt.value]} ${grund.value}`))

// Farbrollen je Grund (Regeln aus welten/_notiz und gruenfamilie/_notiz)
const farben = computed(() => {
  const w = p.value.welten[welt.value] || {}
  const r = p.value.gruenfamilie.rollen
  const graphit950 = 'graphit.950'
  const satz = {
    hell: { grund: w.hell, text: graphit950, kicker: w.tief, linie: w.satt, flaeche: w.satt, dunkel: false },
    satt: { grund: w.satt, text: graphit950, kicker: graphit950, linie: graphit950, flaeche: w.hell, dunkel: false },
    tief: { grund: w.tief, text: '#ffffff', kicker: w.satt, linie: w.satt, flaeche: w.satt, dunkel: true },
    forest: { grund: r.grund, text: r.text_auf_forest?.[0], kicker: r.mono_auf_forest, linie: r.signal, flaeche: r.flaeche_auf_forest, dunkel: true },
    mint: { grund: r.papier, text: r.text_auf_mint?.[0], kicker: r.mono_auf_mint, linie: r.text_auf_mint?.[1], flaeche: r.flaeche_auf_mint, dunkel: false }
  }
  return satz[grund.value]
})

const buehnenStil = computed(() => {
  const f = farben.value
  const d = p.value.dichtestufen[dichte.value] || {}
  const ampel = p.value.status[f.dunkel ? 'tief' : 'hell']
  const dia = p.value.diagramm
  const stil = {
    width: `${BREITE}px`,
    height: `${HOEHE}px`,
    transform: `scale(${massstab.value})`,
    '--p-grund': loeseAuf(f.grund),
    '--p-text': loeseAuf(f.text),
    '--p-kicker': loeseAuf(f.kicker),
    '--p-linie': loeseAuf(f.linie),
    '--p-flaeche': loeseAuf(f.flaeche),
    '--p-achse': loeseAuf(dia.achse),
    '--p-beschriftung': f.dunkel ? loeseAuf(f.text) : loeseAuf(dia.beschriftung),
    '--p-hervorhebung': loeseAuf(dia.hervorhebung),
    '--p-rand': `${rand.value}px`,
    '--p-titel-breite': `${5 * feld.value + 4 * steg.value}px`,
    '--p-inhalt-breite': `${felder.value * feld.value + (felder.value - 1) * steg.value}px`,
    '--p-titel-px': `${(d.titel_pt || 36) * 2}px`,
    '--p-text-px': `${(d.text_pt || 22) * 2}px`,
    '--p-kicker-px': `${(d.kicker_pt || 11) * 2}px`,
    '--p-fuss-px': `${(d.fuss_pt || 9) * 2}px`
  }
  for (const [name, s] of Object.entries(ampel)) {
    stil[`--p-status-${name}-marke`] = loeseAuf(s.marke)
    stil[`--p-status-${name}-text`] = loeseAuf(s.text)
  }
  dia.farbfolge.forEach((ref, i) => { stil[`--p-reihe-${i + 1}`] = loeseAuf(ref) })
  return stil
})

// Einpassen: Breite des Rahmens / 1920
const rahmen = ref(null)
const massstab = ref(0.5)
let beobachter = null
function messe() {
  const b = rahmen.value?.clientWidth
  if (b) massstab.value = b / BREITE
}
onMounted(() => {
  messe()
  if (typeof ResizeObserver !== 'undefined' && rahmen.value) {
    beobachter = new ResizeObserver(messe)
    beobachter.observe(rahmen.value)
  }
})
onBeforeUnmount(() => beobachter?.disconnect())
</script>

<style scoped>
.pl { display: flex; flex-direction: column; gap: 12px; }
.pl-leiste { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
.pl-schalter {
  display: inline-flex; padding: 2px; gap: 2px; border-radius: 6px;
  background: var(--cfg-surface-elevated); border: 1px solid var(--cfg-border);
}
.pl-knopf {
  height: 24px; padding: 0 8px; border: 0; border-radius: 4px; cursor: pointer;
  background: transparent; color: var(--cfg-text-secondary);
  font-size: 11px; font-family: var(--cfg-font-body);
}
.pl-knopf:hover { color: var(--cfg-text); }
.pl-knopf.is-aktiv { background: var(--cfg-surface); color: var(--cfg-text); box-shadow: var(--cfg-shadow-sm); font-weight: 600; }
.pl-feld, .pl-check { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: var(--cfg-text-secondary); }
.pl-select {
  height: 26px; padding: 0 6px; border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text); font-size: 11px; font-family: var(--cfg-font-body);
}
.pl-select:disabled { opacity: 0.5; }

.pl-rahmen {
  position: relative; width: 100%; overflow: hidden;
  border: 1px solid var(--cfg-border); border-radius: 4px; background: var(--cfg-surface);
}

/* --- Folie: nur NEO-DS-Schriften und lokale --p-* Farben --- */
.pl-buehne {
  position: absolute; top: 0; left: 0; transform-origin: top left; overflow: hidden;
  background: var(--p-grund); color: var(--p-text);
  font-family: var(--font-body, 'Manrope'), 'Manrope', sans-serif;
  transition: background-color 0.2s, color 0.2s;
}
.pl-kicker, .pl-titel, .pl-haarlinie, .pl-text, .pl-status, .pl-diagramm, .pl-fuss { position: absolute; left: var(--p-rand); margin: 0; }
.pl-kicker {
  font-family: var(--font-mono, 'JetBrains Mono'), 'JetBrains Mono', monospace;
  font-size: var(--p-kicker-px); letter-spacing: 0.08em; text-transform: uppercase; color: var(--p-kicker);
}
.pl-titel {
  width: var(--p-titel-breite);
  font-family: var(--font-heading, 'Space Grotesk'), 'Space Grotesk', sans-serif;
  font-size: var(--p-titel-px); font-weight: 700; line-height: 1.1; letter-spacing: -0.01em;
}
.pl-titel--gross { font-size: calc(var(--p-titel-px) * 1.5); }
.pl-haarlinie { width: var(--p-inhalt-breite); height: 2px; background: var(--p-linie); }
.pl-text { width: var(--p-titel-breite); font-size: var(--p-text-px); line-height: 1.45; }
.pl-marke-flaeche {
  position: absolute; right: var(--p-rand); bottom: 150px; width: 260px; height: 260px;
  background: var(--p-flaeche); border-radius: 50%;
}
.pl-fuss {
  width: var(--p-inhalt-breite); display: flex; justify-content: space-between;
  font-family: var(--font-mono, 'JetBrains Mono'), 'JetBrains Mono', monospace;
  font-size: var(--p-fuss-px); color: var(--p-kicker); opacity: 0.85;
}

.pl-status { width: var(--p-inhalt-breite); display: flex; flex-direction: column; }
.pl-status-zeile {
  display: grid; grid-template-columns: 40px 520px 1fr; align-items: baseline; gap: 20px;
  padding: 28px 0; border-bottom: 1px solid color-mix(in srgb, var(--p-text) 18%, transparent);
  font-size: var(--p-text-px);
}
.pl-punkt { width: 28px; height: 28px; border-radius: 50%; align-self: center; }
.pl-status-wort { font-weight: 700; }

.pl-diagramm { width: var(--p-inhalt-breite); display: flex; flex-direction: column; }
.pl-balken-feld { flex: 1; display: flex; align-items: flex-end; gap: 40px; padding: 0 40px; }
.pl-balken-spalte { flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: stretch; gap: 10px; }
.pl-balken { width: 100%; }
.pl-balken-wert, .pl-balken-labels {
  font-family: var(--font-mono, 'JetBrains Mono'), 'JetBrains Mono', monospace;
  font-size: var(--p-kicker-px); color: var(--p-beschriftung); text-align: center;
}
.pl-achse { height: 2px; background: var(--p-achse); }
.pl-balken-labels { display: flex; gap: 40px; padding: 12px 40px 0; }
.pl-balken-labels > span { flex: 1; }

/* --- Ueberlagerungen (Hilfslinien, App-Farbe) --- */
.pl-raster, .pl-zonen { position: absolute; inset: 0; pointer-events: none; }
.pl-raster-feld { position: absolute; top: 0; bottom: 0; background: color-mix(in srgb, var(--cfg-highlight) 14%, transparent); border-left: 1px solid var(--cfg-highlight); border-right: 1px solid var(--cfg-highlight); }
.pl-zone { position: absolute; left: 0; right: 0; border-top: 2px dashed var(--cfg-processing); }
.pl-zone > span {
  position: absolute; right: 8px; top: 2px; padding: 2px 6px; font-size: 16px;
  font-family: var(--cfg-font-mono); background: var(--cfg-processing); color: #fff;
}
</style>
