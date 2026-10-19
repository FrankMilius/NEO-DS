<template>
  <!--
    Roadmap V04 (19.10.2026): feste Rollen. Die Bühne zeigt nur die Wirkung
    der aktuellen Werte, eingegeben wird im Inspector. Vorher lagen hier die
    vollständigen Editoren und im Inspector noch einmal dieselben Felder.
  -->
  <div class="fw" :data-kategorie="kategorie" data-test="foundation-wirkung">
    <p class="fw-hinweis">Vorschau der aktuellen Werte. Ändern im Inspector rechts.</p>

    <section v-for="gruppe in gruppen" :key="gruppe.titel" class="fw-gruppe">
      <h3 class="fw-titel">{{ gruppe.titel }}</h3>

      <!-- Radius -->
      <div v-if="gruppe.art === 'radius'" class="fw-raster">
        <figure v-for="e in gruppe.eintraege" :key="e.key" class="fw-karte">
          <div class="fw-radius" :style="{ borderRadius: e.wert }"></div>
          <figcaption><strong>{{ e.label }}</strong><code>{{ e.wert }}</code></figcaption>
        </figure>
      </div>

      <!-- Abstand: Balken -->
      <ul v-else-if="gruppe.art === 'abstand'" class="fw-balkenliste">
        <li v-for="e in gruppe.eintraege" :key="e.key">
          <span class="fw-name">{{ e.label }}</span>
          <span class="fw-balken" :style="{ width: `min(${e.wert}, 100%)` }"></span>
          <code>{{ e.wert }}</code>
        </li>
      </ul>

      <!-- Größe: Quadrate -->
      <div v-else-if="gruppe.art === 'groesse'" class="fw-reihe">
        <figure v-for="e in gruppe.eintraege" :key="e.key" class="fw-karte fw-karte--frei">
          <div class="fw-groesse" :style="{ width: e.wert, height: e.wert }"></div>
          <figcaption><strong>{{ e.label }}</strong><code>{{ e.wert }}</code></figcaption>
        </figure>
      </div>

      <!-- Fokusring -->
      <div v-else-if="gruppe.art === 'fokus'" class="fw-reihe">
        <figure v-for="m in ['Knopf', 'Link', 'Feld']" :key="m" class="fw-karte fw-karte--frei">
          <div :class="['fw-fokus', `fw-fokus--${m.toLowerCase()}`]" :style="fokusStil">{{ m }}</div>
          <figcaption><strong>{{ m }} mit Fokus</strong><code>{{ fokusText }}</code></figcaption>
        </figure>
      </div>

      <!-- Seitenverhältnisse -->
      <div v-else-if="gruppe.art === 'medien'" class="fw-raster">
        <figure v-for="e in gruppe.eintraege" :key="e.key" class="fw-karte">
          <div class="fw-medium" :style="{ aspectRatio: e.wert === 'auto' ? '16 / 9' : e.wert }"><span>{{ e.wert === 'auto' ? 'auto' : e.wert }}</span></div>
          <figcaption><strong>{{ e.label }}</strong></figcaption>
        </figure>
      </div>

      <!-- Deckkraft -->
      <div v-else-if="gruppe.art === 'deckkraft'" class="fw-raster">
        <figure v-for="e in gruppe.eintraege" :key="e.key" class="fw-karte">
          <div class="fw-deckkraft"><span :style="{ opacity: e.wert }"></span></div>
          <figcaption><strong>{{ e.label }}</strong><code>{{ e.wert }}</code></figcaption>
        </figure>
      </div>

      <!-- Stapelebenen -->
      <ol v-else-if="gruppe.art === 'ebenen'" class="fw-ebenen">
        <li v-for="e in gruppe.eintraege" :key="e.key"><span class="fw-name">{{ e.label }}</span><code>{{ e.wert }}</code></li>
      </ol>

      <!-- Bewegung -->
      <ul v-else-if="gruppe.art === 'bewegung'" class="fw-balkenliste">
        <li v-for="e in gruppe.eintraege" :key="e.key">
          <span class="fw-name">{{ e.label }}</span>
          <span v-if="sekunden(e.wert) !== null" class="fw-balken fw-balken--zeit" :style="{ width: `${Math.min(100, sekunden(e.wert) * 150)}%` }"></span>
          <span v-else class="fw-kurve">{{ e.wert }}</span>
          <code>{{ e.wert }}</code>
        </li>
      </ul>

      <!-- Icons -->
      <div v-else-if="gruppe.art === 'icons'" class="fw-reihe">
        <figure v-for="e in gruppe.eintraege" :key="e.key" class="fw-karte fw-karte--frei">
          <div class="fw-icons">
            <svg v-for="pfade in ICONS" :key="pfade" :width="e.px" :height="e.px" viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="e.strich" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path v-for="d in pfade.split('|')" :key="d" :d="d" />
            </svg>
          </div>
          <figcaption><strong>{{ e.label }}</strong><code>{{ e.px }} px · Strich {{ e.strich }}</code></figcaption>
        </figure>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../../stores/theme.js'
