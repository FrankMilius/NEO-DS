<template>
  <!--
    Ansicht „Auf der Seite“ (Schritt f, 19.10.2026): der Website-Ausschnitt im
    geöffneten Theme, darüber Markierungen, wo die Werte dieser Grundlage
    wirken. Gemessen aus den berechneten Stilen (utils/auf-der-seite.js).
  -->
  <div class="ads" :data-kategorie="kategorie" data-test="auf-der-seite">
    <p class="ads-hinweis">{{ HINWEIS[kategorie] || 'Wo die Werte auf der Website wirken.' }} Markiert ist, was auf der Seite diese Werte trägt.</p>
    <div class="ads-raster" :class="{ 'ads-raster--zwei': ansichten.length > 1 }">
      <div v-for="a in ansichten" :key="a.klasse" class="ads-feld">
        <span v-if="ansichten.length > 1" class="ads-titel">{{ a.label }}</span>
        <div :ref="(el) => setzeFeld(a.klasse, el)" class="ads-buehne" :class="{ 'ads-fokus': kategorie === 'focus' }">
          <WebsiteAusschnitt :set="a.set" :modus="a.modus" :label="a.label" :komponenten="['card', 'button', 'badge', 'input', 'form-field', 'form-label']">
            <WebsiteBeispiel :id-praefix="`ads-${a.klasse}`" :mit-deaktiviert="kategorie === 'opacity'" />
          </WebsiteAusschnitt>
          <div class="ads-ebene" aria-hidden="true">
            <template v-for="(m, i) in marken[a.klasse]?.liste || []" :key="i">
              <div v-if="m.polster" class="ads-polster" :style="m.polsterStil"></div>
              <div class="ads-marke" :style="m.stil"></div>
              <span class="ads-nummer" :style="m.nummerStil">{{ m.nummer }}</span>
            </template>
          </div>
        </div>
        <!-- Legende: gleiche Werte teilen eine Nummer; zugleich der Text für Screenreader -->
        <ol class="ads-legende" :aria-label="`Werte auf der Seite (${a.label})`" data-test="auf-der-seite-legende">
          <li v-for="e in marken[a.klasse]?.legende || []" :key="e.nummer">
            <span class="ads-nummer ads-nummer--legende" aria-hidden="true">{{ e.nummer }}</span>
            <span>{{ e.text }}<span v-if="e.anzahl > 1" class="ads-anzahl"> · {{ e.anzahl }}×</span></span>
          </li>
          <li v-if="!(marken[a.klasse]?.legende || []).length" class="ads-leer">Auf diesem Ausschnitt trägt kein Element diese Werte.</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useThemeStore } from '../../../stores/theme.js'
import { foundationTokens } from '../../../data/tokens.js'
import { markierungen } from '../../../utils/auf-der-seite.js'
import { useVorschauKombinationen } from '../../../composables/useVorschauKombinationen.js'
import WebsiteAusschnitt from './WebsiteAusschnitt.vue'
import WebsiteBeispiel from './WebsiteBeispiel.vue'

const props = defineProps({
  /** radius | spacing | size | border | shadow | opacity | icons | typography | focus | surfaces */
  kategorie: { type: String, required: true },
})

const HINWEIS = {
  radius: 'Eckenradien auf der Website.',
  spacing: 'Abstände auf der Website: Innenabstände (getönt) und Lücken zwischen Elementen.',
  size: 'Höhen der Bedienelemente auf der Website.',
  border: 'Rahmenbreiten auf der Website.',
  shadow: 'Schatten auf der Website.',
  opacity: 'Deckkraft auf der Website, z. B. deaktivierte Knöpfe.',
  icons: 'Icons auf der Website mit Größe und Strichstärke.',
  typography: 'Schriften auf der Website: Rolle, Größe und Stärke.',
  focus: 'Der Fokusring, wie er auf der Website bei Tastaturbedienung erscheint.',
  surfaces: 'Flächen auf der Website.',
}

const store = useThemeStore()
const { fuerModus } = useVorschauKombinationen()
const ansichten = computed(() => fuerModus(store.state.previewMode === 'dark' ? 'dark' : store.state.previewMode === 'split' ? 'split' : 'light'))

const felder = {}
const marken = reactive({})
function setzeFeld (klasse, el) { if (el) felder[klasse] = el; else delete felder[klasse] }

