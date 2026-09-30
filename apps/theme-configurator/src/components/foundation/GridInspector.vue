<template>
  <div class="grid-inspector">

    <!-- Intro -->
    <p class="gi-intro">
      Das 12-Column Grid bildet das Layoutraster fuer alle Seitenstrukturen.
      Spaltenanzahl und Abstaende werden hier zentral konfiguriert und wirken sich
      auf alle <code>.o-grid</code>-Instanzen aus.
    </p>

    <!-- ═══════════════════════════════════════════════════════════════
         SEKTION 1: Grid-Struktur
         ═══════════════════════════════════════════════════════════════ -->
    <div class="gi-section" :class="{ collapsed: !structureOpen }">
      <button class="gi-section__header" @click="structureOpen = !structureOpen">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span class="gi-section__title">Grundstruktur</span>
        <span class="gi-section__count">2</span>
        <svg class="gi-section__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div v-if="structureOpen" class="gi-section__body">

        <!-- Columns -->
        <div class="gi-token-card">
          <div class="gi-token-header">
            <span class="gi-token-name">Columns</span>
            <span class="gi-level-badge gi-level--l3">L3</span>
          </div>
          <p class="gi-token-desc">
            Anzahl der Rasterspalten. Standard ist 12 (4px-Basegrid).
            Auf Mobile (&lt; 768px) wird automatisch auf 4 Spalten reduziert.
          </p>
          <div class="gi-token-control">
            <code class="gi-token-var">--nc-grid-columns</code>
            <div class="gi-input-group">
              <button class="gi-stepper-btn" @click="adjustColumns(-1)" :disabled="columnsValue <= 1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
              </button>
              <input
                type="number"
                class="gi-number-input"
                :value="columnsValue"
                min="1"
                max="24"
                @change="updateToken('nc-grid-columns', $event.target.value)"
              />
              <button class="gi-stepper-btn" @click="adjustColumns(1)" :disabled="columnsValue >= 24">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </button>
            </div>
          </div>
          <span v-if="isOverridden('nc-grid-columns')" class="gi-modified-badge">modified</span>
        </div>

        <!-- Gap (Default) -->
        <div class="gi-token-card">
          <div class="gi-token-header">
            <span class="gi-token-name">Gap</span>
            <span class="gi-level-badge gi-level--l3">L3</span>
          </div>
          <p class="gi-token-desc">
            Standard-Abstand zwischen Spalten und Zeilen. Fluid via <code>clamp()</code> --
            skaliert responsiv zwischen min und max Wert je nach Viewport-Breite.
          </p>
          <div class="gi-token-control">
            <code class="gi-token-var">--nc-grid-gap</code>
            <input
              type="text"
              class="gi-text-input"
              :value="getTokenValue('nc-grid-gap')"
              @change="updateToken('nc-grid-gap', $event.target.value)"
              placeholder="z.B. clamp(12px, 1.5vw, 24px)"
            />
          </div>
          <span v-if="isOverridden('nc-grid-gap')" class="gi-modified-badge">modified</span>
        </div>

      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         SEKTION 2: Abstandsvarianten
         ═══════════════════════════════════════════════════════════════ -->
    <div class="gi-section" :class="{ collapsed: !variantsOpen }">
      <button class="gi-section__header" @click="variantsOpen = !variantsOpen">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 6H3"/><path d="M21 12H3"/><path d="M21 18H3"/>
          <path d="M3 6v12"/><path d="M21 6v12"/>
        </svg>
        <span class="gi-section__title">Abstandsvarianten</span>
        <span class="gi-section__count">2</span>
        <svg class="gi-section__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div v-if="variantsOpen" class="gi-section__body">

        <p class="gi-section-intro">
          Neben dem Standard-Gap koennen mit den Modifiern <code>.o-grid--gap-sm</code>
          und <code>.o-grid--gap-lg</code> alternative Abstaende verwendet werden.
          Diese referenzieren Foundation Spacing Tokens (L2).
        </p>

        <!-- Gap Small -->
        <div class="gi-token-card">
          <div class="gi-token-header">
            <span class="gi-token-name">Gap Small</span>
            <span class="gi-level-badge gi-level--l3">L3</span>
            <span class="gi-ref-badge" title="Referenziert Foundation Token (Level 2)">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              L2
            </span>
          </div>
          <p class="gi-token-desc">
            Kompakter Abstand fuer dichte Layouts (Formulare, Dashboards).
            Anwendung: <code>.o-grid--gap-sm</code>
          </p>
          <div class="gi-token-control">
            <code class="gi-token-var">--nc-grid-gap-sm</code>
            <select
              class="gi-select"
              :value="getTokenValue('nc-grid-gap-sm')"
              @change="updateToken('nc-grid-gap-sm', $event.target.value)"
            >
              <option
                v-for="item in spacingOptions"
                :key="item.var"
                :value="item.var"
              >{{ item.px }} · {{ item.label }}</option>
            </select>
          </div>
          <span v-if="isOverridden('nc-grid-gap-sm')" class="gi-modified-badge">modified</span>
        </div>

        <!-- Gap Large -->
        <div class="gi-token-card">
          <div class="gi-token-header">
            <span class="gi-token-name">Gap Large</span>
            <span class="gi-level-badge gi-level--l3">L3</span>
            <span class="gi-ref-badge" title="Referenziert Foundation Token (Level 2)">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              L2
            </span>
          </div>
          <p class="gi-token-desc">
            Grosszuegiger Abstand fuer Content-Seiten und Marketing-Layouts.
            Anwendung: <code>.o-grid--gap-lg</code>
          </p>
          <div class="gi-token-control">
            <code class="gi-token-var">--nc-grid-gap-lg</code>
            <select
              class="gi-select"
              :value="getTokenValue('nc-grid-gap-lg')"
              @change="updateToken('nc-grid-gap-lg', $event.target.value)"
            >
              <option
                v-for="item in spacingOptions"
                :key="item.var"
                :value="item.var"
              >{{ item.px }} · {{ item.label }}</option>
            </select>
          </div>
          <span v-if="isOverridden('nc-grid-gap-lg')" class="gi-modified-badge">modified</span>
        </div>

      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         SEKTION 3: Varianten-Erklaerung (Recipe Use Case)
         ═══════════════════════════════════════════════════════════════ -->
    <div class="gi-info-box">
      <div class="gi-info-box__header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 9h.01"/><path d="M11 12h1v4h1"/><circle cx="12" cy="12" r="10"/>
        </svg>
        <span>Wann eine neue Grid-Variante per Recipe anlegen?</span>
      </div>
      <div class="gi-info-box__body">
        <p>
          Die drei vordefinierten Gap-Varianten (<code>default</code>, <code>sm</code>, <code>lg</code>)
          decken die meisten Layouts ab. Eine <strong>neue Variante ueber ein Recipe</strong> ist sinnvoll, wenn:
        </p>
        <ul>
          <li>Ein Seitentyp ein <strong>eigenes Spaltenraster</strong> benoetigt (z.B. ein 8-Column-Grid fuer ein Editorial-Layout)</li>
          <li>Ein <strong>abweichender Gap</strong> kontextgebunden sein soll (z.B. <code>.o-grid--gap-tight</code> mit 4px fuer Toolbar-Layouts)</li>
          <li>Die Variante <strong>responsiv anders brechen</strong> soll als das Standard-Grid (z.B. 6 Columns ab Tablet statt 12)</li>
        </ul>
        <p class="gi-info-example">
          <strong>Beispiel:</strong> Ein Dashboard benoetigt ein <code>.o-grid--dashboard</code> mit
          6 Columns und 16px Gap. Statt die globalen Grid-Tokens zu aendern, wird eine neue Variante
          im Recipe angelegt, die nur fuer diesen Kontext gilt -- so bleibt das Standard-Grid unangetastet.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { componentTokenGroups, foundationTokens } from '../../data/tokens.js'

