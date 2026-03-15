<template>
  <div class="focus-editor">

    <!-- ── Ring Color ── -->
    <section class="fe-section">
      <h3 class="fe-heading">
        Ring Color
        <span class="fe-heading__count">--fnd-focus-color</span>
      </h3>
      <p class="fe-desc">
        Farbe des Focus-Rings. Kann per Theme (Light/Dark) unterschiedlich gesetzt werden.
      </p>

      <div class="fe-color-cards">
        <!-- Light -->
        <div class="fe-color-card" :class="{ 'fe-color-card--active': expandedColor === 'light' }">
          <button class="fe-color-card__header" @click="toggleColorCard('light')">
            <div class="fe-color-card__swatch" :style="{ background: resolvedColorHex('light') }"></div>
            <div class="fe-color-card__meta">
              <span class="fe-color-card__label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>
                </svg>
                Light
              </span>
              <span class="fe-color-card__value">
                <span v-if="primitiveRefForMode('light')" class="fe-color-card__ref">{{ primitiveRefForMode('light') }}</span>
                {{ resolvedColorHex('light') }}
              </span>
            </div>
            <svg
              class="fe-color-card__chevron"
              :class="{ 'fe-color-card__chevron--open': expandedColor === 'light' }"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            ><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          <div v-if="expandedColor === 'light'" class="fe-color-card__body">
            <ColorEditor
              :modelValue="resolvedColorHex('light')"
              @update:modelValue="updateFocusColor('light', $event)"
              @select-primitive="updateFocusColor('light', $event.color)"
              :tokenId="'fnd-focus-color-light'"
              :tokenPalettes="palettes"
              :themeBackground="'#ffffff'"
            />
          </div>
        </div>

        <!-- Dark -->
        <div class="fe-color-card" :class="{ 'fe-color-card--active': expandedColor === 'dark' }">
          <button class="fe-color-card__header" @click="toggleColorCard('dark')">
            <div class="fe-color-card__swatch" :style="{ background: resolvedColorHex('dark') }"></div>
            <div class="fe-color-card__meta">
              <span class="fe-color-card__label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>
                </svg>
                Dark
              </span>
              <span class="fe-color-card__value">
                <span v-if="primitiveRefForMode('dark')" class="fe-color-card__ref">{{ primitiveRefForMode('dark') }}</span>
                {{ resolvedColorHex('dark') }}
              </span>
            </div>
            <svg
              class="fe-color-card__chevron"
              :class="{ 'fe-color-card__chevron--open': expandedColor === 'dark' }"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            ><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          <div v-if="expandedColor === 'dark'" class="fe-color-card__body">
            <ColorEditor
              :modelValue="resolvedColorHex('dark')"
              @update:modelValue="updateFocusColor('dark', $event)"
              @select-primitive="updateFocusColor('dark', $event.color)"
              :tokenId="'fnd-focus-color-dark'"
              :tokenPalettes="palettes"
              :themeBackground="'#000000'"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ── Ring Width (Border Width Scale) ── -->
    <section class="fe-section">
      <h3 class="fe-heading">
        Ring Width
        <span class="fe-heading__count">--fnd-focus-width</span>
      </h3>
      <div class="fe-select-row">
        <select class="fe-select" :value="widthMode" @change="onWidthModeChange($event.target.value)">
          <option v-for="opt in borderWidthOptions" :key="opt.key" :value="opt.key">{{ opt.label }} ({{ opt.value }})</option>
          <option value="__custom__">Eigener Wert...</option>
        </select>
        <input
          v-if="widthMode === '__custom__'"
          type="text"
          class="fe-value-input"
          :value="currentValue('width')"
          @change="store.updateFoundationToken('focus', 'width', $event.target.value)"
          placeholder="z.B. 3px"
        />
      </div>
    </section>

    <!-- ── Ring Style (Border Style) ── -->
    <section class="fe-section">
      <h3 class="fe-heading">
        Ring Style
        <span class="fe-heading__count">--fnd-focus-style</span>
      </h3>
      <div class="fe-select-row">
        <select class="fe-select" :value="currentValue('style')" @change="store.updateFoundationToken('focus', 'style', $event.target.value)">
          <option v-for="opt in borderStyleOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
    </section>

    <!-- ── Offset / Inset Values ── -->
    <section class="fe-section">
      <h3 class="fe-heading">
        Offset &amp; Inset
      </h3>
      <p class="fe-desc">
        Abstandswerte fuer beide Modi. Nur der aktive Modus wird im Export verwendet.
      </p>

      <div class="fe-token-list">
        <!-- Offset -->
        <div class="fe-token-row" :class="{ 'fe-token-row--inactive': currentMode !== 'offset', 'fe-token-row--highlighted': currentMode === 'offset' }">
          <div class="fe-token-info">
            <span class="fe-token-label">
              Offset (aussen)
              <span v-if="currentMode === 'offset'" class="fe-badge fe-badge--active">aktiv</span>
              <span v-else class="fe-badge fe-badge--inactive">inaktiv</span>
            </span>
            <code class="fe-token-name">--fnd-focus-offset</code>
          </div>
          <div class="fe-token-preview">
            <div class="fe-size-bar" :style="{ width: currentValue('offset') || '2px' }"></div>
          </div>
          <input
            type="text"
            class="fe-value-input"
            :value="currentValue('offset')"
            @change="store.updateFoundationToken('focus', 'offset', $event.target.value)"
          />
        </div>

        <!-- Inset -->
        <div class="fe-token-row" :class="{ 'fe-token-row--inactive': currentMode !== 'inset', 'fe-token-row--highlighted': currentMode === 'inset' }">
          <div class="fe-token-info">
            <span class="fe-token-label">
              Inset (innen)
              <span v-if="currentMode === 'inset'" class="fe-badge fe-badge--active">aktiv</span>
              <span v-else class="fe-badge fe-badge--inactive">inaktiv</span>
            </span>
            <code class="fe-token-name">--fnd-focus-inset</code>
          </div>
          <div class="fe-token-preview">
            <div class="fe-size-bar" :style="{ width: currentValue('inset') || '2px' }"></div>
          </div>
          <input
            type="text"
            class="fe-value-input"
            :value="currentValue('inset')"
            @change="store.updateFoundationToken('focus', 'inset', $event.target.value)"
          />
        </div>
      </div>
    </section>

    <!-- ── Info ── -->
    <section class="fe-section">
      <h3 class="fe-heading">Hinweise</h3>
      <p class="fe-desc">
        <strong>Offset</strong>: Die Outline wird ausserhalb des Elements gerendert (Standard).
        Eignet sich fuer die meisten interaktiven Elemente.<br/>
        <strong>Inset</strong>: Die Outline wird innerhalb des Elements gerendert.
        Notwendig bei <code>overflow: hidden</code> Containern (z.B. Karten, Tabs).
      </p>
      <p class="fe-desc">
        Der gesetzte Modus wird als <code>--fnd-focus-ring-offset</code> exportiert und
        ist persistent pro Theme gespeichert.
      </p>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens, primitiveColors, supportingPalettes, foundationPalettes, neutralPalette, systemPalettes } from '../../data/tokens.js'
