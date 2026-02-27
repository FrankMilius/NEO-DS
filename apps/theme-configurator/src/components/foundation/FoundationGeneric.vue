<template>
  <div class="foundation-generic">
    <h3 v-if="sectionLabel" class="sub-heading">{{ sectionLabel }}</h3>

    <!-- Focus Ring: Modus-Toggle (Offset / Inset) -->
    <div v-if="category === 'focus'" class="focus-mode-toggle" role="radiogroup" aria-label="Focus Ring Modus">
      <button
        :class="['toggle-btn', { active: store.currentFocusRingMode.value === 'offset' }]"
        @click="store.setFocusRingMode('offset')"
        role="radio"
        :aria-checked="store.currentFocusRingMode.value === 'offset'"
      >Offset (aussen)</button>
      <button
        :class="['toggle-btn', { active: store.currentFocusRingMode.value === 'inset' }]"
        @click="store.setFocusRingMode('inset')"
        role="radio"
        :aria-checked="store.currentFocusRingMode.value === 'inset'"
      >Inset (innen)</button>
    </div>

    <!-- Focus Ring: Live-Preview -->
    <div v-if="category === 'focus'" class="focus-preview-container">
      <div class="focus-preview-box" :style="focusPreviewStyle" tabindex="0">Fokus</div>
      <span class="focus-preview-hint">{{ store.currentFocusRingMode.value === 'offset' ? 'Outline aussen' : 'Outline innen' }}</span>
    </div>

    <div class="token-list">
      <div
        v-for="(token, key) in tokens"
        :key="key"
        class="token-row"
        :class="{ 'token-row--inactive': isFocusModeToken(key) && !isFocusModeActive(key) }"
      >
        <div class="token-info">
          <span class="token-label">
            {{ token.label }}
            <span v-if="isFocusModeToken(key) && isFocusModeActive(key)" class="badge badge--active">aktiv</span>
            <span v-else-if="isFocusModeToken(key)" class="badge badge--inactive">inaktiv</span>
          </span>
          <code class="token-name">{{ tokenName(key) }}</code>
        </div>
        <div class="token-preview">
          <!-- Radius preview -->
          <div v-if="category === 'radius'" class="preview-radius" :style="{ borderRadius: currentValue(key) }"></div>
          <!-- Spacing preview -->
          <div v-else-if="category === 'spacing'" class="preview-spacing" :style="{ width: currentValue(key) }"></div>
          <!-- Opacity preview -->
          <div v-else-if="category === 'opacity'" class="preview-opacity" :style="{ opacity: currentValue(key) }"></div>
          <!-- Z-Index preview -->
          <div v-else-if="category === 'zindex'" class="preview-zindex">
            <div class="zindex-stack">
              <div class="zindex-layer" :style="{ width: zindexWidth(token.value) + '%' }"></div>
            </div>
          </div>
          <!-- Media Ratio preview -->
          <div v-else-if="category === 'media'" class="preview-ratio">
            <div v-if="currentValue(key) === 'auto'" class="preview-value-text">auto</div>
            <div v-else class="ratio-box" :style="{ aspectRatio: currentValue(key) }"></div>
          </div>
          <!-- Motion / fallback -->
          <div v-else class="preview-value-text">{{ currentValue(key) }}</div>
        </div>
        <div class="token-value-display">
          <code>{{ currentValue(key) }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens } from '../../data/tokens.js'

const props = defineProps({
  category: { type: String, required: true },
  sectionLabel: { type: String, default: '' }
})

const store = useThemeStore()

const tokens = computed(() => {
  return foundationTokens[props.category]?.tokens || {}
})

function tokenName(key) {
  if (props.category === 'zindex') return `--fnd-z-${key}`
  if (props.category === 'media') return `--fnd-media-ratio-${key}`
  return `--fnd-${props.category}-${key}`
}

function currentValue(key) {
  return store.currentFoundation.value[props.category]?.[key] ?? tokens.value[key]?.value ?? ''
}

function zindexWidth(value) {
  // Scale z-index values to a visual width (max 20 → 100%)
  return Math.min(100, (Number(value) / 20) * 100)
}