const store = useThemeStore()

// ---------------------------------------------------------------------------
// Token Registry
// ---------------------------------------------------------------------------
const gridData = computed(() =>
  componentTokenGroups.find(g => g.id === 'grid') || null
)

const tokenMap = computed(() => {
  if (!gridData.value) return new Map()
  return new Map(gridData.value.tokens.map(t => [t.id, t]))
})

// ---------------------------------------------------------------------------
// Token Value Resolution
// ---------------------------------------------------------------------------
function getTokenValue(tokenId) {
  const override = store.currentComponentOverrides?.[tokenId]
  if (override !== undefined) return override
  const tok = tokenMap.value.get(tokenId)
  return tok?.default || ''
}

function isOverridden(tokenId) {
  return store.currentComponentOverrides?.[tokenId] !== undefined
}

function updateToken(tokenId, value) {
  store.updateComponentToken(tokenId, value)
}

// ---------------------------------------------------------------------------
// Columns Stepper
// ---------------------------------------------------------------------------
const columnsValue = computed(() => {
  const val = getTokenValue('nc-grid-columns')
  const n = parseInt(val, 10)
  return isNaN(n) ? 12 : n
})

function adjustColumns(delta) {
  const next = Math.max(1, Math.min(24, columnsValue.value + delta))
  updateToken('nc-grid-columns', String(next))
}

