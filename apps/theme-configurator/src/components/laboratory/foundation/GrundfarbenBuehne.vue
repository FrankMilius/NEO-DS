<template>
  <!--
    UX-34 (19.10.2026): Bühne im Reiter „Grundfarben“. Vorher blieb sie leer —
    wer eine Palette änderte, sah nicht, was auf der Website passiert. Jetzt:
    die 11 Stufen, die die Website nutzt, bei geänderter Palette neben denen
    des NEO-Standards, und ein Website-Ausschnitt in Hell und Dunkel aus den
    Farbrollen, die beim Ändern mitziehen.
  -->
  <div class="gb" data-test="grundfarben-buehne">
    <p class="gb-hinweis">Vorschau der Markenpaletten. Ändern in den Einstellungen rechts — die Farbrollen, die auf eine Stufe zeigen, ziehen mit.</p>

    <section class="gb-gruppe" aria-labelledby="gb-paletten-titel">
      <h3 id="gb-paletten-titel" class="gb-titel">Markenpaletten auf der Website</h3>
      <div v-for="p in paletten" :key="p.id" class="gb-palette" :data-test="`grundfarben-palette-${p.id}`">
        <div class="gb-palette-kopf">
          <strong>{{ p.name }}</strong>
          <span v-if="p.geaendert" class="gb-geaendert">geändert</span>
          <span class="gb-ziel">{{ p.ziel }} <code class="gb-technik">{{ p.variable }}</code></span>
        </div>
        <ol class="gb-leiste" :aria-label="`${p.name}: 11 Stufen`">
          <li v-for="s in p.stufen" :key="s.step" class="gb-stufe" :style="{ background: s.color, color: kontrast(s.color) }" :title="`Stufe ${s.step}: ${s.color}`">
            <span>{{ s.step }}</span>
          </li>
        </ol>
        <template v-if="p.geaendert">
          <span class="gb-vergleich-titel">NEO-Standard: {{ p.neoName }}</span>
          <ol class="gb-leiste gb-leiste--neo" :aria-label="`NEO-Standard ${p.neoName}: 11 Stufen`">
            <li v-for="s in p.neoStufen" :key="s.step" class="gb-stufe" :style="{ background: s.color, color: kontrast(s.color) }" :title="`Stufe ${s.step}: ${s.color}`">
              <span>{{ s.step }}</span>
            </li>
          </ol>
        </template>
      </div>
      <p class="gb-fuss">Sekundär ist vorerst gleich Primär und wirkt auf der Website nicht.</p>
    </section>

    <section class="gb-gruppe" aria-labelledby="gb-website-titel">
      <h3 id="gb-website-titel" class="gb-titel">So sieht es auf der Website aus</h3>
      <div class="gb-paar">
        <div v-for="m in modi" :key="m.id" class="gb-seite" :data-test="`grundfarben-website-${m.id}`" :style="{ background: m.t['background-base'], color: m.t['text-primary'] }">
          <span class="gb-modus" :style="{ color: m.t['text-secondary'] }">{{ m.name }}</span>
          <span class="gb-dachzeile" :style="{ color: m.t['text-accent'] }">Aktuelles</span>
          <span class="gb-ueberschrift" :style="{ color: m.t['text-primary'] }">
            Digitale Verwaltung, <span :style="{ boxShadow: `inset 0 -0.35em 0 ${m.t['accent-underline']}` }">einfach gemacht</span>
          </span>
          <span class="gb-text" :style="{ color: m.t['text-secondary'] }">
            Fließtext mit einem <span class="gb-link" :style="{ color: m.t['text-link'] }">Link</span>
            und <span :style="{ background: m.t['selection-bg'], color: m.t['selection-color'] }">markiertem Text</span>.
          </span>
          <span class="gb-knoepfe">
            <span class="gb-knopf" :style="{ background: m.t['interactive-default'], color: m.t['text-on-interactive'] }">Mehr erfahren</span>
            <span class="gb-knopf" :style="{ background: m.t['background-accent'], color: m.t['on-accent'] }">Kontakt</span>
          </span>
          <span class="gb-karte" :style="{ background: m.t['layer-01'], borderColor: m.t['border-secondary'] }">
            <strong :style="{ color: m.t['text-primary'] }">Karte auf Fläche 01</strong>
            <span :style="{ color: m.t['text-secondary'] }">mit Rahmen und Akzentlinie</span>
            <span class="gb-linie" :style="{ background: m.t['accent-line'] }"></span>
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../../stores/theme.js'
import { primitiveColors } from '../../../data/tokens.js'
import { paletteSkala, websiteStufen, palettenName, istVorgabe, NEO_PALETTEN_NAME, PALETTEN_ZIEL } from '../../../utils/farbskala.js'