import { foundationTokens } from '../../../data/tokens.js'
import { STRICH_VORSCHAU, WEBSITE_BIBLIOTHEK } from '../../../utils/icon-strich.js'

const props = defineProps({
  /** radius | spacing | size | focus | media | opacity | icons */
  kategorie: { type: String, required: true },
})

const store = useThemeStore()

// Tabler: home, search, settings, user (Strich wird überschrieben)
const ICONS = [
  'M5 12l-2 0l9 -9l9 9l-2 0|M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7|M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6',
  'M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0|M21 21l-6 -6',
  'M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z|M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0',
  'M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0|M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2',
]
const ICON_GROESSEN = [['xs', 16], ['sm', 20], ['md', 24], ['lg', 28], ['xl', 32], ['2xl', 36]]

/** Aktuelle Werte einer Foundation-Kategorie (mit Theme-Änderungen) */
function eintraege (kat) {
  const basis = foundationTokens?.[kat]?.tokens || {}
  const aktuell = store.currentFoundation?.[kat] || {}
  return Object.entries(basis)
    .filter(([key]) => key !== 'null')
    .map(([key, t]) => ({ key, label: t.label || key, wert: String(aktuell[key] ?? t.value) }))
}
/** Eigene Tokens: { key: { label?, value } } */
function eigene (quelle) {
  return Object.entries(quelle || {}).map(([key, t]) => ({ key, label: t?.label || key, wert: String(t?.value ?? '') })).filter((e) => e.wert)
}
const inPx = (w) => { const m = String(w).match(/^(-?\d*\.?\d+)(px|rem)?$/); return m ? (m[2] === 'rem' ? +m[1] * 16 : +m[1]) : NaN }
const nachGroesse = (liste) => [...liste].sort((a, b) => (inPx(a.wert) || 0) - (inPx(b.wert) || 0))

function sekunden (wert) {
  const m = String(wert).match(/^(\d*\.?\d+)(ms|s)$/)
  return m ? (m[2] === 'ms' ? +m[1] / 1000 : +m[1]) : null
}

const fokus = computed(() => Object.fromEntries(eintraege('focus').map((e) => [e.key, e.wert])))
const fokusStil = computed(() => {
  const f = fokus.value
  const innen = store.currentFocusRingMode === 'inset'
  return {
    outline: `${f.width || '2px'} ${f.style || 'solid'} ${(store.state.previewMode === 'dark' ? f['color-dark'] : f['color-light']) || f.color || 'currentColor'}`,
    outlineOffset: innen ? `calc(-1 * ${f.inset || '2px'})` : (f.offset || '2px'),
  }
})
const fokusText = computed(() => `${fokus.value.width || '2px'} · ${store.currentFocusRingMode === 'inset' ? 'innen' : `Abstand ${fokus.value.offset || '2px'}`}`)