// ---------------------------------------------------------------------------
// Section Collapse
// ---------------------------------------------------------------------------
const structureOpen = ref(true)
const variantsOpen = ref(true)

// ---------------------------------------------------------------------------
// Spacing Token Options (fuer native <select>)
// ---------------------------------------------------------------------------
const spacingOptions = computed(() => {
  const spacing = foundationTokens.spacing
  if (!spacing?.tokens) return []
  return Object.entries(spacing.tokens)
    .filter(([key]) => key !== 'null')
    .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
    .map(([key, tok]) => ({
      label: `Spacing ${tok.label}`,
      var: `var(--fnd-spacing-${key})`,
      px: tok.value
    }))
})
</script>

<style scoped>
.grid-inspector {
  display: flex;
  flex-direction: column;
  gap: var(--fnd-spacing-04);
}

/* ═══════════════════════════════════════════════════════════════
   Paragraph / Intro — alle <p> nutzen paragraph-s Typografie
   ═══════════════════════════════════════════════════════════════ */

.gi-intro,
.gi-section-intro,
.gi-token-desc,
.gi-info-box__body {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  line-height: var(--fnd-typography-paragraph-s-line-height);
  letter-spacing: var(--fnd-typography-paragraph-s-letter-spacing);
  color: var(--cfg-text-muted);
  margin: 0;
}

.gi-intro code,
.gi-section-intro code,
.gi-token-desc code,
.gi-info-box__body code {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-family: var(--cfg-font-mono);
  padding: 1px var(--fnd-spacing-01);
  border-radius: var(--fnd-radius-s);
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
}

.gi-token-desc code {
  background: color-mix(in srgb, var(--cfg-text-muted) 10%, transparent);
}

.gi-info-box__body code {
  background: color-mix(in srgb, var(--cfg-text-muted) 10%, transparent);
  color: var(--cfg-text);
}

/* ═══════════════════════════════════════════════════════════════
   Section Card
   ═══════════════════════════════════════════════════════════════ */

.gi-section {
  border: 1px solid var(--cfg-border);
  border-radius: var(--fnd-radius-m);
  overflow: visible;
  transition: border-color 0.15s;
}

.gi-section:hover {
  border-color: color-mix(in srgb, var(--cfg-text-muted) 30%, transparent);
}

.gi-section__header {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-02);
  padding: var(--fnd-spacing-03);
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cfg-text-muted);
  transition: background 0.1s;
}

.gi-section__header:hover {
  background: var(--cfg-surface-elevated);
}

.gi-section__title {
  color: var(--cfg-text);
  font-size: var(--fnd-typography-paragraph-s-font-size);
}

.gi-section__count {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-semibold);
  padding: 1px var(--fnd-spacing-01);
  border-radius: var(--fnd-radius-s);
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text-muted);
  font-variant-numeric: tabular-nums;
}

.gi-section__chevron {
  margin-left: auto;
  flex-shrink: 0;
  transition: transform 0.15s ease;
  color: var(--cfg-text-muted);
}

.gi-section.collapsed .gi-section__chevron {
  transform: rotate(-90deg);
}

.gi-section__body {
  border-top: 1px solid var(--cfg-border);
  padding: var(--fnd-spacing-03);
  display: flex;
  flex-direction: column;
  gap: var(--fnd-spacing-03);
}

/* ═══════════════════════════════════════════════════════════════
   Token Card
   ═══════════════════════════════════════════════════════════════ */

.gi-token-card {
  position: relative;
  padding: var(--fnd-spacing-03);
  border-radius: var(--fnd-radius-m);
  background: var(--cfg-surface-elevated);
  display: flex;
  flex-direction: column;
  gap: var(--fnd-spacing-02);
}

.gi-token-header {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-02);
}

.gi-token-name {
  font-size: var(--fnd-typography-paragraph-m-font-size);
  font-weight: var(--fnd-font-weight-semibold);
  color: var(--cfg-text);
}

.gi-level-badge {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-bold);
  padding: 1px var(--fnd-spacing-01);
  border-radius: var(--fnd-radius-s);
  letter-spacing: 0.03em;
  flex-shrink: 0;
}

