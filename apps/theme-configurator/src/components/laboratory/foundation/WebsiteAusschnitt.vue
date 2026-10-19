<template>
  <!--
    Grundsatz „Bühne = Ausschnitt der echten Website“ (Frank, 19.10.2026):
    Markup im Slot bekommt die Theme-Klasse der Website (neo-/customer-
    light/dark-theme) und alle Werte des geöffneten Themes als CSS-Variablen
    — wie die Zellen der RecipeArena (lib/vorschau-variablen.js). Damit
    sehen HTML-Elemente und Komponenten hier aus wie auf der Website.
  -->
  <section class="wa" :aria-label="beschriftung">
    <span v-if="mitTitel" class="wa-titel">{{ beschriftung }}</span>
    <div :class="['wa-seite', themaKlasse]" :style="variablen" :data-test="`website-ausschnitt-${set}-${modus}`">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../../stores/theme.js'
import { vorschauVariablen } from '../../../lib/vorschau-variablen.js'

const props = defineProps({
  /** neo | customer — ohne Angabe das aktive Set */
  set: { type: String, default: null },
  /** light | dark */
  modus: { type: String, default: 'light' },
  /** Beschriftung über dem Ausschnitt (NEO · Hell …) */
  mitTitel: { type: Boolean, default: false },
  /** Komponenten, deren --nc-Tokens neu gebunden werden (Karte, Knopf …) */
  komponenten: { type: Array, default: () => [] },
})

const store = useThemeStore()
const aktivesSet = computed(() => props.set || store.state.activeThemeSet || 'neo')
const themaKlasse = computed(() => `${aktivesSet.value === 'neo' ? 'neo' : 'customer'}-${props.modus}-theme`)
const beschriftung = computed(() => `${aktivesSet.value === 'neo' ? 'NEO' : 'Kunde'} · ${props.modus === 'dark' ? 'Dunkel' : 'Hell'}`)
const variablen = computed(() => vorschauVariablen({
  id: props.komponenten[0] || 'website',
  modus: props.modus,
  state: store.state,
  enthaelt: props.komponenten.slice(1),
  set: aktivesSet.value,
}))
</script>

<style scoped>
.wa { display: grid; gap: 6px; min-width: 0; }
.wa-titel { font-size: 11px; font-weight: 600; color: var(--cfg-text-secondary); }
/* Wie body der Website (03-elements/_body.scss) */
.wa-seite {
  min-width: 0;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid var(--cfg-border);
  background-color: var(--fnd-color-background-base);
  color: var(--fnd-color-text-primary);
  font-family: var(--font-body);
  line-height: var(--lh-body);
  overflow-wrap: anywhere;
}
/* Globale Regeln der App (style.css: Überschriften- und Code-Schrift)
   gelten hier nicht — im Ausschnitt zählt allein das Design System. */
.wa-seite :deep(:is(h1, h2, h3, h4, h5, h6)) { font-family: var(--font-heading); }
.wa-seite :deep(:is(code, pre, kbd, samp)) { font-family: var(--font-mono); }
</style>