// Focus Ring Mode: Erkennt ob Token-Key ein Modus-Token ist (offset/inset)
function isFocusModeToken(key) {
  return props.category === 'focus' && (key === 'offset' || key === 'inset')
}

// Focus Ring Mode: Prueft ob der Token zum aktuellen Modus gehoert
function isFocusModeActive(key) {
  return store.currentFocusRingMode.value === key
}

// Focus Ring: Live-Preview-Stil
const focusPreviewStyle = computed(() => {
  const mode = store.currentFocusRingMode.value
  const width = currentValue('ring-width') || '2px'
  const color = 'var(--cfg-accent)'
  if (mode === 'inset') {
    return {
      outline: `${width} solid ${color}`,
      outlineOffset: `calc(-1 * ${currentValue('inset') || '2px'})`
    }
  }
  return {
    outline: `${width} solid ${color}`,
    outlineOffset: currentValue('offset') || '2px'
  }
})
</script>

<style scoped>
.foundation-generic { display: flex; flex-direction: column; gap: 16px; }

.sub-heading { font-size: 15px; font-weight: 700; color: var(--cfg-text); margin: 0; }

.token-list { display: flex; flex-direction: column; gap: 2px; }

.token-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  transition: background 0.1s;
}

.token-row:hover { background: var(--cfg-surface-elevated); }

.token-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 180px;
  flex-shrink: 0;
}

.token-label { font-size: 13px; font-weight: 600; color: var(--cfg-text); }
.token-name { font-size: 10px; color: var(--cfg-text-muted); }

.token-preview {
  flex: 1;
  display: flex;
  align-items: center;
}

.preview-radius {
  width: 48px;
  height: 48px;
  background: var(--cfg-accent);
  opacity: 0.5;
  transition: border-radius 0.2s;
}

.preview-spacing {
  height: 12px;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
  min-width: 4px;
  max-width: 100%;
  transition: width 0.2s;
}

.preview-opacity {
  width: 48px;
  height: 48px;
  background: var(--cfg-accent);
  border-radius: 8px;
  transition: opacity 0.2s;
}

.preview-zindex {
  flex: 1;
  display: flex;
  align-items: center;
}

.zindex-stack {
  width: 100%;
  height: 12px;
  background: var(--cfg-surface-elevated);
  border-radius: 2px;
  overflow: hidden;
}

.zindex-layer {
  height: 100%;
  background: var(--cfg-accent);
  opacity: 0.6;
  border-radius: 2px;
  transition: width 0.2s;
}

.preview-ratio {
  display: flex;
  align-items: center;
}

.ratio-box {
  height: 32px;
  background: var(--cfg-accent);
  opacity: 0.5;
  border-radius: 2px;
  transition: aspect-ratio 0.2s;
}

.preview-value-text {
  font-size: 12px;
  color: var(--cfg-text-secondary);
  font-family: monospace;
}

.token-value-display {
  width: 100px;
  text-align: right;
  flex-shrink: 0;
}

.token-value-display code {
  font-size: 11px;
  color: var(--cfg-text-muted);
  background: var(--cfg-surface-elevated);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Focus Ring Mode Toggle */
.focus-mode-toggle {
  display: flex;
  gap: 0;
  border: 1px solid var(--cfg-border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.toggle-btn {
  flex: 1;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  background: var(--cfg-surface);
  color: var(--cfg-text-secondary);
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.toggle-btn:hover { background: var(--cfg-surface-elevated); }

.toggle-btn.active {
  background: var(--cfg-accent);
  color: #fff;
}

/* Focus Ring Live-Preview */
.focus-preview-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--cfg-surface-elevated);
  border-radius: 8px;
  margin-bottom: 8px;
}

.focus-preview-box {
  width: 64px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cfg-surface);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--cfg-text-secondary);
}

.focus-preview-hint {
  font-size: 12px;
  color: var(--cfg-text-muted);
}

/* Token-Row Aktiv/Inaktiv-Status */
.token-row--inactive {
  opacity: 0.45;
}

.badge {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 1px 5px;
  border-radius: 3px;
  vertical-align: middle;
  margin-left: 6px;
}

.badge--active {
  background: var(--cfg-accent);
  color: #fff;
}

.badge--inactive {
  background: var(--cfg-surface-elevated);
  color: var(--cfg-text-muted);
}
</style>