.gi-level--l3 {
  background: color-mix(in srgb, var(--cfg-accent) 12%, transparent);
  color: var(--cfg-accent);
}

.gi-ref-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-semibold);
  padding: 1px var(--fnd-spacing-01);
  border-radius: var(--fnd-radius-s);
  background: color-mix(in srgb, #8b5cf6 12%, transparent);
  color: #8b5cf6;
  flex-shrink: 0;
}

.gi-token-control {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-02);
  margin-top: 2px;
}

.gi-token-var {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-family: var(--cfg-font-mono);
  color: var(--cfg-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.gi-modified-badge {
  position: absolute;
  top: var(--fnd-spacing-03);
  right: var(--fnd-spacing-03);
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-semibold);
  padding: 1px var(--fnd-spacing-01);
  border-radius: var(--fnd-radius-s);
  background: color-mix(in srgb, var(--cfg-accent) 15%, transparent);
  color: var(--cfg-accent);
}

/* ═══════════════════════════════════════════════════════════════
   Input Controls
   ═══════════════════════════════════════════════════════════════ */

.gi-number-input {
  width: 56px;
  height: 28px;
  padding: 0 var(--fnd-spacing-02);
  border: 1px solid var(--cfg-border);
  border-radius: var(--fnd-radius-s);
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-family: var(--cfg-font-mono);
  text-align: center;
  outline: none;
  -moz-appearance: textfield;
}

.gi-number-input::-webkit-inner-spin-button,
.gi-number-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.gi-number-input:focus {
  border-color: var(--cfg-accent);
}

.gi-input-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.gi-stepper-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--cfg-border);
  border-radius: var(--fnd-radius-s);
  background: var(--cfg-surface);
  color: var(--cfg-text-muted);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.gi-stepper-btn:hover:not(:disabled) {
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text);
}

.gi-stepper-btn:disabled {
  opacity: var(--fnd-opacity-disabled);
  cursor: not-allowed;
}

.gi-text-input {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 var(--fnd-spacing-02);
  border: 1px solid var(--cfg-border);
  border-radius: var(--fnd-radius-s);
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-family: var(--cfg-font-mono);
  outline: none;
}

.gi-text-input:focus {
  border-color: var(--cfg-accent);
}

/* ═══════════════════════════════════════════════════════════════
   Native Select
   ═══════════════════════════════════════════════════════════════ */

.gi-select {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 var(--fnd-spacing-02);
  border: 1px solid var(--cfg-border);
  border-radius: var(--fnd-radius-s);
  background: var(--cfg-surface);
  color: var(--cfg-text);
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-family: var(--cfg-font-mono);
  outline: none;
  cursor: pointer;
}

.gi-select:focus {
  border-color: var(--cfg-accent);
}

/* ═══════════════════════════════════════════════════════════════
   Info Box (Recipe Explanation)
   ═══════════════════════════════════════════════════════════════ */

.gi-info-box {
  border: 1px solid var(--cfg-border);
  border-radius: var(--fnd-radius-m);
  overflow: hidden;
}

.gi-info-box__header {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-02);
  padding: var(--fnd-spacing-03);
  font-size: var(--fnd-typography-paragraph-s-font-size);
  font-weight: var(--fnd-font-weight-semibold);
  color: var(--cfg-text);
  background: var(--cfg-surface-elevated);
  border-bottom: 1px solid var(--cfg-border);
}

.gi-info-box__body {
  padding: var(--fnd-spacing-03);
}

.gi-info-box__body p,
.gi-info-box__body li {
  font-size: var(--fnd-typography-paragraph-s-font-size);
  line-height: var(--fnd-typography-paragraph-s-line-height);
  letter-spacing: var(--fnd-typography-paragraph-s-letter-spacing);
  color: var(--cfg-text-muted);
}

.gi-info-box__body p {
  margin: 0 0 var(--fnd-spacing-02);
}

.gi-info-box__body ul {
  margin: 0 0 var(--fnd-spacing-02);
  padding-left: var(--fnd-spacing-05);
}

.gi-info-box__body li {
  margin-bottom: var(--fnd-spacing-01);
}

.gi-info-box__body strong {
  color: var(--cfg-text);
  font-weight: var(--fnd-font-weight-semibold);
}

.gi-info-example {
  padding: var(--fnd-spacing-02) var(--fnd-spacing-03);
  border-radius: var(--fnd-radius-s);
  background: var(--cfg-surface-elevated);
  border-left: 3px solid var(--cfg-accent);
  margin-bottom: 0 !important;
}
</style>