const store = useThemeStore()

const ZIEL = {
  primary: 'Flächen, Text und Knöpfe',
  accent: 'Akzentflächen, Unterstreichung, Auswahl',
}

const paletten = computed(() => ['primary', 'accent'].map((id) => {
  const basis = store.currentPrimitives?.[id] || primitiveColors[id].base
  return {
    id,
    name: palettenName(id, basis),
    neoName: NEO_PALETTEN_NAME[id],
    ziel: ZIEL[id],
    variable: `${PALETTEN_ZIEL[id].variable}-*`,
    geaendert: !istVorgabe(id, basis),
    stufen: websiteStufen(paletteSkala(id, basis)),
    neoStufen: websiteStufen(paletteSkala(id, primitiveColors[id].base)),
  }
}))

const modi = computed(() => {
  const themen = store.state.themes[store.state.activeThemeSet] || {}
  return [
    { id: 'hell', name: 'Hell', t: themen.light || {} },
    { id: 'dunkel', name: 'Dunkel', t: themen.dark || {} },
  ]
})

function kontrast (hex) {
  const h = String(hex || '').replace('#', '')
  if (h.length < 6) return '#000'
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#000' : '#fff'
}
</script>

<style scoped>
.gb { display: grid; gap: 20px; padding: 16px; }
.gb-hinweis, .gb-fuss { margin: 0; font-size: 12px; color: var(--cfg-text-muted); }
.gb-gruppe { display: grid; gap: 12px; }
.gb-titel { margin: 0; font-size: 13px; font-weight: 700; color: var(--cfg-text); }
.gb-palette { display: grid; gap: 6px; padding: 12px; border: 1px solid var(--cfg-border); border-radius: 10px; background: var(--cfg-surface); }
.gb-palette-kopf { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 10px; font-size: 13px; color: var(--cfg-text); }
.gb-ziel { font-size: 11px; color: var(--cfg-text-muted); }
.gb-technik { font-size: 10px; }
.gb-geaendert {
  padding: 1px 5px; border-radius: 3px; font-size: 9px; font-weight: 700; text-transform: uppercase;
  background: color-mix(in srgb, var(--cfg-accent) 15%, transparent); color: var(--cfg-accent);
}
.gb-vergleich-titel { font-size: 11px; color: var(--cfg-text-muted); }
.gb-leiste { display: grid; grid-template-columns: repeat(11, minmax(0, 1fr)); margin: 0; padding: 0; list-style: none; border-radius: 6px; overflow: hidden; }
.gb-leiste--neo { height: 20px; }
.gb-stufe { display: flex; align-items: flex-end; justify-content: center; min-height: 36px; padding-bottom: 3px; font-size: 9px; font-variant-numeric: tabular-nums; }
.gb-leiste--neo .gb-stufe { min-height: 20px; padding: 0; align-items: center; }
.gb-paar { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); border-radius: 10px; overflow: hidden; border: 1px solid var(--cfg-border); }
.gb-seite { display: flex; flex-direction: column; gap: 10px; padding: 18px; min-width: 0; }
.gb-modus { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
.gb-dachzeile { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
.gb-ueberschrift { font-size: 20px; font-weight: 700; line-height: 1.25; }
.gb-text { font-size: 13px; line-height: 1.5; }
.gb-link { text-decoration: underline; }
.gb-knoepfe { display: flex; flex-wrap: wrap; gap: 8px; }
.gb-knopf { padding: 7px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.gb-karte { display: grid; gap: 2px; padding: 12px; border: 1px solid; border-radius: 8px; font-size: 12px; }
.gb-linie { display: block; height: 3px; width: 40px; margin-top: 6px; border-radius: 2px; }
</style>