import ColorEditor from '../editors/ColorEditor.vue'

const store = useThemeStore()

const focusTokens = computed(() => foundationTokens.focus?.tokens || {})
const borderTokens = computed(() => foundationTokens.border?.tokens || {})

// ── Primitive Palettes fuer ColorEditor ──
function palettesToPicker(obj) {
  return Object.entries(obj).map(([id, pal]) => ({
    id, label: pal.label,
    shades: Object.entries(pal.shades).map(([step, color]) => ({ step, color, token: `--fnd-primitive-${id}-${step}` }))
  }))
}

const palettes = computed(() => {
  const groups = []
  for (const [id, pal] of Object.entries(primitiveColors)) {
    groups.push({
      id, label: pal.label,
      shades: Object.entries(pal.shades).map(([step, color]) => ({ step, color, token: `--fnd-primitive-${id}-${step}` }))
    })
  }
  groups.push(...palettesToPicker(supportingPalettes))
  for (const [id, pal] of Object.entries(neutralPalette)) {
    groups.push({
      id, label: pal.label,
      shades: Object.entries(pal.shades).map(([step, color]) => ({ step, color, token: `--fnd-primitive-neutral-${step}` }))
    })
  }
  groups.push(...palettesToPicker(foundationPalettes))
  groups.push(...palettesToPicker(systemPalettes))
  return groups
})