function messen () {
  for (const [klasse, feld] of Object.entries(felder)) {
    const seite = feld.querySelector('.wa-seite')
    if (!seite) continue
    const basis = feld.getBoundingClientRect()
    const nummern = new Map()
    const liste = markierungen(seite, props.kategorie, foundationTokens).map((m) => {
      if (!nummern.has(m.text)) nummern.set(m.text, { nummer: nummern.size + 1, text: m.text, anzahl: 0 })
      const eintrag = nummern.get(m.text); eintrag.anzahl++
      const r = m.el.getBoundingClientRect()
      const x = r.left - basis.left, y = r.top - basis.top
      const stil = { left: `${x}px`, top: `${y}px`, width: `${r.width}px`, height: `${r.height}px` }
      const polsterStil = m.polster
        ? { ...stil, borderTopWidth: `${m.polster[0]}px`, borderRightWidth: `${m.polster[1]}px`, borderBottomWidth: `${m.polster[2]}px`, borderLeftWidth: `${m.polster[3]}px` }
        : null
      return { nummer: eintrag.nummer, stil, polster: !!m.polster, polsterStil, nummerStil: { left: `${x - 8}px`, top: `${y - 8}px` } }
    })
    marken[klasse] = { liste, legende: [...nummern.values()] }
  }
}

let beobachter = null
let wartet = false
const spaeter = () => { if (wartet) return; wartet = true; requestAnimationFrame(() => { wartet = false; messen() }) }
onMounted(() => {
  nextTick(spaeter)
  document.fonts?.ready?.then(spaeter)
  beobachter = new ResizeObserver(spaeter)
  for (const f of Object.values(felder)) beobachter.observe(f)
})
onBeforeUnmount(() => beobachter?.disconnect())
// Werte des Themes ändern sich → neu messen
watch(() => [props.kategorie, store.state.previewMode, JSON.stringify(store.state.foundationOverrides), JSON.stringify(store.state.componentOverrides), JSON.stringify(store.state.themes)], () => nextTick(spaeter))
watch(ansichten, () => nextTick(() => { beobachter?.disconnect(); for (const f of Object.values(felder)) beobachter?.observe(f); spaeter() }))
</script>

<style scoped>
.ads { display: grid; gap: 12px; padding: 16px; }
.ads-hinweis { margin: 0; font-size: 12px; color: var(--cfg-text-muted); }
.ads-raster { display: grid; gap: 16px; }
.ads-raster--zwei { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.ads-feld { display: grid; gap: 6px; min-width: 0; }
.ads-titel { font-size: 11px; font-weight: 600; color: var(--cfg-text-secondary); }
.ads-buehne { position: relative; padding: 10px 0 0 10px; }
.ads-ebene { position: absolute; inset: 0; pointer-events: none; }
.ads-marke { position: absolute; outline: 1.5px solid var(--cfg-accent); outline-offset: 1px; border-radius: 2px; }
.ads-polster { position: absolute; box-sizing: border-box; border-style: solid; border-color: color-mix(in srgb, var(--cfg-accent) 18%, transparent); }
.ads-nummer {
  position: absolute; z-index: 1; display: inline-grid; place-items: center; min-width: 16px; height: 16px; padding: 0 3px;
  border-radius: 8px; background: var(--cfg-accent); color: var(--cfg-surface);
  font: 600 10px/1 var(--cfg-font-body); font-variant-numeric: tabular-nums;
}
.ads-nummer--legende { position: static; flex: none; }
.ads-legende { margin: 4px 0 0; padding: 0; list-style: none; display: grid; gap: 4px; font-size: 12px; color: var(--cfg-text); }
.ads-legende li { display: flex; align-items: center; gap: 8px; }
.ads-anzahl, .ads-leer { color: var(--cfg-text-muted); }
/* Fokusring wie der Mixin focus-ring des Design Systems (01-tools) — ohne den
   Tastaturfokus der App zu nehmen */
.ads-fokus :deep(:is(a[href], button:not([disabled]), input, select, textarea)) {
  outline: var(--fnd-focus-ring-width) var(--fnd-focus-ring-style, solid) var(--fnd-focus-ring-color);
  outline-offset: var(--fnd-focus-offset);
}
</style>