const gruppen = computed(() => {
  switch (props.kategorie) {
    case 'radius':
      return [{ titel: 'Eckenradien', art: 'radius', eintraege: eintraege('radius') },
        ...(eigene(store.currentCustomRadiiTokens).length ? [{ titel: 'Eigene Radien', art: 'radius', eintraege: eigene(store.currentCustomRadiiTokens) }] : [])]
    case 'spacing':
      return [{ titel: 'Abstandsskala', art: 'abstand', eintraege: nachGroesse(eintraege('spacing')) },
        ...(eigene(store.currentCustomSpacingTokens).length ? [{ titel: 'Eigene Stufen', art: 'abstand', eintraege: nachGroesse(eigene(store.currentCustomSpacingTokens)) }] : [])]
    case 'size':
      return [{ titel: 'Größen', art: 'groesse', eintraege: nachGroesse(eintraege('size')) }]
    case 'focus':
      return [{ titel: 'Fokusring', art: 'fokus', eintraege: [] }]
    case 'media':
      return [{ titel: 'Seitenverhältnisse', art: 'medien', eintraege: [...eintraege('media'), ...eigene(store.currentCustomMediaRatioTokens)] }]
    case 'opacity':
      return [
        { titel: 'Deckkraft', art: 'deckkraft', eintraege: [...eintraege('opacity'), ...eigene(store.currentCustomOpacityTokens)] },
        { titel: 'Stapelebenen (von unten nach oben)', art: 'ebenen', eintraege: [...eintraege('zindex'), ...eigene(store.currentCustomZindexTokens)].sort((a, b) => (+a.wert || 0) - (+b.wert || 0)) },
        { titel: 'Bewegung', art: 'bewegung', eintraege: [...eintraege('motion'), ...eigene(store.currentCustomMotionTokens)] },
      ]
    case 'icons': {
      // V07: Website-Bibliothek; „Standard“ zeigt, was die Website ohne Theme ungefähr zeichnet
      const lib = store.currentIconLibraries?.find((l) => l.id === WEBSITE_BIBLIOTHEK) || store.currentIconLibraries?.[0]
      const striche = store.currentIconStrokeWidths?.[lib?.id] || {}
      return [{ titel: `Icons${lib ? ` (${lib.name})` : ''}`, art: 'icons', eintraege: ICON_GROESSEN.map(([key, px]) => ({ key, label: key.toUpperCase(), px, strich: striche[key] || STRICH_VORSCHAU[key] })) }]
    }
    default:
      return []
  }
})
</script>

<style scoped>
.fw { display: grid; gap: 20px; }
.fw-hinweis { margin: 0; font-size: 12px; color: var(--cfg-text-secondary); }
.fw-gruppe { display: grid; gap: 10px; }
.fw-titel { margin: 0; font-size: 13px; font-weight: 700; color: var(--cfg-text); }
.fw-raster { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
.fw-reihe { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; }
.fw-karte { margin: 0; display: grid; gap: 6px; padding: 12px; border-radius: 8px; background: var(--cfg-surface-elevated); }
.fw-karte--frei { justify-items: center; }
.fw-karte figcaption { display: grid; gap: 2px; font-size: 11px; color: var(--cfg-text); }
.fw-karte code, .fw-balkenliste code, .fw-ebenen code { font-size: 10px; color: var(--cfg-text-secondary); }
.fw-radius { height: 72px; border: 2px solid var(--cfg-accent); background: color-mix(in srgb, var(--cfg-accent) 12%, transparent); }
.fw-balkenliste { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
.fw-balkenliste li { display: grid; grid-template-columns: 110px 1fr 70px; align-items: center; gap: 10px; font-size: 12px; color: var(--cfg-text); }
.fw-balken { display: block; height: 12px; border-radius: 3px; background: var(--cfg-accent); opacity: .7; }
.fw-kurve { font-size: 11px; color: var(--cfg-text-secondary); }
.fw-groesse { border-radius: 6px; background: color-mix(in srgb, var(--cfg-accent) 25%, transparent); border: 1px solid var(--cfg-accent); }
.fw-fokus { padding: 8px 14px; font-size: 13px; background: var(--cfg-surface); color: var(--cfg-text); border: 1px solid var(--cfg-border); }
.fw-fokus--knopf { border-radius: 8px; font-weight: 600; }
.fw-fokus--link { border: 0; background: none; text-decoration: underline; }
.fw-fokus--feld { border-radius: 4px; min-width: 140px; color: var(--cfg-text-secondary); }
.fw-medium { display: grid; place-items: center; width: 100%; border-radius: 6px; background: color-mix(in srgb, var(--cfg-accent) 15%, transparent); font-size: 11px; color: var(--cfg-text); }
.fw-deckkraft { height: 48px; border-radius: 6px; background: repeating-conic-gradient(var(--cfg-border) 0 25%, transparent 0 50%) 0 0 / 12px 12px; display: flex; }
.fw-deckkraft span { flex: 1; border-radius: 6px; background: var(--cfg-text); }
.fw-ebenen { margin: 0; padding-left: 20px; display: grid; gap: 4px; font-size: 12px; color: var(--cfg-text); }
.fw-ebenen li { display: flex; justify-content: space-between; gap: 12px; max-width: 360px; }
.fw-icons { display: flex; gap: 8px; color: var(--cfg-text); }
</style>