const currentMode = computed(() => store.currentFocusRingMode.value)

function currentValue(key) {
  return store.currentFoundation.value.focus?.[key] ?? focusTokens.value[key]?.value ?? ''
}

// ── Color (per light/dark) — semantic-card pattern ──
const expandedColor = ref(null)

function toggleColorCard(mode) {
  expandedColor.value = expandedColor.value === mode ? null : mode
}

function focusColorValue(mode) {
  const modeKey = `color-${mode}`
  const override = store.currentFoundation.value.focus?.[modeKey]
  if (override) return override
  return store.currentFoundation.value.focus?.color ?? focusTokens.value.color?.value ?? 'var(--fnd-color-text-primary)'
}

function resolvedColorHex(mode) {
  const val = focusColorValue(mode)
  if (val && val.startsWith('#')) return val
  return mode === 'dark' ? '#ffffff' : '#000000'
}

// Reverse-lookup: welches Primitive-Token passt zum Hex-Wert?
function primitiveRefForMode(mode) {
  const hex = resolvedColorHex(mode).toLowerCase()
  for (const group of palettes.value) {
    for (const shade of group.shades) {
      if (shade.color.toLowerCase() === hex) return shade.token
    }
  }
  return null
}

function updateFocusColor(mode, value) {
  const modeKey = `color-${mode}`
  store.updateFoundationToken('focus', modeKey, value)
  const previewMode = store.state.previewMode === 'split' ? 'light' : store.state.previewMode
  if (previewMode === mode) {
    store.updateFoundationToken('focus', 'color', value)
  }
}

// ── Border Width Options ──
const borderWidthOptions = computed(() => {
  const opts = []
  for (const [key, token] of Object.entries(borderTokens.value)) {
    if (key.startsWith('width-')) {
      opts.push({ key, label: token.label, value: token.value })
    }
  }
  return opts
})

const widthMode = computed(() => {
  const val = currentValue('width')
  const match = borderWidthOptions.value.find(o => o.value === val)
  return match ? match.key : '__custom__'
})

function onWidthModeChange(key) {
  if (key === '__custom__') return
  const opt = borderWidthOptions.value.find(o => o.key === key)
  if (opt) {
    store.updateFoundationToken('focus', 'width', opt.value)
  }
}

// ── Border Style Options ──
const borderStyleOptions = computed(() => {
  const opts = []
  for (const [key, token] of Object.entries(borderTokens.value)) {
    if (key.startsWith('style-')) {
      opts.push({ key, label: token.label, value: token.value })
    }
  }
  return opts
})
</script>

<style scoped>
.focus-editor { display: flex; flex-direction: column; gap: 24px; }

.fe-section { display: flex; flex-direction: column; gap: 12px; }

.fe-heading {
  font-size: 14px; font-weight: 700; color: var(--cfg-text); margin: 0;
  display: flex; align-items: center; gap: 8px;
}

.fe-heading__count {
  margin-left: auto; font-size: 10px; font-weight: 600;
  color: var(--cfg-text-muted);
  padding: 2px 0; font-family: monospace;
}

.fe-desc { font-size: 12px; color: var(--cfg-text-muted); margin: 0; line-height: 1.5; }
.fe-desc code { font-size: 11px; background: var(--cfg-surface-elevated); padding: 1px 4px; border-radius: 3px; }

