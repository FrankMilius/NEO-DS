<template>
  <!-- Volle Breite: Inhalt direkt, wie bisher -->
  <slot v-if="!breite" />

  <!--
    Feste Breite (Roadmap V01, 19.10.2026): Das Design System reagiert auf
    die Fensterbreite (@media), nicht auf die Breite eines Containers. Ein
    schmaler div zeigt deshalb keine Handy-Darstellung. Der Inhalt wird per
    Teleport in einen eigenen Frame mit dieser Breite gerendert — Store,
    provide/inject und Theme-Variablen bleiben dieselben.
  -->
  <div v-else ref="huelle" class="br-huelle" data-test="breiten-rahmen">
    <p class="br-hinweis" data-test="breiten-hinweis">
      Fenster {{ breite }} × {{ hoehe }} px, scrollt selbst<template v-if="faktor < 1">; verkleinert auf {{ Math.round(faktor * 100) }} %</template>
    </p>
    <div class="br-flaeche" :style="{ width: breite * faktor + 'px', height: hoehe * faktor + 'px' }">
      <iframe
        ref="rahmen"
        class="br-rahmen"
        :title="`Vorschau in ${breite} px Breite`"
        :srcdoc="GERUEST"
        :style="{ width: breite + 'px', height: hoehe + 'px', transform: faktor < 1 ? `scale(${faktor})` : null }"
        @load="beimLaden"
      ></iframe>
    </div>
    <Teleport v-if="ziel" :to="ziel"><slot /></Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  /** Breite in px; null/0 = volle Breite ohne Frame */
  breite: { type: Number, default: null },
  /** Fensterhoehe des Geraets in px; der Frame scrollt selbst */
  hoehe: { type: Number, default: 800 },
})

// <base>: relative Adressen in Stilen (Schriften, Bilder) wie im Hauptdokument
const GERUEST = `<!doctype html><html><head><meta charset="utf-8"><base href="${typeof document !== 'undefined' ? document.baseURI : '/'}"></head><body><div id="br-ziel" class="br-geraet"></div></body></html>`

const huelle = ref(null)
const rahmen = ref(null)
const ziel = ref(null)
const faktor = ref(1)

let kopfBeobachter = null
let breitenBeobachter = null
/** @type {Map<Node, Node>} Original im Hauptdokument → Kopie im Frame */
const kopien = new Map()

function kopiere (knoten, doc) {
  if (kopien.has(knoten)) return
  const k = doc.importNode(knoten, true)
  kopien.set(knoten, k)
  doc.head.appendChild(k)
}

// Stile spiegeln: Vite haengt beim Nachladen von Bereichen weitere
// <link>/<style> an — der Frame bekommt sie mit.
function stileSpiegeln (doc) {
  const istStil = (n) => n.nodeName === 'STYLE' || (n.nodeName === 'LINK' && /stylesheet/i.test(n.getAttribute?.('rel') || ''))
  for (const n of document.head.childNodes) if (istStil(n)) kopiere(n, doc)
  kopfBeobachter = new MutationObserver((liste) => {
    for (const m of liste) {
      for (const n of m.addedNodes) if (istStil(n)) kopiere(n, doc)
      for (const n of m.removedNodes) { kopien.get(n)?.remove(); kopien.delete(n) }
      if (m.type === 'characterData' || m.type === 'childList') {
        const stil = m.target.nodeName === 'STYLE' ? m.target : m.target.parentNode
        if (stil?.nodeName === 'STYLE' && kopien.has(stil)) kopien.get(stil).textContent = stil.textContent
      }
    }
  })
  kopfBeobachter.observe(document.head, { childList: true, subtree: true, characterData: true })
}

function beimLaden () {
  aufraeumen()
  const doc = rahmen.value?.contentDocument
  if (!doc) return
  // Klassen und Attribute der App (z. B. data-theme) auf das Frame-Dokument
  for (const a of document.documentElement.attributes) if (a.name !== 'style') doc.documentElement.setAttribute(a.name, a.value)
  doc.body.className = document.body.className
  stileSpiegeln(doc)
  // Feste Fensterhoehe statt mitwachsendem Frame: Bauteile mit vh/svh (Hero)
  // wuerden sonst den Frame endlos verlaengern (gemessen: 33 Mio. px). Die
  // App-Stile sperren das Scrollen von html/body (Layout der App) — im Frame
  // scrollt das Dokument wie auf einem Geraet.
  const fest = doc.createElement('style')
  fest.textContent = 'html,body{height:auto!important;overflow:visible!important;margin:0!important}html{overflow-y:auto!important}#br-ziel{padding:12px 0;display:flow-root}'
  doc.head.appendChild(fest)
  ziel.value = doc.getElementById('br-ziel')
}

function passeFaktorAn () {
  const verfuegbar = huelle.value?.clientWidth || 0
  faktor.value = verfuegbar && props.breite > verfuegbar ? verfuegbar / props.breite : 1
}

watch(huelle, (el) => {
  breitenBeobachter?.disconnect()
  if (!el) return
  breitenBeobachter = new ResizeObserver(passeFaktorAn)
  breitenBeobachter.observe(el)
  nextTick(passeFaktorAn)
})
watch(() => props.breite, () => nextTick(passeFaktorAn))
// Wechsel auf volle Breite: Frame weg, Teleport-Ziel freigeben
watch(() => props.breite, (b) => { if (!b) { aufraeumen(); ziel.value = null } })

function aufraeumen () {
  kopfBeobachter?.disconnect(); kopfBeobachter = null
  kopien.clear()
}

onBeforeUnmount(() => { aufraeumen(); breitenBeobachter?.disconnect() })
</script>

<style scoped>
.br-huelle { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.br-hinweis { margin: 0; font-size: 12px; color: var(--cfg-text-secondary); }
.br-flaeche { position: relative; margin-inline: auto; overflow: hidden; }
.br-rahmen {
  display: block;
  box-sizing: content-box;
  border: 0;
  outline: 1px solid var(--cfg-border);
  outline-offset: -1px;
  border-radius: 8px;
  background: var(--cfg-bg);
  transform-origin: top left;
}
</style>
