<template>
  <table class="kb-tabelle" :data-test="dataTest">
    <caption class="kb-titel">{{ titel }}</caption>
    <thead>
      <tr>
        <th scope="col">Modus</th>
        <th scope="col">Vordergrund</th>
        <th scope="col">Hintergrund</th>
        <th scope="col">Kontrast</th>
        <th scope="col">Mindestens</th>
        <th scope="col"><span class="kb-sr">Korrigieren</span></th>
      </tr>
    </thead>
    <tbody>
      <!-- UX-23: Farbmuster mit Hex, Klarname, Weg zur Korrektur -->
      <tr v-for="(b, i) in befunde" :key="i">
        <td>{{ MODUS[b.modus] || b.modus }}</td>
        <td><span class="kb-farbe" :style="{ background: hex(b.vordergrund, b.modus) }" aria-hidden="true"></span><span class="kb-name">{{ label(b.vordergrund) }}</span><span class="dk-mono">{{ hex(b.vordergrund, b.modus) }}</span></td>
        <td><span class="kb-farbe" :style="{ background: hex(b.hintergrund, b.modus) }" aria-hidden="true"></span><span class="kb-name">{{ label(b.hintergrund) }}</span><span class="dk-mono">{{ hex(b.hintergrund, b.modus) }}</span></td>
        <td><span class="kb-probe" :style="{ color: hex(b.vordergrund, b.modus), background: hex(b.hintergrund, b.modus) }" aria-hidden="true">Aa</span> {{ b.verhaeltnis === null || b.verhaeltnis === undefined ? 'nicht bewertbar' : zahl(b.verhaeltnis) + ':1' }}</td>
        <td>{{ zahl(b.mindestens) }}:1</td>
        <td><button v-if="istFarbrolle(b.vordergrund)" type="button" class="dk-knopf dk-knopf--klein" :data-test="`kontrast-korrigieren-${i}`" @click="korrigieren(b)">Farbe ändern</button></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
/** Befundliste der Kontrastprüfung (Paare, Werte) — App- und Server-Ergebnis. */
import { useThemeStore } from '../../stores/theme.js'
import { semanticTokenGroups } from '../../data/tokens.js'

const emit = defineEmits(['korrigieren'])
defineProps({
  befunde: { type: Array, required: true },
  titel: { type: String, default: 'Befunde' },
  dataTest: { type: String, default: 'kontrast-befunde' }
})
const MODUS = { light: 'hell', dark: 'dunkel' }
const zahl = (n) => (n === null || n === undefined ? '–' : String(n).replace('.', ','))
const store = useThemeStore()
const TOKENS = Object.fromEntries(semanticTokenGroups.flatMap(g => g.tokens.map(t => [t.id, { ...t, gruppe: g.id }])))
const label = (id) => TOKENS[id]?.label || id
const hex = (id, modus) => store.state.themes?.[store.state.activeThemeSet]?.[modus]?.[id] || ''
const istFarbrolle = (id) => !!TOKENS[id]

/** Zur Farbrolle springen: Farben › Semantic, Kategorie, Token offen, Modus */
function korrigieren (b) {
  const t = TOKENS[b.vordergrund]
  if (!t) return
  store.state.colorActiveTab = 'semantic'
  store.state.semanticCategory = t.gruppe
  store.selectToken({ id: t.id, label: t.label })
  store.setBearbeitungsModus(b.modus === 'dark' ? 'dark' : 'light')
  if (typeof location !== 'undefined') location.hash = '#/foundation/colors'
  emit('korrigieren', t.id)
}
</script>

<style scoped src="./_drupal.css"></style>
<style scoped>
.kb-tabelle { width: 100%; border-collapse: collapse; font-size: 12px; color: var(--cfg-text); }
.kb-titel { text-align: left; font-size: 12px; font-weight: 700; padding-bottom: 6px; }
.kb-tabelle th, .kb-tabelle td { text-align: left; padding: 4px 6px; border-bottom: 1px solid var(--cfg-border); }
.kb-tabelle th { font-size: 11px; font-weight: 600; color: var(--cfg-text-secondary); }
.kb-tabelle td { vertical-align: middle; }
.kb-farbe { display: inline-block; width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--cfg-border); margin-right: 6px; vertical-align: -2px; }
.kb-name { margin-right: 6px; }
.kb-probe { display: inline-block; padding: 0 4px; border-radius: 3px; border: 1px solid var(--cfg-border); font-weight: 700; margin-right: 4px; }
.kb-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