/* ── Color Cards (semantic-token-card pattern) ── */
.fe-color-cards { display: flex; flex-direction: column; gap: 2px; }

.fe-color-card {
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  background: var(--cfg-surface);
  overflow: hidden;
  transition: border-color 0.15s;
}

.fe-color-card--active {
  border-color: var(--cfg-accent);
  box-shadow: 0 0 0 1px var(--cfg-accent);
}

.fe-color-card__header {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border: none; background: none;
  cursor: pointer; width: 100%; text-align: left;
  color: inherit; transition: background 0.1s;
}

.fe-color-card__header:hover { background: var(--cfg-surface-elevated); }

.fe-color-card__swatch {
  width: 28px; height: 28px; border-radius: 6px;
  border: 1px solid var(--cfg-border); flex-shrink: 0;
}

.fe-color-card__meta {
  display: flex; flex-direction: column; gap: 1px;
  min-width: 0; flex: 1;
}

.fe-color-card__label {
  font-size: 12px; font-weight: 600; color: var(--cfg-text);
  display: flex; align-items: center; gap: 5px;
}

.fe-color-card__value {
  font-size: 10px; font-family: monospace; color: var(--cfg-text-muted);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  display: flex; align-items: center; gap: 6px;
}

.fe-color-card__ref {
  color: var(--cfg-accent); font-weight: 600;
}

.fe-color-card__chevron {
  color: var(--cfg-text-muted); transition: transform 0.2s; flex-shrink: 0;
}

.fe-color-card__chevron--open { transform: rotate(180deg); }

.fe-color-card__body {
  padding: 12px; border-top: 1px solid var(--cfg-border);
  background: var(--cfg-surface-elevated);
}

/* ── Select Row ── */
.fe-select-row {
  display: flex; align-items: center; gap: 10px;
}

.fe-select {
  flex: 1; height: 30px; padding: 0 8px;
  border: 1px solid var(--cfg-border); border-radius: 6px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 12px; outline: none; cursor: pointer;
  transition: border-color 0.15s;
}

.fe-select:focus { border-color: var(--cfg-accent); }

/* ── Token List ── */
.fe-token-list { display: flex; flex-direction: column; gap: 2px; }

.fe-token-row {
  display: flex; align-items: center; gap: 12px;
  padding: 8px 10px; border-radius: 6px;
  transition: background 0.1s, opacity 0.2s;
}

.fe-token-row:hover { background: var(--cfg-surface-elevated); }
.fe-token-row--inactive { opacity: 0.4; }
.fe-token-row--highlighted { background: color-mix(in srgb, var(--cfg-accent) 6%, transparent); }

.fe-token-info {
  display: flex; flex-direction: column; gap: 1px;
  width: 140px; flex-shrink: 0;
}

.fe-token-label { font-size: 12px; font-weight: 600; color: var(--cfg-text); }
.fe-token-name { font-size: 10px; color: var(--cfg-text-muted); }

.fe-token-preview { flex: 1; display: flex; align-items: center; }

.fe-size-bar {
  height: 12px; background: var(--cfg-accent); opacity: 0.5;
  border-radius: 2px; min-width: 2px; max-width: 100%;
  transition: width 0.2s;
}

.fe-value-input {
  width: 80px; height: 26px; padding: 0 6px;
  border: 1px solid var(--cfg-border); border-radius: 4px;
  background: var(--cfg-surface-elevated); color: var(--cfg-text);
  font-size: 11px; font-family: monospace; outline: none;
  text-align: right; flex-shrink: 0;
  transition: border-color 0.15s;
}

.fe-value-input:focus { border-color: var(--cfg-accent); }

/* ── Badges ── */
.fe-badge {
  display: inline-block; font-size: 9px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
  padding: 1px 5px; border-radius: 3px;
  vertical-align: middle; margin-left: 6px;
}

.fe-badge--active { background: var(--cfg-accent); color: #fff; }
.fe-badge--inactive { background: var(--cfg-surface-elevated); color: var(--cfg-text-muted); }
</style>
