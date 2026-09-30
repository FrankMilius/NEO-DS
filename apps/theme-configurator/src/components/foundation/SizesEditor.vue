<template>
  <div class="sizes-editor">
    <section class="se-section">
      <h3 class="se-heading">
        Size Scale
        <span class="se-heading__count">{{ Object.keys(scaleTokens).length }} Tokens</span>
      </h3>
      <p class="se-desc">
        Einheitliche Hoehen fuer Bedienelemente, Avatare und Icons (<code>--fnd-size-*</code>).
        Komponenten wie Button, Chip, Pagination und Search referenzieren diese Werte.
        Das Touch-Ziel ist die Untergrenze fuer alles, was man antippen kann.
      </p>

      <div class="se-token-list">
        <div v-for="(token, key) in scaleTokens" :key="key" class="se-token-row"
             :class="{ 'se-token-row--touch': key === 'touch-target' }">
          <div class="se-token-info">
            <span class="se-token-label">{{ token.label }}</span>
            <code class="se-token-name">--fnd-size-{{ key }}</code>
          </div>
          <div class="se-token-preview">
            <div class="se-size-box" :style="{ width: currentValue(key), height: currentValue(key) }"></div>
            <span class="se-px">{{ inPixel(currentValue(key)) }}</span>
          </div>
          <input
            type="text"
            class="se-value-input"
            :value="currentValue(key)"
            :aria-label="`Wert fuer --fnd-size-${key}`"
            @change="store.updateFoundationToken('size', key, $event.target.value)"
          />
        </div>
      </div>

      <p v-if="touchZuKlein" class="se-warn" role="status">
        Das Touch-Ziel liegt unter 44 px. WCAG 2.5.8 verlangt mindestens 24 px, das Design System setzt 44 px als Untergrenze.
      </p>
    </section>
  </div>
</template>

<script setup>
// Plan v2, Schritt 2.4 (30.09.2026): Groessen-Skala aus foundation.size.
// Die Werte kommen ueber foundation._configurator.size aus der Quelle
// (scripts/foundation-aus-quelle.cjs), nicht aus einer eigenen Liste.
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens } from '../../data/tokens.js'

const store = useThemeStore()
const scaleTokens = computed(() => foundationTokens.size?.tokens || {})

function currentValue(key) {
  return store.currentFoundation.value.size?.[key] ?? scaleTokens.value[key]?.value ?? ''
}

// rem → px bei 16 px Wurzelgroesse, nur zur Anzeige
function inPixel(wert) {
  const m = String(wert).trim().match(/^(-?\d*\.?\d+)(rem|px)$/)
  if (!m) return ''
  return `${Math.round(Number(m[1]) * (m[2] === 'rem' ? 16 : 1))} px`
}

const touchZuKlein = computed(() => {
  const px = parseInt(inPixel(currentValue('touch-target')), 10)
  return Number.isFinite(px) && px < 44
})
</script>

<style scoped>
.sizes-editor { display: flex; flex-direction: column; gap: 24px; }
.se-section { display: flex; flex-direction: column; gap: 12px; }
.se-heading {
  font-size: 14px; font-weight: 700; color: var(--cfg-text); margin: 0;
  display: flex; align-items: center; gap: 8px;
}
.se-heading__count {
  margin-left: auto; font-size: 10px; font-weight: 600;
  color: var(--cfg-text-muted); background: var(--cfg-surface-elevated);
  padding: 2px 6px; border-radius: 4px;
}
.se-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; line-height: 1.5; }
.se-token-list { display: flex; flex-direction: column; gap: 2px; }
.se-token-row { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 6px; }
.se-token-row:hover { background: var(--cfg-surface-elevated); }
.se-token-row--touch { border-top: 1px dashed var(--cfg-border); margin-top: 6px; padding-top: 14px; }
.se-token-info { display: flex; flex-direction: column; gap: 1px; width: 150px; flex-shrink: 0; }
.se-token-label { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.se-token-name { font-size: 10px; color: var(--cfg-text-muted); }
.se-token-preview { flex: 1; display: flex; align-items: center; gap: 10px; min-height: 40px; }
.se-size-box {
  max-width: 96px; max-height: 96px; border-radius: 4px;
  background: var(--cfg-accent); opacity: 0.5; transition: width 0.2s, height 0.2s;
}
.se-px { font-size: 10px; color: var(--cfg-text-muted); font-family: monospace; }
.se-value-input {
  width: 80px; height: 26px; padding: 0 6px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 11px; font-family: monospace; outline: none; text-align: right; flex-shrink: 0;
}
.se-value-input:focus { border-color: var(--cfg-accent); }
.se-warn { font-size: 12px; color: var(--cfg-danger); margin: 0; }
</style>
